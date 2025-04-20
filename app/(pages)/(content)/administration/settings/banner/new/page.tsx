import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import BannerForm from '@/components/banner/banner-form';

export default function NewBannerPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/administration/settings/banner">
                    <button className="p-2 rounded-md hover:bg-gray-100">
                        <ArrowLeft size={18} />
                    </button>
                </Link>
                <h1 className="text-3xl font-bold tracking-tight">Crear Nuevo Banner</h1>
            </div>

            <BannerForm />
        </div>
    );
}