import { useEffect, useState } from 'react';
import { Textarea } from './ui/textarea';
import Button from '@/components/buttons/button';
import { getReportReasons } from '@/utils/report-reasons.http';
import { useAuth } from '@/contexts/authContext';
import { ReportReason } from '@/types/report-reason';

const ReportForm = () => {
  const [reportReasons, setReportReasons] = useState([]);
  const [report, setReport] = useState(null);
  const { authToken } = useAuth();
  useEffect(() => {
    const fetchReportReasons = async () => {
      try {
        if (!authToken) return;
        const reasons = await getReportReasons(authToken);
        setReportReasons(reasons);
      } catch (error) {
        console.error('Error al obtener razones de reporte:', error);
      }
    };
    fetchReportReasons();
  }, [authToken]);

  useEffect(() => {
    console.log(reportReasons);
  }, [reportReasons]);
  return (
    <>
      <form className='mt-3'>
        <label htmlFor="" className='text-base font-normal block'>Razon del reporte</label>
        <select name="" id="" className='w-full border rounded-lg p-2'>
          {reportReasons.map((reason: ReportReason) => (
            <option key={reason.id} value={reason.id}>{reason.description}</option>
          ))}
        </select>
        <label htmlFor="">Descripción</label>
        <Textarea placeholder="Escribe una descripción" />
        <div className='flex justify-end'>
          <Button variant="danger" size="md"> Confirmar Reporte </Button>

        </div>
      </form>
    </>
  );
}
export default ReportForm;
