import React from 'react'
import DiceBear from "../DiceBear"
const temp = <select size="5"><option className="player">Player</option></select>

export default function Scoreboard() {//this might have to take in the room data
    const textStyle = {textAlign:"left", fontSize:"15px", display:"flex"}
    const mockPlayers = [{userName:"matheus",icon:"test",points:4},{userName:"Scaevitas",icon:"bleh",points:1},{userName:"Mat A Door",icon:"poaewr",points:8},{userName:"hurder",icon:"Matheus",points:0}]
    return (
        <div className="players-menu">
            <p>score</p>
            <div className='players-list'>
            {mockPlayers.map(player => (
                        <div className="player">
                            <DiceBear seed={player.icon}/>
                            <div style={textStyle}>{player.userName}<br/>{player.points} point{player.points===1?"":"s"}</div>
                        </div>
                    ))}
            </div>

        </div>
    )
}
