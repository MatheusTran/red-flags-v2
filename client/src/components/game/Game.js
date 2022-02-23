import React from "react"
import io from "socket.io-client"

//note to self: for some reason downgrading socket.io to 2.4.0 fixes the bug
const socket = io.connect("http://localhost:9000/")

function Game() {
    return (
        <div>
            <div id="bg"></div>
            Hello
        </div>
    );
}

export default Game;
