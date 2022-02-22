const app = require("express")()
const server = require("http").createServer(app)
const io = require("socket.io")(server)

function randint(n){
    return Math.floor(Math.random() * (n));
};

io.on("connection", socket =>{
    console.log("connection established with: " + socket.id);
    
    socket.on("disconnect", ()=>{
        console.log(socket.id + " has left")
    }) 
});



const PORT = process.env.PORT || 9000;
server.listen(PORT, () => console.log(`\n\x1b[32m[server]\x1b[0m running on port: \x1b[33m${PORT}\x1b[0m \n`));