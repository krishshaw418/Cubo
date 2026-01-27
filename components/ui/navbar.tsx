"use client"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
function Navbar() {
  return (
    <div className="flex justify-between p-5">
        <div>
            Cubo
        </div>
        <div>
            <WalletMultiButton/>
        </div>
    </div>
  )
}

export default Navbar