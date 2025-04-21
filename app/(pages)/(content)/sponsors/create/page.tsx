'use client';

import { useState } from 'react';
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { createSponsor } from "@/utils/sponsor.http";
import { postMedia } from "@/utils/media.http";

export default function SponsorFormPage() {
    const [companyName, setCompanyName] = useState('');
    const [responsibleName, setResponsibleName] = useState('');
    const [email, setEmail] = useState('');
    const [wantsLogo, setWantsLogo] = useState(false);
    const [wantsBanner, setWantsBanner] = useState(false);
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [bannerFile, setBannerFile] = useState<File | null>(null);
    const [reason, setReason] = useState('');
    const { authToken } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!authToken) {
            alert("El token de autenticación es requerido");
            return;
        }

        try {
            let logoId: number | undefined;
            let bannerId: number | undefined;

            if (wantsLogo) {
                if (!logoFile) {
                    alert("Debe seleccionar un archivo para el logo.");
                    return;
                }
                logoId = await postMedia(logoFile, authToken);
            }
            const sponsorData = {
                organizationName: companyName,
                responsible: responsibleName,
                contact: email,
                reason,
                wantsLogo,
                wantsBanner,
                logoId,
                bannerId,
            };

            await createSponsor(authToken, sponsorData);
            alert("Solicitud enviada con éxito");

            // Limpiar formulario
            setCompanyName('');
            setResponsibleName('');
            setEmail('');
            setWantsLogo(false);
            setWantsBanner(false);
            setLogoFile(null);
            setBannerFile(null);
            setReason('');

        } catch (error) {
            console.error("Error al enviar solicitud:", error);
            alert("Error al enviar la solicitud");
        }
    };

    return (
        <div className="max-w-xl mx-auto p-6 mt-8 bg-white rounded-2xl font-roboto border-0 shadow-none">
            <form onSubmit={handleSubmit} className="space-y-6">
                <img src="/logo.png" alt="Adoptamena" className="mx-auto w-40 mb-4" />
                <p className="text-center text-sm text-gray-700">
                    Estás a un paso de convertirte en un <br />
                    auspiciante y ayudar a nuestra causa
                </p>

                <label>Nombre de la empresa</label>
                <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full p-2 rounded-md border-2 border-blue-500"
                    maxLength={30}
                    required
                />

                <label>Nombre del responsable</label>
                <input
                    type="text"
                    value={responsibleName}
                    onChange={(e) => setResponsibleName(e.target.value)}
                    className="w-full p-2 rounded-md border-2 border-blue-500"
                    maxLength={30}
                    required
                />

                <label>Correo</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 rounded-md border-2 border-blue-500"
                    maxLength={30}
                    required
                />

                <label>Razón por la cual quiere ser Auspiciante:</label>
                <input
                    type="text"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full p-2 rounded-md border-2 border-blue-500"
                    maxLength={200}
                    required
                />

                <label className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        checked={wantsLogo}
                        onChange={() => setWantsLogo(!wantsLogo)}
                    />
                    <span>Quiero que mi logo aparezca en la sección de Auspiciantes</span>
                </label>

                {wantsLogo && (
                    <div className="w-64 h-64 text-blue text-2xl rounded-xl border-2 border-blue-300 flex flex-col items-center justify-center mx-auto">
                        <label className="cursor-pointer block">
                            + Añadir logo
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setLogoFile(e.target.files?.[0] ?? null)}
                                className="hidden"
                            />
                        </label>
                    </div>
                )}

                <label className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        checked={wantsBanner}
                        onChange={() => setWantsBanner(!wantsBanner)}
                    />
                    <span>Quiero publicar un banner publicitario</span>
                </label>

                {wantsBanner && (
                    <div className="h-64 text-blue text-2xl rounded-xl border-2 border-blue-300 flex flex-col items-center justify-center">
                        <label className="cursor-pointer block">
                            + Añadir banner
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setBannerFile(e.target.files?.[0] ?? null)}
                                className="hidden"
                            />
                        </label>
                        <p className="text-sm text-gray-500 mt-2">Tamaño sugerido: 900x300 píxeles</p>
                    </div>
                )}

                <div className="flex flex-col justify-center gap-4 mt-6">
                    <button
                        type="submit"
                        className="bg-gradient-to-r from-purple-500 to-purple-600 text-white text-lg font-semibold py-3 px-8 rounded-xl shadow-sm hover:from-purple-600 hover:to-purple-700 transition-colors w-fit mx-auto"
                    >
                        Enviar solicitud
                    </button>

                    <Link
                        href="/dashboard"
                        className="w-fit px-6 border border-blue-600 text-blue-600 py-3 rounded-xl bg-transparent flex items-center justify-center mx-auto"
                    >
                        Ir a Inicio
                    </Link>
                </div>
            </form>
        </div>
    );
}
