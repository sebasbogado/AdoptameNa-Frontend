import axios from "axios";
import Cookies from "js-cookie";

const API_URL = "http://adoptamena-api.rodrigomaidana.com/auth/login";

export async function loginMock() {
    try {
        const response = await axios.post(
            API_URL,
            {
                email: "german.aquino2019@fiuni.edu.py",
                password: "12345678",
            },
            {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            }
        );

        // Guardar el token en cookies si la autenticación es exitosa
        const token = response.data.token;
        if (token) {
            Cookies.set("token", token, { expires: 1 }); // Expira en 1 día
            //console.log("Token guardado:", token);
            return token; // Devolver el token en caso de que quieras usarlo directamente
        } else {
            console.error("No se recibió un token");
            return null;
        }
    } catch (error) {
        console.error("Error en la autenticación:", error);
        return null;
    }
}
