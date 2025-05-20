'use client'

import React, { useEffect, useState } from "react";
import clsx from "clsx";
import CardImage from "@/components/petCard/card-image";
import Link from "next/link";
import { Crowdfunding } from "@/types/crowfunding-type";
import CrowdfundingCardText from "./card-text";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { getUserProfile } from "@/utils/user-profile.http";
import { Media } from "@/types/media";
import { Trash, X, Check } from 'lucide-react';

type CrowdfundingCardProps = {
    item: Crowdfunding;
    className?: string;
    isAdmin?: boolean;
    onApprove?: (id: number) => void;
    onReject?: (id: number) => void;
    onDelete?: (id: number) => void;
};

export default function CrowdfundingCard({ item, className = "", isAdmin = false, onApprove, onReject, onDelete }: CrowdfundingCardProps) {
    const { user } = useAuth();
    const router = useRouter();

    const [authorName, setAuthorName] = useState("");
    const [authorImage, setAuthorImage] = useState<Media[]>([]);

    useEffect(() => {
        const fetchUserData = async () => {
            if (!item.id) return;
            try {
                const response = await getUserProfile(item.userId.toString());
                setAuthorName(response.fullName);
                setAuthorImage(response.media);
            } catch (error) {
                console.error("Error fetching user profile:", error);
            }
        }
        fetchUserData();

    }, [user, router]);

    // Estado visual
    let statusLabel = '';
    let statusColor = '';
    if (item.status === 'REJECTED') {
        statusLabel = 'Rechazado';
        statusColor = 'bg-red-100 text-red-700 border-red-300';
    } else if (item.status === 'PENDING') {
        statusLabel = 'Pendiente';
        statusColor = 'bg-yellow-100 text-yellow-700 border-yellow-300';
    } else if (item.status === 'ACTIVE') {
        statusLabel = 'Aprobado';
        statusColor = 'bg-green-100 text-green-700 border-green-300';
    } else if (item.status === 'CLOSED') {
        statusLabel = 'Cerrado';
        statusColor = 'bg-gray-100 text-gray-700 border-gray-300';
    }

    return (
        <div className={clsx(
            "snap-start shrink-0 w-[16rem] rounded-3xl overflow-hidden bg-white drop-shadow-md flex flex-col relative",
            className
        )}>
            <div className="flex-1 flex flex-col">
                <CardImage media={authorImage[0]}/>
                <CrowdfundingCardText key={item.id} item={item} authorName={authorName} />
            </div>
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
                {isAdmin ? (
                    <>
                        <button
                            onClick={() => onDelete?.(item.id)}
                            className="p-2 rounded-full text-gray-500 hover:bg-red-200 transition-colors"
                            title="Eliminar definitivamente"
                        >
                            <Trash size={20} />
                        </button>
                        {item.status === 'PENDING' ? (
                            <div className="flex gap-2">
                                <button
                                    onClick={() => onReject?.(item.id)}
                                    className="p-2 rounded-full text-red-500 hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    title="Rechazar"
                                >
                                    <X size={20} />
                                </button>
                                <button
                                    onClick={() => onApprove?.(item.id)}
                                    className="p-2 rounded-full text-green-500 hover:bg-green-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    title="Aprobar"
                                >
                                    <Check size={20} />
                                </button>
                            </div>
                        ) : (
                            <span className={`text-sm font-medium flex items-center px-3 py-1 rounded border ${statusColor}`}>
                                {item.status === 'ACTIVE' ? (
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
                        {item.status === 'ACTIVE' ? (
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
