const { connect } = require("http2");
const cards = require("./misc/cards.json");

const app = require("express")()
const server = require("http").createServer(app)
const io = require("socket.io")(server)

function randint(n){
    return Math.floor(Math.random() * (n));
};

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