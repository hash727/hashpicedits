import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";




export const metadata: Metadata = {
  title: "HasH Pic Editor",
  description: "Hash Pic Editor is an online pic editor tools, used basically for creative mindset.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
    >
      <body className="antialiased">
        
        <main>
          {children}
        </main>
        <Toaster position="bottom-right" richColors closeButton />
      </body>
    </html>
  );
}
