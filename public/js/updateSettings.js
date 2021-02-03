import { showAlert } from './alert'

export const updateUserData = async (data, type = null) => {
  try {
    const url =
      type === 'password'
        ? '/api/v1/users/update-password'
        : '/api/v1/users/update-me'

    const res = await axios({
      method: 'PATCH',
      url,
      data,
    })
    if (res.status === 200) {
      showAlert('success', res.data.status)
      location.reload()
    }
  } catch (error) {
    console.log(error)
    showAlert('error', error.response.data.message)
  }
}
