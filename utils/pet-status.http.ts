import axios from "axios"

// URL base de la API
const BASE_URL = "https://adoptamena-api.rodrigomaidana.com/api/pet-status"

// Tipo para los datos de estados de animales
export type AnimalStatus = {
  id: number
  name: string
  description: string
}

// Función para obtener los estados de los animales
export const fetchAnimalStatuses = async (): Promise<AnimalStatus[]> => {
  try {
    const response = await axios.get(`${BASE_URL}?page=0&size=10`, {
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
    const response = await axios.get(`${BASE_URL}?page=0&size=10&sort=name,asc`, {
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
    const response = await axios.get(`${BASE_URL}?page=0&size=10&sort=name,desc`, {
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
      BASE_URL,
      { name, description },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      }
    )
    return response.data
  } catch (error) {
    console.error("Error al crear el estado del animal:", error)
    return null
  }
}

// Función para eliminar un estado de animal
export const deleteAnimalStatus = async (authToken: string, id: number) => {
  try {
    const response = await axios.delete(`${BASE_URL}/${id}`, {
      headers: {
        Accept: "*/*",
        Authorization: `Bearer ${authToken}`
      }
    })
    return response.status === 200
  } catch (error) {
    console.error("Error al eliminar el estado de animal:", error)
    return false
  }
}

// Función para actualizar un estado de animal
export const updateAnimalStatus = async (authToken: string, id: number, name: string, description: string) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/${id}`,
      { name, description },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`
        }
      }
    )
    return response.data
  } catch (error) {
    console.error("Error al actualizar el estado del animal:", error)
    return null
  }
}