'use client';
import React from "react";
import clsx from "clsx";
import PetCard from "@/components/petCard/pet-card";
import Link from "next/link";
import Button from "@/components/buttons/button";
import { EyeIcon } from "lucide-react";
import { usePathname } from "next/navigation";

type PetCardProps = {
  post: any;
  className?: string;
  isPost?: boolean;
};

export default function UserReportCardButtons({
  post,
  className,
  isPost,
}: PetCardProps) {
  const pathname = usePathname();

  const isDetailPage =
  pathname === `/profile/report/posts/${post.id}` ||
  pathname === `/profile/report/pets/${post.id}`;

  return (
    <div
      className={clsx(
        "w-64 rounded-xl overflow-hidden bg-white drop-shadow-md flex flex-col relative",
        className
      )}
    >
      <PetCard post={post} isPost={isPost} />

      {!isDetailPage && (
        <div className="m-4 flex justify-center">
          <Link
            href={
              isPost
                ? `/profile/report/posts/${post.id}`
                : `/profile/report/pets/${post.id}`
            }
          >
            <Button size="sm" className="flex items-center justify-center">
              <EyeIcon className="w-5 h-5 mr-2 text-white" strokeWidth={3} />
              Ver Reportes
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
