import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Link, Redirect } from 'react-router-dom'
import axios from 'axios'

import { updateUserProfileData, addUserStories } from '../actions'
import { getUserProfileFromLocal } from '../actions/localstorage'

class CreateStory extends React.Component {
  state = {
    isLoading: false,
    errorMessage: '',
    summary: '',
    description: '',
    type: 'enhancement',
    complexity: 'low',
    estimatedHrs: 0,
    cost: 0,
  }

  handleFormChange = (event) => {
    const {
      target: { value, name },
    } = event

    this.setState({
      [name]: value,
      errorMessage: '',
    })
  }

  handleCreateStory = async (event) => {
    event.preventDefault()
    const {
      summary,
      description,
      type,
      complexity,
      estimatedHrs,
      cost,
    } = this.state

    if (summary.length === 0 || description.length === 0) {
      this.setState({ errorMessage: 'Please enter all fields' })
    } else {
      this.setState({ isLoading: true })
      try {
        const baseURL = process.env.REACT_APP_BASE_URL
        const { token } = getUserProfileFromLocal()

        const response = await axios({
          method: 'post',
          url: `${baseURL}/stories`,
          data: {
            summary,
            description,
            type,
            complexity,
            estimatedHrs,
            cost,
          },
          headers: {
            Authorization: token,
          },
        })

        if (response.status === 201) {
          const { id } = response.data
          const story = {
            id,
            summary,
            description,
            type,
            complexity,
            estimatedHrs,
            cost,
            status: 'pending',
          }
          this.props.actions.addUserStories([story])
          this.props.history.push('/')
        }

        console.log(response)
      } catch (err) {
        let errorMessage = ''
        if (err.response) {
          errorMessage = err.response.data.error
        } else {
          errorMessage = err.message
        }

        this.setState({ errorMessage })
      } finally {
        this.setState({ isLoading: false })
      }
    }
  }

  render() {
    const {
      summary,
      description,
      estimatedHrs,
      cost,
      type,
      complexity,
      isLoading,
      errorMessage,
    } = this.state

    return (
      <>
        <h1 className="text-center my-4">Create Story</h1>
        <div className="row">
          <div className="col-md-2 offset-md-1 col-sm-2 offset-sm-5 offset-xs-5">
            <Link
              to="/"
              className="btn btn-light border border-secondary rounded-circle">
              <span className="h3">&#x21d0;</span>
            </Link>
          </div>
        </div>
        <div className="row justify-content-center p-sm-3 p-md-0 p-3">
          <div className="col-md-6 col-sm-12">
            {errorMessage && (
              <div className="alert alert-warning" role="alert">
                {errorMessage}
              </div>
            )}
            <form onSubmit={this.handleCreateStory}>
              <div className="form-group">
                <label htmlFor="summary">Summary</label>
                <input
                  id="summary"
                  type="text"
                  className="form-control"
                  placeholder="Enter brief summary of the story"
                  required
                  name="summary"
                  value={summary}
                  onChange={this.handleFormChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="Description">Description</label>
                <textarea
                  className="form-control"
                  id="Description"
                  placeholder="Explain the story in detail"
                  rows="3"
                  required
                  name="description"
                  value={description}
                  onChange={this.handleFormChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="type">Type</label>
                <select
                  className="form-control"
                  id="type"
                  value={type}
                  name="type"
                  onChange={this.handleFormChange}>
                  <option value="enhancement">Enhancement</option>
                  <option value="bugfix">Bugfix</option>
                  <option value="development">Development</option>
                  <option value="qa">Q/A</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="complex">Complexity</label>
                <select
                  className="form-control"
                  id="complex"
                  value={complexity}
                  name="complexity"
                  onChange={this.handleFormChange}>
                  <option value="low">Low</option>
                  <option value="mid">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="time">Estimated time for completion</label>
                <div className="input-group">
                  <input
                    id="time"
                    type="number"
                    className="form-control"
                    name="estimatedHrs"
                    value={estimatedHrs}
                    onChange={this.handleFormChange}
                  />
                  <div className="input-group-append">
                    <span className="input-group-text">Hours</span>
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="cost">Cost associated to it</label>
                <div className="input-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text">$</span>
                  </div>
                  <input
                    id="cost"
                    type="number"
                    className="form-control"
                    name="cost"
                    value={cost}
                    onChange={this.handleFormChange}
                  />
                </div>
              </div>
              <div className="text-right pt-4">
                <button type="reset" className="btn btn-light mr-2">
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-secondary"
                  disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <span
                        className="spinner-grow spinner-grow-sm mr-2"
                        role="status"
                      />
                      Saving
                    </>
                  ) : (
                    <span>Save</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
        {this.props.isAdmin && <Redirect to="/" />}
      </>
    )
  }
}

const mapStateToProps = (store) => {
  const { user } = store
  return {
    user,
  }
}

function mapDispatchToProps(dispatch) {
  const actions = {
    updateUserProfileData,
    addUserStories,
  }
  return {
    actions: bindActionCreators(actions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateStory)
