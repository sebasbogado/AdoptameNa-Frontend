'use client';
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Loading from "@/app/loading";
import NotFound from "@/app/not-found";
import { PostHeader } from "@/components/post/post-header";
import PostButtons from "@/components/post/post-buttons";
import PostContent from "@/components/post/post-content";
import PostSidebar from "@/components/post/post-sidebar";
import { Pet } from "@/types/pet";
import { getPet, getPets, sharePet } from "@/utils/pets.http";
import NewBanner from "@/components/newBanner";
import Sensitive from "@/app/sensitive";
import { useAuth } from "@/contexts/auth-context";

const fetchPet = async (id: string, setPet: React.Dispatch<React.SetStateAction<Pet | null>>, setLoading: React.Dispatch<React.SetStateAction<boolean>>, setError: React.Dispatch<React.SetStateAction<boolean>>, setIsSensitive: React.Dispatch<React.SetStateAction<boolean>>) => {
    try {
        setLoading(true);
        const pet = await getPet(id);
        setPet(pet);
        setIsSensitive(pet.hasSensitiveImages);
    } catch (error: any) {
        setError(true);
    } finally {
        setLoading(false);
    }
};

const PostPage = () => {
    const { user, authToken } = useAuth();
    const [pet, setPet] = useState<Pet | null>(null);
    const [pets, setPets] = useState<Pet[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);
    const [isSensitive, setIsSensitive] = useState<boolean>(false);
    const params = useParams();

    useEffect(() => {
        const postId = params.id;
        if (!postId) {
            setError(true);
            return;
        }
        fetchPet(postId as string, setPet, setLoading, setError, setIsSensitive);
    }, []);

    useEffect(() => {
        if (!pet || !pet.petStatus?.id) {
            return;
        }
        const idStatus = pet.petStatus.id;
        const fetchPets = async () => {
            const pets = await getPets({
                size: 5,
                petStatusId: [idStatus]
            });
            setPets(pets.data);
        };
        fetchPets();
    }, [pet]);

    const handleShare = async () => {
        if (!pet || !authToken) return;

        try {
            await sharePet(String(pet.id), authToken);
            setPet(prevPet => {
                if (!prevPet) return null;
                return {
                    ...prevPet,
                    sharedCounter: (prevPet.sharedCounter || 0) + 1
                };
            });
        } catch (error) {
            console.error("Error sharing pet:", error);
        }
    };

    if (loading) {
        return <Loading />;
    }

    if (error) {
        return <NotFound />;
    }

    if (isSensitive && !(pet?.userId === user?.id)) {
        return <Sensitive onContinue={() => setIsSensitive(false)} />
    }

    return (
        <>
            <div>
                <NewBanner medias={pet?.media || []} />
                <div className="bg-white rounded-t-[60px] -mt-10 md:-mt-12 relative z-10 shadow-2xl shadow-gray-800">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 md:p-6">
                        <div className="col-span-1 md:col-span-2 flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-0">
                            <PostHeader pet={pet as Pet} />
                            <div className="ml-auto">
                                <PostButtons
                                    isPet={true}
                                    postId={String(pet?.id)}
                                    postIdUser={pet?.userId}
                                    petStatus={pet?.petStatus}
                                    onShare={handleShare}
                                />
                            </div>
                        </div>
                        <div className="col-span-1 md:col-span-1">
                            <PostContent pet={pet} />
                        </div>
                        <div className="hidden md:block md:col-span-1">
                            <PostSidebar pets={pets} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PostPage;