"use client";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, AccountInfo, ParsedAccountData } from "@solana/web3.js";
import { useEffect, useState, lazy, Suspense } from "react";
import { toast } from "sonner";
import { useNavBarHeight } from "@/hooks/navBarHeight";
import { redirect } from "next/navigation";
import "./page.css";
const TokenCard = lazy(() => import("@/components/ui/token-list/token-card"));
import { Skeleton } from "@/components/ui/skeleton";
import TokenDialog from "@/components/ui/tokenform/TokenDialog";
import TableHeader from "@/components/ui/token-list/TableHeader";

function Tokens() {
  const { connection } = useConnection();
  const wallet = useWallet();
  const isConnected = useWallet().connected;
  const height = useNavBarHeight();
  const [tokenAccounts, setTokenAccounts] = useState<
    { pubkey: PublicKey; account: AccountInfo<ParsedAccountData> }[] | undefined
  >(undefined);

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

        setTokenAccounts(tokenAcc.value);
      } catch (error: any) {
        toast.error(`Error: ${error}`);
        console.error("Error from tokens:", error);
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
        {"No tokens here!"}
      </div>
    );
  } else if (tokenAccounts?.length === 0) {
    return (
      <div
        className="flex flex-col justify-center items-center overflow-hidden"
        style={{
          height: `calc(100vh - ${height}px)`,
          fontFamily: "Orbitron, sans-serif",
          letterSpacing: "3px",
        }}
      >
        <span className="text-3xl">{"This wallet has no spl-tokens."}</span>
        <span>{"Click the button below to create one."}</span>
        <TokenDialog />
      </div>
    );
  } else {
    return (
      <div
        className="flex flex-col p-5 relative"
        style={{
          height: `calc(100vh - ${height}px)`,
          letterSpacing: "3px",
        }}
      >
        {/* Dialog for token form */}
        <TokenDialog />
        <TableHeader />
        <div className="flex flex-col px-2 overflow-auto scrollbar-none">
            {tokenAccounts?.length !== 0 &&
              tokenAccounts?.map((tokenAccount, id) =>
                  <div
                    key={id}
                    style={{
                      animationDelay: `${id * 100}ms`,
                    }}
                    className="item text-white"
                  >
                    <Suspense
                      fallback={
                        <Skeleton className="w-full h-20 bg-gray-800" />
                      }
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
              )}
        </div>
      </div>
    );
  }
}

export default Tokens;
