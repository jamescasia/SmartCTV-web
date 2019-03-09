import React from 'react'
import Image from '../Image/Image'

export default (props) => {
    return(
        <div className = 'detectionGallery'>
            <h1>People seen while you weren't looking.</h1>
            <div className = 'imagesContainer'>
                {props.images.map(img => {
                    return <Image key = {img.id} src = {img.imgLink} timeStamp = {img.timeTaken} camera ={img.taker}/>
                })}
            </div>
        </div>
    )
}