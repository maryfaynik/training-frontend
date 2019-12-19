import * as serviceWorker from './serviceWorker'

import 'react-big-calendar/lib/css/react-big-calendar.css'
import React from 'react'
import { createStore, compose, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'

import ReactDOM from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom'


import './index.css'
import App from './App'


import rootReducer from './reducers/rootReducer'

const store = createStore(
    rootReducer, 
    compose(
        applyMiddleware(thunk), 
        window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
      )
)

ReactDOM.render(
    <Provider store={store}>
        <Router>
            <App />
        </Router>
    </Provider>
    , document.getElementById('root'));



// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
