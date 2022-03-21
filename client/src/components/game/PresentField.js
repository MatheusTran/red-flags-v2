import React, {useState} from 'react'
import axios from "axios";
import Popup from '../Popup';
import { useSocket } from '../socket';


function PresentField() {
    const [popupOn, setPopupOn] = useState(()=>false);
    const socket = useSocket()
    console.log(socket)//this is just here to shut the errors up

    function action(){
        getImages();//this is only temporary
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
                    <h2>working on making the rooms</h2>
                    <div id="played-cards" className="scrollmenu">

                    </div>
            <div className="btn" datatext="stuff" onClick={action}>stuff</div>
            <Popup trigger={popupOn} text="create" setTrigger={setPopupOn}>
                    <div>
                        stuff?
                    </div>
            </Popup>
        </div>
    )
}

export default PresentField