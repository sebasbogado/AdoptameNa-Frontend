"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { CommentItem } from "@/components/comments/comment-item";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { getUserReports } from "@/utils/reports.http";
import Pagination from "@/components/pagination";
import { ReportType } from "@/types/report";
import { getCommentById } from "@/utils/comments.http";

export default function ReportedCommentsPage() {
  const params = useParams();
  const id = params?.id as string;
  const { authToken } = useAuth();
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 0, size: 25, totalPages: 1 });
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (!authToken) return;
    setLoading(true);
    getUserReports(authToken, { page: currentPage - 1, size: pagination.size, reportType: ReportType.COMMENT })
      .then(async (data) => {
        // Obtener el contenido real de cada comentario
        const commentsWithContent = await Promise.all(
          (data.data || []).map(async (report: any) => {
            let commentContent = "";
            try {
              const commentData = await getCommentById(authToken, report.commentId);
              commentContent = commentData.content;
            } catch {
              commentContent = "(No se pudo obtener el comentario)";
            }
            return {
              ...report,
              user: {
                id: report.userId,
                fullName: report.reporterFullName || "Usuario desconocido",
              },
              createdAt: report.reportDate,
              content: commentContent,
            };
          })
        );
        setComments(commentsWithContent);
        setPagination({
          page: data.pagination.page,
          size: data.pagination.size,
          totalPages: data.pagination.totalPages,
        });
      })
      .finally(() => setLoading(false));
  }, [authToken, currentPage]);

  // Adaptador para que el componente CommentItem no falle
  const adaptComment = (comment: any) => ({
    ...comment,
    user: {
      id: comment.userId,
      fullName: comment.reporterFullName || "Usuario desconocido",
    },
  });

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Mis comentarios reportados</h1>
      <Link href="/profile/report" className="text-blue-600 hover:underline mb-4 inline-block">← Volver a reportes</Link>
      {loading ? (
        <p>Cargando comentarios...</p>
      ) : comments.length === 0 ? (
        <p>No hay comentarios reportados para este usuario.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {comments.map((comment) => (
              <CommentItem key={comment.id} comment={adaptComment(comment)} />
            ))}
          </div>
          <Pagination
            totalPages={pagination.totalPages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
} 