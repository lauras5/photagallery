function imageComponent(img) {
    const imgCard = document.createElement('div');
    imgCard.classList.add('images__image-card');
    imgCard.classList.add('images__image-card--hide');

    const id = img.id;
    const imgDiv = document.createElement('img');
    const imgURL = `http://localhost:3000/api/image?id=${id}&res=low`

    imgDiv.src = imgURL;
    imgDiv.classList.add('images__image');
    imgDiv.onload = function() {
        const loader = document.getElementById('loader');
        loader.classList.add('loading--complete');
        imgCard.classList.remove('images__image-card--hide')
    }

    imgCard.appendChild(imgDiv);

    return imgCard;
}

async function fetchImages() {
    const response = await fetch('http://localhost:3000/api/image-metadata');
    if (!response.ok) {
        const message = `An error has occured: ${response.status}`;
        throw new Error(message);
    } else {
        const images = await response.json();
        const imageContainer = document.getElementById('images');
        images.map(e => imageContainer.append(imageComponent(e)));
    }
}

export function loadImages() {
    const loader = document.getElementById('loader');
    const loadText = document.createElement('span');
    loadText.innerText = 'Loading...';
    loadText.classList.add('loading__text');

    loader.appendChild(loadText);

    fetchImages().catch(e => { console.log(e) });
}




