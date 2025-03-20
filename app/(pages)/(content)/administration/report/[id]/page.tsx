'use client'
import Loading from "@/app/loading";
import NotFound from "@/app/not-found";
import { SectionCards } from "@/components/section-cards";
import { useAuth } from "@/contexts/authContext";
import { Report } from "@/types/report";
import { getReportById, getReports } from "@/utils/report-client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CardReport from "@/components/administration/report/card-button";
import { Post, UpdatePost } from "@/types/post";
import { getPost, getPostReports, updatePostById } from "@/utils/posts.http";
import ReportList from "@/components/administration/report/report-list";
import SectionAdmin from "@/components/administration/section";
import Button from "@/components/buttons/button";

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
            route.push("/administration/report")
        } catch (err) {
            console.error("Error al actualizar el perfil:", err);
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
        if (!post || post.status === "visible") return; // Solo actualizar si NO está ya visible
        const updatedPost = { ...post, status: "activo" }
        updatePost(updatedPost);
        console.log("desdeAprove")
    }
    const handleDesaprove = async () => {
        if (!post || post.status === "visible") return; // Solo actualizar si NO está ya visible
        const updatedPost = { ...post, status: "desactivo" }
        updatePost(updatedPost);
        console.log("desdeAprove")
    }

    const nextPost = () => {
        console.log("current", currentIndex);
        console.log("length", posts.length);
    
        if (currentIndex < posts.length - 1) {
            const nextPostId = posts[currentIndex + 1].id;
            setCurrentIndex(currentIndex + 1);
            route.push(`/administration/report/${nextPostId}`, { scroll: false });
        } else {
            alert("No hay más posts reportados.");
        }
    };
    if (loading) {
        return Loading();
    }
    if (error || !post) {
        return <NotFound />;
    }
    if (error || posts.length === 0) return <NotFound />;

    return (
        <div className="p-6 ">

            <SectionAdmin title={`Publicacion con id ${post.id}`} >Aprobar un reporte indica que es correcto y se eliminará la publicación, rechazar un reporte indica que el reporte no es correcto y la publicación seguirá activa</SectionAdmin>
           
           <div className="w-full flex justify-end">
           <Button size="sm" onClick={nextPost} className="bg-gray-700 mb-12 mr-12 flex items-center justify-center">
                <span className="material-symbols-outlined">
                    arrow_forward
                </span> Siguiente
            </Button>
            </div>
            <div className=" flex justify-around">

                <ReportList reports={reports} post={post} />
                <CardReport post={post} isReportedPage={true} handleAprove={handleAprove} handleDesaprove={handleDesaprove} />
            </div>
        </div>


    )
}
export default ReportsPost