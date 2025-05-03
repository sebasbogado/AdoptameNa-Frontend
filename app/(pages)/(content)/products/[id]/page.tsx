"use client"

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Product } from "@/types/product";
import { getProduct, getProducts } from "@/utils/product.http";
import { PostHeader } from "@/components/post/post-header";
import { ProductHeader } from "@/components/product/product-header";
import { ProductSpecification } from "@/components/product/product-specefication";
import { ProductDetail } from "@/components/product/product-detail";
import PostSidebar from "@/components/post/post-sidebar";
import { ProductSidebar } from "@/components/product/product-sidebar";

const fetchProduct = async (id: string, setProduct: React.Dispatch<React.SetStateAction<Product | null>>, setLoading: React.Dispatch<React.SetStateAction<boolean>>, setError: React.Dispatch<React.SetStateAction<boolean>>) => {
  try {
    setLoading(true);
    const product = await getProduct(id);
    setProduct(product);
  } catch (error: any) {
    setError(true);
  } finally {
    setLoading(false);
  }
}

const ProductPage = () => {
  const [product, setProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const params = useParams();

  useEffect(() => {
    const productId = params.id;
    if (!productId) {
      setError(true);
      return;
    }
    fetchProduct(productId as string, setProduct, setLoading, setError);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      const protucts = await getProducts({ size: 5, page: 0 });
      setProducts(protucts.data);
    }
    fetchProducts();
  }, [])

  useEffect(() => { console.log(product) }, [product]);
  return (
    <div>
      <div className="mt-6 ">
        <ProductHeader product={product as Product} />
        <ProductSpecification product={product as Product} />
        <div className="grid grid-cols-2">
          <ProductDetail product={product as Product} />
          <ProductSidebar products={products} />
        </div>
      </div>
    </div>
  );

}

export default ProductPage;