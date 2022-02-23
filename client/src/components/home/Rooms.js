import React, {useState, useRef, useEffect} from 'react'
import Popup from './Popup'
import { v4 } from "uuid"
import io from "socket.io-client"

export default function Rooms() {
    const roomRef = useRef()
    const [popupOn, setPopupOn] = useState(()=>false);
    useEffect(()=>{
        const socket = io.connect("http://localhost:9000/")
        socket.emit("home")
    })
    return (
        <div>
            <div className='btn' datatext="Get_A_room" onClick={()=>setPopupOn(!popupOn)}>Get_A_room</div>
            <Popup trigger={popupOn} text="create" setTrigger={setPopupOn} lobbyId={v4()} action="game">
                <h1>Room details:</h1>
                <p><input required ref={roomRef} className="input" name="Lobbyname" id="Lobbyname" placeholder="Lobby name"/></p>
            </Popup>
        </div>
    )
}
