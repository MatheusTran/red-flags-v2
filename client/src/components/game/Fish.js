import React from 'react'
import { useData } from './dataProvider'

function Fish() {
    const { presentedFish } = useData()
    return (
        <>
            <div className='card presented' style={{overflow:"hidden", maxWidth:"10.25rem", height:"9rem", backgroundImage:`url(${presentedFish.url})`,background:"linear-gradient(180turn,rgba(0,0,0,0.35),rgba(255,255,255,0))"}}>
                <h1 style={{fontSize:"20px", width:"100%", marginTop:"auto"}}>{presentedFish.name}</h1>
            </div>
            {presentedFish?.cards?.map((card, index)=>(
                <div key={"fish"+ index} className={card.color + " card presented"}>
                    {card.text}
                </div>
            ))}
        </>
    )
}

export default Fish