import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { loginUser, logout } from './login';
import { displayMap } from './leaflet';

const mapSelect = document.getElementById('map');
const logOutBtn = document.querySelector('.nav__el--logout');
if (logOutBtn) {
  logOutBtn.addEventListener('click', (e) => {
    e.preventDefault();
    logout();
  });
}
if (mapSelect) {
  const locations = JSON.parse(mapSelect.dataset.locations);
  displayMap(locations);
}

const form = document.querySelector('.form');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email')?.value;
    const password = document.getElementById('password')?.value;
    loginUser(email, password);
  });
}
