import { combineReducers } from 'redux'

import user from './user'
import stories from './stories'

export default combineReducers({
  user,
  stories,
})
