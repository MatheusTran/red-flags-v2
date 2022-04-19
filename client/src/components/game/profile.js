import React from 'react'
import Carousel from "nuka-carousel";
import { Transition } from "@mantine/core";

function Profile(props) {
    return (
        <Transition mounted={props.mount} transition="slide-right" duration={500} timingFunction="easeIn">
            {(styles)=>(
            <div style={{...styles,textAlign:"left", padding:"1em", gridColumn:"1", gridRow:"1", zIndex:props.index}}>
                <div style={{border:"solid 2px whitesmoke",background:"white", padding:"0.5em", borderRadius:"5%"}}>
                    <Carousel wrapAround={true}>
                        <div className="profile-card">
                            <div className='card presented profile' style={{background: ` url(${props.cards[0]?.url})`,backgroundSize:"cover", backgroundPosition:"center", color:"rgba(0,0,0,0)"}}>
                                .{/*this period is just to format this card correctly */}
                            </div>
                        </div>
                        <div className="profile-card">
                            <div className='white card presented'>
                                {props.cards[1]?.text}
                            </div>
                        </div>
                        <div className="profile-card">
                            <div className='white card presented'>
                                {props.cards[2]?.text}
                            </div>
                        </div>
                        <div className="profile-card">
                            <div className='red card presented'>
                                {props.cards[3]?.text}
                            </div>
                        </div>
                    </Carousel>
                    <h1 style={{color:"black", marginBottom:"0"}}>{props.cards[0]?.name}</h1>
                    <h3 style={{color:"gray", marginTop:"0"}}>brought to you by {props.name}</h3>
                </div>
            </div>
            )}
        </Transition>
    )
}

export default Profile