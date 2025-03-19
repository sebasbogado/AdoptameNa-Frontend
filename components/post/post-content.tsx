import PostLocationMap from "@/components/post/post-location-map";
import PostComments from "@/components/post/post-comments";
import { Post } from "@/types/post";
import { useAuth } from "@/contexts/authContext";

interface PostContentProps {
    post: Post | null;
}

const PostContent = ({ post }: PostContentProps) => {
    const { user, loading: userLoading } = useAuth();

    return (
        <section>
            <div className="left-10 pl-12 text-gray-700">
                <p className="text-3xl mt-4">
                    {post?.content}
                </p>
            </div>

            <PostLocationMap post={post} />
            <PostComments user={user} userLoading={userLoading} />
        </section>
    );
};

export default PostContent;