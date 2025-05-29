import PetCard from "@/components/petCard/pet-card";
import { Pet } from "@/types/pet";
import { Post } from "@/types/post";

interface PostSidebarProps {
    posts?: Post[];
    pets?: Pet[];
}

const PostSidebar = ({ posts, pets }: PostSidebarProps) => {
    return (
        <section className="mt-8 md:mt-0">
            <h2 className="px-2 sm:px-4 md:px-0 md:pl-12 text-xl sm:text-2xl text-gray-700 my-4">
                {posts
                    ? "Posts relacionados"
                    : (pets?.length ?? 0) > 0
                        ? `Otros peluditos: ${pets?.[0]?.petStatus.name ?? ""}`
                        : "No hay datos de mascotas disponibles"}
            </h2>
            {
                posts ?
                    posts.length > 0 && (
                        <div className="px-2 sm:px-4 md:px-0 md:pl-12 text-gray-700">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 gap-y-6 md:gap-y-10">
                                {posts.map((post) => (
                                    <PetCard key={post.id} post={post} isPost />
                                ))}
                            </div>
                        </div>
                    )
                    :
                    pets && pets.length > 0 && (
                        <div className="px-2 sm:px-4 md:px-0 md:pl-12 text-gray-700">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 gap-y-6 md:gap-y-10">
                                {pets.map((pet) => (
                                    <PetCard key={pet.id} post={pet} />
                                ))}
                            </div>
                        </div>
                    )
            }
        </section>
    );
};

export default PostSidebar;