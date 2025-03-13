"use client";

import { useState } from "react";
import ReportButton from "@/components/buttons/report-button";
import Modal from "@/components/modal";
import Button from "@/components/buttons/button";

export default function Page() {
  const [modalOpen, setModalOpen] = useState(false);
  return (
      <>
      <p>Pagina de post</p>
      <div className="flex justify-center gap-2 items-center ">
        <ReportButton size="lg" onClick={() => setModalOpen(true)} />

        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Reportar contenido"
        >
          <p>Futuro form</p>
          <Button
            onClick={() => setModalOpen(false)}
            variant="danger"
            size="md"
          >
            Confirmar Reporte
          </Button>
        </Modal>
      </div>
    </>
  );
}
