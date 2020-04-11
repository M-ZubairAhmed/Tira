import React, { Component } from 'react'

import { getUserProfileFromLocal } from '../components/utils'
import { Redirect } from 'react-router-dom'

class Workspace extends Component {
  state = {
    isLoggedIn: true,
  }

  componentDidMount() {
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
    } else {
      // Should clean incomplete data
      localStorage.clear()
      this.setState({ isLoggedIn: false })
    }
  }

  render() {
    const { isLoggedIn } = this.state

    return (
      <div>
        Workspace
        {isLoggedIn === false && <Redirect to="/login" />}
      </div>
    )
  }
}

export default Workspace
