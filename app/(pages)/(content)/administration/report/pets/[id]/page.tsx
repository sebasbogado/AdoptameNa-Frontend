'use client';

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import Loading from "@/app/loading";
import NotFound from "@/app/not-found";
import { Alert } from "@material-tailwind/react";
import { Check, X } from "lucide-react";
import { Pet } from "@/types/pet";
import { Report } from "@/types/report";
import {getReportsById, deleteReport, banPet, deleteReportsByPetId} from "@/utils/report-client";
import { getPet } from "@/utils/pets.http";
import ReportDetailPage from "@/components/administration/report/report-detail";
import { ITEM_TYPE } from "@/types/constants";

export default function ReportsPet() {
  const { authToken } = useAuth();
  const params = useParams();
  const router = useRouter();
  const [pet, setPet] = useState<Pet | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const petId = parseInt(params.id as string, 10);

  useEffect(() => {
    if (!authToken || !petId) {
      setError(true);
      return;
    }

    const fetchData = async () => {
      try {
        const [petData, reportData] = await Promise.all([
          getPet(params.id as string),
          getReportsById(authToken, { idPet: petId })
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

  const handleAprove = async () => {
    if (!authToken || !pet) return;
    try {
      await deleteReportsByPetId(pet.id, authToken);
      setReports([]);
      setSuccessMessage("Mascota aprobada exitosamente.");
      setTimeout(() => router.push("/administration/report/pets"), 5000);
    } catch {
      setErrorMessage("Error al aprobar la mascota.");
    }
  };

  const handleDesaprove = async () => {
    if (!authToken || !pet) return;
    try {
      await banPet(pet.id, authToken);
      setSuccessMessage("Mascota bloqueada exitosamente.");
      setTimeout(() => router.push("/administration/report/pets"), 5000);
    } catch {
      setErrorMessage("Error al bloquear la mascota.");
    }
  };

  const handleDeleteReport = async (reportId: number) => {
    if (!authToken || !pet) return;
    try {
      await deleteReport(reportId, authToken);
      setReports((prev) => prev.filter((r) => r.id !== reportId));
    } catch {
      setErrorMessage("Error al eliminar el reporte.");
    }
  };

  useEffect(() => {
    const t1 = setTimeout(() => setSuccessMessage(""), 5000);
    const t2 = setTimeout(() => setErrorMessage(""), 5000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [successMessage, errorMessage]);

  if (loading) return <Loading />;
  if (error || !pet) return <NotFound />;

  return (
    <div className="p-6">
      <ReportDetailPage
        entity={pet}
        type={ITEM_TYPE.PET}
        reports={reports}
        onBack={() => router.push("/administration/report/pets")}
        onBlock={handleDesaprove}
        onKeep={handleAprove}
        handleDeleteReport={handleDeleteReport}
      />

      {/* Feedback */}
      {successMessage && (
        <Alert
          open={true}
          color="green"
          animate={{
            mount: { y: 0 },
            unmount: { y: 100 },
          }}
          icon={<Check className="h-5 w-5" />}
          onClose={() => setSuccessMessage("")}
          className="fixed bottom-4 right-4 w-72 shadow-lg z-[10001]"
        >
          <p className="text-sm">{successMessage}</p>
        </Alert>
      )}
      {errorMessage && (
        <Alert
          open={true}
          color="red"
          animate={{
            mount: { y: 0 },
            unmount: { y: 100 },
          }}
          icon={<X className="h-5 w-5" />}
          onClose={() => setErrorMessage("")}
          className="fixed bottom-4 right-4 w-72 shadow-lg z-[10001]"
        >
          <p className="text-sm">{errorMessage}</p>
        </Alert>
      )}
    </div>
  );
}
