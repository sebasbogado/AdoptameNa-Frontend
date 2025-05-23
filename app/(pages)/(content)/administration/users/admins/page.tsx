"use client"
import { useEffect, useState } from "react"
import { deleteUser } from "@/utils/user.http"
import { getAllFullUserProfile } from "@/utils/user-profile.http"
import UserTable from "@/components/administration/user/user-table"
import { SkeletonTable } from "@/components/ui/skeleton-table"
import { UserProfile } from "@/types/user-profile"
import { useAuth } from "@/contexts/auth-context"
import { ConfirmationModal } from "@/components/form/modal"
import { Alert } from "@material-tailwind/react"
import { ArrowLeft, Check, X, AlertTriangle } from "lucide-react"
import Link from "next/link"
import Loading from "@/app/loading"
import NotFound from "@/app/not-found"
import { usePagination } from "@/hooks/use-pagination"
import SearchBar from "@/components/search-bar"
import Pagination from "@/components/pagination"
import { useDebounce } from "@/hooks/use-debounce"

export default function AdminsPage() {
    const [selectedUser, setSelectedUser] = useState<number | null>(null);
    const [successMessage, setSuccessMessage] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [modalConfirmation, setModalConfirmation] = useState(false);
    const [inputValue, setInputValue] = useState<string>("");
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
    const { authToken, loading, user } = useAuth();
    const pageSize = 10;

    if (loading) return <Loading />
    if (!authToken) return <NotFound />

    const debouncedSearch = useDebounce((value: string) => {
        if (value.length >= 3 || value === "") {
            setSearchQuery(value);
        }
    }, 300);

    const handleSearch = (query: string) => {
        setInputValue(query);
        debouncedSearch(query);
    };

    const handleClearSearch = () => {
        setInputValue("");
        setSearchQuery("");
    };

    const {
        data: admins,
        loading: adminsLoading,
        totalPages,
        currentPage,
        handlePageChange,
        updateFilters,
    } = usePagination<UserProfile>({
        fetchFunction: (page, size, filters) =>
            getAllFullUserProfile(authToken, {
                page,
                size,
                role: "admin",
                name: filters?.name || undefined,
            }),
        initialPage: 1,
        initialPageSize: pageSize,
    });

    useEffect(() => {
        const filters = {
            name: searchQuery || undefined,
            refresh: refreshTrigger
        };

        updateFilters(filters);
    }, [searchQuery, refreshTrigger, updateFilters]);

    const handleDelete = async () => {
        if (!authToken || !selectedUser) return;

        if (user?.id === selectedUser) {
            setErrorMessage("No puedes eliminarte a ti mismo como administrador");
            setModalConfirmation(false);
            setSelectedUser(null);
            return;
        }

        try {
            await deleteUser(authToken, selectedUser);
            setRefreshTrigger(prev => prev + 1);
            setSuccessMessage("Administrador eliminado correctamente");
        } catch (error: any) {
            setErrorMessage("Error al eliminar el administrador");
            console.error("Error deleting admin:", error);
        } finally {
            setModalConfirmation(false);
            setSelectedUser(null);
        }
    }

    return (
        <div className="p-8">
        {successMessage && (
                <Alert
                    open={true}
                    color="green"
                    animate={{
                        mount: { y: 0 },
                        unmount: { y: -100 },
                    }}
                    icon={<Check className="h-5 w-5" />}
                    onClose={() => setSuccessMessage("")}
                    className="fixed top-4 right-4 w-72 shadow-lg z-[10001]"
                >
                    <p className="text-sm">{successMessage}</p>
                </Alert>
            )}
            {errorMessage && (
                <Alert
                    open={true}
                    color="red"
                    animate={{
                        mount: { y: 0 },
                        unmount: { y: -100 },
                    }}
                    icon={<X className="h-5 w-5" />}
                    onClose={() => setErrorMessage("")}
                    className="fixed top-4 right-4 w-72 shadow-lg z-[10001]"
                >
                    <p className="text-sm">{errorMessage}</p>
                </Alert>
            )}

            <ConfirmationModal
                isOpen={modalConfirmation}
                onClose={() => { setSelectedUser(null); setModalConfirmation(false) }}
                onConfirm={handleDelete}
                message="¿Estás seguro de que deseas eliminar este administrador?"
                title="Eliminar Administrador"
                textConfirm="Eliminar"
                confirmVariant="danger"
            />

            <div className="mb-6">
                <Link href="/administration/users" className="flex items-center text-blue-600 mb-4 hover:underline">
                    <ArrowLeft size={16} className="mr-1" /> Volver
                </Link>

                <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-end">
                    <h1 className="text-2xl font-bold">Administradores</h1>
                    <div className="w-full md:w-1/2">
                        <SearchBar
                            placeholder="Buscar por nombre, email..."
                            value={inputValue}
                            onChange={handleSearch}
                            onClear={handleClearSearch}
                        />
                    </div>
                </div>
            </div>

            {adminsLoading ? (
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-1">
                        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                    <SkeletonTable columns={9} rows={5} />
                </div>
            ) : (
                <UserTable
                    title="Lista de Administradores"
                    data={admins}
                    loading={adminsLoading}
                    onDelete={(id) => {
                        setSelectedUser(id);
                        setModalConfirmation(true);
                    }}
                />
            )}

            {totalPages > 1 && (
                <div className="flex justify-center mt-4 mb-8">
                    <Pagination
                        totalPages={totalPages}
                        currentPage={currentPage}
                        onPageChange={handlePageChange}
                        size="md"
                    />
                </div>
            )}
        </div>
    )
}