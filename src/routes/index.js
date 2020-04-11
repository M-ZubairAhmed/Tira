import React, { Component, Suspense, lazy } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from 'react-router-dom'
import axios from 'axios'

import Loading from './loading'

// Splitting upon login and workspace as we don't want user to download
// whole app when they are on login itself
const Workspace = lazy(() => import('./workspace'))
const Login = lazy(() => import('./login'))

class App extends Component {
  state = {
    isLoggedIn: false,
    isLoading: true,
  }

  checkForCredInLocal() {
    const token = localStorage.getItem('user-auth-token')

    // Since we know it doesnt contain access token,
    // just clearing all lc related to auth, just in case
    if (token === null) {
      localStorage.clear()
    }

    return token
  }

  async checkUserTokenValidity(accessToken) {
    // Validate access token stored
    const baseURL = process.env.REACT_APP_BASE_URL

    // Since we don't have auth verify end point which we can call and request refresh token if needed,
    // lets just use the one of the end point to check if the token is valid
    try {
      const requestForValidUserCred = await axios({
        method: 'get',
        url: `${baseURL}/stories`,
        headers: {
          Authorization: accessToken,
        },
      })

      const responseStatus = requestForValidUserCred.status

      // We could have store the refresh token if we got one

      if (responseStatus === 200) {
        console.log('authorized', responseStatus)
        return true
      } else {
        throw new Error('auth')
      }
    } catch (err) {
      if (err.response) {
        console.log('Unauthorized', err.response.status)
      } else {
        console.log('Error while auth verification', err.message)
      }
      return false
    }
  }

  async componentDidMount() {
    const accessTokenStored = this.checkForCredInLocal()

    if (accessTokenStored === null) {
      this.setState({
        isLoading: false,
        isLoggedIn: false,
      })
    } else {
      let isLoggedIn = false
      const isLoading = false

      const isUserTokenValid = await this.checkUserTokenValidity(
        accessTokenStored,
      )

      if (isUserTokenValid === true) {
        isLoggedIn = true
      }

      this.setState({ isLoading, isLoggedIn })
    }
  }

  render() {
    const { isLoggedIn, isLoading } = this.state

    if (isLoading) {
      return <Loading />
    }

    return (
      <Router>
        <Suspense fallback={<Loading />}>
          <Switch>
            <Route exact path="/">
              {isLoggedIn ? <Workspace /> : <Redirect to="/login" />}
            </Route>
            <Route path="/login">
              {isLoggedIn ? <Redirect to="/" /> : <Login />}
            </Route>
          </Switch>
        </Suspense>
      </Router>
    )
  }
}

export default App
