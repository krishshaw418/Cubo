import { fetchDigitalAssetWithAssociatedToken } from "@metaplex-foundation/mpl-token-metadata";
import useUmi from "@/hooks/useUmi";
import { PublicKey } from "@solana/web3.js";
import { publicKey } from "@metaplex-foundation/umi";
import { useEffect, useState } from "react";

function TokenCard(props: { mintAddress: PublicKey }) {

    const { umiInstance } = useUmi();
    const [data, setData] = useState<{
            name: string,
            symbol: string,
            image: string,
            description: string
    } | undefined>(undefined);
    const [balance, setBalance] = useState<bigint | undefined>(undefined);
    
    const fetchTokenMetaData = async (mintAddress: PublicKey) => {
        const umiPublicKey = publicKey(mintAddress.toBase58());
        console.log(umiPublicKey);
        const umi = umiInstance();
        const result = await fetchDigitalAssetWithAssociatedToken(umi, umiPublicKey, umi.identity.publicKey);
        console.log(result);

        const tokenBalance = result.token.amount;
        setBalance(tokenBalance);
        const metadata = await fetch(result.metadata.uri);
        const data: {
            name: string,
            symbol: string,
            image: string,
            description: string
        } = await metadata.json();

        console.log(data);
        if (data) {
            setData(data);
        }
    }

    useEffect(() => {
        fetchTokenMetaData(props.mintAddress);
    }, []);

  return (
    <div className="rounded-2xl">
        { data && (
            <div className="grid grid-cols-6 items-center justify-between p-5 bg-transparent rounded-2xl border-l-8 border-l-emerald-300 border border-emerald-300 shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                <span className="flex items-center gap-5 col-span-2">
                    <img src={data.image} alt="token-img" className="rounded-full h-15 w-15 object-cover border shadow-[0_0_15px_rgba(59,130,246,0.5)]"/>
                    <span className="flex flex-col">
                        <h1 className="font-extrabold text-lg">
                            {data.name}
                        </h1>
                        <h2 className="text-gray-300 font-extralight text-xs">
                            {data.symbol}
                        </h2>
                    </span>
                </span>
                <span className="flex justify-end">
                    {balance}
                </span>
                <span className="flex justify-end">
                    -
                </span>
                <span className="flex justify-end">
                    -
                </span>
                <span className="flex justify-end">
                    -
                </span>
            </div>
        ) }
    </div>
  )
}

export default TokenCard