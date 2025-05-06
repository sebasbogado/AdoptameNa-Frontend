'use client';

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import Loading from "@/app/loading";
import NotFound from "@/app/not-found";
import { Pet } from "@/types/pet";
import { Report } from "@/types/report";
import { getPet } from "@/utils/pets.http";
import { getUserReports } from "@/utils/reports.http";
import UserReportDetailPage from "@/components/profile/report/user-report-detail";

export default function Page() {

  const { authToken } = useAuth();
    const params = useParams();
    const router = useRouter();
    const [pet, setPet] = useState<Pet | null>(null);
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    
    const petId = params.id

    useEffect(() => {
      if (!authToken || !petId) {
        setError(true);
        return;
      }
  
      const fetchData = async () => {
        try {
          const [petData, reportData] = await Promise.all([
            getPet(params.id as string),
            getUserReports(authToken, { idPet: Number(petId) })
          ]);
          setPet(petData);
          setReports(reportData.data);
        } catch (err) {
          setError(true);
        } finally {
          setLoading(false);
        }
      };
  
      fetchData();
    }, [authToken, petId]);

  
    if (loading) return <Loading />;
    if (error || !pet) return <NotFound />;



  return (
      <div className="p-6">
        <UserReportDetailPage
          entity={pet}
          reports={reports}
          onBack={() => router.push("/profile/report/pets")}
        />
      </div>
    );
}