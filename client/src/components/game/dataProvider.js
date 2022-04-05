import React, { useContext, useEffect, useState, useCallback } from 'react'
import { useSocket } from '../socket'
import useLocalStorage from "../../hooks/useLocalStorage";
import { useNotifications } from '@mantine/notifications';

const context = React.createContext()

export function useData(){
    return useContext(DataContext)
}

export function DataContext(props) {
    //cards. it may be better to create a context provider for this in the future
    const [whiteCards, setWhiteCards] = useState([])
    const [redCards, setRedCards] = useState([])
    const [whiteDupe, setWhiteDupe] = useState(false)
    const [redDupe, setRedDupe] = useState(false) 
    const [present, setPresent] = useState([])
    //present field
    const notifications = useNotifications()
    const [topText, setTopText] = useState("loading data, please be patient")//maybe I can use an object again
    const [buttonName, setButtonName] = useState("")//not sure if these two have to be useState. just Using them for now to be sure
    const [show, setShow] = useState(false)
    //pointer is for the function that place cards in their new location
    const pointer = {array:{white:whiteCards, red:redCards, present:present}, setArray:{white:setWhiteCards,red:setRedCards,present:setPresent}}
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
                pull("white", whiteCards, setWhiteCards, setWhiteDupe)//I may be able to abstract this in the future with the pointer array
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
                if(you.admin){
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
                //maybe have a new array showing the order in the database
                let presenter = props.room.order[props.room.data.turn] 
                setButtonName("next")
                if(presenter.id===you.id){
                    setShow(true)
                    setTopText(`you are presenting your fish (${presenter.fish.name}), press next or the cards to reveal your cards`)
                    break
                }
                setTopText(`${presenter.username} is now presenting their fish: ${presenter.fish.name}`)//maybe the name should be added later, so it can be a reveal
                setShow(false)
                break;
            default:
                break
        }
    }, [present, props.room, id])

    const allData = {
        whiteCards,
        redCards,
        present,
        topText,
        buttonName,
        show,
        pointer
    }
    
    return (
        <context.Provider value={allData}>
            {props.children}
        </context.Provider>
    )
}