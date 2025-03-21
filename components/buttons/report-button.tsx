import React, { useState } from "react";
import clsx from "clsx";
import Modal from "@/components/modal";
import ReportForm from "@/components/report-form";
import { useAuth } from "@/contexts/authContext";
import Button from "@/components/buttons/button";
import { useRouter } from "next/navigation";
interface ReportButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
  //temp hasta que se tenga el endpoint para reportar pets
}

//props para idUser, idPost
const ReportButton: React.FC<ReportButtonProps> = ({ size = "md", className, ...props }) => {
  const [modal, setModal] = useState(false);
  const [modalError, setModalError] = useState(false);
  const { authToken } = useAuth();
  const router = useRouter();
  const baseStyles =
    "bg-btn-danger text-btn-primary-text rounded-lg transition-all duration-200 flex items-center  justify-center w-fit";

  const sizes = {
    sm: "p-2 w-8 h-8",
    md: "p-2 w-10 h-10",
    lg: "p-3 w-12 h-12",
  };

  const handleClick = () => {
    if (!authToken) {
      setModalError(true);
      return;
    }
    setModal(true);
  }

  const navigateToLogin = () => {
    setModalError(false);
    router.push("/auth/login");
  }
  return (
    <>
      <button className={clsx(baseStyles, sizes[size], className)} {...props} onClick={handleClick}>
        <span className="material-symbols-outlined">block</span>
      </button>
      <Modal isOpen={modal} onClose={() => setModal(false)} title="Reportar contenido">
        <ReportForm handleClose={() => setModal(false)} />
      </Modal>
      <Modal isOpen={modalError} onClose={() => setModalError(false)} title="Debe tener una cuenta para reportar contenido">
        <div className="mt-5">
          <p>Por favor inicie sesion o registrese para realizar esta accion</p>
          <div className="flex justify-center space-x-2 mt-2">

            <Button variant="secondary" onClick={()=>setModalError(false)}>Cancelar</Button>
            <Button variant="cta" onClick={navigateToLogin}>Iniciar sesion</Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ReportButton;
