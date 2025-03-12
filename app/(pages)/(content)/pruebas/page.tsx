"use client";

import { useState } from "react";
import ReportButton from "@/components/buttons/report-button";
import Modal from "@/components/modal";

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
          <button
            onClick={() => setModalOpen(false)}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
          >
            Confirmar Reporte
          </button>
        </Modal>
      </div>
    </>
  );
}
