import React, {Component} from 'react'
import {OTSession,OTStreams, OTSubscriber, preloadScript} from 'opentok-react'
import {ChevronLeft, ChevronRight, ToggleLeft, ToggleRight} from 'react-feather'
import { EventEmitter } from 'events';

class MainApp extends Component{
    constructor(props){
        super(props)

        this.state = {
            cameras: []
        }

        this.subscriberEventHandlers = {
            connected: event => {
                // console.log(event.target.session.getPublisherForStream(event.target.stream))
                event.target.element.parentElement.parentElement.firstChild.addEventListener('click', () => {
                    this.handleLeftClick(event.target.stream.name)
                })
                event.target.element.parentElement.parentElement.lastChild.addEventListener('click', () => {
                    this.handleRightClick(event.target.stream.name)
                })
                event.target.element.parentElement.parentElement.children[2].addEventListener('click', (e) => {
                    let cameraData = this.state.cameras.find(camera => camera.id === event.target.stream.name)
                    this.handleToggleClick(cameraData.id)
                })
                this.setState({
                    cameras: [...this.state.cameras, {id: event.target.stream.name, isScanning: false} ]
                })
            },
            videoEnabled: event => {
                console.log('Subscriber video enabled!');
            }
        };
    }

    componentDidMount(){
        let vidContainers = document.querySelectorAll('.vidContainer')
        console.log(vidContainers)
    }

    handleLeftClick = cameraName => {
        let newKey = 'a' + this.props.database.ref().push().key
        // this.props.database.ref().child(`users/${this.props.user}/cameras/${this.state.camerasId}`).update({
        this.props.database.ref().child(`users/userID/cameras/${cameraName}`).update({
            action: newKey
        })
       }

    handleRightClick = cameraName => {
        let newKey = 'b' + this.props.database.ref().push().key
        // this.props.database.ref().child(`users/${this.props.user}/cameras/${this.state.camerasId}`).update({
        this.props.database.ref().child(`users/userID/cameras/${cameraName}`).update({
            action: newKey
        })
    }

    handleToggleClick = cameraId => {
        this.setState({
            cameras: this.state.cameras.map(camera => {
                if(camera.id === cameraId){
                    let newKey = 'c' + this.props.database.ref().push().key
                    this.props.database.ref().child(`users/userID/cameras/${cameraId}`).update({
                        scanning: newKey
                    })
                    return {...camera, isScanning: !camera.isScanning}
                }
                return camera
            })
        })
    }

    handleVidContainerClick = e => {
        // console.log(e.relatedTarget)
    }

    render(){

        return(
            <div className = 'MainApp'>
                <OTSession apiKey = '46278792' sessionId = '1_MX40NjI3ODc5Mn5-MTU1MTQ1MjEwOTY5Mn4zWmpFSVE5V2xoNWwvL2liaWE3cEgyWmZ-fg' token = 'T1==cGFydG5lcl9pZD00NjI3ODc5MiZzaWc9OGFjN2ZmMTgzOGFiYjg1YmE0OWNkZjVjMTUyNzY5MTA4NDYwNDAzNTpzZXNzaW9uX2lkPTFfTVg0ME5qSTNPRGM1TW41LU1UVTFNVFExTWpFd09UWTVNbjR6V21wRlNWRTVWMnhvTld3dkwybGlhV0UzY0VneVdtWi1mZyZjcmVhdGVfdGltZT0xNTUxNDUyMTQxJm5vbmNlPTAuNDc0NzA0Mjk2Njc4Mzk4MyZyb2xlPXB1Ymxpc2hlciZleHBpcmVfdGltZT0xNTU0MDQwNTM4JmluaXRpYWxfbGF5b3V0X2NsYXNzX2xpc3Q9'>
                    <OTStreams>
                        <div onClick = {this.handleVidContainerClick} className = 'vidContainer'>
                            <ChevronLeft  className = 'leftPan'/>
                                {console.log(this.props)}
                                <OTSubscriber eventHandlers = {this.subscriberEventHandlers}/>
                                <div className = 'scanToggle'>toggle</div>
                            <ChevronRight  className = 'rightPan'/>
                        </div>
                    </OTStreams>
                </OTSession>
            </div>
        )
    }
}

export default preloadScript(MainApp)