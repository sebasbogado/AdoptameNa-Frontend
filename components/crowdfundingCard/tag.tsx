import clsx from "clsx";
import React from "react";

const tagBaseClass = 'rounded-md px-1 w-fit border flex justify-center items-center p-1'
import { HandHelpingIcon, StarIcon } from "lucide-react";
interface TagProps {
    iconType: string;
    value: string;
}

const tagColors: Record<string, string> = {
    Blog: "text-btn-cta border-btn-cta",
};

const attributeIcons: Record<string, React.ElementType> = {
    star: StarIcon,
    handHelp: HandHelpingIcon,
};


const OrganizationTag: React.FC<TagProps> = ({ iconType, value }) => {
    const IconComponent = attributeIcons[iconType];

    return (
        
        <div className={clsx(tagBaseClass, tagColors['Blog'])}>
            {IconComponent && <IconComponent className="w-4 h-4 mr-1" />}
            
            <span className="text-xs">{value}</span>
        </div>
    )
}

export default OrganizationTag;