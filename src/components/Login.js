import React from "react";
import AuthAdapter from '../api/AuthAdapter'
import { Redirect } from 'react-router'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { logIn, logOut } from '../actions'
import { Link } from 'react-router-dom'
import { withRouter } from "react-router-dom"


class Login extends React.Component {
  state = {
    username: "",
    password: "",
    error: ""
  }

  logIn = (e) => {
    e.preventDefault()
    AuthAdapter.login({
      username: this.state.username,
      password: this.state.password
    })
      .then(user => {
        if (!user.error) {
          this.props.logIn(user)
          localStorage.setItem('jwt', user.jwt)
          this.props.history.push('/party')

        } else {
          this.setState({ error: user.error})
        }
      })
  }

  handleFormChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }


  render() {
    return (
      <div className="auth-form">
        <h3 id="error">{this.state.error ? `${this.state.error.toUpperCase()}` : null}</h3>
        <h1 className="tiny-headline">Sign In</h1>
        <form onSubmit={ this.logIn }>
          <input
            type="text"
            placeholder="Username"
            value={this.state.username}
            onChange={this.handleFormChange}
            name="username">
          </input>
          <input
            type="password"
            placeholder="Password"
            value={this.state.password}
            onChange={this.handleFormChange}
            name="password"></input>
          <input className="submit-button" type="submit" value="Log in"></input>
        </form>
      </div>
    )
  }
 }

 const mapStateToProps = (state) => {
   return {
     auth: {
       isLoggedIn: state.auth.isLoggedIn,
       user: state.auth.user
     }
   }
 }

 const mapDispatchToProps = (dispatch) => {
   return bindActionCreators({
     logIn: logIn,
     logOut: logOut
   }, dispatch)
 }

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login))
