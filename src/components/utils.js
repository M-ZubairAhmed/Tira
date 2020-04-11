export const getUserProfileFromLocal = () => {
  const token = localStorage.getItem('user-auth-token')
  const firstName = localStorage.getItem('user-first-name')
  const lastName = localStorage.getItem('user-last-name')
  const isAdmin = localStorage.getItem('user-is-admin')

  return {
    token,
    firstName,
    lastName,
    isAdmin,
  }
}

export const setUserProfileToLocal = (firstName, lastName, isAdmin, token) => {
  localStorage.setItem('user-first-name', firstName)
  localStorage.setItem('user-last-name', lastName)
  localStorage.setItem('user-is-admin', isAdmin)
  localStorage.setItem('user-auth-token', token)

  return
}
