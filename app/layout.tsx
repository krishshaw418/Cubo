import type { Metadata } from "next";
import { Geist, Geist_Mono, Orbitron } from "next/font/google";
import "./globals.css";
import { SolanaProvider } from "@/components/providers/solanaProvider";
import Navbar from "@/components/ui/navbar/navbar";
import { ThemeProvider } from "@/components/providers/themeProvider";

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
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SolanaProvider>
            <Navbar />
            {children}
          </SolanaProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
