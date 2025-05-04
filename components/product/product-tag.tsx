import { capitalizeFirstLetter, formatNumber } from "@/utils/Utils";
import clsx from "clsx";
import Button from "../buttons/button";

interface ProductTagProps {
  label: string;
  isPrice?: boolean;
}
const tagsBaseClass = "inline-flex items-center justify-center rounded-md px-2 py-1 text-base ring-1 ring-inset cursor-default mb-3 bg-indigo-50 text-[#4781FF]"


export const ProductTag = ({ label, isPrice = false }: ProductTagProps) => {
  return (
    <>
      {isPrice ? (
        <Button variant="tertiary" size="sm" className="mb-3 border-2 border-[#9747FF] cursor-default">
          <span className="text-2xl font-bold">{formatNumber(parseInt(label))}</span>
        </Button>
      ) : (
        <div
          className={clsx(tagsBaseClass)}>
          <span>{capitalizeFirstLetter(label)}</span>
        </div>
      )}
    </>
  )
}