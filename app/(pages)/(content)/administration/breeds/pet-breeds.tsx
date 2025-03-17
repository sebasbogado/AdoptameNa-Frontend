"use client"

import { useState, useEffect } from "react"
import { Search, ChevronDown, Plus } from "lucide-react"
import { getBreeds } from '@/utils/breeds.http';
import { useAuth } from "@/contexts/authContext";
import Loading from "@/app/loading";

interface Breed {
    id: number;
    name: string;
    animalId: number;
}

export default function PetBreeds() {
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedFilter, setSelectedFilter] = useState("Todos")
    const { authToken, user, loading: authLoading } = useAuth();

    const [breeds, setBreeds] = useState<Breed[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authToken) return;

        const fetchBreeds = async () => {
            try {
                const data = await getBreeds(authToken);
                console.log("Datos de la API:", data); // Verifica la estructura de los datos

                if (data) {
                    setBreeds(data);
                } else {
                    console.error("Error: La API no devolvió contenido válido");
                    setBreeds([]); // Evita que breeds quede como undefined
                }
            } catch (error) {
                console.error("Error fetching breeds:", error);
                setBreeds([]); // Manejo de errores para evitar undefined
            } finally {
                setLoading(false);
            }
        };

        fetchBreeds();
    }, [authToken]); // 🔥 Cambia `authLoading` por `authToken`

    const breedTags = [
        { name: "British shorthair", type: "gato" },
        { name: "Bulldog", type: "perro" },
        { name: "Cocker spaniel", type: "perro" },
        { name: "Husky", type: "perro" },
        { name: "Siamés", type: "gato" },
        { name: "Mane Coon", type: "gato" },
        { name: "Mestizo", type: "perro" },
        { name: "Mestizo", type: "gato" },
    ]

    const filterOptions = ["Todos", "Perro", "Gato"]

    const filteredBreeds = breedTags.filter(
        (breed) =>
            (selectedFilter === "Todos" || breed.type.toLowerCase() === selectedFilter.toLowerCase()) &&
            breed.name.toLowerCase().includes(searchQuery.toLowerCase()),
    )

    return (
        <div className="w-full max-w-2xl mx-auto rounded-xl border border-gray-200 p-6 bg-white">
            <h2 className="text-2xl font-medium text-gray-800 mb-4">Razas</h2>

            <div className="flex gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                        type="text"
                        placeholder="Buscar raza"
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="relative">
                    <button
                        className="flex justify-between w-56 bg-white text-gray-700 font-normal border border-gray-300 rounded-lg px-4 py-2"
                        onClick={() => setSelectedFilter((prev) => (prev === "open" ? "closed" : "open"))}
                    >
                        Filtrar por animal
                        <ChevronDown className="h-4 w-4 ml-2" />
                    </button>
                    {selectedFilter === "open" && (
                        <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg">
                            {filterOptions.map((option) => (
                                <div
                                    key={option}
                                    onClick={() => setSelectedFilter(option)}
                                    className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                                >
                                    {option}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="flex flex-wrap gap-2">
                {loading ? (
                    <p>Cargando...</p>
                ) : breeds.length > 0 ? (
                    breeds.map((breed) => (
                        <button
                            className="bg-blue-50 hover:bg-blue-100 text-blue-500 rounded-full p-2 border border-blue-200"
                            key={breed.id}>{breed.name}
                        </button>
                    ))
                ) : (
                    <p>No se encontraron razas.</p>
                )}
                <button className="bg-blue-50 hover:bg-blue-100 text-blue-500 rounded-full p-2 border border-blue-200">
                    <Plus className="h-4 w-4" />
                </button>
            </div>
        </div>
    )
}
