export async function loadImages() {
    // loading bar
    const loadbar = document.getElementById('loader');
    loadbar.classList.add('loading--loading');

    const loadText = document.createElement('span');
    loadText.innerText = 'Loading...';
    loadText.classList.add('loading__text');

    loadbar.appendChild(loadText);

    // component creation
    function imageComponent(img) {
        const imgCard = document.createElement('div');
        imgCard.classList.add('images__image-card');

        const imgDiv = document.createElement('img');
        const id = img.id;

        const imgURL = `http://localhost:3000/api/image?id=${id}&res=low`
        imgDiv.src = imgURL;
        imgDiv.dataset.id = img.id;

        imgDiv.classList.add('images__image');
        imgCard.appendChild(imgDiv);

        return imgCard;
    }

    const response = await fetch('http://localhost:3000/api/image-metadata')
        .then(response => response.json())
        .then(data => {
            // Add images to container
            const imageContainer = document.getElementById('images');
            data.map(e => imageContainer.append(imageComponent(e)));

            loadbar.classList.remove('loading--loading');
            loadbar.classList.add('loading--complete');
        })
        .catch(err => {
            console.log(err);
        })
}



