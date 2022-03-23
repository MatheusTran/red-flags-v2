import React from 'react'
import {Transition} from "@mantine/core"

export default function Popup(props) {
    return (
        <Transition mounted={props.trigger} transition="slide-down" duration={500} timingFunction="easeIn">
            {(styles)=>
                <div style={{...styles, width:"100%", height:"100%",top:"0", position:"fixed", zIndex:"10"}}>
                    <div className='popup-container'>
                        {props.children}
                        <button className='close' onClick={() => props.setTrigger(false)}>X</button>
                    </div>
                </div>}
        </Transition>
    )
}
