import { useEffect, useState } from 'react';
import { Textarea } from './ui/textarea';
import Button from '@/components/buttons/button';
import { getReportReasons } from '@/utils/report-reasons.http';
import { useAuth } from '@/contexts/authContext';
import { ReportReason } from '@/types/report-reason';
import { Report } from '@/types/report';
import { createReport } from '@/utils/reports.http';
import { useParams } from 'next/navigation';
interface ReportFormProps {
  handleClose: () => void;
}
const ReportForm: React.FC<ReportFormProps> = ({ handleClose }) => {
  const [reportReasons, setReportReasons] = useState([]);
  const [report, setReport] = useState<Report>({
    id: 0,
    idUser: 0,
    idPost: 0,
    idReportReason: 0,
    description: "",
    reportDate: new Date().toISOString(),
    status: "",
  });
  const { authToken, user } = useAuth();
  const params = useParams();
  const idPostParam = parseInt(params.id as string);

  useEffect(() => {
    const fetchReportReasons = async () => {
      try {
        const reasons = await getReportReasons();
        setReportReasons(reasons);
        if (user?.id) {
          setReport((prevReport) => ({
            ...prevReport,
            idUser: parseInt(user?.id),
            idPost: idPostParam,
          }));
        }
      } catch (error) {
        console.error('Error al obtener razones de reporte:', error);
      }
    };
    fetchReportReasons();
  }, [authToken, user?.id]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setReport((prevReport) => ({
      ...prevReport,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!authToken || !user?.id) {
      console.error("Error: No hay token de autenticación.");
      return;
    }

    if (!report.idReportReason || report.description.trim() === "") {
      console.error("Error: Debes seleccionar un motivo y escribir una descripción.");
      return;
    }

    try {
      const response = await createReport(authToken, report);
      handleClose();
    } catch (error) {
      console.error("Error al enviar el reporte:", error);
    }
  };

  return (
    <>
      <form className='mt-3'>
        <div>
          <label htmlFor="idReportReason" className='text-base font-normal block'>Motivo del reporte</label>
          <select className='w-full border rounded-lg p-2' name="idReportReason" value={report.idReportReason} onChange={handleChange}>
            <option value="">Seleccion motivo del reporte</option>
            {reportReasons.map((reason: ReportReason) => (
              <option key={reason.id} value={reason.id}>{reason.description}</option>
            ))}
          </select>
        </div>
        <div className='mt-4'>
          <label htmlFor="description" className='text-base font-normal block'>Descripción</label>
          <Textarea name="description" placeholder="Escribe una descripción" value={report.description} onChange={handleChange} />
        </div>
      </form>
      <div className='flex justify-end pt-4 space-x-2'>
        <Button variant='secondary' size='md' onClick={handleClose}>Cancelar </Button>
        <Button variant="danger" size="md" onClick={handleSubmit}> Confirmar Reporte </Button>
      </div>
    </>
  );
}
export default ReportForm;
