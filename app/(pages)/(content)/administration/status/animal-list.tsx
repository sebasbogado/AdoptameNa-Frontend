"use client"

import { useState, useEffect } from "react"
import { Pencil, Trash2 } from "lucide-react"
import { CreateAnimalStatusDialog } from "./create-animal-dialog"
import {
    fetchAnimalStatuses,
    fetchAnimalStatusesAsc,
    fetchAnimalStatusesDesc,
    deleteAnimalStatus,
    updateAnimalStatus,
    AnimalStatus
} from "@/utils/pet-status.http"
import { useAuth } from "@/contexts/authContext"

export default function AnimalStatusList() {
    const [animalStatuses, setAnimalStatuses] = useState<AnimalStatus[]>([])
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const { authToken } = useAuth() // Obtener el token de autenticación
    const [editingStatus, setEditingStatus] = useState<AnimalStatus | null>(null);

    useEffect(() => {
        const loadStatuses = async () => {
            const data = await fetchAnimalStatuses()
            setAnimalStatuses(data)
            setIsLoading(false)
        }

        loadStatuses()
    }, [])

    const sortAnimalStatuses = async (value: string) => {
        if (value === "asc") {
            const data = await fetchAnimalStatusesAsc()
            setAnimalStatuses(data)
        } else if (value === "desc") {
            const data = await fetchAnimalStatusesDesc()
            setAnimalStatuses(data)
        }
    }

    const handleDelete = async (id: number) => {
        if (!authToken) {
            console.error("No hay token de autenticación disponible.");
            return;
        }

        // Mostrar advertencia antes de eliminar
        const confirmDelete = window.confirm("¿Estás seguro de que quieres eliminar este estado?");
        if (!confirmDelete) return; // Si el usuario cancela, no se ejecuta la eliminación

        const success = await deleteAnimalStatus(authToken, id);
        if (success) {
            setAnimalStatuses((prev) => prev.filter((status) => status.id !== id)); // Filtrar la lista
        }
    };

    const addAnimalStatus = async () => {
        const loadStatuses = async () => {
            const data = await fetchAnimalStatuses()
            setAnimalStatuses(data)
            setIsLoading(false)
        }

        loadStatuses()
    }


    const editAnimalStatus = (status: AnimalStatus) => {
        setEditingStatus(status); // Guardar el estado a editar
        setIsCreateDialogOpen(true);
    };

    const updateStatus = async (id: number, name: string, description: string) => {
        if (!authToken) return;
        const updatedStatus = await updateAnimalStatus(authToken, id, name, description);
        if (updatedStatus) {
            setAnimalStatuses((prev) =>
                prev.map((status) => (status.id === id ? updatedStatus : status))
            );
            setEditingStatus(null);
        }
    };

    return (
        <div className="rounded-lg border border-gray-900 p-6">
            <h1 className="mb-8 text-center text-2xl font-bold">Estado de Mascotas</h1>

            {isLoading ? (
                <div className="text-center text-lg font-medium">Cargando...</div>
            ) : (
                <>
                    <div className="mb-4 flex items-center justify-between">
                        <div className="text-lg font-medium"></div>
                        <div className="flex gap-2">
                            <select
                                onChange={(e) => sortAnimalStatuses(e.target.value)}
                                className="border border-gray-300 rounded-md p-2 bg-white cursor-pointer"
                            >
                                <option value="">Ordenar</option>
                                <option value="asc">A-Z</option>
                                <option value="desc">Z-A</option>
                            </select>
                            <button
                                onClick={() => setIsCreateDialogOpen(true)}
                                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
                            >
                                Crear
                            </button>
                        </div>
                    </div>

                    <div className="rounded-lg border border-gray-900">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="border-b border-gray-900">
                                    <th className="w-1/3 text-left text-lg font-bold p-4">Estado del Animal</th>
                                    <th className="w-1/3 text-left text-lg font-bold p-4">Descripción</th>
                                    <th className="text-right text-lg font-bold p-4">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {animalStatuses.map((status) => (
                                    <tr key={status.id} className="border-t border-gray-900">
                                        <td className="py-4 px-4">{status.name}</td>
                                        <td className="py-4 px-4">{status.description}</td>
                                        <td className="text-right py-4 px-4">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => editAnimalStatus(status)}
                                                    className="h-8 w-8 border border-amber-500 text-amber-500 rounded-md hover:bg-amber-100 hover:text-amber-600 flex items-center justify-center"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(status.id)}
                                                    className="h-8 w-8 border border-red-500 text-red-500 rounded-md hover:bg-red-100 hover:text-red-600 flex items-center justify-center"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <CreateAnimalStatusDialog
                        open={isCreateDialogOpen}
                        onOpenChange={(open) => {
                            setIsCreateDialogOpen(open);
                            if (!open) setEditingStatus(null);
                        }}
                        onSave={addAnimalStatus}
                        onUpdate={updateStatus}
                        editingStatus={editingStatus}
                    />
                </>
            )}
        </div>
    )
}
