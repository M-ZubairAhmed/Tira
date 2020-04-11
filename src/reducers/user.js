import actionTypes from '../constants/action-types'

const { UPDATE_USER_PROFILE_DATA, CLEAR_USER_PROFILE_DATA } = actionTypes

const initState = {
  userID: '',
  firstName: '',
  lastName: '',
  isAdmin: false,
}

export default (state = initState, action) => {
  switch (action.type) {
    case UPDATE_USER_PROFILE_DATA: {
      const {
        payload: { firstName, lastName, isAdmin, userID },
      } = action

      return { ...state, firstName, lastName, isAdmin, userID }
    }

    case CLEAR_USER_PROFILE_DATA: {
      return {
        ...state,
        firstName: '',
        lastName: '',
        isAdmin: false,
        userID: '',
      }
    }

    default:
      return state
  }
}
