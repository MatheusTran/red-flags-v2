import React from "react"
import io from "socket.io-client"
import useLocalStorage from "../hooks/useLocalStorage";
import Header from './Header';
import Username from "./username"
import Rooms from "./Rooms"

//note to self: for some reason downgrading socket.io to 2.4.0 fixes the bug
const socket = io.connect("http://localhost:9000/")
const subs = ["so... You come here often?","Because NBs only date Samurai's from the early 1950s", "Because guys only date bitchy bimbos","Because girls only date assholes", "It's about to you fell in love", "Just give up and settle", "stop being picky and just choose one", "j;asghklfasa;wh", "time to fall in love", "Your best chance at marriage", "let's face it, you don't have any better options", "your mom really worries about you", "there's got to be at least one fish in the sea"]

function App() {
  const [user, setUser] = useLocalStorage("user")
  return (
    <div className="container">
      <div id="bg"></div>
      {user? <Rooms/>:<div><Header text={subs[Math.floor(Math.random()*subs.length)]}/> <Username onUserSubmit={setUser}/></div>}
    </div>
  );
}

export default App;
