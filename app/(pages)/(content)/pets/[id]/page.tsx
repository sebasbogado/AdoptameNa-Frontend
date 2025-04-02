'use client';
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Loading from "@/app/loading";
import NotFound from "@/app/not-found";
import { Post } from "@/types/post";
import { useAuth } from "@/contexts/auth-context";
import { getPosts } from "@/utils/posts-api";

import Banners from "@/components/banners";
import Footer from "@/components/footer";
import { PostHeader } from "@/components/post/post-header";
import PostButtons from "@/components/post/post-buttons";
import PostContent from "@/components/post/post-content";
import PostSidebar from "@/components/post/post-sidebar";
import { Pet } from "@/types/pet";
import { getPet, getPets } from "@/utils/pets.http";

const fetchPet = async (id: string, setPet: React.Dispatch<React.SetStateAction<Pet | null>>, setLoading: React.Dispatch<React.SetStateAction<boolean>>, setError: React.Dispatch<React.SetStateAction<boolean>>) => {
    try {
        setLoading(true);
        const pet = await getPet(id);
        setPet(pet);
    } catch (error: any) {
        console.log(error);
        setError(true);
    } finally {
        setLoading(false);
    }
};

const PostPage = () => {
    const { user, loading: userLoading } = useAuth();
    const [pet, setPet] = useState<Pet | null>(null);
    const [pets, setPets] = useState<Pet[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);
    const params = useParams();

    useEffect(() => {
        const postId = params.id;
        if (!postId) {
            setError(true);
            return;
        }
        fetchPet(postId as string, setPet, setLoading, setError);
    }, []);

    useEffect(() => {
        const fetchPosts = async () => {
            const posts = await getPets();
            setPets(posts);
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
                <Banners images={[pet?.urlPhoto || '/logo.png']} className="h-[550px]" />
                <div className="bg-white rounded-t-[60px] -mt-12 relative z-10 shadow-2xl shadow-gray-800">
                    <div className="grid grid-cols-2 gap-4 p-6">
                        <PostHeader pet={pet as Pet} />
                        <PostButtons isPet postId={String(pet?.id)}/>

                        <PostContent pet={pet} />
                        <PostSidebar pets={pets} />
                    </div>
                </div>
            </div>
        </>
    );
};

export default PostPage;