import { combineReducers } from 'redux'
import auth from './auth'
import party from './party'
import gameLogic from './gameLogic'

export default combineReducers({
  auth,
  party,
  gameLogic
})
