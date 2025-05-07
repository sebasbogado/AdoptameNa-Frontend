import { Report } from "@/types/report";

interface ReportListProps {
  reports: Report[];
};

export default function UserReportList({ reports }: ReportListProps) {
  if (!reports.length) {
    return <p className="text-gray-500 text-center mt-4">No hay reportes disponibles.</p>;
  }

  return (
    <div className="w-[60vw] mt-4">
      <table className="w-full border-collapse ">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="py-2 ">Descripción</th>
            <th className="py-2 ">Razon</th>
            <th className="py-2 ">Fecha</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((rep) => (
            <tr key={rep.id} className="border-b border-gray-200">

              <td className="py-2 ">{rep.description}</td>
              <td className="py-2 font-semibold">{rep.reportReason}</td>
              <td className="py-2 ">
                {new Date(rep.reportDate).toLocaleDateString("es-ES", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit"
                })}
              </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}