"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import logo from "@/public/logo.png";
import { useAuth } from "@/contexts/auth-context";
import Loading from "@/app/loading";
import rps from "@/services/request-password-service";

export default function ResetPasswordConfirm() {
  const { loading } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [credentials, setCredentials] = useState({ password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [token, setToken] = useState<string | null>(null);

  const searchParams = useSearchParams();

  // Obtener el token de la URL
    useEffect(() => {
      const tokenFromUrl = searchParams.get("token");
      if (tokenFromUrl) {
        setToken(tokenFromUrl);
        setError(""); 
      }else{
        setError("El token no existe o es invalido")
      }
    }, [searchParams]);

  // Función para manejar el cambio de los campos de entrada
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  // Función para comparar las contraseñas y establecer el error si no coinciden
  const handleComparepassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });

    // Verificar si las contraseñas coinciden
    if (name === "confirmPassword" && value !== credentials.password) {
      setError("Las contraseñas no coinciden.");
    } else {
      setError(""); // Limpiar el error si las contraseñas coinciden
    }
  };

  // Función para manejar el envío del formulario
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (credentials.password !== credentials.confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    setError("");
    setIsSubmitting(true);

    try {
      const response = await rps.postPassword({newPassword: credentials.password, token: token});
      if (response) {
        console.log("Console responde: " + response.data)
      }
      // Redirigir al login
      router.push("/auth/login");
    } catch (error: any) {
      console.error("Error al restablecer la contraseña:", error);
      setError("❌ Ocurrió un error al restablecer la contraseña. Intenta nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Mostrar el componente de carga si está cargando
  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <div className="w-full max-w-sm min-w-[350px] min-h-[450px] p-8 shadow-lg rounded-lg bg-white text-center">
        <div className="flex justify-center mb-4">
          <Image src={logo} alt="Logo" width={150} height={50} />
        </div>
        <p className="text-gray-700 mb-4">
          Crea tu nueva Contraseña
        </p>

        {error && (
          <p className="text-red-500 text-sm text-center mb-2">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="text-left">
            <label className="text-gray-700 font-medium text-sm block mb-1">Nueva Contraseña</label>
            <input
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              required
              maxLength={50}
              className={`w-full border ${!!error && error.includes("Contraseña") ? "border-red-500" : "border-gray-300"} rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#9747FF]`}
              disabled={isSubmitting}
            />
          </div>

          <div className="text-left">
            <label className="text-gray-700 font-medium text-sm block mb-1">Confirmar Contraseña</label>
            <input
              type="password"
              name="confirmPassword"
              value={credentials.confirmPassword}
              onChange={handleComparepassword}
              required
              maxLength={20}
              className={`w-full border ${!!error && error.includes("Contraseñas no coinciden") ? "border-red-500" : "border-gray-300"} rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#9747FF]`}
              disabled={isSubmitting}
            />
          </div>

          <div className="flex flex-col items-center justify-center space-y-6 mt-6">
            <button
              type="submit"
              className="bg-[#9747FF] text-white py-3 rounded-xl px-6 w-48 disabled:opacity-70"
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
                "Cambiar Contraseña"
              )}
            </button>
            <Link
              href="/auth/login"
              className="border border-blue-600 text-blue-600 py-3 rounded-xl bg-transparent w-48 flex items-center justify-center"
            >
              Iniciar Sesión
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}