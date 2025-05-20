import PetCard from "@/components/petCard/pet-card";
import Title from "./title";

import { titleText } from "../types/title"
import { Post } from "@/types/post";
import { Pet } from "@/types/pet";
import AddPet from "./buttons/add-pet";
import { usePathname } from "next/navigation";
import { Product } from "@/types/product";
import ProductCard from "./product-Card/product-card";
import BlogCard from "./blog/blog-card";

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
    const insertAddButton = itemType === "pet" && pathName === "/profile";

    return (
<div
  className={`
    w-full 
    mt-6  md:mt-12
    ${itemType === "blog" ? "bg-white shadow-[0_0_20px_rgba(0,0,0,0.1)] rounded-2xl p-6" : "ml-6"}
  `}
>            <Title title={title} postType={postTypeName} path={path} />

            {loading ? (
                <p className="text-gray-500">Cargando {title.toLowerCase()}...</p>
            ) : error ? (
                <p className="text-red-500">No se pudieron cargar los datos</p>
            ) : (
                <>
                   {itemType === "blog" && (
            <div
                className="
                flex 
                overflow-x-auto  
                gap-10
                mt-2
                p-2
                snap-x 
                snap-mandatory
                flex-nowrap    
                scrollbar-light
                "
            >
                            {items.map((item) => (
                            <div key={item. id} className="snap-start min-w-[clamp(180px,50%,640px)]">
                                    <BlogCard post={item as Post}  />
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

                            {insertAddButton && <AddPet />}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}