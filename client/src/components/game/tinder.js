import React, { useState } from 'react'
import { useData } from './dataProvider'
import Profile from './profile'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faHeart } from '@fortawesome/free-solid-svg-icons'

function Tinder() {
    const { room } = useData()
    const [num, setNum] = useState(1)
    const mock = [
    [
        {url:"https://images.unsplash.com/photo-1514924801778-1db0aba75e9b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=934&q=80", name:"test"},
        {text:"this is the first card", color:"white"},
        {text:"this is a white card", color:"white"},
        {text:"this is a red card", color:"red"}
    ],
    [
        {url:"https://images.unsplash.com/photo-1522263842439-347f062b8475?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=934&q=80", name:"another one"},
        {text:"this is the first card", color:"white"},
        {text:"this is a white card", color:"white"},
        {text:"this is a red card", color:"red"}
    ],
    [
        {url:"https://cdn.cnn.com/cnnnext/dam/assets/160725131446-graham-car-crash-evolved-human-full-169.jpeg", name:"second person"},
        {text:"this is another person", color:"white"},
        {text:"thingy ma bob", color:"white"},
        {text:"boob", color:"red"}
    ]
]
    function next(){
        setNum(()=>{
        if(num>=mock.length-1)return 1
        return num+1
        })
    }
    return (
        <>
        {
        room?.data.state==="pick"?
        <div style={{width:"100%", height:"100%",top:"0", position:"fixed", zIndex:"30", background:"rgba(0,0,0,0.75)", left:"0"}}>
            <div style={{position:"fixed", width:"500px", background:"white", borderRadius:"5%", height:"100%", left:"50%", transform:"translateX(-50%)"}}>
                <div style={{display:"grid"}}>
                    {room.order.map((profile, index)=>(
                        <Profile key={"profile "+index} cards={profile.fish.cards} name={profile.username} index={mock.length-index} mount={index>=num-1}/>
                    ))}
                </div>
                <div style={{display:"flex", flexDirection:"row", height:"auto", width:"100%", alignItems:"center", justifyContent:"center"}}>
                    <div className='circle'><FontAwesomeIcon size="2xl" icon={faXmark} style={{color:"rgb(254,133,113)"}} onClick={()=>{next()}}/></div>
                    <div className='circle'><FontAwesomeIcon size="2xl" icon={faHeart} style={{color:"rgb(159, 226,191)"}}/></div>
                </div>
            </div>
        </div>:""
    }
    </>
    )
}

export default Tinder