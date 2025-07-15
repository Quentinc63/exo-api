class ImageLoader {
    constructor() {
        this.fileInput = document.getElementById('fileInput');
        this.imagePreview = document.getElementById('imagePreview');
        this.fileInfo = document.getElementById('fileInfo');
        this.fileName = document.getElementById('fileName');
        this.fileSize = document.getElementById('fileSize');
        this.fileType = document.getElementById('fileType');
        this.fileLastModified = document.getElementById('fileLastModified');
        this.clearBtn = document.getElementById('clearBtn');

        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        this.fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
        this.clearBtn.addEventListener('click', () => this.clearImage());
    }

    handleFileSelect(event) {
        const file = event.target.files[0];

        if (!file) {
            this.clearImage();
            return;
        }

        // Validation du type de fichier
        if (!this.isValidImageFile(file)) {
            this.showError('Veuillez sélectionner un fichier image valide.');
            return;
        }

        // Validation de la taille (optionnel - 10MB max)
        if (file.size > 10 * 1024 * 1024) {
            this.showError('Le fichier est trop volumineux (maximum 10MB).');
            return;
        }

        this.loadImageFile(file);
        this.displayFileInfo(file);
    }

    isValidImageFile(file) {
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
        return validTypes.includes(file.type);
    }

    loadImageFile(file) {
        const reader = new FileReader();

        reader.onload = (e) => {
            this.displayImage(e.target.result);
        };

        reader.onerror = () => {
            this.showError('Erreur lors de la lecture du fichier.');
        };

        reader.onprogress = (e) => {
            if (e.lengthComputable) {
                const percentLoaded = Math.round((e.loaded / e.total) * 100);
                console.log(`Chargement: ${percentLoaded}%`);
            }
        };

        reader.readAsDataURL(file);
    }

    displayImage(imageSrc) {
        this.imagePreview.src = imageSrc;
        this.imagePreview.style.display = 'block';
        this.fileInfo.style.display = 'block';
        this.clearBtn.style.display = 'inline-block';
        this.hideError();
    }

    displayFileInfo(file) {
        this.fileName.textContent = file.name;
        this.fileSize.textContent = this.formatFileSize(file.size);
        this.fileType.textContent = file.type;
        this.fileLastModified.textContent = new Date(file.lastModified).toLocaleString();
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';

        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    clearImage() {
        this.imagePreview.src = '';
        this.imagePreview.style.display = 'none';
        this.fileInfo.style.display = 'none';
        this.clearBtn.style.display = 'none';
        this.fileInput.value = '';
        this.hideError();
    }

    showError(message) {
        // Supprimer l'ancien message d'erreur s'il existe
        this.hideError();

        const errorDiv = document.createElement('div');
        errorDiv.id = 'errorMessage';
        errorDiv.textContent = message;
        errorDiv.style.color = 'red';
        errorDiv.style.marginTop = '10px';
        errorDiv.style.padding = '10px';
        errorDiv.style.border = '1px solid red';
        errorDiv.style.borderRadius = '4px';
        errorDiv.style.backgroundColor = '#ffebee';

        this.fileInput.parentNode.appendChild(errorDiv);

        // Effacer le message après 5 secondes
        setTimeout(() => this.hideError(), 5000);
    }

    hideError() {
        const errorMessage = document.getElementById('errorMessage');
        if (errorMessage) {
            errorMessage.remove();
        }
    }

    // Méthode utilitaire pour obtenir les dimensions de l'image
    getImageDimensions(file) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                resolve({
                    width: img.naturalWidth,
                    height: img.naturalHeight
                });
            };
            img.src = URL.createObjectURL(file);
        });
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    new ImageLoader();
});