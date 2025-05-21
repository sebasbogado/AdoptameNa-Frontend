'use client'
import React, { useEffect, useState } from "react";
import PostsTags from "./tag";
import { getPostType } from "@/utils/post-type-client";
import { PostType } from "@/types/post-type";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { Tags } from "@/types/tags";
import { Pet } from "@/types/pet";
import { Product } from "@/types/product";

import { capitalizeFirstLetter, convertGenderToSpanish, getAnimalIcon, getColorAdoptionOrMissing, getColorGender, getConditionIcon, getGenderIcon, getSterilizedIcon, getVaccinatedIcon } from "@/utils/Utils";

interface props {
  post: any,
  className?: string,
  type?: string,
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
        <p className="text-xs text-text-secondary">{post.organizationName || post.userFullName}</p>

        {post.price !== undefined && (
          <p className="text-sm text-[#9747FF] font-medium text-right">
            {post.price.toLocaleString("es-PY")} Gs
          </p>
        )}

        <div className="flex flex-wrap max-h-16 overflow-hidden gap-1">

          {post.tags ? (
            Object.values(post.tags).map((tagObject, index) => (
              <PostsTags
                key={(tagObject as Tags).id || index}
                postType="Voluntariado"
                iconType={getAnimalIcon((tagObject as Tags).name)}
                value={(tagObject as Tags).name}
              />
            ))
          ) : post.gender ? (
            <>
              <PostsTags
                key={post.id}
                postType={getColorAdoptionOrMissing((post as Pet).petStatus.name)}
                iconType={getAnimalIcon((post as Pet).animal.name)}
                value={capitalizeFirstLetter((post as Pet).animal.name)} />

              <PostsTags
                key={post.id + 1}
                postType={(post as Pet).gender ? getColorGender((post as Pet).gender) : getColorAdoptionOrMissing((post as Pet).petStatus.name)}
                iconType={getGenderIcon((post as Pet).gender)}
                value={convertGenderToSpanish((post as Pet).gender)} />

              {post.isSterilized &&
                <PostsTags
                  key={post.id + 2}
                  postType={getColorAdoptionOrMissing((post as Pet).petStatus.name)}
                  iconType={getSterilizedIcon((post as Pet).isSterilized)}
                  value={(post as Pet).isVaccinated ? "Esterilizado" : ""} />
              }

              {post.isVaccinated &&
                <PostsTags
                  key={post.id + 3}
                  postType={getColorAdoptionOrMissing((post as Pet).petStatus.name)}
                  iconType={getVaccinatedIcon((post as Pet).isVaccinated)}
                  value={(post as Pet).isVaccinated ? "Vacunado" : ""} />
              }
            </>

          ) : post.category ? (
            <>
              <PostsTags
                key={post.id}
                postType="Marketplace"
                iconType={"generic"}
                value={(post as Product).category.name} />
              <PostsTags
                key={post.id + 1}
                postType="Marketplace"
                iconType={getConditionIcon((post as Product).condition)}
                value={capitalizeFirstLetter((post as Product).condition)} />
              {Object.values((post as Product).animals).map((animal, index) => (
                <PostsTags
                  key={index}
                  postType="Marketplace"
                  iconType={getAnimalIcon(animal.name)}
                  value={capitalizeFirstLetter(animal.name)} />
              ))
              }
            </>

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
        <p
          className={`text-base md:text-sm lg:text-sm ${post.price !== undefined ? 'truncate' : 'line-clamp-2'
            }`}
        >
          {post.content || post.description}
        </p>
      </div>
    </div>
  );
};

export default CardText;

