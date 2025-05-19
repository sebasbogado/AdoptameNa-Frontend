"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getCrowdfundingById } from "@/utils/crowfunding.http";
import { Crowdfunding } from "@/types/crowfunding-type";
import CrowdfundingModal from "@/components/crowfunding-modal"; // Ajusta el import según tu estructura
import Button from "@/components/buttons/button";
import Image from "next/image";
import { BadgeDollarSign, Calendar, Check, Clock, Coins, TrendingUp, X } from "lucide-react";
import { formatMediumDate } from "@/utils/date-format";
import { formatPrice } from "@/utils/price-format";
import EditButton from "@/components/buttons/edit-button";

export default function CrowdfundingDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string; // el id viene como string

    const [crowdfunding, setCrowdfunding] = useState<Crowdfunding | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getCrowdfundingById(Number(id));
                setCrowdfunding(data);
            } catch (err) {
                setErrorMessage("No se pudo cargar la colecta");
            }
        };
        if (id) fetchData();
    }, [id]);

    // Handlers para el modal (editar/eliminar)
    const handleSaved = (updated: Crowdfunding) => {
        setCrowdfunding(updated);
        setSuccessMessage("Cambios guardados correctamente");
    };

    const handleDeleted = (id: number) => {
        setSuccessMessage("Colecta eliminada correctamente");
        // Redirige a la lista o donde quieras después de eliminar
        router.push("/profile/received-request");
    };

    const renderStatus = (status: string) => {
        if (status === "ACTIVE")
            return (
                <span className="text-sm font-medium flex items-center px-3 py-1 rounded border border-green-400 bg-green-50 text-green-700">
                    <Check size={16} className="mr-1" /> Aprobada
                </span>
            );
        if (status === "PENDING")
            return (
                <span className="text-sm font-medium flex items-center px-3 py-1 rounded border border-yellow-400 bg-yellow-50 text-yellow-700">
                    <Clock size={16} className="mr-1" /> Pendiente
                </span>
            );
        return (
            <span className="text-sm font-medium flex items-center px-3 py-1 rounded border border-red-400 bg-red-50 text-red-700">
                <X size={16} className="mr-1" /> Rechazada
            </span>
        );
    };

    return (
        <div className="flex flex-col items-center pt-10 h-full min-h-screen bg-gray-100">
            <div className="bg-white shadow-md rounded-lg p-6 max-w-2xl w-full border border-gray-200">
                <div className="flex justify-center mb-4">
                    <Image src="/logo.png" alt="Logo" width={100} height={100} />
                </div>
                {crowdfunding ? (
                    <>
                        <h1 className="text-2xl text-center font-bold mb-4 text-gray-700">{crowdfunding.title}</h1>
                        <p className="text-center text-gray-500 mb-2 text-sm">{crowdfunding.description}</p>
                        <div className="flex flex-wrap justify-between gap-4 mt-6 mb-6">
                            <div className="flex items-center gap-2 text-gray-500 text-sm">
                                <Calendar size={16} className="text-gray-400" />
                                <span>
                                    {crowdfunding.startDate ? formatMediumDate(crowdfunding.startDate) : "Sin fecha"}{" "}
                                    {crowdfunding.endDate ? `al ${formatMediumDate(crowdfunding.endDate)}` : ""}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-500 text-sm">
                                <BadgeDollarSign size={16} className="text-gray-400" />
                                <span>
                                    <span className="font-medium text-gray-700">Meta:</span> {formatPrice(crowdfunding.goal)}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-500 text-sm">
                                <TrendingUp size={16} className="text-gray-400" />
                                <span>
                                    <span className="font-medium text-gray-700">Recaudado:</span> {formatPrice(crowdfunding.currentAmount)}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-500 text-sm">
                                <Coins size={16} className="text-gray-400" />
                                <span>
                                    <span className="font-medium text-gray-700">Duración:</span> {crowdfunding.durationDays} días
                                </span>
                            </div>
                        </div>
                        <div className="flex justify-end items-center gap-3 mt-2">
                            {renderStatus(crowdfunding.status)}
                        </div>
                        {(crowdfunding.status === "PENDING" || crowdfunding.status === "CLOSED") && (
                            <div className="flex justify-center mt-6">
                                <EditButton size="md" isEditing={false} onClick={() => setModalOpen(true)}>
                                    Editar
                                </EditButton>
                            </div>
                        )}
                        <CrowdfundingModal
                            open={modalOpen}
                            setOpen={setModalOpen}
                            selectedCrowdfunding={crowdfunding}
                            onSaved={handleSaved}
                            onDeleted={handleDeleted}
                            setSuccessMessage={setSuccessMessage}
                            setErrorMessage={setErrorMessage}
                        />
                        {successMessage && <div className="text-green-500 mt-4 text-center">{successMessage}</div>}
                        {errorMessage && <div className="text-red-500 mt-4 text-center">{errorMessage}</div>}
                    </>
                ) : (
                    <div className="text-center text-gray-500">Cargando detalles de la colecta...</div>
                )}
            </div>
        </div>
    );
}