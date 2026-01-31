"use client"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import "./logo.css";
import Image from "next/image";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ModeToggle } from "../modeToggle";
import Link from "next/link";
import { useWallet } from "@solana/wallet-adapter-react";

function Navbar() {

  const isConnected = useWallet().connected;

  return (
    <nav className="flex w-screen justify-between items-center pr-5 top-0 z-50 sticky bg-neutral-800/30 backdrop-blur-lg">
      <div className="flex items-center">
        <Image src="/cubo-logo-centered.svg" alt="cubo-logo" width={70} height={70} className="cropped-svg"/>
        <div className="logo-text-2">CUBO</div>
      </div>
      <div className="flex items-center gap-5">
        <Tabs defaultValue="home">
          <TabsList variant="line">
            <TabsTrigger value="home">
              <Link href="/">Home</Link>
            </TabsTrigger>
            <TabsTrigger value="create">Create NFTs</TabsTrigger>
            {isConnected &&
            <TabsTrigger value="dashboard">
              <Link href="/dashboard">Dashboard</Link>
            </TabsTrigger>}
          </TabsList>
        </Tabs>
        <WalletMultiButton />
        <ModeToggle/>
      </div>
    </nav>
  )
}

export default Navbar