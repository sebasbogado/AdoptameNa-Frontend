'use client'

import { Product } from "@/types/product";
import Button from "@/components/buttons/button";
import ReportButton from "../buttons/report-button";
import EditButton from "../buttons/edit-button";
import Link from "next/link";

interface ProductHeaderProps {
  product?: Product
}
{/**FALTA: logica de botones */}
export const ProductHeader = ({ product }: ProductHeaderProps) => {
  return (
    <div className="flex justify-between align-items-center flex-column px-12">
      <div>
        <h1 className={`text-5xl font-black bg-transparent border-2 border-transparent focus:outline-none w-full`}>
          {product?.title}
        </h1>
        <p className="text-2xl text-gray-700 ">
          Publicado por <Link className="text-[#4781FF]" href={`/profile/${product?.userId}`}>{product?.userFullName}</Link>
        </p>
      </div>
      <div className="gap-3 flex justify-end">
        {/**Falta link para redirigir a wha y que sea campo obligatorio en el formulario */}
        <Button variant="cta" size="md" className="mt-4" onClick={() =>  console.log("Comprar")}>
          Contactar
        </Button>
        <ReportButton size="md" className="mt-4" />
        <EditButton size="md" isEditing={false} className="mt-4" />
      </div>
    </div >
  );
}