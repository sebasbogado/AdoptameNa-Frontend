'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from "@/contexts/auth-context";
import { createSponsor } from "@/utils/sponsor.http";
import { postMedia } from "@/utils/media.http";
import Image from 'next/image';
import { Alert } from "@material-tailwind/react";
import Modal from "@/components/modal";
import Button from "@/components/buttons/button";
import { useRouter } from 'next/navigation';
import BannerImage from '@/components/banner/banner-image';
import { fileSchema } from '@/utils/file-schema';

interface SponsorFormData {
    responsibleName: string;
    email: string;
    reason: string;
    logoId: number | null;
    bannerId: number | null;
}

const initialFormState: SponsorFormData = {
    responsibleName: '',
    email: '',
    reason: '',
    logoId: null,
    bannerId: null
};

const ALLOWED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/webp"];

export default function SponsorFormPage() {
    const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<SponsorFormData>({
        defaultValues: initialFormState
    });
    const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(null);
    const [bannerPreviewUrl, setBannerPreviewUrl] = useState<string | null>(null);
    const [alertInfo, setAlertInfo] = useState<{
        open: boolean;
        color: "green" | "red" | "blue";
        message: string;
    } | null>(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showLogoError, setShowLogoError] = useState(false);
    
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

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !authToken) return;

        const result = fileSchema.safeParse(file);

        if (!result.success) {
            setAlertInfo({
                open: true,
                color: "red",
                message: result.error.errors[0].message
            });
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await postMedia(formData, authToken);
            setValue('logoId', response.id);
            setLogoPreviewUrl(response.url);
            setShowLogoError(false);
        } catch (error) {
            console.error("Error al subir logo", error);
            setAlertInfo({
                open: true,
                color: "red",
                message: "Error al subir el logo. Por favor, inténtalo de nuevo."
            });
        }
    };

    const handleBannerUpload = (imageData: { id: number; url: string }) => {
        setValue('bannerId', imageData.id);
        setBannerPreviewUrl(imageData.url);
    };

    const handleRemoveLogo = () => {
        setValue('logoId', null);
        setLogoPreviewUrl(null);
    };

    const handleRemoveBanner = () => {
        setValue('bannerId', null);
        setBannerPreviewUrl(null);
    };

    const onSubmit = async (data: SponsorFormData) => {
        if (!authToken) {
            setAlertInfo({
                open: true,
                color: "red",
                message: "El token de autenticación es requerido"
            });
            return;
        }

        if (!data.logoId) {
            setAlertInfo({
                open: true,
                color: "red",
                message: "Debes subir el logo de tu organización para continuar"
            });
            setShowLogoError(true);
            return;
        }

        setIsSubmitting(true);
        try {
            const sponsorData = {
                contact: data.email,
                reason: data.reason,
                logoId: data.logoId,
                bannerId: data.bannerId || undefined
            };

            await createSponsor(authToken, sponsorData);
            setShowSuccessModal(true);
            setLogoPreviewUrl(null);
            setBannerPreviewUrl(null);
            setShowLogoError(false);

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
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <img src="/logo.png" alt="Adoptamena" className="mx-auto w-40 mb-4" />
                <p className="text-center text-sm text-gray-700">
                    Estás a un paso de convertirte en un <br />
                    auspiciante y ayudar a nuestra causa
                </p>
                
                <div className="space-y-4">
                    <div>
                        <label className="block mb-1">Nombre del responsable</label>
                        <input
                            type="text"
                            {...register('responsibleName', { required: 'El nombre es requerido' })}
                            className={`w-full p-2 rounded-md border-2 ${
                                errors.responsibleName ? 'border-red-500' : 'border-blue-500'
                            }`}
                            maxLength={100}
                        />
                        {errors.responsibleName && (
                            <p className="text-red-500 text-sm mt-1">{errors.responsibleName.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block mb-1">Correo</label>
                        <input
                            type="email"
                            {...register('email', { 
                                required: 'El correo es requerido',
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: 'Correo electrónico inválido'
                                }
                            })}
                            className={`w-full p-2 rounded-md border-2 ${
                                errors.email ? 'border-red-500' : 'border-blue-500'
                            }`}
                            maxLength={100}
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block mb-1">Razón por la cual quiere ser Auspiciante:</label>
                        <textarea
                            {...register('reason', { required: 'La razón es requerida' })}
                            className={`w-full p-2 rounded-md border-2 ${
                                errors.reason ? 'border-red-500' : 'border-blue-500'
                            } min-h-[100px] resize-y`}
                            maxLength={255}
                            placeholder="Escribe aquí tu razón para ser auspiciante..."
                        />
                        <div className="text-sm text-gray-500 text-right">
                            {watch('reason')?.length || 0}/255 caracteres
                        </div>
                        {errors.reason && (
                            <p className="text-red-500 text-sm mt-1">{errors.reason.message}</p>
                        )}
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block mb-1">
                                Logo de tu organización
                            </label>
                            <p className={`text-sm ${showLogoError ? 'text-red-600' : 'text-blue-600'} italic mb-2 text-center`}>
                                Sube el logo de tu organización haciendo click en el cuadro de abajo
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
                                            accept={ALLOWED_IMAGE_TYPES.join(',')}
                                            onChange={handleLogoUpload}
                                            className="hidden"
                                        />
                                    </label>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block mb-1">
                                Banner publicitario
                            </label>
                            <p className="text-sm text-blue-600 italic mb-2 text-center">
                                Tamaño recomendado: 900x300 píxeles
                            </p>
                            <BannerImage
                                onImageUploaded={handleBannerUpload}
                                initialImage={bannerPreviewUrl || undefined}
                                token={authToken || ''}
                            />
                        </div>
                    </div>

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
