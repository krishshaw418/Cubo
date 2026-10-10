"use client";

import { useSearchParams } from "next/navigation";
import { PublicKey } from "@solana/web3.js";
import { getMint, Mint } from "@solana/spl-token";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState, Suspense } from "react";
import { useNavBarHeight } from "@/hooks/navBarHeight";
import Loader from "@/components/ui/load-spinner";
import { fetchDigitalAssetWithAssociatedToken } from "@metaplex-foundation/mpl-token-metadata";
import { publicKey } from "@metaplex-foundation/umi";
import useUmi from "@/hooks/useUmi";
import { Separator } from "@/components/ui/separator";
import PoolDialog from "@/components/ui/liquidity-pool/pool-dialog";
import {
  PoolFetchType,
  Raydium,
  ApiV3PoolInfoItem,
} from "@raydium-io/raydium-sdk-v2";
import CopyToClipboard from "@/components/ui/copy";

type TokenMetadata = {
  name: string;
  symbol: string;
  image: string;
  description: string;
};

function TokenContent({ raydium }: { raydium: Promise<Raydium> }) {
  const searchParams = useSearchParams();
  const mintAddress = searchParams.get("mint");
  const { umi } = useUmi();
  const { connection } = useConnection();
  const { connected } = useWallet();
  const navBarHeight = useNavBarHeight();
  const [mintInfo, setMintInfo] = useState<Mint | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [balance, setBalance] = useState<number>();
  const [pools, setPools] = useState<ApiV3PoolInfoItem[] | null>(null);
  const [data, setData] = useState<TokenMetadata>();

  useEffect(() => {
    if (!connected || !mintAddress) return;
    let cancelled = false;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const mintKey = new PublicKey(mintAddress);
        const [mint, asset] = await Promise.all([
          getMint(connection, mintKey),
          fetchDigitalAssetWithAssociatedToken(
            umi,
            publicKey(mintKey.toBase58()),
            umi.identity.publicKey,
          ),
        ]);
        if (cancelled) return;
        setMintInfo(mint);
        setBalance(
          Number(asset.token.amount) / Math.pow(10, asset.mint.decimals),
        );

        const metadataResponse = await fetch(asset.metadata.uri);
        if (!metadataResponse.ok)
          throw new Error("Unable to fetch token metadata");
        const metadata = (await metadataResponse.json()) as TokenMetadata;
        if (!cancelled) setData(metadata);

        const poolResponse = await (
          await raydium
        ).api.fetchPoolByMints({
          mint1: mintKey,
          type: PoolFetchType.Standard,
          sort: "liquidity",
          order: "desc",
        });
        if (!cancelled) setPools(poolResponse.data);
      } catch (error) {
        console.error("Failed to fetch token details:", error);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    void fetchData();
    return () => {
      cancelled = true;
    };
  }, [connected, mintAddress, connection, umi, raydium]);

  if (!mintAddress) {
    return (
      <div className="px-4 py-10 text-center text-sm text-muted-foreground">
        No token mint was provided.
      </div>
    );
  }

  const DetailRow = ({
    label,
    children,
  }: {
    label: string;
    children: React.ReactNode;
  }) => (
    <div className="flex min-w-0 flex-col gap-2 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-5">
      <span className="shrink-0 text-sm text-muted-foreground sm:text-base">
        {label}
      </span>
      <div className="min-w-0 max-w-full break-all text-sm sm:text-right sm:text-base">
        {children}
      </div>
    </div>
  );

  return (
    <main
      className="min-h-0 overflow-y-auto text-white"
      style={{ minHeight: `calc(100dvh - ${navBarHeight}px)` }}
    >
      {isLoading ? (
        <div className="flex min-h-[50vh] items-center justify-center">
          <Loader />
        </div>
      ) : mintInfo && data ? (
        <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          <header className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-3 sm:gap-5">
              <img
                src={data.image}
                alt={`${data.name} token`}
                width={56}
                height={56}
                className="size-12 shrink-0 rounded-full object-cover shadow-[0_0_8px_#00FFFF,0_0_8px_#14F195] sm:size-14"
              />
              <div className="min-w-0">
                <h1 className="break-words text-lg font-bold sm:text-2xl">
                  {data.name}
                </h1>
                <p className="text-sm font-light text-muted-foreground">
                  {data.symbol}
                </p>
                <p className="mt-1 break-all text-xs text-muted-foreground">
                  Mint: {mintInfo.address.toBase58()}
                </p>
              </div>
            </div>
            <div className="w-full sm:w-auto sm:shrink-0">
              <PoolDialog
                mintName={data.name}
                mintAddress={publicKey(mintInfo.address)}
                mintDecimal={mintInfo.decimals}
              />
            </div>
          </header>

          <Separator className="my-6 bg-gray-700 sm:my-8" />
          <section
            aria-label="Token details"
            className="overflow-hidden rounded-xl border border-gray-800 bg-[#161717]"
          >
            <DetailRow label="Address">
              <CopyToClipboard>{mintInfo.address.toBase58()}</CopyToClipboard>
            </DetailRow>
            <Separator className="bg-gray-700" />
            <DetailRow label="Supply">
              <span>{mintInfo.supply.toString()}</span>
            </DetailRow>
            <Separator className="bg-gray-700" />
            <DetailRow label="Mint Authority">
              <CopyToClipboard>
                {mintInfo.mintAuthority?.toBase58() ?? "None"}
              </CopyToClipboard>
            </DetailRow>
            <Separator className="bg-gray-700" />
            <DetailRow label="Freeze Authority">
              <CopyToClipboard>
                {mintInfo.freezeAuthority?.toBase58() ?? "None"}
              </CopyToClipboard>
            </DetailRow>
            <Separator className="bg-gray-700" />
            <DetailRow label="Decimals">
              <span>{mintInfo.decimals}</span>
            </DetailRow>
            <Separator className="bg-gray-700" />
            <DetailRow label="Your balance">
              <span>{balance ?? "—"}</span>
            </DetailRow>
            {pools?.map((pool, index) => (
              <div key={pool.id}>
                <Separator className="bg-gray-700" />
                <DetailRow label={`Pool ID ${index + 1}`}>
                  <CopyToClipboard>{pool.id}</CopyToClipboard>
                </DetailRow>
              </div>
            ))}
          </section>
        </div>
      ) : (
        <div className="px-4 py-10 text-center text-sm text-muted-foreground">
          Token details are unavailable. Connect your wallet and try again.
        </div>
      )}
    </main>
  );
}

export default function Token() {
  const { connection } = useConnection();
  const wallet = useWallet();

  if (!wallet.publicKey) {
    return (
      <div className="px-4 py-10 text-center text-sm text-muted-foreground">
        Connect your wallet to view token details.
      </div>
    );
  }

  const raydium = Raydium.load({
    connection,
    owner: wallet.publicKey,
    signAllTransactions: wallet.signAllTransactions,
    cluster: "devnet",
  });

  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center">
          <Loader />
        </div>
      }
    >
      <TokenContent raydium={raydium} />
    </Suspense>
  );
}
