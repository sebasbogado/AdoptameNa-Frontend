import clsx from "clsx";
import React from "react";

const tagBaseClass = 'rounded-md px-1 w-fit border flex justify-center items-center p-1'
import { DogIcon, VenusIcon, MarsIcon, SyringeIcon, CakeIcon, ScissorsIcon, MapPinIcon } from "lucide-react";
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

const attributeIcons: Record<string, React.ElementType> = {
    race: DogIcon,
    vaccinated: SyringeIcon,
    age: CakeIcon,
    female: VenusIcon,
    male: MarsIcon,
    sterilized: ScissorsIcon,
    distance: MapPinIcon
};


const PostsTags: React.FC<TagProps> = ({ postType, iconType, value }) => {
    const IconComponent = attributeIcons[iconType];

    return (
        
        <div className={clsx(tagBaseClass, postColors[postType])}>
            {IconComponent && <IconComponent className="w-4 h-4 mr-1" />}
            
            <span className="text-xs md:text-xs lg:text-xs">{value}</span>
        </div>
    )
}

export default PostsTags