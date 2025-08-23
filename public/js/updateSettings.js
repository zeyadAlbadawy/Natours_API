import axios from 'axios';
import { showAlert } from './alerts';

// update data function
export const updateData = async (name, email) => {
  try {
    const res = await axios.patch(
      'http://127.0.0.1:3000/api/v1/users/updateMe',
      {
        email,
        name,
      },
    );
    if (res.data.status === 'Success')
      showAlert('success', 'Updated Data Successful');
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const updatePassword = async (
  password,
  passwordNew,
  passwordNewConfirm,
) => {
  try {
    const res = await axios.patch(
      `http://127.0.0.1:3000/api/v1/users/updateMyPassword`,
      {
        password,
        passwordNew,
        passwordNewConfirm,
      },
    );
    if (res.data.status === 'Success')
      showAlert('success', 'Updated PASSWORD Successful');
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
