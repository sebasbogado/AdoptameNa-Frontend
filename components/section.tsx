import PetCard from "@/components/petCard/pet-card";
import Title from "./title";

import { titleText } from "../types/title"
import { Post } from "@/types/post";
import { Pet } from "@/types/pet";
import { SectionCards } from "./section-cards";

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
    return (
        <div className="mt-12 ml-6">
            <Title title={title} postType={postTypeName} path={path}></Title>

            {loading ? (
                <p className="text-gray-500">Cargando {title.toLowerCase()}...</p>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : (
                <SectionCards items={items} itemType={itemType} filterByType={filterByType} postTypeName={postTypeName}>
                {(item) => <PetCard key={item.id} post={item} />}
                 </SectionCards>
                 
                // <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 gap-8 mt-2 p-2">
                //     {items
                //         .filter((item) => itemType === "pet" || ("postTypeName" in item && (!filterByType || item.postTypeName === postTypeName))) 
                //         .slice(0, 5)
                //         .map((item) => (
                //             <PetCard key={item.id} post={item} />
                //         ))}
                //     <SectionCards items= {items} itemType={itemType} filterByType={filterByType} postTypeName={postTypeName} ></SectionCards>
                // </div>
            )}
        </div>
    );
}