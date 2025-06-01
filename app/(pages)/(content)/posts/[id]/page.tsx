'use client';
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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
import { POST_TYPEID } from "@/types/constants";
import Sensitive from "@/app/sensitive";

const fetchPost = async (id: string, setPost: React.Dispatch<React.SetStateAction<Post | null>>, setLoading: React.Dispatch<React.SetStateAction<boolean>>, setError: React.Dispatch<React.SetStateAction<boolean>>, setIsSensitive: React.Dispatch<React.SetStateAction<boolean>>) => {
    try {
        setLoading(true);
        const post = await getPost(id);
        setPost(post);
        setIsSensitive(post.hasSensitiveImages);
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
    const [isSensitive, setIsSensitive] = useState<boolean>(false);
    const params = useParams();
    const router = useRouter();
    const [isRedirecting, setIsRedirecting] = useState(false); // Nuevo estado

    useEffect(() => {
        const postId = params.id;
        if (!postId) {
            setError(true);
            return;
        }
        fetchPost(postId as string, setPost, setLoading, setError, setIsSensitive);
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
    useEffect(() => {
        if (post && POST_TYPEID.BLOG === post.postType.id) {
            setIsRedirecting(true);

            router.push(`/blog/${post.id}`);
        }
    }, [post]);
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

    if (isRedirecting || loading) {
        return <Loading />;
    }

    if (error) {
        return <NotFound />;
    }

    if (isSensitive) {
        return <Sensitive onContinue={() => setIsSensitive(false)} />
    }

    return (
        <>
            <div>
                <NewBanner medias={post?.media || []} />
                <div className="bg-white rounded-t-[60px] -mt-10 md:-mt-12 relative z-10 shadow-2xl shadow-gray-800">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 md:p-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start col-span-1 md:col-span-2 gap-4 sm:gap-0">
                            <PostHeader post={post as Post} />
                            <div className="ml-auto">
                                <PostButtons
                                    postId={String(post?.id)}
                                    onShare={handleShare}
                                    postIdUser={post?.userId}
                                />
                            </div>
                        </div>
                        <div className="col-span-1 md:col-span-1">
                            <PostContent post={post} />
                        </div>
                        <div className="hidden md:block md:col-span-1">
                            <PostSidebar posts={posts} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PostPage;