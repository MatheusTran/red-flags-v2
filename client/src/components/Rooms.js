import React, {useState, useRef} from 'react'
import Popup from './Popup'

export default function Rooms() {
    const roomRef = useRef()
    const [popupOn, setPopupOn] = useState(false);
    return (
        <div>
            <div className='btn' datatext="Get_A_room" onClick={()=>setPopupOn(!popupOn)}>Get_A_room</div>
            <Popup trigger={popupOn} text="create" setTrigger={setPopupOn}>
                <h1>Room details:</h1>
                <p><input required ref={roomRef} className="input" name="Lobbyname" id="Lobbyname" placeholder="Lobby name"/></p>
            </Popup>
        </div>
    )
}
