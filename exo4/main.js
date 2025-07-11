
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('btnLocation').addEventListener('click', getLocation);
});

let map, marker;

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, () => alert("Erreur de géolocalisation"));
    } else {
        alert("Géolocalisation non supportée.");
    }
}

function showPosition(position) {
    console.log(position)
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    document.getElementById('coords').innerText = `Latitude: ${lat}, Longitude: ${lon}`;

    if (!map) {
        map = L.map('map').setView([lat, lon], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);

        marker = L.marker([lat, lon]).addTo(map).bindPopup("t ici mon cousin").openPopup();
    } else {
        marker.setLatLng([lat, lon]);
        map.setView([lat, lon], 13);
    }
}
