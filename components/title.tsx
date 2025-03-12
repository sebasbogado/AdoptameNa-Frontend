import clsx from "clsx";
import Link from "next/link";
import React from "react";
import { titleColor, titleText } from "../types/title"

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
            <div className="flex items-center px-10">
                <h1 className={clsx(colorClass, "font-bold text-lg")}>{text}</h1>
                <span className={clsx(colorClass, "material-symbols-outlined font-material")}>
                    chevron_right
                </span>
            </div>
        </Link>
    );
};

export default Title;
