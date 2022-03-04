import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './home/App'
import Game from "./game/Game"
//note to self: might make a different route for the lobbies
export default function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" exact element={<App/>}/>
                <Route path="/game" element={<Game/>}/>
            </Routes>
        </BrowserRouter>
    )
}
