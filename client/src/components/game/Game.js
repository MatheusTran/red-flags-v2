import useLocalStorage from "../../hooks/useLocalStorage";
import {SocketProvider} from "../socket"
import Tabs from "./tabs";
import Scoreboard from "./Scoreboard";
import { NotificationsProvider } from '@mantine/notifications';
import { DataContext } from "./dataProvider";

import {initializeApp} from "firebase/app";
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

//important!!!!:
//https://stackoverflow.com/questions/61297769/how-to-hide-api-key-and-still-run-heroku-app

//note to self: for some reason downgrading socket.io to 2.4.0 fixes the bug
function Game() { 
    const [user] = useLocalStorage("user")//propbably not needed, might remove this later
    //hotbar component is not really useful
    return (
        <SocketProvider name={user}>
            <NotificationsProvider position="top-right" limit={3}>
                <div>
                    <div id="bg"></div>
                </div>
                <DataContext>
                    <div id="lower-half">
                        <Scoreboard/>
                        <Tabs/>
                    </div>
                </DataContext>
            </NotificationsProvider>
        </SocketProvider>
    );
}

export default Game;
