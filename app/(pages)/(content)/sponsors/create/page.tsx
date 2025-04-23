'use client';

import { useState, useEffect } from 'react';
import { useAuth } from "@/contexts/auth-context";
import { createSponsor } from "@/utils/sponsor.http";
import { postMedia } from "@/utils/media.http";
import Image from 'next/image';
import { Alert } from "@material-tailwind/react";
import Modal from "@/components/modal";
import Button from "@/components/buttons/button";
import { useRouter } from 'next/navigation';

interface SponsorFormData {
    responsibleName: string;
    email: string;
    reason: string;
    wantsLogo: boolean;
    wantsBanner: boolean;
    logoId: number | null;
}

const initialFormState: SponsorFormData = {
    responsibleName: '',
    email: '',
    reason: '',
    wantsLogo: true,
    wantsBanner: false,
    logoId: null
};

export default function SponsorFormPage() {
    const [formData, setFormData] = useState<SponsorFormData>(initialFormState);
    const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(null);
    const [alertInfo, setAlertInfo] = useState<{
        open: boolean;
        color: "green" | "red" | "blue";
        message: string;
    } | null>(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const { authToken } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (alertInfo?.open) {
            const timer = setTimeout(() => {
                setAlertInfo(prev => prev ? { ...prev, open: false } : null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [alertInfo]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (name: string) => {
        setFormData(prev => ({ ...prev, [name]: !prev[name as keyof SponsorFormData] }));
    };

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !authToken) return;

        const allowedTypes = ["image/png", "image/jpeg", "image/webp"];
        if (!allowedTypes.includes(file.type)) {
            setAlertInfo({
                open: true,
                color: "red",
                message: "Tipo de archivo no permitido. Solo PNG, JPG y WEBP."
            });
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setAlertInfo({
                open: true,
                color: "red",
                message: "El archivo es demasiado grande. Máximo: 5MB."
            });
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await postMedia(formData, authToken);
            setFormData(prev => ({ ...prev, logoId: response.id }));
            setLogoPreviewUrl(response.url);
            setAlertInfo({
                open: true,
                color: "green",
                message: "Logo subido exitosamente"
            });
        } catch (error) {
            console.error("Error al subir logo", error);
            setAlertInfo({
                open: true,
                color: "red",
                message: "Error al subir el logo. Por favor, inténtalo de nuevo."
            });
        }
    };

    const handleRemoveLogo = () => {
        setFormData(prev => ({ ...prev, logoId: null }));
        setLogoPreviewUrl(null);
        setAlertInfo({
            open: true,
            color: "green",
            message: "Logo eliminado exitosamente"
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!authToken) {
            setAlertInfo({
                open: true,
                color: "red",
                message: "El token de autenticación es requerido"
            });
            return;
        }

        if (formData.wantsLogo && !formData.logoId) {
            setAlertInfo({
                open: true,
                color: "red",
                message: "Es necesario subir el logo de tu organización. Por favor, haz click en el botón '+ Añadir logo' y selecciona una imagen antes de continuar."
            });
            return;
        }

        if (!formData.logoId) {
            setAlertInfo({
                open: true,
                color: "red",
                message: "Para crear un auspiciante es necesario incluir un logo. Por favor, marca la casilla 'Quiero que mi logo aparezca en la sección de Auspiciantes' y sube una imagen."
            });
            return;
        }

        setIsSubmitting(true);
        try {
            const sponsorData = {
                contact: formData.email,
                reason: formData.reason,
                logoId: formData.logoId
            };

            await createSponsor(authToken, sponsorData);
            setShowSuccessModal(true);
            setFormData(initialFormState);
            setLogoPreviewUrl(null);

        } catch (error) {
            console.error("Error al enviar solicitud:", error);
            setAlertInfo({
                open: true,
                color: "red",
                message: "Error al enviar la solicitud. Por favor, inténtalo de nuevo."
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto p-6 mt-8 bg-white rounded-2xl font-roboto border-0 shadow-none">
            {alertInfo?.open && (
                <Alert
                    open={alertInfo.open}
                    color={alertInfo.color}
                    className={`mb-6 shadow-md font-medium border-l-4 ${
                        alertInfo.color === "red" 
                            ? "border-red-500" 
                            : alertInfo.color === "green" 
                                ? "border-green-500" 
                                : "border-blue-500"
                    }`}
                    onClose={() => setAlertInfo({ ...alertInfo, open: false })}
                >
                    {alertInfo.message}
                </Alert>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
                <img src="/logo.png" alt="Adoptamena" className="mx-auto w-40 mb-4" />
                <p className="text-center text-sm text-gray-700">
                    Estás a un paso de convertirte en un <br />
                    auspiciante y ayudar a nuestra causa
                </p>
                
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 text-blue-800 text-sm">
                    <p className="font-medium mb-1">Información importante:</p>
                    <p>Para completar tu solicitud de auspiciante, <span className="font-semibold">es obligatorio subir el logo de tu organización</span>. Este logo aparecerá en la sección de auspiciantes del sitio.</p>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block mb-1">Nombre del responsable</label>
                        <input
                            type="text"
                            name="responsibleName"
                            value={formData.responsibleName}
                            onChange={handleInputChange}
                            className="w-full p-2 rounded-md border-2 border-blue-500"
                            maxLength={100}
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-1">Correo</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full p-2 rounded-md border-2 border-blue-500"
                            maxLength={100}
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-1">Razón por la cual quiere ser Auspiciante:</label>
                        <textarea
                            name="reason"
                            value={formData.reason}
                            onChange={handleInputChange}
                            className="w-full p-2 rounded-md border-2 border-blue-500 min-h-[100px] resize-y"
                            maxLength={255}
                            required
                            placeholder="Escribe aquí tu razón para ser auspiciante..."
                        />
                        <div className="text-sm text-gray-500 text-right">
                            {formData.reason.length}/255 caracteres
                        </div>
                    </div>

                    <label className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            checked={formData.wantsLogo}
                            onChange={() => handleCheckboxChange('wantsLogo')}
                        />
                        <span>Quiero que mi logo aparezca en la sección de Auspiciantes</span>
                    </label>
                    
                    {formData.wantsLogo && (
                        <>
                            <p className="text-sm text-blue-600 italic mb-2 text-center">
                                Para continuar debes subir el logo de tu organización haciendo click en el cuadro de abajo
                            </p>
                            <div className="w-64 h-64 text-blue text-2xl rounded-xl border-2 border-blue-300 flex flex-col items-center justify-center mx-auto relative">
                                {logoPreviewUrl ? (
                                    <>
                                        <div className="relative w-full h-full">
                                            <Image 
                                                src={logoPreviewUrl} 
                                                alt="Logo preview" 
                                                fill
                                                className="object-contain"
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleRemoveLogo}
                                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </>
                                ) : (
                                    <label className="cursor-pointer flex flex-col items-center justify-center">
                                        <div className="bg-blue-100 hover:bg-blue-200 text-blue-600 font-medium py-2 px-4 rounded-lg transition-colors">
                                            + Añadir logo
                                        </div>
                                        <p className="text-sm text-gray-500 mt-2">
                                            Haz clic para seleccionar una imagen
                                        </p>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleLogoUpload}
                                            className="hidden"
                                        />
                                    </label>
                                )}
                            </div>
                        </>
                    )}

                    <label className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            checked={formData.wantsBanner}
                            onChange={() => handleCheckboxChange('wantsBanner')}
                        />
                        <span>Quiero publicar un banner publicitario</span>
                    </label>

                    {formData.wantsBanner && (
                        <div className="h-64 text-blue text-2xl rounded-xl border-2 border-blue-300 flex flex-col items-center justify-center">
                            <label className="cursor-pointer block">
                                + Añadir banner
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                />
                            </label>
                            <p className="text-sm text-gray-500 mt-2">Tamaño sugerido: 900x300 píxeles</p>
                        </div>
                    )}

                    <div className="flex flex-col justify-center gap-4 mt-6">
                        <Button
                            type="submit"
                            variant="cta"
                            size="lg"
                            className="w-fit mx-auto"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Enviando..." : "Enviar solicitud"}
                        </Button>

                        <Button
                            variant="secondary"
                            size="lg"
                            className="w-fit mx-auto"
                            onClick={() => router.push('/dashboard')}
                        >
                            Ir a Inicio
                        </Button>
                    </div>
                </div>
            </form>

            <Modal isOpen={showSuccessModal} onClose={() => setShowSuccessModal(false)}>
                <div className="flex flex-col items-center justify-center p-6">
                    <img src="/logo.png" alt="Adoptamena" className="w-40 mb-6" />
                    <h2 className="text-2xl font-semibold text-center mb-4">¡Tu solicitud se envió con éxito!</h2>
                    <p className="text-gray-600 text-center mb-6">
                        Cuando un administrador revise tu solicitud, te notificaremos por correo electrónico.
                    </p>
                    <Button
                        variant="secondary"
                        size="lg"
                        onClick={() => {
                            setShowSuccessModal(false);
                            router.push('/dashboard');
                        }}
                    >
                        Ir a Inicio
                    </Button>
                </div>
            </Modal>
        </div>
    );
}
