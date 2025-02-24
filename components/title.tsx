import clsx from "clsx";
import Link from "next/link";
import React from "react";

interface TitleProps {
    title: string;
    path: string;
}

const titleColors: Record<string, string> = {
    adoption: "text-adoption",
    missing: "text-missing",
    volunteering: "text-volunteering",
    blog: "text-blog",
    marketplace: "text-marketplace"
};

const titleText: Record<string, string> = {
    adoption: "En adopción",
    missing: "Extraviados",
    volunteering: "Voluntariado",
    blog: "Blog",
    marketplace: "Tienda"
};

const Title: React.FC<TitleProps> = ({ title, path }) => {
    return (
        <Link href={path}>
            <div className="flex items-center">
                <h1 className={clsx(titleColors[title], "font-bold text-lg")}>
                    {titleText[title]}</h1>
                <span className={clsx(titleColors[title], "material-symbols-outlined font-material")}>chevron_right</span>
            </div>
        </Link>
    )
};

export default Title;
