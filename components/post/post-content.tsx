import PostLocationMap from "@/components/post/post-location-map";
import PostComments from "@/components/post/post-comments";
import { Post } from "@/types/post";
import { useAuth } from "@/contexts/auth-context";
import { Pet } from "@/types/pet";

interface PostContentProps {
    post?: Post | null;
    pet?: Pet | null;
}

const PostContent = ({ post, pet }: PostContentProps) => {
    const { user, loading: userLoading, authToken } = useAuth();
    const isPost = !!post;

    return (
        <section>
            <div className="left-10 pl-12 text-gray-700">
                <p className="text-3xl mt-4">
                    {post?.content || pet?.description}
                </p>
            </div>

            <PostLocationMap location={post?.locationCoordinates || pet?.addressCoordinates} />
            <PostComments authToken={authToken ?? undefined} user={user} userLoading={userLoading} referenceId={isPost ? post?.id : pet?.id as number} referenceType={isPost ? "POST" : "PET"} />
        </section>
    );
};


export default PostContent;