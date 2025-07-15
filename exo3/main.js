const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const captureButton = document.getElementById('capture');
const downloadButton = document.getElementById('download');
const filterSelect = document.getElementById('filter');

navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        video.srcObject = stream;
    })
    .catch(error => {
        console.error(error);
    });

captureButton.addEventListener('click', () => {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const selectedFilter = filterSelect.value;
    context.filter = getCanvasFilter(selectedFilter);

    context.drawImage(video, 0, 0, canvas.width, canvas.height);
});

downloadButton.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'photo.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
});

function getCanvasFilter(filterName) {
    switch (filterName) {
        case 'grayscale': return 'grayscale(1)';
        case 'sepia': return 'sepia(1)';
        case 'invert': return 'invert(1)';
        default: return 'none';
    }
}
