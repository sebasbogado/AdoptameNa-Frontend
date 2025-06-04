import PostLocationMap from "@/components/post/post-location-map";
import PostComments from "@/components/post/post-comments";
import { Post } from "@/types/post";
import { useAuth } from "@/contexts/auth-context";
import { Pet } from "@/types/pet";
import { POST_TYPEID, PET_STATUS } from "@/types/constants";

interface PostContentProps {
    post?: Post | null;
    pet?: Pet | null;
}

const PostContent = ({ post, pet }: PostContentProps) => {
    const { user, loading: userLoading, authToken } = useAuth();
    const isPost = !!post;
    const isPreciseLocation = post?.postType.id === POST_TYPEID.VOLUNTEERING;
    const isAdoption = pet?.petStatus?.id === PET_STATUS.ADOPTION

    return (
        <section className="mt-4 md:mt-0">
            <div className="px-2 sm:px-4 md:pl-12 text-gray-700">
                <p className="text-base sm:text-lg md:text-3xl mt-4">
                    {post?.content || pet?.description}
                </p>
            </div>

            <PostLocationMap location={post?.locationCoordinates || pet?.addressCoordinates} isPreciseLocation={isPreciseLocation || isAdoption}/>
            <PostComments authToken={authToken ?? undefined} user={user} userLoading={userLoading} referenceId={isPost ? post?.id : pet?.id as number} referenceType={isPost ? "POST" : "PET"} />
        </section>
    );
};


export default PostContent;