"use client"

import { useRouter } from "next/navigation"
import { Cat, PackageSearch, BookOpenText, MessageCircleIcon } from "lucide-react"
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
      
      <h1 className="text-2xl font-bold mb-8">Administrar de reportes</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Link href="/administration/posts/posts-publications">
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow flex flex-col items-center cursor-pointer">
            <div className="bg-blue-100 p-4 rounded-full mb-4">
              <BookOpenText size={48} className="text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Publicaciones</h2>
            <p className="text-gray-600 text-center">Gestionar reportes de publicaciones</p>
          </div>
        </Link>

        <Link href="/administration/posts/pets-publications">
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow flex flex-col items-center cursor-pointer">
            <div className="bg-purple-100 p-4 rounded-full mb-4">
              <Cat size={48} className="text-purple-600" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Mascotas</h2>
            <p className="text-gray-600 text-center">Gestionar reportes de mascotas</p>
          </div>
        </Link>

        <Link href="/administration/posts/products-publications">
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow flex flex-col items-center cursor-pointer">
            <div className="bg-amber-100 p-4 rounded-full mb-4">
              <PackageSearch size={48} className="text-amber-600" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Productos</h2>
            <p className="text-gray-600 text-center">Gestionar reportes de productos</p>
          </div>
        </Link>
         <Link href="/administration/report/comments">
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow flex flex-col items-center cursor-pointer">
            <div className="bg-pink-100 p-4 rounded-full mb-4">
              <MessageCircleIcon size={48} className="text-pink-600" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Comentarios</h2>
            <p className="text-gray-600 text-center">Gestionar reportes de productos</p>
          </div>
        </Link>
      </div>
    </div>
  )
}