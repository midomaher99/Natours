import axios from 'axios'
import { showAlert, hideAlert } from './alert'
export const login = async (email, password) => {
    try {
        const res = await axios({
            method: 'POST',
            url: '/api/v1/users/signin',
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

export const logout = async () => {
    try {
        const res = await axios({
            method: 'get',
            url: '/api/v1/users/signout'
        });
        if (res.status === 200) {
            showAlert('success', 'Logged out successfully')
            setTimeout(() => {
                hideAlert();
                location.reload(true);
            }, 1500)
        }
    } catch (err) {
        showAlert('error', "Error please try again!")
    }
}