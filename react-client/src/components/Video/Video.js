import React from 'react'

export default (props) => {
    return(
        <div className = 'detectionVideo'> 
            <video controls>  
                <source src={props.src} alt="Detected Person" type="video/mp4"/> 
                Sorry, your browser doesn't support embedded videos.
            </video>

            <h3>{props.timeStamp}</h3>
            <p>{props.camera}</p>
        </div>
    )
}