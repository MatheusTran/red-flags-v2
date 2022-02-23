import React, { useState, useEffect } from "react"
import io from "socket.io-client"
import queryString from "query-string"
import useLocalStorage from "../../hooks/useLocalStorage";

//note to self: for some reason downgrading socket.io to 2.4.0 fixes the bug
let socket = io.connect("http://localhost:9000/"); 

function Game() {
    const [user, setUser] = useLocalStorage("user")
    useEffect(()=>{
        const data = queryString.parse(window.location.search)
        console.log(socket)
        socket.emit("gamejoin", data.roomId, user)
    },[user])

    return (
        <div>
            <div id="bg"></div>
            <h1>welcome to room</h1>
        </div>
    );
}

export default Game;
