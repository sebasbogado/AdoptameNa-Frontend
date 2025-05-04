import { capitalizeFirstLetter } from "@/utils/Utils";
import clsx from "clsx";

interface ProductTagProps {
  label: string;
  isPrice?: boolean;
}
const tagsBaseClass = "inline-flex items-center justify-center rounded-md px-2 py-1 text-base ring-1 ring-inset cursor-default mb-3"

export const ProductTag = ({ label, isPrice = false }: ProductTagProps) => {
  return (
    <div
      className={clsx(tagsBaseClass, {
        "border-missing-tag bg-missing-tag p-7 text-xl": isPrice,
        "bg-indigo-50 text-[#4781FF]": !isPrice,
      })}>
      <span>{capitalizeFirstLetter(label)}</span>
    </div>
  )
}