import { useState, useEffect } from "react";
import { useSocket } from '../socket'



function Tabs() {
    const [toggleState, setToggleState] = useState(1);
    const [whiteCards, setWhiteCards] = useState([])
    const [redCards, setRedCards] = useState([])

    const toggleTab = (index) => setToggleState(index);
    const socket = useSocket()
    function pull(color, array, setArray){
        if (array.length>=10) return
        socket.emit("pull", {color:color}, (card)=>{
            setArray((prevCards)=>{return [...prevCards, card]})
            
        })
    }
    useEffect(()=>{
        if (socket==null) return
        pull("white", whiteCards, setWhiteCards)
    },[socket, whiteCards])

    useEffect(()=>{
        if (socket==null) return
        pull("red", redCards, setRedCards)
    },[socket, redCards])

    return (
        <div className="tabs-container">
        <div className="bloc-tabs">
            <button
            className={toggleState === 1 ? "tabs active-tabs" : "tabs"}
            onClick={() => toggleTab(1)}
            >
            white cards
            </button>
            <button
            className={toggleState === 2 ? "tabs active-tabs" : "tabs"}
            onClick={() => toggleTab(2)}
            >
            red cards
            </button>
        </div>

        <div className="content-tabs">
            <div
            className={(toggleState === 1 ? "content  active-content" : "content")}
            >
                <div className="scrollmenu hand">
                    {whiteCards.map(card => (
                        <div className="white card">
                            {card.text}
                            {card.Custom ? <input className="custom" placeholder="Custom text"/>:""}
                        </div>
                    ))}

                </div>
            </div>

            <div
            className={(toggleState === 2 ? "content  active-content" : "content")}
            >
                <div className="scrollmenu hand">
                    {redCards.map(card => (
                        <div className="red card">
                            {card.text}
                            {card.Custom ? <input className="custom" placeholder="Custom text"/>:""}
                        </div>
                    ))}
                </div>
            </div>
        </div>
        </div>
    );
}

export default Tabs;