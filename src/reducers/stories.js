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
        ID: String(story.id),
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
      const foundStoryIndex = state.findIndex((story) => story.ID === updatedID)

      const updatedStory = {
        ID: String(updatedID),
        summary: state[foundStoryIndex].summary,
        description: state[foundStoryIndex].description,
        type: state[foundStoryIndex].type,
        complexity: state[foundStoryIndex].complexity,
        estimatedHrs: state[foundStoryIndex].estimatedHrs,
        cost: state[foundStoryIndex].cost,
        status: updatedStatus,
      }

      return [
        ...state.slice(0, foundStoryIndex),
        updatedStory,
        ...state.slice(foundStoryIndex + 1),
      ]
    }

    case CLEAR_USER_STORIES: {
      return []
    }

    default:
      return state
  }
}
