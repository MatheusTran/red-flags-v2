import React from 'react'
import { useData } from './dataProvider'
import { Profile } from './profile'

function Tinder() {
    const { room } = useData()
    const mock = [
        {url:"", name:"test"},
        {text:"this is the first card"},
        {text:"this is a white card"},
        {text:"this is a red card"}
    ]
    return (
        <>
        {
        room?.data.state==="pick"?
        <div style={{width:"100%", height:"100%",top:"0", position:"fixed", zIndex:"30", background:"rgba(0,0,0,0.75)", left:"0"}}>
            <div style={{position:"fixed", width:"500px", background:"white", borderRadius:"5%", height:"100%", left:"50%", transform:"translateX(-50%)"}}>
                {room.order.map((fish, index)=>(
                    <Profile key={"profile" + index} cards={fish} name={"mock user"}/>
                ))}
            </div>
        </div>:""
    }
    </>
    )
}

export default Tinder