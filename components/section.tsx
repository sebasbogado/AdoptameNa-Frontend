import PetCard from "@/components/petCard/pet-card";
import Title from "./title";

import { titleText } from "../types/title"
import { Post } from "@/types/post";
import { Pet } from "@/types/pet";
import AddPet from "./buttons/add-pet";
import { usePathname } from "next/navigation";
import { Product } from "@/types/product";

interface SectionProps {
    title: string;
    postTypeName?: keyof typeof titleText;
    path: string;
    items: (Post | Pet | Product)[];
    loading: boolean;
    error: Boolean;
    itemType: "post" | "pet" | "product"; // Nuevo prop para diferenciar el tipo de item

}

export function Section({ title, postTypeName, path, items, loading, error, itemType}: SectionProps) {
    const pathName = usePathname()
    const insertAddButton = itemType === "pet" && pathName === "/profile";

    return (
        <div className="mt-12 ml-6">
            <Title title={title} postType={postTypeName} path={path}></Title>

            {loading ? (
                <p className="text-gray-500">Cargando {title.toLowerCase()}...</p>
            ) : error ? (
                <p className="text-red-500">No se pudieron cargar los datos</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 gap-8 mt-2 p-2">
                    {items.map((item) => {
                        if (itemType === "post" || itemType === "product") {
                            return (
                                <PetCard post={item} isPost key={item.id} />
                            );
                        } else if (itemType === "pet") {
                            return (
                                <PetCard post={item} key={item.id} />
                            );
                        }
                        
                        return null;
                    })}
                       {
                        insertAddButton && (
                            <AddPet/>
                        )
                    }
                </div>
            )}
        </div>
    );
}