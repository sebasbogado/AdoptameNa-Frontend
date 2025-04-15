'use client'
import Loading from "@/app/loading";
import NotFound from "@/app/not-found";
import { SectionCards } from "@/components/section-cards";
import { useAuth } from "@/contexts/auth-context";
import { Report } from "@/types/report";
import { deleteReport, deleteReportsByPost, getReportById, getReports } from "@/utils/report-client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CardReport from "@/components/administration/report/card-button";
import { Post, UpdatePost } from "@/types/post";
import { getPost, getPostReports, updatePostById } from "@/utils/posts.http";
import ReportList from "@/components/administration/report/report-list";
import SectionAdmin from "@/components/administration/section";
import Button from "@/components/buttons/button";
import { report } from "process";
import { Alert } from "@material-tailwind/react";
import { ArrowLeft, ArrowRight } from "lucide-react";

const getReportsPost = async (
    id: string,
    setReport: React.Dispatch<React.SetStateAction<Report[] | []>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setError: React.Dispatch<React.SetStateAction<boolean>>) => {
    try {
        setLoading(true);
        const queryParam = {
            post: id
        }
        const report = await getReports(queryParam);
        setReport(report);
    } catch (error: any) {
        console.log(error);
        setError(true);
    } finally {
        setLoading(false);
    }
};
const getPostById = async (
    id: string,
    setPost: React.Dispatch<React.SetStateAction<Post | null>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setError: React.Dispatch<React.SetStateAction<boolean>>) => {
    try {
        setLoading(true);
        const post = await getPost(id);
        setPost(post);
    } catch (error: any) {
        console.log(error);
        setError(true);
    } finally {
        setLoading(false);
    }
};

