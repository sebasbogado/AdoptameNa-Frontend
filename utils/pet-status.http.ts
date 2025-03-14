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
        const response = await axios.get("https://adoptamena-api.rodrigomaidana.com/api/pet-status?page=0&size=10", {
            headers: { Accept: "application/json" }
        })
        return response.data
    } catch (error) {
        console.error("Error al obtener los estados de los animales:", error)
        return []
    }
}

export const fetchAnimalStatusesAsc = async (): Promise<AnimalStatus[]> => {
    try {
        const response = await axios.get("https://adoptamena-api.rodrigomaidana.com/api/pet-status?page=0&size=10&sort=name,asc", {
            headers: { Accept: "application/json" }
        })
        return response.data
    } catch (error) {
        console.error("Error al obtener los estados de los animales:", error)
        return []
    }
}

export const fetchAnimalStatusesDesc = async (): Promise<AnimalStatus[]> => {
    try {
        const response = await axios.get("https://adoptamena-api.rodrigomaidana.com/api/pet-status?page=0&size=10&sort=name,desc", {
            headers: { Accept: "application/json" }
        })
        return response.data
    } catch (error) {
        console.error("Error al obtener los estados de los animales:", error)
        return []
    }
}


// Función para crear un nuevo estado de animal con autenticación
export const createAnimalStatus = async (token: string, name: string, description: string): Promise<AnimalStatus | null> => {
    try {
      const response = await axios.post(
        "https://adoptamena-api.rodrigomaidana.com/api/pet-status",
        { name, description },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}` // Agregar el token aquí
          }
        }
      )
      return response.data
    } catch (error) {
      console.error("Error al crear el estado del animal:", error)
      return null
    }
  }