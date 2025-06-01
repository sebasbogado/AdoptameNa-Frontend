// components/Sensitive.tsx

'use client'

import { TriangleAlert } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface Props {
    onContinue: () => void
}

const Sensitive = ({ onContinue }: Props) => {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const handleBack = () => {
        router.back()
    }

    const handleContinue = () => {
        setLoading(true)
        onContinue()
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4 text-center">
            <div className="bg-white p-6 rounded-2xl shadow-md max-w-md w-full">
                <div className="flex justify-center mb-4">
                    <TriangleAlert className="h-12 w-12 text-red-600" />
                </div>
                <h1 className="text-2xl font-bold text-red-600 mb-4">Contenido Sensible</h1>
                <p className="mb-6 text-gray-700">
                    Este contenido puede contener imágenes sensibles relacionadas con mascotas. ¿Deseas continuar?
                </p>
                <div className="flex gap-4 justify-center">
                    <button
                        onClick={handleBack}
                        className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
                    >
                        Volver
                    </button>
                    <button
                        onClick={handleContinue}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                        disabled={loading}
                    >
                        {loading ? 'Cargando...' : 'Ver de todos modos'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Sensitive
