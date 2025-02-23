import clsx from "clsx";
import React from "react";

const tagBaseClass = 'rounded-md px-1 w-fit border mb-1'

interface TagProps {
    postType: string; // Puede ser cualquier string
    iconType: string; // Nombre del icono como string
    data: string; // Texto desde la API
}

const postColors: Record<string, string> = {
    adoption: "text-adoption border-adoption",
    missing: "text-missing border-missing",
    volunteering: "text-volunteering border-volunteering",
};

const atributesIcons: Record<string, string> = {
    race: "sound_detection_dog_barking",
    vaccinated: "syringe",
    age: "cake",
    genderFemale: "female",
    genderMale: "male",
    sterilized: "content_cut",
    distance: "pin_drop"
};


const PostsTags: React.FC<TagProps> = ({ postType, iconType, data }) => {
    return (
        <div className={clsx(tagBaseClass, postColors[postType])}>
            <span className="material-symbols-outlined font-material align-sub">
                {atributesIcons[iconType]}
            </span>
            <span className="text-xs">{data}</span>
        </div>
    )
}

export default PostsTags