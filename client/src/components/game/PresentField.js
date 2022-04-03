import React, {useState, useEffect} from 'react'
import axios from "axios";
import Popup from '../Popup';
import { useSocket } from '../socket';
import { useNotifications } from '@mantine/notifications';



function PresentField(props) {
    const [popupOn, setPopupOn] = useState(()=>false);
    const [pics, setPics] = useState([])
    const socket = useSocket()
    const notifications = useNotifications()
    const roomId = props.data //note to self, just remembered that I can access room id from the database aka props.room, I will look into this later

    useEffect(()=>{
        getImages("Humans")
    },[])

    function action(){
        switch(props.room.data.state){
            case "awaiting":
                if (props.room.players.length < 3){
                    notifications.showNotification({
                        title: 'Not enough players',
                        message: `You only need ${3-props.room.players.length} more ${(3-props.room.players.length)===1? 'person':'people'}. Get more friends, loser`,
                        color:"red",
                        style:{ textAlign: 'left' }
                    })
                    break;
                }
                socket.emit("increment", roomId)
                break;
            case "white":
                setPopupOn(!popupOn)
                break;
            default:
                break;
        }
    }

    function getImages(query){//come back to this later
        if (!query) query="Humans"
        query = query.replace(/ /g, "+")
        axios.request({
            url: `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=${process.env.REACT_APP_imgur_api}&tags=${query}&format=json&tagmode=any&per_page=10&sort=relevance`,
            method: 'GET'
        }).then(res => {
            let x = res.data;
            x = (JSON.parse(x.substring(14,(x.length-1))))
            let array = x.photos.photo.map((pic) =>{
                return (`https://farm${pic.farm}.static.flickr.com/${pic.server}/${pic.id}_${pic.secret}.jpg`)
            })
            setPics(array)
        })
    }
    function goFish(pic){
        const fish = {cards:props.cards, url:pic}
        socket.emit("submitFish", fish, roomId)
    }
    return (
        <div id="upper-half">
                    <h2>{props.topText}</h2>
                    <div>
                        {props.children}
                    </div>
            {props.mountButton? <div className="btn" datatext={props.buttonName} onClick={action}>{props.buttonName}</div> : ""}
            <Popup trigger={popupOn} text="create" setTrigger={setPopupOn}>
                <h2>choose a picture</h2>{/*I might add an input field here to add the name of the fish*/}
                <input className="input" name="search" id="search" onChange maxLength={12} autoComplete="off" placeholder="name of Fish"/>
                
                    <div className='scrollmenu' style={{spaceBetween:"5rem", padding:"1rem"}}>
                        {pics.map((pic)=>(
                            <div className="pfp" key={pic} onClick={()=>goFish(pic)}>
                                <img alt={pic} src={pic}/>
                            </div>
                        ))}
                    </div>
                    <input className="input" name="search" id="search" onChange={(e)=>getImages(e.target.value)} maxLength={25} autoComplete="off" placeholder="search"/>
            </Popup>
        </div>
    )
}

export default PresentField