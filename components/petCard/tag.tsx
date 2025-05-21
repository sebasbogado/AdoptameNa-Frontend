import clsx from "clsx";
import React from "react";

const tagBaseClass = 'rounded-md px-1 w-fit border flex justify-center items-center p-1'
import { DogIcon, VenusIcon, MarsIcon, SyringeIcon, CakeIcon, ScissorsIcon, MapPinIcon, CatIcon, TurtleIcon, RabbitIcon, SparkleIcon, PackageOpenIcon, PackageIcon, HashIcon, Bird, BirdIcon } from "lucide-react";
interface TagProps {
    postType: string; 
    iconType: string;
    value: string;
}

const postColors: Record<string, string> = {
    Voluntariado: "text-volunteering border-volunteering",
    Adopcion: "text-adoption border-adoption",
    Blog: "text-found-tag border-found-tag",
    Extraviados: "text-missing border-missing",
    Marketplace: "text-marketplace border-marketplace",
    Macho: "text-[#FF70FE] border-[#FF70FE]",
    Hembra: "text-[#7070FF] border-[#7070FF]",
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
    generic: HashIcon
};


const PostsTags: React.FC<TagProps> = ({ postType, iconType, value }) => {
    const IconComponent = attributeIcons[iconType];

    return (
        
        <div className={clsx(tagBaseClass, postColors[postType])}>
            {IconComponent && <IconComponent className="w-4 h-4 mr-1" />}
            
            <span className="text-xs">{value}</span>
        </div>
    )
}

export default PostsTags