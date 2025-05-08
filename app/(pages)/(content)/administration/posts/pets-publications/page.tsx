'use client'
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { usePagination } from "@/hooks/use-pagination";
import LabeledSelect from "@/components/labeled-selected";
import ResetFiltersButton from "@/components/reset-filters-button";
import { getPets } from "@/utils/pets.http";
import { Pet } from "@/types/pet";
// import { ITEM_TYPE } from "@/types/constants";
import AllPostListPage from "@/components/administration/bans/posts-list-page";

export default function Page() {
    const { authToken, user, loading: authLoading } = useAuth();
    const router = useRouter();

    const [selectedPetStatus, setSelectedPetStatus] = useState<string | null>(null);
    const [petStatusOptions, setPetStatusOptions] = useState<string[]>([]);
    const [allPetStatusMap, setAllPetStatusMap] = useState<Record<string, number>>({});

    const [pageSize, setPageSize] = useState<number>();
    const [postError, setPostError] = useState<string | null>(null);

    const {
        data: pets,
        loading,
        currentPage,
        totalPages,
        handlePageChange,
        updateFilters
    } = usePagination<Pet>({
        fetchFunction: async (page, size, filters) => {
            if (!authToken) throw new Error("Authentication token is missing");
            return await getPets({
                page,
                size,
                petStatusId: filters?.petStatusId,
            });
        },
        initialPage: 1,
        initialPageSize: pageSize
    });

    useEffect(() => {
        if (!authLoading && !authToken) {
            router.push("/auth/login");
        } else if (user && user.role !== "admin") {
            router.push("/dashboard");
        }

    }, [authToken, authLoading, router]);

    useEffect(() => {
        const fetchDeletedData = async () => {
            try {
                const [petResponse] = await Promise.all([
                    getPets(),
                ]);

                const petStatusMap: Record<string, number> = {};
                petResponse.data.forEach(pet => {
                    if (pet.petStatus.name) {
                        petStatusMap[pet.petStatus.name] = pet.petStatus.id;
                    }
                });

                const uniquePetStatus = Object.keys(petStatusMap).sort();

                setPetStatusOptions(uniquePetStatus);
                setAllPetStatusMap(petStatusMap);
                setPageSize(petResponse.pagination.size);
            } catch (err) {
                setPostError("Error al obtener las publicaciones")
            }
        };

        fetchDeletedData();
    }, []);

    const resetFilters = () => {
        setSelectedPetStatus(null);
        updateFilters({});
    };

    useEffect(() => {
        const petStatusId = selectedPetStatus && selectedPetStatus !== "Todos" ? allPetStatusMap[selectedPetStatus] : undefined;

        updateFilters({ petStatusId });
        handlePageChange(1);
    }, [selectedPetStatus]);

    return (
        <div className="p-6">
            <div className="w-full max-w-6xl mx-auto p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <LabeledSelect
                        label="Estado"
                        options={["Todos", ...petStatusOptions]}
                        selected={selectedPetStatus}
                        setSelected={setSelectedPetStatus}
                    />

                    <ResetFiltersButton onClick={resetFilters} />
                </div>
            </div>
            <AllPostListPage
                items={pets}
                itemType={"pet"}
                loading={loading}
                error={postError}
                currentPage={currentPage}
                totalPages={totalPages}
                handlePageChange={handlePageChange}
                disabled={true}
            />
        </div>
    )
}