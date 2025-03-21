'use client'
import React, { useEffect, useState } from "react";
import PostsTags from "./tag";
import { getPostType } from "@/utils/post-type-client";
import { PostType } from "@/types/post-type";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/authContext";

interface props {
  post: any,
  className?: string,
}

const CardText = ({ post, className = "" }: props) => {
  const { authToken } = useAuth();
  const [postTypes, setPostTypes] = useState<PostType | null>(null);
  const [name, setName] = useState<string>("adoption");
  console.log(post)

 
  const hardcodedTags = [
    { iconType: "race", value: "Animal" },
    { iconType: "race", value: "Mascota" },
    { iconType: "age", value: "Naturaleza" },
    { iconType: "race", value: "Animales" },
  ];
  return (
    <div className="px-2 py-2 flex flex-col bg-white rounded-lg card-text">
      <div className="flex flex-col gap-1">
        <p className="text-md font-semibold max-h-7 truncate text-ellipsis">{post.title || post.name}</p>
        <div className="flex flex-wrap max-h-16 overflow-hidden gap-1">
          {post.tags ? Object.entries(post.tags).map(([iconType, value], index) => (
            <PostsTags key={index} postType={post.postType} iconType={iconType} value={String(value)} />
          )) : hardcodedTags.map((tag, index) => (
            <PostsTags key={index} postType={name} iconType={tag.iconType} value={tag.value} />
          ))}
        </div>
        <p className="text-xs text-blue-gray-700">{post.author}</p>
        <p className="text-sm h-16 overflow-clip text-ellipsis">{post.content || post.description} </p>
      </div>
    </div>
  );
};

export default CardText;

