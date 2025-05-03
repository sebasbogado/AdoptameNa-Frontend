import clsx from "clsx";
import React from "react";

const tagBaseClass =
"text-white font-semibold rounded-tr-md rounded-br-md md:px-2 mt-6 px-4 w-24 border flex justify-center items-center p-1 md:p-1";

interface TagProps {
    postType?: string; // Ej: "Perdido", "Encontrado", u otros
    parentClassName?: string;
}

const tagsColor: Record<string, string> = {
    Perdido: "border-missing-tag bg-missing-tag",
    Encontrado: "border-found-tag bg-found-tag",
};

const MissingTags: React.FC<TagProps> = ({ postType, parentClassName }) => {
    // Si no es Perdido ni Encontrado, no mostramos nada
    if (!postType || !(postType in tagsColor)) return null;

    return (
        <div className={clsx(tagBaseClass, tagsColor[postType], parentClassName)}>
            <span className="text-md">{postType}</span>
        </div>
    );
};

export default MissingTags;
