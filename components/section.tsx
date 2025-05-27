import PetCard from "@/components/petCard/pet-card";
import Title from "./title";

import { titleText } from "../types/title"
import { Post } from "@/types/post";
import { Pet } from "@/types/pet";
import AddPet from "./buttons/add-pet";
import AddPost from "./buttons/add-post";
import AddProduct from "./buttons/add-product";
import { usePathname } from "next/navigation";
import { Product } from "@/types/product";
import ProductCard from "./product-Card/product-card";
import BlogCard from "./blog/blog-card";
import { SkeletonCard } from "./ui/skeleton-card";

interface SectionProps {
    title: string;
    postTypeName?: keyof typeof titleText;
    path: string;
    items: (Post | Pet | Product)[];
    loading: boolean;
    error: Boolean;
    itemType: "post" | "pet" | "product" | "blog"; // Nuevo prop para diferenciar el tipo de item

}

export function Section({ title, postTypeName, path, items, loading, error, itemType }: SectionProps) {
    const pathName = usePathname()

    const addButtonColor = {
        pet: "text-[#4781FF] border-[#4781FF] hover:shadow-[0_0_8px_#4781FF]",
        post: "text-[#9747FF] border-[#9747FF] hover:shadow-[0_0_8px_#9747FF]",
        product: "text-[#FF7847] border-[#FF7847] hover:shadow-[0_0_8px_#FF7847]",
        blog: "",
    }[itemType];

    const insertAddButton = (() => {
        if (pathName !== "/profile") return false;

        switch (itemType) {
            case "pet":
            case "post":
            case "product":
                return true;
            default:
                return false;
        }
    })();

    return (
        <div
            className={`
    w-full 
    mt-6  md:mt-12
    ${itemType === "blog" ? "bg-white shadow-[0_0_20px_rgba(0,0,0,0.1)] rounded-2xl p-6" : "ml-6"}
  `}
        >            <Title title={title} postType={postTypeName} path={path} />

            {loading ? (
                <div className="flex gap-11 overflow-x-auto p-2">
                    {Array.from({ length: 5 }).map((_, idx) => (
                        <SkeletonCard
                            key={idx}
                            direction={itemType === "blog" ? "horizontal" : "vertical"}
                            width={itemType === "blog" ? "w-[600px]" : "w-[250px]"}
                            height="h-[290px]"
                        />
                    ))}
                </div>) : error ? (
                    <p className="text-red-500">No se pudieron cargar los datos</p>
                ) : (
                <>
                    {itemType === "blog" && (

                        <div
                            className="
                                        flex 
                                        overflow-x-hidden  
                                        gap-6
                                        mt-2
                                        p-2
                                        snap-x 
                                        snap-mandatory
                                        scrollbar-light
                                        max-w-full
                                "
                        >
                            {items.map((item) => (
                                <div key={item.id} className="snap-start min-w-[clamp(180px,50%,640px)]">
                                    <BlogCard post={item as Post} />
                                </div>
                            ))}
                        </div>
                    )}


                    {/* Para el resto: carrusel horizontal con tarjetas específicas */}
                    {itemType !== "blog" && (
                        <div
                            className="
                                flex 
                                overflow-x-auto 
                                gap-10
                                mt-2 
                                p-2 
                                scrollbar-hide 
                                snap-x 
                                snap-mandatory
                            "
                        >
                            {items.map((item) => {
                                if (itemType === "post") {
                                    return <PetCard post={item} isPost key={item.id} />;
                                } else if (itemType === "pet") {
                                    return <PetCard post={item} key={item.id} />;
                                } else if (itemType === "product") {
                                    return <ProductCard product={item as Product} key={item.id} />;
                                }
                                return null;
                            })}

                            {insertAddButton && (
                                itemType === "pet" ? (
                                    <AddPet className={addButtonColor} />
                                ) : itemType === "post" ? (
                                    <AddPost className={addButtonColor} />
                                ) : itemType === "product" ? (
                                    <AddProduct className={addButtonColor} />
                                ) : null
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}