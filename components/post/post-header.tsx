'use client'

import { Post } from "@/types/post";

export const PostHeader = ({ post }: { post: Post }) => {


    return (
        <div className="relative p-6 left-10 bg-white shadow-lg rounded-xl font-roboto z-40  mt-[-50px] w-[55vw]">
            <h1
                className={`text-5xl font-black bg-transparent border-2 border-transparent focus:outline-none w-full`}
            >
                {post.title}
            </h1>
            <p className="text-2xl text-gray-700 mt-8">
                Publicado por {post.idUser} {/* Reemplazar por el nombre de usuario */} el {new Date(post.publicationDate).toLocaleDateString()}
            </p>
        </div >
    );
};