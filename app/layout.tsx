import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { Navbar } from "@/components/usernavbar/navbar";
// import { Navbar } from "@/components/navbar";



export const metadata: Metadata = {
  title: "HasH Pic Editor",
  description: "Hash Pic Editor is an online pic editor tools, used basically for creative mindset.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      
    >
      <body className="antialiased">
        {/* navbar */}
        <Navbar />
        <main>
          {children}
        </main>
        <Toaster position="bottom-right" richColors closeButton />
      </body>
    </html>
  );
}
