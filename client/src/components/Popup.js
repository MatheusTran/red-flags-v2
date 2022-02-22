import React from 'react'

export default function Popup(props) {
    return (props.trigger) ? (
        <div className="popup">
            <form className='popup-container' autoComplete='off'>
                {props.children}
                <button className='btn' datatext={props.text}>{props.text}</button>
                <button className='close' onClick={() => props.setTrigger(false)}>X</button>
            </form>
        </div>
    ) : "";
}
