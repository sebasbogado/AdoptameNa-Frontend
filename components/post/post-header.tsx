'use client'

import { Pet } from "@/types/pet";
import { Post } from "@/types/post";
import Link from "next/link";
import PostsTags from "../petCard/tag"; // Asegúrate que la ruta sea correcta
import {
    capitalizeFirstLetter,
    convertGenderToSpanish,
    getAge,
    getAnimalIcon,
    getColorGender,
    getGenderIcon,
    getPublicationTypeColor,
    getSterilizedIcon,
    getVaccinatedIcon
} from "@/utils/Utils";

interface PostHeaderProps {
    post?: Post;
    pet?: Pet;
}

export const PostHeader = ({ post, pet }: PostHeaderProps) => {
    const getStatusTagStyle = (status: string) => {
        switch (status) {
            case "En Adopción":
                return "bg-yellow-900 text-white";
            case "Perdido":
                return "bg-red-400 text-white";
            case "Encontrado":
                return "bg-green-300 text-white";
            case "En Casa":
                return "bg-adoption text-white";
            default:
                return "bg-gray-300 text-black";
        }
    };

    return (
        <div className="relative p-4 md:p-6 bg-white shadow-lg rounded-xl font-roboto z-50 mt-[-50px] 
                       w-[90vw] mx-auto md:w-[55vw] md:left-10 md:mx-0">
            {/* Contenedor para título y etiqueta de estado */}
            <div className="flex flex-col items-start gap-2 md:flex-row md:items-center md:gap-4 mb-3 md:mb-2">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black break-words w-full md:w-auto">
                    {post?.title || pet?.name}
                </h1>
                {pet?.petStatus?.name && (
                    <span
                        className={`${getStatusTagStyle(pet.petStatus.name)} 
                                   text-sm md:text-lg font-semibold px-3 py-1.5 md:px-4 md:py-[10px] 
                                   rounded-md leading-none flex items-center whitespace-nowrap`}
                    >
                        {pet.petStatus.name}
                    </span>
                )}
            </div>

            {/* Contenedor para información de publicación o detalles de mascota */}
            <div className="text-gray-700">
                {post ? (
                    <span className="text-sm md:text-xl">
                        Publicado por <Link className="text-[#4781FF] hover:underline" href={`/profile/${post.userId}`}>{post?.organizationName || post?.userFullName}</Link> el {new Date(post?.publicationDate).toLocaleDateString()}
                        <span className="ml-2">• Compartido {post.sharedCounter || 0} {post.sharedCounter === 1 ? 'vez' : 'veces'}</span>
                    </span>
                ) : (
                    <div className="flex flex-col items-start mt-1 md:mt-2">
                        <span className="text-sm md:text-xl mb-2 md:mb-0">
                            Publicado por <Link className="text-[#4781FF] hover:underline" href={`/profile/${pet?.userId}`}>{pet?.organizationName || pet?.userFullName}</Link>
                        </span>
                        <div className="mt-2 md:mt-4 flex flex-wrap gap-2 md:gap-3">
                            {pet && ( // Añadido chequeo para asegurar que pet existe antes de acceder a sus propiedades
                                <>
                                    <PostsTags
                                        postType={getPublicationTypeColor(pet.petStatus.name)}
                                        iconType={getAnimalIcon(pet.animal.name)}
                                        value={capitalizeFirstLetter(pet.animal.name)}
                                        large
                                    />
                                    <PostsTags
                                        postType={getColorGender(pet.gender)}
                                        iconType={getGenderIcon(pet.gender)}
                                        value={convertGenderToSpanish(pet.gender)}
                                        large
                                    />
                                    {pet.isSterilized &&
                                        <PostsTags
                                            postType={getPublicationTypeColor(pet.petStatus.name)}
                                            iconType={getSterilizedIcon(pet.isSterilized)}
                                            value={pet.isSterilized ? "Esterilizado" : ""} // Simplificado, aunque isSterilized ya es true
                                            large
                                        />
                                    }
                                    {pet.isVaccinated &&
                                        <PostsTags
                                            postType={getPublicationTypeColor(pet.petStatus.name)}
                                            iconType={getVaccinatedIcon(pet.isVaccinated)}
                                            value={pet.isVaccinated ? "Vacunado" : ""} // Simplificado
                                            large
                                        />
                                    }
                                    {pet.birthdate &&
                                        <PostsTags
                                            postType={getPublicationTypeColor(pet.petStatus.name)}
                                            iconType="age"
                                            value={getAge(pet.birthdate)}
                                            large
                                        />
                                    }
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};