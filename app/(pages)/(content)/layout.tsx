import Navbar from "@components/navbar";

export default function ContentLayout({children}){
    return(
        <div className="flex flex-col">
            <Navbar/>
            {children}
        </div>
    )
}