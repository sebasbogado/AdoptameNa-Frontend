"use client"
import { useEffect, useState } from "react"
import { deleteUser, getUser, updateUser } from "@/utils/user.http"
import { getAllFullUserProfile } from "@/utils/user-profile.http"
import UserTable from "@/components/administration/user/user-table"
import { UserProfile } from "@/types/user-profile"
import { useAuth } from "@/contexts/auth-context"
import { ConfirmationModal } from "@/components/form/modal"
import { Alert } from "@material-tailwind/react"
import { ArrowLeft, Check, X } from "lucide-react"
import Loading from "@/app/loading"
import NotFound from "@/app/not-found"
import { usePagination } from "@/hooks/use-pagination"
import SearchBar from "@/components/search-bar"
import Pagination from "@/components/pagination"
import { useDebounce } from "@/hooks/use-debounce"
import ChangeRoleModal from "@/components/administration/user/change-role-modal"
import { User } from "@/types/auth";
import Button from "@/components/buttons/button";
import { useRouter } from "next/navigation"

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
    const [modalUser, setModalUser] = useState<User | null>(null);
    const [openModal, setOpenModal] = useState(false);
    const [sortDirection, setSortDirection] = useState<"id,asc" | "id,desc" | "profile.fullName,asc" | "profile.fullName,desc" | "email,asc" | "email,desc">("id,asc");
    const router = useRouter();
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
                sort: sortDirection || "id,asc",
            }),
        initialPage: 1,
        initialPageSize: pageSize,
    });

    useEffect(() => {
        const filters = {
            search: searchQuery || undefined,
            refresh: refreshTrigger
        };

        updateFilters(filters);
    }, [searchQuery, refreshTrigger, updateFilters]);

    const handleSortChange = (direction: typeof sortDirection) => {
        setSortDirection(direction);
        updateFilters((prev) => ({
            ...prev,
            sort: direction,
        }));
    };
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

    const handleUpdate = async (u: User, newRole: string) => {
        if (!authToken) return;

        const newDbRole = newRole === "admin" ? "admin" : "user";

        if (u.role === newDbRole) return; // No hay cambios

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
                message="¿Estás seguro de que deseas eliminar este administrador?"
                title="Eliminar Administrador"
                textConfirm="Eliminar"
                confirmVariant="danger"
            />

            <div className="mb-6">
                <div className="flex justify-start mb-4">
                    <Button
                        size="md"
                        onClick={() => router.push("/administration/users")}
                        className="bg-white flex items-center shadow-md text-gray-800"
                    >
                        <ArrowLeft className="text-gray-800 mr-2" size={20} />
                        Volver
                    </Button>
                </div>  

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

            <ChangeRoleModal
                isOpen={openModal}
                onClose={() => setOpenModal(false)}
                userFullName={modalUser?.fullName ?? ""}
                userEmail={modalUser?.email ?? ""}
                currentRole={modalUser?.role ?? "admin"}
                roles={["admin", "regular"]}
                onSave={(newDisplayRole: string) =>
                    handleUpdate(modalUser as User, newDisplayRole)
                }
            />

            <UserTable
                title="Lista de Administradores"
                data={admins}
                loading={adminsLoading}
                onDelete={(id) => {
                    setSelectedUser(id);
                    setModalConfirmation(true);
                }}
                onPromote={(u) => {
                    setModalUser({
                        id: u.id,
                        fullName: u.fullName,
                        email: u.email,
                        role: "admin",
                        isProfileCompleted: u.isProfileCompleted
                    });
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