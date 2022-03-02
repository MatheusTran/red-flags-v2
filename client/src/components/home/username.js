import React, { useRef, useState } from 'react'
import Popup from '../Popup'
import DiceBear from '../DiceBear';

export default function Username({onUserSubmit}) {
    const userRef = useRef()
    const seedRef = useRef()
    const [popupOn, setPopupOn] = useState(()=>false);
    const [currentSeed, setCurrentSeed] = useState("")
    function handleSubmit(x){
        x.preventDefault()
        const user = userRef.current.value
        const seed = seedRef.current.value
        onUserSubmit(user, seed)
    }
    return (
        <div>
            <Popup trigger={popupOn} setTrigger={setPopupOn}>
            <form onSubmit={handleSubmit} autoComplete="off">
                <p><input required ref={userRef} className="input" name="username" id="username" placeholder="Username"/></p>
                <div>
                    <DiceBear seed={currentSeed}/>
                </div>
                <p><input onChange={()=>setCurrentSeed(seedRef.current.value)} ref={seedRef} className="input" name="seed" id="seed" placeholder="seed"/></p>
                <button type="submit" className="btn" datatext="enter">enter</button>
            </form>
            </Popup>
            
            <button className="btn" datatext="join" onClick={()=>setPopupOn(!popupOn)}>join</button>
        </div>

    )
}
