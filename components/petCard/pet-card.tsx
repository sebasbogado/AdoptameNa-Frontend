'use client'
import React, { useState } from "react";
import clsx from "clsx";
import CardImage from "@/components/petCard/card-image";
import CardText from "./card-text";
import FavoriteButton from "../buttons/favorite-button";
import { Post } from "@/types/post";
import { Pet } from "@/types/pet";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { addFavorite, deleteFavorite } from "@/utils/favorites-posts.http";
import { Alert } from "@material-tailwind/react";
import { useFavorites } from "@/contexts/favorites-context";
import MissingTags from "./missing-tags";
import { Check, X} from "lucide-react";

type PetCardProps = {
    post: Post | Pet;
    className?: string
    isPost?: boolean;
    disabled?: boolean;
};

export default function PetCard({ post, className, isPost, disabled = false }: PetCardProps) {
    const { favorites, fetchFavorites } = useFavorites(); // Usamos el contexto
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const { authToken } = useAuth(); // Hook de autenticación

    // Determinar si el post está en favoritos con una sola evaluación
    const isFavorite = favorites.some((fav: Post) => fav.id === (post as Post).id);

    const handleFavoriteClick = async () => {
        if (!authToken) {
            setErrorMessage("Necesitas estar logeado para agregar a favoritos.");
            return;
        }

        try {
            if (isFavorite) {
                const favorite = favorites.find((fav: Post) => fav.id === post.id);
                await deleteFavorite(favorite.id, authToken);
                setSuccessMessage("Publicación eliminada de favoritos");
                setTimeout(() => {setSuccessMessage("")}, 2500);
            } else {
                await addFavorite(post.id, authToken);
                setSuccessMessage("Publicación añadida a favoritos");
                setTimeout(() => {setSuccessMessage("")}, 2500);
            }
            await fetchFavorites();
        } catch (error) {
            console.error("Error al actualizar favorito", error);
        }
    };
    return (
        <>
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
            <div className={clsx(
                "snap-start shrink-0 w-[16rem] h-[19rem] rounded-3xl overflow-hidden bg-white drop-shadow-md flex flex-col relative",
                className
            )}>
            {isPost && !(post as Post | Pet).hasSensitiveImages && (
                <FavoriteButton variant={isFavorite ? "active" : "desactivated"} // Usa el estado para cambiar el 'variant'
                    onClick={handleFavoriteClick} className="absolute top-2 right-2 z-10" />
            )}
            {disabled ? (
                <>
                    <MissingTags
                        parentClassName="absolute z-10"
                        postType={(post as Pet).petStatus?.name}
                    />
                    <CardImage media={isPost ? (post as Post).media[0] : (post as Pet).media[0] || ""} />
                    <CardText post={post} />
                </>
            ) : (
                <Link href={isPost ? `/posts/${(post as Post).id}` : `/pets/${(post as Pet).id}`}>
                    <MissingTags
                        parentClassName="absolute z-10"
                        postType={(post as Pet).petStatus?.name}
                    />
                    <CardImage media={isPost ? (post as Post).media[0] : (post as Pet).media[0] || ""} isSensitive={(post as Post | Pet).hasSensitiveImages} />
                    <CardText post={isPost ? (post as Post) : (post as Pet)} />
                </Link>
            )}

        </div>
        </>
    );
}
