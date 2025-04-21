import BannerList from '@/components/banner/banner-list';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';

export default function BannersPage() {
    return (

        <div className="space-y-6 p-9">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Banners</h1>
                <Link href="/administration/settings/banner/new">
                    <button className="flex items-center gap-1 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700">
                        <PlusCircle size={18} />
                        <span>Nuevo Banner</span>
                    </button>
                </Link>
            </div>

            <BannerList />
        </div>
    );
}