"use client";
import { useState, useMemo, useEffect } from "react";
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
  const [currentPage, setCurrentPage] = useState(0);
  const [isNextPage, setIsNextPage] = useState(false);
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
    const start = currentPage * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage]);

  const handleDelete = (id: number) => {
    onDelete(id);
    const newTotalPages = Math.ceil((filteredData.length - 1) / pageSize);
    if (currentPage > newTotalPages) {
      setCurrentPage(newTotalPages);
    }
  };

  useEffect(() => {
    const start = (currentPage + 1) * pageSize;
    setIsNextPage(start < filteredData.length);
  }, [filteredData, currentPage]);

  const handlePreviousPage = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (isNextPage) setCurrentPage(currentPage + 1);
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
            setCurrentPage(0);
          }}
          className="mb-4 px-3 py-2 border rounded w-full max-w-md"
        />

      </div>

      <table className="w-full border-collapse border text-sm table-fixed">
        <thead>
          <tr>
            <th className="border px-3 py-2 text-left w-10">ID</th>
            <th className="border px-3 py-2 text-left">Nombre</th>
            <th className="border px-3 py-2 text-left">Email</th>
            <th className="border px-3 py-2 text-left">Fecha de creación</th>
            <th className="border px-3 py-2 w-20">Acciones</th>
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
                <td className="border px-3 py-2 flex items-center justify-center">
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
      {data.length > pageSize && (
        <div className="flex justify-center gap-4 py-4" >
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 0}
            className={`px-4 py-2 rounded-md ${currentPage === 0
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-purple-500 text-white hover:bg-purple-600'
              }`}
          >
            Anterior
          </button>

          < span className="px-4 py-2 bg-gray-200 rounded-md" >
            Página {currentPage + 1}
          </span>

          < button
            onClick={handleNextPage}
            disabled={!isNextPage}
            className={`px-4 py-2 rounded-md ${!isNextPage
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-purple-500 text-white hover:bg-purple-600'
              }`}
          >
            Siguiente
          </button>
        </div>)}
    </div>
  );
}
