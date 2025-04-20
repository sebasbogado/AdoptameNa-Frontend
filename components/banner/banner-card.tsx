'use client';

import { Banner } from '@/types/banner';
import { Calendar, Pencil, Power, PowerOff, Trash2 } from 'lucide-react';
import Image from 'next/image';

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
};

interface BannerCardProps {
    banner: Banner
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
    onActivate: (id: number) => void;
    onDeactivate: (id: number) => void;
}

export default function BannerCard({
    banner,
    onEdit,
    onDelete,
    onActivate,
    onDeactivate
}: BannerCardProps) {
    return (
        <div key={banner.id} className="border rounded-lg overflow-hidden">
            <div className="relative h-[200px]">
                <Image
                    src={banner.media.url}
                    alt={`Banner ${banner.id}`}
                    fill
                    className="object-cover"
                />
                <div className="absolute top-2 right-2 flex gap-1">
                    <span className={`text-xs px-2 py-1 rounded-full ${banner.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {banner.isActive ? 'Activo' : 'Inactivo'}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${banner.priority >= 80 ? 'bg-red-100 text-red-800' :
                        banner.priority >= 60 ? 'bg-orange-100 text-orange-800' :
                            banner.priority >= 40 ? 'bg-amber-100 text-amber-800' :
                                banner.priority >= 20 ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-blue-100 text-blue-800'
                        }`}>
                        Prioridad: {banner.priority}
                    </span>
                    {(() => {
                        const daysLeft = Math.ceil((new Date(banner.endDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
                        return (
                            <span className={`text-xs px-2 py-1 rounded-full ${daysLeft <= 3 ? 'bg-red-100 text-red-800' :
                                daysLeft <= 7 ? 'bg-amber-100 text-amber-800' :
                                    'bg-green-100 text-green-800'
                                }`}>
                                Dias restantes: {daysLeft}
                            </span>
                        );
                    })()}
                </div>
            </div>
            <div className="p-4 space-y-4">
                <div className="space-y-1">
                    <p className="text-sm text-gray-500 flex items-center">
                        <Calendar size={14} className="mr-1" />
                        <span className="font-medium">Inicio:</span> {formatDate(banner.startDate)}
                    </p>
                    <p className="text-sm text-gray-500 flex items-center">
                        <Calendar size={14} className="mr-1" />
                        <span className="font-medium">Fin:</span> {formatDate(banner.endDate)}
                    </p>
                </div>
                <div className="flex justify-between">
                    <div className="flex gap-1">
                        <button
                            className="p-1 border rounded-md hover:bg-gray-50"
                            onClick={() => onEdit(banner.id)}
                        >
                            <Pencil size={16} />
                        </button>
                        <button
                            className="p-1 border rounded-md hover:bg-gray-50 text-red-500"
                            onClick={() => onDelete(banner.id)}
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                    <div className="flex gap-1">
                        {banner.isActive ? (
                            <button
                                className="p-1 border rounded-md hover:bg-gray-50 text-amber-500 text-xs flex gap-1"
                                onClick={() => onDeactivate(banner.id)}
                            >
                                <PowerOff size={16} />
                                Desactivar
                            </button>
                        ) : (
                            <button
                                className="p-1 border rounded-md hover:bg-gray-50 text-green-500 text-xs flex gap-1"
                                onClick={() => onActivate(banner.id)}
                            >
                                <Power size={16} />
                                Activar
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}