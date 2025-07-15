class ClipboardManager {
    constructor() {
        this.textInput = document.getElementById('textInput');
        this.copyInputBtn = document.getElementById('copyInputBtn');
        this.textDiv = document.getElementById('textDiv');
        this.copyDivBtn = document.getElementById('copyDivBtn');
        this.copyPredefinedBtn = document.getElementById('copyPredefinedBtn');
        this.notification = document.getElementById('notification');
        this.apiStatus = document.getElementById('apiStatus');

        this.predefinedText = "Ceci est un message prédéfini copié via la Clipboard API !";

        this.init();
    }

    init() {
        this.checkClipboardSupport();
        this.bindEvents();
    }

    checkClipboardSupport() {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            this.apiStatus.textContent = "✅ Supportée";
            this.apiStatus.style.color = "green";
        } else {
            this.apiStatus.textContent = "❌ Non supportée";
            this.apiStatus.style.color = "red";
            this.showNotification("L'API Clipboard n'est pas supportée par votre navigateur", "error");
        }
    }

    bindEvents() {
        this.copyInputBtn.addEventListener('click', () => this.copyFromInput());
        this.copyDivBtn.addEventListener('click', () => this.copyFromDiv());
        this.copyPredefinedBtn.addEventListener('click', () => this.copyPredefinedText());

        // Événement pour réactiver les boutons après un délai
        this.textInput.addEventListener('input', () => this.resetButtonState(this.copyInputBtn));
    }

    async copyFromInput() {
        const text = this.textInput.value.trim();

        if (!text) {
            this.showNotification("Le champ est vide !", "error");
            return;
        }

        await this.copyToClipboard(text, this.copyInputBtn);
    }

    async copyFromDiv() {
        const text = this.textDiv.textContent.trim();
        await this.copyToClipboard(text, this.copyDivBtn);
    }

    async copyPredefinedText() {
        await this.copyToClipboard(this.predefinedText, this.copyPredefinedBtn);
    }

    async copyToClipboard(text, button) {
        try {
            // Désactiver le bouton temporairement
            this.disableButton(button);

            // Copier le texte
            await navigator.clipboard.writeText(text);

            // Afficher le message de succès
            this.showNotification(`✅ Texte copié : "${this.truncateText(text)}"`, "success");

            // Réactiver le bouton après 2 secondes
            setTimeout(() => this.enableButton(button), 2000);

        } catch (error) {
            console.error('Erreur lors de la copie:', error);

            // Fallback pour les navigateurs non supportés
            this.fallbackCopy(text);
            this.enableButton(button);
        }
    }

    fallbackCopy(text) {
        // Méthode de fallback pour les navigateurs plus anciens
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';

        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            const successful = document.execCommand('copy');
            if (successful) {
                this.showNotification(`✅ Texte copié (fallback) : "${this.truncateText(text)}"`, "success");
            } else {
                this.showNotification("❌ Impossible de copier le texte", "error");
            }
        } catch (error) {
            this.showNotification("❌ Erreur lors de la copie", "error");
        }

        document.body.removeChild(textArea);
    }

    disableButton(button) {
        button.disabled = true;
        button.textContent = "Copié !";
        button.style.opacity = "0.6";
    }

    enableButton(button) {
        button.disabled = false;
        button.style.opacity = "1";

        // Remettre le texte original du bouton
        if (button === this.copyInputBtn) {
            button.textContent = "Copier";
        } else if (button === this.copyDivBtn) {
            button.textContent = "Copier le texte du div";
        } else if (button === this.copyPredefinedBtn) {
            button.textContent = "Copier un message prédéfini";
        }
    }

    resetButtonState(button) {
        if (button.disabled) {
            this.enableButton(button);
        }
    }

    showNotification(message, type = "info") {
        this.notification.textContent = message;
        this.notification.style.display = "block";
        this.notification.style.padding = "10px";
        this.notification.style.borderRadius = "4px";
        this.notification.style.marginTop = "15px";

        // Styles selon le type
        switch (type) {
            case "success":
                this.notification.style.backgroundColor = "#d4edda";
                this.notification.style.color = "#155724";
                this.notification.style.border = "1px solid #c3e6cb";
                break;
            case "error":
                this.notification.style.backgroundColor = "#f8d7da";
                this.notification.style.color = "#721c24";
                this.notification.style.border = "1px solid #f5c6cb";
                break;
            default:
                this.notification.style.backgroundColor = "#d1ecf1";
                this.notification.style.color = "#0c5460";
                this.notification.style.border = "1px solid #bee5eb";
        }

        // Masquer automatiquement après 3 secondes
        setTimeout(() => {
            this.notification.style.display = "none";
        }, 3000);
    }

    truncateText(text, maxLength = 50) {
        if (text.length <= maxLength) {
            return text;
        }
        return text.substring(0, maxLength) + "...";
    }

    // Méthode utilitaire pour lire le contenu du clipboard (bonus)
    async readFromClipboard() {
        try {
            if (navigator.clipboard && navigator.clipboard.readText) {
                const text = await navigator.clipboard.readText();
                return text;
            }
        } catch (error) {
            console.error('Erreur lors de la lecture du clipboard:', error);
        }
        return null;
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    new ClipboardManager();
});