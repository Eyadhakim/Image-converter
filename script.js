const fileInput = document.getElementById('fileInput');
const imageList = document.getElementById('imageList');
const formatSelect = document.getElementById('formatSelect');
const convertButton = document.getElementById('convertButton');

let images = [];

// Handle file input and display image previews
fileInput.addEventListener('change', handleFileUpload);

function handleFileUpload() {
    images = [];
    imageList.innerHTML = '';

    Array.from(fileInput.files).forEach((file) => {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const imageItem = document.createElement('div');
                imageItem.classList.add('image-item');

                const img = document.createElement('img');
                img.src = e.target.result;

                const imageName = document.createElement('span');
                imageName.classList.add('image-name');
                imageName.textContent = file.name;

                imageItem.appendChild(img);
                imageItem.appendChild(imageName);
                imageList.appendChild(imageItem);

                images.push({
                    name: file.name,
                    data: e.target.result.split(',')[1]
                });
            };
            reader.readAsDataURL(file);
        } else {
            alert("Please upload only image files.");
        }
    });
}

// Convert and save images to selected directory
convertButton.addEventListener('click', async () => {
    const format = formatSelect.value;

    if (images.length === 0) {
        alert("Please select images to convert.");
        return;
    }

    const { success, outputPaths, message } = await window.electronAPI.convertAndSaveImages(images, format);

    if (success) {
        alert(`Images have been saved successfully to the selected folder.`);
    } else {
        alert(`Error: ${message}`);
    }
});
