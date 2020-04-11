import React, { Component } from 'react'

class Login extends Component {
  render() {
    return (
      <div className="container">
        <div className="row align-items-center vh-100 justify-content-center">
          <div className="col-md-5 col-sm-12 m-sm-0 m-md-4 p-4 border shadow rounded bg-white">
            <form>
              <div className="row justify-content-center">
                <h3>Login to TIRA</h3>
              </div>
              <div className="form-group">
                <label htmlFor="emailField">Email</label>
                <input id="emailField" type="email" className="form-control" />
              </div>
              <div className="form-group">
                <label htmlFor="passwordField">Password</label>
                <input
                  id="passwordField"
                  type="password"
                  className="form-control"
                />
              </div>
              <div className="form-group form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="adminToggleField"
                />
                <label className="form-check-label" htmlFor="adminToggleField">
                  Login as administrator
                </label>
              </div>
              <div className="row justify-content-center">
                <button type="submit" className="btn btn-primary">
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }
}

export default Login
