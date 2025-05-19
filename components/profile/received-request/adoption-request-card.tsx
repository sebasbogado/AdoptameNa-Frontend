'use client'
import React from "react";
import clsx from "clsx";
import Button from "@/components/buttons/button";
import { CheckCircle, CheckIcon, Hourglass, XIcon } from "lucide-react";
import { Media } from "@/types/media";
import CardImage from "@/components/petCard/card-image";

type AdoptionRequestCardProps = {
  petImage: Media;
  petName: string;
  owner?: string;
  requesterName?: string;
  requesterPhone?: string;
  requesterEmail?: string;
  onAccept?: (id: number) => void;
  onReject?: (id: number) => void;
  status?: "PENDING" | "ACCEPTED" | "REJECTED";
  className?: string;
  requestId?: number;
  requesterBreed?: string;
  requesterPetType?: string;
};

export default function AdoptionRequestCard({
  petImage,
  petName,
  owner,
  requesterName,
  requesterPhone,
  requesterEmail,
  requesterBreed,
  requesterPetType,
  onAccept,
  onReject,
  status,
  className,
  requestId,
}: AdoptionRequestCardProps) {
  return (
    <div className={clsx("w-64 rounded-xl overflow-hidden bg-white drop-shadow-md flex flex-col relative", className)}>
      <CardImage
        media={petImage}
      />

      <div className="p-4 space-y-2 text-sm">
        <p><strong>Mascota:</strong> {petName}</p>
        {requesterPetType && <p><strong>Animal:</strong> {requesterPetType}</p>}
        {requesterBreed && <p><strong>Raza:</strong> {requesterBreed}</p>}
        {owner && <p><strong>Publicado por:</strong> {owner}</p>}
        {requesterName && <p><strong>Solicitante:</strong> {requesterName}</p>}
        {requesterPhone && <p><strong>Teléfono:</strong> {requesterPhone}</p>}
        {requesterEmail && <p><strong>Correo:</strong> {requesterEmail}</p>}
      </div>

      {onAccept && onReject && status === "PENDING" && (
        <div className="m-4 flex gap-2 justify-center">
          <Button size="sm" onClick={(event) => {
            event.preventDefault();
            onAccept?.(requestId!);
          }} className="flex items-center justify-center">
            <CheckIcon className="w-3 h-3 mr-2 text-white" strokeWidth={4} />
            Aceptar
          </Button>
          <Button variant="danger" size="sm" onClick={(event) => {
            event.preventDefault();
            onReject?.(requestId!);
          }} className="flex items-center justify-center">
            <XIcon className="w-3 h-3  mr-2 text-white" strokeWidth={4} />
            Denegar
          </Button>
        </div>
      )}

      {status && (
        <div className="px-4 pb-4 flex items-center gap-2">
          {status === "ACCEPTED" ? (
            <>
              <CheckCircle className="text-green-600 w-4 h-4" />
              <p className="text-sm font-semibold text-green-600">Solicitud aceptada</p>
            </>
          ) : status === "REJECTED" ? (
            <>
              <XIcon className="text-red-500 w-4 h-4" />
              <p className="text-sm font-semibold text-red-500">Solicitud rechazada</p>
            </>
          ) : (
            <>
              <Hourglass className="text-yellow-500 w-4 h-4 animate-pulse" />
              <p className="text-sm font-semibold text-yellow-500">Pendiente</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
