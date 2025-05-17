'use client'

import React, { useEffect, useState } from "react";
import clsx from "clsx";
import CardImage from "@/components/petCard/card-image";
import Link from "next/link";
import { Crowdfunding } from "@/types/crowfunding-type";
import CrowdfundingCardText from "./card-text";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { getFullUser } from "@/utils/user-profile.http";

type CrowdfundingCardProps = {
    item: Crowdfunding;
    className?: string
};

export default function CrowdfundingCard({ item, className }: CrowdfundingCardProps) {
    const { user } = useAuth();
    const router = useRouter();

    const [authorName, setAuthorName] = useState("");

    useEffect(() => {
        const fetchUserData = async () => {
            if (!item.id) return;
            try {
                const response = await getFullUser(item.id.toString());
                setAuthorName(response.fullName);
            } catch (error) {
                console.error("Error fetching user profile:", error);
            }
        }
        fetchUserData();

    }, [user, router]);

    return (
        <div className={clsx(
            "snap-start shrink-0 w-[16rem] h-[19rem] rounded-3xl overflow-hidden bg-white drop-shadow-md flex flex-col relative",
            className
        )}>
            <Link href={`/profile/${item.userId}`}>
                <CardImage />
                <CrowdfundingCardText item={item} authorName={authorName} />
            </Link>

        </div>
    );
}
