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
  totalAmount?: number,
  currentAmount?: number,
}

const CardText = ({ post, className = "", totalAmount = 0, currentAmount = 0 }: props) => {
  const { authToken } = useAuth();
  const [postTypes, setPostTypes] = useState<PostType | null>(null);
  const [name, setName] = useState<string>("adoption");
  
  const progress = totalAmount > 0 ? (currentAmount / totalAmount) * 100 : 0;
 
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
        <p className="text-xs text-text-secondary">{post.userFullName}</p>
        {totalAmount > 0 && (
          <div className="flex flex-row items-center gap-x-3">
            <div className="flex-1 h-2 bg-[#EEF2FA] rounded-full relative overflow-hidden">
              <div
                className="h-2 bg-[#5B82FF] rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <span className="text-xs text-text-secondary">Gs. {totalAmount.toLocaleString('es-ES')}</span>
          </div>
        )}
        <div className="flex flex-wrap max-h-16 overflow-hidden gap-1">
        
          {post.tags ? (
            Object.values(post.tags).map((tagObject, index) => (
              <PostsTags
                key={(tagObject as Tags).id || index}
                postType={post.postType.name}
                iconType={"race"}
                value={(tagObject as Tags).name}
              />
            ))
          ) : (
            hardcodedTags.map((tag, index) => (
              <PostsTags
                key={index}
                postType={post.postType}
                iconType={tag.iconType}
                value={tag.value}
              />
            ))
          )}
        </div>
        <p className="text-base md:text-sm lg:text-sm line-clamp-2">{post.content || post.description} </p>
        
        
      </div>
    </div>
  );
};

export default CardText;

