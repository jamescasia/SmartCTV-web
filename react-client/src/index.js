import React from 'react';
import ReactDOM from 'react-dom';

import * as firebase from 'firebase'

import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

const config = {
    apiKey: "AIzaSyDDObv-ujLQEX6ATNrT2XOWxylTw9Ugqk8",
    authDomain: "smart-streamer.firebaseapp.com",
    databaseURL: "https://smart-streamer.firebaseio.com",
    projectId: "smart-streamer",
    storageBucket: "smart-streamer.appspot.com",
    messagingSenderId: "808307363269"
}

firebase.initializeApp(config);
firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE);

const database = firebase.database()

ReactDOM.render(<App database = {database}/>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
