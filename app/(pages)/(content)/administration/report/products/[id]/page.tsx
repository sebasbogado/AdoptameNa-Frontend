'use client';

import { useAuth } from "@/contexts/auth-context";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getReportsById, deleteReport, banPost, deleteReportsByProductId, banProduct } from "@/utils/report-client";
import ReportDetailPage from "@/components/administration/report/report-detail";
import { Report } from "@/types/report";
import NotFound from "@/app/not-found";
import Loading from "@/app/loading";
import { Alert } from "@material-tailwind/react";
import { Check, X } from "lucide-react";
import { getProduct } from "@/utils/product.http";
import { Product } from "@/types/product";
import { ITEM_TYPE } from "@/types/constants";

export default function ReportsPost() {
  const { authToken } = useAuth();
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const productId = parseInt(params.id as string, 10);

  useEffect(() => {
    if (!authToken || isNaN(productId)) {
      setError(true);
      return;
    }

    const fetchData = async () => {
      try {
        const [productData, reportData] = await Promise.all([
          getProduct(productId.toString()),
          getReportsById(authToken, { idProduct: productId })
        ]);
        setProduct(productData);
        setReports(reportData.data);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [authToken, productId]);

  const handleAprove = async () => {
    if (!authToken || !product) return;
    try {
      await deleteReportsByProductId(product.id, authToken);
      setReports([]);
      setSuccessMessage("Post aprobado exitosamente");
      setTimeout(() => router.push("/administration/report/products"), 5000);
    } catch {
      setErrorMessage("Hubo un error al aprobar el post.");
    }
  };

  const handleDesaprove = async () => {
    if (!authToken || !product) return;
    try {
      await banProduct(product.id, authToken);
      setSuccessMessage("El post ha sido bloqueado con éxito.");
      setTimeout(() => router.push("/administration/report/products"), 5000);
    } catch {
      setErrorMessage("Hubo un error al bloquear el post.");
    }
  };

  const handleDeleteReport = async (reportId: number) => {
    if (!authToken || !product) return;
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
  if (error || !product) return <NotFound />;

  return (
    <div className="p-6">
      <ReportDetailPage
        entity={product}
        type={ITEM_TYPE.PRODUCT}
        reports={reports}
        onBack={() => router.push("/administration/report/products")}
        onBlock={handleDesaprove}
        onKeep={handleAprove}
        handleDeleteReport={handleDeleteReport}
      />

      {/* Mensajes de feedback */}
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
