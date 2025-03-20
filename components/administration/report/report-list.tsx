import { Post } from "@/types/post";
import { Report } from "@/types/report";

interface ReportListProps{
    reports: Report[];
    post: Post;
};

export default function ReportList({ reports, post }: ReportListProps){
if (!reports.length) {
    return <p className="text-gray-500 text-center mt-4">No hay reportes disponibles.</p>;
}

return (
    <div className="w-[60vw] mt-4">
        <table className="w-full border-collapse">
            <thead>
                <tr className="bg-gray-100 text-left">
                    <th className="py-2 px-4">Usuario</th>
                    <th className="py-2 px-4">Usuario del post</th>
                    <th className="py-2 px-4">Descripción</th>
                    <th className="py-2 px-4">Razon</th>
                </tr>
            </thead>
            <tbody>
                {reports .map((rep) => (
                    <tr key={rep.id} className="border-b border-gray-200">
                        <td className="py-2 px-4 font-semibold">{rep.user.fullName}</td>

                        <td className="py-2 px-4 font-semibold">{post.userFullName}</td>
                        <td className="py-2 px-4">{rep.description}</td>
                        <td className="py-2 px-4 font-semibold">{rep.reportReason}</td>

                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);
}