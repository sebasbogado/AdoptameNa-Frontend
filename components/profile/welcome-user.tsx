import Image from "next/image"
import logo from "@/public/logo.png";
import { useAuth } from "@/contexts/auth-context";

export const WelcomeUser = () => {
    const { user } = useAuth();
    return(
        <div className="flex flex-col items-center mb-4">
            <Image src={logo} alt="Logo" width={150} />
            <p>Bienvenido/a <br/> <b>{user?.fullName}</b></p>
            <h1 className="text-2xl font-bold mb-4">¡Crea tu perfil de usuario!</h1>

        </div> 
    )
}