const ReportsPost = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [post, setPost] = useState<Post | null>(null);
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);
    const params = useParams();
    const { authToken, user, loading: authLoading } = useAuth();
    const route = useRouter();
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        if (!authToken) return;

        const fetchPosts = async () => {
            try {
                const postData = await getPostReports();
                setPosts(Array.isArray(postData) ? postData : []);
            } catch (err) {
                console.error("Error al cargar posts:", err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [authToken]);
    const updatePost = async (updatedPost: UpdatePost) => {
        if (authLoading || !authToken || !post?.id) return;
        try {
            const data = await updatePostById(post.id, updatedPost, authToken);
            setPost(data); // Actualizamos el estado después de recibir la respuesta
            console.log(post)
        } catch (err) {
            console.error("Error al actualizar el post:", err);
        }
    };
    useEffect(() => {
        const postId = params.id;
        if (!postId) {
            setError(true);
            return;
        }
        getPostById(postId as string, setPost, setLoading, setError);
    }, []);

    useEffect(() => {
        const postId = params.id;
        if (!postId) {
            setError(true);
            return;
        }
        getReportsPost(postId as string, setReports, setLoading, setError);
    }, [params.id]); // Se ejecuta cada vez que cambia la ID en la URL
    useEffect(() => {
        if (posts.length > 0 && params.id) {
            const newIndex = posts.findIndex((p) => String(p.id) === String(params.id));
            if (newIndex !== -1) {
                setCurrentIndex(newIndex);
            }
        }
    }, [params.id, posts]);
    const handleAprove = async () => {
        if (!post) return; // Solo actualizar si NO está ya activo

        const updatedPost: UpdatePost = {
            idUser: post.idUser,
            title: post.title,
            content: post.content,
            idPostType: post.postType.id,
            locationCoordinates: post.locationCoordinates,
            contactNumber: post.contactNumber,
            status: "activo",
            urlPhoto: post.urlPhoto
        };
        try {
            await deleteReportByPost(post.id);
            await updatePost(updatedPost);
            setSuccessMessage("Post aprobado exitosamente");
        } catch (err) {
            setErrorMessage("Hubo un error al aprobar el post.");
        }
    }
    const handleDesaprove = async () => {
        if (!post || post.status === "desactivo") return; // Solo actualizar si NO está ya desactivo

        const updatedPost: UpdatePost = {
            idUser: post.idUser,
            title: post.title,
            content: post.content,
            idPostType: post.postType.id,
            locationCoordinates: post.locationCoordinates,
            contactNumber: post.contactNumber,
            status: "desactivo",
            urlPhoto: post.urlPhoto
        };
        try {
            await updatePost(updatedPost);
            setSuccessMessage("El post ha sido bloqueado con éxito.");
        } catch (err) {
            setErrorMessage("Hubo un error al banear el post.");
        }
    }
    const deleteReportById = async (reportId: number) => {
        if (authLoading || !authToken || !post?.id) return;
        try {
            await deleteReport(reportId, authToken);
            setReports((prevReports) => prevReports.filter((r) => r.id !== reportId)); // Actualiza la UI eliminando el reporte

        } catch (error) {
            console.error("Error al eliminar el reporte:", error);
            setErrorMessage("Hubo un error al banear el post.");

        }
    };

    const deleteReportByPost = async (reportId: number) => {
        if (authLoading || !authToken || !post?.id) return;
        try {
            await deleteReportsByPost(reportId, authToken);
            setReports([]); // Actualiza la UI eliminando el reporte

        } catch (error) {
            console.error("Error al eliminar el reporte:", error);
            setErrorMessage("Hubo un error al banear el post.");

        }
    };
    const handleDeleteReport = async (reportId: number) => {
        await deleteReportById(reportId);
    }

    const nextPost = () => {
        console.log("current", currentIndex);
        console.log("length", posts.length);

        if (currentIndex < posts.length - 1) {
            const nextPostId = posts[currentIndex + 1].id;
            setCurrentIndex(currentIndex + 1);
            route.push(`/administration/report/${nextPostId}`, { scroll: false });
        } else {
            setErrorMessage("Ya no hay reportes")
        }
    };
    const back = () => {
        route.push(`/administration/report/`);
}

    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => setSuccessMessage(""), 5000);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    useEffect(() => {
        if (errorMessage) {
            const timer = setTimeout(() => setErrorMessage(""), 5000);
            return () => clearTimeout(timer);
        }
    }, [errorMessage]);
    if (loading) {
        return Loading();
    }
    if (error || !post) {
        return <NotFound />;
    }
    if (error || posts.length === 0) return <NotFound />;

    return (
        <div className="p-6 ">
            <Button size="md" onClick={back} className="mb-6 mr-12 bg-white flex justify-between items-center shadow -md text-gray-800">
            <ArrowLeft className="text-gray-800 pr-1 " size={20} />
            Volver
            </Button>
            <SectionAdmin title={`Publicacion con id ${post.id}`} >Aprobar un reporte indica que es correcto y se eliminará la publicación, rechazar un reporte indica que el reporte no es correcto y la publicación seguirá activa</SectionAdmin>

            <div className="w-full flex justify-end">
                <Button size="sm" onClick={nextPost} className="bg-white mb-12 mr-12 flex items-center justify-center shadow -md text-gray-800">

                     Siguiente <ArrowRight  className="text-gray-800 pl-1 "/>
                </Button>
                {successMessage && (
                    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-auto">
                        <Alert color="green" onClose={() => setSuccessMessage("")} className="text-sm px-4  w-fit flex items-center">
                            {successMessage}
                        </Alert>
                    </div>
                )}
                {errorMessage && (
                    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-auto">
                        <Alert color="red" onClose={() => setErrorMessage("")} className="text-sm px-4  w-fit flex items-center">
                            {errorMessage}
                        </Alert>
                    </div>
                )}
            </div>
            <div className=" flex justify-around">

                <ReportList reports={reports} post={post} handleDeleteReport={handleDeleteReport} />
                <CardReport post={post} isReportedPage={true} handleAprove={handleAprove} handleDesaprove={handleDesaprove} />
            </div>
        </div>


    )
}
export default ReportsPost