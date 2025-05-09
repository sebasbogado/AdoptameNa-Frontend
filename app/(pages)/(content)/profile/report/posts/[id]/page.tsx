'use client';

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import Loading from "@/app/loading";
import NotFound from "@/app/not-found";
import { Report } from "@/types/report";
import { getUserReports } from "@/utils/reports.http";
import UserReportDetailPage from "@/components/profile/report/user-report-detail";
import { getPost } from "@/utils/posts.http";
import { Post } from "@/types/post";

export default function Page() {

  const { authToken } = useAuth();
    const params = useParams();
    const router = useRouter();
    const [post, setPost] = useState<Post | null>(null);
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    
    const postId = params.id

    useEffect(() => {
      if (!authToken || !postId) {
        setError(true);
        return;
      }
  
      const fetchData = async () => {
        try {
          const [postData, reportData] = await Promise.all([
            getPost(params.id as string),
            getUserReports(authToken, { idPost: Number(postId) })
          ]);
          setPost(postData);
          setReports(reportData.data);
        } catch (err) {
          setError(true);
        } finally {
          setLoading(false);
        }
      };
  
      fetchData();
    }, [authToken, postId]);

  
    if (loading) return <Loading />;
    if (error || !post) return <NotFound />;



  return (
      <div className="p-6">
        <UserReportDetailPage
          entity={post}
          reports={reports}
          onBack={() => router.push("/profile/report/posts")}
        />
      </div>
    );
}