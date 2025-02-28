import Link from "next/link";
import React, { useMemo } from "react";
import PostsTags from "./tags";


interface props {
    post: any,
    className?: string,
}

const CardText = ({post, className = "" }: props) => {

    return (
        <div className="px-2 py-2 flex flex-col bg-white rounded-lg card-text">
            <div className="flex flex-col gap-1">
                <p className="text-md font-semibold max-h-7 truncate text-ellipsis">{post.title}</p>
                <div className="flex flex-wrap max-h-16 overflow-hidden gap-1">
                    {Object.entries(post.tags).map(([iconType, value], index) => (
                        <PostsTags key={index} postType={post.postType} iconType={iconType} value={String(value)} />
                    ))}
                </div>
                <p className="text-xs text-blue-gray-700">{post.author}</p>
                <p className="text-sm h-16 overflow-clip text-ellipsis">{post.content} </p>
            </div>
        </div>
    );
};

export default CardText;

