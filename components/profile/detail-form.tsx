'use client';

import { useAuth } from "@/contexts/auth-context";
import { User } from "@/types/auth";
import { Post } from "@/types/post";
import { UserProfile } from "@/types/user-profile";
import { MapPin, PhoneIcon } from "lucide-react";
import React, { useEffect, useState } from "react";

interface InputProps {
  user: User;
  posts: Post[];
  isDisable: boolean;
  userProfile: UserProfile | null;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  validationErrors: Record<string, string>; // Nuevo prop para errores de validación

  //Para futuro uso con API
  donatedAmount?: number; // ej. 2010500
  goalAmount?: number;    // ej. 17000000
  fundraisingTitle?: string;
  isFundraisingActive?: boolean;
  handleStartFundraising?: () => void;
}

export const Detail = ({ user, posts, userProfile, isDisable, setUserProfile, validationErrors, fundraisingTitle, donatedAmount, goalAmount, isFundraisingActive, handleStartFundraising }: InputProps) => {
  const handleInputChange = (field: string, value: string) => {
    setUserProfile((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  const isOrganization = !!userProfile?.organizationName?.trim();
  const displayName: string = userProfile?.organizationName?.trim() ? userProfile.organizationName : userProfile?.fullName ?? "";
  const { user: userAuth } = useAuth();
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    if (userAuth && userProfile?.id) {
      if (String(userAuth.id) === String(userProfile.id)) {
        setIsOwner(true);
      } else {
        setIsOwner(false);
      }
    }
  }, [userAuth, userProfile]);

  return (
    <div className="relative p-6 left-10 bg-white shadow-lg rounded-xl font-roboto z-50  mt-[-50px] w-[55vw]">
      <form>
        {/* Nombre Completo */}
        <input
          type="text"
          disabled={isDisable}
          value={displayName}
          className={`text-5xl font-black bg-transparent border-2 ${!isDisable ? "border-blue" : "border-transparent"} focus:outline-none w-full`}
          onChange={(e) => handleInputChange(isOrganization ? "organizationName" : "fullName", e.target.value)}
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

        {/* Fase 1: Antes de Iniciar la colecta */}
        {!isFundraisingActive && isOwner && isOrganization && (
          <div className="mt-8">
            {/* Título de la fase 1 */}
            <p className="text-3xl font-extrabold text-gray-800 mb-4">
              {"Inicia tu campaña de recaudación"}
            </p>

            {/* Contenedor para el botón con alineación a la derecha */}
            <div className="flex justify-end">
              <button
                onClick={handleStartFundraising}
                className="bg-[#4781ff] hover:bg-[#222222] text-white py-3 px-8 rounded-lg text-xl font-semibold shadow-lg hover:scale-105"
              >
                Iniciar colecta
              </button>
            </div>
          </div>
        )}


        {/* Fase 2: Cuando la colecta está activa */}
        {isFundraisingActive && isOwner && isOrganization && (
          <div className="mt-8">
            <p className="text-3xl font-extrabold text-gray-800 mb-4">
              {fundraisingTitle}
            </p>

            {/* Barra de Progreso */}
            <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
              <div
                className="bg-yellow-400 h-4 rounded-full"
                style={{
                  width: goalAmount
                    ? `${Math.min(100, (donatedAmount! / goalAmount) * 100)}%`
                    : '0%',
                }}
              ></div>
            </div>

            {/* Monto + Botones */}
            <div className="flex justify-between items-center">
              <p className="text-xl text-gray-900 font-bold">
                Gs. {donatedAmount?.toLocaleString('es-PY')} de Gs. {goalAmount?.toLocaleString('es-PY')}
              </p>

              {/* Botones visibles solo al dueño */}
              {!isNaN(Number(user?.id)) && Number(user?.id) === userProfile?.id && (
                <div className="flex gap-4">
                  <button
                    type="button"
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-lg text-lg font-extrabold"
                  >
                    Finalizar
                  </button>
                  <button
                    type="button"
                    className="bg-yellow-400 hover:bg-yellow-500 text-white px-6 py-2.5 rounded-lg text-lg font-extrabold"
                  >
                    Actualizar
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Fase 3: Cuando la colecta está activa y no se visita el perfil sin ser dueño*/}
        {isFundraisingActive && !isOwner && isOrganization && (
          <div className="mt-8">
            <p className="text-3xl font-extrabold text-gray-800 mb-4">
              {fundraisingTitle}
            </p>

            {/* Barra de Progreso */}
            <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
              <div
                className="bg-yellow-400 h-4 rounded-full"
                style={{
                  width: goalAmount
                    ? `${Math.min(100, (donatedAmount! / goalAmount) * 100)}%`
                    : '0%',
                }}
              ></div>
            </div>

            {/* Monto + Botones */}
            <div className="flex justify-between items-center">
              <p className="text-xl text-gray-900 font-bold">
                Gs. {donatedAmount?.toLocaleString('es-PY')} de Gs. {goalAmount?.toLocaleString('es-PY')}
              </p>

              {/* Botones visibles solo para el Visitante */}
              {!isNaN(Number(user?.id)) && Number(user?.id) === userProfile?.id && (
                <div className="flex gap-4">
                  <button className="bg-yellow-400 hover:bg-yellow-500 text-white py-3 px-8 rounded-lg text-xl font-semibold shadow-lg mt-4">
                    Donar
                  </button>
                </div>
              )}
            </div>
          </div>
        )}




      </form>
    </div>
  );
};