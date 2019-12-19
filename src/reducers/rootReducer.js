import { combineReducers } from "redux";
import scheduleReducer from './scheduleReducer'
import userReducer from './userReducer.js'
import appReducer from './appReducer.js'

const rootReducer = combineReducers({
    schedule: scheduleReducer,
    user: userReducer,
    app: appReducer
})

export default rootReducer;