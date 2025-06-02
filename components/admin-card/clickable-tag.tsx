import React, { useState } from "react";
import { Edit2Icon, PlusIcon } from "lucide-react";

interface ClickableTagProps {
  onClick: () => void;
  type?: "default" | "add";
  label?: string;
}

const ClickableTag: React.FC<ClickableTagProps> = ({ onClick, type = "default", label }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="inline-flex items-center justify-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset cursor-pointer transition-all duration-200 bg-indigo-50 text-[#4781FF] hover:bg-indigo-100 relative"
    >
       {/* Si el tipo no es "add", mostramos el texto de la etiqueta */}
       {type !== "add" ? label : <PlusIcon className="w-4 h-4" strokeWidth={2} />}
      
      {/* Si el texto es hover y el tipo no es "add", mostramos el div oscuro y el icono de editar */}
      {isHovered && type !== "add" ? (
        <>
          {/* Fondo oscuro semi-transparente */}
          <div className="absolute inset-0 bg-black opacity-50 rounded-md z-10" />
          
          {/* Icono de editar centrado */}
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <Edit2Icon className="w-3 h-3 text-white" strokeWidth={4} />
          </div>
        </>
      ) : null}
    </div>
  );
};

export default ClickableTag;


