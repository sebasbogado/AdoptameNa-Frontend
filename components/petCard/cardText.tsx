import Link from "next/link";
import React, { useMemo } from "react";
import PostsTags from "./tags";


interface props {
    pet: any,
    post: any,
    className?: string,
}

interface postProps {
    title: string,
    description: string,
    image: string,
    author: string,
    tags: string[],
    postType: string
}


const dummyData = {
    postType: "adoption",
    title: "Titulo del card",
    author: "Vet. Ana Sosa",
    description: "Encontramos este gatito en un basurero, necesita un hogar amoroso y responsable"
}

const tags = {
    tag1: ["race", "mestizo"],
    tag2: ["age", "2 años"],
    tag3: ["female", "Hembra"]
}


const CardText = ({ pet, post, className = "" }: props) => {
    /*
        const data = useMemo(() => {
            return {
                title: post.title,
                description: post.description,
                list: post.type==="adoption" ? post.items : pet.items
            }
        }, [pet, post])
    */
    return (
        <div className="px-2 py-2 flex flex-col bg-white rounded-lg card-text">
            <div className="flex flex-col gap-1">
                <p className="text-md font-semibold max-h-7 truncate text-ellipsis">{dummyData.title}</p>
                <div className="flex flex-wrap max-h-16 overflow-hidden gap-1">
                    {Object.values(tags).map(([iconType, data], index) => (
                        <PostsTags key={index} postType={dummyData.postType} iconType={iconType} data={data} />
                    ))}
                </div>
                <p className="text-xs text-blue-gray-700">{dummyData.author}</p>
                <p className="text-sm h-16 overflow-clip text-ellipsis">{dummyData.description} </p>
            </div>
        </div>
    );
};

export default CardText;

