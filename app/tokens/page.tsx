"use client"
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, AccountInfo, ParsedAccountData } from "@solana/web3.js";
import { useEffect, useState } from "react";
import Spinner from "@/components/ui/load-spinner";
import { toast } from "sonner";
import { calculateHeight } from "@/lib/navBarHeight";
import { useMint } from "@/lib/mint";
import { Button } from "@/components/ui/button";

function Tokens() {
  const { connection } = useConnection();
  const wallet = useWallet();
  const isConnected = useWallet().connected;
  const [height, setHeight] = useState(0);
  const [tokenAccounts, setTokenAccounts] = useState<{
    pubkey: PublicKey;
    account: AccountInfo<ParsedAccountData>;
  }[] | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const { createMint } = useMint();

  useEffect(() => {
    setHeight(calculateHeight());
  }, []) 

  const pubKey = wallet.publicKey;
  useEffect(() => {
    const fetchTokenAccounts = async () => {
      try {
        if (!pubKey) {
          return;
        }
        const tokenAcc = await connection.getParsedTokenAccountsByOwner(pubKey, {
          programId: TOKEN_PROGRAM_ID
        });

        if (!tokenAccounts) {
          setIsLoading(true);
        }

        setTokenAccounts(tokenAcc.value);
      } catch (error: any) {
        toast.error(`Error: ${error}`);
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTokenAccounts();
  }, [isConnected]);

  useEffect(() => {
    if (!isConnected) {
      toast.warning("Connect wallet to see your tokens!");
    }
  }, [isConnected])

  if (!isConnected) {
    return (<div className="flex justify-center items-center overflow-hidden"
      style={{
        height: `calc(100vh - ${height}px)`,
        fontFamily: "Orbitron, sans-serif",
        letterSpacing: "3px"
      }}>
      No tokens here!
    </div>)
  }

  return (
    <div className="flex flex-col gap-5 p-5"
      style={{
        height: `calc(100vh - ${height}px)`,
        fontFamily: "Orbitron, sans-serif",
        letterSpacing: "3px"
      }}>
      <div className="flex justify-end">
        <Button type="button" variant="ghost" onClick={async () => {
          try {
            const signature = await createMint();
            if (signature) {
              toast.success("Transaction successful!");
            } else {
              toast.error("Transaction failed!");
            }
          } catch (error: any) {
            toast.error(`Transaction failed: ${error.message}`);
          }
        }} className="w-50" style={{
          backgroundImage: 'linear-gradient(135deg, #21e47f 0%, #68c4f6 100%)',
          WebkitTextFillColor: 'transparent',
          WebkitBackgroundClip: 'text',
          borderRadius: '10px',
          width: '250px',
          boxShadow: '0 0 5px #00FFFF, 0 0 5px #14F195',
        }}>Create Token</Button>
      </div>
      <div className="px-5 text-cyan-300 text-shadow-lg filter drop-shadow-lg drop-shadow-green-500/50 border border-cyan-300 shadow-[0_0_15px_rgba(59,130,246,0.5)]">
      <div className="grid grid-cols-3 py-5">
        <div className="flex justify-center border border-purple-500 shadow-[0_0_15px_rgba(59,130,246,0.5)] p-2"><span>Public Key</span></div>
        <div className="flex justify-center border border-purple-500 shadow-[0_0_15px_rgba(59,130,246,0.5)] p-2"><span>Mint Address</span></div>
        <div className="flex justify-center border border-purple-500 shadow-[0_0_15px_rgba(59,130,246,0.5)] p-2"><span>Amount</span></div>
      </div>
      {isLoading && <Spinner/>}
      {tokenAccounts?.length !== 0 && tokenAccounts?.map((tokenAccount, id) => {
        return <div className="grid grid-cols-3 py-5" key={id}>
          <div className="flex border border-purple-500 shadow-[0_0_15px_rgba(59,130,246,0.5)] p-2"><span className="truncate w-50 md:w-full px-[20%]">{`${tokenAccount.pubkey}`}</span></div>
          <div className="flex border border-purple-500 shadow-[0_0_15px_rgba(59,130,246,0.5)] p-2"><span className="truncate w-50 md:w-full px-[20%]">{`${JSON.stringify(tokenAccount.account.data.parsed.info.mint).replace(/^(['"])(.*)\1$/, '$2')}`}</span></div>
          <div className="flex border border-purple-500 shadow-[0_0_15px_rgba(59,130,246,0.5)] p-2 justify-center"><span>{`${JSON.stringify(tokenAccount.account.data.parsed.info.tokenAmount.uiAmount)}`}</span></div>
        </div>
      })}
    </div>
    </div>
  )
}

export default Tokens