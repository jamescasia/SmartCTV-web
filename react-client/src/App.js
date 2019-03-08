import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import Auth from './components/Auth'
class App extends Component {
  
  componentDidMount(){
    this.updateViewerNum(1)
    
    /**
     * decrement Viewer count on close.
     */
    window.addEventListener('beforeunload', (e) => {  
      e.preventDefault();
      this.updateViewerNum(-1)
      return e.returnValue = 'Are you sure you want to close?';
    });
  }

  componentWillUnmount(){
    window.removeEventListener('beforeunload')
  }

  updateViewerNum = (updateBy) => {
    this.props.database.ref('viewers').once('value').then(snap => {
      this.props.database.ref().update({
        viewers: snap.val() + updateBy,
      })
    })
  }

  render() {
    return (
      <div className="App">
        <Auth database = {this.props.database}/>
      </div>
    );
  }
}

export default App;
