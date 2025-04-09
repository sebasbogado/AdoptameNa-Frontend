'use client';

import { User } from "@/types/auth";
import { Post } from "@/types/post";
import { UserProfile } from "@/types/user-profile";
import { MapPin, PhoneIcon } from "lucide-react";
import React from "react";

interface InputProps {
  user: User;
  posts: Post[];
  isDisable: boolean;
  userProfile: UserProfile | null;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  validationErrors: Record<string, string>; // Nuevo prop para errores de validación
}

export const Detail = ({ posts, userProfile, isDisable, setUserProfile, validationErrors }: InputProps) => {
  const handleInputChange = (field: string, value: string) => {
    setUserProfile((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  return (
    <div className="relative p-6 left-10 bg-white shadow-lg rounded-xl font-roboto z-50  mt-[-50px] w-[55vw]">
      <form>
        {/* Nombre Completo */}
        <input
          type="text"
          disabled={isDisable}
          value={userProfile?.fullName ?? ""}
          className={`text-5xl font-black bg-transparent border-2 ${!isDisable ? "border-blue" : "border-transparent"
            } focus:outline-none w-full`}
          onChange={(e) => handleInputChange("fullName", e.target.value)}
        />
        {validationErrors.fullName && <p className="text-red-500 text-sm mt-1">{validationErrors.fullName}</p>}

        {/* Cantidad de publicaciones */}
        <p className="text-foreground text-gray-700 mt-4 text-3xl">{`${posts.length} Publicaciones`}</p>

        {/* Descripción */}
        <textarea
          disabled={isDisable}
          value={
            isDisable && !userProfile?.description
              ? "Sin descripción"
              : userProfile?.description ?? ""
          }
          className={`mt-2 text-foreground text-gray-700 mt-8 text-3xl bg-transparent border-2 ${!isDisable ? "border-blue" : "border-transparent"
            } focus:outline-none w-full resize-none`}
          onChange={(e) => handleInputChange("description", e.target.value)}
        />
        {validationErrors.description && <p className="text-red-500 text-sm mt-1">{validationErrors.description}</p>}
        {/* Teléfono */}
        {!isDisable && (
          <label className="text-gray-700 font-medium text-sm block mb-1">Teléfono</label>
        )}

        <div className={`flex ${isDisable ? "items-center gap-3" : "flex-col"} w-full`}>
          {isDisable && <PhoneIcon className="text-gray-500" />}
          <input
            type="text"
            disabled={isDisable}
            value={userProfile?.phoneNumber ?? ""}
            className={` text-foreground  text-gray-700 text-3xl bg-transparent border-2 ${!isDisable ? "border-blue" : "border-transparent"
              } focus:outline-none w-full`}
            onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
          />
          {validationErrors.phoneNumber && <p className="text-red-500 text-sm mt-1">{validationErrors.phoneNumber}</p>}

        </div>
         {/* Direccion */}
         {!isDisable && (
          <label className="text-gray-700 font-medium text-sm block mb-1">Dirección</label>
        )}
        <div className={`flex ${isDisable ? "items-center gap-3" : "flex-col"} w-full`}>
          {isDisable && <MapPin className="text-gray-500" />}
          <input
            type="text"
            disabled={isDisable}
            value={userProfile?.address ?? ""}
            className={` text-foreground  text-gray-700 text-3xl bg-transparent border-2 ${!isDisable ? "border-blue" : "border-transparent"
              } focus:outline-none w-full`}
            onChange={(e) => handleInputChange("address", e.target.value)}
          />
          {validationErrors.address && <p className="text-red-500 text-sm mt-1">{validationErrors.address}</p>}
        </div>

      </form>
    </div>
  );
};