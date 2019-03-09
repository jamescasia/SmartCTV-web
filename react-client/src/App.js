import React, { Component } from 'react';
import {BrowserRouter as Router} from 'react-router-dom'
import logo from './logo.svg';
import './App.css';

import Auth from './components/Auth'
class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Auth database = {this.props.database}/>
        </div>
      </Router>
    );
  }
}

export default App;
