import actionTypes from '../constants/action-types'

const {
  UPDATE_STORY_STATUS,
  ADD_USER_STORIES,
  CLEAR_USER_STORIES,
} = actionTypes

export const addUserStories = (stories = []) => ({
  type: ADD_USER_STORIES,
  payload: stories,
})

export const updateStoryStatus = (updatedID, updatedStatus) => ({
  type: UPDATE_STORY_STATUS,
  payload: { updatedID, updatedStatus },
})

export const clearUserStories = () => ({
  type: CLEAR_USER_STORIES,
})
