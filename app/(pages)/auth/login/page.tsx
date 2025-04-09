"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import logo from "@/public/logo.png";
import { useAuth } from "@/contexts/auth-context";
import Loading from "@/app/loading";
import { useForm } from "react-hook-form";
import { LoginFormValues, loginSchema } from "@/validations/login-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import GoogleLoginButton from "@/components/buttons/google-login-button";
import {  EyeIcon,  EyeOffIcon, Loader2Icon } from "lucide-react";

export default function Login() {
  const { login, user, loading } = useAuth();
  const router = useRouter();
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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
      router.push("/auth/create-profile");
    }
  }, [user, loading, router]);

  const onSubmit = async (data: LoginFormValues) => {
    setError("");

    try {
      await login(data);
      router.push("/auth/create-profile");
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
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                className={`w-full border ${errors.password ? "border-red-500" : "border-gray-300"} rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-[#9747FF]`}
                disabled={isSubmitting}
              />
              <div
                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                 <EyeOffIcon  className="w-5 h-5"/>
                ) : (
                  <EyeIcon className="w-5 h-5"/>
                )}
              </div>
            </div>
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
              className="bg-[#9747FF] text-white py-3 rounded-xl px-6 disabled:opacity-70 w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <Loader2Icon className=" animate-spin mr-2"
                
                  />
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
              className="w-full border border-blue-600 text-blue-600 py-3 rounded-xl bg-transparent flex items-center justify-center"
            >
              Crear cuenta
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}