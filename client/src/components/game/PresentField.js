import React, {useState} from 'react'
import axios from "axios";
import Popup from '../Popup';
import { useSocket } from '../socket';
import { useNotifications } from '@mantine/notifications';



function PresentField(props) {
    const [popupOn, setPopupOn] = useState(()=>false);
    const socket = useSocket()
    const notifications = useNotifications()
    socket?.on("stfu errors")//this is just here to shut the errors up
    console.log(props.room)//take this out later
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
                }
                break;
            case "white":
                getImages();
                break;
            default:
                break;
        }
    }

    function getImages(){//come back to this later
        setPopupOn(!popupOn)
        let query = "humans"
        axios.request({
            url: `https://www.flickr.com/services/rest/?method=flickr.photos.getRecent&api_key=${process.env.REACT_APP_imgur_api}&tags=${query}&format=json&tagmode=any&per_page=10`,
            method: 'GET'
        }).then(res => {
            let x = res.data;
            x = (JSON.parse(x.substring(14,(x.length-1))))
            let array = x.photos.photo.map((pic) =>{
                var url = `https://farm${pic.farm}.static.flickr.com/${pic.server}/${pic.id}_${pic.secret}.jpg`
                return (<img alt="test" src={url}/>)
            })
            console.log(array)
        })
    }
    return (
        <div id="upper-half">
                    <h2>{props.topText}</h2>
                    <div>
                        {props.children}
                    </div>
            {props.mountButton? <div className="btn" datatext={props.buttonName} onClick={action}>{props.buttonName}</div> : ""}
            <Popup trigger={popupOn} text="create" setTrigger={setPopupOn}>
                    <div>
                        stuff?
                    </div>
            </Popup>
        </div>
    )
}

export default PresentField