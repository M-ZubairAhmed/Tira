import React from 'react'

import axios from 'axios'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Link } from 'react-router-dom'

import { getUserProfileFromLocal } from '../actions/localstorage'
import { updateStoryStatus } from '../actions/stories'

class ViewStory extends React.Component {
  state = {
    errorMessage: '',
    isLoading: true,
    ID: '',
    summary: '',
    description: '',
    type: 'enhancement',
    complexity: 'low',
    estimatedHrs: 0,
    cost: 0,
    status: '',
  }

  async componentDidMount() {
    const baseURL = 'https://tira-api.herokuapp.com/api/v1'
    const { token } = getUserProfileFromLocal()

    try {
      const {
        match: {
          params: { id },
        },
      } = this.props

      const response = await axios({
        method: 'get',
        url: `${baseURL}/stories/${id}`,
        headers: {
          Authorization: token,
        },
      })

      const {
        complexity,
        cost,
        description,
        estimatedHrs,
        summary,
        type,
      } = response.data

      this.setState({
        ID: String(id),
        summary,
        description,
        type,
        complexity,
        estimatedHrs,
        cost,
        status: '',
      })
    } catch (err) {
      let errorMessage = ''
      if (err.response) {
        errorMessage = err.response.data || err.response.data.error
      } else {
        errorMessage = err.message
      }
      this.setState({ errorMessage })
    } finally {
      this.setState({ isLoading: false })
    }
  }

  handleReviewClick = (e) => {
    const {
      target: { id },
    } = e

    const {
      match: {
        params: { id: viewStoryID },
      },
    } = this.props

    const newStatus =
      id === 'accept' ? 'approved' : id === 'reject' ? 'rejected' : 'pending'

    this.props.actions.updateStoryStatus(viewStoryID, newStatus)
  }

  render() {
    const {
      match: {
        params: { id: viewStoryID },
      },
      stories,
    } = this.props

    const storyInView = stories.find(
      (story) => String(story.ID) === String(viewStoryID),
    )
    let status = ''
    if (storyInView && storyInView.status) {
      status = storyInView.status
    }

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
        <h1 className="text-center my-4">User Story #{viewStoryID}</h1>
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
              <div className="alert alert-warning text-center" role="alert">
                {errorMessage}
              </div>
            )}
            {isLoading && (
              <div className="spinner-grow text-secondary" role="status">
                <span className="sr-only">Loading story</span>
              </div>
            )}
            {!isLoading && errorMessage === '' && (
              <article onSubmit={this.handleCreateStory}>
                <div className="form-group">
                  <label htmlFor="summary">
                    <strong>Summary</strong>
                  </label>
                  <p>{summary}</p>
                </div>
                <div className="form-group">
                  <label htmlFor="Description">
                    <strong>Description</strong>
                  </label>
                  <p>{description}</p>
                </div>
                <div className="form-group">
                  <label htmlFor="type">
                    <strong>Type</strong>
                  </label>
                  <p className="text-capitalize">{type}</p>
                </div>
                <div className="form-group">
                  <label htmlFor="complex">
                    <strong>Complexity</strong>
                  </label>
                  <p className="text-capitalize">{complexity}</p>
                </div>
                <div className="form-group">
                  <label htmlFor="time">
                    <strong>Estimated time for completion</strong>
                  </label>
                  <p className="text-capitalize">{estimatedHrs} Hours</p>
                </div>
                <div className="form-group">
                  <label htmlFor="cost">
                    <strong>Cost</strong>
                  </label>
                  <p className="text-capitalize">$ {cost}</p>
                </div>
                {this.props.isAdmin && (
                  <div className="form-group">
                    <label htmlFor="cost">
                      <strong>Status</strong>
                    </label>
                    <h5>
                      <span
                        className={`badge text-capitalize ${
                          status === 'approved'
                            ? 'badge-success'
                            : status === 'rejected'
                            ? 'badge-danger'
                            : 'badge-dark'
                        }`}>
                        {status}
                      </span>
                    </h5>
                  </div>
                )}
                {this.props.isAdmin && status === 'pending' && (
                  <div className="text-right pt-4">
                    <button
                      id="reject"
                      className="btn btn-danger mr-2"
                      onClick={this.handleReviewClick}>
                      Reject
                    </button>
                    <button
                      id="accept"
                      className="btn btn-success"
                      onClick={this.handleReviewClick}>
                      Accept
                    </button>
                  </div>
                )}
              </article>
            )}
          </div>
        </div>
      </>
    )
  }
}

const mapStateToProps = (store) => {
  const { stories } = store

  return {
    stories,
  }
}

function mapDispatchToProps(dispatch) {
  const actions = { updateStoryStatus }
  return {
    actions: bindActionCreators(actions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewStory)
