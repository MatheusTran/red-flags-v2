import useLocalStorage from "../../hooks/useLocalStorage";
import {SocketProvider} from "../socket"
import queryString from "query-string"
import Tabs from "./tabs";
import Scoreboard from "./Scoreboard";
import { NotificationsProvider } from '@mantine/notifications';

import {initializeApp} from "firebase/app";
import {getFirestore, doc} from "firebase/firestore";

import {useDocumentData} from "react-firebase-hooks/firestore"
import React from "react";

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
function Game() { 
    const [user] = useLocalStorage("user")

    var data = queryString.parse(window.location.search);
    const [room] = useDocumentData(doc(FS, "rooms", data.roomId))

    //hotbar component is not really useful
    return (
        <SocketProvider name={user}>
            <NotificationsProvider position="top-right" limit={3}>
                <div>
                    <div id="bg"></div>
                </div>
                <div id="lower-half">
                    <Scoreboard players={room?.players}/>
                    <Tabs QS={data}/>
                </div>
            </NotificationsProvider>
        </SocketProvider>

    );
}

export default Game;
