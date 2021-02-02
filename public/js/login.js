/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */

import { showAlert } from './alert'

export const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/login',
      data: {
        email,
        password,
      },
    })
    if (res.status === 200) {
      showAlert('success', 'Login successful')
      window.setTimeout(() => {
        location.assign('/')
      }, 1000)
    }
  } catch (error) {
    console.log(error.response)
    showAlert('error', error.response.data.message)
  }
}

export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: '/api/v1/users/logout',
    })
    if (res.status === 200) location.reload(true)
  } catch (error) {
    showAlert('error', 'Try again')
  }
}
