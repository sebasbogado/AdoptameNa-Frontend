"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import { Input, Button, Typography, Card,Radio } from "@material-tailwind/react";
import Image from "next/image";
import logo from "@/public/logo.png"; // Asegúrate de que la imagen esté en public/logo.png

export default function Page() {
    const router = useRouter();
    const [user, setUser] = useState({
        name: "",
        email: "",
        password: "",
        type: "persona", // persona u organización
    });
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        if (value === "organizacion") {
          router.push("/auth/register/registerOrganization"); // Redirige al formulario de organizaciones
        } else {
          setUser({ ...user, [name]: value });
        }
      };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        // Aquí iría la lógica para registrar al usuario en la API
        console.log("Datos enviados:", user);
        router.push("/dashboard");
    };


    return (
        <div>
            <Card className="w-full max-w-sm min-h-[500px] p-8 shadow-lg rounded-xxl bg-white text-center">
                <div className="flex justify-center mb-4">
                    <Image src={logo} alt="Logo" width={150} height={50} />
                </div>
                <Typography className="text-center text-gray-800 mb-4">
                    Estás a un paso de formar parte de esta gran comunidad
                </Typography>

                <div className="flex justify-center gap-4 mb-4">
                    <Radio
                        name="type"
                        label="Persona"
                        value="persona"
                        checked={user.type === "persona"}
                        onChange={handleChange}
                    />
                    <Radio
                        name="type"
                        label="Organización"
                        value="organizacion"
                        checked={user.type === "organizacion"}
                        onChange={handleChange}
                    />
                </div>

                {error && (
                    <Typography variant="small" className="text-red-500 text-center mb-2">
                        {error}
                    </Typography>
                )}


                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="text-left">
                        <label className="text-gray-700 font-medium text-sm">Nombre</label>
                        <Input
                            type="text"
                            name="name"
                            value={user.name}
                            onChange={handleChange}
                            required
                            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#9747FF]"
                        />
                    </div>

                    <div className="text-left">
                        <label className="text-gray-700 font-medium text-sm">Correo</label>
                        <Input
                            type="email"
                            name="email"
                            value={user.email}
                            onChange={handleChange}
                            required
                            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#9747FF]"
                        />
                    </div>
                    <div className="text-left">
                        <label className="text-gray-700 font-medium text-sm">Contraseña</label>
                        <Input
                            type="password"
                            name="password"
                            value={user.password}
                            onChange={handleChange}
                            required
                            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#9747FF]"
                        />
                    </div>


                    <div className="flex flex-col items-center justify-center space-y-6 mt-6">
                        <Typography
                            as="a"
                            href="/dashboard"
                            variant="small"
                            className="bg-[#9747FF] text-white py-3 rounded-xl py-3 px-6 w-48"
                        >
                            Crear Cuenta
                        </Typography>

                        <Typography
                            as="a"
                            href="/auth/register"
                            variant="small"
                            className="border border-blue-600 text-blue-600 py-3 rounded-xl bg-transparent w-48"
                        >
                            Iniciar Sesión
                        </Typography>
                    </div>
                </form>

            </Card>
        </div>
    );
}
