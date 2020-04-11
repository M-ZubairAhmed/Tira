import React from 'react'
import ReactDOM from 'react-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly'

import App from './routes'
import reducers from './reducers'

import './styles/index.scss'

let store
if (process.env.NODE_ENV === 'development') {
  // Including redux tools only in dev mode
  store = createStore(reducers, composeWithDevTools())
} else {
  store = createStore(reducers)
}

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root'),
)
