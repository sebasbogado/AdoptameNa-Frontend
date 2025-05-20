import { Metadata } from "next";
import { Roboto } from "next/font/google";
import "@/styles/globals.css";
import { AuthProvider } from "@/contexts/auth-context";
import { FavoritesProvider } from "@/contexts/favorites-context";
import { NotificationProvider } from "@/contexts/notification-context";
import { ChatProvider } from "@/contexts/chat-context";
import { FloatingChatProvider } from "@/contexts/floating-chat-context";
import Script from "next/script";
import { headers } from 'next/headers'

const roboto = Roboto({ subsets: ["latin"], weight: ["300", "400", "500", "700"] });

export const metadata: Metadata = {
  title: "AdoptameNa",
  description: "Proyecto de IngeSoft 2",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  const headersList = await headers();
  const nonce = headersList.get('x-nonce') || undefined


  return (
    <html lang="es">


      <body className={roboto.className}>        <AuthProvider>
          <NotificationProvider>
            <FavoritesProvider>
              <ChatProvider>
                <FloatingChatProvider>
                  {children}
                </FloatingChatProvider>
              </ChatProvider>
            </FavoritesProvider>
          </NotificationProvider>
        </AuthProvider>
        <Script
          nonce={nonce}
          dangerouslySetInnerHTML={{
            __html: `console.log("CSP con nonce aplicado correctamente")`,
          }}
        />
      </body>

    </html>
  );
}
