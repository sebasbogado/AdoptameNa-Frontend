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
  requesterName: string;
  requesterPhone: string;
  requesterEmail: string;
  onAccept: () => void;
  onReject: () => void;
  className?: string;
};

export default function AdoptionRequestCard({
  petImage,
  petName,
  requesterName,
  requesterPhone,
  requesterEmail,
  onAccept,
  onReject,
  className,
}: AdoptionRequestCardProps) {
  return (
    <div className={clsx("w-64 rounded-xl overflow-hidden bg-white drop-shadow-md flex flex-col relative", className)}>
      <CardImage
        media={petImage}
      />

      <div className="p-4 space-y-2 text-sm">
        <p><strong>Mascota:</strong> {petName}</p>
        <p><strong>Solicitante:</strong> {requesterName}</p>
        <p><strong>Teléfono:</strong> {requesterPhone}</p>
        <p><strong>Correo:</strong> {requesterEmail}</p>
      </div>

      <div className="m-4 flex gap-2 justify-center">
        <Button size="sm" onClick={onAccept} className="flex items-center justify-center">
          <CheckIcon className="w-3 h-3 mr-2 text-white" strokeWidth={4} />
          Aceptar
        </Button>
        <Button variant="danger" size="sm" onClick={onReject} className="flex items-center justify-center">
          <XIcon className="w-3 h-3  mr-2 text-white" strokeWidth={4} />
          Denegar
        </Button>
      </div>
    </div>
  );
}
