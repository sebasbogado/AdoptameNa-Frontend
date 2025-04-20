import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_BASE_API_URL;

export const createSponsor = async (
  token: string,
  sponsorData: {
    reason: string;
    contact: string;
    logoId: number;
  }
) => {
  try {
    const response = await axios.post(`${API_BASE}/sponsors`, sponsorData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al crear sponsor:", error);
    throw error;
  }
};
