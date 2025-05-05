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


interface Props<T> {
  entity: Post | Pet | Product;
  reports: Report[];
  onBack: () => void;
  onBlock: () => void;
  onKeep: () => void;
  handleDeleteReport: (reportId: number) => void;
}

export default function ReportDetailPage<T>({
  entity,
  reports,
  onBack,
  onBlock,
  onKeep,
  handleDeleteReport,
}: Props<T>) {
  return (
    <div>
      <Button size="md" onClick={onBack} className="mb-6 mr-12 bg-white flex justify-between items-center shadow -md text-gray-800">
        <ArrowLeft className="text-gray-800 pr-1 " size={20} />
        Volver
      </Button>
      <SectionAdmin title={`Publicacion de ${entity.userFullName}`} >
        Bloquear un reporte indica que es correcto y se eliminará la publicación, mantener un reporte indica que el reporte no es correcto y la publicación seguirá activa
      </SectionAdmin>

      <div className="flex justify-around">
        <ReportList reports={reports} handleDeleteReport={handleDeleteReport} />
        <CardReport post={entity} isReportedPage={true} handleAprove={onKeep} handleDesaprove={onBlock} />
      </div>
    </div>
  );
}
