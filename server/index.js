const { connect } = require("http2"); //not sure what this is, I think I will remove it
const cards = require("./misc/cards.json");

const app = require("express")()
const server = require("http").createServer(app)
const io = require("socket.io")(server)

function randint(n){
    return Math.floor(Math.random() * (n));
};

const firebaseConfig = {
    apiKey: "AIzaSyDnl4uaPL3jUBBfETZLNUtsfIS-UcBxPQs",
    authDomain: "red-flags-v2.firebaseapp.com",
    projectId: "red-flags-v2",
    storageBucket: "red-flags-v2.appspot.com",
    messagingSenderId: "35160152967",
    appId: "1:35160152967:web:6d106eec111e58897d1122",
    measurementId: "G-1GQK9YKCNK"
};

tempDB = {} //this is only temporary as I figure out the whole database situation

io.on("connection", socket =>{
    socket.on("gamejoin", ({roomId, username, userId})=>{
        console.log(roomId, username, userId) 
        console.log(socket.id)
    });
    socket.on("pull", ({color},callback)=>{ 
        var random = randint(cards[color].length)
        callback(cards[color][random])
    });



    socket.on("disconnect", ()=>{
        console.log(socket.id + " has left")
    }) 
});
//the env port checks if there is an environmental variable
const PORT = process.env.PORT || 9000;
server.listen(PORT, () => console.log(`\n\x1b[32m[server]\x1b[0m running on port: \x1b[33m${PORT}\x1b[0m \n`));