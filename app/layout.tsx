import type { Metadata } from "next";
import { Geist, Geist_Mono, Orbitron } from "next/font/google";
import "./globals.css";
import { SolanaProvider } from "@/components/providers/solanaProvider";
import Navbar from "@/components/ui/navbar/navbar";
import { Toaster } from "@/components/ui/sonner"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const orbitronSans = Orbitron({
  variable: "--font-orbitron-sans",
  subsets: ["latin"]
})

export const metadata: Metadata = {
  title: "cubo.dev | Token launchpad on Solana",
  description: "Solana token launchpad",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${orbitronSans.variable} antialiased`}
      >
        <SolanaProvider>
          <Navbar />
          {children}
          <Toaster />
        </SolanaProvider>
      </body>
    </html>
  );
}
