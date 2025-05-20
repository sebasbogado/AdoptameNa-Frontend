import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Check, X, Trash } from 'lucide-react';
import { Sponsor } from '@/types/sponsor';

interface SponsorCardProps {
    sponsor: Sponsor;
    isAdmin?: boolean;
    onApprove?: (id: number) => void;
    onReject?: (id: number) => void;
    onDelete?: (id: number) => void;
}

export default function SponsorCard({ 
    sponsor, 
    isAdmin = false,
    onApprove,
    onReject,
    onDelete 
}: SponsorCardProps) {
    const [hasLogoError, setHasLogoError] = useState(false);
    const router = useRouter();

    const handleLogoError = () => {
        setHasLogoError(true);
    };

    const handleCardClick = (e: React.MouseEvent) => {
        // Evitar la navegación si se hace clic en los botones de acción
        if ((e.target as HTMLElement).closest('button')) {
            return;
        }
        const basePath = isAdmin ? '/administration/sponsors' : '/profile/received-request/sponsors';
        router.push(`${basePath}/${sponsor.id}`);
    };

    // Estado visual
    let statusLabel = '';
    let statusColor = '';
    if (sponsor?.status === 'INACTIVE' || sponsor?.isActive === false) {
        statusLabel = 'Rechazado';
        statusColor = 'bg-red-100 text-red-700 border-red-300';
    } else if (sponsor?.status === 'PENDING' || (sponsor?.isActive === undefined && !sponsor?.status)) {
        statusLabel = 'Pendiente';
        statusColor = 'bg-yellow-100 text-yellow-700 border-yellow-300';
    } else if (sponsor?.status === 'ACTIVE' || sponsor?.isActive === true) {
        statusLabel = 'Aprobado';
        statusColor = 'bg-green-100 text-green-700 border-green-300';
    }

    return (
        <div 
            className="bg-white rounded-2xl shadow overflow-hidden border border-gray-200 flex flex-col cursor-pointer hover:shadow-lg transition-shadow"
            onClick={handleCardClick}
        >
            <div className="h-40 w-full bg-gray-100 flex items-center justify-center relative overflow-hidden border-b">
                {sponsor.logoUrl && !hasLogoError ? (
                    <Image
                        src={sponsor.logoUrl}
                        alt={`Logo Solicitud ${sponsor.id}`}
                        fill
                        className="object-cover w-full h-full"
                        onError={handleLogoError}
                        priority
                    />
                ) : (
                    <span className="logo-placeholder text-gray-400 text-sm italic">
                        {sponsor.logoId ? 'Error al cargar logo' : 'Sin logo'}
                    </span>
                )}
            </div>
            
            <div className="p-4 flex-1">
                <h3 className="text-lg font-semibold mb-1">{sponsor.organizationName || sponsor.fullName}</h3>
                <p className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">Contacto:</span> {sponsor.contact || 'No especificado'}
                </p>
                <p className="text-sm text-gray-700 mb-1"><span className="font-medium">Razón:</span></p>
                <p className="text-sm text-gray-700 p-2 max-h-20 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
                    {sponsor.reason || 'No especificada'}
                </p>
            </div>

            <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
                {isAdmin ? (
                    <>
                        <button
                            onClick={() => onDelete?.(sponsor.id)}
                            className="p-2 rounded-full text-gray-500 hover:bg-red-200 transition-colors"
                            title="Eliminar definitivamente"
                        >
                            <Trash size={20} />
                        </button>
                        
                        {sponsor.status === 'PENDING' ? (
                            <div className="flex gap-2">
                                <button
                                    onClick={() => onReject?.(sponsor.id)}
                                    className="p-2 rounded-full text-red-500 hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    title="Rechazar (Eliminar)"
                                >
                                    <X size={20} />
                                </button>
                                <button
                                    onClick={() => onApprove?.(sponsor.id)}
                                    className="p-2 rounded-full text-green-500 hover:bg-green-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    title="Aprobar"
                                >
                                    <Check size={20} />
                                </button>
                            </div>
                        ) : (
                            <span className={`text-sm font-medium flex items-center px-3 py-1 rounded border ${statusColor}`}>
                                {sponsor.status === 'ACTIVE' ? (
                                    <Check size={16} className="mr-1"/>
                                ) : (
                                    <X size={16} className="mr-1"/>
                                )}
                                {statusLabel}
                            </span>
                        )}
                    </>
                ) : (
                    <span className={`text-sm font-medium flex items-center px-3 py-1 rounded border ${statusColor}`}>
                        {sponsor.status === 'ACTIVE' ? (
                            <Check size={16} className="mr-1"/>
                        ) : (
                            <X size={16} className="mr-1"/>
                        )}
                        {statusLabel}
                    </span>
                )}
            </div>
        </div>
    );
} 