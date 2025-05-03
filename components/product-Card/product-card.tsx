'use client'

import { useAuth } from "@/contexts/auth-context";
import { useState } from "react";
import clsx from "clsx";
import { Alert } from "@material-tailwind/react";
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
    const { authToken } = useAuth(); // Hook de autenticación

    return (
 <div className={clsx(
            "snap-start shrink-0 w-[16rem]  h-[19rem] rounded-3xl overflow-hidden bg-white drop-shadow-md flex flex-col relative",
            className
        )}>              <div className="relative">
                {successMessage && (
                    <Alert
                        color="green"
                        onClose={() => setSuccessMessage("")}
                        className="fixed bottom-4 right-0 m-2 z-50 w-60"
                    >
                        {successMessage}
                    </Alert>
                )}
                {errorMessage && (
                    <Alert
                        color="red"
                        onClose={() => setErrorMessage("")}
                        className="fixed bottom-4 right-0 m-2 z-50 w-60"
                    >
                        {errorMessage}
                    </Alert>
                )}
            </div>

            <Link href={`/marketplace`}>
                <CardImage media={product.media[0]} />
                <CardText post={product} />
            </Link>
        </div>
    );
}