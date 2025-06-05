"use client"
import { useEffect, useState } from "react"
import { deleteUser } from "@/utils/user.http"
import { getAllFullUserProfile } from "@/utils/user-profile.http"
import UserTable from "@/components/administration/user/user-table"
import { UserList, UserProfile } from "@/types/user-profile"
import { useAuth } from "@/contexts/auth-context"
import { ConfirmationModal } from "@/components/form/modal"
import { Alert } from "@material-tailwind/react"
import { usePagination } from "@/hooks/use-pagination"
import SearchBar from "@/components/search-bar"
import Pagination from "@/components/pagination"
import { useDebounce } from "@/hooks/use-debounce"
import { ArrowLeft, Check, X } from "lucide-react"
import Link from "next/link"
import Loading from "@/app/loading"
import NotFound from "@/app/not-found"

export default function OrganizationsPage() {
    const [selectedUser, setSelectedUser] = useState<number | null>(null);
    const [successMessage, setSuccessMessage] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [modalConfirmation, setModalConfirmation] = useState(false);
    const [inputValue, setInputValue] = useState<string>("");
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
    const { authToken, loading } = useAuth();
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
        data: organizations,
        loading: organizationsLoading,
        totalPages,
        currentPage,
        handlePageChange,
        updateFilters,
    } = usePagination<UserProfile>({
        fetchFunction: (page, size, filters) =>
            getAllFullUserProfile(authToken, {
                page,
                size,
                role: "organization",
                search: filters?.search || undefined,
            }),
        initialPage: 1,
        initialPageSize: pageSize,
    });

    const formatDate = (dateString: string): string => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        const day = String(date.getUTCDate()).padStart(2, '0');
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const year = date.getUTCFullYear();

        return `${day}/${month}/${year}`;
    };

    useEffect(() => {
        const filters = {
            search: searchQuery || undefined,
            refresh: refreshTrigger,
            role: "organization"
        };

        updateFilters(filters);
    }, [searchQuery, refreshTrigger, updateFilters]);

    const handleDelete = async () => {
        if (!authToken || !selectedUser) return;
        try {
            await deleteUser(authToken, selectedUser);
            setRefreshTrigger(prev => prev + 1);
            setSuccessMessage("Organización eliminada correctamente");
        } catch (error: any) {
            setErrorMessage("Error al eliminar la organización");
            console.error("Error deleting organization:", error);
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
                message="¿Estás seguro de que deseas eliminar esta organización?"
                title="Eliminar Organización"
                textConfirm="Eliminar"
                confirmVariant="danger"
            />

            <div className="mb-6">
                <Link href="/administration/users" className="flex items-center text-blue-600 mb-4 hover:underline">
                    <ArrowLeft size={16} className="mr-1" /> Volver
                </Link>

                <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-end">
                    <h1 className="text-2xl font-bold">Organizaciones</h1>
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

            <UserTable
                title="Lista de Organizaciones"
                data={organizations}
                loading={organizationsLoading}
                onDelete={(id) => {
                    setSelectedUser(id);
                    setModalConfirmation(true);
                }}
                type="organization"
            />

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