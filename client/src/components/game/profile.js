import React from 'react'
import Carousel from "nuka-carousel";

function Profile(props) {
    console.log(props.cards)
    return (
        <div style={{textAlign:"left", padding:"1em"}}>
            <div style={{border:"solid 1px black", padding:"0.5em", borderRadius:"5%"}}>
                <Carousel>
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
                <h2 style={{color:"gray", marginTop:"0"}}>brought to you by {props.name}</h2>
            </div>
        </div>
    )
}

export default Profile