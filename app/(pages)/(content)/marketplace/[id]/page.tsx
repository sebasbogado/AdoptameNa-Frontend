"use client"

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Product } from "@/types/product";
import { getProduct, getProducts } from "@/utils/product.http";
import { ProductHeader } from "@/components/product/product-header";
import { ProductSpecification } from "@/components/product/product-specification";
import { ProductDetail } from "@/components/product/product-detail";
import { ProductSidebar } from "@/components/product/product-sidebar";
import PostComments from "@/components/post/post-comments";
import { useAuth } from "@/contexts/auth-context";
import Loading from "@/app/loading";
import NotFound from "@/app/not-found";
import { getUserProfile } from '@/utils/user-profile.http';
import { UserProfile } from '@/types/user-profile';

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
  const { user, loading: userLoading, authToken } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
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
    if (!product) return;
    getUserProfile(product.userId.toString())
      .then(profile => setUserProfile(profile))
      .catch(console.error);
  }, [product]);

  useEffect(() => {
    const fetchProducts = async () => {
      const products = await getProducts({ size: 4, page: 0 });
      setProducts(products.data);
    }
    fetchProducts();
  }, [])

  const handleProductUpdate = (updatedProduct: Product) => {
    setProduct(updatedProduct);
  };
  
  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <NotFound />;
  }

  return (
    <div>
      <div className="mt-6">
        <ProductHeader product={product as Product} onProductUpdate={handleProductUpdate} />
        <ProductSpecification product={product as Product} />
        <div className="flex flex-col mb-2 items-center sm:grid sm:grid-cols-2">
          <div>
            <ProductDetail product={product as Product} />
            <PostComments
              user={user}
              userLoading={userLoading}
              referenceId={product?.id as number}
              referenceType="PRODUCT"
              authToken={authToken ?? undefined}
            />
          </div>
          <ProductSidebar products={products} />
        </div>
      </div>
    </div>
  );
}

export default ProductPage;