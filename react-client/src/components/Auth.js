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
        isUserRegistered:false,
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
      if(!this.state.isUserRegistered){
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
        }); } 
    }
    checkUserExists(mID) {
      this.props.database
        .ref()
        .child("users")
        .once("value", snap => {
          console.log(snap.val());
          console.log(snap.child(mID)  != null);
          return snap.child(mID)  != null;
        });
    }
    registerMessengerUser(mID, res) {
      if (!this.state.isMessengerUserRegistered) {
        this.props.database
          .ref()
          .child(`/users/${this.state.user_db_key}/messengerUsers`)
          .child(mID)
          .set(true)
          .then( ()=> {
            // window.location.replace(
            //   decodeURIComponent(res) +
            //     "&authorization_code=" +
            //     this.state.user_db_key
            // );
            this.setState({
              isMessengerUserRegistered: true
            });  
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
          if (!this.checkUserExists(mID)) {
            this.register();
          }

          this.registerMessengerUser(mID, res);
        }
        else{
        return (
          <MainApp
            database={this.props.database}
            user={this.state.user}
            user_db_key={this.state.user_db_key}
          />
        );}
      } else {
        return <AuthPage />;
      }
    }
  };

export default Auth(AuthPage)(MainApp);
