'use client'

import { Product } from "@/types/product";
import ReportButton from "../buttons/report-button";
import EditButton from "../buttons/edit-button";
import Link from "next/link";
import { ProductButtons } from "./product-buttons";
import { DropdownMenuButtons } from '@/components/profile/dropdown-buttons';
import { UserProfile } from '@/types/user-profile';

interface ProductHeaderProps {
  product: Product;
  onProductUpdate?: (updatedProduct: Product) => void;
}

export const ProductHeader = ({ product, onProductUpdate }: ProductHeaderProps) => {
  return (
    <div className="flex flex-col w-full p-0 px-4 mb-2 gap-4 sm:flex-row sm:justify-between sm:items-center sm:px-12">
      <div>
        <h1 className={`text-5xl font-black bg-transparent border-2 border-transparent focus:outline-none w-full`}>
          {product?.title}
        </h1>
        <p className="text-xl text-gray-700 ">
          Publicado por <Link className="text-[#4781FF]" href={`/profile/${product?.userId}`}>{product?.organizationName || product?.userFullName}</Link>
          <span className="ml-2">• Compartido {product.sharedCounter || 0} {product.sharedCounter === 1 ? 'vez' : 'veces'}</span>
        </p>
      </div>
      <ProductButtons product={product} onProductUpdate={onProductUpdate} />
    </div >
  );
}