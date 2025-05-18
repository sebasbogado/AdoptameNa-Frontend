'use client'
import { UserAvatar } from "@/components/ui/user-avatar";
import { Post } from "@/types/post";
import { useEffect, useState } from "react";
import { getPost, getPosts, sharePost } from "@/utils/posts.http";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import Loading from "@/app/loading";
import NotFound from "@/app/not-found";
import { formatLongDate } from "@/utils/date-format";
import PostTypeTag from "@/components/post/post-type-tag";
import PostButtons from "@/components/post/post-buttons";
import HeaderUser from "@/components/blog/header-user";
import Image from "next/image";
import { MDXEditor } from '@mdxeditor/editor';
const markdownExample = `
# Encabezado nivel 1

## Encabezado nivel 2

**Texto en negrita**

*Texto en cursiva*

**_Negrita y cursiva_**

~~Texto tachado~~

[Enlace a OpenAI](https://www.openai.com)

- Lista con viñetas
  - Subítem 1
  - Subítem 2

1. Lista numerada
2. Segundo ítem

\`\`\`js
// Bloque de código en JavaScript
function saludo() {
  console.log("¡Hola mundo!");
}
\`\`\`

> Esto es una cita

---

![Imagen de ejemplo](https://via.placeholder.com/150)
`;
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
    const [posts, setPosts] = useState<Post[]>([]);
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
        <div className="px-4 sm:px-6 md:px-8 lg:px-28 py-8">
            <HeaderUser
                user={user}
                routeUserProfile={routeUserProfile}
                post={post}
            ></HeaderUser>

            <div className="flex justify-end ">
                <PostButtons
                    postId={String(post?.id)}
                    onShare={handleShare}
                    postIdUser={post?.userId}
                    sizeButton="md"
                />
            </div>
            <div className="flex justify-center">
                <h1 className="text-3xl font-bold text-gray-900">{post?.title}</h1>
                
            </div>
            </div>


            );
} 