'use client'

import { createContext, useContext, useState } from "react"

const AppContext = createContext()


export const useAppContext = () => {
    return useContext(AppContext)
}


export const AppProvider = ({children}) => {
    const [cartItems, setCartItems] = useState([])
    let values = {cartItems, setCartItems}
    return (
        <AppContext.Provider value={values}>
            {children}
        </AppContext.Provider>
    )
}