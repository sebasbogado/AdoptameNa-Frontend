import React from 'react';
import { Card as BaseCard } from "@/components/ui/card";
import ClickableTag from "@/components/admin-card/clickable-tag";
import { PetStatus } from "@/types/pet-status";
import { Animal } from "@/types/animal";

interface CardProps {
  title: string,
  content: PetStatus[] | Animal[],
  isBreed: boolean,
  onClickLabelDefault: (element: any) => void
  onClickLabelAdd: () => void
}


const Card: React.FC<CardProps> = ({ title, content, isBreed = false, onClickLabelDefault, onClickLabelAdd }) => {
  return (
    <>
      <BaseCard>
        <h4>{title}</h4>
        <div className="flex flex-wrap max-h-full max-w-72 overflow-hidden gap-1 mt-2">
          {/**Logica si es raza */}
          {content.map((element) => (
            <ClickableTag key={element.id} label={element.name} onClick={() => onClickLabelDefault(element)}></ClickableTag>
          ))}
          <ClickableTag type="add" onClick={onClickLabelAdd }></ClickableTag>
        </div>
      </BaseCard>
    </>
  );
}

export default Card;