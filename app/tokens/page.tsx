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
  const isConnected = wallet.connected;
  const height = useNavBarHeight();
  const [tokenAccounts, setTokenAccounts] = useState<
    { pubkey: PublicKey; account: AccountInfo<ParsedAccountData> }[] | undefined
  >();
  const pubKey = wallet.publicKey;

  useEffect(() => {
    const fetchTokenAccounts = async () => {
      if (!pubKey) return;
      try {
        const tokenAcc = await connection.getParsedTokenAccountsByOwner(
          pubKey,
          { programId: TOKEN_PROGRAM_ID },
        );
        setTokenAccounts(tokenAcc.value);
      } catch (error) {
        toast.error(`Unable to fetch tokens: ${String(error)}`);
        console.error("Error from tokens:", error);
      }
    };
    void fetchTokenAccounts();
  }, [isConnected, pubKey, connection]);

  useEffect(() => {
    if (!isConnected) {
      toast.warning("Connect wallet to see your tokens!");
      const timeout = setTimeout(() => redirect("/"), 1000);
      return () => clearTimeout(timeout);
    }
  }, [isConnected]);

  const pageStyle = { minHeight: `calc(100dvh - ${height}px)` };

  if (!isConnected) {
    return (
      <main
        className="flex items-center justify-center px-4 py-12 text-center"
        style={pageStyle}
      >
        <p className="font-orbitron text-base tracking-widest sm:text-lg">
          No tokens here!
        </p>
      </main>
    );
  }

  if (tokenAccounts?.length === 0) {
    return (
      <main
        className="flex flex-col items-center justify-center gap-4 px-4 py-12 text-center"
        style={pageStyle}
      >
        <h1 className="font-orbitron text-xl tracking-wide sm:text-3xl">
          This wallet has no SPL tokens.
        </h1>
        <p className="max-w-md text-sm text-muted-foreground sm:text-base">
          Create a token to get started.
        </p>
        <TokenDialog />
      </main>
    );
  }

  return (
    <main
      className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-3 py-4 sm:gap-6 sm:px-6 sm:py-6 lg:px-8"
      style={pageStyle}
    >
      <div className="flex justify-end">
        <TokenDialog />
      </div>

      <div className="w-full min-w-0 overflow-x-auto">
        <div className="min-w-[800px]">
          <TableHeader />

          <div className="flex flex-col gap-3 pb-4">
            {tokenAccounts?.map((tokenAccount, id) => (
              <div
                key={tokenAccount.pubkey.toBase58()}
                style={{ "--i": id } as React.CSSProperties}
                className="item min-w-0 text-white"
              >
                <Suspense
                  fallback={
                    <Skeleton className="h-20 w-full rounded-xl bg-gray-800" />
                  }
                >
                  <TokenCard
                    mintAddress={
                      new PublicKey(tokenAccount.account.data.parsed.info.mint)
                    }
                  />
                </Suspense>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

export default Tokens;
