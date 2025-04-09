import { useEffect, useState } from 'react';
import { Textarea } from './ui/textarea';
import Button from '@/components/buttons/button';
import { getReportReasons } from '@/utils/report-reasons.http';
import { useAuth } from '@/contexts/auth-context';
import { ReportReason } from '@/types/report-reason';
import { createReport } from '@/utils/reports.http';
import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { reportSchema } from '@/validations/report-schema';
import { Alert } from '@material-tailwind/react';

interface ReportFormProps {
  handleClose: () => void;
}
const ReportForm: React.FC<ReportFormProps> = ({ handleClose }) => {
  const { authToken, user } = useAuth();
  const params = useParams();
  const idPostParam = parseInt(params.id as string);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      idPost: idPostParam,
      idUser: user?.id ? parseInt(user?.id) : 0,
      status: "ACTIVO",
      reportDate: new Date().toISOString(),
    }
  });
  const [reportReasons, setReportReasons] = useState([]);

  useEffect(() => {
    const fetchReportReasons = async () => {
      try {
        const reasons = await getReportReasons();
        setReportReasons(reasons);
      } catch (error) {
        console.error('Error al obtener razones de reporte:', error);
      }
    };
    fetchReportReasons();
  }, [authToken, user?.id]);

  const onSubmit = async (data: any) => {
    if (!authToken || !user?.id) {
      console.error("Error: No hay token de autenticación.");
      return;
    }
    try {
      await createReport(authToken, data);
      handleClose();
    } catch (error: any) {
      console.error("Error al enviar el reporte:", error);
      setErrorMessage(error.message);
    }
  };
  return (
    <>
      {errorMessage && (
        <Alert
          color="red"
          className="fixed top-4 right-4 z-[10001] w-72 shadow-lg"
          onClose={() => setErrorMessage(null)}
        >
          {errorMessage}
        </Alert>
      )}
      <form className="mt-3" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="idReportReason" className="text-base font-normal block">
            Motivo del reporte
          </label>
          <select
            className="w-full border rounded-lg p-2"
            {...register("idReportReason", { valueAsNumber: true })}
          >
            <option value="">Seleccion motivo del reporte</option>
            {reportReasons.map((reason: ReportReason) => (
              <option key={reason.id} value={reason.id}>
                {reason.description}
              </option>
            ))}
          </select>
          {errors.idReportReason && (
            <p className="text-red-500 text-xs mt-1">
              {errors.idReportReason.message}
            </p>
          )}
        </div>
        <div className="mt-4">
          <label htmlFor="description" className="text-base font-normal block">
            Descripción
          </label>
          <Textarea
            placeholder="Escribe una descripción"
            {...register("description")}
          />
          {errors.description && (
            <p className="text-red-500 text-xs mt-1">
              {errors.description.message}
            </p>
          )}
        </div>
        <div className="flex justify-end pt-4 space-x-2">
          <Button variant="secondary" size="md" onClick={handleClose}>
            Cancelar
          </Button>
          <Button variant="danger" size="md" type='submit'>
            Confirmar Reporte
          </Button>
        </div>
      </form>
    </>
  );
}
export default ReportForm;
