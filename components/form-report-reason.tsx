import React from 'react';
import { Input } from '@/components/ui/input';
import Button from '@/components/buttons/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { reportReasonSchema } from '@/validations/report-reason-schema';
import { ReportReason } from '@/types/report-reason';

interface FormReportReasonProps {
  onCreate: (newReason: ReportReason) => void;
  onDelete: (event: React.FormEvent) => void;
  reasonData: ReportReason;
}

const FormReportReason: React.FC<FormReportReasonProps> = ({ onCreate, onDelete, reasonData }) => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(reportReasonSchema),
    defaultValues: {
      id: reasonData.id || undefined,
      description: reasonData.description || '',
    },
  });

  const onSubmit = (data: any) => {
    onCreate(data);
  };

  return (
    <form className="mt-5" onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-2">
        <label className="block mb-1">Razón del reporte</label>
        <Input
          placeholder="Describe la razón del reporte"
          maxLength={250}
          className={`w-full border p-2 rounded ${errors.description ? 'border-red-500 focus:outline-none' : 'border-gray-300'}`}
          {...register("description")}
        />
        {errors.description && (
          <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>
        )}
      </div>

      <div className="flex justify-end items-center mt-6 w-full">
        <div className="flex gap-4">
          <Button variant={reasonData.id === 0 ? "secondary" : "danger"} type="button" onClick={onDelete}>
            {reasonData.id === 0 ? "Cancelar" : "Eliminar"}
          </Button>

          <Button variant="primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Guardando..." : "Guardar"}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default FormReportReason;
