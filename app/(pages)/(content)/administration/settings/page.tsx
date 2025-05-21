"use client";

import Card from "@/components/card";
import { useState, useEffect } from "react";
import Modal from "@/components/modal";
import { useAuth } from "@/contexts/auth-context";
import { ReportReason } from "@/types/report-reason";
import { getReportReasons, createReportReason, deleteReportReason, updateReportReason } from "@/utils/report-reasons.http";
import FormReportReason from "@/components/form-report-reason";
import { ProductCategory } from "@/types/product-category";
import { getProductCategories, createProductCategory, updateProductCategory, deleteProductCategory } from "@/utils/product-category.http";
import FormProductCategory from "@/components/form-product-category";
import { Alert } from "@material-tailwind/react";
import { Check, X } from "lucide-react";
import { ConfirmationModal } from "@/components/form/modal";
import PetBreeds from "@/components/pet-breeds";

export default function Page() {
  const [modalReportReason, setModalReportReason] = useState(false);
  const [modalProductCategory, setModalProductCategory] = useState(false);
  const [reportReasons, setReportReasons] = useState<ReportReason[]>([]);
  const [productCategories, setProductCategories] = useState<ProductCategory[]>([]);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [reportReasonSelected, setReportReasonSelected] = useState<ReportReason>({ id: 0, description: "" });
  const [productCategorySelected, setProductCategorySelected] = useState<ProductCategory>({ id: 0, name: "" });
  const [deleteType, setDeleteType] = useState<"reportReason" | "productCategory" | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { authToken, user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!authToken || !user || user.role !== "admin") return;
        const reportReasonsRes = await getReportReasons();
        const productCategoriesRes = await getProductCategories();
        setReportReasons(reportReasonsRes.data);
        setProductCategories(productCategoriesRes.data);
      } catch (error: any) {
        console.error("Error al obtener datos:", error);
        setErrorMessage(error.message);
      }
    };
    fetchData();
  }, [authToken]);

  const addReportReason = async (newReportReason: ReportReason) => {
    if (!authToken) return;
    try {
      if (reportReasonSelected.id) {
        await updateReportReason(authToken, newReportReason);
        setReportReasons(reportReasons.map((reason) =>
          reason.id === reportReasonSelected.id ? newReportReason : reason
        ));
        setSuccessMessage("Motivo actualizado correctamente");
      } else {
        const created = await createReportReason(authToken, newReportReason);
        setReportReasons([...reportReasons, created]);
        setSuccessMessage("Motivo creado correctamente");
      }
      setModalReportReason(false);
    } catch (error: any) {
      console.error("Error al guardar motivo:", error);
      setErrorMessage(error.message);
    }
  };

  const handleDeleteReportReason = async (event: React.FormEvent) => {
    event.preventDefault();
    if (reportReasonSelected.id === 0) {
      setModalReportReason(false);
      return;
    }
    setDeleteType("reportReason");
    setIsOpenModal(true);
  };

  const confirmDeleteReportReason = async () => {
    try {
      if (!authToken) return;
      await deleteReportReason(authToken, reportReasonSelected.id);
      setReportReasons(reportReasons.filter((reason) => reason.id !== reportReasonSelected.id));
      setSuccessMessage("Motivo eliminado correctamente");
    } catch (error: any) {
      console.error("Error al eliminar motivo:", error);
      setErrorMessage(error.message);
    } finally {
      setIsOpenModal(false);
      setModalReportReason(false);
    }
  };

  const openEditReportReason = (reportReason: ReportReason) => {
    setReportReasonSelected(reportReason);
    setModalReportReason(true);
  };

  const onClickLabelAddReportReason = () => {
    setReportReasonSelected({ id: 0, description: "" });
    setModalReportReason(true);
  };

  const handleSubmitProductCategory = async (newProductCategory: ProductCategory) => {
    try {
      if (!authToken) return;
      if (newProductCategory.id) {
        await updateProductCategory(authToken, newProductCategory);
        setProductCategories(productCategories.map((category) =>
          category.id === newProductCategory.id ? newProductCategory : category
        ));
        setSuccessMessage("Categoría de producto actualizada correctamente");
      } else {
        const { id, ...categoryData } = newProductCategory;
        const created = await createProductCategory(authToken, categoryData);
        setProductCategories([...productCategories, created]);
        setSuccessMessage("Categoría de producto creada correctamente");
      }
      setModalProductCategory(false);
    } catch (error: any) {
      console.error("Error al guardar categoría de producto:", error);
      setErrorMessage(error.message);
    }
  };

  const handleDeleteProductCategory = async (event: React.FormEvent) => {
    event.preventDefault();
    if (productCategorySelected.id === 0) {
      setModalProductCategory(false);
      return;
    }
    setDeleteType("productCategory");
    setIsOpenModal(true);
  };

  const confirmDeleteProductCategory = async () => {
    try {
      if (!authToken) return;
      await deleteProductCategory(authToken, productCategorySelected.id);
      setProductCategories(productCategories.filter((category) => category.id !== productCategorySelected.id));
      setSuccessMessage("Categoría de producto eliminada correctamente");
    } catch (error: any) {
      console.error("Error al eliminar categoría de producto:", error);
      setErrorMessage(error.message);
    } finally {
      setIsOpenModal(false);
      setModalProductCategory(false);
    }
  };

  const openEditProductCategory = (productCategory: ProductCategory) => {
    setProductCategorySelected(productCategory);
    setModalProductCategory(true);
  };

  const onClickLabelAddProductCategory = () => {
    setProductCategorySelected({ id: 0, name: "" });
    setModalProductCategory(true);
  };

  return (
    <>
    {successMessage && (
        <Alert
          open={true}
          color="green"
          animate={{
            mount: { y: 0 },
            unmount: { y: -100 },
          }}
          icon={<Check className="h-5 w-5" />}
          onClose={() => setSuccessMessage(null)}
          className="fixed top-4 right-4 w-72 shadow-lg z-[10001]"
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
            unmount: { y: -100 },
          }}
          icon={<X className="h-5 w-5" />}
          onClose={() => setErrorMessage(null)}
          className="fixed top-4 right-4 w-72 shadow-lg z-[10001]"
        >
          <p className="text-sm">{errorMessage}</p>
        </Alert>
      )}

      <div className="rounded-lg p-6">
        <div className="flex justify-center gap-3">
          <Modal
            isOpen={modalReportReason}
            onClose={() => setModalReportReason(false)}
            title="Motivo de Reporte"
          >
            <FormReportReason
              onCreate={addReportReason}
              onDelete={handleDeleteReportReason}
              reasonData={reportReasonSelected}
            />
          </Modal>

          <Modal
            isOpen={modalProductCategory}
            onClose={() => setModalProductCategory(false)}
            title={productCategorySelected.id === 0 ? "Crear categoría de producto" : "Editar categoría de producto"}
          >
            <FormProductCategory
              onCreate={handleSubmitProductCategory}
              onDelete={handleDeleteProductCategory}
              productCategoryData={productCategorySelected}
            />
          </Modal>

          <ConfirmationModal
            isOpen={isOpenModal}
            title="Eliminar"
            message={`¿Estás seguro de que deseas eliminar ${
              deleteType === "reportReason" ? "este motivo" : "esta categoría de producto"
            }?`}
            textConfirm="Eliminar"
            confirmVariant="danger"
            onClose={() => {
              setIsOpenModal(false);
              setDeleteType(null);
            }}
            onConfirm={
              deleteType === "reportReason" ? confirmDeleteReportReason : confirmDeleteProductCategory
            }
          />

          <Card
            title="Motivos de reporte"
            content={reportReasons}
            onClickLabelDefault={openEditReportReason}
            onClickLabelAdd={onClickLabelAddReportReason}
          />
          <Card
            title="Categorías de productos"
            content={productCategories}
            onClickLabelDefault={openEditProductCategory}
            onClickLabelAdd={onClickLabelAddProductCategory}
          />
        </div>
        <div className="flex justify-center mt-10">
          <PetBreeds setSuccessMessage={setSuccessMessage} setErrorMessage={setErrorMessage} />
        </div>
      </div>
    </>
  );
}
