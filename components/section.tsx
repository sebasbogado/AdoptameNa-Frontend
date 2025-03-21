import PetCard from "@/components/petCard/pet-card";
import Title from "./title";

import { titleText } from "../types/title"
import { Post } from "@/types/post";
import { Pet } from "@/types/pet";

interface SectionProps {
    title: string;
    postTypeName?: keyof typeof titleText;
    path: string;
    items: (Post | Pet)[];
    loading: boolean;
    error: string | null;
    filterByType?: boolean;
    itemType: "post" | "pet"; // Nuevo prop para diferenciar el tipo de item
}

export function Section({ title, postTypeName, path, items, loading, error, filterByType = true, itemType }: SectionProps) {
    const filteredItems = filterByType && itemType === "post"
        ? items.filter((item) => {
            if ("postType" in item && item.postType.name === postTypeName) {
                return true;
            }
            return false;
        })
        : items;

    return (
        <div className="mt-12 ml-6">
            <Title title={title} postType={postTypeName} path={path}></Title>

            {loading ? (
                <p className="text-gray-500">Cargando {title.toLowerCase()}...</p>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 gap-8 mt-2 p-2">
                    {filteredItems.map((item) => {
                        if (itemType === "post") {
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
                </div>
            )}
        </div>
    );
}