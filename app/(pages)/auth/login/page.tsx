"use client";

import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Input, Button, Typography, Card } from "@material-tailwind/react";
import Link from "next/link";
import Image from "next/image";
import logo from "@/public/logo.png";
import { useAppContext } from "@/contexts/appContext";
import { AuthContext } from "@/contexts/authContext";


export default function Login() {
  const useAuth = useContext(AuthContext);
  const router = useRouter();
  const { singIn } = useAuth;
  const { setCurrentUser } = useAppContext();
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState("");


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/auth/login`, {
        email: credentials.email,
        password: credentials.password,
      }, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const token = response.data.token;
      localStorage.setItem("authToken", token);
      singIn(token, response.data.user);
      console.log(response.data.token);
      setCurrentUser(response.data.user);
      router.push("/dashboard");
    } catch (error) {
      console.error("Error en login:", error.response?.data || error.message);

      if (error.response?.status === 403 && error.response?.data?.message.includes("no está verificada")) {
        setError("⚠️ Tu cuenta aún no está verificada. Revisa tu correo para activarla.");
      } else {
        setError("❌ Correo o contraseña incorrectos.");
      }
    }
  };

  return (
    <div>
      <Card className="w-full max-w-sm min-h-[500px] p-8 shadow-lg rounded-xxl bg-white text-center">
        <div className="flex justify-center mb-4">
          <Image src={logo} alt="Logo" width={150} height={50} />
        </div>
        <Typography variant="paragraph" className="text-gray-700 mb-4">
          Debes estar registrado para poder interactuar con la comunidad
        </Typography>

        {error && (
          <Typography variant="small" className="text-red-500 text-center mb-2">
            {error}
          </Typography>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="text-left">
            <label className="text-gray-700 font-medium text-sm">Correo</label>
            <Input
              type="email"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              required
              maxLength={50}
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#9747FF]"
            />
          </div>

          <div className="text-left">
            <label className="text-gray-700 font-medium text-sm">Contraseña</label>
            <Input
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              required
              maxLength={20}
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#9747FF]"
            />
          </div>

          <Typography
            as="a"
            href="#"
            variant="small"
            className="text-blue-600 hover:underline text-right block"
          >
            Olvidé mi contraseña
          </Typography>

          <div className="flex flex-col items-center justify-center space-y-6 mt-6">
            <Button type="submit" className="bg-[#9747FF] text-white py-3 rounded-xl px-6 w-48" variant="small">
              Iniciar sesión
            </Button>
            <Link href="/auth/register" className="border border-blue-600 text-blue-600 py-3 rounded-xl bg-transparent w-48">
              Crear cuenta
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
}