import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { loginUser, logout } from './login';
import { displayMap } from './leaflet';
import { updateData, updatePassword } from './updateSettings';

const mapSelect = document.getElementById('map');
const logOutBtn = document.querySelector('.nav__el--logout');
const updateDataForm = document.querySelector('.form-user-data');
const passwordForm = document.querySelector('.form-user-password');
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

const form = document.querySelector('.form--login');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email')?.value;
    const password = document.getElementById('password')?.value;
    loginUser(email, password);
  });
}

// Update name and email
if (updateDataForm) {
  updateDataForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('name')?.value);
    form.append('email', document.getElementById('email')?.value);
    form.append('photo', document.getElementById('photo').files[0]); // select the new image from the input form
    await updateData(form);
  });
}

// Update user password
if (passwordForm) {
  passwordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const password = document.getElementById('password').value;
    const passwordCurrent = document.getElementById('password-current').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    await updatePassword(passwordCurrent, password, passwordConfirm);
    document.getElementById('password').value = '';
    document.getElementById('password-current').value = '';
    document.getElementById('password-confirm').value = '';
  });
}
