"use client"
import { fetchDigitalAssetWithAssociatedToken } from "@metaplex-foundation/mpl-token-metadata";
import useUmi from "@/hooks/useUmi";
import { PublicKey } from "@solana/web3.js";
import { publicKey } from "@metaplex-foundation/umi";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function TokenCard(props: { mintAddress: PublicKey }) {

    const { umi } = useUmi();
    const [data, setData] = useState<{
            name: string,
            symbol: string,
            image: string,
            description: string
    } | undefined>(undefined);
    const [balance, setBalance] = useState<number | undefined>(undefined);
    const [price, setPrice] = useState(Number((Math.random() * 1000).toFixed(2)));
    const [value, setValue] = useState(Number((Math.random() * 1000).toFixed(2)));
    const [volume, setVolume] = useState(Number(Math.floor((Math.random() * 1000000000))));
    const router = useRouter();
    const searchParams = useSearchParams();

    const fetchTokenMetaData = async (mintAddress: PublicKey) => {
        const umiPublicKey = publicKey(mintAddress.toBase58());
        try {
            const result = await fetchDigitalAssetWithAssociatedToken(umi, umiPublicKey, umi.identity.publicKey);
            const tokenBalance = result.token.amount;
            setBalance(() => Number(tokenBalance) / Math.pow(10, result.mint.decimals));

            // Fetching the metadata from the metadata uri
            const metadata = await fetch(result.metadata.uri);

            // deserializing the data
            const data: {
                name: string,
                symbol: string,
                image: string,
                description: string
            } = await metadata.json();

            if (data) {
                setData(data);
            }
        } catch (error: any) {
            console.error(error);
            return;
        }
    }

    useEffect(() => {
        fetchTokenMetaData(props.mintAddress);
    }, []);

    useEffect(() => {
        setInterval(() => {
            let val = Math.random() * 1000;
            val = Number(val.toFixed(2));
            setValue(val);
            let pri = Math.random() * 1000;
            pri = Number(pri.toFixed(2));
            setPrice(pri);
            let vol = Math.random() * 1000000000;
            vol = Math.floor(vol);
            setVolume(vol);
        }, 10000); 
    }, []);

    const handleClick = () => {
        const params = new URLSearchParams(searchParams);
        params.set('mint', props.mintAddress.toString());
        router.push(`token?${params.toString()}`);
    }

  return (
    <div className="rounded-2xl">
        { data && balance !== 0 && (
            <div className="grid grid-cols-5 items-center justify-between p-3 bg-transparent rounded-2xl border-l-8 border-l-emerald-300 border border-emerald-300">
                <span className="flex justify-start items-center gap-5 hover:cursor-pointer" onClick={handleClick}>
                    <img src={data.image} alt="token-img" className="rounded-full h-14 w-14 object-cover border shadow-[0_0_15px_rgba(59,130,246,0.5)]"/>
                    <div className="flex flex-col">
                        <h1 className="font-extrabold text-lg">
                            {data.name}
                        </h1>
                        <h2 className="text-gray-300 font-extralight text-xs">
                            {data.symbol}
                        </h2>
                    </div>
                </span>
                <span className="flex justify-end">
                    {balance}
                </span>
                <span className="flex justify-end">
                    {"$"}{price}
                </span>
                <span className="flex justify-end">
                    {"$"}{value}
                </span>
                <span className="flex justify-end">
                    {"$"}{volume}
                </span>
            </div>
        ) }
    </div>
  )
}

export default TokenCard