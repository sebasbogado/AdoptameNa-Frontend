'use client'
import Loading from "@/app/loading";
import NotFound from "@/app/not-found";
import { useAuth } from "@/contexts/auth-context";
import { Report } from "@/types/report";
import { deleteReport, deleteReportsByPost, getPostReportsById, banPost } from "@/utils/report-client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CardReport from "@/components/administration/report/card-button";
import { Post } from "@/types/post";
import { getPost } from "@/utils/posts.http";
import ReportList from "@/components/administration/report/report-list";
import SectionAdmin from "@/components/administration/section";
import Button from "@/components/buttons/button";
import { Alert } from "@material-tailwind/react";
import { ArrowLeft } from "lucide-react";

const getReportsOfPost = async (
  id: string,
  setReport: React.Dispatch<React.SetStateAction<Report[] | []>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setError: React.Dispatch<React.SetStateAction<boolean>>) => {
  try {
    setLoading(true);
    const report = await getPostReportsById(id);
    setReport(report.data);
  } catch (error: any) {
    console.log(error);
    setError(true);
  } finally {
    setLoading(false);
  }
};
const getPostById = async (
  id: string,
  setPost: React.Dispatch<React.SetStateAction<Post | null>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setError: React.Dispatch<React.SetStateAction<boolean>>) => {
  try {
    setLoading(true);
    const post = await getPost(id);
    setPost(post);
  } catch (error: any) {
    console.log(error);
    setError(true);
  } finally {
    setLoading(false);
  }
};

const ReportsPost = () => {
  const [post, setPost] = useState<Post | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const params = useParams();
  const { authToken, user, loading: authLoading } = useAuth();
  const route = useRouter();
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  //obtiene post por id
  useEffect(() => {
    const postId = params.id;
    if (!postId) {
      setError(true);
      return;
    }
    getPostById(postId as string, setPost, setLoading, setError);
    getReportsOfPost(postId as string, setReports, setLoading, setError);
  }, [params.id]);

  //accion de mantener
  //falta endpoint para eliminar todos los reportes relacionados al post
  const handleAprove = async () => {
    if (!post) return;
    try {
      await deleteReportByPost(post.id);
      setSuccessMessage("Post aprobado exitosamente");
    } catch (err) {
      setErrorMessage("Hubo un error al aprobar el post.");
    }
  }
  //accion de bloquear/banear
  const handleDesaprove = async () => {
    if (!post || !authToken) return;
    try {
      await banPost(post.id, authToken);
      setSuccessMessage("El post ha sido bloqueado con éxito.");
      setTimeout(() => route.push(`/administration/report/posts`), 3000);
    } catch (err) {
      setErrorMessage("Hubo un error al banear el post.");
    }
  }
  //eliminar reporte individual
  const deleteReportById = async (reportId: number) => {
    if (authLoading || !authToken || !post?.id) return;
    try {
      await deleteReport(reportId, authToken);
      setReports((prevReports) => prevReports.filter((r) => r.id !== reportId)); // Actualiza la UI eliminando el reporte

    } catch (error) {
      console.error("Error al eliminar el reporte:", error);
      setErrorMessage("Hubo un error al banear el post.");
    }
  };
  //falta endpoint
  //eliminar todos los reportes de un post al aprobarlo
  const deleteReportByPost = async (reportId: number) => {
    if (authLoading || !authToken || !post?.id) return;
    try {
      await deleteReportsByPost(reportId, authToken);
      setReports([]); // Actualiza la UI eliminando el reporte

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
    route.push(`/administration/report/posts`);
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
  if (error || !post) {
    return <NotFound />;
  }

  return (
    <div className="p-6 ">
      <Button size="md" onClick={back} className="mb-6 mr-12 bg-white flex justify-between items-center shadow -md text-gray-800">
        <ArrowLeft className="text-gray-800 pr-1 " size={20} />
        Volver
      </Button>
      <SectionAdmin title={`Publicacion de: ${post.userFullName}`} >Bloquear un reporte indica que es correcto y se eliminará la publicación, mantener un reporte indica que el reporte no es correcto y la publicación seguirá activa</SectionAdmin>

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
        <CardReport post={post} isReportedPage={true} handleAprove={handleAprove} handleDesaprove={handleDesaprove} />
      </div>
    </div>


  )
}
export default ReportsPost