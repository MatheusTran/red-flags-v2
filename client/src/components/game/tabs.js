import React, { useState, useEffect, useCallback } from "react";
import { useSocket } from '../socket'
import useLocalStorage from "../../hooks/useLocalStorage";
import PresentField from "./PresentField";
import {DragDropContext, Droppable, Draggable} from "react-beautiful-dnd"
import { useNotifications } from '@mantine/notifications';

function Tabs(props) { //I think there are wayyyyy too many variables
    //tabs
    const [toggleState, setToggleState] = useState(1);
    const toggleTab = (index) => setToggleState(index);
    //cards. it may be better to create a context provider for this in the future
    const [whiteCards, setWhiteCards] = useState([])
    const [redCards, setRedCards] = useState([])
    const [whiteDupe, setWhiteDupe] = useState(false)
    const [redDupe, setRedDupe] = useState(false) 
    const [present, setPresent] = useState([])
    //present field
    const [topText, setTopText] = useState("loading data, please be patient")//maybe I can use an object again
    const [buttonName, setButtonName] = useState("")//not sure if these two have to be useState. just Using them for now to be sure
    const [show, setShow] = useState(false)
    //pointer is for the function that place cards in their new location
    const pointer = {array:{white:whiteCards, red:redCards, present:present}, setArray:{white:setWhiteCards,red:setRedCards,present:setPresent}}
    //mantine notification
    const notifications = useNotifications()
    //socket
    const socket = useSocket()
    const [id] = useLocalStorage("id")
    const [seed] = useLocalStorage("seed")
    const [username] = useLocalStorage("user")


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
            if(dupe(card, array, setDupe))return
            setArray((prevCards)=>{return [...prevCards, card]})
        })
    },[socket])

    useEffect(()=>{
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
        socket.on("notif", (notif)=>{
            notifications.showNotification(notif)
        })
    },[socket])

    useEffect(()=>{//for some reason this does not work
        if (whiteDupe===true){
            pull("white", whiteCards, setWhiteCards, setWhiteDupe)
        }
        if (redDupe===true){
            pull("red", redCards, setRedCards, setRedDupe)
        }
    }, [whiteDupe,redDupe])

    useEffect(()=>{
        if(!props.room)return
        let you = props.room.players.find(user => user.id === id)
        if(!you)return
        let swiper = props.room.players.find(user => user.swiper)

        switch(props.room.data.state){
            case "awaiting":
                setTopText("waiting for players")
                setButtonName("start")
                if(you["admin"]){//note to self: fix this
                    setShow(true)
                    break;
                } 
                setShow(false)
                break
            case "white":
                if (you.swiper){
                    setTopText("You are lonely and looking for a fish to fill the empty void that is your heart. Don't worry, you'll find someone eventually")
                    setShow(false)
                    break;
                }
                if (JSON.stringify(you.fish)!=="{}"){
                    setTopText("You have submitted your fish. Now wait for others to submit their fish")
                    setShow(false)
                    break
                }
                setTopText(`${swiper.username} is looking for love, play two white cards`)
                setButtonName("confirm")
                if(present.length === 2){
                    setShow(true)
                    break
                }
                setShow(false)
                break;
            case "presenting":
                setTopText("blank is now presenting their fish")
                setButtonName("next")
                setShow(true)
                break;
            default:
                break
        }

    }, [present, props.room, id])

    function play(source,destination, index){
        let sudoResult = {source:{droppableId:source, index:index},destination:{droppableId:destination, index:0}}
        reOrder(sudoResult)
    }
    function update(e, index, color){
        let array = Array.from(pointer["array"][color])
        let setArray = pointer["setArray"][color]
        array[index].value = e.target.innerText
        setArray(array)
    }

    function limit(e){//it's a limit function... ba dum tss
        if(e.target.innerText.length >=36 && e.key!=="Backspace")e.preventDefault()
    }
    function reOrder(result){
        const source = Array.from(pointer["array"][result.source.droppableId])
        const setSource = pointer["setArray"][result.source.droppableId]
        const [removedItem] = source.splice(result.source.index, 1)
        removedItem.display = removedItem.value
        if(result.destination.droppableId === result.source.droppableId){
            source.splice(result.destination.index, 0, removedItem)
            setSource(source)
        } else {
            if((removedItem.color === "white" && result.destination.droppableId === "red") ||(removedItem.color === "red" && result.destination.droppableId === "white")){
                notifications.showNotification({
                    title: 'Whoopsies',
                    message: `${removedItem.color} cards do not go with the ${result.destination.droppableId} cards`,
                    color:"red",
                    style:{ textAlign: 'left' }
                })
                return
            }
            if(!(result.source.droppableId===props.room.data.state||result.source.droppableId==="present")){
                notifications.showNotification({
                    title:"Now is not the time",
                    message:`please read the instructions on the top or learn to read`,
                    color:"red",
                    style:{ textAlign: 'left' }
                })
                return
            }
            const destination = Array.from(pointer["array"][result.destination.droppableId])
            const setDestination = pointer["setArray"][result.destination.droppableId]
            destination.splice(result.destination.index, 0, removedItem)
            setSource(source)
            setDestination(destination)
        }
        
    }
    //note to self: I may add another tab for emotes
    return (
        <DragDropContext onDragEnd={reOrder}>
            <PresentField cards={{present, setPresent}} topText={topText} mountButton={show} buttonName={buttonName} room={props.room} data={props.QS.roomId}>
                <Droppable droppableId="present" direction="horizontal" roomId={props.QS}>
                    {(provided)=>(
                        <div id="played-cards" className="scrollmenu" {...provided.droppableProps} ref={provided.innerRef} style={{width:"100%", height:"auto"}}>
                            {present.map((card,index) => {return (
                                <Draggable key={"present"+index} draggableId={"present"+index} index={index} isDragDisabled={false}>
                                    {(provided)=>(
                                        <div {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef} className={card.color + " card presented"} onDoubleClick={()=>{play("present", card.color,index)}}>
                                            {card.text}
                                            {card.Custom ? <span contentEditable="true" onKeyUp={e => update(e, index, "present")} onKeyDown={limit}>{card.display}</span>:""} 
                                        </div> 
                                    )}
                                </Draggable>
                            )})}
                            <div className="white card" style={{maxWidth:"9rem", opacity:"0"}}>
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
                                    <Draggable key={"white"+index} draggableId={"white"+index} index={index}>
                                            {(provided)=>(
                                                <div {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef} className="white card" onDoubleClick={()=>{play("white","present",index)}}>
                                                    {card.text}
                                                    {card.Custom ? <span contentEditable="true" onKeyUp={e => update(e, index, "white")} onKeyDown={limit}>{card.display}</span>:""} 
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
                                <Draggable key={"red"+index} draggableId={"red"+index} index={index}>
                                    {(provided)=>(
                                        <div {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef} className="red card" onDoubleClick={()=>{play("red","present",index)}}>
                                            {card.text}
                                            {card.Custom ? <span contentEditable="true" onKeyUp={e => update(e, index, "red")} onKeyDown={limit}>{card.display}</span>:""}
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