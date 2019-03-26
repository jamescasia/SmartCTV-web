import React, { Component } from "react";
import * as firebase from "firebase";

export default class AuthPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: ""
    };
  }

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  logIn = () => {
    firebase
      .auth()
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .catch(err => {
        alert(err.message);
        console.log(err.message);
      });
  };

  isMobileDevice() {
    return (
      typeof window.orientation !== "undefined" ||
      navigator.userAgent.indexOf("IEMobile") !== -1
    );
  }

  render() {
    console.log("Location is", window.location);
    // if( this.isMobileDevice()){
    //     return(<div></div> );
    // }
    return (
      // < div className="">
      <form onSubmit={e => e.preventDefault()}>
        <input
          name="email"
          type="email"
          placeholder="email"
          value={this.state.email}
          onChange={this.handleChange}
        />
        <input
          name="password"
          type="password"
          placeholder="password"
          value={this.state.password}
          onChange={this.handleChange}
        />

        <div>
          <input type="submit" value="Sign Up" className="button signup" />
          <input
            type="submit"
            value="Log In"
            onClick={this.logIn}
            className="button login"
          />
        </div>
      </form>
      // </div >
    );
  }
}
