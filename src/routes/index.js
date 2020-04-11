import React, { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import Loading from './loading'

// Splitting upon login and workspace as we don't want user to download
// whole app when they are on login itself
const Workspace = lazy(() => import('./workspace'))
const Login = lazy(() => import('./login'))

export default () => (
  <Router>
    <Suspense fallback={<Loading />}>
      <Switch>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/">
          <Workspace />
        </Route>
      </Switch>
    </Suspense>
  </Router>
)
