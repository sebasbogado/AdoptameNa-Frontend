'use client'

import Loading from "@/app/loading";
import { CreateProfile } from "@/components/profile/create-form";
import { WelcomeUser } from "@/components/profile/welcome-user";
import { useAuth } from "@/contexts/auth-context";
import { UpdateUserProfile } from "@/types/user-profile";
import { updateUserProfile } from "@/utils/user-profile.http";
import { profileSchema, ProfileValues } from "@/validations/user-profile";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert } from "@material-tailwind/react";
import { use } from "chai";
import { Loader2Icon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function CreateProfilePage() {
  const [error, setError] = useState("");
  const { authToken, user, loading: authLoading, updateUserProfileCompletion } = useAuth();
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting }, reset,
  } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: "",
      phoneNumber: null,
      address: null,
      gender: "MALE",
      birthdate: null,
      addressCoordinates: undefined,
      description: "",
    }
  });
  useEffect(() => {
    if (user) {
      reset({

        fullName: user.fullName || "",
        phoneNumber: null,
        address: null,
        gender: "MALE",
        birthdate: null,
        description: "",
      });
    }
  }, [user, reset, setValue]);

  const onSubmit = (data: ProfileValues) => {
    setError("");

    const formattedBirthdate = data.birthdate
      ? data.birthdate.toISOString().split("T")[0]
      : null;

    console.log("Datos del formulario:", data); // Verificar aquí
    console.log("Coordenadas formateadas:", data.addressCoordinates?.join(","));
    updateProfile({
      ...data,
      addressCoordinates: data.addressCoordinates?.join(",") ?? "",
      birthdate: formattedBirthdate,
      description: data.description || "",
      organizationName: "",
      document: "",
      earnedPoints: 0,
      media: [],
      email: user?.email || "",
      isProfileCompleted: true,
    });
  };
  const updateProfile = async (profileToUpdate: UpdateUserProfile) => {
    if (authLoading || !authToken || !user?.id) return;
    console.log(user.isProfileCompleted)
    setError("");
    try {
      console.log("Actualizando perfil con:", profileToUpdate); // Verificar aquí
      const updatedProfile = await updateUserProfile(user.id, profileToUpdate, authToken);
      updateUserProfileCompletion(true);  // Actualiza el estado de finalización del perfil
      console.log("Perfil actualizado:", updatedProfile);
      router.push("/profile");

    } catch (err) {
      console.error("Error al actualizar el perfil:", err);
      setError("Error al crear el perfil. Por favor intenta nuevamente.");

    }
  };
  useEffect(() => {
    if (!user) {
      router.push("/auth/login");
    }

    if (user?.isProfileCompleted) {
      setLoading(false);  // Termina el loading si el perfil ya está completo

      router.push("/profile");
    } else {
      setLoading(false);  // Mantiene el loading mientras verificamos
    }
  }, [user, router]);
  if (authLoading || loading) {
    return Loading();
  }


  return (
    <div className="w-screen  flex justify-center items-center relative">
      <div className="w-full max-w-lg  p-8 bg-white text-center">
        <WelcomeUser />
        <CreateProfile setValue={setValue} handleSubmit={handleSubmit} onSubmit={onSubmit} register={register} isSubmitting={isSubmitting} errors={errors} />
        {error && (
          <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-auto">
            <Alert color="red" onClose={() => setError("")} className="text-sm px-4  w-fit flex items-center">
              {error}
            </Alert>
          </div>
        )}
      </div>
    </div>


  )
}

