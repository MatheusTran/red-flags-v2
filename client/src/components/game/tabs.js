import { useState, useEffect } from "react";
import { useSocket } from '../socket'
//import Drag from '../DragNDrop'

function Tabs() {
    const [toggleState, setToggleState] = useState(1);
    const [whiteCards, setWhiteCards] = useState([])
    const [redCards, setRedCards] = useState([])
    const [whiteDupe, setWhiteDupe] = useState(false)
    const [redDupe, setRedDupe] = useState(false) 
    //was thinking of doing things like [redDupe, setRedDupe] = [whiteDupe, setWhiteDupe] = useState(false), but not sure if that works

    const toggleTab = (index) => setToggleState(index);
    const socket = useSocket()

    function dupe(card, array, setDupe){
        const cardString = JSON.stringify(card)//the (Custom card)s have an "n" value that makes them different when stringified
        for(let x=0;x<array.length;x++){
            if (cardString===JSON.stringify(array[x])){
                setDupe(true)
                return true
            }
        }
        return false
    }

    function pull(color, array, setArray, setDupe){
        if (array.length>=10) return
        socket.emit("pull", {color:color}, (card)=>{
            if(dupe(card, array, setDupe))return
            setDupe(false)
            setArray((prevCards)=>{return [...prevCards, card]})
        })
    }

    function play(setCards,cards, card){
        const text = card.text
        setCards(cards.filter(item => item.text !== text));
    }

    useEffect(()=>{
        if (socket==null) return
        pull("white", whiteCards, setWhiteCards, setWhiteDupe)
    },[socket, whiteCards, whiteDupe])

    useEffect(()=>{
        if (socket==null) return
        pull("red", redCards, setRedCards, setRedDupe)
    },[socket, redCards, redDupe])

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
                        {whiteCards.map((card,index) => (
                            <div key={"white "+index} className="white card" onDoubleClick={()=>{play(setWhiteCards,whiteCards,card)}}>
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
                    {redCards.map((card,index) => (
                        <div className="red card" onDoubleClick={()=>{play(setRedCards,redCards,card)}} key={"red "+index}>
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