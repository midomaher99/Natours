import '@babel/polyfill'
import { login, logout } from './login'

const loginForm = document.querySelector('.form');
const logoutBtn = document.querySelector('.nav__el--logout');

if (loginForm) {
    loginForm.addEventListener('submit', event => {
        event.preventDefault();
        //extracting required data
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        login(email, password)
    })
}

if (logoutBtn) {
    logoutBtn.addEventListener('click', logout)
}
