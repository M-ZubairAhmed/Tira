import actionTypes from '../constants/action-types'

const {
  UPDATE_USER_STORIES,
  ADD_USER_STORIES,
  CLEAR_USER_STORIES,
} = actionTypes

export const addUserStories = (stories) => ({
  type: ADD_USER_STORIES,
  payload: stories,
})

export const updateUserStory = (story) => ({
  type: UPDATE_USER_STORIES,
  payload: story,
})

export const clearUserStories = () => ({
  type: CLEAR_USER_STORIES,
})
