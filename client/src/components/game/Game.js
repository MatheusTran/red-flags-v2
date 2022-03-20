import React, { useState } from "react"
import useLocalStorage from "../../hooks/useLocalStorage";
import {SocketProvider} from "../socket"
import Hotbar from "./Hotbar";
import Popup from '../Popup'
import queryString from "query-string"

import {initializeApp} from "firebase/app";
import {getFirestore, doc} from "firebase/firestore";
import axios from "axios";

import {useDocumentData} from "react-firebase-hooks/firestore"

initializeApp({
    apiKey: process.env.REACT_APP_firebase_api,
    authDomain: "red-flags-v2.firebaseapp.com",
    projectId: "red-flags-v2",
    storageBucket: "red-flags-v2.appspot.com",
    messagingSenderId: "35160152967",
    appId: "1:35160152967:web:6d106eec111e58897d1122",
    measurementId: "G-1GQK9YKCNK"
})

const FS = getFirestore();

//note: flickerAPI = $.getJSON("http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?",{tags: "Human",tagmode: "any",format: "json"})
//you can change the tag, the links are in responseJSON and

//important!!!!:
//https://stackoverflow.com/questions/61297769/how-to-hide-api-key-and-still-run-heroku-app

//note to self: for some reason downgrading socket.io to 2.4.0 fixes the bug
const APIKey = process.env.REACT_APP_imgur_api
function Game() { 
    const [user] = useLocalStorage("user")
    const [popupOn, setPopupOn] = useState(()=>false);

    var data = queryString.parse(window.location.search);
    const [room] = useDocumentData(doc(FS, "rooms", data.roomId))

    function action(){//come back to this later
        setPopupOn(!popupOn)
        axios.request({
            url: `https://www.flickr.com/services/rest/?method=flickr.photos.getRecent&api_key=${APIKey}&tags=human&format=json&tagmode=any&per_page=10`,
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
            <Hotbar QS={data} players={room?.players}/>
        </SocketProvider>

    );
}

export default Game;
