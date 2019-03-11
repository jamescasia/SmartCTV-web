import React, {Component} from 'react'
import {OTSession,OTStreams, OTSubscriber, preloadScript} from 'opentok-react'
import {ChevronLeft, ChevronRight, ToggleLeft, ToggleRight} from 'react-feather'
import {NavLink, withRouter, Route} from 'react-router-dom'
import { EventEmitter } from 'events';
import firebase from 'firebase'
import Image from '../Image/Image'
import DetectionsGallery from '../DetectionsGallery/DetectionsGallery';

class MainApp extends Component{
    constructor(props){
        super(props)

        this.state = {
            cameras: [],
            detectionImgs: [],
            isFocused: false
        }

        this.subscriberEventHandlers = {
            videoEnabled: event => {
                //@BUG doesn't get called
                console.log('Subscriber video enabled!');
                
            },
            connected: event => {
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
                    this.setState({
                        isFocused: !this.state.isFocused
                    })
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
        window.addEventListener('unload', (e) => {  
            e.preventDefault();
            this.updateViewerNum(-1)
            e.returnValue = '';
        });

        this.props.database.ref().child(`users/userID/Images`).on('value', snap => {
            if(!snap.val()) return
            let data = snap.val()
            this.setState({

                detectionImgs: Object.keys(snap.val()).reverse().map(imgId => {
                let imgData = data[imgId]
                    return { 
                        id: imgId,
                        imgLink: imgData.storageLink,
                        taker: imgData.taker,
                        timeTaken: imgData.timeTaken
                    }
                })
            })
        })
    }

    componentWillUnmount(){
        window.removeEventListener('unload', (e) => {  
            e.preventDefault();
            this.updateViewerNum(-1)
            e.returnValue = '';
        })
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

                {this.state.isFocused && <div id = 'onFocus'/>}

                {this.props.location.pathname === '/' && <OTSession apiKey = '46283042' sessionId = '1_MX40NjI4MzA0Mn5-MTU1MjAxOTA0Nzc3Nn4xN0EzN0ZueXd5S0UvS3J4OUNqTWRkOWx-fg' token = 'T1==cGFydG5lcl9pZD00NjI4MzA0MiZzaWc9MTBiMzdkMjdiODlhYzE2ZWMxNTgxZTQzNTBhNmZkN2QxMDMyYTkxNTpzZXNzaW9uX2lkPTFfTVg0ME5qSTRNekEwTW41LU1UVTFNakF4T1RBME56YzNObjR4TjBFek4wWnVlWGQ1UzBVdlMzSjRPVU5xVFdSa09XeC1mZyZjcmVhdGVfdGltZT0xNTUyMDE5MDcwJm5vbmNlPTAuODY0MTY0NDE0NTQzMTU5NyZyb2xlPXB1Ymxpc2hlciZleHBpcmVfdGltZT0xNTU0NjA3NDY5JmluaXRpYWxfbGF5b3V0X2NsYXNzX2xpc3Q9'>
                    <OTStreams>
                        <div onClick = {this.handleVidContainerClick} className = 'vidContainer'>
                            <ChevronLeft  className = 'leftPan'/>
                                <OTSubscriber eventHandlers = {this.subscriberEventHandlers}/>
                                <div className = 'scanToggle'>toggle</div>
                            <ChevronRight  className = 'rightPan'/>
                        </div>
                    </OTStreams>
                </OTSession>}

                <Route path = '/detections' render = { (props) => <DetectionsGallery {...props} images = {this.state.detectionImgs}/>} />

                <div className = 'sideBar'>
                    <button onClick = {this.handleSignOut} className = 'signOutButton'>signOut</button>
                    {/* <div className = 'detectionImagesContainer'> */}
                        <NavLink exact activeClassName = 'activeNavLink' to = '/'>Cameras</NavLink>
                        <NavLink exact activeClassName = 'activeNavLink' to = '/detections'>Detections</NavLink>
                    {/* </div> */}
                </div>
            </div>
        )
    }
}

export default withRouter(preloadScript(MainApp))