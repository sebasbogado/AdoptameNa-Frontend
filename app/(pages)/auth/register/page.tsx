"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import {
  Input,
  Button,
  Typography,
  Card,
  Radio,
  Alert,
} from "@material-tailwind/react";
import { Check, X, AlertTriangle } from 'lucide-react';
import Image from "next/image";
import logo from "@/public/logo.png";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  refinedBaseSchema,
  refinedOrganizacionSchema,
} from "@/validations/register-schema";
import { EyeIcon, EyeOffIcon, Loader2Icon } from "lucide-react";

export default function Page() {
  const [accountType, setAccountType] = useState("persona");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // Estados para controlar la visibilidad de las contraseñas
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Estado para validación visual de contraseña en tiempo real
  const [passwordChecks, setPasswordChecks] = useState({
    length: false,
    lowercase: false,
    uppercase: false,
    number: false,
  });

  // Crear un schema dinámico basado en el tipo de cuenta
  const schema =
    accountType === "persona" ? refinedBaseSchema : refinedOrganizacionSchema;

  // Configurar React Hook Form con Zod
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<{
    organizationName?: string;
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
  }>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });


  const watchedFields = {
    organizationName: watch("organizationName", ""),
    fullName: watch("fullName", ""),
    email: watch("email", ""),
    password: watch("password", ""),
    confirmPassword: watch("confirmPassword", "")
  };

  const validatePassword = (password: string) => {
    setPasswordChecks({
      length: password.length >= 8 && password.length <= 64,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
    });
  };

  // Actualizar validaciones cuando cambia la contraseña
  useEffect(() => {
    validatePassword(watchedFields.password);
  }, [watchedFields.password]);

  // Reiniciar el formulario cuando cambie el tipo de cuenta
  useEffect(() => {
    reset();
  }, [accountType, reset]);

  const handleAccountTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAccountType(e.target.value);
  };

  const onSubmit = async (data: any) => {
    setErrorMessage("");
    setIsSubmitting(true);

    const payload =
      accountType === "persona"
        ? {
          organizationName: null,
          fullName: data.fullName,
          email: data.email,
          password: data.password,
          role: "USER",
        }
        : {
          organizationName: data.organizationName,
          fullName: data.fullName,
          email: data.email,
          password: data.password,
          role: "ORGANIZATION",
        };

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/auth/register`,
        payload
      );

      setIsSubmitting(false);

      if (response.status === 201 || response.status === 200) {
        setSuccessMessage(
          "✅ Registro exitoso. Revisa tu correo para verificar tu cuenta."
        );
        setTimeout(() => {
          router.push("/auth/login");
        }, 3000);
      }
    } catch (error: any) {
      if (error.response?.status === 409) {
        setErrorMessage("❌ El correo ya está registrado. Intenta con otro.");
      } else {
        setErrorMessage("❌ Error en el registro. Inténtalo de nuevo.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Card className='w-full max-w-sm min-h-[500px] p-8 shadow-lg rounded-xxl bg-white text-center'>
        <div className='flex justify-center mb-4'>
          <Image src={logo} alt='Logo' width={150} height={50} />
        </div>
        <Typography className='text-center text-gray-800 mb-4'>
          Estás a un paso de formar parte de esta gran comunidad
        </Typography>

        {/* Selección de tipo de cuenta */}
        <div className='flex justify-center gap-4 mb-4'>
          <Radio
            name='accountType'
            label='Persona'
            value='persona'
            checked={accountType === "persona"}
            onChange={handleAccountTypeChange}
          />
          <Radio
            name='accountType'
            label='Organización'
            value='organizacion'
            checked={accountType === "organizacion"}
            onChange={handleAccountTypeChange}
          />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          {accountType === "organizacion" && (
            <div className='text-left'>
              <label className='text-gray-700 font-medium text-sm'>
                Nombre de la Organización
              </label>
              <Input
                type='text'
                {...register("organizationName")}
                maxLength={50}
                className='w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#9747FF]'
              />
              {errors.organizationName && (
                <p className='text-red-500 text-sm'>
                  {errors.organizationName.message as string}
                </p>
              )}
            </div>
          )}
          <div className='text-left'>
            <label className='text-gray-700 font-medium text-sm'>
              {accountType === "organizacion"
                ? "Nombre del Responsable"
                : "Nombre"}
            </label>
            <Input
              type='text'
              {...register("fullName")}
              maxLength={50}
              className='w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#9747FF]'
            />
            {errors.fullName && watchedFields.fullName && (
              <p className='text-red-500 text-sm'>
                {errors.fullName.message as string}
              </p>
            )}
          </div>

          <div className='text-left'>
            <label className='text-gray-700 font-medium text-sm'>Correo</label>
            <Input
              type='email'
              {...register("email")}
              maxLength={50}
              className='w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#9747FF]'
            />
            {errors.email && watchedFields.email && (
              <p className='text-red-500 text-sm'>
                {errors.email.message as string}
              </p>
            )}
          </div>

          <div className='text-left'>
            <label className='text-gray-700 font-medium text-sm'>
              Contraseña
            </label>
            <div className='relative'>
              <Input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                maxLength={64}
                className='w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#9747FF]'
              />
              <div
                className='absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer'
                onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? (
                                  <EyeOffIcon  className="w-5 h-5"/>

                ) : (
                  <EyeIcon className="w-5 h-5"/>
                )}
              </div>
            </div>
            {/* Requisitos de contraseña con validación visual */}
            <div className='bg-gray-100 p-3 rounded-md mt-2 mb-2'>
              <p className='text-left font-medium text-sm mb-1'>
                La contraseña debe contener lo siguiente:
              </p>
              <ul className='space-y-1'>
                <li
                  className={`flex items-center text-sm ${passwordChecks.length ? "text-green-500" : "text-red-500"
                    }`}>
                  <span className='mr-2'>
                    {passwordChecks.length ? "✓" : "×"}
                  </span>
                  Entre 8 y 64 caracteres
                </li>
                <li
                  className={`flex items-center text-sm ${passwordChecks.lowercase ? "text-green-500" : "text-red-500"
                    }`}>
                  <span className='mr-2'>
                    {passwordChecks.lowercase ? "✓" : "×"}
                  </span>
                  Al menos 1 letra minúscula
                </li>
                <li
                  className={`flex items-center text-sm ${passwordChecks.uppercase ? "text-green-500" : "text-red-500"
                    }`}>
                  <span className='mr-2'>
                    {passwordChecks.uppercase ? "✓" : "×"}
                  </span>
                  Al menos 1 letra mayúscula
                </li>
                <li
                  className={`flex items-center text-sm ${passwordChecks.number ? "text-green-500" : "text-red-500"
                    }`}>
                  <span className='mr-2'>
                    {passwordChecks.number ? "✓" : "×"}
                  </span>
                  Al menos 1 número
                </li>
              </ul>
            </div>
          </div>

          <div className='text-left'>
            <label className='text-gray-700 font-medium text-sm'>
              Confirmar Contraseña
            </label>
            <div className='relative'>
              <Input
                type={showConfirmPassword ? "text" : "password"}
                {...register("confirmPassword")}
                maxLength={64}
                className='w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#9747FF]'
              />
              <div
                className='absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer'
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                {showConfirmPassword ? (
                                                   <EyeOffIcon  className="w-5 h-5"/>

                ) : (
                  <EyeIcon className="w-5 h-5"/>
                )}
              </div>
            </div>
            {errors.confirmPassword && watchedFields.confirmPassword && (
              <p className='text-red-500 text-sm'>
                {errors.confirmPassword.message as string}
              </p>
            )}
          </div>

          <div className='flex flex-col items-center justify-center space-y-6 mt-6'>
            <Button
              type='submit'
              className='bg-[#9747FF] text-white py-3 rounded-xl px-6 w-48'
              disabled={isSubmitting}>
              {isSubmitting ? (
                <div className='flex items-center justify-center'>
                  <Loader2Icon className=" animate-spin mr-2"
                
                />
                  Procesando...
                </div>
              ) : (
                "Crear cuenta"
              )}
            </Button>
            <Link
              href='/auth/login'
              className='border border-blue-600 text-blue-600 py-3 rounded-xl bg-transparent w-48'>
              Iniciar sesión
            </Link>
          </div>
        </form>
      </Card>
      {errorMessage && (
        <Alert
          open={true}
          color="red"
          animate={{
            mount: { y: 0 },
            unmount: { y: -100 },
          }}
          icon={<X className="h-5 w-5" />}
          onClose={() => setErrorMessage("")}
          className="fixed top-4 right-4 w-72 shadow-lg z-[10001]"
        >
          <p className="text-sm">{errorMessage.replace("❌ ", "")}</p>
        </Alert>
      )}
      {successMessage && (
        <Alert
          open={true}
          color="green"
          animate={{
            mount: { y: 0 },
            unmount: { y: -100 },
          }}
          icon={<Check className="h-5 w-5" />}
          onClose={() => setSuccessMessage("")}
          className="fixed top-4 right-4 w-72 shadow-lg z-[10001]"
        >
          <p className="text-sm">{successMessage.replace("✅ ", "")}</p>
        </Alert>
      )}
    </div>
  );
}