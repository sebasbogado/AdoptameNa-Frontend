'use client';

import { useAuth } from "@/contexts/auth-context";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getReportsById, deleteReport, banComment, deleteReportsByCommentId } from "@/utils/report-client";
import ReportDetailPage from "@/components/administration/report/report-detail";
import { Report } from "@/types/report";
import NotFound from "@/app/not-found";
import Loading from "@/app/loading";
import { Alert } from "@material-tailwind/react";
import { ITEM_TYPE } from "@/types/constants";
import { getCommentById } from "@/utils/comments.http";
import { Comment } from "@/types/comment";

export default function ReportsPost() {
  const { authToken } = useAuth();
  const params = useParams();
  const router = useRouter();
  const [comment, setComment] = useState<Comment | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const commentId = parseInt(params.id as string, 10);

  useEffect(() => {
    if (!authToken || isNaN(commentId)) {
      setError(true);
      return;
    }

    const fetchData = async () => {
      try {
        const [commentData, reportData] = await Promise.all([
          getCommentById(authToken, commentId.toString()),
          getReportsById(authToken, { idComment: commentId })
        ]);

        setComment(commentData);
        setReports(reportData.data);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [authToken, commentId]);

  const handleAprove = async () => {
    if (!authToken || !comment) return;
    try {
      await deleteReportsByCommentId(comment.id, authToken);
      setReports([]);
      setSuccessMessage("Comentario aprobado exitosamente");
      setTimeout(() => router.push("/administration/report/comments"), 5000);
    } catch {
      setErrorMessage("Hubo un error al aprobar el post.");
    }
  };

  const handleDesaprove = async () => {
    if (!authToken || !comment) return;
    try {
      await banComment(comment.id, authToken);
      setSuccessMessage("El comentario ha sido bloqueado con éxito.");
      setTimeout(() => router.push("/administration/report/comments"), 5000);
    } catch {
      setErrorMessage("Hubo un error al bloquear el commentario.");
    }
  };

  const handleDeleteReport = async (reportId: number) => {
    if (!authToken || !comment) return;
    try {
      await deleteReport(reportId, authToken);
      setReports((prev) => prev.filter((r) => r.id !== reportId));
    } catch {
      setErrorMessage("Error al eliminar el comentario.");
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
  if (error || !comment) return <NotFound />;

  return (
    <div className="p-6">
      <ReportDetailPage
        entity={comment}
        type={ITEM_TYPE.COMMENT}
        reports={reports}
        onBack={() => router.push("/administration/report/comments")}
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
