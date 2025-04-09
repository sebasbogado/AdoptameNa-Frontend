import React from "react";

export default function ContentLayout({ children }: { children: React.ReactNode }) {
    return (<>
        <div className="">
            {children}
        </div>
        </>
    )
}