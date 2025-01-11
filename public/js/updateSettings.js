import axios from 'axios'
import { showAlert, hideAlert } from './alert'
//type can be password or data
export const updateSettings = async (data, type) => {
    try {
        const url = type === 'data' ? `http://127.0.0.1:3000/api/v1/users/me` : 'http://127.0.0.1:3000/api/v1/users/update-password';
        const res = await axios({
            method: 'PATCH',
            url,
            data
        });
        if (res.status === 200) {
            showAlert('success', 'Updated successfully')
            setTimeout(() => {
                hideAlert();
                window.location.assign('/me');
            }, 2000)
        }
    } catch (err) {
        showAlert('error', err.response.data.message)
    }
}