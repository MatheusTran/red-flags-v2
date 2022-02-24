import React from 'react'

export default function Scoreboard() {//this might have to take in the room data
    return (
        <div className="players-menu">
            <p>score</p>
            <select size="5">
                <option className="player">Player</option>
            </select>
        </div>
    )
}
