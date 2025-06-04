import SendButton from "../buttons/send-button";
import ReportButton from "../buttons/report-button";
import EditButton from "../buttons/edit-button";
import { useState } from "react";
import { Alert } from "@material-tailwind/react";
import { Check } from "lucide-react";
import { shareProduct } from "@/utils/product.http";
import { useAuth } from "@/contexts/auth-context";
import Link from "next/link";
import Button from "../buttons/button";

export function ProductButtons({ product, onProductUpdate }: { product: any, onProductUpdate?: (updatedProduct: any) => void }) {
  const { user, authToken } = useAuth();
  const isOwner = user?.id === product?.userId;
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    if (!product) return;
    try {
      if (authToken) {
        await shareProduct(String(product.id), authToken);
        const updatedProduct = {
          ...product,
          sharedCounter: (product.sharedCounter || 0) + 1
        };
        if (onProductUpdate) onProductUpdate(updatedProduct);
      }
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (error) {
      console.error("Error sharing product:", error);
    }
  };

  const handleWhatsAppClick = (phoneNumber: string) => {
    const message = "Hola, estoy interesado en tu producto";
    const url = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="gap-3 flex items-center">
      {!isOwner && (
        <Button variant="cta" size="md" className="mt-0" onClick={() => handleWhatsAppClick(product?.contactNumber as string)}>
          Contactar
        </Button>
      )}
      <div className="relative">
        <SendButton size="md" onClick={handleShare} disabled={copied} />
        {copied && (
          <Alert open={true} color="gray" icon={<Check className="h-5 w-5" />}
            className="fixed top-4 right-4 w-72 shadow-lg z-[10001]">
            <p className="text-sm">¡Enlace copiado al portapapeles!</p>
          </Alert>
        )}
      </div>
      {!isOwner && (
        <ReportButton size="md" idProduct={product?.id.toString()} className="mt-0" />
      )}
      {isOwner && (
        <Link href={`/edit-product/${product?.id}`}>
          <EditButton size="md" isEditing={false} className="mt-0" />
        </Link>
      )}
    </div>
  );
} 