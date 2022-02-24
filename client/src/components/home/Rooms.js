import React, {useState, useRef, useEffect} from 'react'
import Popup from './Popup'
import { v4 } from "uuid"
import io from "socket.io-client"
import socket from 'socket.io-client/lib/socket'

export default function Rooms() {
    const roomRef = useRef()
    const [popupOn, setPopupOn] = useState(()=>false);
    useEffect(()=>{
        const socket = io.connect("http://localhost:9000/")
        socket.emit("home")
    })
    const createRoom = async(x) => {
        const lobbyId = v4()
        const roomName=x["target"][0].value
        x.preventDefault()
        window.location = (`game?roomId=${lobbyId}&room=${roomName}`)
        return () =>{
            socket.emit("disconnect")
            socket.off()
        }
    }
    return (
        <div>
            <div className='btn' datatext="Get_A_room" onClick={()=>setPopupOn(!popupOn)}>Get_A_room</div>
            <Popup trigger={popupOn} text="create" setTrigger={setPopupOn}>                
                <form onSubmit={createRoom} autoComplete='off' action="game">
                    <h1>Room details:</h1>
                    <p><input required ref={roomRef} className="input" name="Lobbyname" id="Lobbyname" placeholder="Lobby name"/></p>
                    <button className='btn' type='submit' datatext="create">create</button>
                </form>
            </Popup>
        </div>
    )
}
