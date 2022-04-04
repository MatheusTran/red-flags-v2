import React, {useState, useRef, useEffect, useTransition, useMemo} from 'react'
import Popup from '../Popup'
import { v4 } from "uuid"
import useLocalStorage from "../../hooks/useLocalStorage";

import {initializeApp} from "firebase/app";
import {getFirestore, setDoc, doc, collection} from "firebase/firestore";

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
    const [searchRoom, setSearchRoom] = useState("")
    const [isPending, startTransition] = useTransition()

    useEffect(()=>{
        setId(v4())
    },[setId])

    let player = {username:user, score:0, admin:false, played:[], seed:seed, id:id}//note to self, create an id

    const [roomsList] = useCollectionData(collection(FS,"rooms"))
    const filteredRooms = useMemo(()=>{
        return roomsList?.filter((room) =>{//filters the room listings. Also ignore this error message
            if(searchRoom===""){
                return(room)
            } else if (room.Name.toLowerCase().includes(searchRoom.toLowerCase())){
                return(room)
            }
        })
    }, [searchRoom, roomsList])

    const createRoom = async(x) => { //this should propbably be in index js as well
        const lobbyId = v4()
        player.admin = true 
        x.preventDefault()
        const password = isPrivate? x["target"][4].value : null
        await setDoc(doc(FS, "rooms", lobbyId), {
            Name:x["target"][0].value,
            players:[],
            data:{
                state:"awaiting",
                turn:0,
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
        //await setDoc(doc(FS, "rooms", joinroomid), {players:arrayUnion(player)},{merge:true});//maybe move this to index.js
        window.location = (`game?roomId=${joinroomid}`);
    }

    function search(e){
        startTransition(()=>{
            console.log(searchRoom)
            setSearchRoom(e.target.value)
        })
    }

    return (
        <div>
            <div className='btn' datatext="Get_A_room" onClick={()=>setPopupOn(!popupOn)}>Get_A_room</div> {/* maybe this should be in a side menu with other options, like look at all cards, change username, github page, etc*/}
            <Popup trigger={popupOn} setTrigger={setPopupOn}>                
                <form onSubmit={createRoom} autoComplete='off' action="game">
                    <h1>Room details:</h1>
                    <p style={{margin:"0"}}><input required ref={roomRef} className="input" name="Lobbyname" id="Lobbyname" placeholder="Lobby name" maxLength={25}/></p>
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

            <div style={{display:"flex", width:"100%",flexDirection:"column",alignItems:"center", marginTop:"2em"}}>

                <input className="search_input" name="search" placeholder="Search..." autoComplete="off" onChange={(e)=>search(e)}/>
                
                {isPending? <h1 style={{position:"absolute", top:"50%"}}>please be patient while we look for your results</h1>:""} 
                
                {
                    filteredRooms?.length>0? filteredRooms.map((room, index)=>(
                        <div key={room.Name} className="roomContainer" onClick={()=>joinRoom(room.id)}>
                            <h1 style={{marginLeft:"1em"}}>{index+1}.{room.Name}</h1>{/*perhaps I can change this in the future?*/}
                            <p style={{color:"white", margin:"0", marginLeft:"2em"}}>players: {room.players.length}/{room.data.maxPlayer}</p>
                            <p style={{color:"white", margin:"0", marginLeft:"2em"}}>State: {room.data.state}</p>
                            <p style={{color:"white", margin:"0", marginLeft:"2em", marginBottom:"1em"}}>{room.data.password? "private lobby" : "open"}</p>
                        </div>
                        )) : <h1>Can not find any rooms, sorry. Make your own room</h1>
                }
            </div>
        </div>
    )
}
//note to self, make the rooms look better