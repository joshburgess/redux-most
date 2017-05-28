import { ACCESS_DENIED } from '../constants/ActionTypes'

const DENIED = 'DENIED'

const adminAccess = (state = null, action) => {
  switch (action.type) {
    case ACCESS_DENIED:
      return DENIED
    default:
      return state
  }
}

export default adminAccess
