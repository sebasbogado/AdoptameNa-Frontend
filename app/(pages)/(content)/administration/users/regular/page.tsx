"use client"
import { useEffect, useState } from "react"
import { deleteUser, updateUser, getUser } from "@/utils/user.http"
import { getAllFullUserProfile } from "@/utils/user-profile.http"
import UserTable from "@/components/administration/user/user-table"
import { UserProfile } from "@/types/user-profile"
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
import { User } from "@/types/auth";
import ChangeRoleModal from "@/components/administration/user/change-role-modal"

export default function RegularUsersPage() {
    const [selectedUser, setSelectedUser] = useState<number | null>(null);
    const [successMessage, setSuccessMessage] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [modalConfirmation, setModalConfirmation] = useState(false);
    const [inputValue, setInputValue] = useState<string>("");
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
    const { authToken, loading } = useAuth();
    const pageSize = 10;
    const [modalUser, setModalUser] = useState<User | null>(null);
    const [openModal, setOpenModal] = useState(false);
    const [sortDirection, setSortDirection] = useState<"id,asc" | "id,desc" | "profile.fullName,asc" | "profile.fullName,desc" | "email,asc" | "email,desc">("id,asc");

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
        data: users,
        loading: usersLoading,
        totalPages,
        currentPage,
        handlePageChange,
        updateFilters,
    } = usePagination<UserProfile>({
        fetchFunction: (page, size, filters) =>
            getAllFullUserProfile(authToken, {
                page,
                size,
                role: "user",
                name: filters?.name || undefined,
                sort: sortDirection || "id,asc",
            }),
        initialPage: 1,
        initialPageSize: pageSize,
    });
    const handleSortChange = (direction: typeof sortDirection) => {
        setSortDirection(direction);
        updateFilters((prev) => ({
            ...prev,
            sort: direction,
        }));
    };
    useEffect(() => {
        const filters = {
            name: searchQuery || undefined,
            sort: sortDirection,
            refresh: refreshTrigger,
        };

        updateFilters(filters);
    }, [searchQuery, sortDirection, refreshTrigger, updateFilters]);


    const handleDelete = async () => {
        if (!authToken || !selectedUser) return;
        try {
            await deleteUser(authToken, selectedUser);
            setRefreshTrigger(prev => prev + 1);
            setSuccessMessage("Usuario eliminado correctamente");
        } catch (error: any) {
            setErrorMessage("Error al eliminar el usuario");
            console.error("Error deleting user:", error);
        } finally {
            setModalConfirmation(false);
            setSelectedUser(null);
        }
    }

    const handleUpdate = async (u: User, newRole: string) => {
        if (!authToken) return;

        const newDbRole = newRole === "regular" ? "user" : "admin";

        // Solo proceder si realmente cambia el rol
        if (u.role === newDbRole) return;

        try {
            const existing = await getUser(String(u.id));
            await updateUser(authToken, u.id, {
                ...existing,
                role: newDbRole,
            });
            setSuccessMessage("Rol actualizado correctamente");
            setRefreshTrigger(x => x + 1);
        } catch (err: any) {
            console.error("Error al actualizar rol:", err);
            setErrorMessage(err.message || "Error al actualizar el usuario");
        } finally {
            setOpenModal(false);
            setModalUser(null);
        }
    };

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
                message="¿Estás seguro de que deseas eliminar este usuario?"
                title="Eliminar Usuario"
                textConfirm="Eliminar"
                confirmVariant="danger"
            />

            <div className="mb-6">
                <Link href="/administration/users" className="flex items-center text-blue-600 mb-4 hover:underline">
                    <ArrowLeft size={16} className="mr-1" /> Volver
                </Link>

                <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-end">
                    <h1 className="text-2xl font-bold">Usuarios Regulares</h1>
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

            <ChangeRoleModal
                isOpen={openModal}
                onClose={() => setOpenModal(false)}
                userFullName={modalUser?.fullName ?? ""}
                userEmail={modalUser?.email ?? ""}
                currentRole={modalUser?.role ?? "user"}
                roles={["regular", "admin"]}
                onSave={(newDisplayRole: string) =>
                    handleUpdate(modalUser as User, newDisplayRole)
                }
            />

            <UserTable
                title="Lista de Usuarios"
                data={users}
                loading={usersLoading}
                onDelete={(id) => {
                    setSelectedUser(id);
                    setModalConfirmation(true);
                }}
                onPromote={(u) => {
                    setModalUser(u);
                    setOpenModal(true);
                }}
                sortDirection={sortDirection}
                onSortChange={handleSortChange}
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