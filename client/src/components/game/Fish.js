import React from 'react'
import { useData } from './dataProvider'

function Fish() {
    const { presentedFish } = useData()
    
    function getProfileStyle(){//I could turn this into a ternary operator like I did with the cards, but it's a bit hard to read. I might make the background a variable
        if(!presentedFish)return
        if(!presentedFish.show){
            if(presentedFish.present){
                return {background: `linear-gradient(180turn,rgba(0,0,0,0.65),rgba(0,0,0,0)), url(${presentedFish.url})`, opacity:"0.5"}
            } else{
                return {display:"none"}
            }
        }
        return {background: `linear-gradient(180turn,rgba(0,0,0,0.65),rgba(0,0,0,0)), url(${presentedFish.url})`}
    }
    return (
        <>
            <div className='card presented profile' style={getProfileStyle()}>
                <h1 style={{fontSize:"20px", marginTop:"auto", position:"absolute", bottom:"0", left:"0"}}>{presentedFish.name}</h1>
            </div>
            {presentedFish?.cards?.map((card, index)=>(
                <div key={"fish"+ index} className={card.color + " card presented"} style={presentedFish.show?{}:presentedFish.present?{opacity:"0.5"}:{display:"none"}}>
                    {card.text}
                </div>
            ))}
        </>
    )
}

export default Fish