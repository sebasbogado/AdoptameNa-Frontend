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
import BlogContent from "@/components/blog/blog-content";
import PostComments from "@/components/post/post-comments";

const markdownExample = `# 🐶 El Fascinante Mundo de los Perros

## Introducción

¡Cuidado con lo que come tu peludo! comidas prohibidas para perros 🐶
---

## 🧠 Inteligencia Canina

> "Los perros no son toda nuestra vida, pero hacen nuestras vidas completas."  
> — Roger Caras

La inteligencia de los perros varía según la raza y el entrenamiento. Algunas de las razas más inteligentes incluyen:

- **Border Collie**: Conocidos por su capacidad para aprender comandos rápidamente.
- **Poodle (Caniche)**: Altamente entrenables y excelentes en competencias.
- **Pastor Alemán**: Utilizados en fuerzas policiales y de rescate por su agudeza mental.

---
## 🐾 Un perrito feliz

![Un perrito adoptado](https://adoptamena-api.rodrigomaidana.com/media/66fa929b-47fd-4edb-adcb-7524ea76220a.webp)

Este perrito encontró un nuevo hogar gracias a la comunidad.


## 🐕‍🦺 Razas Populares

1. **Labrador Retriever**: Amigables y excelentes para familias.
2. **Bulldog Francés**: De tamaño compacto y gran personalidad.
3. **Golden Retriever**: Leales y fáciles de entrenar.

---

## 🏃‍♂️ Actividades y Ejercicio

Es esencial proporcionar ejercicio diario a los perros para mantener su salud física y mental. Algunas actividades recomendadas:

- Paseos diarios de al menos 30 minutos.
- Juegos de búsqueda con pelotas o frisbees.
- Entrenamiento de agilidad en circuitos diseñados para perros.

---

## 🧼 Cuidado y Aseo

El cuidado adecuado incluye:

- **Baños regulares**: Utilizar champús específicos para perros.
- **Cepillado**: Dependiendo del tipo de pelaje, puede ser diario o semanal.
- **Revisiones veterinarias**: Al menos una vez al año para chequeos generales.

---

## 🐾 Conclusión

Los perros aportan alegría, compañía y amor incondicional. Cuidarlos adecuadamente garantiza una relación armoniosa y duradera.

---

¿Tienes una raza favorita o una anécdota con tu perro que quieras compartir? ¡Déjala en los comentarios!

`

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
                    blogContent={markdownExample}
                />
              
                   <div className="mt-9 mb-10">
                <PostComments authToken={authToken ?? undefined} user={user} userLoading={userLoading} referenceId={post?.id as number} referenceType={"POST"} />
                </div>
            </div>
        </div>
    );
}