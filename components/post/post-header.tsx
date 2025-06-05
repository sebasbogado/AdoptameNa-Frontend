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
        <div className="relative p-4 bg-white shadow-lg rounded-xl font-roboto z-20 
                   mt-[-60px] sm:mt-[-50px]
                   w-full max-w-md mx-auto sm:max-w-none sm:w-[calc(100%-2rem)]
                   md:w-[50vw] md:left-10 md:mx-0 
                   transform md:-translate-x-0
                   ">
            {/* Contenedor para título y etiqueta de estado */}
            <div className="flex flex-col items-start gap-2 md:flex-row md:items-center md:gap-4 mb-3">
                <h1 className="text-2xl sm:text-3xl md:text-5xl font-black break-words w-full md:w-auto">
                    {post?.title || pet?.name}
                </h1>
                {pet?.petStatus?.name && (
                    <span
                        className={`${getStatusTagStyle(pet.petStatus.name)} 
                               text-xs sm:text-sm md:text-lg font-semibold px-2 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-[10px] 
                               rounded-md leading-none flex items-center whitespace-nowrap mt-2 md:mt-0`}
                    >
                        {pet.petStatus.name}
                    </span>
                )}
            </div>

            {/* Contenedor para información de publicación o detalles de mascota */}
            <div className="text-gray-700">
                {post ? (
                    <span className="text-xs sm:text-sm md:text-xl">
                        Publicado por <Link className="text-[#4781FF] hover:underline" href={`/profile/${post.userId}`}>{post?.organizationName || post?.userFullName}</Link> el {new Date(post?.publicationDate).toLocaleDateString()}
                        <span className="block sm:inline sm:ml-2 mt-1 sm:mt-0">• Compartido {post.sharedCounter || 0} {post.sharedCounter === 1 ? 'vez' : 'veces'}</span> {/* 'Compartido' en nueva línea en mobile */}
                    </span>
                ) : (
                    <div className="flex flex-col items-start mt-1">
                        <span className="text-xs sm:text-sm md:text-xl mb-2">
                            Publicado por <Link className="text-[#4781FF] hover:underline" href={`/profile/${pet?.userId}`}>{pet?.organizationName || pet?.userFullName}</Link>
                            <span className="block sm:inline sm:ml-2 mt-1 sm:mt-0">
                                • Compartido {pet?.sharedCounter || 0} {pet?.sharedCounter === 1 ? 'vez' : 'veces'}</span>
                        </span>
                        <div className="mt-2 flex flex-wrap gap-1.5 md:gap-3">
                            {pet && (
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
                                            value="Esterilizado"
                                            large
                                        />
                                    }
                                    {pet.isVaccinated &&
                                        <PostsTags
                                            postType={getPublicationTypeColor(pet.petStatus.name)}
                                            iconType={getVaccinatedIcon(pet.isVaccinated)}
                                            value="Vacunado"
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