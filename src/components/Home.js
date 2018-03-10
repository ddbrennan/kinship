import React from "react";
import { Link } from 'react-router-dom'
import SignUp from './SignUp'
import Login from './Login'

class Home extends React.Component {
  state = {
    status: ""
  }

  render() {
    return (
      <div id="title-screen">
        <div id="title-graphic"></div>
        <div id="auth-buttons">
          <div className={`left-buffer ${this.state.status ? null : "shrunk"}`}></div>
          <div className="auth-sign-in" onClick={() => this.setState({ status: "signing in"})}>Sign In</div>
          <div id="auth-form">
            {this.state.status === "signing in" ? <Login /> : null}
            {this.state.status === "signing up" ? <SignUp /> : null}
          </div>
          <div className="auth-sign-up" onClick={() => this.setState({ status: "signing up"})}>Sign Up</div>
          <div className={`right-buffer ${this.state.status ? null : "shrunk"}`}></div>
        </div>
      </div>
    )
  }
 }


export default Home
