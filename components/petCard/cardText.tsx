import Link from "next/link";
import React from "react";
import PostsTags from "./tags";





const CardText = (post) => {
    return (
        <div className="px-2 py-2 flex flex-col min-w-60 max-w-60 bg-white rounded-lg card-text">
            <div className="">
                <p className="text-md font-semibold max-h-7 mb-1 truncate text-ellipsis">{post.title}Title too large for this card causing overflow</p>
                <div className="flex gap-1 flex-wrap max-h-16 overflow-hidden">
                <PostsTags postType="adoption" iconType="race" data="2 años"></PostsTags>
                </div>
                <p className="text-xs text-blue-gray-700">{post.author}Vet Ptaricia Sosa</p>
                <p className="text-sm min-h-16 max-h-16 overflow-clip text-ellipsis">{post.description}Description Bigotes fue rescatado de la placita, le encontramos en una caja cuando era un bebé pequenhito que no podia comer solo y tomaba biberon</p>
            </div>
        </div>
    );
};

export default CardText;

