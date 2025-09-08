import { showAlert } from './alerts';
import axios from 'axios';

export const logout = async () => {
  try {
    const res = await axios.get('/api/v1/users/logout');
    if (res.data.status === 'success') {
      location.reload(true);
      showAlert('success', 'Logged Out Successful');
    }
  } catch (err) {
    showAlert('error', 'Can not log out user');
  }
};
export const loginUser = async (email, password) => {
  try {
    const res = await axios.post('/api/v1/users/login', {
      email,
      password,
    });
    console.log(res.data.status);
    if (res.data.status === 'Success')
      showAlert('success', 'Logged in Successful');
    window.setTimeout(() => {
      location.assign('/');
    }, 1500);
  } catch (err) {
    showAlert('error', err);
  }
};

export const signup = async (name, email, password, passwordConfirm) => {
  try {
    const res = await axios.post('/api/v1/users/signup', {
      name,
      email,
      password,
      passwordConfirm,
    });
    if (res.data.status === 'Success')
      showAlert('success', 'User Created in Successful');
    window.setTimeout(() => {
      location.assign('/');
    }, 1500);
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
