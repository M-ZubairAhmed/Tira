import React from 'react'

export default () => (
  <div className="container">
    <div className="row vh-100 justify-content-center align-items-center">
      <div className="col text-center">
        <div className="spinner-grow text-secondary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
        <h2 className="text-secondary mt-4">
          Please hang on while we load your application
        </h2>
      </div>
    </div>
  </div>
)
