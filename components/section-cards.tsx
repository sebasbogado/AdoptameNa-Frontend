import { Pet } from "@/types/pet";
import { Post } from "@/types/post";
import { titleText } from "@/types/title";
interface SectionCardsProps {
    item: any;
    postTypeName?: keyof typeof titleText; //no se usa
    itemType?: "post" | "pet"; //no se usa
    filterByType: boolean; //no se usa
    children: React.ReactNode;
}

export function SectionCards({ children, item, postTypeName, filterByType = true, itemType }: SectionCardsProps) {

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 gap-8 mt-2 p-2">
            {children}
        </div>

    );
}
