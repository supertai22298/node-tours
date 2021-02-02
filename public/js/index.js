/* eslint-disable no-undef */
import '@babel/polyfill'
import { login, logout } from './login'
import { displayMap } from './mapbox'

const loginForm = document.getElementById('loginForm')

if (loginForm)
  loginForm.addEventListener('submit', function (event) {
    event.preventDefault()

    const email = document.getElementById('email').value
    const password = document.getElementById('password').value

    login(email, password)
  })

const locations = document.getElementById('map')
if (locations) displayMap(JSON.parse(locations.dataset.locations))

const logoutBtn = document.getElementById('logoutBtn')
if (logoutBtn) logoutBtn.addEventListener('click', logout)
