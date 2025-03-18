'use client';
import Loading from "@/app/loading";
import NotFound from "@/app/not-found";
import Banners from "@/components/banners";
import { Comments } from "@/components/comments/comments";
import Footer from "@/components/footer";
import PetCard from "@/components/petCard/pet-card";
import PostButtons from "@/components/post/post-buttons";
import { PostHeader } from "@/components/post/post-header";
import { useAuth } from "@/contexts/authContext";
import { User } from "@/types/auth";
import { Comment } from "@/types/comment";
import { Post } from "@/types/post";
import { addComment, addReply, getComments, resetComments, toggleLike, toggleReport } from "@/utils/comments-client";
import { getPosts } from "@/utils/posts-api";
import { getPost } from "@/utils/posts.http";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";


const MapWithNoSSR = dynamic(
    () => import('@/components/post/post-map'),
    {
        ssr: false,
        loading: () => <div className="flex-grow h-[40vh] rounded-lg overflow-hidden border flex items-center justify-center">Cargando mapa...</div>
    }
);


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
    const { user, loading: userLoading } = useAuth();
    const [post, setPost] = useState<Post | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);
    const params = useParams();
    const [comments, setComments] = useState<Comment[]>([]);
    const [commentsLoading, setCommentsLoading] = useState<boolean>(true);

    // Seccion de comentarios 
    useEffect(() => {
        setComments(getComments());
        setCommentsLoading(false);
    }, []);

    const handleAddComment = (content: string) => {
        const updatedComments = addComment(content, user as User);
        setComments(updatedComments);
    };

    const handleLike = (commentId: string) => {
        const updatedComments = toggleLike(commentId);
        setComments(updatedComments);
    };

    const handleReport = (commentId: string) => {
        const updatedComments = toggleReport(commentId);
        setComments(updatedComments);
    };

    const handleReply = (commentId: string, content: string) => {
        const updatedComments = addReply(commentId, content, user as User);
        setComments(updatedComments);
    };



    /// Seccion mapa
    const coordinates = post?.locationCoordinates?.split(',').map(coord => parseFloat(coord.trim())) ?? [];

    // Asegurarse de que tenemos exactamente dos coordenadas válidas
    const validCoordinates = coordinates.length === 2 &&
        !isNaN(coordinates[0]) &&
        !isNaN(coordinates[1]);

    useEffect(() => {
        const postId = params.id;
        if (!postId) {
            setError(true);
            return;
        }
        fetchPost(postId as string, setPost, setLoading, setError);
    }, []);



    //Obetner los posts similares
    useEffect(() => {
        const fetchPosts = async () => {
            const posts = await getPosts();
            setPosts(posts);
        };
        fetchPosts();
    }, []);

    if (loading) {
        return Loading();
    }

    if (error) {
        return NotFound();
    }

    return (
        <>
            <div>
                <Banners images={[post?.imageUrl || '/logo.png']} />
                <div className="grid grid-cols-2 gap-4">
                    <PostHeader post={post as Post} />
                    <PostButtons />


                    <section>
                        <div className="left-10 pl-12 text-gray-700">
                            <p className="text-2xl mt-4">
                                {post?.content}
                            </p>
                        </div>
                        <div className="left-10 pl-12 text-gray-700">
                            <h2 className="text-4xl text-gray-700 mt-8">
                                Ubicacion
                            </h2>
                            {validCoordinates ?
                                <MapWithNoSSR location={[coordinates[0], coordinates[1]] as [number, number]} /> :
                                <p className="text-2xl text-gray-700 mt-8">
                                    No se ha proporcionado una ubicación para este post.
                                </p>}
                        </div>

                        {/* Comments section */}
                        {
                            commentsLoading && userLoading ? <div className="max-w-2xl mx-auto py-8 px-4 flex items-center justify-center min-h-[300px]">
                                <div className="text-center">
                                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                                    <p className="mt-2 text-gray-600">Cargando comentarios...</p>
                                </div>
                            </div> :
                                <Comments
                                    comments={comments}
                                    onAddComment={handleAddComment}
                                    onLike={handleLike}
                                    onReport={handleReport}
                                    onReply={handleReply}
                                    currentUser={user}
                                />
                        }
                    </section>

                    {/* Similar Posts */}
                    <section>
                        <h2 className="pl-12 text-4xl text-gray-700 mt-8">
                            Posts similares
                        </h2>
                        {
                            posts.length > 0 && <div className="left-10 pl-12 text-gray-700">
                                <div className="grid grid-cols-2 gap-4">
                                    {posts.map((post) => (
                                        <PetCard key={post.id} post={post} />
                                    ))}
                                </div>
                            </div>
                        }
                    </section>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default PostPage;