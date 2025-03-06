const API_URL = "http://adoptamena-api.rodrigomaidana.com/users";

export const getUserProfile = async (id: string, token: string) => {
  try {
    const response = await fetch(`${API_URL}/${id}/profile`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,  
        "Content-Type": "application/json",
      },
    });

    if (response.status === 404) {
      throw new Error("perfil no encontrado");
    }

    if (!response.ok) {
      throw new Error("Error al obtener el perfil");
    }

    const data = await response.json();
    return data; 
  } catch (error: any) {
    throw new Error(error.message || "Error al obtener el perfil");
  }
};