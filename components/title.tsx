import clsx from "clsx";
import Link from "next/link";
import React from "react";
import { titleColor, titleText } from "../types/title"
import { ChevronRight } from "lucide-react";

interface TitleProps {
    title?: string;
    postType?: keyof typeof titleText;
    path: string;
}

const Title: React.FC<TitleProps> = ({ title, postType, path }) => {

    const colorClass = titleColor[postType as keyof typeof titleColor] ?? titleColor.default;
    const text = title ?? titleText[postType as keyof typeof titleText] ?? titleText.default;

    return (
        <Link href={path}>
            <div className="flex items-center ">
                <h1 className={clsx(colorClass, "font-bold text-lg lg:text-xl xl:text-2xl ")}>{text}</h1>
                <ChevronRight className={clsx(colorClass, "w-5 h-5")} strokeWidth={2} />
               
            </div>
        </Link>
    );
};

export default Title;
