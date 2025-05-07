'use client'
import React from "react";
import clsx from "clsx";
import PetCard from "@/components/petCard/pet-card";
import ReportCommentCard from "@/components/administration/report/report-comment-card";
import Link from "next/link";
import Button from "@/components/buttons/button";
import { CheckIcon, EyeIcon, XIcon } from "lucide-react";
import { Post } from "@/types/post";
import { Comment } from "@/types/comment";

type CardButtonProps = {
    post?: any;
    comment?: Comment;
    className?: string;
    isReportedPage?: boolean;
    handleAprove?: () => void;
    handleDesaprove?: () => void;
    type: string; // 'post', 'pet', 'product', or 'comment'
    isPost?: boolean;
};

export default function CardButtons({
    post,
    comment,
    className,
    isReportedPage,
    handleAprove,
    handleDesaprove,
    type,
    isPost = true,
}: CardButtonProps) {
    const getReportLinkHref = () => {
        switch (type) {
            case "pet":
                return `/administration/report/pets/${post?.id}`;
            case "product":
                return `/administration/report/products/${post?.id}`;
            case "post":
                return `/administration/report/posts/${post?.id}`;
            case "comment":
                return `/administration/report/comments/${comment?.id}`;
            default:
                return "#";
        }
    };

    return (
        <div className={clsx("w-64 rounded-xl overflow-hidden bg-white drop-shadow-md flex flex-col relative", className)}>
            {type === "comment" && comment ? (
                <div onClick={(e) => e.stopPropagation()}>
                    <ReportCommentCard comment={comment} />
                </div>
            ) : (
                post && (
                    <div onClick={(e) => e.stopPropagation()}>
                        <PetCard post={post} isPost={isPost} />
                    </div>
                )
            )}
            {isReportedPage ? (
                <div className="m-4 flex gap-2 justify-center">
                    <Button size="sm" onClick={handleAprove} className="flex items-center justify-center">
                        <CheckIcon className="w-3 h-3 mr-2 text-white" strokeWidth={4} />
                        Mantener
                    </Button>
                    <Button variant="danger" size="sm" onClick={handleDesaprove} className="flex items-center justify-center">
                        <XIcon className="w-3 h-3  mr-2 text-white" strokeWidth={4} />
                        Bloquear
                    </Button>
                </div>
            ) : (
                <div className="m-4 flex justify-center">
                    <Link href={getReportLinkHref()}>
                        <Button size="sm" className="flex items-center justify-center">
                            <EyeIcon className="w-5 h-5 mr-2 text-white" strokeWidth={3} />
                            Ver razones
                        </Button>
                    </Link>
                </div>
            )}
        </div>
    );
}
