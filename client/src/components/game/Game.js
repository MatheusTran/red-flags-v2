import React, { useState, useEffect } from "react"
import queryString from "query-string"
import useLocalStorage from "../../hooks/useLocalStorage";
import {SocketProvider} from "../socket"
import Hotbar from "./Hotbar";
import socket from "socket.io-client/lib/socket";

//note to self: for some reason downgrading socket.io to 2.4.0 fixes the bug

function Game() {
    const [user, setUser] = useLocalStorage("user")
    useEffect(()=>{
        const data = queryString.parse(window.location.search)
        console.log(data)
        //socket.emit("gamejoin", data.roomId, user)
    },[user])
    return (
        <SocketProvider name={user}>
            <div>
                <div id="bg"></div>
                <h1>working on making the rooms</h1>
            </div>
            <Hotbar userId="whatevs"/>
        </SocketProvider>

    );
}

export default Game;
