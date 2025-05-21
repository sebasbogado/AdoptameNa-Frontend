'use client'

import { useState } from "react";
import clsx from "clsx";
import { Alert } from "@material-tailwind/react";
import { Check, X } from "lucide-react";
import { Product } from "@/types/product";
import CardImage from "../petCard/card-image";
import Link from "next/link";
import CardText from "../petCard/card-text";

type ProductCardProps = {
    product: Product;
    className?: string
};

export default function ProductCard({ product, className }: ProductCardProps) {
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    return (
 <div className={clsx(
            "snap-start shrink-0 w-[16rem]  h-[19rem] rounded-3xl overflow-hidden bg-white drop-shadow-md flex flex-col relative",
            className
        )}>
            {successMessage && (
                <Alert
                    open={true}
                    color="green"
                    animate={{
                        mount: { y: 0 },
                        unmount: { y: -100 },
                    }}
                    icon={<Check className="h-5 w-5" />}
                    onClose={() => setSuccessMessage("")}
                    className="fixed top-4 right-4 w-72 shadow-lg z-[10001]"
                >
                    <p className="text-sm">{successMessage}</p>
                </Alert>
            )}
            {errorMessage && (
                <Alert
                    open={true}
                    color="red"
                    animate={{
                        mount: { y: 0 },
                        unmount: { y: -100 },
                    }}
                    icon={<X className="h-5 w-5" />}
                    onClose={() => setErrorMessage("")}
                    className="fixed top-4 right-4 w-72 shadow-lg z-[10001]"
                >
                    <p className="text-sm">{errorMessage}</p>
                </Alert>
            )}

            <Link href={`/marketplace/${product.id}`}>
                {product.media[0]?.mimeType && product.media[0].mimeType.startsWith("video/") ? (
                    <video
                        className="w-full h-36 object-cover rounded-lg"
                        src={product.media[0].url}
                        muted
                        playsInline
                    />
                ) : (
                    <CardImage media={product.media[0]} />
                )}
                <CardText post={product} />
            </Link>
        </div>
    );
}