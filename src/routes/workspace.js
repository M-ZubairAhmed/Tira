import React, { Component, useState } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Redirect, Link, Route, Switch } from 'react-router-dom'
import axios from 'axios'

import {
  updateUserProfileData,
  addUserStories,
  clearUserStories,
} from '../actions'
import { getUserProfileFromLocal } from '../components/utils'

import StoriesListPage from './lists'
import CreateStoryPage from './create'

const NavBar = ({ logout, createNewStory, isAdmin }) => {
  const [isNavCollapsed, toggleNav] = useState(false)

  return (
    <nav className="navbar navbar-expand-lg navbar-light border">
      <button
        className="navbar-toggler collapsed"
        onClick={() => toggleNav(!isNavCollapsed)}>
        <span className="navbar-toggler-icon"></span>
      </button>
      <Link className="navbar-brand" to="/">
        Tira
      </Link>

      <div
        className={`collapse navbar-collapse ${isNavCollapsed ? 'show' : ''}`}>
        <ul className="navbar-nav ml-auto mt-2 mt-lg-0">
          {!isAdmin && (
            <li className="nav-item">
              <Link
                to="/story/new"
                className="btn btn-outline-secondary my-2 my-sm-0 btn-block"
                onClick={createNewStory}>
                + Create new story
              </Link>
            </li>
          )}
          <li className="navbar-item">
            <button
              className="btn btn-link text-secondary btn-block"
              onClick={logout}>
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  )
}

class Workspace extends Component {
  state = {
    isLoggedIn: true,
    isLoading: true,
    stories: [],
  }

  validateUserInLocal() {
    const userProfileFromLocal = getUserProfileFromLocal()
    const { token, firstName, lastName, isAdmin } = userProfileFromLocal

    if (
      token !== null &&
      token.trim().length !== 0 &&
      firstName !== null &&
      firstName.trim().length !== 0 &&
      lastName !== null &&
      lastName.trim().length !== 0 &&
      isAdmin !== null &&
      isAdmin.trim().length !== 0
    ) {
      console.log('user already logged in workspace', userProfileFromLocal)
      const isAdminBoolean =
        isAdmin === 'true' || isAdmin === true ? true : false
      this.props.actions.updateUserProfileData(
        '',
        firstName,
        lastName,
        isAdminBoolean,
      )
    } else {
      // Should clean incomplete data
      localStorage.clear()
      this.setState({ isLoggedIn: false })
    }
  }

  async fetchStories() {
    const { token } = getUserProfileFromLocal()
    const baseURL = process.env.REACT_APP_BASE_URL
    try {
      const userStoriesResponse = await axios({
        method: 'get',
        url: `${baseURL}/stories`,
        headers: {
          Authorization: token,
        },
      })

      const userStoriesStatus = userStoriesResponse.status

      if (userStoriesStatus === 200) {
        const allStories = userStoriesResponse.data
        this.props.actions.addUserStories(allStories)
      } else {
        throw new Error('Failed to fetch data')
      }
    } catch (err) {
      console.log('error in stories list', err.message)
    }
  }

  componentDidMount() {
    this.validateUserInLocal()
    this.fetchStories()
  }

  clickedLogout = (e) => {
    e.preventDefault()
    localStorage.clear()
    this.props.actions.clearUserStories()
    this.setState({ isLoggedIn: false })
  }

  render() {
    const { isLoggedIn } = this.state

    return (
      <div>
        {isLoggedIn === false && <Redirect to="/login" />}
        <NavBar logout={this.clickedLogout} isAdmin={this.props.user.isAdmin} />
        <section className="m-md-4 m-sm-0">
          <Switch>
            <Route exact path="/">
              <h1 className="text-center my-4">User Stories</h1>
              <StoriesListPage
                stories={this.props.stories}
                isAdmin={this.props.user.isAdmin}
              />
            </Route>
            <Route path="/story/view/:id">
              <h1 className="text-center my-4">User Story</h1>
            </Route>
            <Route
              path="/story/new"
              render={(props) => (
                <CreateStoryPage isAdmin={this.props.user.isAdmin} {...props} />
              )}></Route>
          </Switch>
        </section>
      </div>
    )
  }
}

const mapStateToProps = (store) => {
  const { user, stories } = store
  return {
    user,
    stories,
  }
}

function mapDispatchToProps(dispatch) {
  const actions = {
    updateUserProfileData,
    addUserStories,
    clearUserStories,
  }
  return {
    actions: bindActionCreators(actions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Workspace)
