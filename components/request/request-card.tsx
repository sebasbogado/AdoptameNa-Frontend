import { Crowdfunding } from "@/types/crowfunding-type";
import { Sponsor } from "@/types/sponsor";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { UserAvatar } from "../ui/user-avatar";
import { Calendar, Check, X } from "lucide-react";
import TextCard from "./text-card";
import { formatPrice } from "@/utils/price-format";
import { formatMediumDate, formatShortDate } from "@/utils/date-format";
interface RequestCardProps {
    application: Crowdfunding;
}

export const RequestCard: React.FC<RequestCardProps> = ({ application }) => {
    const router = useRouter();

   

    const handleCardClick = (e: React.MouseEvent) => {
        // Evitar la navegación si se hace clic en los botones de acción
        if ((e.target as HTMLElement).closest('button')) {
            return;
        }
        router.push(`/profile/received-request/crowdfunding-sent/${application.id}`);
    };

    return (
        <div
            className="bg-white p-4 rounded-lg shadow overflow-hidden border border-gray-200 flex flex-col cursor-pointer hover:shadow-lg transition-shadow"
            onClick={handleCardClick}
        >

            <h3 className="text-lg font-semibold text-gray-700">
                {application.title}
            </h3>
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-1">
                    <Calendar size={16} className="text-gray-500" />

                    <span className="text-xs text-gray-500">
                        {application.startDate
                            ? formatMediumDate(application.startDate)
                            : "Sin fecha inicio"}
                        {application.endDate
                            ? ` al ${formatMediumDate(application.endDate)}`
                            : ""}
                    </span>
                </div>

                <h3 className="text-lg font-semibold text-gray-700">
                    {formatPrice(application.goal)}
                </h3>
            </div>
            <p className="text-sm text-gray-500 mt-4 mb-4">
                {application.description}
            </p>               



            <div className="px-4 py-30 border-t pt-4 border-gray-200 flex justify-end gap-3 items-center">
                {application.status === 'ACTIVE' ? (
                    <span className="text-sm font-medium flex items-center px-3 py-1 rounded border border-green-400 bg-green-50 text-green-700">
                        <Check size={16} className="mr-1" /> Aprobado
                    </span>
                ) : application.status === 'PENDING' ? (
                    <span className="text-sm font-medium flex items-center px-3 py-1 rounded border border-yellow-400 bg-yellow-50 text-yellow-700">
                        <X size={16} className="mr-1" /> Pendiente
                    </span>
                ) : (
                    <span className="text-sm font-medium flex items-center px-3 py-1 rounded border border-red-400 bg-red-50 text-red-700">
                        <X size={16} className="mr-1" /> Rechazado
                    </span>
                )}
            </div>
        </div>
    );
}
