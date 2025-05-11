// Получаем элемент ввода файла
const fileInput = document.getElementById('file');
const imagePreview = document.getElementById('image-preview');

// Слушаем событие изменения файла
fileInput.addEventListener('change', function(event) {
    // Получаем выбранный файл
    const file = event.target.files[0];
    
    // Если файл выбран
    if (file) {
        // Создаем объект FileReader
        const reader = new FileReader();
        
        // Когда файл будет загружен, отобразим изображение
        reader.onload = function(e) {
            // Вставляем изображение в блок предпросмотра
            imagePreview.innerHTML = `<img src="${e.target.result}" alt="Image Preview">`;
            
            // Показываем блок предпросмотра
            imagePreview.style.display = 'block';
        };
        
        // Читаем файл как Data URL для отображения изображения
        reader.readAsDataURL(file);
    }
});
