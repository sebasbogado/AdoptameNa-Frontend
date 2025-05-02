'use client';
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Loading from "@/app/loading";
import NotFound from "@/app/not-found";
import { Post } from "@/types/post";
import { useAuth } from "@/contexts/auth-context";
import { getPost, getPosts, sharePost } from "@/utils/posts.http";
import { PostHeader } from "@/components/post/post-header";
import PostButtons from "@/components/post/post-buttons";
import PostContent from "@/components/post/post-content";
import PostSidebar from "@/components/post/post-sidebar";
import NewBanner from "@/components/newBanner";

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

const PostPage = () => {
    const { authToken } = useAuth();
    const [post, setPost] = useState<Post | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);
    const params = useParams();

    useEffect(() => {
        const postId = params.id;
        if (!postId) {
            setError(true);
            return;
        }
        fetchPost(postId as string, setPost, setLoading, setError);
    }, []);

    useEffect(() => {
        const fetchPosts = async () => {
            const posts = await getPosts({
                size: 5,
                page: 0,
            });
            setPosts(posts.data);
        };
        fetchPosts();
    }, []);

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

    if (error) {
        return <NotFound />;
    }

    return (
        <>
            <div>
                <NewBanner medias={post?.media || []}/>
                <div className="bg-white rounded-t-[60px] -mt-12 relative z-50 shadow-2xl shadow-gray-800">
                    <div className="grid grid-cols-2 gap-4 p-6">
                        <PostHeader post={post as Post} />
                        <PostButtons postId={String(post?.id)} onShare={handleShare} postIdUser={post?.userId} />
                        <PostContent post={post} />
                        <PostSidebar posts={posts} />
                    </div>
                </div>
            </div>
        </>
    );
};

export default PostPage;