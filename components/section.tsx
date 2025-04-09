import PetCard from "@/components/petCard/pet-card";
import Title from "./title";

import { titleText } from "../types/title"
import { Post } from "@/types/post";
import { Pet } from "@/types/pet";
import AddPet from "./buttons/add-pet";
import { usePathname } from "next/navigation";

interface SectionProps {
    title: string;
    postTypeName?: keyof typeof titleText;
    petStatusId?: number | string;
    path: string;
    items: (Post | Pet)[];
    loading: boolean;
    error: Boolean;
    filterByType?: boolean;
    itemType: "post" | "pet"; // Nuevo prop para diferenciar el tipo de item

}

export function Section({ title, postTypeName, path, items, loading, error, filterByType = true, itemType, petStatusId }: SectionProps) {
    const pathName = usePathname()
    const filteredItems = (filterByType
        ? items.filter((item) => {
            if (itemType === "post" && "postType" in item) {
              return item.postType.name === postTypeName;
            }
            
            if (itemType === "pet" && "petStatusId" in item) {
              return item.petStatusId === petStatusId;
            }
            
      
            return true;
          })
        : items
      );

    const limitedItems = itemType === "pet" ? filteredItems.slice(0, 4) : filteredItems.slice(0, 5);
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
                    {limitedItems.map((item) => {
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