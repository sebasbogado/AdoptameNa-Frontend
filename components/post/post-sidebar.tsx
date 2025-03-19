import PetCard from "@/components/petCard/pet-card";
import { Post } from "@/types/post";

interface PostSidebarProps {
    posts: Post[];
}

const PostSidebar = ({ posts }: PostSidebarProps) => {
    return (
        <section className="mt-8 ml-16">
            <h2 className="pl-12 text-2xl text-gray-700 my-4">
                Posts similares
            </h2>
            {
                posts.length > 0 && (
                    <div className="left-10 pl-12 text-gray-700">
                        <div className="grid grid-cols-2 gap-4">
                            {posts.map((post) => (
                                <PetCard key={post.id} post={post} />
                            ))}
                        </div>
                    </div>
                )
            }
        </section>
    );
};

export default PostSidebar;