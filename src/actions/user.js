import actionTypes from '../constants/action-types'

const { UPDATE_USER_PROFILE_DATA, CLEAR_USER_PROFILE_DATA } = actionTypes

export const updateUserProfileData = (
  userID,
  firstName,
  lastName,
  isAdmin,
) => ({
  type: UPDATE_USER_PROFILE_DATA,
  payload: {
    userID,
    firstName,
    lastName,
    isAdmin,
  },
})

export const clearUserProfileData = () => ({
  type: CLEAR_USER_PROFILE_DATA,
  payload: '',
})
