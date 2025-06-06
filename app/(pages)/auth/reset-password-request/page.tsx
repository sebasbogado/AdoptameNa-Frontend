"use client";
import Image from "next/image";
import logo from "@/public/logo.png";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import Loading from "@/app/loading";
import { requestPasswordReset } from "@/utils/auth.http";

export default function ResetPassword() {
  const [credentials, setCredentials] = useState({ email: "" });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { loading } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await requestPasswordReset({ email: credentials.email });

    } catch (err: any) {

      setError(err.response?.data || "Ocurrió un error al procesar la solicitud.");
    } finally {
      setIsSubmitting(false); // Volvemos a habilitar el botón después de procesar
    }
  };

  if (loading) {
    return Loading();
  }

  return (
    <div >
      <div className="w-full max-w-sm min-w-[350px] min-h-[450px] p-8 shadow-lg rounded-lg bg-white text-center top-[214px] left-[453px]">
        <div className="flex justify-center mb-4">
          <Image src={logo} alt="Logo" width={150} height={50} />
        </div>

        <p className="text-gray-700 mb-4 ">
          Ingresa tu correo para recibir un link para cambiar tu contraseña
        </p>

        {error && (
          <p className="text-red-500 text-sm text-center mb-2">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="text-left">
            <label className="text-gray-700 font-medium text-sm block mb-1">Correo</label>
            <input
              type="email"
              name="email-reset-password"
              value={credentials.email}
              onChange={(e) =>
                setCredentials({ ...credentials, email: e.target.value })
              }
              required
              maxLength={50}
              className={`w-full border ${!!error && error.includes("Correo") ? "border-red-500" : "border-gray-300"} rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#9747FF]`}
              disabled={isSubmitting}
            />
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>

          <div className="flex flex-col items-center justify-center space-y-6 mt-6">
            {message && <p className="text-green-500 text-sm">{message}</p>}
          </div>

          <div className="flex flex-col items-center justify-center space-y-6 mt-6">
            <button
              type="submit"
              className="bg-[#9747FF] text-white py-3 rounded-xl px-6 w-48 disabled:opacity-70 min-w-[261px] min-h-[56px]"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Procesando...
                </div>
              ) : (
                "Recuperar Contraseña"
              )}
            </button>
            <Link
              href="/auth/login"
              className="border border-blue-600 text-blue-600 py-3 rounded-xl bg-transparent min-w-[261px] min-h-[56px] flex items-center justify-center"
            >
              Iniciar sesión
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}