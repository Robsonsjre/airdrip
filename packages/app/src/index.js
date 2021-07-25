import React from 'react'
import ReactDOM from 'react-dom'
import App from './pages/App'
import { _config } from './utils'

_config()

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)
