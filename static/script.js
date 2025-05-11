function incrementLikes(button) {
    const photoDiv = button.closest('.photo');
    const likesSpan = button.querySelector('.like-count');
    const currentLikes = parseInt(likesSpan.textContent);
    const newLikes = currentLikes + 1;
    likesSpan.textContent = newLikes;

    const photoPath = photoDiv.getAttribute('data-path');

    fetch('/like-photo', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ path: photoPath }),
    })
    .then(response => response.json())
    .then(data => {
        if (!data.success) {
            console.error('Ошибка при сохранении лайков:', data.error);
        }
    })
    .catch(error => {
        console.error('Ошибка запроса:', error);
    });
}

function deletePhoto(button) {
    const photoDiv = button.closest('.photo');
    const photoPath = photoDiv.getAttribute('data-path');
    photoDiv.remove();

    fetch('/delete-photo', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ path: photoPath }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Фото удалено на сервере');
    })
    .catch(error => {
        console.error('Ошибка при удалении фото:', error);
    });
}

function showFullImage(image) {
    const modal = document.createElement('div');
    modal.id = 'full-image-modal';

    const img = document.createElement('img');
    img.src = image.src;
    modal.appendChild(img);

    const closeBtn = document.createElement('button');
    closeBtn.classList.add('close');
    closeBtn.textContent = '×';
    closeBtn.onclick = function () {
        modal.remove();
    };
    modal.appendChild(closeBtn);

    document.body.appendChild(modal);
    modal.style.display = 'flex';
}

function filterPhotosByCategory(category) {
    const photos = document.querySelectorAll('.photo');
    photos.forEach(function (photo) {
        const photoCategory = photo.getAttribute('data-category');
        photo.style.display = (category === 'All' || photoCategory === category) ? 'block' : 'none';
    });
}

function filterPhotosByView(view) {
    const photos = document.querySelectorAll('.photo');
    photos.forEach(function (photo) {
        const photoView = photo.getAttribute('data-view');
        photo.style.display = (view === 'All' || photoView === view) ? 'block' : 'none';
    });
}

document.querySelectorAll('#categories .dropdown-menu a').forEach(item => {
    item.addEventListener('click', () => {
        filterPhotosByCategory(item.getAttribute('data-category'));
    });
});

document.querySelectorAll('#view .dropdown-menu a').forEach(item => {
    item.addEventListener('click', () => {
        filterPhotosByView(item.getAttribute('data-view'));
    });
});

document.getElementById('file').addEventListener('change', function () {
    const preview = document.getElementById('image-preview-path');
    const file = this.files[0];
    preview.textContent = file ? "Selected file: " + file.name : "";
});
