'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from "@/contexts/auth-context";
import Loading from "@/app/loading";
import NotFound from "@/app/not-found";
import { Sponsor } from '@/types/sponsor';
import { getSponsorById } from '@/utils/sponsor.http';
import Image from 'next/image';
import { Alert } from "@material-tailwind/react";
import { User, Mail, Check, X } from 'lucide-react';

export default function SponsorDetailPage() {
    const { authToken } = useAuth();
    const params = useParams();
    const router = useRouter();
    const [sponsor, setSponsor] = useState<Sponsor | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [alertInfo, setAlertInfo] = useState<{
        open: boolean;
        color: "green" | "red" | "blue";
        message: string;
    } | null>(null);

    useEffect(() => {
        if (!authToken || !params.id) {
            setError(true);
            return;
        }

        const fetchSponsor = async () => {
            try {
                const sponsorData = await getSponsorById(authToken, Number(params.id));
                setSponsor(sponsorData);
            } catch (err) {
                setAlertInfo({
                    open: true,
                    color: "red",
                    message: "Error al cargar los detalles del auspiciante"
                });
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchSponsor();
    }, [authToken, params.id]);

    if (loading) return <Loading />;
    if (error) return <NotFound />;

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
        <div className="w-full flex flex-col items-center py-10 px-2 min-h-screen bg-gray-50">
            {alertInfo && (
                <Alert
                    open={alertInfo.open}
                    color={alertInfo.color}
                    animate={{
                        mount: { y: 0 },
                        unmount: { y: -100 },
                    }}
                    icon={alertInfo.color === "green" ? <Check className="h-5 w-5" /> : <X className="h-5 w-5" />}
                    onClose={() => setAlertInfo(null)}
                    className="fixed top-4 right-4 w-72 shadow-lg z-[10001]"
                >
                    <p className="text-sm">{alertInfo.message}</p>
                </Alert>
            )}
            <div className="w-full max-w-2xl">
                <button
                    className="mb-4 text-blue-600 hover:underline flex items-center gap-1"
                    onClick={() => router.back()}
                >
                    <span className="mr-1">&#60;</span> Mis solicitudes
                </button>

                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-2xl font-semibold text-center flex-1">
                        SA-{sponsor?.id?.toString().padStart(4, '0')}: Solicitud de auspicio {sponsor?.organizationName || sponsor?.fullName}
                    </h2>
                </div>

                <div className={`mx-auto inline-block px-4 py-2 rounded-full border text-base font-medium mb-6 ${statusColor}`}>{statusLabel}</div>

                <div className="bg-white rounded-2xl shadow p-10 min-h-[500px] flex flex-col items-center space-y-6">
                    <h3 className="text-xl font-bold mb-2 text-center">{sponsor?.organizationName || sponsor?.fullName}</h3>
                    <div className="flex flex-col gap-1 mb-2 text-gray-700 text-base items-start text-left w-full max-w-xs mx-auto">
                        {sponsor?.fullName && (
                            <div className="flex items-center gap-2">
                                <User size={18} />
                                <span>{sponsor.fullName}</span>
                            </div>
                        )}
                        {sponsor?.contact && (
                            <div className="flex items-center gap-2">
                                <Mail size={18} />
                                <span>{sponsor.contact}</span>
                            </div>
                        )}
                    </div>

                    {sponsor?.logoUrl && (
                        <>
                            <div className="font-medium mb-2 mt-4 text-center">Logo de Auspicio</div>
                            <div className="flex justify-center mb-6">
                                <div className="relative w-60 h-60 border-2 border-gray-200 rounded-xl overflow-hidden bg-gray-50">
                                    <Image
                                        src={sponsor.logoUrl}
                                        alt="Logo del auspiciante"
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    {sponsor?.bannerUrl && (
                        <>
                            <div className="font-medium mb-2 mt-4 text-center">Banner publicitario</div>
                            <div className="flex justify-center">
                                <div className="relative bg-blue-50 rounded-xl flex items-center justify-center" style={{ width: 400, height: 133, maxWidth: '100%' }}>
                                    <Image
                                        src={sponsor.bannerUrl}
                                        alt="Banner publicitario"
                                        width={400}
                                        height={133}
                                        className="object-contain rounded-xl"
                                        style={{ maxWidth: '100%', maxHeight: '100%' }}
                                    />
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}