'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from "@/contexts/auth-context";
import Loading from "@/app/loading";
import NotFound from "@/app/not-found";
import { Sponsor } from '@/types/sponsor';
import { getSponsorById, updateSponsor, deleteSponsor } from '@/utils/sponsor.http';
import Image from 'next/image';
import { User, Mail } from 'lucide-react';
import EditButton from "@/components/buttons/edit-button";
import Button from "@/components/buttons/button";
import BannerImage from '@/components/banner/banner-image';
import { postMedia } from '@/utils/media.http';
import { fileSchema } from '@/utils/file-schema';
import { ConfirmationModal } from '@/components/form/modal';

const ALLOWED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/webp"];

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
    const [isEditing, setIsEditing] = useState(false);
    const [editReason, setEditReason] = useState('');
    const [editContact, setEditContact] = useState('');
    const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(null);
    const [bannerPreviewUrl, setBannerPreviewUrl] = useState<string | null>(null);
    const [bannerResetKey, setBannerResetKey] = useState(0);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [formErrors, setFormErrors] = useState<{ reason?: string; contact?: string; logo?: string; banner?: string }>({});
    const [bannerWasLoaded, setBannerWasLoaded] = useState(false);

    useEffect(() => {
        if (!authToken || !params.id) {
            setError(true);
            return;
        }

        const fetchSponsor = async () => {
            try {
                const sponsorData = await getSponsorById(authToken, Number(params.id));
                setSponsor(sponsorData);
                setEditReason(sponsorData.reason || '');
                setEditContact(sponsorData.contact || '');
                setLogoPreviewUrl(sponsorData.logoUrl || null);
                setBannerPreviewUrl(sponsorData.bannerUrl || null);
                setBannerWasLoaded(!!sponsorData.bannerUrl);
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
            if (sponsor) {
                setSponsor({ ...sponsor, logoId: response.id });
            }
            setLogoPreviewUrl(response.url);
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
        if (sponsor) {
            setSponsor({ ...sponsor, logoId: null });
        }
        setLogoPreviewUrl(null);
    };

    const handleEditClick = () => {
        if (sponsor) {
            setEditReason(sponsor.reason || '');
            setEditContact(sponsor.contact || '');
            setIsEditing((prev) => !prev);
        }
    };

    const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Validación
        const errors: { reason?: string; contact?: string; logo?: string; banner?: string } = {};
        if (!editReason.trim()) errors.reason = 'La razón es obligatoria';
        if (!editContact.trim()) errors.contact = 'El contacto es obligatorio';
        if (!logoPreviewUrl) errors.logo = 'El logo es obligatorio';
        // Solo validar el banner si ya existía uno previamente
        if (bannerWasLoaded && !bannerPreviewUrl) errors.banner = 'El banner es obligatorio';
        setFormErrors(errors);
        if (Object.keys(errors).length > 0) return;
        setShowSaveModal(true);
    };

    const confirmSave = async () => {
        if (!sponsor || !authToken) return;
        try {
            const updatedSponsor = await updateSponsor(authToken, sponsor.id, {
                reason: editReason,
                contact: editContact,
                logoId: sponsor.logoId ?? 0,
                bannerId: sponsor.bannerId ?? undefined,
            });
            setIsEditing(false);
            setSponsor(updatedSponsor);
            setLogoPreviewUrl(updatedSponsor.logoUrl || null);
            setBannerPreviewUrl(updatedSponsor.bannerUrl || null);
            setAlertInfo({ open: true, color: 'green', message: 'Solicitud actualizada correctamente.' });
        } catch (error) {
            setAlertInfo({ open: true, color: 'red', message: 'Error al actualizar la solicitud.' });
        } finally {
            setShowSaveModal(false);
        }
    };

    const handleDelete = async () => {
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!authToken || !sponsor) return;
        try {
            await deleteSponsor(authToken, sponsor.id);
            router.push('/profile/received-request/sponsors');
        } catch (error) {
            setAlertInfo({ open: true, color: 'red', message: 'Error al eliminar la solicitud.' });
        } finally {
            setShowDeleteModal(false);
        }
    };

    const handleBannerUpload = (imageData: { id: number; url: string }) => {
        if (sponsor) {
            setSponsor({ ...sponsor, bannerId: imageData.id });
        }
        setBannerPreviewUrl(imageData.url);
        setBannerWasLoaded(true);
    };

    const handleRemoveBanner = () => {
        if (sponsor) {
            setSponsor({ ...sponsor, bannerId: null });
        }
        setBannerPreviewUrl(null);
        setBannerResetKey(prev => prev + 1);
    };

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
                    {(sponsor?.status === 'PENDING' || (sponsor?.isActive === undefined && !sponsor?.status)) && (
                        <EditButton
                            isEditing={isEditing}
                            onClick={handleEditClick}
                            className="ml-4"
                        />
                    )}
                </div>

                <div className={`mx-auto inline-block px-4 py-2 rounded-full border text-base font-medium mb-6 ${statusColor}`}>{statusLabel}</div>

                <div className="bg-white rounded-2xl shadow p-10 min-h-[500px] flex flex-col items-center space-y-6">
                    <h3 className="text-xl font-bold mb-2 text-center">{sponsor?.organizationName || sponsor?.fullName}</h3>
                    {isEditing ? (
                        <form onSubmit={handleEditSubmit} className="w-full">
                            <div className="space-y-4 w-full">
                                <div className="space-y-2">
                                    <label htmlFor="reason" className={`block text-sm font-medium ${formErrors.reason ? 'text-red-600' : 'text-gray-700'}`}>Razón del auspicio</label>
                                    <input
                                        id="reason"
                                        type="text"
                                        value={editReason}
                                        onChange={e => { setEditReason(e.target.value); setFormErrors(f => ({ ...f, reason: undefined })); }}
                                        className={`w-full p-2 border rounded ${formErrors.reason ? 'border-red-500' : ''}`}
                                        placeholder="Ingrese la razón del auspicio"
                                    />
                                    {formErrors.reason && <p className="text-red-600 text-sm mt-1">{formErrors.reason}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="contact" className={`block text-sm font-medium ${formErrors.contact ? 'text-red-600' : 'text-gray-700'}`}>Información de contacto</label>
                                    <input
                                        id="contact"
                                        type="text"
                                        value={editContact}
                                        onChange={e => { setEditContact(e.target.value); setFormErrors(f => ({ ...f, contact: undefined })); }}
                                        className={`w-full p-2 border rounded ${formErrors.contact ? 'border-red-500' : ''}`}
                                        placeholder="Ingrese la información de contacto"
                                    />
                                    {formErrors.contact && <p className="text-red-600 text-sm mt-1">{formErrors.contact}</p>}
                                </div>
                            </div>

                            <div className="w-full max-w-xs mx-auto mt-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Logo de tu organización
                                </label>
                                <div className={`w-64 h-64 text-blue text-2xl rounded-xl border-2 flex flex-col items-center justify-center mx-auto relative ${formErrors.logo ? 'border-red-500' : 'border-blue-300'}`}>
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
                                        <label className="cursor-pointer flex flex-col items-center justify-center w-full h-full">
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
                                {formErrors.logo && <p className="text-red-600 text-sm mt-1 text-center">{formErrors.logo}</p>}
                            </div>

                            <div className="w-full max-w-xs mx-auto">
                                {bannerWasLoaded && (
                                    <>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Banner publicitario
                                        </label>
                                        <p className="text-sm text-blue-600 italic mb-2 text-center">
                                            Tamaño recomendado: 900x300 píxeles
                                        </p>
                                        {bannerPreviewUrl ? (
                                            <div className="flex justify-center mb-4">
                                                <div className={`relative bg-blue-50 border-2 rounded-xl flex items-center justify-center ${formErrors.banner ? 'border-red-500' : 'border-blue-300'}`} style={{ width: 400, height: 133, maxWidth: '100%' }}>
                                                    <Image
                                                        src={bannerPreviewUrl}
                                                        alt="Banner publicitario"
                                                        width={400}
                                                        height={133}
                                                        className="object-contain rounded-xl"
                                                        style={{ maxWidth: '100%', maxHeight: '100%' }}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={handleRemoveBanner}
                                                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <BannerImage
                                                onImageUploaded={handleBannerUpload}
                                                initialImage={bannerPreviewUrl || undefined}
                                                token={authToken || ''}
                                                resetKey={bannerResetKey}
                                            />
                                        )}
                                        {formErrors.banner && <p className="text-red-600 text-sm mt-1 text-center">{formErrors.banner}</p>}
                                    </>
                                )}
                            </div>

                            <div className="flex flex-row justify-center gap-6 mt-8">
                                <Button type="button" variant="danger" onClick={handleDelete}>Eliminar solicitud</Button>
                                <Button type="button" variant="secondary" onClick={() => setIsEditing(false)}>Cancelar</Button>
                                <Button type="submit" variant="cta">Guardar cambios</Button>
                            </div>
                        </form>
                    ) : (
                        <>
                            <div className="flex flex-col gap-3 mb-2 text-gray-700 text-base items-start text-left w-full max-w-xs mx-auto">
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
                                {sponsor?.reason && (
                                    <div className="flex flex-col gap-1 w-full">
                                        <span className="font-medium">Razón del auspicio:</span>
                                        <p className="text-sm text-gray-600">{sponsor.reason}</p>
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
                                    <div className="font-medium mb-2 mt-4 text-center">Banner Publicitario</div>
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
                        </>
                    )}
                </div>
            </div>
            <ConfirmationModal
                isOpen={showDeleteModal}
                title="Eliminar Solicitud"
                message="¿Estás seguro de que deseas eliminar esta solicitud? Esta acción no se puede deshacer."
                textConfirm="Eliminar"
                confirmVariant="danger"
                onClose={() => setShowDeleteModal(false)}
                onConfirm={confirmDelete}
            />
            <ConfirmationModal
                isOpen={showSaveModal}
                title="Guardar Cambios"
                message="¿Estás seguro de que deseas guardar los cambios en esta solicitud?"
                textConfirm="Guardar"
                confirmVariant="cta"
                onClose={() => setShowSaveModal(false)}
                onConfirm={confirmSave}
            />
        </div>
    );
} 