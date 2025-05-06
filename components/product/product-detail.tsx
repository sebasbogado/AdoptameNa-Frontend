'use client';

import { Product } from "@/types/product";
import PostLocationMap from "../post/post-location-map";

interface ProductDetailProps {
  product?: Product;
}

export const ProductDetail = ({ product }: ProductDetailProps) => {
  return (
    <section>
      <div className="left-10 pl-12 text-gray-700">
        <h2 className="text-4xl text-gray-800 mt-8"> Descripción</h2>
        <p className="text-2xl mt-4">
          {product?.content}
        </p>
      </div>
      <PostLocationMap location={product?.locationCoordinates} isPreciseLocation={true}/>
    </section>
  );
};