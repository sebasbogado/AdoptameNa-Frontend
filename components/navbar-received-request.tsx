"use client"
import { usePathname, useRouter } from "next/navigation";

const navbarReceivedRequestItems = [
    { name: "Adopción", path: "/profile/received-request/adoption" },
    
];

export default function NavbarReceivedRequest() {

    const pathname = usePathname();
    const router = useRouter();

    const handleClick = (path: string) => {
        router.push(path);
    };


    return (
        <div className="hidden items-center gap-12 md:flex">
            {navbarReceivedRequestItems.map((item, index) => (
                    <button
                        key={item.path}
                        onClick={() => handleClick(item.path as string)}
                        className={`text-lg font-bold hover:text-purple-600 focus:outline-none ${(pathname === item.path) ? "text-purple-600" : "text-black"
                            }`}
                    >
                        {item.name}
                    </button>
                )
            )}
        </div>
    );
}