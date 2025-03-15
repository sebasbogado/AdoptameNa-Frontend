"use client";
import Image from "next/image";
import logo from "@/public/logo.png";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/authContext";
import Loading from "@/app/loading";


export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [credentials, setCredentials] = useState({ email: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { loading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const requestData = { email };

    try {
      
      console.log("Recuperar contraseña para:", credentials.email);
      
    } catch (error: any) {
      console.error("Error al recuperar contraseña")
      setError("Hubo un problema al procesar la solicitud.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
      return <Loading/>;
    }

  return (
    <div>
      <div className="w-[539px] h-[576px] p-8 shadow-lg rounded-lg bg-white text-center">
        <div className="flex justify-center mb-4">
          <Image src={logo} alt="Logo" width={150} height={50} />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="text-left">
            <label className="text-gray-700 font-medium text-sm block mb-1">
              Correo
            </label>
            <input
              type="email"
              name="email-reset-password"
              value={credentials.email}
              onChange={(e) =>
                setCredentials({ ...credentials, email: e.target.value })
              }
              required
              maxLength={50}
              className={`w-full border ${
                !!error && error.includes("Correo") ? "border-red-500" : "border-gray-300"
              } rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#9747FF]`}
              disabled={isSubmitting}
            />
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>

          <div className="flex flex-col items-center justify-center space-y-6 mt-6">
            <button
              type="submit"
              className="bg-[#9747FF] text-white py-3 rounded-xl px-6 w-48 disabled:opacity-70"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Procesando...
                </div>
              ) : (
                "Recuperar Contraseña"
              )}
            </button>
            <Link
              href="/auth/login"
              className="border border-blue-600 text-blue-600 py-3 rounded-xl bg-transparent w-56 h-261 flex items-center justify-center"
            >
              Iniciar Sesión
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}