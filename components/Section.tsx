import { ChevronRightIcon } from "@heroicons/react/24/outline";
import PetCard from "@/components/petCard/petCard";
import Title from "./title";

import {titleText } from "../types/titles"

interface SectionProps {
  title: string;
  postType: keyof typeof titleText;
  path: string;
  items: any[]; 
  loading: boolean;
  error: string | null;
}

export default function Section({ title, postType, path, items, loading, error }: SectionProps) {
  return (
    <div className="mt-12 ml-6">
        <Title title={title} postType={postType} path={path}></Title>

      {loading ? (
        <p className="text-gray-500">Cargando {title.toLowerCase()}...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 gap-8 mt-2 p-2">
          {items.slice(0, 5).map((post) => (
            <PetCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
