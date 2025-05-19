'use client'
import { Post } from "@/types/post";
import { useEffect, useState } from "react";
import { getPost, sharePost } from "@/utils/posts.http";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import Loading from "@/app/loading";
import NotFound from "@/app/not-found";
import PostButtons from "@/components/post/post-buttons";
import HeaderUser from "@/components/blog/header-user";
import BlogContent from "@/components/blog/blog-content";
import PostComments from "@/components/post/post-comments";


const fetchPost = async (id: string, setPost: React.Dispatch<React.SetStateAction<Post | null>>, setLoading: React.Dispatch<React.SetStateAction<boolean>>, setError: React.Dispatch<React.SetStateAction<boolean>>) => {
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

export default function Page() {
    const [post, setPost] = useState<Post | null>(null);
    const [error, setError] = useState<boolean>(false);
    const params = useParams();
    const [loading, setLoading] = useState<boolean>(true);
    const { user, loading: userLoading, authToken } = useAuth();
    const router = useRouter();
    useEffect(() => {
        const postId = params.id;
        if (!postId) {
            setError(true);
            return;
        }
        fetchPost(postId as string, setPost, setLoading, setError);
    }, []);

   
    const routeUserProfile = () => {
        router.push(`/profile/${post?.userId}`);
    };
    const handleShare = async () => {
        if (!post || !authToken) return;

        try {
            await sharePost(String(post.id), authToken);
            setPost(prevPost => {
                if (!prevPost) return null;
                return {
                    ...prevPost,
                    sharedCounter: (prevPost.sharedCounter || 0) + 1
                };
            });
        } catch (error) {
            console.error("Error sharing post:", error);
        }
    };
    if (loading) {
        return <Loading />;
    }

    if (error || !post || !user) return <NotFound />;
    return (
        <div className="flex justify-center">
            <div className="w-full   bg-white max-w-5xl px-4 pt-16 prose prose-neutral dark:prose-invert">
                <div className="flex justify-between items-center mb-4">
                    <HeaderUser
                        user={user}
                        routeUserProfile={routeUserProfile}
                        post={post}
                    />


                    <PostButtons
                        postId={String(post?.id)}
                        onShare={handleShare}
                        postIdUser={post?.userId}
                        sizeButton="md"
                    />
                </div>

             
                    <BlogContent
                    post={post}
                    blogContent={post.content}
                />
              
                   <div className="mt-9 mb-10">
                <PostComments authToken={authToken ?? undefined} user={user} userLoading={userLoading} referenceId={post?.id as number} referenceType={"POST"} />
                </div>
            </div>
        </div>
    );
}