'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { getBannerById } from '@/utils/banner.http';
import { useAuth } from '@/contexts/auth-context';
import Loading from '@/app/loading';
import { Banner } from '@/types/banner';
import BannerForm from '@/components/banner/banner-form';

export default function EditBannerPage() {
    const { authToken, loading: userloading } = useAuth();
    const router = useRouter();

    if (userloading) return <Loading />;
    if (!authToken) {
        router.push('/login');
        return <Loading />;
    }

    const params = useParams();
    const [banner, setBanner] = useState<Banner | null>(null);
    const [loading, setLoading] = useState(true);
    const bannerId = params.id as string;

    useEffect(() => {
        const fetchBanner = async () => {
            try {
                const data = await getBannerById(bannerId, authToken);
                setBanner(data);
            } catch (error) {
                console.error('Error al cargar el banner:', error);
                alert('Error al cargar el banner. Por favor, inténtalo de nuevo.');
                router.push('/admin/banners');
            } finally {
                setLoading(false);
            }
        };

        fetchBanner();
    }, [bannerId, router]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh]">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500 mb-4" />
                <p className="text-gray-500">Cargando datos del banner...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/administration/settings/banner">
                    <button className="p-2 rounded-md hover:bg-gray-100">
                        <ArrowLeft size={18} />
                    </button>
                </Link>
                <h1 className="text-3xl font-bold tracking-tight">Editar Banner</h1>
            </div>

            {banner && <BannerForm banner={banner} />}
        </div>
    );
}