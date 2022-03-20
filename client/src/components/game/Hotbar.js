//note to self ~43:00 loop through an array and append elements
//also create tabs for hotbar

import React from 'react'
import Scoreboard from "./Scoreboard"
import Tabs from './tabs'

export default function Hotbar(props) {
    return (
        <div id="lower-half">
            <Scoreboard players={props.players}/>
            <Tabs QS={props.QS}/>
        </div>
    )
}
