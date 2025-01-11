import { login, logout } from './login'
import { updateSettings } from './updateSettings';

const loginForm = document.querySelector('.form--login');
const logoutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const passwordChangeForm = document.querySelector('.form-user-settings');

if (loginForm) {
    loginForm.addEventListener('submit', event => {
        event.preventDefault();
        //extracting required data
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        login(email, password)
    })
}
if (userDataForm) {
    userDataForm.addEventListener('submit', async event => {
        event.preventDefault();
        //extracting required data
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        await updateSettings({ name, email }, 'data')
    })
}
if (passwordChangeForm) {
    passwordChangeForm.addEventListener('submit', async event => {
        event.preventDefault();
        //extracting required data
        const oldPassword = document.getElementById('password-current').value;
        const newPassword = document.getElementById('password').value;
        const passwordConfirm = document.getElementById('password-confirm').value;
        await updateSettings({ oldPassword, newPassword, passwordConfirm }, 'password')
    })
}
if (logoutBtn) {
    logoutBtn.addEventListener('click', logout)
}
