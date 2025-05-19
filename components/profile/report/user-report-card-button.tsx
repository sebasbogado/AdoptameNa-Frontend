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
  pathname === `/profile/report/pets/${post.id}` ||
  pathname === `/profile/report/products/${post.id}`;

  return (
    <div
      className={clsx(
        "w-64 rounded-xl overflow-hidden bg-white drop-shadow-md flex flex-col relative",
        className
      )}
    >
      <PetCard post={post} isPost={isPost} />

      {!isDetailPage && (
        <div className="m-4 flex justify-between items-center ">
          {/* Estado a la izquierda */}
          {"isBanned" in post && (
            <span className={clsx("text-sm font-semibold", post.isBanned ? "text-red-600" : "text-green-600")}>
              {post.isBanned ? "Bloqueada" : "No Bloqueada"}
            </span>
          )}

          {/* Botón a la derecha */}
          <Link
            href={
              isPost
                ? `${pathname}/${post.id}`
                : `${pathname}/${post.id}`
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
