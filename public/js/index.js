/* eslint-disable no-undef */
import '@babel/polyfill'
import { login, logout } from './login'
import { displayMap } from './mapbox'
import { updateUserData } from './updateSettings'

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

const updateMeForm = document.getElementById('updateMeForm')
if (updateMeForm)
  updateMeForm.addEventListener('submit', (event) => {
    event.preventDefault()
    const email = document.getElementById('email').value
    const name = document.getElementById('name').value

    updateUserData({ email, name })
  })

const changePwdForm = document.getElementById('changePwdForm')
if (changePwdForm)
  changePwdForm.addEventListener('submit', (event) => {
    event.preventDefault()
    const currentPassword = document.getElementById('password-current').value
    const newPassword = document.getElementById('password').value
    const newPasswordConfirm = document.getElementById('password-confirm').value

    updateUserData(
      { currentPassword, newPassword, newPasswordConfirm },
      'password'
    )
  })
