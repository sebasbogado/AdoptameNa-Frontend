import axios from "axios";

const API_URL = `${process.env.NEXT_PUBLIC_BASE_API_URL}/users`;

export const getFullUserById = async (token: string, userId: number) => {
    try {
        const response = await axios.get(`${API_URL}/${userId}/fullUser`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data; // contiene organizationName, fullName, etc.
    } catch (error) {
        console.error("Error fetching full user by ID:", error);
        throw error;
    }
};
