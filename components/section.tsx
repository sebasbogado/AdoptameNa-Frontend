import PetCard from "@/components/petCard/pet-card";
import Title from "./title";

import { titleText } from "../types/title"
import { Post } from "@/types/post";
import { Pet } from "@/types/pet";
import AddPet from "./buttons/add-pet";
import { usePathname } from "next/navigation";
import { Product } from "@/types/product";
import ProductCard from "./product-Card/product-card";

interface SectionProps {
    title: string;
    postTypeName?: keyof typeof titleText;
    path: string;
    items: (Post | Pet | Product)[];
    loading: boolean;
    error: Boolean;
    itemType: "post" | "pet" | "product"; // Nuevo prop para diferenciar el tipo de item

}

export function Section({ title, postTypeName, path, items, loading, error, itemType }: SectionProps) {
    const pathName = usePathname()
    const insertAddButton = itemType === "pet" && pathName === "/profile";

    return (
        <div className="mt-6 ml-6 md:mt-12  ">
            <Title title={title} postType={postTypeName} path={path}></Title>

            {loading ? (
                <p className="text-gray-500">Cargando {title.toLowerCase()}...</p>
            ) : error ? (
                <p className="text-red-500">No se pudieron cargar los datos</p>
            ) : (
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
            return (
                <PetCard post={item} isPost key={item.id} />
            );
        } else if (itemType === "pet") {
            return (
                <PetCard post={item} key={item.id} />
            );
        } else if (itemType === "product") {
            return <ProductCard product={item as Product} key={item.id} />
        } else {
            return null;
        }
    })}
    {insertAddButton && (
        <AddPet />
    )}
</div>
            )}
        </div>
    );
}