"use client"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import "./navbar.css";
import Image from "next/image";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { useWallet } from "@solana/wallet-adapter-react";
import { MenuIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation"

function Navbar() {

  const isConnected = useWallet().connected;
  const pathname = usePathname() ?? "/";
  const router = useRouter();

  const tabValue = pathname === "/" ? "home" : pathname.startsWith("/tokens") ? "tokens" : "home";

  return (
    <nav id="navbar" aria-label="navbar" className="flex max-w-screen justify-between pr-5 top-0 z-50 sticky bg-neutral-800/30 backdrop-blur-lg">
      <Link href="/" className="flex items-center">
        <Image src="/logo.svg" alt="cubo-logo" width={70} height={70} className="cropped-svg"/>
        <div className="logo-text">CUBO</div>
      </Link>
      <div className="md:flex items-center gap-5 hidden">
        {isConnected && <Tabs value={tabValue} onValueChange={(v) => {
          if (v === "home") router.push("/");
          else if (v === "tokens") router.push("/tokens");
        }}>
          <TabsList variant="line">
            <Link href="/">
              <TabsTrigger value="home" className="tabs after:bg-linear-to-tr after:from-cyan-400 after:to-green-400">
                Home
              </TabsTrigger>
            </Link>
            <Link href="/tokens">
              <TabsTrigger value="tokens" className="tabs after:bg-linear-to-tr after:from-cyan-400 after:to-green-400">
                Tokens
              </TabsTrigger>
            </Link>
          </TabsList>
        </Tabs>}
        <WalletMultiButton style={{
          fontFamily: 'Orbitron, sans-serif',
          backgroundImage: 'linear-gradient(135deg, #21e47f 0%, #68c4f6 100%)',
          WebkitTextFillColor: 'transparent',
          WebkitBackgroundClip: 'text',
          borderRadius: '10px',
          width: '100%',
          boxShadow: '0 0 4px #00FFFF, 0 0 4px #14F195',
          letterSpacing: "3px"
        }} />
      </div>
      <div className="flex items-center gap-2 md:hidden">
        <MenuIcon className="text-[#29BA8B]"/>
      </div>
    </nav>
  )
}

export default Navbar