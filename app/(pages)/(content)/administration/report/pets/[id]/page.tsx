'use client'
import Loading from "@/app/loading";
import NotFound from "@/app/not-found";
import { useAuth } from "@/contexts/auth-context";
import { Report } from "@/types/report";
import { deleteReport, deleteReportsByPostId, getReportsById, banPet, deleteReportsByPetId } from "@/utils/report-client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CardReport from "@/components/administration/report/card-button";
import ReportList from "@/components/administration/report/report-list";
import SectionAdmin from "@/components/administration/section";
import Button from "@/components/buttons/button";
import { Alert } from "@material-tailwind/react";
import { ArrowLeft } from "lucide-react";
import { Pet } from "@/types/pet";
import { getPet } from "@/utils/pets.http";

const getReportsOfPet = async (
  token: string,
  id: string,
  setReport: React.Dispatch<React.SetStateAction<Report[] | []>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setError: React.Dispatch<React.SetStateAction<boolean>>) => {
  try {
    setLoading(true);
    const report = await getReportsById(token, {idPet: id});
    setReport(report.data);
  } catch (error: any) {
    console.log(error);
    setError(true);
  } finally {
    setLoading(false);
  }
};
const getPetById = async (
  id: string,
  setPet: React.Dispatch<React.SetStateAction<Pet | null>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setError: React.Dispatch<React.SetStateAction<boolean>>) => {
  try {
    setLoading(true);
    const pet = await getPet(id);
    setPet(pet);
  } catch (error: any) {
    console.log(error);
    setError(true);
  } finally {
    setLoading(false);
  }
};

const ReportsPost = () => {
  const [pet, setPet] = useState<Pet | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const params = useParams();
  const { authToken, user, loading: authLoading } = useAuth();
  const route = useRouter();
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  //obtiene pet por id
  useEffect(() => {
    const petId = params.id;
    if (!petId || !authToken) {
      setError(true);
      return;
    }
    getPetById(petId as string, setPet, setLoading, setError);
    getReportsOfPet(authToken, petId as string, setReports, setLoading, setError);

  }, [params.id]);

  const handleAprove = async () => {
    if (!pet) return;
    try {
      await deleteReportByPet(pet.id);
      setSuccessMessage("Mascota aprobado exitosamente");
    } catch (err) {
      setErrorMessage("Hubo un error al aprobar el post.");
    }
  }
  //accion de bloquear; banear
  const handleDesaprove = async () => {
    if (!pet || !authToken) return;
    try {
      await banPet(pet.id, authToken);
      setSuccessMessage("La mascota ha sido bloqueado con éxito.");
      setTimeout(() => route.push(`/administration/report/pets`), 3000);
    } catch (err) {
      setErrorMessage("Hubo un error al banear el post.");
    }
  }
  //eliminar reporte individual
  const deleteReportById = async (reportId: number) => {
    if (authLoading || !authToken || !pet?.id) return;
    try {
      await deleteReport(reportId, authToken);
      setReports((prevReports) => prevReports.filter((r) => r.id !== reportId)); // Actualiza la UI eliminando el reporte

    } catch (error) {
      console.error("Error al eliminar el reporte:", error);
      setErrorMessage("Hubo un error al banear el post.");
    }
  };
  //eliminar todos los reportes de un pet al aprobarlo
  const deleteReportByPet = async (reportId: number) => {
    if (authLoading || !authToken || !pet?.id) return;
    try {
      await deleteReportsByPetId(reportId, authToken);
      setReports([]); // Actualiza la UI eliminando el reporte
      setTimeout(() => route.push(`/administration/report/pets`), 5000);


    } catch (error) {
      console.error("Error al eliminar el reporte:", error);
      setErrorMessage("Hubo un error al banear el post.");

    }
  };
  //eliminar reporte individual
  const handleDeleteReport = async (reportId: number) => {
    await deleteReportById(reportId);
  }

  const back = () => {
    route.push(`/administration/report/pets`);
  }

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  if (loading) {
    return Loading();
  }
  if (error || !pet) {
    console.log(pet)
    return <NotFound />;
  }

  return (
    <div className="p-6 ">
      <Button size="md" onClick={back} className="mb-6 mr-12 bg-white flex justify-between items-center shadow -md text-gray-800">
        <ArrowLeft className="text-gray-800 pr-1 " size={20} />
        Volver
      </Button>
      <SectionAdmin title={`Publicacion de: ${pet.userFullName}`} >Aprobar un reporte indica que es correcto y se eliminará la publicación, rechazar un reporte indica que el reporte no es correcto y la publicación seguirá activa</SectionAdmin>

      <div className="w-full flex justify-end">
        {successMessage && (
          <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-auto">
            <Alert color="green" onClose={() => setSuccessMessage("")} className="text-sm px-4  w-fit flex items-center">
              {successMessage}
            </Alert>
          </div>
        )}
        {errorMessage && (
          <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-auto">
            <Alert color="red" onClose={() => setErrorMessage("")} className="text-sm px-4  w-fit flex items-center">
              {errorMessage}
            </Alert>
          </div>
        )}
      </div>
      <div className=" flex justify-around">
        <ReportList reports={reports} handleDeleteReport={handleDeleteReport} />
        <CardReport post={pet} isReportedPage={true} handleAprove={handleAprove} handleDesaprove={handleDesaprove} isPost={true} />
      </div>
    </div>
  )
}
export default ReportsPost