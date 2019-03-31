import React, { Component } from "react";
import * as firebase from "firebase";
// onst admin = require('firebase-admin');

import AuthPage from "./AuthPage/AuthPage";
import MainApp from "./MainApp/MainApp";

const Auth = AuthPage => MainApp =>
  class extends Component {
    constructor(props) {
      super(props);

      this.state = {
        currentUserEmail: "",
        isAuthenticated: false,
        user_db_key: "",
        user: "",
        isMessengerUserRegistered: false,
        isUserRegistered: false
      };
    }

    componentDidMount() {
      //check auth with firebase
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          this.setState({
            isAuthenticated: true,
            currentUserEmail: user.email,
            user_db_key: btoa(user.email),
            user: user.uid
          });

          // this.props.database.ref().child(`users/${user.uid}`).on('value', (snap) => {
          // this.props.database
          //   .ref()
          //   .child(`users/${this.state.user_db_key}`)
          //   .on("value", snap => {
          //     if (snap.val()) {
          //       this.setState({
          //         user: user.uid
          //       });
          //     } else {
          //       console.log("no data for user");
          //     }
          //   });
        } else {
          this.setState({
            isAuthenticated: false
          });
        }
      });
    }
    register() {
      if (!this.state.isUserRegistered) {
        this.props.database
          .ref()
          .child(`/users/${this.state.user_db_key}`)
          .set({
            Images: { sample: "None" },
            Videos: { sample: "None" },
            cameras: { sample: "None" },
            streaming: false
          });

        this.props.database
          .ref()
          .child(`/users/${this.state.user_db_key}/uid`)
          .set(this.state.user);
        this.setState({
          isUserRegistered: true
        });
      }
    }
    checkUserExists(mID, res) {
      console.log("updatedsssss");
      let userExists = false;
      this.props.database
        .ref()
        .child(`users/${this.state.user_db_key}`)
        .once("value", function (snap)  { 
          userExists = snap.exists();
          if(snap.exists()){
            console.log("the user exists", snap.val()); 
          }
          else{
            console.log("doesnt existssssssss"); 
          }
       
        }) .then(function() {
          console.log("thenned");
        })
        
        if(!userExists){this.register();}
           this.registerMessengerUser(mID, res);
          this.setState({
            isMessengerUserRegistered: true
          });

    }
    registerMessengerUser(mID, res) {
      if (!this.state.isMessengerUserRegistered) {
        this.props.database
          .ref()
          .child(`/users/${this.state.user_db_key}/messengerUsers`)
          .child(mID)
          .set(true)
          .then(() => {
            // window.location.replace(
            //   decodeURIComponent(res) +
            //     "&authorization_code=" +
            //     this.state.user_db_key
            // );
          });
      }
    }
    render() {
      if (this.state.isAuthenticated) {
        if (
          window.location.href.includes("account_linking_token") &&
          this.state.isAuthenticated
        ) {
          let hrefs = window.location.href.split("redirect_uri=");
          let res = hrefs[hrefs.length - 1];
          let mID = hrefs[0]
            .split("com/?")
            .pop()
            .split("&a")[0];
          console.log(decodeURIComponent(res));
          this.checkUserExists(mID, res);
          // if (!this.checkUserExists(mID)) {
          //   this.register();
          // }
        } else {
          return (
            <MainApp
              database={this.props.database}
              user={this.state.user}
              user_db_key={this.state.user_db_key}
            />
          );
        }
      } else {
        return <AuthPage />;
      }
    }
  };

export default Auth(AuthPage)(MainApp);
