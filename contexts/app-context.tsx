'use client'

import { createContext, useContext, useState, Dispatch, SetStateAction } from "react"
import { ReactNode } from "react"

interface AppProviderProps {
    children: ReactNode
}

interface AppContextType {
    cartItems: any[]
    setCartItems: Dispatch<SetStateAction<any[]>>
    currentUser: any
    setCurrentUser: Dispatch<SetStateAction<any>>
}
const defaultContextValue: AppContextType = {
    cartItems: [],
    setCartItems: () => { },
    currentUser: null,
    setCurrentUser: () => { },
};

const AppContext = createContext<AppContextType>(defaultContextValue);

export const useAppContext = () => {
    return useContext(AppContext)
}

export const AppProvider = ({ children }: AppProviderProps) => {
    const [cartItems, setCartItems] = useState<any[]>([])
    const [currentUser, setCurrentUser] = useState<any>(null)

    const values: AppContextType = { cartItems, setCartItems, currentUser, setCurrentUser }

    return (
        <AppContext.Provider value={values}>
            {children}
        </AppContext.Provider>
    )
}
