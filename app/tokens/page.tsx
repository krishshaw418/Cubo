"use client";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, AccountInfo, ParsedAccountData } from "@solana/web3.js";
import { useEffect, useState, lazy, Suspense } from "react";
import { toast } from "sonner";
import { useNavBarHeight } from "@/hooks/navBarHeight";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
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
const TokenCard = lazy(() => import("@/components/ui/token-list/token-card"));
import { Skeleton } from "@/components/ui/skeleton";

function Tokens() {
  const { connection } = useConnection();
  const wallet = useWallet();
  const isConnected = useWallet().connected;
  const height = useNavBarHeight();
  const [tokenAccounts, setTokenAccounts] = useState<
    { pubkey: PublicKey; account: AccountInfo<ParsedAccountData> }[] | undefined
    >(undefined);
  const [isLaunching, setIsLaunching] = useState(false);

  const pubKey = wallet.publicKey;
  useEffect(() => {
    const fetchTokenAccounts = async () => {
      try {
        if (!pubKey) {
          toast.error("Public key not found!");
          return;
        }
        const tokenAcc = await connection.getParsedTokenAccountsByOwner(
          pubKey,
          {
            programId: TOKEN_PROGRAM_ID,
          },
        );

        setTokenAccounts(tokenAcc.value);
      } catch (error: any) {
        toast.error(`Error: ${error}`);
        console.error(error);
      }
    };

    fetchTokenAccounts();
  }, [isConnected, pubKey, connection]);

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
              <TokenMetadataForm id="token-metadata-form" isLaunching={isLaunching} setIsLaunching={setIsLaunching}/>
            </div>

            <DialogDescription className="sr-only"></DialogDescription>

            <DialogFooter>
              {!isLaunching && (
                <Button
                  type="submit"
                  variant="ghost"
                  form="token-metadata-form"
                  className="button"
                >
                  Launch
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col gap-5 mx-20 mb-5">
        <div className="grid grid-cols-6 pl-8 pr-5 bg-linear-to-r from-[#14F195] to-[#00FFFF] bg-clip-text text-transparent">
          <span className="col-span-2">{"ASSET"}</span>
          <span className="flex justify-end">{"BALANCE"}</span>
          <span className="flex justify-end">{"PRICE"}</span>
          <span className="flex justify-end">{"VALUE"}</span>
          <span className="flex justify-end">{"24H"}</span>
        </div>
        <div className="flex flex-col gap-5 mb-5">
          {tokenAccounts?.length !== 0 &&
            tokenAccounts?.map((tokenAccount, id) => {
              return (
                <div
                  key={id}
                  style={{
                    animationDelay: `${id * 100}ms`,
                  }}
                  className="item bg-linear-to-tr from-[#14F195] to-[#00FFFF] bg-clip-text text-transparent"
                >
                  <Suspense
                    fallback={<Skeleton className="w-full h-20 bg-gray-800" />}
                  >
                    <TokenCard
                      mintAddress={
                        new PublicKey(
                          tokenAccount.account.data.parsed.info.mint,
                        )
                      }
                    />
                  </Suspense>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

export default Tokens;
