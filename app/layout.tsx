import { Metadata } from "next";
import { Roboto } from "next/font/google";
import "@/styles/globals.css";
import { AuthProvider } from "@/contexts/auth-context";
const roboto = Roboto({ subsets: ["latin"], weight: ["300", "400", "500", "700"] });

export const metadata: Metadata = {
  title: "AdoptameNa",
  description: "Proyecto de IngeSoft 2",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="es">


      <body className={roboto.className}>
        <AuthProvider>
          {children}

        </AuthProvider>
      </body>

    </html>
  );
}
