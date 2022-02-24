//note to self ~43:00 loop through an array and append elements
//also create tabs for hotbar

import React, {useState, useEffect} from 'react'
import Username from '../home/username'
import { useSocket } from '../socket'
import Scoreboard from "./Scoreboard"

export default function Hotbar(props) {
    const socket = useSocket()
    const [cards, setCards] = useState([])
    function pull(color){
        if (cards.length>=10) return
        socket.emit("pull", {color:color}, (card)=>{
            setCards((prevCards)=>{
                return [...prevCards, {card, color}]
            })
        })
    }
    useEffect(()=>{
        if (socket==null) return
        pull("white")
        console.log(cards)
    },[socket, cards])
    return (
        <div id="lower-half">
            <Scoreboard/>
            <div className="scrollmenu" id="hand">
                <div className='red card'>test</div>
                <div className='red card'>test</div>
                <div className='red card'>test</div>
                <div className='red card'>test</div>
                <div className='red card'>test</div>
                <div className='red card'>test</div>
                <div className='red card'>test</div>
                <div className='red card'>test</div>
                <div className='red card'>test</div>
                <div className='red card'>test</div>
                <div className='red card'>test</div>

            </div>
        </div>
    )
}
