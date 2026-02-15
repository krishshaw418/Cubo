"use client"
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, AccountInfo, ParsedAccountData } from "@solana/web3.js";
import React, { useEffect, useState, useRef } from "react";
import Spinner from "@/components/ui/load-spinner";
import { toast } from "sonner";
import { calculateHeight } from "@/lib/navBarHeight";
import { useCreateToken } from "@/lib/createToken";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import { useMintToken } from "@/lib/mintToken";
import { Copy } from "lucide-react";
import { Dialog, DialogTrigger, DialogDescription, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import TokenMetadataForm from "@/components/ui/tokenform.tsx/TokenCreateForm";
import "./page.css"

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
  const { createToken } = useCreateToken();
  const spanRefs1 = useRef<(HTMLSpanElement | null)[]>([]);
  const spanRefs2 = useRef<(HTMLSpanElement | null)[]>([]);
  const { mintTokens } = useMintToken();

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
      setTimeout(() => {
        redirect("/");
      }, 1000);
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

  const handleCopy1 = async (id: number) => {
    try {
      if (spanRefs1.current) {
        const publicKey = spanRefs1.current[id]?.textContent;
        console.log(publicKey);
        if (publicKey) {
          await navigator.clipboard.writeText(publicKey);
          toast.success("Copied to clipboard!");
        }    
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to copy to clipboard!");
    }
  }

  const handleCopy2 = async (id: number) => {
    try {
      if (spanRefs1.current) {
        const publicKey = spanRefs2.current[id]?.textContent;
        console.log(publicKey);
        if (publicKey) {
          await navigator.clipboard.writeText(publicKey);
          toast.success("Copied to clipboard!");
        }    
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to copy to clipboard!");
    }
  }

  const handleCreate = async () => {
    try {
      const result = await createToken();
      if (result) {
        toast.success("Transaction successful!", { position: "top-left" });
      } else {
        toast.error("Transaction failed!");
      }
    } catch (error: any) {
      toast.error(`Transaction failed: ${error.message}`);
    }
  }

  return (
    <div className="flex flex-col gap-5 p-5"
      style={{
        height: `calc(100vh - ${height}px)`,
        letterSpacing: "3px"
      }}>
      
      {/* Dialog for token form */}
      <div className="flex justify-end">
        <Dialog>

          <DialogTrigger asChild>
            <Button type="button" variant="ghost" className="w-50 button" style={{
              width: '215px',
            }}>
              Create Token
            </Button>
          </DialogTrigger>

          <DialogContent aria-describedby="form-content" className="w-full border-0" style={{
            fontFamily: 'Orbitron, sans-serif',
            boxShadow: '0 0 10px #00FFFF, 0 0 10px #14F195',
          }}>

            <DialogHeader className="flex items-center">
              <DialogTitle className="bg-linear-to-tr from-[#14F195] to-[#00FFFF] bg-clip-text text-transparent font-light text-2xl">
                Launch your token
              </DialogTitle>
            </DialogHeader>

            {/* Token form component */}
            <div className="no-scrollbar -mx-4 max-h-[67vh] overflow-y-auto px-4">
              <TokenMetadataForm id="token-metadata-form"/>
            </div>

            <DialogDescription className="sr-only"></DialogDescription>

            <DialogFooter>
              <Button type="submit" variant="ghost" form="token-metadata-form" className="button">
                Launch
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Div for the table */}
      <div className="px-5 text-cyan-300 text-shadow-lg filter drop-shadow-lg drop-shadow-green-500/50 border border-cyan-300 shadow-[0_0_15px_rgba(59,130,246,0.5)]">
        
      {/* Div for column names */}
      <div className="grid grid-cols-3 py-5">
        <div className="flex justify-center border border-purple-500 shadow-[0_0_15px_rgba(59,130,246,0.5)] p-2">
          <span>Token Account</span>
        </div>
        <div className="flex justify-center border border-purple-500 shadow-[0_0_15px_rgba(59,130,246,0.5)] p-2">
          <span>Mint Address</span>
        </div>
        <div className="flex justify-center border border-purple-500 shadow-[0_0_15px_rgba(59,130,246,0.5)] p-2">
          <span>Amount</span>
        </div>
      </div>
        
      {isLoading && <Spinner/>}
      
      {tokenAccounts?.length !== 0 && tokenAccounts?.map((tokenAccount, id) => {
        return <div className="grid grid-cols-3 py-5" key={id}>

          {/* Div for token account address */}
          <div className="flex gap-2 border border-purple-500 shadow-[0_0_15px_rgba(59,130,246,0.5)] px-5 py-2">
            <span
              className="truncate w-50 md:w-full"
              ref={(el) => { spanRefs2.current[id] = el }}>
              {`${tokenAccount.pubkey}`}
            </span>
            <span>
              <Copy onClick={() => handleCopy2(id)}/>
            </span>
          </div>

          {/* Div for mint account address */}
          <div className="flex gap-2 border border-purple-500 shadow-[0_0_15px_rgba(59,130,246,0.5)] px-5 py-2">
            <span className="truncate w-50 md:w-full"
              ref={(el) => { spanRefs1.current[id] = el }}
              onClick={async (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
                const mintAddress = new PublicKey(e.currentTarget.textContent);
                if (mintAddress) {
                  alert(`Mint Address: ${e.currentTarget.textContent}`);
                  const signature = await mintTokens(mintAddress, 100);
                  // console.log(signature);
                  if (signature) {
                    toast.success("100 tokens minted sucessfully!");
                  } else {
                    toast.error("Something went wrong!");
                  }
                }
              }}>
              {`${JSON.stringify(tokenAccount.account.data.parsed.info.mint).replace(/^(['"])(.*)\1$/, '$2')}`}
            </span>
            <span>
              <Copy onClick={() => handleCopy1(id)}/>
            </span>
          </div>

          {/* Div for amount of tokens in the ata */}
          <div className="flex border border-purple-500 shadow-[0_0_15px_rgba(59,130,246,0.5)] p-2 justify-center">
            <span>
              {`${JSON.stringify(tokenAccount.account.data.parsed.info.tokenAmount.uiAmount)}`}
            </span>
          </div>

        </div>
      })}
    </div>
    </div>
  )
}

export default Tokens