import React from 'react'

export default function Popup(props) {
    function createRoom (x){
        x.preventDefault()
        console.log(props.lobbyId)
        window.location = (`game?roomId=${props.lobbyId}`)
    }
    return (props.trigger) ? (
        <div className="popup">
            <form className='popup-container' onSubmit={createRoom} autoComplete='off' action={props.action}>
                {props.children}
                <button className='btn' type='submit' datatext={props.text}>{props.text}</button>
                <button className='close' onClick={() => props.setTrigger(false)}>X</button>
            </form>
        </div>
    ) : "";
}
