'use client'

import { Product } from "@/types/product";
import ProductImageCarousel from "./product-image-carousel";
import { ProductTag } from "./product-tag";
import LabeledInput from "../inputs/labeled-input";

interface ProductSpecificationProps {
  product?: Product
}

export const ProductSpecification = ({ product }: ProductSpecificationProps) => {
  return (
    <div className={"grid grid-cols-5 px-12"}>
      <ProductImageCarousel media={product?.media as any} className="col-span-4" />
      <div className="col-span-1 pl-12">
        {/**Precio */}
        <ProductTag label={product?.price.toString() as string} isPrice />

        {/*Estado */}
        <h2 className="text-2xl">Estado</h2>
        <ProductTag label={product?.condition as string} />

        {/** Categoria */}
        <h2 className="text-2xl">Categoria</h2>
        <ProductTag label={product?.category.name as string} />

        {/**Animals */}
        {product?.animals && product?.animals.length > 0 && (
          <>
            <h2 className="text-2xl">Disponible para:</h2>
            <div className="grid grid-cols-2 gap-2">
              {product.animals.map((animal) => (
                <ProductTag key={animal.id} label={animal.name} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}