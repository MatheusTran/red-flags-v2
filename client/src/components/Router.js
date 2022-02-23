import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './home/App'
import Game from "./game/Game"

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
