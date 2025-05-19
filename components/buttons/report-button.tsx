import React, { useState } from "react";
import clsx from "clsx";
import Modal from "@/components/modal";
import ReportForm from "@/components/report-form";
import { useAuth } from "@/contexts/auth-context";
import Button from "@/components/buttons/button";
import { useRouter } from "next/navigation";
import { Ban } from "lucide-react";

interface ReportButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "xs" | "sm" | "md" | "lg";
  idEntity?: string;
  idProduct?: string;
  isPet?: boolean;
}

const ReportButton: React.FC<ReportButtonProps> = ({
  size = "md",
  className,
  idEntity,
  idProduct,
  isPet = false,
  ...props
}) => {
  const [modal, setModal] = useState(false);
  const [modalError, setModalError] = useState(false);
  const { authToken } = useAuth();
  const router = useRouter();

  const baseStyles =
    "bg-btn-danger text-btn-primary-text rounded-lg transition-all duration-200 flex items-center justify-center w-fit";

  const sizes = {
    xs: "p-1 w-6 h-6",
    sm: "p-2 w-8 h-8",
    md: "p-2 w-10 h-10",
    lg: "p-3 w-12 h-12",
  };

  const iconSizes = {
    xs: "w-3 h-3",
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const handleClick = () => {
    if (!authToken) {
      setModalError(true);
      return;
    }
    setModal(true);
  };

  return (
    <>
      <button
        className={clsx(baseStyles, sizes[size], className)}
        {...props}
        onClick={handleClick}
      >
        <Ban className={iconSizes[size]} strokeWidth={2} />
      </button>

      <Modal isOpen={modal} onClose={() => setModal(false)} title="Reportar contenido">
        <ReportForm
          handleClose={() => setModal(false)}
          idEntity={idEntity}
          idProduct={idProduct}
          isPet={isPet}
        />
      </Modal>

      <Modal isOpen={modalError} onClose={() => setModalError(false)} title="Debe tener una cuenta para reportar contenido">
        <div className="mt-5">
          <p>Por favor inicie sesión o regístrese para realizar esta acción</p>
          <div className="flex justify-center space-x-2 mt-2">
            <Button variant="secondary" onClick={() => setModalError(false)}>Cancelar</Button>
            <Button variant="cta" onClick={() => router.push("/auth/login")}>Iniciar sesión</Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ReportButton;