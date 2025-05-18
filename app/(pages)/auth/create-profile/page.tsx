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
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function CreateProfilePage() {
  const [error, setError] = useState("");
  const { authToken, user, loading: authLoading, updateUserProfileCompletion } = useAuth();
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    reset,
    getValues,
    trigger,
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
    },
    mode: "onSubmit"
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
  }, [user, reset]);

  const onSubmit = async (data: ProfileValues) => {
    try {
      setError("");

      const profileToUpdate: UpdateUserProfile = {
        fullName: data.fullName,
        description: data.description || "",
        gender: data.gender,
        birthdate: data.birthdate ? data.birthdate.toISOString().split("T")[0] : null,
        phoneNumber: data.phoneNumber,
        address: data.address,
        addressCoordinates: data.addressCoordinates ? data.addressCoordinates.join(",") : null,
        departmentId: data.departmentId || null,
        districtId: data.districtId || null,
        neighborhoodId: data.neighborhoodId || null,
        organizationName: data.organizationName ?? "",
        document: "",
        earnedPoints: 0,
        email: user?.email || "",
        isProfileCompleted: true,
        longitude: data.addressCoordinates ? data.addressCoordinates[1] : null,
        latitude: data.addressCoordinates ? data.addressCoordinates[0] : null,
      };


      await updateProfile(profileToUpdate);
    } catch (err) {
      setError("Error al procesar el formulario. Por favor intenta nuevamente.");
    }
  };

  const updateProfile = async (profileToUpdate: UpdateUserProfile) => {
    if (authLoading || !authToken || !user?.id) {
      setError("Error de autenticación. Por favor inicia sesión nuevamente.");
      return;
    }

    setError("");
    try {
      const updatedProfile = await updateUserProfile(user.id, profileToUpdate, authToken);
      updateUserProfileCompletion(true);
      router.push("/profile");
    } catch (err: any) {
      if (err.message && err.message.includes("401")) {
        setError("Sesión expirada. Por favor inicia sesión nuevamente.");
      } else {
        setError("Error al crear el perfil. Por favor intenta nuevamente.");
      }
    }
  };

  useEffect(() => {
    if (!user) {
      router.push("/auth/login");
    }

    if (user?.isProfileCompleted) {
      setLoading(false);

      router.push("/profile");
    } else {
      setLoading(false);
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

