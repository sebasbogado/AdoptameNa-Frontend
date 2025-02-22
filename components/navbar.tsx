'use client'

import { useAppContext } from "@/contexts/appContext";
import Image from "next/image";
import Link from "next/link";


export default function Navbar(){
    const {currentUser, setCurrentUser} = useAppContext()

    return(
        <div className="w-screen h-16 bg-lime-200 flex justify-between items-center px-3">
            <span className="font-semibold">Logo</span>
            <ul className="flex gap-6">
                <Link href="/dashboard"><li>Inicio</li></Link>
                <Link href="/volunteering"><li>Voluntariado</li></Link>
                <Link href="/adoption"><li>Adopción</li></Link>
                <Link href="/missing"><li>Extraviados</li></Link>
                <Link href="/blog"><li>Blog</li></Link>
                <Link href="/marketplace"><li>Tienda</li></Link>
            </ul>
            {currentUser?
            <Link href="/profile">{currentUser}</Link>:
            <div>
                <button onClick={()=> setCurrentUser("Mark")}>Login</button>
                <button>Register</button>
            </div>  
        }
        </div>
    )
}