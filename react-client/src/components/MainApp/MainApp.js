import React, {Component} from 'react'
import {OTSession,OTStreams, OTSubscriber, preloadScript} from 'opentok-react'
import {ChevronLeft, ChevronRight, ToggleLeft, ToggleRight} from 'react-feather'
import {NavLink, withRouter, Route} from 'react-router-dom'
import { EventEmitter } from 'events';
import firebase from 'firebase'
import Image from '../Image/Image'
import DetectionsGallery from '../DetectionsGallery/DetectionsGallery';
import VideoDetections from '../VideoDetections/VideoDetections';


class MainApp extends Component{
    constructor(props){
        super(props)

        this.state = {
            cameras: [],
            detectionImgs: [],
            isFocused: false,
            detectionVids:[],
            user_db_key:""
        }

        this.subscriberEventHandlers = {
            videoEnabled: event => {
                //@BUG doesn't get called
                console.log('Subscriber video enabled!');
                
            },
            connected: event => {
                // console.log('connected', event.target.element)  
                // ----DESTROY GRID
                // event.target.element.parentElement.style.width = '85%';
                // event.target.element.style.height = '100%';
                // event.target.element.parentElement.style.height = '100%';
                // event.target.element.parentElement.parentElement.parentElement.className = 'vid'

                // event.target.element.parentElement.parentElement.parentElement.parentElement.style.height = '100%';
  
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

        this.props.database.ref().child(`users/${this.state.user_db_key}/Images`).on('value', snap => {
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

        this.props.database.ref().child(`users/${this.state.user_db_key}/Videos`).on('value', snap => {
            if(!snap.val()) return
            let data = snap.val()
            this.setState({

                detectionVids: Object.keys(snap.val()).reverse().map(vidId => {
                let vidData = data[vidId]
                    return { 
                        id: vidId,
                        vidLink: vidData.storageLink,
                        taker: vidData.taker,
                        timeTaken: vidData.timeTaken
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
        this.props.database.ref().child(`users/${this.state.user_db_key}/viewers`).once('value').then(snap => {
        this.props.database.ref().child(`users/${this.state.user_db_key}/`).update({
            viewers: snap.val() + updateBy,
        })
        })
    }

    handleLeftClick = cameraName => {
        let newKey = 'a' + this.props.database.ref().push().key
        // this.props.database.ref().child(`users/${this.props.user}/cameras/${this.state.camerasId}`).update({
        this.props.database.ref().child(`users/${this.state.user_db_key}/cameras/${cameraName}`).update({
            action: newKey
        })
       }

    handleRightClick = cameraName => {
        let newKey = 'b' + this.props.database.ref().push().key
        // this.props.database.ref().child(`users/${this.props.user}/cameras/${this.state.camerasId}`).update({
        this.props.database.ref().child(`users/${this.state.user_db_key}/cameras/${cameraName}`).update({
            action: newKey
        })
    }

    handleSignOut = () => {
        firebase.auth().signOut()
        this.updateViewerNum(-1);
    }

    handleToggleClick = cameraId => {
        this.setState({
            cameras: this.state.cameras.map(camera => {
                if(camera.id === cameraId){
                    let newKey = 'c' + this.props.database.ref().push().key
                    this.props.database.ref().child(`users/${this.state.user_db_key}/cameras/${cameraId}`).update({
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

                {this.props.location.pathname === '/' && <OTSession apiKey = '46288002' sessionId = '1_MX40NjI4ODAwMn5-MTU1MjY5MTMzMTU0MH5TUnBPcTJhTURtZ0hYTXdZcVZjSHBpSGR-fg' token = 'T1==cGFydG5lcl9pZD00NjI4ODAwMiZzaWc9OGFjMmZlYTdmMGM3ZjU1ZTM2MGUwOTAzYTBmZDZlYTRlYTFlNGZkZDpzZXNzaW9uX2lkPTFfTVg0ME5qSTRPREF3TW41LU1UVTFNalk1TVRNek1UVTBNSDVUVW5CUGNUSmhUVVJ0WjBoWVRYZFpjVlpqU0hCcFNHUi1mZyZjcmVhdGVfdGltZT0xNTUyNjkxMzUxJm5vbmNlPTAuMDQ4NzY4NjMwODI2MTYzODk1JnJvbGU9cHVibGlzaGVyJmV4cGlyZV90aW1lPTE1NTUyODMzNDkmaW5pdGlhbF9sYXlvdXRfY2xhc3NfbGlzdD0='>
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

                <Route path = '/detections-video' render = { (props) => <VideoDetections {...props} videos = {this.state.detectionVids}/>} />
                <div className = 'sideBar'>
                    <button onClick = {this.handleSignOut} className = 'signOutButton'>signOut</button>
                    {/* <div className = 'detectionImagesContainer'> */}
                        <NavLink exact activeClassName = 'activeNavLink' to = '/'>Cameras</NavLink>
                        <NavLink exact activeClassName = 'activeNavLink' to = '/detections'>Image Log</NavLink> 
                        <NavLink exact activeClassName = 'activeNavLink' to = '/detections-video'>Video Log</NavLink>
                    {/* </div> */}
                </div>
            </div>
        )
    }
}

export default withRouter(preloadScript(MainApp))