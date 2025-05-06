'use client';

import { Loader2, ArrowLeft } from 'lucide-react';
import React from 'react';
import CardReport from '@/components/administration/report/card-button';
import { Report } from '@/types/report';
//import ReportList from '@/report-list';
import Button from "@/components/buttons/button";
import { Post } from '@/types/post';
import { Pet } from '@/types/pet';
import UserSectionReport from './user-section-report';
import UserReportCardButtons from './user-report-card-button';
import ReportList from '@/components/administration/report/report-list';
import UserReportList from './user-report-list';


interface Props<T> {
  entity: Post | Pet;
  reports: Report[];
  onBack: () => void;
}

export default function UserReportDetailPage<T>({
  entity,
  reports,
  onBack,
}: Props<T>) {
  return (
    <div>
      <Button size="md" onClick={onBack} className="mb-6 mr-12 bg-white flex justify-between items-center shadow -md text-gray-800">
        <ArrowLeft className="text-gray-800 pr-1 " size={20} />
        Volver
      </Button>
      <UserSectionReport title={`Publicación de ${entity.userFullName}`} />

      <div className="flex justify-around">
        <UserReportList reports={reports} />
        <UserReportCardButtons post={entity}/>
      </div>
    </div>
  );
}
