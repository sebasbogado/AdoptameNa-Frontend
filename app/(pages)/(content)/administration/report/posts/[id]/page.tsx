'use client';

import { useAuth } from "@/contexts/auth-context";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getPost } from "@/utils/posts.http";
import { getReportsById, deleteReportsByPostId, deleteReport, banPost } from "@/utils/report-client";
import ReportDetailPage from "@/components/administration/report/report-detail";
import { Report } from "@/types/report";
import { Post } from "@/types/post";
import NotFound from "@/app/not-found";
import Loading from "@/app/loading";
import { Alert } from "@material-tailwind/react";
import { ITEM_TYPE } from "@/types/constants";

export default function ReportsPost() {
  const { authToken } = useAuth();
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const postId = parseInt(params.id as string, 10);

  useEffect(() => {
    if (!authToken || isNaN(postId)) {
      setError(true);
      return;
    }

    const fetchData = async () => {
      try {
        const [postData, reportData] = await Promise.all([
          getPost(postId.toString()),
          getReportsById(authToken, { idPost: postId })
        ]);
        setPost(postData);
        setReports(reportData.data);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [authToken, postId]);

  const handleAprove = async () => {
    if (!authToken || !post) return;
    try {
      await deleteReportsByPostId(post.id, authToken);
      setReports([]);
      setSuccessMessage("Post aprobado exitosamente");
      setTimeout(() => router.push("/administration/report/posts"), 5000);
    } catch {
      setErrorMessage("Hubo un error al aprobar el post.");
    }
  };

  const handleDesaprove = async () => {
    if (!authToken || !post) return;
    try {
      await banPost(post.id, authToken);
      setSuccessMessage("El post ha sido bloqueado con éxito.");
      setTimeout(() => router.push("/administration/report/posts"), 5000);
    } catch {
      setErrorMessage("Hubo un error al bloquear el post.");
    }
  };

  const handleDeleteReport = async (reportId: number) => {
    if (!authToken || !post) return;
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
  if (error || !post) return <NotFound />;

  return (
    <div className="p-6">
      <ReportDetailPage
        entity={post}
        type={ITEM_TYPE.POST}
        reports={reports}
        onBack={() => router.push("/administration/report/posts")}
        onBlock={handleDesaprove}
        onKeep={handleAprove}
        handleDeleteReport={handleDeleteReport}
      />

      {/* Mensajes de feedback */}
      <div className="w-full flex justify-end">
        {successMessage && (
          <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-auto">
            <Alert color="green" onClose={() => setSuccessMessage("")}>
              {successMessage}
            </Alert>
          </div>
        )}
        {errorMessage && (
          <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-auto">
            <Alert color="red" onClose={() => setErrorMessage("")}>
              {errorMessage}
            </Alert>
          </div>
        )}
      </div>
    </div>
  );
}
