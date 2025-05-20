import React, { useState, useEffect } from "react";
import { ResponseCrowdfundingDTO } from "@/types/crowdfunding";
import { PhoneIcon, MapPin } from "lucide-react";

type CrowdfundingFormProps = {
  mode: "view" | "edit" | "create";
  initialData?: Partial<ResponseCrowdfundingDTO>;
  onSubmit: (data: Partial<ResponseCrowdfundingDTO>) => void;
  onCancel?: () => void;
  validationErrors?: Record<string, string>;
  loading?: boolean;
};

export default function CrowdfundingForm({
  mode,
  initialData,
  onSubmit,
  onCancel,
  validationErrors = {},
  loading = false,
}: CrowdfundingFormProps) {
  const [form, setForm] = useState<Partial<ResponseCrowdfundingDTO>>(initialData || {});

  useEffect(() => {
    setForm(initialData || {});
  }, [initialData]);

  const isView = mode === "view";
  const isEdit = mode === "edit" || mode === "create";

  const handleChange = (field: string, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loading) {
      onSubmit(form);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
        <input
          type="text"
          value={form.title || ""}
          disabled={isView}
          onChange={(e) => handleChange("title", e.target.value)}
          className="w-full border p-2 rounded"
        />
        {validationErrors.title && <p className="text-red-500 text-sm">{validationErrors.title}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
        <textarea
          value={form.description || ""}
          disabled={isView}
          onChange={(e) => handleChange("description", e.target.value)}
          className="w-full border p-2 rounded"
        />
        {validationErrors.description && <p className="text-red-500 text-sm">{validationErrors.description}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Meta (Gs.)</label>
        <input
          type="number"
          value={form.goal || ""}
          disabled={isView}
          onChange={(e) => handleChange("goal", Number(e.target.value))}
          className="w-full border p-2 rounded"
        />
        {validationErrors.goal && <p className="text-red-500 text-sm">{validationErrors.goal}</p>}
      </div>
      {/* Puedes agregar más campos según lo que necesites */}
      {isEdit && (
        <div className="flex gap-2 mt-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            disabled={loading}
          >
            {mode === "edit" ? "Guardar cambios" : "Crear colecta"}
          </button>
          {onCancel && (
            <button
              type="button"
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
              onClick={onCancel}
              disabled={loading}
            >
              Cancelar
            </button>
          )}
        </div>
      )}
    </form>
  );
}