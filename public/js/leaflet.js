document.addEventListener('DOMContentLoaded', function () {
  const locations = JSON.parse(
    document.getElementById('map').dataset.locations,
  );

  const map = L.map('map', { zoomControl: false });

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  const points = [];
  const markers = []; //  store marker objects

  locations.forEach((loc) => {
    const coords = [loc.coordinates[1], loc.coordinates[0]];
    points.push(coords);

    const marker = L.marker(coords)
      .addTo(map)
      .bindPopup(`<p>Day ${loc.day}: ${loc.description}</p>`, {
        autoClose: false,
        closeOnClick: false,
      });

    markers.push(marker);
  });

  const bounds = L.latLngBounds(points).pad(0.4);
  map.fitBounds(bounds);

  // 👉 Open popups AFTER map has fit bounds
  markers.forEach((marker) => marker.openPopup());

  // Optional: Enable scroll zoom if desired
  map.scrollWheelZoom.disable();
});
