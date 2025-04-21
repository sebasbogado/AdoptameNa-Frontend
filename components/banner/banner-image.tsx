'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Alert } from '@material-tailwind/react';
import { postMedia } from '@/utils/media.http';
import { Upload, ImageIcon, X, Loader2, Plus } from 'lucide-react';

interface ImageUploadProps {
    onImageUploaded: (imageData: { id: number; url: string }) => void;
    initialImage?: string;
    token: string;
}

export default function BannerImage({ onImageUploaded, initialImage, token }: ImageUploadProps) {
    const [image, setImage] = useState<string | null>(initialImage || null);
    const [uploading, setUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
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

    const handleImageUpload = async (file: File) => {
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            setAlertInfo({
                open: true,
                color: "red",
                message: "Por favor, selecciona un archivo de imagen"
            });
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setAlertInfo({
                open: true,
                color: "red",
                message: "El tamaño de la imagen debe ser menor a 5MB"
            });
            return;
        }

        setUploading(true);

        try {
            const formData = new FormData();
            formData.append('file', file);

            const uploadedImage = await postMedia(formData, token);

            setImage(uploadedImage.url);
            onImageUploaded({ id: uploadedImage.id, url: uploadedImage.url });

            setAlertInfo({
                open: true,
                color: "green",
                message: "Imagen subida con éxito"
            });
        } catch (error: any) {
            console.error('Error al subir la imagen:', error);
            setAlertInfo({
                open: true,
                color: "red",
                message: `Error al subir la imagen. Por favor, inténtalo de nuevo. ${error.message}`
            });
        } finally {
            setUploading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleImageUpload(e.target.files[0]);
        }
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleImageUpload(e.dataTransfer.files[0]);
        }
    };

    const removeImage = () => {
        setImage(null);
        onImageUploaded({ id: 0, url: '' });
    };

    return (
        <div className="w-full">
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

            {image ? (
                <div className="relative overflow-hidden h-[300px] border rounded-lg">
                    <Image
                        src={image}
                        alt="Uploaded banner image"
                        fill
                        className="object-cover"
                    />
                    <div className="absolute top-2 right-2 flex gap-2">
                        <button
                            type="button"
                            className="p-2 bg-red-500 text-white rounded-full flex items-center justify-center"
                            onClick={removeImage}
                        >
                            <X size={16} />
                        </button>
                        <label className="cursor-pointer">
                            <div className="p-2 bg-gray-200 rounded-full flex items-center justify-center">
                                <ImageIcon size={16} />
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileChange}
                                disabled={uploading}
                            />
                        </label>
                    </div>
                </div>
            ) : (
                <div
                    className={`border-2 border-dashed rounded-lg p-12 transition-all flex flex-col items-center justify-center h-[300px] ${dragActive ? "border-purple-500 bg-purple-50" : "border-gray-300"
                        } ${uploading ? "opacity-50 cursor-not-allowed" : ""}`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById('file-upload')?.click()}
                    style={{ cursor: 'pointer' }}
                >
                    {uploading ? (
                        <>
                            <Loader2 size={40} className="mb-4 text-purple-500 animate-spin" />
                        </>
                    ) : (
                        <>
                            <Upload size={40} className="mb-4 text-gray-500" />
                            <p className="text-gray-500">Arrastra y suelta una imagen aquí o haz clic para seleccionar una</p>
                            <input
                                id="file-upload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileChange}
                                disabled={uploading}
                            />
                        </>
                    )}
                </div>
            )}
        </div>
    );
}