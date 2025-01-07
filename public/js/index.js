import '@babel/polyfill'
import { login } from './login'

const loginForm = document.querySelector('.form');

if (loginForm) {
    loginForm.addEventListener('submit', event => {
        event.preventDefault();
        //extracting required data
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        login(email, password)
    })
}