'use client';

import { Loader2, ArrowLeft } from 'lucide-react';
import React from 'react';
import CardReport from '@/components/administration/report/card-button';
import SectionAdmin from '@/components/administration/section';
import { Report } from '@/types/report';
import ReportList from './report-list';
import Button from "@/components/buttons/button";
import { Post } from '@/types/post';
import { Pet } from '@/types/pet';
import { Product } from '@/types/product';
import { Comment } from '@/types/comment';
import { ITEM_TYPE } from '@/types/constants';

interface Props<T> {
  entity: Post | Pet | Product | Comment;
  type: ITEM_TYPE;
  reports: Report[];
  onBack: () => void;
  onBlock: () => void;
  onKeep: () => void;
  handleDeleteReport: (reportId: number) => void;
}


export default function ReportDetailPage<T>({
  entity,
  type,
  reports,
  onBack,
  onBlock,
  onKeep,
  handleDeleteReport,
}: Props<T>) {

  const getEntityUserName = (): string => {
    if (type === ITEM_TYPE.COMMENT) {
      // Si es un comentario, no hay userFullName, devolvemos string vacío
      return '';
    }
    // Si no es un comentario, entonces entity es Post, Pet, o Product.
    // Todos ellos tienen userFullName.
    // Usamos una aserción de tipo para que TypeScript lo sepa.
    const entityWithUser = entity as Post | Pet | Product;
    return entityWithUser.userFullName || ''; // Usamos || '' por si userFullName fuera null o undefined
  };

  return (
    <div>
      <Button size="md" onClick={onBack} className="mb-6 mr-12 bg-white flex justify-between items-center shadow -md text-gray-800">
        <ArrowLeft className="text-gray-800 pr-1 " size={20} />
        Volver
      </Button>
      <SectionAdmin
        title={`Publicacion de ${getEntityUserName()}`}
      >
        Bloquear un reporte indica que es correcto y se eliminará la publicación, mantener un reporte indica que el reporte no es correcto y la publicación seguirá activa
      </SectionAdmin>

      <div className="flex justify-around">
        <ReportList reports={reports} handleDeleteReport={handleDeleteReport} />
        <CardReport post={entity} type={type} isReportedPage={true} handleAprove={onKeep} handleDesaprove={onBlock} />
      </div>
    </div>
  );
}
