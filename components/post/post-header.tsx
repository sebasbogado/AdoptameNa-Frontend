'use client'

import { Pet } from "@/types/pet";
import { Post } from "@/types/post";
import Link from "next/link";
import PostsTags from "../petCard/tag";
import { capitalizeFirstLetter, convertGenderToSpanish, getAge, getAnimalIcon, getColorGender, getGenderIcon, getPublicationTypeColor, getSterilizedIcon, getVaccinatedIcon } from "@/utils/Utils";
interface PostHeaderProps {
    post?: Post;
    pet?: Pet
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
        <div className="relative p-6 left-10 bg-white shadow-lg rounded-xl font-roboto z-50  mt-[-50px] w-[55vw]">
            <div className="flex items-center gap-4">
                <h1 className="text-5xl font-black">
                    {post?.title || pet?.name}
                </h1>
                {pet?.petStatus?.name && (
                    <span
                        className={`${getStatusTagStyle(pet.petStatus.name)} text-lg font-semibold px-4 py-[10px] rounded-md leading-none flex items-center`}
                    >
                        {pet.petStatus.name}
                    </span>
                )}
            </div>
            <div className="text-2xl text-gray-700">
                {post ?
                    <span className="text-xl">
                        Publicado por <Link className="text-[#4781FF]" href={`/profile/${post.userId}`}>{post?.organizationName || post?.userFullName} </Link> el {new Date(post?.publicationDate).toLocaleDateString()}
                        <span className="ml-2">• Compartido {post.sharedCounter || 0} {post.sharedCounter === 1 ? 'vez' : 'veces'}</span>
                    </span> :
                    <div className="flex flex-center flex-col mt-2">
                        <span className="text-xl">Publicado por <Link className="text-[#4781FF]" href={`/profile/${pet?.userId}`}>{pet?.organizationName || pet?.userFullName} </Link></span>
                        <div className="mt-4 flex flex-wrap gap-3">
                            <PostsTags
                                postType={getPublicationTypeColor((pet as Pet).petStatus.name)}
                                iconType={getAnimalIcon((pet as Pet).animal.name)}
                                value={capitalizeFirstLetter((pet as Pet).animal.name)}
                                large
                            />

                            <PostsTags
                                postType={getColorGender((pet as Pet).gender)}
                                iconType={getGenderIcon((pet as Pet).gender)}
                                value={convertGenderToSpanish((pet as Pet).gender)}
                                large
                            />

                            {(pet as Pet).isSterilized &&
                                <PostsTags
                                    postType={getPublicationTypeColor((pet as Pet).petStatus.name)}
                                    iconType={getSterilizedIcon((pet as Pet).isSterilized)}
                                    value={(pet as Pet).isVaccinated ? "Esterilizado" : ""}
                                    large
                                />
                            }

                            {(pet as Pet).isVaccinated &&
                                <PostsTags
                                    postType={getPublicationTypeColor((pet as Pet).petStatus.name)}
                                    iconType={getVaccinatedIcon((pet as Pet).isVaccinated)}
                                    value={(pet as Pet).isVaccinated ? "Vacunado" : ""}
                                    large
                                />
                            }

                            {(pet as Pet).birthdate &&
                                <PostsTags
                                    postType={getPublicationTypeColor((pet as Pet).petStatus.name)}
                                    iconType="age"
                                    value={getAge((pet as Pet).birthdate)} 
                                    large
                                />
                            }
                        </div>
                    </div>
                }
            </div>
        </div >
    );
};