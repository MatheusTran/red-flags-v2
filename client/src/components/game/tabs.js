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
    const [present, setPresent] = useState([{"text":"Puts live butterflies in your stomach", "Custom": false}])

    const toggleTab = (index) => setToggleState(index);
    const socket = useSocket()
    const [id] = useLocalStorage("id")
    const [seed] = useLocalStorage("seed")
    const [username] = useLocalStorage("user")

    const pointer = {array:{white:whiteCards, red:redCards, present:present}, setArray:{white:setWhiteCards,red:setRedCards,present:setPresent}}

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

    function play(source,destination, index){
        let sudoResult = {source:{droppableId:source, index:index},destination:{droppableId:destination, index:0}}
        reOrder(sudoResult)
    }

    function limit(e){//it's a limit function... ba dum tss
        if(e.target.innerText.length >=36 && e.key!=="Backspace")e.preventDefault()
    }
    function reOrder(result){
        if(result.destination.droppableId === result.source.droppableId){
            const items = Array.from(pointer["array"][result.source.droppableId])
            const setItems = pointer["setArray"][result.source.droppableId]
            const [reorderedItem] = items.splice(result.source.index, 1)
            items.splice(result.destination.index, 0, reorderedItem)
            setItems(items)
        } else {
            const source = Array.from(pointer["array"][result.source.droppableId])
            const setSource = pointer["setArray"][result.source.droppableId]
            const destination = Array.from(pointer["array"][result.destination.droppableId])
            const setDestination = pointer["setArray"][result.destination.droppableId]
            const [removedItem] = source.splice(result.source.index, 1)
            destination.splice(result.destination.index, 0, removedItem)
            setSource(source)
            setDestination(destination)
        }
        
    }
    function handleDragEnd(result){
        console.log(present)
        switch (result.destination.droppableId){
        case "white":
            reOrder(result)
            break;
        case "present":
            reOrder(result)
            break;
        case "red":
            reOrder(result)
            break;
        default:
            return
        }
    }

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <PresentField>
                <Droppable droppableId="present" direction="horizontal">
                    {(provided)=>(
                        <div id="played-cards" className="scrollmenu" {...provided.droppableProps} ref={provided.innerRef} style={{width:"100%", backgroundColor:"green", height:"auto"}}>
                            {present.map((card,index) => {return (
                                <Draggable key={"present "+index} draggableId={"present "+index} index={index}>
                                    {(provided)=>(
                                        <div {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef} className="white card presented" onDoubleClick={()=>{play("present", "white",index)}}>
                                            {card.text}{/*note to self, I will have to change the class thing*/}
                                            {card.Custom ? <span contentEditable="true" onKeyDown={e => limit(e)}></span>:""} 
                                        </div> 
                                    )}
                                </Draggable>
                            )})}
                            <div className="white card" style={{maxWidth:"9rem", opacity:"0.5"}}>
                                this is a placeholder card
                            </div>
                            {provided.placeholder} 
                        </div>
                    )}
                </Droppable>
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
                                            <div {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef} className="white card" onDoubleClick={()=>{play("white","present",index)}}>
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
                    <Droppable droppableId="red" direction="horizontal">
                        {(provided)=>(
                        <div className="scrollmenu hand" {...provided.droppableProps} ref={provided.innerRef}>
                            {redCards.map((card,index) => {return (
                                <Draggable key={"red "+index} draggableId={"red "+index} index={index}>
                                    {(provided)=>(
                                        <div {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef} className="red card" onDoubleClick={()=>{play("red","present",index)}}>
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
            </div>
            </div>
        </DragDropContext>
    );
}

export default Tabs;