document.addEventListener('DOMContentLoaded', () => {
    const textInput = document.getElementById('textInput');
    const copyInputBtn = document.getElementById('copyInputBtn');
    const textDiv = document.getElementById('textDiv');
    const copyDivBtn = document.getElementById('copyDivBtn');
    const copyPredefinedBtn = document.getElementById('copyPredefinedBtn');

    const predefinedText = "Ceci est un message prédéfini copié !";

    copyInputBtn.addEventListener('click', () => {
        const text = textInput.value.trim();
        if (text) copyToClipboard(text);
    });

    copyDivBtn.addEventListener('click', () => {
        const text = textDiv.textContent.trim();
        if (text) copyToClipboard(text);
    });

    copyPredefinedBtn.addEventListener('click', () => {
        copyToClipboard(predefinedText);
    });

    async function copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            console.log(`Copié : ${text}`);
        } catch (err) {
            console.error("Erreur de copie", err);
        }
    }
});
