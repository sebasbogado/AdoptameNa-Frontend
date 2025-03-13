import axios from "axios"

// Tipo para los datos de estados de animales
export type AnimalStatus = {
    id: number
    name: string
    description: string
}

// Función para obtener los estados de los animales
export const fetchAnimalStatuses = async (): Promise<AnimalStatus[]> => {
    try {
        const response = await axios.get("https://adoptamena-api.rodrigomaidana.com:8080/pet-status?page=0&size=5", {
            headers: { Accept: "application/json" }
        })
        return response.data
    } catch (error) {
        console.error("Error al obtener los estados de los animales:", error)
        return []
    }
}