"use client";
import { UserProfile } from "@/types/user-profile";
import { Loader2, Trash2, UserCircle, ShieldUser } from "lucide-react";
import Link from "next/link";

interface Props {
  title: string;
  data: UserProfile[];
  onDelete: (id: number) => void;
  loading?: boolean;
  onPromote?: (user: UserProfile) => void;
}

export default function UserTable({ title, data, onDelete, loading = false, onPromote }: Props) {

  const formatDate = (dateString: string): string => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = date.getUTCFullYear();

    return `${day}/${month}/${year}`;
  };
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-xl font-bold mb-2">{title}</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="border px-3 py-2 text-left">ID</th>
              <th className="border px-3 py-2 text-left">Nombre</th>
              <th className="border px-3 py-2 text-left">Email</th>
              <th className="border px-3 py-2 text-left">Teléfono</th>
              <th className="border px-3 py-2 text-left">Dirección</th>
              <th className="border px-3 py-2 text-left">Puntos</th>
              <th className="border px-3 py-2 text-left">Fecha de Nacimiento</th>
              <th className="border px-3 py-2 text-left">Fecha de Registro</th>
              <th className="border px-3 py-2 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={9} className="text-center py-8">
                  <div className="flex justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-4">No se encontraron resultados.</td>
              </tr>
            ) : (
              data.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="border px-3 py-2">{user.id}</td>
                  <td className="border px-3 py-2">{user.fullName}</td>
                  <td className="border px-3 py-2">{user.email}</td>
                  <td className="border px-3 py-2">{user.phoneNumber || "-"}</td>
                  <td className="border px-3 py-2">{user.address || "-"}</td>
                  <td className="border px-3 py-2">{user.earnedPoints !== undefined ? user.earnedPoints : "-"}</td>
                  <td className="border px-3 py-2">{formatDate(user.birthdate || "")}</td>
                  <td className="border px-3 py-2">{formatDate(user.creationDate || "")}</td>
                  <td className="border px-3 py-2">
                    <div className="flex items-center justify-center space-x-2">
                      <Link
                        href={`/profile/${user.id}`}
                        className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-100"
                        title="Ver perfil"
                      >
                        <UserCircle size={20} />
                      </Link>
                      {onPromote && (
                        <button
                          onClick={() => onPromote(user)}
                          className="text-yellow-600 hover:text-yellow-800 p-1 rounded hover:bg-yellow-100"
                          title="Cambiar rol"
                        >
                          <ShieldUser size={20} />
                        </button>
                      )}
                      <button
                        onClick={() => onDelete(user.id)}
                        className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-100"
                        title="Eliminar usuario"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
