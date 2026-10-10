import type { Metadata } from "next";
import { Orbitron } from "next/font/google";
import "./globals.css";
import { SolanaProvider } from "@/components/providers/solanaProvider";
import Navbar from "@/components/ui/navbar/navbar";
import { Toaster } from "@/components/ui/sonner";
import TableFooter from "@/components/ui/footer";

const orbitronSans = Orbitron({ variable: "--font-orbitron-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "cubo.dev | Token launchpad on Solana",
  description: "Solana token launchpad",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${orbitronSans.variable} min-h-dvh antialiased`}>
        <SolanaProvider>
          <Navbar />
          {children}
          <TableFooter />
          <Toaster
            toastOptions={{
              style: {
                border: "1px solid transparent",
                borderRadius: "10px",
                boxShadow: "0 0 10px #00FFFF, 0 0 10px #14F195",
                fontFamily: "Orbitron, sans-serif",
                color: "#00ffd0",
              },
            }}
          />
        </SolanaProvider>
      </body>
    </html>
  );
}
