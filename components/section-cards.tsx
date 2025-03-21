import { Pet } from "@/types/pet";
import { Post } from "@/types/post";
import { titleText } from "@/types/title";
interface SectionCardsProps {
    items: any[];
    postTypeName?: keyof typeof titleText;
    itemType?: "post" | "pet";
    filterByType: boolean;
    children: (item: Post | Pet) => React.ReactNode; 
}

export function SectionCards({ children, items, postTypeName, filterByType = true, itemType }: SectionCardsProps) {

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 gap-8 mt-2 p-2">
            {items
                .map((item) => (
                    <div key={item.id || item.someUniqueIdentifier}>
                        {children(item)}
                    </div>
                ))}
            
        </div>
    );
}
