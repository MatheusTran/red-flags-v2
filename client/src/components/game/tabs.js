import React, { useState, useEffect, useCallback } from "react";
import { useSocket } from '../socket'
import useLocalStorage from "../../hooks/useLocalStorage";
import PresentField from "./PresentField";
import {DragDropContext, Droppable, Draggable} from "react-beautiful-dnd"

function Tabs(props) {
    const [toggleState, setToggleState] = useState(1);
    const [whiteCards, setWhiteCards] = useState([])
    const [redCards, setRedCards] = useState([])
    const [whiteDupe, setWhiteDupe] = useState(false)
    const [redDupe, setRedDupe] = useState(false) 
    const [present, setPresent] = useState([])

    const toggleTab = (index) => setToggleState(index);
    const socket = useSocket()
    const [id] = useLocalStorage("id")
    const [seed] = useLocalStorage("seed")
    const [username] = useLocalStorage("user")

    useEffect(()=>{
        if(socket==null)return

        //need to add seed, username. Score is set to 0 anyways
    },[socket, id, props.QS, seed, username]) 

    function dupe(card, array, setDupe){
        const cardString = JSON.stringify(card)//the (Custom card)s have an "n" value that makes them different when stringified
        for(let x=0;x<array.length;x++){
            if (cardString===JSON.stringify(array[x])){
                setDupe(true)
                return true
            }
        }
        setDupe(false)
        return false
    }

    const pull = useCallback((color, array, setArray, setDupe)=>{
        socket.emit("pull", {color:color}, (card)=>{
            if(dupe(card, array, setDupe))return//I think it is fixed, not sure
            setArray((prevCards)=>{return [...prevCards, card]})
        })
    },[socket])

    useEffect(()=>{
        console.log(socket)
        if (socket==null)return
        const data = props.QS
        socket.emit("gamejoin", data.roomId, id, username, seed)
        socket.on("init", ()=>{
            for(let x=0; x<15; x++){
                pull("white", whiteCards, setWhiteCards, setWhiteDupe)
            }
            for(let x=0; x<10; x++){
                pull("red", redCards, setRedCards, setRedDupe)
            }
        })
    },[socket])

    useEffect(()=>{
        if (whiteDupe===true){
            pull("white", whiteCards, setWhiteCards, setWhiteDupe)
        }
        if (redDupe===true){
            pull("red", redCards, setRedCards, setRedDupe)
        }
    }, [whiteDupe,redDupe])

    function play(setCards,cards, card){
        const text = card.text
        setCards(cards.filter(item => item.text !== text));
    }

    function limit(e){//it's a limit function... ba dum tss
        if(e.target.innerText.length >=36 && e.key!=="Backspace")e.preventDefault()
    }
    function reOrder(result, array){
        const items = Array.from(array)
        const [reorderedItem] = items.splice(result.source.index, 1)
        items.splice(result.destination.index, 0, reorderedItem)
        console.log(items)
        return items
    }
    function handleDragEnd(result){
        console.log(result)
        switch (result.destination.droppableId){
        case "white":
            setWhiteCards(reOrder(result, whiteCards))
            break;
        case "present":
            setPresent(reOrder(result, present))
            break;
        default:
            return
        }
    }

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <PresentField>
                {/*this is where the cards go*/}
            </PresentField>
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
                        <Droppable droppableId="white" direction="horizontal">
                            {(provided)=>(
                            <div className="scrollmenu hand" {...provided.droppableProps} ref={provided.innerRef}>
                                {whiteCards.map((card,index) => {return (
                                    <Draggable key={"white "+index} draggableId={"white "+index} index={index}>
                                        {(provided)=>(
                                            <div {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef} className="white card" onDoubleClick={()=>{play(setWhiteCards,whiteCards,card)}}>
                                                {card.text}
                                                {card.Custom ? <span contentEditable="true" onKeyDown={e => limit(e)}></span>:""} 
                                            </div>
                                        )}
                                    </Draggable>
                                )})}
                                {provided.placeholder} 
                            </div>
                            )}
                        </Droppable>
                    </div>

                <div
                className={(toggleState === 2 ? "content  active-content" : "content")}
                >
                    <div className="scrollmenu hand">
                        {redCards.map((card,index) => (
                            <div className="red card" onDoubleClick={()=>{play(setRedCards,redCards,card)}} key={"red "+index}>
                                {card.text}
                                {card.Custom ? <span contentEditable="true" onKeyDown={e => limit(e)}></span>:""}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            </div>
        </DragDropContext>
    );
}

export default Tabs;