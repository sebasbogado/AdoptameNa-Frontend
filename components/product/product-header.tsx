'use client'

import { Product } from "@/types/product";
import Button from "@/components/buttons/button";
import ReportButton from "../buttons/report-button";
import EditButton from "../buttons/edit-button";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";

interface ProductHeaderProps {
  product?: Product
}

const handleWhatsAppClick = (phoneNumber: string) => {
  console.log("WhatsApp clicked");
  const message = "Hola, estoy interesado en tu producto";
  const url = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
}

export const ProductHeader = ({ product }: ProductHeaderProps) => {
  const { user } = useAuth();
  const isOwner = user?.id === product?.userId;
  return (
    <div className="flex justify-between items-center px-12 mb-2">
      <div>
        <h1 className={`text-5xl font-black bg-transparent border-2 border-transparent focus:outline-none w-full`}>
          {product?.title}
        </h1>
        <p className="text-2xl text-gray-700 ">
          Publicado por <Link className="text-[#4781FF]" href={`/profile/${product?.userId}`}>{product?.userFullName}</Link>
        </p>
      </div>
      <div className="gap-3 flex justify-end">
        {!isOwner && (
          <Button variant="cta" size="md" className="mt-4" onClick={() => handleWhatsAppClick(product?.contactNumber as string)}>
            Contactar
          </Button>
        )}
        <ReportButton size="md" className="mt-4" />
        {isOwner && (
          <EditButton size="md" isEditing={false} className="mt-4" />
        )}
      </div>
    </div >
  );
}