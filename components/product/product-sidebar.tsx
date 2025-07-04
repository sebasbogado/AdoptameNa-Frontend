'use client'

import { Product } from "@/types/product";
import ProductCard from "../product-Card/product-card";

interface ProductSidebarProps {
  products: Product[]
}
export const ProductSidebar = ({ products }: ProductSidebarProps) => {
  return (
    <section className="mt-8 sm:ml-24">
      <h2 className="px-4 sm:pl-12 text-2xl text-gray-700 my-4">
        {products.length > 0 ? "Productos relacionados" : "No hay productos relacionados"}
      </h2>
      {products.length > 0 && (
        <div className="px-4 sm:pl-12 text-gray-700">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 gap-y-10">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}
    </section>
  )
}