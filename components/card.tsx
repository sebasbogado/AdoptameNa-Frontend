import React from 'react';
import { Card as BaseCard } from "@/components/ui/card";
import ClickableTag from "@/components/admin-card/clickable-tag";
import { PetStatus } from "@/types/pet-status";
import { Animal } from "@/types/animal";
import { ReportReason } from "@/types/report-reason";

interface CardProps {
  title: string,
  content: PetStatus[] | Animal[] | ReportReason[],
  onClickLabelDefault: (element: any) => void
  onClickLabelAdd: () => void
}


const Card: React.FC<CardProps> = ({ title, content, onClickLabelDefault, onClickLabelAdd }) => {
  return (
    <>
      <BaseCard>
        <h4>{title}</h4>
        <div className="flex flex-wrap max-h-full max-w-72 overflow-hidden gap-1 mt-2">
          {content.map((element) => (
            <ClickableTag key={element.id} label={"name" in element ? element.name : element.description} onClick={() => onClickLabelDefault(element)}></ClickableTag>
          ))}
          <ClickableTag type="add" onClick={onClickLabelAdd }></ClickableTag>
        </div>
      </BaseCard>
    </>
  );
}

export default Card;