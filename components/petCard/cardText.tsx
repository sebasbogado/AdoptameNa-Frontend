'use client'
import Link from "next/link";
import React, { useContext, useEffect, useMemo, useState } from "react";
import PostsTags from "./tags";
import { getPostType } from "@/utils/postTypes.http";
import { PostType } from "@/types/postTypes";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/contexts/authContext";

interface props {
  post: any,
  className?: string,
}

const CardText = ({ post, className = "" }: props) => {
  const useAuth = useContext(AuthContext);
  const [postTypes, setPostTypes] = useState<PostType | null>(null);
  const [name, setName] = useState<string>("adoption");
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {

        const { authToken } = useAuth;
        if (!authToken) {
          router.push("/auth/login");
          return
        }

        const postId = post.id;
        const postTypes = await getPostType(postId, authToken);

        if (postTypes) {
          setPostTypes(postTypes);
          setName(postTypes.name)
        } else {
          console.error("La respuesta no contiene tipo de post :", postTypes);
          setPostTypes(null);
          setName("adoption")
        }
      } catch (error) {
        console.error("Error al obtener los tipos:", error);
      }
    }
    fetchData();
  }, []);
  const hardcodedTags = [
    { iconType: "category", value: "Tech" },
    { iconType: "difficulty", value: "Intermediate" },
    { iconType: "language", value: "JavaScript" },
  ];
  return (
    <div className="px-2 py-2 flex flex-col bg-white rounded-lg card-text">
      <div className="flex flex-col gap-1">
        <p className="text-md font-semibold max-h-7 truncate text-ellipsis">{post.title || post.name}</p>
        <div className="flex flex-wrap max-h-16 overflow-hidden gap-1">
          {hardcodedTags.map((tag, index) => (
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

