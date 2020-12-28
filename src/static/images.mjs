function imageComponent(img) {
    const imgCard = document.createElement('div');
    imgCard.classList.add('images__image-card');
    imgCard.classList.add('images__image-card--hide');

    const id = img.id;
    const imgDiv = document.createElement('img');

    imgDiv.src = `/api/image?id=${id}&res=low`;
    imgDiv.classList.add('images__image');
    imgDiv.onload = function() {
        imgCard.classList.remove('images__image-card--hide')
    }

    imgCard.appendChild(imgDiv);

    return imgCard;
}

async function fetchImages() {
    const response = await fetch('/api/image-metadata');
    if (!response.ok) {
        const message = `An error has occurred: ${response.status}`;
        throw new Error(message);
    } else {
        const images = await response.json();
        const imageContainer = document.getElementById('images');
        const fragment = new DocumentFragment();
        images.map(e => fragment.appendChild(imageComponent(e)));

        imageContainer.append(fragment);
    }
}

export function loadLowImages() {
    try {
        fetchImages();
    } catch(e) {
        console.log(e)
    }
}




