'use client'

import { Product } from "@/types/product";
import ReportButton from "../buttons/report-button";
import EditButton from "../buttons/edit-button";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import DropdownContactButton from '@/components/product/dropdown-contact-button';
import { UserProfile } from '@/types/user-profile';

interface ProductHeaderProps {
  product: Product
  userProfile: UserProfile;
}

export const ProductHeader = ({ product, userProfile }: ProductHeaderProps) => {
  const { user } = useAuth();
  const isOwner = user?.id === product?.userId;

  const handleWhatsAppClick = () => {
    const url = `https://api.whatsapp.com/send?phone=${userProfile.phoneNumber}&text=${encodeURIComponent("Hola, estoy interesado en tu producto")}`;
    window.open(url, "_blank");
  };

  const handleContactClick = () => {

    const destinatario = userProfile?.email;
    const asunto = "Consulta desde Adoptamena";
    const mensaje = "Hola, tengo una consulta sobre...";
    const mailtoUrl = `mailto:${destinatario}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(mensaje)}`;
    window.location.href = mailtoUrl;
  };


  return (
    <div className="flex justify-between items-center px-12 mb-2">
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
          <DropdownContactButton variant="cta" size="md" className="mt-4" handleContactClick={handleContactClick} handleWhatsAppClick={handleWhatsAppClick} userProfile={userProfile} />
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