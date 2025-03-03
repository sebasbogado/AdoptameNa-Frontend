import { ChevronRightIcon } from "@heroicons/react/24/outline";
import PetCard from "@/components/petCard/petCard";

interface SectionProps {
  title: string;
  items: any[]; 
  loading: boolean;
  error: string | null;
}

export default function Section({ title, items, loading, error }: SectionProps) {
  return (
    <div className="mt-12">
      <div className="flex items-center">
        <h2 className="text-4xl font-semibold text-blue">{title}</h2>
        <ChevronRightIcon className="w-8 h-10 text-blue" />
      </div>

      {loading ? (
        <p className="text-gray-500">Cargando {title.toLowerCase()}...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 gap-8 mt-2 p-2">
          {items.map((post) => (
            <PetCard key={post.postId} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
