'use client'
import React, { useEffect, useState } from "react";
import PostsTags from "./tag";
import { getPostType } from "@/utils/post-type-client";
import { PostType } from "@/types/post-type";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { Tags } from "@/types/tags";

interface props {
  post: any,
  className?: string,
}

const CardText = ({ post, className = "" }: props) => {
  const { authToken } = useAuth();
  const [postTypes, setPostTypes] = useState<PostType | null>(null);
  const [name, setName] = useState<string>("adoption");

 
  const hardcodedTags = [
    { iconType: "race", value: "Animal" },
    { iconType: "race", value: "Mascota" },
    { iconType: "age", value: "Naturaleza" },
    { iconType: "race", value: "Animales" },
  ];

  return (
    <div className="px-2 py-2 flex flex-col bg-white rounded-lg card-text">
      <div className="flex flex-col gap-1">
        <p className="text-lg md:text-base lg:text-lg font-semibold max-h-7 truncate text-ellipsis">{post.title || post.name}</p>
        <div className="flex flex-wrap max-h-16 overflow-hidden gap-1">
          {post.tags ? (
            Object.values(post.tags).map((tagObject, index) => (
              <PostsTags
                key={(tagObject as Tags).id || index} // Mejor usar tagObject.id como key
                postType={post.postType.name}
                iconType={"race"} // Asumo que "race" es el iconType deseado
                value={(tagObject as Tags).name} // Accedes directamente al name del objeto tag
              />
            ))
          ) : (
            hardcodedTags.map((tag, index) => (
              <PostsTags
                key={index} // O tag.id
                postType={post.postType} // Corregido
                iconType={tag.iconType}
                value={tag.value}
              />
            ))
          )}
        </div>
        <p className="text-xs text-blue-gray-700">{post.author}</p>
        <p className="text-base md:text-sm lg:text-sm h-16 overflow-clip text-ellipsis">{post.content || post.description} </p>
      </div>
    </div>
  );
};

export default CardText;

