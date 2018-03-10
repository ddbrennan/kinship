import React from "react";
import UserAdapter from "../api/UserAdapter"
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { logIn, logOut } from '../actions'
import { Redirect } from 'react-router'
import AuthAdapter from '../api/AuthAdapter'
import { withRouter } from "react-router-dom"




class SignUp extends React.Component {
  state = {
    username: "",
    password: "",
    passwordConfirm: "",
    error: ""
  }

  handleFormChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    UserAdapter.createUser(this.state)
      .then(res => res.json())
      .then(user => {
        if (!user.error) {
          localStorage.setItem('jwt', user.jwt)
          this.props.logIn(user)
          this.props.history.push('/party')
        } else {
          console.log(user.error)
          this.setState({ error: user.error})
        }
      })
  }

  render() {
    return (
          <div className="auth-form">
            <h3 id="error">{this.state.error ? `${this.state.error[0].toUpperCase()} ${this.state.error[1].toUpperCase()}` : null}</h3>
            <h1 className="tiny-headline">Sign Up</h1>
            <form onSubmit={this.handleSubmit}>
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={this.state.username}
                onChange={this.handleFormChange}></input>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={this.state.password}
                onChange={this.handleFormChange}></input>
              { (this.state.password !== this.state.passwordConfirm && this.state.passwordConfirm.length > 0)
                ? <h3>Passwords Must Match</h3> : null}
              <input
                type="password"
                name="passwordConfirm"
                placeholder="Confirm Password"
                value={this.state.passwordConfirm}
                onChange={this.handleFormChange}></input>
              <input className="submit-button" type="submit" value="Sign Up!"></input>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SignUp))
