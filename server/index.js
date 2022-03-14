const { connect } = require("http2"); //not sure what this is, I think I will remove it
const cards = require("./misc/cards.json");

const app = require("express")()
const server = require("http").createServer(app)
const io = require("socket.io")(server)

const admin = require("firebase-admin")
const serviceAccount = require("./firestore_key.json")
const FieldValue = require('firebase-admin').firestore.FieldValue;

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
})

const db = admin.firestore()

function randint(n){
    return Math.floor(Math.random() * (n));
};

const userToSocket = {}

io.on("connection", socket =>{
    socket.on("gamejoin", (roomId, userId)=>{
        userToSocket[socket.id] = {userId,roomId}
    });
    socket.on("pull", ({color},callback)=>{ 
        var random = randint(cards[color].length)
        callback(cards[color][random])
    });



    socket.on("disconnect", ()=>{
        console.log(socket.id + " has left")
        const data = userToSocket[socket.id] 
        let docRef = db.collection("rooms").doc(data.roomId); 
        (async ()=>{
            const doc = await docRef.get();
            quiter = doc.data()["players"].find(user => user.id == data.userId)
            if(doc.data()["players"].length <= 1){
                await docRef.delete()
            }else{
                await docRef.update({players:FieldValue.arrayRemove(quiter)}) 
            }
        })();
    }) 
});
//the env port checks if there is an environmental variable
const PORT = process.env.PORT || 9000;
server.listen(PORT, () => console.log(`\n\x1b[32m[server]\x1b[0m running on port: \x1b[33m${PORT}\x1b[0m \n`));