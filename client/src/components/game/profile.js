import React from 'react'
import Carousel from "nuka-carousel";


function Profile(props) {
    return (
        <div>
            <Carousel>
                <div className='card presented profile' style={{background: ` url(${props.cards[0].url})`,backgroundSize:"cover", backgroundPosition:"center"}}>
                </div>
                <div className='white card presented'>
                    {props.cards[1].text}
                </div>
                <div className='white card presented'>
                    {props.cards[2].text}
                </div>
                <div className='red card presented'>
                    {props.cards[3].text}
                </div>
            </Carousel>
            <h1>{props.cards[0].name}</h1>
            <h2>brought to you by {props.name}</h2>
        </div>
    )
}

export default Profile