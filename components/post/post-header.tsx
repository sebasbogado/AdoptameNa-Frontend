'use client'

import { Pet } from "@/types/pet";
import { Post } from "@/types/post";
import Link from "next/link";
interface PostHeaderProps {
    post?: Post;
    pet?: Pet
}

export const PostHeader = ({ post, pet }: PostHeaderProps) => {
    return (
        <div className="relative p-6 left-10 bg-white shadow-lg rounded-xl font-roboto z-50  mt-[-50px] w-[76vw] md:w-[62vw] ">
            <h1
   className={`
                    text-3xl sm:text-2xl 
                    md:text-4xl 
                    lg:text-5xl 
                    font-black 
                    bg-transparent 
                    border-2 border-transparent 
                    focus:outline-none 
                    w-full
                `}            >
                {post?.title || pet?.name}
            </h1>
            <p className="text-xl sm:text-base md:text-2xl text-gray-700">
                {post ?
                    <span className="text-xl">
                        Publicado por <Link className="text-[#4781FF]" href={`/profile/${post.userId}`}>{post?.organizationName || post?.userFullName} </Link> el {new Date(post?.publicationDate).toLocaleDateString()}
                        <span className="ml-2">• Compartido {post.sharedCounter || 0} {post.sharedCounter === 1 ? 'vez' : 'veces'}</span>
                    </span> :
                    <span className="flex flex-col">
                        <span className="text-sm md:text-xl">Publicado por <Link className="text-[#4781FF]" href={`/profile/${pet?.userId}`}>{pet?.organizationName || pet?.userFullName} </Link></span>
                        <span className="mt-8">
                            {pet?.gender == "FEMALE" ? "Hembra" : pet?.gender == "MALE" ? "Macho" : "Desconocido"}, {pet?.isSterilized ? " esterilizado" : " no esterilizado"},
                            {pet?.isVaccinated ? " vacunado" : " no vacunado"}
                        </span>
                    </span>
                }
            </p>
        </div >
    );
};