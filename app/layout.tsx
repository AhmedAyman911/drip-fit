import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from 'next-themes';
import Navebar from "@/components/navbar";
import Footer from "@/components/Footer";

import { Providers } from './providers'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Drip Fit",
  description: "Your go-to shop for exclusive streetwear, sneakers, and essentials. Join the culture and elevate your style.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col dark:bg-gray-900 bg-gray-100 `}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Navebar />
          <main className="grow">
            <Providers>
              {children}
            </Providers>
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
