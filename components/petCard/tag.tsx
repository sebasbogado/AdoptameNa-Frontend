import clsx from "clsx";
import React from "react";

const tagBaseClass = 'rounded-md px-1 w-fit border flex justify-center items-center p-1'
import { DogIcon, VenusIcon, MarsIcon, SyringeIcon, CakeIcon, ScissorsIcon, MapPinIcon, CatIcon, TurtleIcon, RabbitIcon, PackageOpenIcon, PackageIcon, HashIcon, Bird, BirdIcon } from "lucide-react";
interface TagProps {
    postType: string; 
    iconType: string;
    value: string;
    large?: boolean;
}

const postColors: Record<string, string> = {
    Volunteering: "text-volunteering border-volunteering",
    Adoption: "text-adoption border-adoption",
    Blog: "text-blog border-blog",
    Missing: "text-missing border-missing",
    Found: "text-missing border-missing",
    Marketplace: "text-marketplace border-marketplace",
    MyPet: "text-adoption border-adoption",
    Male: "text-[#FF70FE] border-[#FF70FE]",
    Female: "text-[#7070FF] border-[#7070FF]",
};

const attributeIcons: Record<string, React.ElementType> = {
    race: DogIcon,
    vaccinated: SyringeIcon,
    age: CakeIcon,
    female: VenusIcon,
    male: MarsIcon,
    sterilized: ScissorsIcon,
    distance: MapPinIcon,
    dog: DogIcon,
    cat: CatIcon,
    turtle: TurtleIcon,
    rabbit: RabbitIcon,
    bird: BirdIcon,
    new: PackageIcon,
    old: PackageOpenIcon,
    generic: HashIcon,
};


const PostsTags: React.FC<TagProps> = ({ postType, iconType, value, large = false }) => {
    const IconComponent = attributeIcons[iconType];

    return (
        
        <div className={clsx(tagBaseClass, postColors[postType])}>
            {IconComponent && <IconComponent className={large ? "w-5 h-5 mr-1 md:w-8 md:h-8 md:mr-1" : "w-4 h-4 mr-1"} />}
            
            <span className={large ? "text-xs md:text-base" : "text-xs"}>{value}</span>
        </div>
    )
}

export default PostsTags