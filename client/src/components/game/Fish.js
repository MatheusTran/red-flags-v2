import React from 'react'
import { useData } from './dataProvider'
import { useSocket } from '../socket'

function Fish() {
    const { presentedFish, roomId } = useData()
    const socket = useSocket()
    function reveal(index){
        console.log(presentedFish)
        socket.emit("reveal",roomId, index)
    }
    function getProfileStyle(){//I could turn this into a ternary operator like I did with the cards, but it's a bit hard to read. I might make the background a variable
        if(!presentedFish||JSON.stringify(presentedFish)==="{}")return {display:"none"}
        if(!presentedFish.cards[0].show){
            if(presentedFish.present){
                return {background: `linear-gradient(180turn,rgba(0,0,0,0.65),rgba(0,0,0,0)), url(${presentedFish?.cards[0].url})`, backgroundSize:"cover", backgroundPosition:"center", opacity:"0.5"}
            } else{
                return {display:"none"}
            }
        }
        return {background: `linear-gradient(180turn,rgba(0,0,0,0.65),rgba(0,0,0,0)), url(${presentedFish?.cards[0].url})`,backgroundSize:"cover", backgroundPosition:"center"}
    }
    return (
        <>
            <div onClick={()=>reveal(0)} className='card presented profile' style={getProfileStyle()}>
                <h1 style={{fontSize:"20px", marginTop:"auto", position:"absolute", bottom:"0", left:"0"}}>{presentedFish?.cards?" "+presentedFish.cards[0].name:""}</h1>
            </div>
            {presentedFish?.cards?.filter(
                (card,index)=>{
                    if(index)return card
                    return null
                }
            ).map((card, index)=>(
                <div onClick={()=>reveal(index+1)} key={"fish"+ index} className={card.color + " card presented"} style={presentedFish?.cards[index+1].show?{}:presentedFish.present?{opacity:"0.5"}:{display:"none"}}>
                    {card.text}
                </div>
            ))}
        </>
    )
}

export default Fish