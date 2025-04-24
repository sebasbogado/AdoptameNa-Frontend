'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { Upload, X, Loader2, Calendar, Check, Power, RadioTower, ArrowUp, } from 'lucide-react';
import { Alert } from '@material-tailwind/react';
import { createBanner, updateBanner } from '@/utils/banner.http';
import BannerImage from './banner-image';
import { BannerForm as BannerFormType, bannerSchema } from '@/validations/banner-schema';
import { useAuth } from '@/contexts/auth-context';
import Loading from '@/app/loading';
import { ActiveSponsor, Sponsor } from '@/types/sponsor';
import { getActiveSponsors } from '@/utils/sponsor.http';
import { Banner } from '@/types/banner';

interface BannerFormProps {
    banner?: Banner;
}

export default function BannerForm({ banner }: BannerFormProps) {
    const { authToken, loading } = useAuth();
    const router = useRouter();

    if (loading) return <Loading />;
    if (!authToken) {
        router.push('/login');
        return <Loading />;
    }

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadedImage, setUploadedImage] = useState<{ id: number; url: string } | null>(
        banner?.media.id ? { id: banner.media.id, url: banner.media.url } : null
    );
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [imageSourceType, setImageSourceType] = useState<'upload' | 'sponsor'>(
        banner ? 'upload' : 'upload'
    );
    const [sponsorImages, setSponsorImages] = useState<ActiveSponsor[]>([]);
    const [alertInfo, setAlertInfo] = useState<{
        open: boolean;
        color: "green" | "red" | "blue";
        message: string;
    } | null>(null);

    useEffect(() => {
        if (alertInfo?.open) {
            const timer = setTimeout(() => {
                setAlertInfo(prev => prev ? { ...prev, open: false } : null);
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [alertInfo]);

    const [minEndDate, setMinEndDate] = useState<Date>(() => {
        const startDate = banner?.startDate ? new Date(banner.startDate) : new Date();
        const nextDay = new Date(startDate);
        nextDay.setDate(nextDay.getDate() + 1);
        return nextDay;
    });

    useEffect(() => {
        const fetchSponsorImages = async () => {
            try {
                const response = await getActiveSponsors();
                setSponsorImages(response.data);
            } catch (error) {
                console.error('Error fetching sponsor images:', error);
            }
        };

        fetchSponsorImages();
    }, []);

    const getInitialStartDate = () => {
        if (banner?.startDate) {
            return new Date(banner.startDate);
        }
        return new Date();
    };

    const getInitialEndDate = () => {
        if (banner?.endDate) {
            return new Date(banner.endDate);
        }
        const defaultDate = new Date();
        defaultDate.setDate(defaultDate.getDate() + 7);
        return defaultDate;
    };

    const form = useForm<BannerFormType>({
        resolver: zodResolver(
            bannerSchema.refine(
                (data) => {
                    return data.endDate > data.startDate;
                },
                {
                    message: "La fecha de finalización debe ser posterior a la fecha de inicio",
                    path: ["endDate"],
                }
            )
        ),
        defaultValues: {
            startDate: getInitialStartDate(),
            endDate: getInitialEndDate(),
            imageId: banner?.media.id || 0,
            priority: banner?.priority || 0,
            isActive: banner?.isActive ?? true,
        },
    });

    const { register, handleSubmit, formState, setValue, watch, getValues } = form;
    const startDate = watch('startDate');

    useEffect(() => {
        if (startDate) {
            const newMinEndDate = new Date(startDate);
            newMinEndDate.setDate(newMinEndDate.getDate() + 1);
            setMinEndDate(newMinEndDate);

            const currentEndDate = getValues('endDate');
            if (currentEndDate && currentEndDate < newMinEndDate) {
                setValue('endDate', newMinEndDate);
            }
        }
    }, [startDate, setValue, getValues]);

    const onSubmit = async (values: BannerFormType) => {
        if (!uploadedImage?.id) {
            setAlertInfo({
                open: true,
                color: "red",
                message: "Por favor, sube o selecciona una imagen para el banner"
            });
            return;
        }

        setIsSubmitting(true);

        try {
            values.imageId = uploadedImage.id;

            if (banner) {
                await updateBanner(banner.id, values, authToken);
                setAlertInfo({
                    open: true,
                    color: "green",
                    message: "Banner actualizado con éxito"
                });
            } else {
                await createBanner(values, authToken);
                setAlertInfo({
                    open: true,
                    color: "green",
                    message: "Banner creado con éxito"
                });
            }

            setTimeout(() => {
                router.push('/administration/settings/banner');
            }, 1500);
        } catch (error) {
            console.error('Error al guardar el banner:', error);
            setAlertInfo({
                open: true,
                color: "red",
                message: "Error al guardar el banner. Por favor, inténtalo de nuevo."
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleImageUpload = (imageData: { id: number; url: string }) => {
        setUploadedImage(imageData);
        setValue('imageId', imageData.id);
    };

    const handleSelectSponsorImage = (image: { id: number; url: string }) => {
        setUploadedImage(image);
        setValue('imageId', image.id);
    };


    const formatDateToInputValue = (date: Date) => {
        return date.toISOString().split('T')[0];
    };

    return (
        <div className="bg-white p-6 border rounded-lg shadow-sm">
            {alertInfo && alertInfo.open && (
                <Alert
                    open={alertInfo.open}
                    color={alertInfo.color}
                    className="mb-4"
                    onClose={() => setAlertInfo({ ...alertInfo, open: false })}
                >
                    {alertInfo.message}
                </Alert>
            )}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label className="block mb-2 font-medium">Fuente de la imagen</label>
                        <div className="flex space-x-4 mb-4">
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="imageSource"
                                    value="upload"
                                    checked={imageSourceType === 'upload'}
                                    onChange={() => setImageSourceType('upload')}
                                    className="mr-2"
                                />
                                <Upload size={16} className="mr-1" />
                                Subir imagen
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="imageSource"
                                    value="sponsor"
                                    checked={imageSourceType === 'sponsor'}
                                    onChange={() => setImageSourceType('sponsor')}
                                    className="mr-2"
                                />
                                <RadioTower size={16} className="mr-1" />
                                Seleccionar de patrocinador
                            </label>
                        </div>

                        {imageSourceType === 'upload' ? (
                            <BannerImage
                                onImageUploaded={handleImageUpload}
                                initialImage={uploadedImage?.url}
                                token={authToken}
                            />
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {sponsorImages.map((image) => (
                                    <div
                                        key={image.id}
                                        className={`border rounded-lg overflow-hidden cursor-pointer transition-all ${uploadedImage?.id === image.bannerId ? 'ring-2 ring-purple-500' : 'hover:shadow-md'
                                            }`}
                                        onClick={() => handleSelectSponsorImage({ id: image.bannerId, url: image.bannerUrl })}
                                    >
                                        <div className="relative h-40">
                                            <Image
                                                src={image.logoUrl}
                                                alt={image.organizationName}
                                                fill
                                                className="object-cover"
                                                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                                            />
                                        </div>
                                        <div className="p-2 text-center">
                                            <p className="text-sm font-medium">{image.organizationName}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {errors.imageId && (
                            <p className="text-red-500 text-sm mt-2">{errors.imageId}</p>
                        )}
                        {formState.errors.imageId && (
                            <p className="text-red-500 text-sm mt-2">{String(formState.errors.imageId.message)}</p>
                        )}
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="startDate" className="font-medium mb-1 flex items-center">
                            <Calendar size={16} className="mr-2" />
                            Fecha de inicio
                        </label>
                        <input
                            type="date"
                            id="startDate"
                            {...register('startDate', {
                                valueAsDate: true,
                                required: 'La fecha de inicio es obligatoria',
                            })}
                            className="border rounded-md p-2"
                            value={watch('startDate')?.toISOString().split('T')[0]}
                        />
                        {formState.errors.startDate && (
                            <p className="text-red-500 text-sm mt-1">{String(formState.errors.startDate.message)}</p>
                        )}
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="endDate" className="font-medium mb-1 flex items-center">
                            <Calendar size={16} className="mr-2" />
                            Fecha de finalización
                        </label>
                        <input
                            type="date"
                            id="endDate"
                            min={formatDateToInputValue(minEndDate)}
                            {...register('endDate', {
                                valueAsDate: true,
                                required: 'La fecha de finalización es obligatoria'
                            })}
                            className="border rounded-md p-2"
                            value={watch('endDate')?.toISOString().split('T')[0]}
                        />
                        {formState.errors.endDate && (
                            <p className="text-red-500 text-sm mt-1">{String(formState.errors.endDate.message)}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="priority" className="font-medium mb-1 flex items-center">
                            <ArrowUp size={16} className="mr-2" />
                            Prioridad
                        </label>
                        <input
                            type="number"
                            id="priority"
                            {...register('priority', {
                                valueAsNumber: true,
                                min: { value: 0, message: 'La prioridad mínima es 0' },
                                max: { value: 100, message: 'La prioridad máxima es 100' }
                            })}
                            className="border rounded-md p-2 w-full"
                            min={0}
                            max={100}
                            defaultValue={banner?.priority || 0}
                        />
                        <p className="text-gray-500 text-sm mt-1">
                            Números más altos aparecen primero (0-100)
                        </p>
                        {formState.errors.priority && (
                            <p className="text-red-500 text-sm mt-1">{String(formState.errors.priority.message)}</p>
                        )}
                    </div>

                    <div className="flex flex-row items-center justify-between p-4 border rounded-md">
                        <div>
                            <label htmlFor="isActive" className="font-medium flex items-center">
                                <Power size={16} className="mr-2" />
                                Estado activo
                            </label>
                            <p className="text-gray-500 text-sm">
                                El banner será visible para los usuarios si está activo
                            </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                {...register('isActive')}
                                className="sr-only peer"
                                defaultChecked={banner?.isActive ?? true}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                        </label>
                    </div>
                </div>

                <div className="flex justify-end gap-4">
                    <button
                        type="button"
                        className="px-4 py-2 border rounded-md hover:bg-gray-50 flex items-center"
                        onClick={() => router.push('/administration/settings/banner')}
                        disabled={isSubmitting}
                    >
                        <X size={16} className="mr-2" />
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 flex items-center"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <Loader2 size={16} className="mr-2 animate-spin" />
                        ) : (
                            <Check size={16} className="mr-2" />
                        )}
                        {banner ? 'Actualizar Banner' : 'Crear Banner'}
                    </button>
                </div>
            </form>
        </div>
    );
}