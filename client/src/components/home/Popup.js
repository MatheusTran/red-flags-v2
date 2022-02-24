import React from 'react'

export default function Popup(props) {
    return (props.trigger) ? (
        <div className='popup-container'>
            {props.children}
            <button className='close' onClick={() => props.setTrigger(false)}>X</button>
        </div>
    ) : "";
}
