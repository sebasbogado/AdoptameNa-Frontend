'use client'

import React from "react";
import { Crowdfunding } from "@/types/crowfunding-type";
import OrganizationTag from "./tag";

interface props {
    item: Crowdfunding,
    authorName?: string,
    className?: string,
}

const CrowdfundingCardText = ({ item, className = "", authorName }: props) => {
    const hardcodedTags = [
        { iconType: "star", value: "Organization" },
        { iconType: "handHelp", value: "Colecta" },
    ];
    const progress = item.goal > 0 ? (item.currentAmount / item.goal) * 100 : 0;

    return (
        <div className="px-2 py-2 flex flex-col bg-white rounded-lg card-text">
            <div className="flex flex-col gap-1">
                <p className="text-lg md:text-base lg:text-lg font-semibold max-h-7 truncate text-ellipsis">{item.title}</p>
                <p className="text-xs text-blue-gray-700">{authorName}</p>
                {item.goal > 0 && (
                    <div className="flex flex-row items-center gap-x-3">
                        <div className="flex-1 h-2 bg-[#EEF2FA] rounded-full relative overflow-hidden">
                            <div
                                className="h-2 bg-[#5B82FF] rounded-full transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                        <span className="text-xs text-text-secondary">Gs. {item.goal.toLocaleString('es-ES')}</span>
                    </div>
                )}
                <div className="flex flex-wrap max-h-16 overflow-hidden gap-1">
                    {(
                        hardcodedTags.map((tag) => (
                            <OrganizationTag
                                key={tag.value}
                                iconType={tag.iconType}
                                value={tag.value}
                            />
                        ))
                    )}
                </div>
                
                <p className="text-base md:text-sm lg:text-sm h-16 overflow-clip text-ellipsis">{item.description} </p>
            </div>
        </div>
    );
};

export default CrowdfundingCardText;

