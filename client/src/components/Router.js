import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './home/App'
import Game from "./game/Game"
import Rooms from './home/Rooms'
//note to self: might make a different route for the lobbies
export default function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" exact element={<App/>}/>
                <Route path="/hallway" exact element={<Rooms/>}/>
                <Route path="/game" element={<Game/>}/>
            </Routes>
        </BrowserRouter>
    )
}
