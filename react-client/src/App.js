import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import Auth from './components/Auth'
class App extends Component {
  render() {
    return (
      <div className="App">
        <Auth database = {this.props.database}/>
      </div>
    );
  }
}

export default App;
