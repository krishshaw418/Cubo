"use client"
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, AccountInfo, ParsedAccountData } from "@solana/web3.js";
import { useEffect, useState } from "react";
import Spinner from "@/components/ui/load-spinner";
import { redirect } from "next/navigation";

function Dashboard() {
  const { connection } = useConnection();
  const wallet = useWallet();
  const isConnected = useWallet().connected;

  if (!isConnected) {
    redirect("/");
  }

  const [tokenAccounts, setTokenAccounts] = useState<{
    pubkey: PublicKey;
    account: AccountInfo<ParsedAccountData>;
  }[] | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  const pubKey = wallet.publicKey;

  if (!pubKey) {
    return;
  }

  useEffect(() => {
    const fetchTokenAccounts = async () => {
      try {
        const tokenAcc = await connection.getParsedTokenAccountsByOwner(pubKey, {
          programId: TOKEN_PROGRAM_ID
        });

        setTokenAccounts(tokenAcc.value);
      } catch (error: any) {
        alert(`Error: ${error}`);
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTokenAccounts();
  }, []);

  return (
    <div className="px-5 text-cyan-300 text-shadow-lg filter drop-shadow-lg drop-shadow-green-500/50 border border-cyan-300 shadow-[0_0_15px_rgba(59,130,246,0.5)]">
      <div className="grid grid-cols-3 py-5">
        <div className="flex justify-center border border-purple-500 shadow-[0_0_15px_rgba(59,130,246,0.5)] p-2"><span>Public Key</span></div>
        <div className="flex justify-center border border-purple-500 shadow-[0_0_15px_rgba(59,130,246,0.5)] p-2"><span>Mint Address</span></div>
        <div className="flex justify-center border border-purple-500 shadow-[0_0_15px_rgba(59,130,246,0.5)] p-2"><span>Amount</span></div>
      </div>
      {isLoading && <Spinner/>}
      {tokenAccounts?.length !== 0 && tokenAccounts?.map((tokenAccount) => {
        return <div className="grid grid-cols-3 py-5">
          <div className="flex border border-purple-500 shadow-[0_0_15px_rgba(59,130,246,0.5)] p-2"><span className="truncate w-50 md:w-full px-[20%]">{`${tokenAccount.pubkey}`}</span></div>
          <div className="flex border border-purple-500 shadow-[0_0_15px_rgba(59,130,246,0.5)] p-2"><span className="truncate w-50 md:w-full px-[20%]">{`${JSON.stringify(tokenAccount.account.data.parsed.info.mint).replace(/^(['"])(.*)\1$/, '$2')}`}</span></div>
          <div className="flex border border-purple-500 shadow-[0_0_15px_rgba(59,130,246,0.5)] p-2 justify-center"><span>{`${JSON.stringify(tokenAccount.account.data.parsed.info.tokenAmount.uiAmount)}`}</span></div>
        </div>
      })}
    </div>
  )
}

export default Dashboard