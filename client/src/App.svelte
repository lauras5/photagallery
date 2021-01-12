<script>
    import {
        onMount
    } from 'svelte';
    let loading = false;

    async function fetchLowImages(pageNum) {
        loading = true;
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
        loading = false;
    }

    let images = [];
    let page = 0;
    let imageLimit = 20;
    let disabled = false;
    let innerText = 'Load More Images';

    async function handleClick() {
        loading = true;
        page++;
        const fetchedImages = await fetchLowImages(page);

        if (fetchedImages.length < imageLimit) {
            disabled = true;
            innerText = 'No More Images to Load'
        }
        images = images.concat(fetchedImages);
    }


    function showArticle() {
        this.lastElementChild.classList.remove('images__image-overlay--hide')
    }

    function hideArticle() {
        this.lastElementChild.classList.add('images__image-overlay--hide')
    }

    async function getModalImageTags(id) {
        const response = await fetch(`/api/image?id=${id.id}&res=low`);
        if (!response.ok) {
            const message = `An error has occurred: ${response.status}`;
            throw new Error(message);
        } else {
            return await response.json();
        }
    }

    onMount(async () => {
        images = await fetchLowImages(page);
    });

</script>

<svelte:head>
    <link rel="stylesheet" href="./flex-style-utilities.css">
</svelte:head>

<div class="images flex-row--cc flex--wrap">
    {#each images as {id}}
        <div class='images__image-card images__image-card--hide' on:mouseenter={showArticle} on:mouseleave={hideArticle} >
            <img alt="" on:load={handleImageLoad}
                 class="images__image" src="/api/image?id={id}&res=low">
            <article class='images__image-tag-overlay images__image-tag-overlay--hide'></article>
            <article class='images__image-overlay images__image-overlay--hide' data-id="{id}" on:click={getModalImageTags({id})}><i class="fa fa-tag" aria-hidden="true"></i>
            </article>
        </div>
    {/each}
</div>
{#if loading}
    <div class="loading-div">
        <span class="loading-div__text"></span>
    </div>
{/if}
<button class="load-low-images-btn" on:click={handleClick} {disabled}>{innerText}</button>

<style>
    .images {
        margin-top: 5rem;
        user-select: none;
        padding-bottom: 40px;
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
        width: 102%;
        height: 4rem;
        border: none;
        padding: 1rem;
        position: fixed;
        bottom: -7px;
        left: -7px;
        font-size: 1.5rem;
        z-index: 1;
        box-shadow: -3px -3px 15px #d2d2dc;
    }

    .images__image-overlay {
        position: relative;
        left: 43%;
        right: 0;
        bottom: 35px;
        border-bottom-left-radius: 2px;
        border-bottom-right-radius: 2px;
        z-index: 1;
        background: white;
        text-align: center;
        margin-bottom: -30px;
        width: 30px;
        height: 30px;
        border-radius: 50%;
    }

    .images__image-overlay--hide {
        display: none;
    }

    .images__image-tag-overlay {
        background-color: white;
        height: 100px;
        width: 100%;
        position: relative;
        bottom: 100px;
        margin-bottom: -100px;
    }

    .images__image-tag-overlay--hide {
        display: none;
    }

    .fa-tag {
        text-align: center;
        font-size: 25px;
        line-height: 34px;
    }

    .loading-div {
        background: #f0f0f3;
        position: fixed;
        top: 20px;
        left: 24vw;
        height: 40px;
        width: 50%;
        z-index: 5;
        border-radius: 20px;
        box-shadow: 10px 10px 16px #b9b9b9, -10px -10px 16px white;
        padding: 10px;
        text-align: center;
        line-height: 20px;
        font-size: 14px;
    }

    .loading-div__text {
        color: #000;
        font-family: arial, sans-serif;
    }

    .loading-div__text:after {
        content: 'Loading';
        animation: load 2s linear infinite;
    }

    @keyframes load {
        0% {
            content: 'Loading';
        }
        33% {
            content: 'Loading.';
        }
        67% {
            content: 'Loading..';
        }
        100% {
            content: 'Loading...';
        }
    }
</style>