'use client'
import React from "react";
import PostsTags from "./tag";
import { Tags } from "@/types/tags";
import { Pet } from "@/types/pet";
import { Product } from "@/types/product";

import { capitalizeFirstLetter, convertGenderToSpanish, getAge, getAnimalIcon, getColorGender, getConditionIcon, getGenderIcon, getPublicationTypeColor, getSterilizedIcon, getVaccinatedIcon } from "@/utils/Utils";
import { Post } from "@/types/post";

interface props {
  post: Post | Pet | Product,
  // className?: string,
  type?: string,
}

const CardText = ({ post, /*className = ""*/ }: props) => {

  return (
    <div className="px-2 py-2 flex flex-col bg-white rounded-lg card-text">
      <div className="flex flex-col gap-1">
        <p className="text-lg md:text-base lg:text-lg font-semibold max-h-7 truncate text-ellipsis">{(post as Post).title || (post as Pet).name}</p>
        <p className="text-xs text-text-secondary">{post.organizationName || post.userFullName}</p>

        {(post as Product).price !== undefined && (
          <p className="text-sm text-[#9747FF] font-medium text-right">
            {(post as Product).price.toLocaleString("es-PY")} Gs
          </p>
        )}

        <div className="flex flex-wrap max-h-16 overflow-hidden gap-1">

          {(post as Post).tags ? (
            (post as Post).tags.map((tagObject, index) => (
              <PostsTags
                key={(tagObject as Tags).id || index}
                postType={getPublicationTypeColor((post as Post).postType.name)}
                iconType={getAnimalIcon((tagObject as Tags).name)}
                value={(tagObject as Tags).name}
              />
            ))
          ) : (post as Pet).gender ? (
            <>
              <PostsTags
                key={post.id}
                postType={getPublicationTypeColor((post as Pet).petStatus.name)}
                iconType={getAnimalIcon((post as Pet).animal.name)}
                value={capitalizeFirstLetter((post as Pet).animal.name)} />

              <PostsTags
                key={post.id + 1}
                postType={getColorGender((post as Pet).gender)}
                iconType={getGenderIcon((post as Pet).gender)}
                value={convertGenderToSpanish((post as Pet).gender)} />

              {(post as Pet).isSterilized &&
                <PostsTags
                  key={post.id + 2}
                  postType={getPublicationTypeColor((post as Pet).petStatus.name)}
                  iconType={getSterilizedIcon((post as Pet).isSterilized)}
                  value={(post as Pet).isVaccinated ? "Esterilizado" : ""} />
              }

              {(post as Pet).isVaccinated &&
                <PostsTags
                  key={post.id + 3}
                  postType={getPublicationTypeColor((post as Pet).petStatus.name)}
                  iconType={getVaccinatedIcon((post as Pet).isVaccinated)}
                  value={(post as Pet).isVaccinated ? "Vacunado" : ""} />
              }

              {(post as Pet).birthdate &&
                <PostsTags
                  key={post.id + 4}
                  postType={getPublicationTypeColor((post as Pet).petStatus.name)}
                  iconType="age"
                  value={getAge((post as Pet).birthdate)} />
              }
            </>

          ) : (post as Product).category ? (
            <>
              <PostsTags
                key={post.id}
                postType={getPublicationTypeColor("Marketplace")}
                iconType={"generic"}
                value={(post as Product).category.name} />
              <PostsTags
                key={post.id + 1}
                postType={getPublicationTypeColor("Marketplace")}
                iconType={getConditionIcon((post as Product).condition)}
                value={capitalizeFirstLetter((post as Product).condition)} />
              {Object.values((post as Product).animals).map((animal, index) => (
                <PostsTags
                  key={index}
                  postType={getPublicationTypeColor("Marketplace")}
                  iconType={getAnimalIcon(animal.name)}
                  value={capitalizeFirstLetter(animal.name)} />
              ))
              }
            </>

          ): ""}
        </div>
        <p
          className={`text-base md:text-sm lg:text-sm ${(post as Product).price !== undefined ? 'truncate' : 'line-clamp-2'
            }`}
        >
          {(post as Post).content || (post as Pet).description}
        </p>
      </div>
    </div>
  );
};

export default CardText;

