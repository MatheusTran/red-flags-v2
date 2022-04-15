import React from 'react'
import Carousel from "nuka-carousel";

function Profile(props) {
    console.log(props.cards)
    const center = {width:"100%", height:"100%", display:"flex", alignItems:"center", justifyContent:"center"}
    return (
        <div>
            <Carousel>
                <div style={center}>
                    <div className='card presented profile' style={{background: ` url(${props.cards[0]?.url})`,backgroundSize:"cover", backgroundPosition:"center"}}>
                    </div>
                </div>
                <div style={center}>
                    <div className='white card presented'>
                        {props.cards[1]?.text}
                    </div>
                </div>
                <div style={center}>
                    <div className='white card presented'>
                        {props.cards[2]?.text}
                    </div>
                </div>
                <div style={center}>
                    <div className='red card presented'>
                        {props.cards[3]?.text}
                    </div>
                </div>
            </Carousel>
            <h1>{props.cards[0]?.name}</h1>
            <h2>brought to you by {props.name}</h2>
        </div>
    )
}

export default Profile