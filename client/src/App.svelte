<script>
    import {
        onMount
    } from 'svelte';

    async function fetchLowImages(pageNum) {
        const response = await fetch(`/api/image-metadata?page=${pageNum}`);
        if (!response.ok) {
            const message = `An error has occurred: ${response.status}`;
            throw new Error(message);
        } else {
            return await response.json();
        }
    }

    function handleImageLoad() {
        this.parentNode.classList.remove('images__image-card--hide');
    }

    let images = [];
    let page = 0;
    let disabled = false;
    let innerText = 'Load More Images';

    async function handleClick() {
        page++;
        const fetchedImages = await fetchLowImages(page);
        if (fetchedImages.length > 0) {
            images = images.concat(fetchedImages);
        } else {
            disabled = true;
            innerText = 'No More Images to Load'
        }
    }

    onMount(async () => {
        images = await fetchLowImages(page);
    });

</script>

<div class="images">
    {#each images as {id}}
        <div class='images__image-card images__image-card--hide'>
            <img on:load={handleImageLoad} class="images__image" src="/api/image?id={id}&res=low">
        </div>
    {/each}
</div>
<button class="load-low-images-btn" on:click={handleClick} {disabled}>{innerText.toUpperCase()}</button>

<style>
    .images {
        align-items: center;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        margin-top: 5rem;
        user-select: none;
    }

    .images__image-card--hide {
        display: none;
    }

    .images__image-card {
        border: 0.25rem solid #F0F0F3;
        box-shadow: -10px -10px 30px 0 #FFFFFF, 10px 10px 30px 0 #AEAEC0;
        margin: 0.5rem;
        padding: 0.5rem;
        border-radius: 0.5rem;
        background: #F0F0F3;
    }

    .images__image-card:hover {
        box-shadow: -10px -10px 30px 0 #e3e3e3, 10px 10px 30px 0 #91919b;
    }

    .images__image {
        border-radius: 0.5rem;
    }

    /* low res button */
    .load-low-images-btn {
        width: 28rem;
        height: 4rem;
        border-radius: 2rem;
        border: none;
        padding: 1rem;
        box-shadow: -10px -10px 30px 0 #e3e3e3, 10px 10px 30px 0 #91919b;
        position: fixed;
        bottom: 2vw;
        right: 40vw;
        font-size: 1.5rem;
        z-index: 1;
    }
</style>