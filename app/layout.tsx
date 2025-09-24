import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { ClerkProvider } from "@clerk/nextjs";
import { frFR } from "@clerk/localizations";
import ReactQueryClientProvider from "@/components/react-query-client-provider";
import CreateProfileOnSignIn from "@/components/create-profile";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Meal Plans | Simple SaaS Demo",
  description: "Generate personalized meal plans with OpenAI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider   localization={frFR}>
      
      <html lang="fr">
        <body >
          <ReactQueryClientProvider>
            <CreateProfileOnSignIn />
            <Navbar />
            <div  className="max-w-7xl mx-auto pt-16 p-4 min-h-screen">{children}</div>
          </ReactQueryClientProvider>
        </body>
      </html>
      
      
    </ClerkProvider>
  );
}
