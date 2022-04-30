import React from "react"
import useLocalStorage from "../../hooks/useLocalStorage";
import Header from './Header';
import Username from "./username"

//note to self: for some reason downgrading socket.io to 2.4.0 fixes the bug

function App() {
  const [user, setUser] = useLocalStorage("user")
  const [seed, setSeed] = useLocalStorage("seed")
  function create(a,b){
    setUser(a)
    setSeed(b)
    window.location = (`hallway`);
  }
  return (
    <div className="container">
      <div id="bg"></div>
      <div><Header/> <Username onUserSubmit={create}/></div>
    </div>
  );
}

export default App;
