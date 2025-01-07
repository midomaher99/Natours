import axios from 'axios'
import { showAlert, hideAlert } from './alert'
export const login = async (email, password) => {
    try {
        const res = await axios({
            method: 'POST',
            url: 'http://127.0.0.1:3000/api/v1/users/signin',
            data: {
                email,
                password
            }
        });
        if (res.status === 200) {
            showAlert('success', 'Logged in successfully')
            setTimeout(() => {
                hideAlert();
                window.location.assign('/');
            }, 2000)
        }
    } catch (err) {
        showAlert('error', err.response.data.message)
    }
}

