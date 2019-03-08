import React, {Component} from 'react'
import {OTSession,OTStreams, OTSubscriber, preloadScript} from 'opentok-react'
import {ChevronLeft, ChevronRight, ToggleLeft, ToggleRight} from 'react-feather'
import { EventEmitter } from 'events';
import firebase from 'firebase'

class MainApp extends Component{
    constructor(props){
        super(props)

        this.state = {
            cameras: [],
        }

        this.subscriberEventHandlers = {
            videoEnabled: event => {
                //@BUG doesn't get called
                console.log('Subscriber video enabled!');
                
            },
            connected: event => {
                console.log(event.target.isSubscribing())
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

                /**
                 * Just for UI expanding a video.
                 */
                event.target.element.addEventListener('dblclick', e => {
                    console.log(e.currentTarget.id)
                    e.currentTarget.classList.toggle('focused')
                    this.setState({
                        focusedCamera: event.target.stream.id
                    })
                })
                this.setState({
                    cameras: [...this.state.cameras, {id: event.target.stream.name, isScanning: false} ]
                })
                
            },
            
            
        };
    }

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
        this.props.database.ref().child('users/userID/viewers').once('value').then(snap => {
        this.props.database.ref().child('users/userID/').update({
            viewers: snap.val() + updateBy,
        })
        })
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

    handleSignOut = () => {
        firebase.auth().signOut()
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
                <OTSession apiKey = '46283042' sessionId = '1_MX40NjI4MzA0Mn5-MTU1MjAxOTA0Nzc3Nn4xN0EzN0ZueXd5S0UvS3J4OUNqTWRkOWx-fg' token = 'T1==cGFydG5lcl9pZD00NjI4MzA0MiZzaWc9MTBiMzdkMjdiODlhYzE2ZWMxNTgxZTQzNTBhNmZkN2QxMDMyYTkxNTpzZXNzaW9uX2lkPTFfTVg0ME5qSTRNekEwTW41LU1UVTFNakF4T1RBME56YzNObjR4TjBFek4wWnVlWGQ1UzBVdlMzSjRPVU5xVFdSa09XeC1mZyZjcmVhdGVfdGltZT0xNTUyMDE5MDcwJm5vbmNlPTAuODY0MTY0NDE0NTQzMTU5NyZyb2xlPXB1Ymxpc2hlciZleHBpcmVfdGltZT0xNTU0NjA3NDY5JmluaXRpYWxfbGF5b3V0X2NsYXNzX2xpc3Q9'>
                    <OTStreams>
                        <div onClick = {this.handleVidContainerClick} className = 'vidContainer'>
                            <ChevronLeft  className = 'leftPan'/>
                                <OTSubscriber eventHandlers = {this.subscriberEventHandlers}/>
                                <div className = 'scanToggle'>toggle</div>
                            <ChevronRight  className = 'rightPan'/>
                        </div>
                    </OTStreams>
                </OTSession>
                <div className = 'sideBar'>
                    <button onClick = {this.handleSignOut} className = 'signOutButton'>signOut</button>
                    <ul>
                        <li>Maybe Some stats Here.</li>
                    </ul>
                </div>
            </div>
        )
    }
}

export default preloadScript(MainApp)