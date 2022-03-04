import React, {useState} from 'react'

export default function Header() {
    const subs = ["According to all known laws of Aviation, a bee should not be able to fly...","So... You come here often?","Because NBs only date Samurai's from the early 1950s", "Because guys only date bitchy bimbos","Because girls only date assholes", "It's about to you fell in love", "Just give up and settle", "Stop being picky and just choose one", "j;asghklfasa;wnoibersnoiah", "Time to fall in love", "Your best chance at marriage", "Let's face it, you don't have any better options", "Your mom really worries about you", "There's got to be at least one fish in the sea"]
    const [sub, setSub] = useState(subs[Math.floor(Math.random()*subs.length)])
    
    
    return (
        <header style={{cursor:"pointer"}} onClick={()=>setSub(subs[Math.floor(Math.random()*subs.length)])}> 
            <h1 id="title"><a style={antiLink} href={"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAA1BMVEX/AAAZ4gk3AAAASElEQVR4nO3BgQAAAADDoPlTX+AIVQEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADwDcaiAAFXD1ujAAAAAElFTkSuQmCC"} className="neon">RED</a> FLAGS</h1>
            <h1 id="subtitle">
                {sub}
            </h1>
        </header>
    )
}
const antiLink = {
    textDecoration:"none",
    color:"white"
}
