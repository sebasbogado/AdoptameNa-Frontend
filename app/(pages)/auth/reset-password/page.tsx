"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Loader2Icon, EyeIcon, EyeOffIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import logo from "@/public/logo.png";
import { useAuth } from "@/contexts/auth-context";
import Loading from "@/app/loading";
import { resetPassword } from "@/utils/auth.http";
import { ResetPasswordFormValues, resetPasswordSchema } from "@/validations/reset-password-schema";

export default function ResetPasswordConfirm() {
  const { loading } = useAuth();
  const router = useRouter();
  const [error, setError] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const searchParams = useSearchParams();

  // Obtener el token de la URL
  useEffect(() => {
    const tokenFromUrl = searchParams.get("token");
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
      setError("");
    } else {
      setError("El token no existe o es inválido");
    }
  }, [searchParams]);

  const onSubmit = async (data: ResetPasswordFormValues) => {
    if (!token) {
      setError("Token inválido o expirado");
      return;
    }
    
    try {
      await resetPassword(token, { newPassword: data.password });
      router.push("/auth/login");
    } catch (error: any) {
      console.error("Error al restablecer la contraseña:", error);
      setError("❌ Ocurrió un error al restablecer la contraseña. Intenta nuevamente.");
    }
  };

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

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="text-left">
            <label className="text-gray-700 font-medium text-sm block mb-1">Nueva Contraseña</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                className={`w-full border ${errors.password ? "border-red-500" : "border-gray-300"} rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-[#9747FF]`}
                disabled={isSubmitting}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOffIcon className="h-5 w-5 text-gray-500" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-gray-500" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          <div className="text-left">
            <label className="text-gray-700 font-medium text-sm block mb-1">Confirmar Contraseña</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                {...register("confirmPassword")}
                className={`w-full border ${errors.confirmPassword ? "border-red-500" : "border-gray-300"} rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-[#9747FF]`}
                disabled={isSubmitting}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOffIcon className="h-5 w-5 text-gray-500" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-gray-500" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>

          <div className="flex flex-col items-center justify-center space-y-6 mt-6">
            <button
              type="submit"
              className="bg-[#9747FF] text-white py-3 rounded-xl px-6 w-48 disabled:opacity-70"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <Loader2Icon className="animate-spin mr-2" />
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