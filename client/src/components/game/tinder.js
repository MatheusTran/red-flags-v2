import React, { useState, useEffect } from 'react'
import { useData } from './dataProvider'
import Profile from './profile'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faHeart } from '@fortawesome/free-solid-svg-icons'
import { useSocket } from '../socket'

function Tinder() {
    const { room, roomId } = useData()
    const [num, setNum] = useState(0)
    const socket = useSocket()
    function newNum(){
        if(num+1>=room.order.length)return 0
        return num+1
    }

    function next(){
        socket.emit("slide", roomId, newNum())
    }

    useEffect(()=>{
        if(!socket)return
        socket.on("change", (newNum)=>{
            setNum(newNum)
        })
    },[socket])
    

    return (
        <>
        {
        room?.data.state==="pick"?
        <div style={{width:"100%", height:"100%",top:"0", position:"fixed", zIndex:"30", background:"rgba(0,0,0,0.75)", left:"0"}}>
            <div style={{position:"fixed", width:"500px", background:"white", borderRadius:"5%", height:"100%", left:"50%", transform:"translateX(-50%)"}}>
                <div style={{display:"grid"}}>
                    {room.order.map((profile, index)=>(
                        <Profile key={"profile "+index} cards={profile.fish.cards} name={"Matheus"} index={room.order.length-index} mount={index>=num}/>
                    ))}
                </div>
                <div style={{display:"flex", flexDirection:"row", height:"auto", width:"100%", alignItems:"center", justifyContent:"center"}}>
                    <div className='circle'><FontAwesomeIcon size="2xl" icon={faXmark} style={{color:"rgb(254,133,113)"}} onClick={()=>{next()}}/></div>
                    <div className='circle'><FontAwesomeIcon size="2xl" icon={faHeart} style={{color:"rgb(159, 226,191)"}}/></div>
                </div>
            </div>
        </div>:""
    }
    </>
    )
}

export default Tinder