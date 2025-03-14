"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/authContext" // Importar el contexto de autenticación
import { createAnimalStatus } from "@/utils/pet-status.http"

interface CreateAnimalStatusDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSave: (name: string, description: string) => void
}

export function CreateAnimalStatusDialog({ open, onOpenChange, onSave }: CreateAnimalStatusDialogProps) {
    const [statusName, setStatusName] = useState("")
    const [statusDescription, setStatusDescription] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const { authToken } = useAuth() // Obtener el token de autenticación

    const handleSave = async () => {
        if (!authToken) {
            console.error("No hay token de autenticación disponible.")
            return
        }

        if (statusName.trim() && statusDescription.trim()) {
            setIsLoading(true)
            const newStatus = await createAnimalStatus(authToken, statusName, statusDescription)
            setIsLoading(false)

            if (newStatus) {
                onSave(newStatus.name, newStatus.description) // Agregar el nuevo estado a la lista
                setStatusName("")
                setStatusDescription("")
                onOpenChange(false)
            }
        }
    }

    if (!open) return null

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-[425px]">
                <h2 className="text-xl font-semibold">Crear Nuevo Estado de Animal</h2>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <label htmlFor="name" className="text-right font-medium">
                            Nombre
                        </label>
                        <input
                            id="name"
                            value={statusName}
                            onChange={(e) => setStatusName(e.target.value)}
                            className="col-span-3 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            autoFocus
                            disabled={isLoading}
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <label htmlFor="description" className="text-right font-medium">
                            Descripción
                        </label>
                        <input
                            id="description"
                            value={statusDescription}
                            onChange={(e) => setStatusDescription(e.target.value)}
                            className="col-span-3 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={isLoading}
                        />
                    </div>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                    <button
                        onClick={() => onOpenChange(false)}
                        className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
                        disabled={isLoading}
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
                        disabled={isLoading}
                    >
                        {isLoading ? "Guardando..." : "Guardar"}
                    </button>
                </div>
            </div>
        </div>
    )
}
