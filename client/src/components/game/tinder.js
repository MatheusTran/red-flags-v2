import React from 'react'
import { useData } from './dataProvider'
import Profile from './profile'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faHeart } from '@fortawesome/free-solid-svg-icons'

function Tinder() {
    const { room } = useData()
    const mock = [
        {url:"https://cdn.cnn.com/cnnnext/dam/assets/160725131446-graham-car-crash-evolved-human-full-169.jpeg", name:"test"},
        {text:"this is the first card", color:"white"},
        {text:"this is a white card", color:"white"},
        {text:"this is a red card", color:"red"}
    ]
    return (
        <>
        {
        room?.data.state!=="pick"?
        <div style={{width:"100%", height:"100%",top:"0", position:"fixed", zIndex:"30", background:"rgba(0,0,0,0.75)", left:"0"}}>
            <div style={{position:"fixed", width:"500px", background:"white", borderRadius:"5%", height:"100%", left:"50%", transform:"translateX(-50%)"}}>
                <Profile cards={mock} name={"Matheus"}/>
                {/*room.order.map((fish, index)=>(
                    <Profile key={"profile" + index} cards={fish} name={"mock user"}/>
                ))*/}
                <div style={{display:"flex", flexDirection:"row", height:"auto", width:"100%", alignItems:"center", justifyContent:"center"}}>
                    <div className='circle'><FontAwesomeIcon size="2xl" icon={faXmark} style={{color:"rgb(254,133,113)"}}/></div>
                    <div className='circle'><FontAwesomeIcon size="2xl" icon={faHeart} style={{color:"rgb(159, 226,191)"}}/></div>
                </div>
            </div>
        </div>:""
    }
    </>
    )
}

export default Tinder