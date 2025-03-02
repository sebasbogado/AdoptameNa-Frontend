import clsx from "clsx";
import React from "react";

const tagBaseClass = 'rounded-md px-1 w-fit border flex justify-center items-center p-1'

interface TagProps {
    postType: string; 
    iconType: string;
    value: string;
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
    female: "female",
    male: "male",
    sterilized: "content_cut",
    distance: "pin_drop"
};


const PostsTags: React.FC<TagProps> = ({ postType, iconType, value }) => {
    return (
        <div className={clsx(tagBaseClass, postColors[postType])}>
            <span className="material-symbols-outlined font-material align-sub tag-symbol">
                {atributesIcons[iconType]}
            </span>
            <span className="text-xs">{value}</span>
        </div>
    )
}

export default PostsTags