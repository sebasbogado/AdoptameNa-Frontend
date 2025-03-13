"use client"
import Loading from "@/app/loading";
import Footer from "@/components/footer";
import NavbarAdmin from "@/components/navbar-admin";
import { User as UserType } from "@/types/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page({ currentUser }: { currentUser: UserType }) {


    const router = useRouter();
    
    useEffect(() => {
        // Verifica si el usuario no tiene rol de 'admin'
        if (!currentUser || currentUser.role !== "admin") {
          // Si el rol no es 'admin', redirige a la página de home
          router.push("/dashboard") 
        }
      }, [currentUser, router]); // El efecto se ejecuta cuando el usuario o el router cambian
    
      if (!currentUser || currentUser.role !== "admin") {
        // Mostrar una interfaz de carga mientras se procesa la redirección
        <Loading/>
      }
      
    return (<>
        <div className="flex flex-col items-center justify-center">
            <NavbarAdmin/>
        </div>
        <div>
            Administration
            <Footer/>
        </div>
        </>

    )
}