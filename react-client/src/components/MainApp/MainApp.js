import React, {Component} from 'react'
import {OTSession,OTStreams, OTSubscriber, preloadScript} from 'opentok-react'
import {ChevronLeft, ChevronRight} from 'react-feather'

class MainApp extends Component{
    constructor(props){
        super(props)

        this.state = {
            camerasId: 860739031129937
        }
        this.subscriberEventHandlers = {
            connected: event => {
                // console.log(event.target.session.connection.getPublisherForStream(event))
                console.log(event)
            },
            videoEnabled: event => {
                console.log('Subscriber video enabled!');
            }
        };
    }

    componentDidMount(){

    }

    handleLeftClick = () => {
        let newKey = 'a' + this.props.database.ref().push().key
        // this.props.database.ref().child(`users/${this.props.user}/cameras/${this.state.camerasId}`).update({
        this.props.database.ref().child(`users/userID/cameras/${this.state.camerasId}`).update({
            action: newKey
        })
       }

    handleRightClick = () => {
        let newKey = 'b' + this.props.database.ref().push().key
        // this.props.database.ref().child(`users/${this.props.user}/cameras/${this.state.camerasId}`).update({
        this.props.database.ref().child(`users/userID/cameras/${this.state.camerasId}`).update({
            action: newKey
        })
    }

    render(){

        return(
            <div className = 'MainApp'>
                <OTSession apiKey = '46278792' sessionId = '1_MX40NjI3ODc5Mn5-MTU1MTQ1MjEwOTY5Mn4zWmpFSVE5V2xoNWwvL2liaWE3cEgyWmZ-fg' token = 'T1==cGFydG5lcl9pZD00NjI3ODc5MiZzaWc9OGFjN2ZmMTgzOGFiYjg1YmE0OWNkZjVjMTUyNzY5MTA4NDYwNDAzNTpzZXNzaW9uX2lkPTFfTVg0ME5qSTNPRGM1TW41LU1UVTFNVFExTWpFd09UWTVNbjR6V21wRlNWRTVWMnhvTld3dkwybGlhV0UzY0VneVdtWi1mZyZjcmVhdGVfdGltZT0xNTUxNDUyMTQxJm5vbmNlPTAuNDc0NzA0Mjk2Njc4Mzk4MyZyb2xlPXB1Ymxpc2hlciZleHBpcmVfdGltZT0xNTU0MDQwNTM4JmluaXRpYWxfbGF5b3V0X2NsYXNzX2xpc3Q9'>
                    <OTStreams>
                        <div className = 'vidContainer'>
                            <ChevronLeft onClick = {this.handleLeftClick}/>
                                <OTSubscriber eventHandlers = {this.subscriberEventHandlers}/>
                            <ChevronRight onClick = {this.handleRightClick}/>
                        </div>
                    </OTStreams>
                </OTSession>
            </div>
        )
    }
}

export default preloadScript(MainApp)