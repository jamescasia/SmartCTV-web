import React, {Component} from 'react'
import * as firebase from 'firebase'

import AuthPage from './AuthPage/AuthPage'
import MainApp from './MainApp/MainApp'

const Auth = (AuthPage) => (MainApp) => class extends Component{
    constructor(props){
        super(props)

        this.state = {
            isAuthenticated: false
        }
    }

    componentDidMount(){
        //check auth with firebase
        firebase.auth().onAuthStateChanged(user => {
            if(user){
                this.setState({
                    isAuthenticated: true
                })
            }else{
                this.setState({
                    isAuthenticated: false
                })
            }
        })
    }
    render(){
        if(this.state.isAuthenticated){
            return <MainApp/>
        }else{
            return <AuthPage/>
        }
    }
}

export default Auth(AuthPage)(MainApp)