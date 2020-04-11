import actionTypes from '../constants/action-types'

const { UPDATE_PAGE_TITLE } = actionTypes

const initState = {
  pageTitle: '',
  breadcrumbs: {},
}

export default (state = initState, action) => {
  switch (action.type) {
    case UPDATE_PAGE_TITLE:
      return { ...state, pageTitle: action.payload.pageTitle }

    default:
      return state
  }
}
