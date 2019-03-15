import React from 'react'
import Video from '../Video/Video'

export default (props) => {
    return(
        <div className = 'videoDetections'>
            <h1>Recorded Videos of People</h1>
            <div className = 'vidsContainer'>
                {props.videos.map(vid => {
                    return <Video key = {vid.id} src = {vid.vidLink} timeStamp = {vid.timeTaken} camera ={vid.taker}/>
                })}
            </div>
        </div>
    )
}