"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { Input, Button, Typography, Card, Radio, Alert } from "@material-tailwind/react";
import Image from "next/image";
import logo from "@/public/logo.png";
export default function Page() {
    const [accountType, setAccountType] = useState("persona");
    const [formData, setFormData] = useState({
        nombre: "",
        organizacion: "",
        responsable: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const handleAccountTypeChange = (e) => {
        setAccountType(e.target.value);
    };
    const router = useRouter();
    const [errors, setErrors] = useState({});
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validate = () => {
        let newErrors = {};
        if (!formData.nombre.match(/^[A-Za-z\s]+$/) || formData.nombre.length > 50) {
            newErrors.nombre = "Nombre inválido (solo letras, máx. 50 caracteres)";
        }
        if (accountType === "organizacion" && (!formData.organizacion || formData.organizacion.length > 50)) {
            newErrors.organizacion = "Nombre de organización inválido (solo letras, máx. 50 caracteres)";
        }
        if (!formData.email.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)) {
            newErrors.email = "Correo inválido";
        }
        if (formData.password.length < 6) {
            newErrors.password = "La contraseña debe tener al menos 6 caracteres";
        }
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Las contraseñas no coinciden";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            await axios.post("/auth/register", { ...formData, tipo: accountType });
            router.push("/dashboard");
        } catch (error) {
            console.error("Error al registrar", error);
        }
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
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="text-left">
                            <label className="text-gray-700 font-medium text-sm">Nombre de la Organización</label>
                            <Input
                                type="text"
                                name="name"
                                required
                                maxLength={50}
                                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#9747FF]"
                                onChange={handleChange}
                                
                            />
                            {errors.organizacion && <p className="text-red-500 text-sm">{errors.organizacion}</p>}
                        </div>
                        <div className="text-left">
                            <label className="text-gray-700 font-medium text-sm">Nombre del Responsable</label>
                            <Input
                                type="text"
                                name="nameResponsable"
                                required
                                maxLength={50}
                                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#9747FF]"
                                onChange={handleChange}
                              
                            />
                            {errors.nombre && <p className="text-red-500 text-sm">{errors.nombre}</p>}
                        </div>

                        <div className="text-left">
                            <label className="text-gray-700 font-medium text-sm">Correo</label>
                            <Input
                                type="email"
                                name="email"
                                required
                                maxLength={50}
                                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#9747FF]"
                                onChange={handleChange}
                                
                            />
                            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                        </div>
                        <div className="text-left">
                            <label className="text-gray-700 font-medium text-sm">Contraseña</label>
                            <Input
                                type="password"
                                name="password"
                                required
                                maxLength={50}
                                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#9747FF]"
                                onChange={handleChange}
                               
                            />
                            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                            <div className="text-left">
                                <label className="text-gray-700 font-medium text-sm">Confirmar Contraseña</label>
                                <Input
                                    type="password"
                                    name="confirmPassword"
                                    required
                                    maxLength={50}
                                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#9747FF]"
                                    onChange={handleChange}
                                   
                                />
                                {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
                            </div>
                        </div>


                        <div className="flex flex-col items-center justify-center space-y-6 mt-6">
                            <Button type="submit" className="bg-[#9747FF] text-white py-3 rounded-xl py-3 px-6 w-48" variant="small">
                                Crear Cuenta
                            </Button>
                            <Link href="/auth/login" className="border border-blue-600 text-blue-600 py-3 rounded-xl bg-transparent w-48">Iniciar sesión</Link>

                        </div>
                    </form>
                )}
                {accountType === "persona" && (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="text-left">
                            <label className="text-gray-700 font-medium text-sm">Nombre</label>
                            <Input
                                type="text"
                                name="name"
                                required
                                maxLength={50}
                                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#9747FF]"
                                onChange={handleChange}
                                
                            />
                            {errors.nombre && <p className="text-red-500 text-sm">{errors.nombre}</p>}
                        </div>

                        <div className="text-left">
                            <label className="text-gray-700 font-medium text-sm">Correo</label>
                            <Input
                                type="email"
                                name="email"
                                required
                                maxLength={50}
                                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#9747FF]"
                                onChange={handleChange}
                                
                            />
                            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                        </div>
                        <div className="text-left">
                            <label className="text-gray-700 font-medium text-sm">Contraseña</label>
                            <Input
                                type="password"
                                name="password"
                                required
                                maxLength={50}
                                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#9747FF]"
                                onChange={handleChange}
                                error={errors.password}
                            />
                            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                        </div>

                        <div className="text-left">
                            <label className="text-gray-700 font-medium text-sm">Confirmar Contraseña</label>
                            <Input
                                type="password"
                                name="confirmPassword"
                                required
                                maxLength={50}
                                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#9747FF]"
                                onChange={handleChange}
                                
                            />
                            {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
                        </div>
                        <div className="flex flex-col items-center justify-center space-y-6 mt-6">
                            <Button type="submit" className="bg-[#9747FF] text-white py-3 rounded-xl py-3 px-6 w-48" variant="small">
                                Crear Cuenta
                            </Button>

                            <Link href="/auth/login" className="border border-blue-600 text-blue-600 py-3 rounded-xl bg-transparent w-48">Iniciar sesión</Link>
                        </div>
                    </form>
                )}

            </Card>
        </div>
    );
}
