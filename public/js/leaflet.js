import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export const displayMap = (locations) => {
  const map = L.map('map', { zoomControl: false });

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  const points = [];
  const markers = [];

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
  markers.forEach((marker) => marker.openPopup());
  map.scrollWheelZoom.disable();
};
