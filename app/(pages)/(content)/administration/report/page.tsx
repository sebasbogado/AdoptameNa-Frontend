'use client'
import CardReport from "@/components/administration/report/card-button";
import SectionAdmin from "@/components/administration/section";
import PetCard from "@/components/petCard/pet-card";
import { SectionCards } from "@/components/section-cards"
import { useAuth } from "@/contexts/auth-context";
import { Post } from "@/types/post";
import { getPostReports, getPosts } from '@/utils/posts.http';
import { deleteReport, getReports } from "@/utils/report-client"
import { Alert } from "@material-tailwind/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
const getPostsData = async (
	setPosts: React.Dispatch<React.SetStateAction<Post[]>>,
	setLoading: React.Dispatch<React.SetStateAction<boolean>>,
	setPostsError: React.Dispatch<React.SetStateAction<string | null>>,
	userId: string,
) => {
	try {
		const postData = await getPostReports();
		console.log("postData", postData);
		setPosts(Array.isArray(postData.data) ? postData.data : []);

		// const activePosts = Array.isArray(postData) ? postData.filter(post => post.status === 'activo') : [];

		// // Actualizar el estado con los posts activos
		// setPosts(activePosts);
	} catch (err) {
		console.error("Error al cargar posts:", err);
		setPostsError("No se pudieron cargar las publicaciones.");
	} finally {
		setLoading(false);
	}
};
const getReportData = async (
	setReports: React.Dispatch<React.SetStateAction<Report[]>>,
	setLoading: React.Dispatch<React.SetStateAction<boolean>>,
	setReportsError: React.Dispatch<React.SetStateAction<string | null>>,
) => {


	try {
		// Cargar posts del usuario
		const postData = await getReports();
		setReports(Array.isArray(postData) ? postData : []);
	} catch (err) {
		console.error("Error al cargar posts:", err);
		setReportsError("No se pudieron cargar las publicaciones.");
	} finally {
		setLoading(false);
	}
};
// const handleDeleteReport = async (reportId: string) => {
//     if (!authToken) {
//         alert("No tienes permisos para eliminar este reporte.");
//         return;
//     }

//     const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar este reporte?");
//     if (!confirmDelete) return;

//     try {
//         await deleteReport(reportId, authToken);
//         alert("Reporte eliminado correctamente.");

//         // 🟢 ACTUALIZAR EL ESTADO SIN RECARGAR LA PÁGINA
//         setReports((prevReports) => prevReports.filter((report) => report.id !== reportId));
//     } catch (error: any) {
//         alert(error.message || "Error al eliminar el reporte.");
//     }
// };

export default function Page() {
	const { authToken, user, loading: authLoading } = useAuth();
	const router = useRouter();
	const [loading, setLoading] = useState<boolean>(true);
	const [postsError, setPostsError] = useState<string | null>(null);
	const [posts, setPosts] = useState<Post[]>([]);
	useEffect(() => {
		if (!authLoading && !authToken) {
			console.log("authLoading", authLoading);
			console.log("authToken", authToken);
			router.push("/auth/login");
		}

	}, [authToken, authLoading, router]);
	// useEffect(() => {
	//     if (authLoading || !authToken || !user?.id) return;
	//     setLoading(true);
	//     setError(null);
	//     getReportData(setReports, setLoading, setError);
	//     if(reports){
	//         getPostsData(setPosts, setLoading, setPostsError, user.id);
	//     }
	// }, [authToken, authLoading, user?.id]);

	useEffect(() => {
		if (authLoading || !authToken || !user?.id) return;
		console.log("authLoading", authLoading);
		getPostsData(setPosts, setLoading, setPostsError, user.id);

	}, [authToken, authLoading, user?.id]);
	if (!posts.length) {
		return <p className="text-gray-500 text-center mt-4">No hay reportes disponibles.</p>;
	}
	return (
		<div className="p-6">

			<SectionAdmin title="Aprobar o rechazar denuncias">Aprobar un reporte indica que es correcto y se eliminará la publicación, rechazar un reporte indica que el reporte no es correcto y la publicación seguirá activa</SectionAdmin>
			<SectionCards items={posts} filterByType={false} >
				{(item) => <CardReport key={item.id} post={item} />}
			</SectionCards>


		</div>
	)
}