'use client'

import { createContext, useContext, useState } from "react"
import { ReactNode } from "react";



interface AppProviderProps {
  children: ReactNode;
}
const AppContext = createContext(null);

export const useAppContext = () => {
    return useContext(AppContext)
}

export const AppProvider = ({ children }: AppProviderProps) => {
    const [cartItems, setCartItems] = useState([])
    let values = {cartItems, setCartItems}
    return (
        <AppContext.Provider value={values}>
            {children}
        </AppContext.Provider>
    )
}