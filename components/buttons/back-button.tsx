"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Button from "./button";

interface BackButtonProps {
  label?: string;
  className?: string;
  path? : string;
}

export default function BackButton({ label = "Volver", path = "",  className = "" }: BackButtonProps) {
  const router = useRouter();

  return (
     <div className="flex justify-start mb-4">
                <Button
                    size="md"
                    onClick={() => path? router.push(path) : router.back()}
                    className="bg-white flex items-center shadow-md text-gray-800"
                >
                    <ArrowLeft className="text-gray-800 mr-2" size={20} />
                        Volver
                </Button>
            </div>  
  );
}
