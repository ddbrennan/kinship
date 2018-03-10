export default (state = [{
  isLoggedIn: false,
  user: {}
}], action) => {
  switch(action.type) {
    case 'LOG_IN':
      return {isLoggedIn: true, user: action.user}
    case 'LOG_OUT':
      return {isLoggedIn: false, user: {}}
    default:
      return state
  }
}
