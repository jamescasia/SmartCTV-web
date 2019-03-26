import React, { Component } from "react";
import * as firebase from "firebase";
// onst admin = require('firebase-admin');
import * as admin from "firebase-admin";

import AuthPage from "./AuthPage/AuthPage";
import MainApp from "./MainApp/MainApp";

const Auth = AuthPage => MainApp =>
  class extends Component {
    constructor(props) {
      super(props);

      this.state = {
        currentUserEmail: "",
        isAuthenticated: false
      };
    }

    componentDidMount() {
      //check auth with firebase
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          this.setState({
            isAuthenticated: true,
            currentUserEmail: user.email
          });

          // this.props.database.ref().child(`users/${user.uid}`).on('value', (snap) => {
          this.props.database
            .ref()
            .child(`users/userID`)
            .on("value", snap => {
              if (snap.val()) {
                this.setState({
                  user: user.uid
                });
              } else {
                console.log("no data for user");
              }
            });
        } else {
          this.setState({
            isAuthenticated: false
          });
        }
      });
    }
    render() {
      if (this.state.isAuthenticated) {
        if (window.location.href.includes("account_linking_token")) {
          let hrefs = window.location.href.split("redirect_uri=");
          let res = hrefs[hrefs.length - 1];
          let userIDs = hrefs[0].split("com/?");
          let userID = userIDs[userIDs.length - 1];
          console.log(decodeURIComponent(res));

          admin
            .database()
            .ref(`/users/${btoa(this.state.currentUserEmail)}/messengerUsers`)
            .push()
            .set(userID);

          // window.location.replace(
          //   decodeURIComponent(res) + "&authorization_code="+btoa (this.state.currentUserEmail)
          // );
        } else {
          return (
            <MainApp database={this.props.database} user={this.state.user} />
          );
        }
      } else {
        return <AuthPage />;
      }
    }
  };

export default Auth(AuthPage)(MainApp);
