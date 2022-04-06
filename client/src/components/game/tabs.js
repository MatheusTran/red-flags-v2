import React, { useState } from "react";
import PresentField from "./PresentField";
import {DragDropContext, Droppable, Draggable} from "react-beautiful-dnd"
import { useNotifications } from '@mantine/notifications';

import {useData} from "./dataProvider"; 

function Tabs() {
    const { pointer,room } = useData()
    //tabs
    const [toggleState, setToggleState] = useState(1);
    const toggleTab = (index) => setToggleState(index);
    //mantine notification
    const notifications = useNotifications()

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
            if(!(result.source.droppableId===room.data.state||result.source.droppableId==="present")){
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
            <PresentField>
                <Droppable droppableId="present" direction="horizontal">
                    {(provided)=>(
                        <div {...provided.droppableProps} ref={provided.innerRef}>
                            {pointer.array.present.map((card,index) => {return (
                                <Draggable key={"present"+index} draggableId={"present"+index} index={index}>
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
                <button className={toggleState === 1 ? "tabs active-tabs" : "tabs"} onClick={() => toggleTab(1)}>
                    white cards
                </button>
                <button className={toggleState === 2 ? "tabs active-tabs" : "tabs"} onClick={() => toggleTab(2)}>
                    red cards
                </button>
            </div>

            <div className="content-tabs">
                    <div className={(toggleState === 1 ? "content  active-content" : "content")}>
                        <Droppable droppableId="white" direction="horizontal">
                            {(provided)=>(
                            <div className="scrollmenu hand" {...provided.droppableProps} ref={provided.innerRef}>
                                {pointer.array.white.map((card,index) => {return (
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

                <div className={(toggleState === 2 ? "content  active-content" : "content")}>
                    <Droppable droppableId="red" direction="horizontal">
                        {(provided)=>(
                        <div className="scrollmenu hand" {...provided.droppableProps} ref={provided.innerRef}>
                            {pointer.array.red.map((card,index) => {return (
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