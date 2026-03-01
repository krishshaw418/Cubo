"use client";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, AccountInfo, ParsedAccountData } from "@solana/web3.js";
import { useEffect, useState, useRef } from "react";
import Spinner from "@/components/ui/load-spinner";
import { toast } from "sonner";
import { calculateHeight } from "@/lib/navBarHeight";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import { Copy } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogDescription,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import TokenMetadataForm from "@/components/ui/tokenform.tsx/TokenCreateForm";
import "./page.css";
import TokenCard from "@/components/ui/token-list/token-card";

function Tokens() {
  const { connection } = useConnection();
  const wallet = useWallet();
  const isConnected = useWallet().connected;
  const [height, setHeight] = useState(0);
  const [tokenAccounts, setTokenAccounts] = useState<{ pubkey: PublicKey; account: AccountInfo<ParsedAccountData> }[] | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const spanRefs1 = useRef<(HTMLSpanElement | null)[]>([]);
  const spanRefs2 = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    setHeight(calculateHeight());
  }, []);

  const pubKey = wallet.publicKey;
  useEffect(() => {
    const fetchTokenAccounts = async () => {
      try {
        if (!pubKey) {
          return;
        }
        const tokenAcc = await connection.getParsedTokenAccountsByOwner(
          pubKey,
          {
            programId: TOKEN_PROGRAM_ID,
          },
        );

        if (!tokenAccounts) {
          setIsLoading(true);
        }

        console.log(tokenAcc.value);
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
  }, [isConnected]);

  if (!isConnected) {
    return (
      <div
        className="flex justify-center items-center overflow-hidden"
        style={{
          height: `calc(100vh - ${height}px)`,
          fontFamily: "Orbitron, sans-serif",
          letterSpacing: "3px",
        }}
      >
        No tokens here!
      </div>
    );
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
  };

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
  };

  return (
    <div
      className="flex flex-col gap-5 p-5"
      style={{
        height: `calc(100vh - ${height}px)`,
        letterSpacing: "3px",
      }}
    >
      {/* Dialog for token form */}
      <div className="flex justify-end">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              className="w-50 button hover:cursor-pointer"
              style={{
                width: "215px",
              }}
            >
              Create Token
            </Button>
          </DialogTrigger>

          <DialogContent
            aria-describedby="form-content"
            className="w-full border-0"
            style={{
              fontFamily: "Orbitron, sans-serif",
              boxShadow: "0 0 10px #00FFFF, 0 0 10px #14F195",
            }}
          >
            <DialogHeader className="flex items-center">
              <DialogTitle className="bg-linear-to-tr from-[#14F195] to-[#00FFFF] bg-clip-text text-transparent font-light text-2xl">
                Launch your token
              </DialogTitle>
            </DialogHeader>

            {/* Token form component */}
            <div className="no-scrollbar -mx-4 max-h-[67vh] overflow-y-auto px-4">
              <TokenMetadataForm id="token-metadata-form" />
            </div>

            <DialogDescription className="sr-only"></DialogDescription>

            <DialogFooter>
              <Button
                type="submit"
                variant="ghost"
                form="token-metadata-form"
                className="button"
              >
                Launch
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col gap-5 mx-20 mb-5">
        <div className="grid grid-cols-6 pl-8 pr-5 bg-linear-to-r from-[#14F195] to-[#00FFFF] bg-clip-text text-transparent">
          <span className="col-span-2">
            {"ASSET"}
          </span>
          <span className="flex justify-end">
            {"BALANCE"}
          </span>
          <span className="flex justify-end">
            {"PRICE"}
          </span>
          <span className="flex justify-end">
            {"VALUE"}
          </span>
          <span className="flex justify-end">
            {"24H"}
          </span>
        </div>
        {isLoading && <Spinner />}
        <div className="flex flex-col gap-5 mb-5 bg-linear-to-tr from-[#14F195] to-[#00FFFF] bg-clip-text text-transparent">
          {tokenAccounts?.length !== 0 &&
          tokenAccounts?.map((tokenAccount, id) => {
            return (
              <TokenCard mintAddress={new PublicKey(tokenAccount.account.data.parsed.info.mint)} key={id}/>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Tokens;
