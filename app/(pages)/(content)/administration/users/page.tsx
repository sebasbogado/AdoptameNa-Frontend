"use client"
import { useRouter } from "next/navigation"
import { UserCircle, Users, Building, Shield } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import BackButton from "@/components/buttons/back-button"

export default function Page() {
  const router = useRouter();
  const { authToken, loading } = useAuth();

  if (loading) return <div className="h-screen w-screen flex justify-center items-center">Cargando...</div>
  if (!authToken) return <div className="h-screen w-screen flex justify-center items-center">No tienes permisos para ver esta página</div>

  return (
    <div className="p-8">
            <BackButton path="/administration"/>
      
      <h1 className="text-2xl font-bold mb-8">Administración de Usuarios</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/administration/users/regular">
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow flex flex-col items-center cursor-pointer">
            <div className="bg-blue-100 p-4 rounded-full mb-4">
              <UserCircle size={48} className="text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Usuarios Regulares</h2>
            <p className="text-gray-600 text-center">Gestionar usuarios comunes de la plataforma</p>
          </div>
        </Link>

        <Link href="/administration/users/organizations">
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow flex flex-col items-center cursor-pointer">
            <div className="bg-purple-100 p-4 rounded-full mb-4">
              <Building size={48} className="text-purple-600" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Organizaciones</h2>
            <p className="text-gray-600 text-center">Gestionar organizaciones y refugios registrados</p>
          </div>
        </Link>

        <Link href="/administration/users/admins">
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow flex flex-col items-center cursor-pointer">
            <div className="bg-amber-100 p-4 rounded-full mb-4">
              <Shield size={48} className="text-amber-600" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Administradores</h2>
            <p className="text-gray-600 text-center">Gestionar administradores del sistema</p>
          </div>
        </Link>
      </div>
    </div>
  )
}