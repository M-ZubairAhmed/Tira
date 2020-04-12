import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import axios from 'axios'
import { Redirect } from 'react-router-dom'

import { updateUserProfileData } from '../actions'
import {
  getUserProfileFromLocal,
  setUserProfileToLocal,
} from '../actions/localstorage'

class Login extends Component {
  state = {
    email: '',
    password: '',
    isAdmin: false,
    isLoading: false,
    isLoggedIn: false,
    errorMessage: '',
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
      console.log('user already logged in', userProfileFromLocal)
      this.setState({ isLoggedIn: true })
    } else {
      // Should clean incomplete data
      localStorage.clear()
    }
  }

  handleInputChange = (event) => {
    const {
      target: { value, checked, name, type },
    } = event

    if (type === 'checkbox') {
      this.setState({
        [name]: checked,
        errorMessage: '',
      })
    } else {
      this.setState({
        [name]: value,
        errorMessage: '',
      })
    }
  }

  handleFormSubmit = async (event) => {
    const { email, password, isAdmin } = this.state

    event.preventDefault()

    if (email.trim().length === 0 || password.trim().length === 0) {
      this.setState({
        errorMessage: 'Both Email and Password are required',
      })
    } else {
      try {
        this.setState({
          isLoading: true,
        })
        const baseURL = process.env.REACT_APP_BASE_URL

        const loginResponse = await axios({
          method: 'post',
          url: `${baseURL}/signin`,
          data: {
            email,
            password,
            isAdmin,
          },
        })
        const loginStatus = loginResponse.status

        if (loginStatus === 200) {
          const {
            data: { id, firstName, lastName, role, token },
          } = loginResponse

          const isAdmin = role === 'Admin' ? true : false

          this.props.actions.updateUserProfileData(
            id,
            firstName,
            lastName,
            isAdmin,
          )

          setUserProfileToLocal(firstName, lastName, isAdmin, token)

          this.setState({
            isLoading: false,
            isLoggedIn: true,
          })
        } else {
          throw new Error('Error while logging in')
        }
      } catch (err) {
        this.setState({
          isLoading: false,
          errorMessage: err.message,
        })
      }
    }
  }

  render() {
    const {
      email,
      password,
      isAdmin,
      isLoading,
      errorMessage,
      isLoggedIn,
    } = this.state

    return (
      <div className="container">
        <div className="row align-items-center vh-100 justify-content-center">
          <div className="col-md-5 col-sm-12 m-sm-0 m-md-4 p-4 border shadow rounded bg-white">
            <form onSubmit={this.handleFormSubmit}>
              <div className="row justify-content-center">
                <h3>Login to TIRA</h3>
              </div>
              {errorMessage.length !== 0 && (
                <div className="alert alert-warning text-center" role="alert">
                  {errorMessage}
                </div>
              )}
              <div className="form-group">
                <label htmlFor="emailField">Email</label>
                <input
                  id="emailField"
                  type="email"
                  className="form-control"
                  name="email"
                  value={email}
                  onChange={this.handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="passwordField">Password</label>
                <input
                  id="passwordField"
                  type="password"
                  className="form-control"
                  name="password"
                  value={password}
                  onChange={this.handleInputChange}
                  required
                />
              </div>
              <div className="form-group form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="adminToggleField"
                  name="isAdmin"
                  value={isAdmin}
                  onChange={this.handleInputChange}
                />
                <label className="form-check-label" htmlFor="adminToggleField">
                  Login as administrator
                </label>
              </div>
              <div className="row justify-content-center">
                <button
                  className="btn btn-primary"
                  type="submit"
                  disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <span
                        className="spinner-grow spinner-grow-sm mr-1"
                        role="status"
                        aria-hidden="true"
                      />
                      Logging in
                    </>
                  ) : (
                    <span>Log in</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
        {isLoggedIn && <Redirect exact to="/" />}
      </div>
    )
  }
}

function mapDispatchToProps(dispatch) {
  const actions = {
    updateUserProfileData,
  }
  return {
    actions: bindActionCreators(actions, dispatch),
  }
}

export default connect(null, mapDispatchToProps)(Login)
