import React, { useRef } from 'react'

export default function Username({onUserSubmit}) {
    const userRef = useRef()

    function handleSubmit(x){
        x.preventDefault()
        onUserSubmit(userRef.current.value)
    }
    return (
        <form onSubmit={handleSubmit} autoComplete="off">
            <p><input required ref={userRef} className="input" name="username" id="username" placeholder="Username"/></p>
            <button type="submit" className="btn" datatext="join">join</button>
        </form>
    )
}
