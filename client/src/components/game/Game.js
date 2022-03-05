import React, { useState } from "react"
import useLocalStorage from "../../hooks/useLocalStorage";
import {SocketProvider} from "../socket"
import Hotbar from "./Hotbar";
import Popup from '../Popup'


//note: flickerAPI = $.getJSON("http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?",{tags: "Human",tagmode: "any",format: "json"})
//you can change the tag, the links are in responseJSON and

//important!!!!:
//https://stackoverflow.com/questions/61297769/how-to-hide-api-key-and-still-run-heroku-app

//note to self: fix the input fields for the custom cards

//note to self: for some reason downgrading socket.io to 2.4.0 fixes the bug
const APIKey = ""
function Game() {
    const [user] = useLocalStorage("user")
    const [popupOn, setPopupOn] = useState(()=>false);

    function action(){//come back to this later
        setPopupOn(!popupOn)
        fetch(`https://www.flickr.com/services/rest/?method=flickr.photos.getRecent&api_key=${APIKey}&tags=human&format=json&tagmode=any&per_page=10`).then(
            (response)=>{
                console.log(response)
                return response
            }
        ).then((x)=>{
            let array = x.photos.photos.map((pic) =>{
                var url = `https://farm${pic.farm}.static.flickr.com/${pic.server}/${pic.id}_${pic.secret}.jpg`
                return (
                    <img alt="test" src={url}/>
                )
            })
            console.log(array)
        })
    }

    return (
        <SocketProvider name={user}>
            <div>
                <div id="bg"></div>
                <h1>working on making the rooms</h1>
                <div className="btn" datatext="stuff" onClick={action}>stuff</div>
                <Popup trigger={popupOn} text="create" setTrigger={setPopupOn}>
                    <div>
                        stuff?
                    </div>
                </Popup>
            </div>
            <Hotbar userId="whatevs"/>
        </SocketProvider>

    );
}

export default Game;
