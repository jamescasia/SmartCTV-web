import React from 'react'

export default (props) => {
    return(
        <div className = 'detectionImage'>
            <img src={props.src} alt="Detected Person" onMouseEnter = {e => e.preventDefault()}/>
            <h3>{props.timeStamp}</h3>
            <p>{props.camera}</p>
        </div>
    )
}