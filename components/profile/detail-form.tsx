'use client';

import { useAuth } from "@/contexts/auth-context";
import { User } from "@/types/auth";
import { Post } from "@/types/post";
import { UserProfile } from "@/types/user-profile";
import { MapPin, PhoneIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  donateToCrowdfunding,
  createCrowdfunding,
  getCrowdfundings,
  updateCrowdfunding,
  updateCrowdfundingStatus
} from "@/utils/crowfunding.http";
import CrowdfundingModal from "@/components/crowfunding-modal";
import { ResponseCrowdfundingDTO } from "@/types/crowdfunding";
import ConfirmationModal from "@/components/confirm-modal";

interface InputProps {
  user: User;
  posts: Post[];
  isDisable: boolean;
  userProfile: UserProfile | null;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  validationErrors: Record<string, string>; // Nuevo prop para errores de validación
  setSuccessMessage: (msg: string) => void;
  setErrorMessage: (msg: string) => void;
}

export const Detail = ({ user, posts, userProfile, isDisable, setUserProfile, validationErrors, setSuccessMessage, setErrorMessage }: InputProps) => {
  const handleInputChange = (field: string, value: string) => {
    setUserProfile((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  const [crowdfunding, setCrowdfunding] = useState<ResponseCrowdfundingDTO | null>(null);
  const [loadingCrowd, setLoadingCrowd] = useState(false);
  const isOrganization = !!userProfile?.organizationName?.trim();
  const displayName: string = userProfile?.organizationName?.trim() ? userProfile.organizationName : userProfile?.fullName ?? "";
  const { user: userAuth, authToken } = useAuth();
  const [isOwner, setIsOwner] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [crowdfundingToEdit, setCrowdfundingToEdit] = useState<ResponseCrowdfundingDTO | null>(null);
  const [isConfirmFinishOpen, setIsConfirmFinishOpen] = useState(false);


  useEffect(() => {
    if (userAuth && userProfile?.id) {
      if (String(userAuth.id) === String(userProfile.id)) {
        setIsOwner(true);
      } else {
        setIsOwner(false);
      }
    }
  }, [userAuth, userProfile]);

  useEffect(() => {
    const fetchCrowdfunding = async () => {
      if (!userProfile?.id || !authToken) return;

      try {
        setLoadingCrowd(true);
        const data = await getCrowdfundings(authToken, 0, 1, userProfile.id);
        if (data?.data?.length > 0) {
          setCrowdfunding(data.data[0]);
        }
      } catch (err) {
        console.error("Error al obtener crowdfunding:", err);
      } finally {
        setLoadingCrowd(false);
      }
    };
    fetchCrowdfunding();
  }, [authToken, userAuth?.id, isOrganization]);

  const handleUpdateCrowdfunding = async () => {
    if (!authToken || !crowdfunding) return;
    try {
      const updated = await updateCrowdfunding(
        authToken,
        crowdfunding.id,
        crowdfunding.title,
        crowdfunding.description,
        crowdfunding.durationDays,
        crowdfunding.goal
      );
      setCrowdfunding(updated);
    } catch (err) {
      console.error("Error al actualizar la recaudación", err);
    }
  };

  const handleFinishCrowdfunding = async () => {
    if (!authToken || !crowdfunding) return;
    try {
      await updateCrowdfundingStatus(authToken, crowdfunding.id, "CLOSED");
      setCrowdfunding({ ...crowdfunding, status: "CLOSED" });
      setSuccessMessage?.("Colecta finalizada con éxito.");
    } catch (err) {
      console.error("Error al cerrar la recaudación", err);
      setErrorMessage?.("Ocurrió un error al finalizar la colecta.");
    }
  };


  const handleDonate = async () => {
    if (!authToken || !crowdfunding) return;

    const donationAmount = prompt("¿Cuánto deseas donar?", "50000");
    const parsedAmount = parseInt(donationAmount || "0");

    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      alert("Monto inválido");
      return;
    }

    try {
      const updated = await donateToCrowdfunding(authToken, crowdfunding.id, parsedAmount);
      setCrowdfunding(updated);
      setSuccessMessage("¡Donación realizada con éxito!");
    } catch (error) {
      console.error("Error al donar:", error);
      setErrorMessage("No se pudo realizar la donación.");
    }
  };



  const renderCrowdfunding = () => {
    if (!isOrganization || loadingCrowd) return null;

    console.log("testeo de renderizado")

    const isActive = crowdfunding?.status === "ACTIVE";
    const isVisible = crowdfunding !== null;
    const metaAlcanzada = crowdfunding && crowdfunding.currentAmount >= crowdfunding.goal;

    const porcentaje = crowdfunding?.goal
      ? Math.min(100, (crowdfunding.currentAmount / crowdfunding.goal) * 100)
      : 0;

    //Fase 1: Organizacion sin colecta Activa
    if (isVisible && isOwner && !isActive) {
      return (
        <div className="mt-8">
          <p className="text-3xl font-extrabold text-gray-800 mb-4">Inicia tu campaña de recaudación</p>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="bg-[#4781ff] text-white py-3 px-8 rounded-lg text-xl font-semibold shadow-lg"
            >
              Iniciar colecta
            </button>
          </div>
        </div>
      );
    }

    //Fase 2: Organiacion con colecta Activa
    if (isVisible && isOwner && isActive) {
      return (
        <div className="mt-8">
          <p className="text-3xl font-extrabold text-gray-800 mb-4">{crowdfunding.title}</p>

          <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
            <div
              className={`${metaAlcanzada ? "bg-green-500" : "bg-[#F2AA0F]"} h-4 rounded-full`}
              style={{ width: `${porcentaje}%` }}
            ></div>
          </div>

          <div className="flex justify-between items-center">
            <p className="text-xl text-gray-900 font-bold">
              Gs. {crowdfunding.currentAmount.toLocaleString("es-PY")} de Gs. {crowdfunding.goal.toLocaleString("es-PY")}
            </p>

            {metaAlcanzada && (
              <p className="text-green-600 font-bold mt-2">
                ¡Monto alcanzado! Muchas felicidades por alcanzar tu objetivo 💚
              </p>
            )}

            {isOwner && (
              <div className="flex gap-4">
                <button
                  type="button"
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-lg text-lg font-extrabold"
                  onClick={() => setIsConfirmFinishOpen(true)}
                >
                  Finalizar
                </button>

                {/* <button
                type="button"
                className="bg-[#4781ff] hover:bg-[#3569e6] text-white px-6 py-2.5 rounded-lg text-lg font-extrabold"
                onClick={() => {
                  setCrowdfundingToEdit(crowdfunding);
                  setIsModalOpen(true);
                }}
              >
                Modificar
              </button> */}

                <button
                  type="button"
                  className="bg-[#F2AA0F] hover:bg-[#e09900] text-white px-6 py-2.5 rounded-lg text-lg font-extrabold"
                  onClick={handleDonate}
                >
                  Actualizar
                </button>
              </div>
            )}
          </div>
        </div>
      );
    }

    //Fase 3: Vista de usuario cuando hay una colecta activa
    if (isActive && !isOwner) {
      return (
        <div className="mt-8">
          <p className="text-3xl font-extrabold text-gray-800 mb-4">{crowdfunding.title}</p>

          <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
            <div
              className={`${metaAlcanzada ? "bg-green-500" : "bg-[#F2AA0F]"} h-4 rounded-full`}
              style={{ width: `${porcentaje}%` }}
            ></div>
          </div>

          <p className="text-xl text-gray-900 font-bold">
            Gs. {crowdfunding.currentAmount.toLocaleString("es-PY")} de Gs. {crowdfunding.goal.toLocaleString("es-PY")}
          </p>

          {metaAlcanzada && (
            <p className="text-green-600 font-bold mt-2">
              ¡Monto alcanzado! Gracias por tu contribución 💚
            </p>
          )}
        </div>
      );
    }

    return null;
  };




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

        {renderCrowdfunding()}

      </form>

      <CrowdfundingModal
        open={isModalOpen}
        setOpen={setIsModalOpen}
        selectedCrowdfunding={crowdfundingToEdit}
        onSaved={(updated) => {
          setCrowdfunding(updated);
          setIsModalOpen(false);
          setCrowdfundingToEdit(null);
        }}
        onDeleted={() => {
          setCrowdfunding(null);
          setIsModalOpen(false);
          setCrowdfundingToEdit(null);
        }}
        setSuccessMessage={(msg) => console.log("✅", msg)}
        setErrorMessage={(msg) => console.error("❌", msg)}
      />

      <ConfirmationModal
        isOpen={isConfirmFinishOpen}
        onClose={() => setIsConfirmFinishOpen(false)}
        onConfirm={async () => {
          setIsConfirmFinishOpen(false);
          await handleFinishCrowdfunding();
        }}
        title="Finalizar Colecta"
        message="¿Estás seguro que deseas finalizar esta colecta? Esta acción no se puede deshacer."
      />

    </div>
  );
};

