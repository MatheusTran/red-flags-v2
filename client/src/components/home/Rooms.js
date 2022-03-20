import React, {useState, useRef, useEffect} from 'react'
import Popup from '../Popup'
import { v4 } from "uuid"
import useLocalStorage from "../../hooks/useLocalStorage";

import {initializeApp} from "firebase/app";
import {getFirestore, setDoc, doc, collection, arrayUnion} from "firebase/firestore";

import {useCollectionData} from "react-firebase-hooks/firestore"

initializeApp({
    apiKey: process.env.REACT_APP_firebase_api,
    authDomain: "red-flags-v2.firebaseapp.com",
    projectId: "red-flags-v2",
    storageBucket: "red-flags-v2.appspot.com",
    messagingSenderId: "35160152967",
    appId: "1:35160152967:web:6d106eec111e58897d1122",
    measurementId: "G-1GQK9YKCNK"
})

const FS = getFirestore();

export default function Rooms() {
    const roomRef = useRef()
    const [popupOn, setPopupOn] = useState(()=>false);
    const [isPrivate, setIsPrivate] = useState(()=>false)
    const [user] = useLocalStorage("user")
    const [seed] = useLocalStorage("seed")
    const [id, setId] = useLocalStorage("id")

    useEffect(()=>{
        setId(v4())
    },[setId])

    let player = {username:user, score:0, admin:false, played:[], seed:seed, id:id}//note to self, create an id

    const [roomsList] = useCollectionData(collection(FS,"rooms"))

    const createRoom = async(x) => {
        const lobbyId = v4()
        player.admin = true 
        x.preventDefault()
        const password = isPrivate? x["target"][4].value : null
        await setDoc(doc(FS, "rooms", lobbyId), {
            Name:x["target"][0].value,
            players:[],
            data:{
                state:"awaiting",
                turn:1,
                maxPoints:x["target"][1].value,
                maxPlayer:x["target"][2].value,
                password:password,
            },
            waiting:[],
            id:lobbyId
        });
        joinRoom(lobbyId)
    }

    const joinRoom = async(joinroomid) =>{
        await setDoc(doc(FS, "rooms", joinroomid), {players:arrayUnion(player)},{merge:true});//maybe move this into tabs.js
        window.location = (`game?roomId=${joinroomid}`);
    }

    return (
        <div>
            <div className='btn' datatext="Get_A_room" onClick={()=>setPopupOn(!popupOn)}>Get_A_room</div>
            <Popup trigger={popupOn} setTrigger={setPopupOn}>                
                <form onSubmit={createRoom} autoComplete='off' action="game">
                    <h1>Room details:</h1>
                    <p style={{margin:"0"}}><input required ref={roomRef} className="input" name="Lobbyname" id="Lobbyname" placeholder="Lobby name"/></p>
                    <h1 style={{margin:"0"}}>Score limit:<input type="number" className="input" name="ScoreMax" id="ScoreMax" defaultValue="8" /></h1>
                    <h1 style={{margin:"0"}} >player limit:<input type="number" className="input" name="playerMax" id="playerMax" defaultValue="10" /></h1>
                    <div className="checkbox" style={{marginBottom:"1em"}}>
                        <input type="checkbox" id="private" name="private" onClick={()=>setIsPrivate(!isPrivate)}/>
                        <label htmlFor="private" style={{color:"white", fontSize:"larger", fontWeight:"bold"}}>require password</label>
                    </div>
                    {isPrivate? <p><input required className="input" name="password" id="password" placeholder="password"/></p> : ""}
                    <button className='btn' type='submit' datatext="create">create</button>
                </form>
            </Popup>
            <div style={{display:"flex", width:"100%",flexDirection:"column",alignItems:"center"}}>
                <h1>rooms</h1>
                {
                    roomsList?.map((room, index)=>(
                        <div key={room["Name"]} className="roomContainer" onClick={()=>joinRoom(room.data.id)}>
                            <h1 style={{marginLeft:"1em"}}>{index+1}.{room["Name"]}</h1>
                            <p style={{color:"white", margin:"0", marginLeft:"2em"}}>players: {room.players.length}/{room.data.maxPlayer}</p>
                            <p style={{color:"white", margin:"0", marginLeft:"2em"}}>State: {room.data.state}</p>
                            <p style={{color:"white", margin:"0", marginLeft:"2em", marginBottom:"1em"}}>{room.data.password? "private lobby" : "open"}</p>
                        </div>
                        ))
                }
            </div>
        </div>
    )
}
//note to self, make the rooms look better