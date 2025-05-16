'use client'

import React from "react";
import clsx from "clsx";
import CardImage from "@/components/petCard/card-image";
import Link from "next/link";
import { Crowdfunding } from "@/types/crowfunding-type";
import CardText from "../petCard/card-text";

type CrowdfundingCardProps = {
    item: Crowdfunding;
    className?: string
};

export default function CrowdfundingCard({ item, className }: CrowdfundingCardProps) {

    return (
        <div className={clsx(
            "snap-start shrink-0 w-[16rem] h-[19rem] rounded-3xl overflow-hidden bg-white drop-shadow-md flex flex-col relative",
            className
        )}>
            <Link href={`/profile/${item.userId}`}>
                    <CardImage />
                    <CardText post={item} />
                </Link>

        </div>
    );
}
