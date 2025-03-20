'use client'
import Loading from "@/app/loading";
import NotFound from "@/app/not-found";
import { SectionCards } from "@/components/section-cards";
import { useAuth } from "@/contexts/authContext";
import { Report } from "@/types/report";
import { getReportById, getReports } from "@/utils/report-client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import CardReport from "@/components/administration/report/card-button";
import { Post } from "@/types/post";
import { getPost } from "@/utils/posts.http";
import ReportList from "@/components/administration/report/report-list";

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
const updatePostStatus = (post: Post) => {
    
} 
const ReportsPost = () => {
    const { user, loading: userLoading } = useAuth();
    const [post, setPost] = useState<Post | null>(null);

    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);
    const params = useParams();

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
    }, []);

    const handleAprove = async() =>{
        console.log("desdeAprove")
    }
    const handleDesaprove = async() =>{
        console.log("desde  desaprove")
    }
    if (loading) {
        return Loading();
    }
    if (error || !post) {
        return <NotFound />;
    }

    return (
        <div>
            
            <CardReport post={post} isReportedPage = {true} handleAprove = {handleAprove} handleDesaprove={handleDesaprove}  />
            <ReportList reports={reports} />

            </div>
    )
}
export default ReportsPost