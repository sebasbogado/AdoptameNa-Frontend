'use client'

import { Product } from "@/types/product";
import Button from "@/components/buttons/button";
import ReportButton from "../buttons/report-button";
import EditButton from "../buttons/edit-button";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";

interface ProductHeaderProps {
  product: Product
}

const handleWhatsAppClick = (phoneNumber: string) => {
  const message = "Hola, estoy interesado en tu producto";
  const url = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
}

export const ProductHeader = ({ product }: ProductHeaderProps) => {
  const { user } = useAuth();
  const isOwner = user?.id === product?.userId;
  return (
    <div className="flex flex-col w-full p-0 px-4 mb-2 gap-4 sm:flex-row sm:justify-between sm:items-center sm:px-12">
      <div>
        <h1 className={`text-5xl font-black bg-transparent border-2 border-transparent focus:outline-none w-full`}>
          {product?.title}
        </h1>
        <p className="text-2xl text-gray-700 ">
          Publicado por <Link className="text-[#4781FF]" href={`/profile/${product?.userId}`}>{product?.organizationName || product?.userFullName}</Link>
        </p>
      </div>
      <div className="gap-3 flex justify-end">
        {!isOwner && (
          <Button variant="cta" size="md" className="mt-4" onClick={() => handleWhatsAppClick(product?.contactNumber as string)}>
            Contactar
          </Button>
        )}
        <ReportButton size="md" idProduct={product?.id.toString()} className="mt-4" />
        {isOwner && (
          <Link href={`\/edit-product/${product?.id}`}>
            <EditButton size="md" isEditing={false} className="mt-4" />
          </Link>
        )}

      </div>
    </div >
  );
}