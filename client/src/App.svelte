<script>
    import {
        onMount
    } from 'svelte';

    async function fetchImages() {
        const response = await fetch('/api/image-metadata');
        if (!response.ok) {
            const message = `An error has occurred: ${response.status}`;
            throw new Error(message);
        } else {
            return await response.json();
        }
		}
		
		function onload(e) {
			e.parentNode.classList.remove('images__image-card--hide');
		}

    let images = [];

    onMount(async () => {
				images = await fetchImages();
		});

</script>

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
        cursor: pointer;
    }

    .images__image {
        border-radius: 0.5rem;
    }
</style>

<div class="images">
	{#each images as {id}}
		<div class='images__image-card images__image-card--hide'>
			<img use:onload class="images__image" src="/api/image?id={id}&res=low">
		</div>
	{/each}
</div>
