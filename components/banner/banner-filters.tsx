'use client';

import { useState, useEffect } from 'react';
import { X, Filter, Calendar, Sliders, Power } from 'lucide-react';
import { bannerQueryParams } from '@/types/pagination';

interface BannerFiltersProps {
    filters: bannerQueryParams;
    onApplyFilters: (filters: bannerQueryParams) => void;
    onClearFilters: () => void;
    showFilters: boolean;
    onToggleFilters: () => void;
}

export default function BannerFilters({
    filters,
    onApplyFilters,
    onClearFilters,
    showFilters,
    onToggleFilters
}: BannerFiltersProps) {
    const [tempFilters, setTempFilters] = useState<bannerQueryParams>({});
    const [activeFilter, setActiveFilter] = useState<"none" | "active" | "inactive">("none");

    useEffect(() => {
        if (showFilters) {
            setTempFilters({ ...filters });
            setActiveFilter(
                filters.isActive === undefined ? "none" :
                    filters.isActive ? "active" : "inactive"
            );
        }
    }, [showFilters, filters]);

    const applyFilters = () => {
        const apiFilters = { ...tempFilters };
        if (activeFilter !== "none") {
            apiFilters.isActive = activeFilter === "active";
        } else {
            delete apiFilters.isActive;
        }

        onApplyFilters(apiFilters);
    };

    const clearFilters = () => {
        setTempFilters({});
        setActiveFilter("none");
        onClearFilters();
    };

    return (
        <>
            {/* Barra de filtros */}
            <div className="mb-6 flex flex-wrap justify-between items-center gap-3">
                <div className="flex items-center gap-2">
                    <button
                        onClick={onToggleFilters}
                        className={`flex items-center gap-1 px-3 py-2 border rounded-md ${showFilters ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'}`}
                    >
                        <Filter size={16} />
                        <span>Filtros</span>
                        {Object.keys(filters).length > 0 && (
                            <span className="inline-flex items-center justify-center w-5 h-5 bg-blue-500 text-white text-xs rounded-full ml-1">
                                {Object.keys(filters).length}
                            </span>
                        )}
                    </button>

                    <div className="flex items-center gap-2">
                        <select
                            className="border rounded-md px-2 py-2 text-sm"
                            value={filters.sort || 'id,desc'}
                            onChange={(e) => {
                                const newFilters = { ...filters, sort: e.target.value };
                                onApplyFilters(newFilters);
                            }}
                        >
                            <option value="id,desc">Más recientes</option>
                            <option value="id,asc">Más antiguos</option>
                            <option value="priority,desc">Mayor prioridad</option>
                            <option value="priority,asc">Menor prioridad</option>
                            <option value="startDate,asc">Fecha inicio ▲</option>
                            <option value="startDate,desc">Fecha inicio ▼</option>
                            <option value="endDate,asc">Fecha fin ▲</option>
                            <option value="endDate,desc">Fecha fin ▼</option>
                        </select>
                    </div>

                    {Object.keys(filters).length > 0 && (
                        <button
                            onClick={onClearFilters}
                            className="flex items-center gap-1 px-3 py-2 border rounded-md text-red-500 hover:bg-red-50"
                        >
                            <X size={16} />
                            <span>Limpiar</span>
                        </button>
                    )}
                </div>
            </div>

            {showFilters && (
                <div className="mb-6 p-4 border rounded-lg bg-gray-50">
                    <h3 className="font-medium mb-3 flex items-center gap-2">
                        <Sliders size={16} />
                        Filtrar banners
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="flex flex-col">
                            <label className="text-sm font-medium mb-1 flex items-center">
                                <Calendar size={14} className="mr-1" />
                                Fecha de inicio
                            </label>
                            <div className="grid grid-cols-2 gap-2 flex-grow">
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">Desde</label>
                                    <input
                                        type="date"
                                        className="w-full border rounded-md px-2 py-1 text-sm"
                                        value={tempFilters.minStartDate || ''}
                                        onChange={(e) => setTempFilters({ ...tempFilters, minStartDate: e.target.value || undefined })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">Hasta</label>
                                    <input
                                        type="date"
                                        className="w-full border rounded-md px-2 py-1 text-sm"
                                        value={tempFilters.maxStartDate || ''}
                                        onChange={(e) => setTempFilters({ ...tempFilters, maxStartDate: e.target.value || undefined })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col">
                            <label className="text-sm font-medium mb-1 flex items-center">
                                <Calendar size={14} className="mr-1" />
                                Fecha de finalización
                            </label>
                            <div className="grid grid-cols-2 gap-2 flex-grow">
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">Desde</label>
                                    <input
                                        type="date"
                                        className="w-full border rounded-md px-2 py-1 text-sm"
                                        value={tempFilters.minEndDate || ''}
                                        onChange={(e) => setTempFilters({ ...tempFilters, minEndDate: e.target.value || undefined })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">Hasta</label>
                                    <input
                                        type="date"
                                        className="w-full border rounded-md px-2 py-1 text-sm"
                                        value={tempFilters.maxEndDate || ''}
                                        onChange={(e) => setTempFilters({ ...tempFilters, maxEndDate: e.target.value || undefined })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col">
                            <label className="text-sm font-medium mb-1 flex items-center">
                                <Power size={14} className="mr-1" />
                                Estado
                            </label>
                            <div className="flex gap-2 flex-grow items-end pb-[1px]">
                                <button
                                    type="button"
                                    className={`flex-1 px-3 py-1 border rounded-md text-sm ${activeFilter === "none" ? "bg-gray-200 border-gray-300" : "hover:bg-gray-100"
                                        }`}
                                    onClick={() => setActiveFilter("none")}
                                >
                                    Todos
                                </button>
                                <button
                                    type="button"
                                    className={`flex-1 px-3 py-1 border rounded-md text-sm ${activeFilter === "active" ? "bg-green-100 border-green-300 text-green-800" : "hover:bg-gray-100"
                                        }`}
                                    onClick={() => setActiveFilter("active")}
                                >
                                    Activos
                                </button>
                                <button
                                    type="button"
                                    className={`flex-1 px-3 py-1 border rounded-md text-sm ${activeFilter === "inactive" ? "bg-gray-100 border-gray-300 text-gray-800" : "hover:bg-gray-100"
                                        }`}
                                    onClick={() => setActiveFilter("inactive")}
                                >
                                    Inactivos
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-col">
                            <label className="block text-sm font-medium mb-1">Prioridad</label>
                            <div className="grid grid-cols-2 gap-2 flex-grow">
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">Mínima</label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        className="w-full border rounded-md px-2 py-1 text-sm"
                                        value={tempFilters.minPriority !== undefined ? tempFilters.minPriority : ''}
                                        onChange={(e) => {
                                            const value = e.target.value ? parseInt(e.target.value) : undefined;
                                            setTempFilters({ ...tempFilters, minPriority: value });
                                        }}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">Máxima</label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        className="w-full border rounded-md px-2 py-1 text-sm"
                                        value={tempFilters.maxPriority !== undefined ? tempFilters.maxPriority : ''}
                                        onChange={(e) => {
                                            const value = e.target.value ? parseInt(e.target.value) : undefined;
                                            setTempFilters({ ...tempFilters, maxPriority: value });
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 mt-4">
                        <button
                            type="button"
                            onClick={onToggleFilters}
                            className="px-4 py-2 border rounded-md hover:bg-gray-50"
                        >
                            Cancelar
                        </button>
                        <button
                            type="button"
                            onClick={clearFilters}
                            className="px-4 py-2 border rounded-md hover:bg-gray-50"
                        >
                            Limpiar
                        </button>
                        <button
                            type="button"
                            onClick={applyFilters}
                            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                        >
                            Aplicar filtros
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}