'use client'

import { Pet } from "@/types/pet";
import { Post } from "@/types/post";

interface PostHeaderProps {
    post?: Post;
    pet?: Pet
}

export const PostHeader = ({ post, pet }: PostHeaderProps) => {
    return (
        <div className="relative p-6 left-10 bg-white shadow-lg rounded-xl font-roboto z-50  mt-[-50px] w-[55vw]">
            <h1
                className={`text-5xl font-black bg-transparent border-2 border-transparent focus:outline-none w-full`}
            >
                {post?.title || pet?.name}
            </h1>
            <p className="text-2xl text-gray-700 mt-8">
                {post ? <span>
                    Publicado por {post?.userFullName} el {new Date(post?.publicationDate).toLocaleDateString()}
                    <span className="ml-2">• Compartido {post.sharedCounter || 0} {post.sharedCounter === 1 ? 'vez' : 'veces'}</span>
                </span> :
                    <span>
                        {pet?.gender == "FEMALE" ? "Hembra" : pet?.gender == "MALE" ? "Macho" : "Desconocido"}, {pet?.isSterilized ? " esterilizado" : " no esterilizado"},
                        {pet?.isVaccinated ? " vacunado" : " no vacunado"}
                    </span>
                }
            </p>
        </div >
    );
};