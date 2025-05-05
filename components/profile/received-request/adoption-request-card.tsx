'use client'
import React from "react";
import clsx from "clsx";
import Button from "@/components/buttons/button";
import { CheckIcon, XIcon } from "lucide-react";
import { Media } from "@/types/media";
import CardImage from "@/components/petCard/card-image";

type AdoptionRequestCardProps = {
  petImage: Media;
  petName: string;
  requesterName?: string;
  requesterPhone?: string;
  requesterEmail?: string;
  onAccept?: (id: number) => void;
  onReject?: (id: number) => void;
  status?: boolean;
  className?: string;
  requestId?: number;
};

export default function AdoptionRequestCard({
  petImage,
  petName,
  requesterName,
  requesterPhone,
  requesterEmail,
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
        {requesterName && <p><strong>Solicitante:</strong> {requesterName}</p>}
        {requesterPhone && <p><strong>Teléfono:</strong> {requesterPhone}</p>}
        {requesterEmail && <p><strong>Correo:</strong> {requesterEmail}</p>}
      </div>

      {onAccept && onReject && (
        <div className="m-4 flex gap-2 justify-center">
          <Button size="sm"  onClick={(event) => {
            event.preventDefault();
            onAccept?.(requestId!);
          }}  className="flex items-center justify-center">
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

      {status !== undefined && (
        <div className="px-4 pb-4">
          <p className={`text-sm font-semibold ${status ? 'text-green-600' : 'text-red-500'}`}>
            {status ? '✅ Solicitud aceptada' : '⌛ Pendiente'}
          </p>
        </div>
      )}
    </div>
  );
}
