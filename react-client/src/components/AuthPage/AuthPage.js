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
      .auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .then( () =>{
        if (window.location.href.includes("account_linking_token")) {
          let hrefs = window.location.href.split("redirect_uri=");
          let res = hrefs[hrefs.length - 1];
          let userIDs = hrefs[0].split("com/?");
          let userID = userIDs[userIDs.length-1];
          console.log(decodeURIComponent(res)); 

          this.props.database
          .ref().child(`/users/${btoa(this.state.currentUserEmail)}/messengerUsers`)
          .push()
          .set(userID);

        //   this.props.database.ref().child(`users/userID/cameras/${cameraName}`).update({
        //     action: newKey
        // })

       let tempKey =  this.props.database 
          .ref().child(`/users/userID/messengerUsers`)
          .push().key;
          // .set(userID);
          this.props.database 
          .ref().child(`/users/userID/messengerUsers/${tempKey}`).set(userID);



          // window.location.replace(
          //   decodeURIComponent(res) + "&authorization_code="+btoa (this.state.currentUserEmail)
          // );
        }  
      })
      .catch(err => {
        alert(err.message);
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
      <>
        <form onSubmit={
            // e => e.preventDefault()
            }>
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
      </>
    );
  }
}
