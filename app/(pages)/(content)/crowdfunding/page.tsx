'use client'

import CrowdfundingCard from "@/components/crowdfundingCard/crowdfunding-card";
import Pagination from "@/components/pagination";
import { usePagination } from "@/hooks/use-pagination";
import { Crowdfunding } from "@/types/crowfunding-type"
import { getCrowdfundings } from "@/utils/crowfunding.http";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function Page() {
    const [pageSize, setPageSize] = useState<number>();

    const {
        data: crowdfunding,
        loading,
        error,
        currentPage,
        totalPages,
        updateFilters,
        handlePageChange
    } = usePagination<Crowdfunding>({
        fetchFunction: async (page, size, filters) => {
            return await getCrowdfundings({
                page,
                size,
                status: "ACTIVE",
                ...filters
            });
        },
        initialPage: 1,
        initialPageSize: pageSize
    });

    useEffect(() => {
        setPageSize(crowdfunding.length)
    }, []);

    return (
        <div className="flex flex-col gap-5">
            <div className="w-full flex flex-col items-center justify-center mb-6">
                {loading ? (
                    <div className="flex justify-center items-center">
                        <Loader2 className="h-10 w-10 animate-spin text-purple-500" />
                    </div>
                ) : crowdfunding.length === 0 ? (
                    <div className="text-center p-10 bg-gray-50 rounded-lg w-full max-w-md">
                        <p className="text-gray-600">No se encontraron colectas</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 gap-8 mt-2 p-2">
                        {crowdfunding.map((item) => (
                            <CrowdfundingCard item={item} />
                        ))}
                    </div>
                )}
            </div>

            <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={handlePageChange}
                size="md"
            />
        </div>
    );
}