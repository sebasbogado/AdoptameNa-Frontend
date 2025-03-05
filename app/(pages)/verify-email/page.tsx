"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios"; // Para hacer la petición al backend
import { Typography, Button } from "@material-tailwind/react";

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setStatus("error");
      return;
    }
console.log("token" , token)
    // Enviar el token al backend para verificar el email
    axios
      .post(`http://localhost:8080/verify-email?token=${token}`)
      .then((response) => {
        console.log("response",response)
        if (response.data.success) {
          setStatus("success");
          setTimeout(() => router.push("/login"), 3000); // Redirige a login tras 3s
        } else {
          setStatus("error");
        }
      })
      .catch(() => setStatus("error"));
  }, [searchParams, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md text-center w-96">
        {status === "loading" && (
          <Typography className="text-gray-700">Verificando correo...</Typography>
        )}
        {status === "success" && (
          <>
            <Typography className="text-green-600 font-bold">
              ¡Correo verificado con éxito!
            </Typography>
            <Typography className="text-gray-600">
              Serás redirigido en unos segundos...
            </Typography>
          </>
        )}
        {status === "error" && (
          <>
            <Typography className="text-red-600 font-bold">
              Error al verificar el correo
            </Typography>
            <Button onClick={() => router.push("/login")} className="mt-4 bg-blue-500">
              Ir al login
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
