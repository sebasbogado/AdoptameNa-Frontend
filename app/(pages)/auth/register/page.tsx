"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import { Input, Button, Typography, Card, Radio } from "@material-tailwind/react";
import Image from "next/image";
import logo from "@/public/logo.png"; // Asegúrate de que la imagen esté en public/logo.png

export default function Page() {
    const [accountType, setAccountType] = useState("persona");

    const handleAccountTypeChange = (e) => {
        setAccountType(e.target.value);
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

                {/* Radio para elegir tipo de cuenta */}
                <div className="flex justify-center gap-4 mb-4">
                    <Radio
                        name="accountType"
                        label="Persona"
                        value="persona"
                        checked={accountType === "persona"}
                        onChange={handleAccountTypeChange}
                    />
                    <Radio
                        name="accountType"
                        label="Organización"
                        value="organizacion"
                        checked={accountType === "organizacion"}
                        onChange={handleAccountTypeChange}
                    />
                </div>


                {accountType === "organizacion" && (
                    <form className="space-y-4">
                        <div className="text-left">
                            <label className="text-gray-700 font-medium text-sm">Nombre de la Organización</label>
                            <Input
                                type="text"
                                name="name"
                                required
                                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#9747FF]"
                            />
                        </div>
                        <div className="text-left">
                            <label className="text-gray-700 font-medium text-sm">Nombre del Responsable</label>
                            <Input
                                type="text"
                                name="nameResponsable"
                                required
                                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#9747FF]"
                            />
                        </div>

                        <div className="text-left">
                            <label className="text-gray-700 font-medium text-sm">Correo</label>
                            <Input
                                type="email"
                                name="email"
                                required
                                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#9747FF]"
                            />
                        </div>
                        <div className="text-left">
                            <label className="text-gray-700 font-medium text-sm">Contraseña</label>
                            <Input
                                type="password"
                                name="password"
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
                )}
                {accountType === "persona" && (
                    <form className="space-y-4">
                    <div className="text-left">
                        <label className="text-gray-700 font-medium text-sm">Nombre</label>
                        <Input
                            type="text"
                            name="name"
                            required
                            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#9747FF]"
                        />
                    </div>

                    <div className="text-left">
                        <label className="text-gray-700 font-medium text-sm">Correo</label>
                        <Input
                            type="email"
                            name="email"
                            required
                            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#9747FF]"
                        />
                    </div>
                    <div className="text-left">
                        <label className="text-gray-700 font-medium text-sm">Contraseña</label>
                        <Input
                            type="password"
                            name="password"
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
                            href="/auth/login"
                            variant="small"
                            className="border border-blue-600 text-blue-600 py-3 rounded-xl bg-transparent w-48"
                        >
                            Iniciar Sesión
                        </Typography>
                    </div>
                </form>
                )}

            </Card>
        </div>
    );
}
