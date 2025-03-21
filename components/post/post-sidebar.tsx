import PetCard from "@/components/petCard/pet-card";
import { Pet } from "@/types/pet";
import { Post } from "@/types/post";

interface PostSidebarProps {
    posts?: Post[];
    pets?: Pet[];
}

const PostSidebar = ({ posts, pets }: PostSidebarProps) => {
    return (
        <section className="mt-8 ml-16">
            <h2 className="pl-12 text-2xl text-gray-700 my-4">
                {posts ? "Posts relacionados" : "Otros peluditos en adopción"}
            </h2>
            {
                posts ?
                    posts.length > 0 && (
                        <div className="left-10 pl-12 text-gray-700">
                            <div className="grid grid-cols-2 gap-4">
                                {posts.map((post) => (
                                    <PetCard key={post.id} post={post} isPost={true} />
                                ))}
                            </div>
                        </div>
                    )
                    :
                    pets && pets.length > 0 && (
                        <div className="left-10 pl-12 text-gray-700">
                            <div className="grid grid-cols-2 gap-4">
                                {pets.map((pet) => (
                                    <PetCard key={pet.id} post={pet} isPost={true} />
                                ))}
                            </div>
                        </div>
                    )
            }
        </section>
    );
};

export default PostSidebar;