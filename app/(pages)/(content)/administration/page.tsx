"use client"
import Loading from "@/app/loading";
import Footer from "@/components/footer";
import NavbarAdmin from "@/components/navbar-admin";
import { useAuth } from "@/contexts/authContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {

    const { authToken, user, loading: authLoading } = useAuth();

    const router = useRouter();

    useEffect(() => {
        if (!authLoading && !authToken) {
            console.log("authLoading", authLoading);
            console.log("authToken", authToken);
            router.push("/auth/login");
        }

    }, [authToken, authLoading, router]);
    
    
    useEffect(() => {
        // Verifica si el usuario no tiene rol de 'admin'
        if (!user || user.role !== "admin") {
          // Si el rol no es 'admin', redirige a la página de home
          router.push("/dashboard") 
        }
      }, [user, router]); // El efecto se ejecuta cuando el usuario o el router cambian
    
      if (!user || user.role !== "admin" || authLoading) {
        // Mostrar una interfaz de carga mientras se procesa la redirección
        return <Loading/>
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