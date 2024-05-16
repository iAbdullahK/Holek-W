import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

import { ClerkProvider } from "@clerk/nextjs";
import { ModelProvider } from "@/providers/model-provider";
import { ToastProvider } from "@/providers/toast-provider";


const poppins = Poppins({ subsets: ["latin"], weight : ["100","200","300","400","500",] });

export const metadata: Metadata = {
  title: "POS Admin",
  description: "Manage your store on a single place",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body className={poppins.className}>
        <ModelProvider />
        <ToastProvider />
        {children}</body>
    </html>
    </ClerkProvider>
  );
}
