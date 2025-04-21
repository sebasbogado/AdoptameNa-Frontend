'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { createSponsor } from "@/utils/sponsorsCreate.http";
import { postMedia } from "@/utils/media.http"
export default function SponsorFormPage() {
    const [companyName, setCompanyName] = useState('');
    const [responsibleName, setResponsibleName] = useState('');
    const [email, setEmail] = useState('');
    const [wantsLogo, setWantsLogo] = useState(false);
    const [wantsBanner, setWantsBanner] = useState(false);
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [bannerFile, setBannerFile] = useState<File | null>(null);
    const [reason, setReason] = useState('');
    const { authToken, user } = useAuth();
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [bannerPreview, setBannerPreview] = useState<string | null>(null);
    const [logoId, setLogoId] = useState<number | null>(null);
    console.log(user?.role);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('email', email);
        formData.append('wantsLogo', wantsLogo.toString());
        formData.append('wantsBanner', wantsBanner.toString());
        formData.append('reason', reason);
        if (!authToken) {
            throw new Error("El token de autenticación es requerido");
        }
        try {
            const sponsorData = {
                reason,
                contact: email,
                logoId: logoId ?? undefined, // si no está cargado, se omite
            };

            await createSponsor(authToken, sponsorData);
            alert("Solicitud enviada con éxito");
            // Limpiar todos los campos
            setCompanyName('');
            setResponsibleName('');
            setEmail('');
            setWantsLogo(false);
            setWantsBanner(false);
            setLogoFile(null);
            setBannerFile(null);
            setReason('');
            setLogoPreview(null);
            setBannerPreview(null);
            setLogoId(null);


        } catch (error) {
            console.error("Error al enviar solicitud:", error);
            alert("Error al enviar la solicitud");
        }

    };
    const handleSubmitMedia = async () => {
        if (!authToken) {
            alert("el Token de autenticacion es requerido");
            return;
        }

        if (wantsLogo && logoFile) {
            try {
                const uploadedId = await postMedia(logoFile, authToken);
                setLogoId(uploadedId);
            } catch (error) {
                console.error("Error al subir el logo:", error);
                alert("Error al subir el logo");
            }
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
                <br />
                <label>Nombre de la empresa</label>
                <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full p-2 rounded-md border-2 border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    maxLength={30}
                    required
                />
                <br />
                <br />
                <label>Nombre del responsable</label>
                <input
                    type="text"
                    value={responsibleName}
                    onChange={(e) => setResponsibleName(e.target.value)}
                    className="w-full p-2 rounded-md border-2 border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    maxLength={30}
                    required
                />
                <br />
                <br />
                <label>Correo</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 rounded-md border-2 border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    maxLength={30}
                    required
                />
                <br />
                <br />
                <label>Razón por la cual quiere ser Auspiciante</label>
                <input
                    type="text"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full p-2 rounded-md border-2 border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
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
                    <div className="w-64 h-[16rem] text-blue text-2xl rounded-xl overflow-hidden  border-2 border-[rgb(158,189,255)] hover:shadow-md hover:shadow-[rgb(185,207,255)]  flex flex-col relative items-center justify-center mx-auto">
                        <label className="cursor-pointer block">
                            + Añadir logo
                            <input
                                type="file"
                                accept="image/*"
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
                    <div className="h-[16rem] text-blue text-2xl rounded-xl overflow-hidden  border-2 border-[rgb(158,189,255)] hover:shadow-md hover:shadow-[rgb(185,207,255)]  flex flex-col relative items-center justify-center">
                        <label className="cursor-pointer block">
                            + Añadir banner
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0] ?? null;
                                    setBannerFile(file);
                                    if (file) {
                                        setBannerPreview(URL.createObjectURL(file));
                                    }
                                }}
                                className="hidden"
                            />

                        </label>
                        <p className="text-sm text-gray-500 mt-2">Tamaño sugerido: 900x300 píxeles</p>
                    </div>
                )}

                <div className="flex flex-col justify-center gap-4 mt-6">
                    {/* Botón primario */}
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
