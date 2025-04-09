"use client";
import { usePathname } from "next/navigation";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Si es la ruta específica, no renderices el layout
  if (pathname === "/auth/create-profile") {
    return <>{children}</>;
  }
  return (
    <div
      className="w-screen h-screen flex justify-center items-center relative bg-cover bg-center"
      style={{ backgroundImage: "url('/andrew-s-ouo1hbizWwo-unsplash.jpg')" }} // Replace with the correct path
    >
      <div className="absolute inset-0 bg-[#9747FF] opacity-50 z-0"></div>
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}