import React, { useContext, useEffect, useState } from 'react'
import io from 'socket.io-client'

const SocketContext = React.createContext()

export function useSocket() {
    return useContext(SocketContext)
}

export function SocketProvider({ name, children }) {
    const [socket, setSocket] = useState()

    useEffect(() => { 
    const newSocket = io(
        "localhost:9000",//'https://red-flags-v2.herokuapp.com/',//I am not sure what to change this to in the future
        { user: { name } } //I think I can remove this
    )
    setSocket(newSocket)
    return () => newSocket.close()
    }, [name]) 
    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    )
}