import { Metadata } from "next";
import { Roboto } from "next/font/google";
import "@styles/globals.css";
import { AppProvider } from "@contexts/appContext";
import { AuthProvider } from "@contexts/authContext";
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
      <head>
        <link rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20,300,0,0" />
      </head>

      <body className={roboto.className}>
        <AuthProvider>
          <AppProvider>{children}</AppProvider>
        </AuthProvider>
      </body>

    </html>
  );
}
