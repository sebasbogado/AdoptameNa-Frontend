'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Alert } from '@material-tailwind/react';
import { ArrowLeft, Loader2, X } from 'lucide-react';
import { getBannerById } from '@/utils/banner.http';
import { useAuth } from '@/contexts/auth-context';
import Loading from '@/app/loading';
import { Banner } from '@/types/banner';
import BannerForm from '@/components/banner/banner-form';

export default function EditBannerPage() {
    const { authToken, loading: userloading } = useAuth();
    const router = useRouter();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [banner, setBanner] = useState<Banner | null>(null);
    const [loading, setLoading] = useState(true);
    const params = useParams();
    const bannerId = params.id as string;

    useEffect(() => {
        if (!authToken) return;
        
        const fetchBanner = async () => {
            try {
                const data = await getBannerById(bannerId, authToken);
                setBanner(data);
            } catch (error) {
                console.error('Error al cargar el banner:', error);
                setErrorMessage('Error al cargar el banner. Por favor, inténtalo de nuevo.');
                setTimeout(() => router.push('/administration/settings/banner'), 3000);
            } finally {
                setLoading(false);
            }
        };

        fetchBanner();
    }, [bannerId, router, authToken]);

    if (userloading) return <Loading />;
    if (!authToken) {
        router.push('/login');
        return <Loading />;
    }

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
            {errorMessage && (
                <Alert
                    open={true}
                    color="red"
                    animate={{
                        mount: { y: 0 },
                        unmount: { y: -100 },
                    }}
                    icon={<X className="h-5 w-5" />}
                    onClose={() => setErrorMessage(null)}
                    className="fixed top-4 right-4 w-72 shadow-lg z-[10001]"
                >
                    <p className="text-sm">{errorMessage}</p>
                </Alert>
            )}

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