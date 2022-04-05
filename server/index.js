const cards = require("./misc/cards.json");

const app = require("express")()
const server = require("http").createServer(app)
const io = require("socket.io")(server)

const admin = require("firebase-admin")//note to self: may change to real time database in the future instead of firestore
const serviceAccount = require("./firestore_key.json")
const FieldValue = require('firebase-admin').firestore.FieldValue;

const phase = {awaiting:"white", white:"presenting", presenting:"red", red:"pick", pick:"pick"}

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
})

const db = admin.firestore()

function randint(n){
    return Math.floor(Math.random() * (n));
};

function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
    // While there remain elements to shuffle...
    while (currentIndex != 0) {
      // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
      // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}

const userToSocket = {}

io.on("connection", socket =>{
    socket.on("gamejoin", (roomId, userId, user, seed)=>{
        socket.emit("init")//I could make this a callback function but I prefer this method then we wouldn't have to wait for the documents
        userToSocket[socket.id] = {userId,roomId}
        socket.join(roomId)//adds user to room id
        let docRef = db.collection("rooms").doc(roomId);
        (async ()=>{
            const doc = await docRef.get();
            await docRef.update({"data.turn":FieldValue.increment(1)})
            try{
            if (doc.data()["players"].length > 0){// I will have to remove the try block, this is only here for test purposes
                await docRef.update({players:FieldValue.arrayUnion({username:user, score:0, admin:false, fish:{}, seed:seed, id:userId, swiper:false})})
            }else{
                await docRef.update({players:FieldValue.arrayUnion({username:user, score:0, admin:true, fish:{}, seed:seed, id:userId, swiper:false})})
            }
            } catch {
                console.log("this is just test stuff")
            }
        })();
    });

    socket.on("increment", (roomId)=>{
        let docRef = db.collection("rooms").doc(roomId);
        (async ()=>{
        const doc = await docRef.get();
        const current = doc.data()
        current["data"]["turn"]++
        if (current["data"]["turn"] >= current["order"].length){
            if (current["data"]["state"] === "awaiting"){
                current["players"][randint(current["players"].length)]["swiper"] = true
                current["order"] = current["players"].filter((user)=>{
                    if(!user.swiper)return {id:user.id,username:user.username,fish:[],}
                })
                shuffle(current["order"])
            }
            current["data"]["turn"] = 0
            current["data"]["state"] = phase[current["data"]["state"]]
            await docRef.update(current)
        } else {
            await docRef.update({"data.turn":FieldValue.increment(1)})
        }
        })();
    })

    socket.on("submitFish", ({fish, roomId}, callback)=>{
        let docRef = db.collection("rooms").doc(roomId);
        (async ()=>{
            const doc = await docRef.get()
            let current = doc.data()
            const data = userToSocket[socket.id]
            const index = current.order.indexOf(current.order.find(user =>user.id === data.userId))
            current.order[index]["fish"] = fish
            let left = current.order.length-current.data.turn-1
            await docRef.update({order:current.order})
            io.to(data.roomId).emit('notif', {
                title:`${current.order[index]["username"]} has submitted their fish`,
                message:(left)?`waiting on ${left} more player${(left)>1?"s":""}`:"now it is time to present thy fish!!!",
                color:"green",
                style:{ textAlign: 'left' }
            })
            callback()
        })();
    })

    socket.on("pull", ({color},callback)=>{ 
        var random = randint(cards[color].length)
        callback(cards[color][random])
    });

    socket.on("disconnect", ()=>{ //note to self: I have to remake the admin system
        const data = userToSocket[socket.id]
        if (data){
            let docRef = db.collection("rooms").doc(data.roomId); 
            (async ()=>{
                const doc = await docRef.get();
                const quiter = doc.data()["players"].find(user => user.id == data.userId)
                if(doc.data()["players"].length <= 1){ 
                    await docRef.delete()
                }else{
                    await docRef.update({players:FieldValue.arrayRemove(quiter)}) 
                } 
            })(); 
        } 
    }) 
});
//the env port checks if there is an environmental variable
const PORT = process.env.PORT || 9000;
server.listen(PORT, () => console.log(`\n\x1b[32m[server]\x1b[0m running on port: \x1b[33m${PORT}\x1b[0m \n`));