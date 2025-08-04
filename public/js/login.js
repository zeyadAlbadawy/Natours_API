import { showAlert } from './alerts';
import axios from 'axios';

export const logout = async () => {
  try {
    console.log('swhu');

    const res = await axios.get('http://127.0.0.1:3000/api/v1/users/logout');
    if (res.data.status === 'success') {
      location.reload(true);
      showAlert('success', 'Logged Out Successful');
    }
  } catch (err) {
    console.log(err);
    showAlert('error', 'Can not log out user');
  }
};
export const loginUser = async (email, password) => {
  try {
    const res = await axios.post('http://127.0.0.1:3000/api/v1/users/login', {
      email,
      password,
    });
    if (res.data.status === 'success')
      showAlert('success', 'Logged in Successful');
    window.setTimeout(() => {
      location.assign('/');
    }, 1500);
  } catch (err) {
    showAlert('error', err);
  }
};
