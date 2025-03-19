import React, { useState } from "react";
import clsx from "clsx";
import Modal from "@/components/modal";
import ReportForm from "@/components/report-form";
interface ReportButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
  //temp hasta que se tenga el endpoint para reportar pets
  idPost?: number;
}

//props para idUser, idPost
const ReportButton: React.FC<ReportButtonProps> = ({ size = "md", className, idPost, ...props }) => {
  const [modal, setModal] = useState(false);
  const baseStyles =
    "bg-btn-danger text-btn-primary-text rounded-lg transition-all duration-200 flex items-center  justify-center w-fit";

  const sizes = {
    sm: "p-2 w-8 h-8",
    md: "p-2 w-10 h-10",
    lg: "p-3 w-12 h-12",
  };

  return (
    <>
      <button className={clsx(baseStyles, sizes[size], className)} {...props} onClick={() => setModal(true)}>
        <span className="material-symbols-outlined">block</span>
      </button>
      <Modal isOpen={modal} onClose={() => setModal(false)} title="Reportar contenido">
        <ReportForm idPost={idPost ? idPost : 0} handleClose={() => setModal(false)} />
      </Modal>
    </>
  );
};

export default ReportButton;
