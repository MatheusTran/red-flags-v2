import React from 'react'
import { useData } from './dataProvider'

function Fish() {
    const { presentedFish } = useData()
    return (
        <>
            <div className='card presented profile' style={presentedFish.present?{background: `linear-gradient(180turn,rgba(0,0,0,0.65),rgba(0,0,0,0)), url(${presentedFish.url})`}:{display:'none'}}>
                <h1 style={{fontSize:"20px", marginTop:"auto", position:"absolute", bottom:"0", left:"0"}}>{presentedFish.name}</h1>
            </div>
            {presentedFish?.cards?.map((card, index)=>(
                <div key={"fish"+ index} className={card.color + " card presented"} style={presentedFish.present?{opacity:"0.5"}:{display:"none"}}>
                    {card.text}
                </div>
            ))}
        </>
    )
}

export default Fish