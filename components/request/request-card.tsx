import { Crowdfunding } from "@/types/crowfunding-type";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BadgeDollarSign, Calendar, Check, Clock, Coins, MinusCircle, TrendingUp, X } from "lucide-react";
import { formatPrice } from "@/utils/price-format";
import { formatMediumDate } from "@/utils/date-format";
import CrowdfundingModal from "../crowfunding-modal";
import EditButton from "../buttons/edit-button";
import { Alert } from "@material-tailwind/react";
import TrashButton from "../buttons/trash-button";
import {ConfirmationModal} from "../form/modal";

interface RequestCardProps {
    application: Crowdfunding;
    onEdited?: (updated: Crowdfunding) => void;
    onDeleted?: (id: number) => void;
    resetFilters?: () => void;
}

export const RequestCard: React.FC<RequestCardProps> = ({ application, onEdited, onDeleted, resetFilters }) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)

    const [toast, setToast] = useState<{ show: boolean; message: string; color: "purple" | "red" }>({
        show: false,
        message: "",
        color: "purple",
    });

    useEffect(() => {
        if (toast.show) {
            const timer = setTimeout(() => setToast(s => ({ ...s, show: false })), 4000);
            return () => clearTimeout(timer);
        }
    }, [toast.show]);

    const renderStatus = (status: string) => {
        switch (status) {
            case "ACTIVE":
                return (
                    <span className="text-sm font-medium flex items-center px-3 py-1 rounded border border-green-400 bg-green-50 text-green-700">
                        <Check size={16} className="mr-1" /> Aprobada
                    </span>
                );
            case "PENDING":
                return (
                    <span className="text-sm font-medium flex items-center px-3 py-1 rounded border border-yellow-400 bg-yellow-50 text-yellow-700">
                        <Clock size={16} className="mr-1" /> Pendiente
                    </span>
                );
            case "CLOSED":
                return (
                    <span className="text-sm font-medium flex items-center px-3 py-1 rounded border border-blue-400 bg-blue-50 text-blue-700">
                        <MinusCircle size={16} className="mr-1" /> Finalizada
                    </span>
                );
            case "REJECTED":
                return (
                    <span className="text-sm font-medium flex items-center px-3 py-1 rounded border border-red-400 bg-red-50 text-red-700">
                        <X size={16} className="mr-1" /> Rechazada
                    </span>
                );
            case "NONE":
                return (
                    <span className="text-sm font-medium flex items-center px-3 py-1 rounded border border-gray-300 bg-gray-100 text-gray-500">
                        <MinusCircle size={16} className="mr-1" /> Sin Estado
                    </span>
                );
            default:
                return (
                    <span className="text-sm font-medium flex items-center px-3 py-1 rounded border border-gray-300 bg-gray-100 text-gray-500">
                        <MinusCircle size={16} className="mr-1" /> Desconocido
                    </span>
                );
        }
    };

    const handleSaved = (updated: Crowdfunding) => {
        setModalOpen(false);
        setToast({ show: true, message: "Colecta actualizada correctamente", color: "purple" });
        onEdited?.(updated);
        resetFilters?.();
    };

    const handleDeleted = (id: number) => {
        setModalOpen(false);
        setToast({ show: true, message: "Colecta eliminada correctamente", color: "purple" });
        onDeleted?.(id);
    };
    const handleError = (msg: string | null) => {
        if (msg) setToast({ show: true, message: msg, color: "red" });
    };

    return (
        <div
            className="bg-white rounded-lg shadow border border-gray-200 flex flex-col max-w-2xl w-full p-0"
            style={{ minHeight: 340 }}
        >
            <div className="flex-1 flex flex-col mt-4 items-center px-6">
                 <div className="flex justify-center mb-4">
                                    <Image src="/logo.png" alt="Logo" width={80} height={80} />
                                </div>
                <h3 className="text-lg font-bold text-gray-700 text-center mt-2 w-full line-clamp-2">
                    {application.title}
                </h3>
                <p className="text-sm text-gray-500 text-center mt-2 mb-4 h-16 break-words line-clamp-2 w-full">
                    {application.description}
                </p>
                <div className="grid grid-cols-2 gap-4 w-full mb-2">
                    <div className="flex items-center gap-2 text-gray-500 text-sm truncate">
                        <Calendar size={16} className="text-gray-400 shrink-0" />
                        <span className="truncate">
                            {application.startDate ? formatMediumDate(application.startDate) : "Sin fecha"}
                            {application.endDate ? ` al ${formatMediumDate(application.endDate)}` : ""}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                        <BadgeDollarSign size={16} className="text-gray-400" />
                        <span>
                            <span className="font-medium text-gray-700">Meta:</span> {formatPrice(application.goal)}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                        <TrendingUp size={16} className="text-gray-400" />
                        <span>
                            <span className="font-medium text-gray-700">Recaudado:</span> {formatPrice(application.currentAmount)}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                        <Coins size={16} className="text-gray-400" />
                        <span>
                            <span className="font-medium text-gray-700">Duración:</span> {application.durationDays} días
                        </span>
                    </div>
                </div>
            </div>
            {/* Footer */}
            <div className="flex justify-between items-center border-t border-gray-200 px-6 py-4 min-h-[56px]">
                <div>{renderStatus(application.status)}</div>

                <div className="flex gap-2">
                    {(application.status === "PENDING") && (

                        <EditButton isEditing={false} size="sm" onClick={() => setModalOpen(true)}>
                            Editar
                        </EditButton>
                    )}


                    {(application.status !== "ACTIVE" &&  application.status !== "PENDING" ) && (
                        <TrashButton
                            size="sm"
                            onClick={() => setIsConfirmModalOpen(true)}
                        />
                    )}

                </div>

            </div>
            <ConfirmationModal
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={() => {
                    setIsConfirmModalOpen(false); // Cierra el modal
                    onDeleted?.(application.id);  // Llama al handler de borrado del crowdfunding
                }}
                title="Eliminar colecta"
                message="¿Estás seguro de que quieres eliminar esta colecta? Esta acción no se puede deshacer."
                confirmVariant="danger"
                textConfirm="Eliminar"
            />            {/* Modal de edición */}
            <CrowdfundingModal
                open={modalOpen}
                setOpen={setModalOpen}
                selectedCrowdfunding={application}
                onSaved={handleSaved}
                onDeleted={handleDeleted}
                setSuccessMessage={(msg) => msg && setToast({ show: true, message: msg, color: "purple" })}
                setErrorMessage={handleError}
            />
            {/* TOAST/ALERT */}
            <Alert
                open={toast.show}
                color={toast.color}
                animate={{
                    mount: { y: 0 },
                    unmount: { y: -100 },
                }}
                onClose={() => setToast((s) => ({ ...s, show: false }))}
                className="fixed top-4 right-4 w-72 shadow-lg z-[10001]"
            >
                <p className="text-sm">{toast.message}</p>
            </Alert>
        </div>
    );
};
