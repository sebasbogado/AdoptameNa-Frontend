"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import logo from "@/public/logo.png";
import { useAuth } from "@/contexts/authContext";
import Loading from "@/app/loading";
import { useForm } from "react-hook-form";
import { LoginFormValues, loginSchema } from "@/validations/login-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import GoogleLoginButton from "@/components/buttons/google-login-button";

export default function Login() {
  const { login, user, loading } = useAuth();
  const router = useRouter();
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  useEffect(() => {
    if (user && !loading) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  const onSubmit = async (data: LoginFormValues) => {
    setError("");

    try {
      await login(data);
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Error en login:", error);

      if (error.code === 401) {
        setError("❌ Correo o contraseña incorrectos.");
      } else if (error.code === 403) {
        setError("⚠️ Tu cuenta aún no está verificada. Revisa tu correo para activarla.");
      } else {
        setError("❌ Error de autenticación. Por favor intenta nuevamente.");
      }
    }
  };

  if (loading) {
    return Loading();
  }

  return (
    <div>
      <div className="w-full max-w-sm min-h-[500px] p-8 shadow-lg rounded-lg bg-white text-center">
        <div className="flex justify-center mb-4">
          <Image src={logo} alt="Logo" width={150} />
        </div>
        <p className="text-gray-700 mb-4">
          Debes estar registrado para poder interactuar con la comunidad
        </p>

        {error && (
          <p className="text-red-500 text-sm text-center mb-2">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="text-left">
            <label className="text-gray-700 font-medium text-sm block mb-1">Correo</label>
            <input
              type="email"
              {...register("email")}
              className={`w-full border ${errors.email ? "border-red-500" : "border-gray-300"} rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#9747FF]`}
              disabled={isSubmitting}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          <div className="text-left">
            <label className="text-gray-700 font-medium text-sm block mb-1">Contraseña</label>
            <input
              type="password"
              {...register("password")}
              className={`w-full border ${errors.password ? "border-red-500" : "border-gray-300"} rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#9747FF]`}
              disabled={isSubmitting}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

          <a
            href="/auth/reset-password-request"
            className="text-blue-600 hover:underline text-sm text-right block"
          >
            Olvidé mi contraseña
          </a>

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
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Procesando...
                </div>
              ) : (
                "Iniciar sesión"
              )}
            </button>

            <GoogleLoginButton
              size="md"
              onClick={() => {
                const googleAuthUrl = `${process.env.NEXT_PUBLIC_BASE_API_URL}/auth/google-auth`;
                window.location.href = googleAuthUrl;
              }}
              disabled={isSubmitting}
            />

            <Link
              href="/auth/register"
              className="border border-blue-600 text-blue-600 py-3 rounded-xl bg-transparent w-48 flex items-center justify-center"
            >
              Crear cuenta
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}