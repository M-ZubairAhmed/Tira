import actionTypes from '../constants/action-types'

const {
  UPDATE_STORY_STATUS,
  ADD_USER_STORIES,
  CLEAR_USER_STORIES,
} = actionTypes

export default (state = [], action) => {
  switch (action.type) {
    case ADD_USER_STORIES: {
      const { payload } = action

      const stories = payload.map((story) => ({
        ID: story.id,
        summary: story.summary,
        description: story.description,
        type: story.type,
        complexity: story.complexity,
        estimatedHrs: story.estimatedHrs,
        cost: story.cost,
        status: 'pending',
      }))

      return [...state, ...stories]
    }

    case UPDATE_STORY_STATUS: {
      const { payload } = action
      const { updatedID, updatedStatus } = payload
      const foundStory = state.find((story) => story.ID === updatedID)

      const updatedStory = {
        ID: foundStory.id,
        summary: foundStory.summary,
        description: foundStory.description,
        type: foundStory.type,
        complexity: foundStory.complexity,
        estimatedHrs: foundStory.estimatedHrs,
        cost: foundStory.cost,
        status: updatedStatus,
      }
      return [...state, { updatedStory }]
    }

    case CLEAR_USER_STORIES: {
      return []
    }

    default:
      return state
  }
}
