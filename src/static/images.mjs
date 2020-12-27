export async function loadImages() {
    // loading bar
    const loader = document.getElementById('loader');
    loader.classList.add('loading--loading');

    const loadText = document.createElement('span');
    loadText.innerText = 'Loading...';
    loadText.classList.add('loading__text');

    loader.appendChild(loadText);

    await fetch('http://localhost:3000/api/image-metadata')
        .then(response => response.json())
        .then(data => {
            // Add images to container
            const imageContainer = document.getElementById('images');
            imageContainer.classList.add('images--hide');

            data.map(img => {
                const imgCard = document.createElement('div');
                imgCard.classList.add('images__image-card');

                const id = img.id;
                const imgDiv = document.createElement('img');
                const imgURL = `http://localhost:3000/api/image?id=${id}&res=low`

                imgDiv.src = imgURL;
                imgDiv.dataset.id = img.id;
                imgDiv.classList.add('images__image');
                imgDiv.onload = function() {
                    loader.classList.remove('loading--loading');
                    loader.classList.add('loading--complete');
                    imageContainer.classList.remove('images--hide');
                }

                imgCard.appendChild(imgDiv);
                imageContainer.append(imgCard);
            })
        })
        .catch(err => {
            console.log(err);
            loader.classList.remove('loading--loading');
            loader.classList.add('loading--error');
        })


}



