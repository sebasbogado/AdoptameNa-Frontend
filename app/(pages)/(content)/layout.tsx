import Navbar from "@components/navbar";
import React from "react";

export default function ContentLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col">
            <Navbar />
            {children}
        </div>
    )
}