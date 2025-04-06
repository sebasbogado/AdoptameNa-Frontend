"use client";
import { useState, useMemo } from "react";
import { Trash2 } from "lucide-react";

interface UserList {
  id: number;
  fullName: string;
  email: string;
  creationDate: string;
}

interface Props {
  title: string;
  data: UserList[];
  onDelete: (id: number) => void;
}

export default function UserTable({ title, data, onDelete }: Props) {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 20;

  const filteredData = useMemo(() => {
    return data.filter((user) =>
      user.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.toLowerCase()) ||
      user.id.toString().includes(search)
    );
  }, [data, search]);

  const totalPages = Math.ceil(filteredData.length / pageSize);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage]);

  const handleDelete = (id: number) => {
    onDelete(id);
    const newTotalPages = Math.ceil((filteredData.length - 1) / pageSize);
    if (currentPage > newTotalPages) {
      setCurrentPage(newTotalPages);
    }
  };

  return (
    <div className="mb-8 px-8" >

      <div className="flex items-center justify-between mb-1">
        <h2 className="text-xl font-bold mb-2">{title}</h2>
        <input
          type="text"
          placeholder="Buscar por nombre, email o ID"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="mb-4 px-3 py-2 border rounded w-full max-w-md"
        />

      </div>

      <table className="w-full border-collapse border text-sm table-auto">
        <thead>
          <tr>
            <th className="border px-3 py-2 text-left">ID</th>
            <th className="border px-3 py-2 text-left">Nombre</th>
            <th className="border px-3 py-2 text-left">Email</th>
            <th className="border px-3 py-2 text-left">Fecha de creación</th>
            <th className="border px-3 py-2 text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center py-4">No se encontraron resultados.</td>
            </tr>
          ) : (
            paginatedData.map((user) => (
              <tr key={user.id}>
                <td className="border px-3 py-2">{user.id}</td>
                <td className="border px-3 py-2">{user.fullName}</td>
                <td className="border px-3 py-2">{user.email}</td>
                <td className="border px-3 py-2">{user.creationDate}</td>
                <td className="border px-3 py-2">
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="hover:text-red-600 text-red-500 "
                  >
                    <Trash2 className="inline mr-1" size={20} />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {totalPages > 1 && (
        // <div className="mt-4 flex items-center justify-between max-w-md">
        <div className="mt-4 flex items-center justify-between max-w-md">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Anterior
          </button>

          <span>Página {currentPage} de {totalPages}</span>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}
