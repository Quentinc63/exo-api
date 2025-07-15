const fileInput = document.getElementById('fileInput');
const imagePreview = document.getElementById('imagePreview');
const fileInfo = document.getElementById('fileInfo');
const fileName = document.getElementById('fileName');
const fileSize = document.getElementById('fileSize');
const fileType = document.getElementById('fileType');
const fileLastModified = document.getElementById('fileLastModified');
const clearBtn = document.getElementById('clearBtn');

document.addEventListener('DOMContentLoaded', init);

function init() {
    fileInput.addEventListener('change', handleFileSelect);
    clearBtn.addEventListener('click', clearImage);
}

function handleFileSelect(event) {
    const file = event.target.files[0];

    if (!file) {
        clearImage();
        return;
    }

    if (!isValidImageFile(file)) {
        return;
    }

    if (file.size > 10 * 1024 * 1024) {
        return;
    }

    loadImageFile(file);
    displayFileInfo(file);
}

function isValidImageFile(file) {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    return validTypes.includes(file.type);
}

function loadImageFile(file) {
    const reader = new FileReader();

    reader.onload = function (e) {
        displayImage(e.target.result);
    };

    reader.onerror = function () {
        console.log('Erreur lors de la lecture du fichier.');
    };

    reader.onprogress = function (e) {
        if (e.lengthComputable) {
            const percentLoaded = Math.round((e.loaded / e.total) * 100);
            console.log(`Chargement: ${percentLoaded}%`);
        }
    };

    reader.readAsDataURL(file);
}

function displayImage(imageSrc) {
    imagePreview.src = imageSrc;
    imagePreview.style.display = 'block';
    fileInfo.style.display = 'block';
    clearBtn.style.display = 'inline-block';
}

function displayFileInfo(file) {
    fileName.textContent = file.name;
    fileSize.textContent = formatFileSize(file.size);
    fileType.textContent = file.type;
    fileLastModified.textContent = new Date(file.lastModified).toLocaleString();
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function clearImage() {
    imagePreview.src = '';
    imagePreview.style.display = 'none';
    fileInfo.style.display = 'none';
    clearBtn.style.display = 'none';
    fileInput.value = '';
}

function getImageDimensions(file) {
    return new Promise(function (resolve) {
        const img = new Image();
        img.onload = function () {
            resolve({
                width: img.naturalWidth,
                height: img.naturalHeight
            });
        };
        img.src = URL.createObjectURL(file);
    });
}