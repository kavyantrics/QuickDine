import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/contexts/cart-context";
import { PusherProvider } from "@/contexts/pusher-context";
import { Toaster } from "sonner";
import { AuthProvider } from '@/contexts/auth-context'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "QuickDine",
  description: "Digital menu and ordering system for restaurants",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning>
        <AuthProvider>
          <PusherProvider>
            <CartProvider>
              {children}
              <Toaster />
            </CartProvider>
          </PusherProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
