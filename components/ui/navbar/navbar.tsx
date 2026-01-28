"use client"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import "./logo.css";
import Image from "next/image";

function Navbar() {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center">
        <Image src="/cubo-logo-centered.svg" alt="cubo-logo" width={100} height={100} />
        <div className="logo-text-2">CUBO</div>
      </div>
      <div className="pr-5">
        <WalletMultiButton/>
      </div>
    </div>
  )
}

export default Navbar