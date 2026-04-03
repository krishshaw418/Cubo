"use client"
import { useSearchParams } from 'next/navigation'
import { PublicKey } from "@solana/web3.js";
import { getMint, Mint } from "@solana/spl-token";
import { useConnection } from "@solana/wallet-adapter-react";
import { useEffect, useState } from 'react';
import { useNavBarHeight } from '@/hooks/navBarHeight';
import Loader from '@/components/ui/load-spinner';
import { Button } from '@/components/ui/button';
import { fetchDigitalAssetWithAssociatedToken } from "@metaplex-foundation/mpl-token-metadata";
import { publicKey } from "@metaplex-foundation/umi";
import useUmi from "@/hooks/useUmi";
import { Separator } from '@/components/ui/separator';

function Token() {
    
    const searchParams = useSearchParams();
    const mintAddress = searchParams.get('mint');
    const { umi } = useUmi();
    const { connection } = useConnection();
    const [mintInfo, setMintInfo] = useState<Mint | null>(null);
    const navBarHeight = useNavBarHeight();
    const [isLoading, setIsLoading] = useState(false);
    const [balance, setBalance] = useState<number | undefined>(undefined);
    const [data, setData] = useState<{
            name: string,
            symbol: string,
            image: string,
            description: string
    } | undefined>(undefined);
    
    if (!mintAddress) {
        return;
    }

    useEffect(() => {
        const fetchTokenMint = async () => {
            setIsLoading(true);
            const mintInfo = await getMint(connection, new PublicKey(mintAddress));
            setMintInfo(mintInfo);
            setIsLoading(false);
        }

        fetchTokenMint();
    }, []);

    const fetchTokenMetaData = async (mintAddress: PublicKey) => {
        const umiPublicKey = publicKey(mintAddress.toBase58());
        try {
            const result = await fetchDigitalAssetWithAssociatedToken(umi, umiPublicKey, umi.identity.publicKey);
            console.log(result);
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
        fetchTokenMetaData(new PublicKey(mintAddress));
    }, []);

  return (
    <div
        className='text-white flex items-center justify-center'
        style={{
            height: `calc(100vh - ${navBarHeight}px)`
        }}
    >
        {isLoading ? <Loader/>: 
            mintInfo !== null && (
            <div className='flex flex-col w-[80%]'>
                <div className='flex justify-between w-full relative'>
                    <div className='flex gap-5'>
                        <img src={data?.image} alt="token-img" width={50} height={50} style={{
                            boxShadow: '0 0 4px #00FFFF, 0 0 4px #14F195',
                        }}/>
                        <div>
                            <p className='font-bold'>{data?.name}</p>
                            <p className='text-xs font-extralight'>{data?.symbol}</p>
                            <p className='text-[8px]'>{mintInfo.freezeAuthority?.toString().slice(0,7)}</p>
                        </div>
                    </div>
                    <Button type='submit' className='absolute bottom-0 right-0'
                        style={{
                            backgroundImage: 'linear-gradient(135deg, #21e47f 0%, #68c4f6 100%)',
                            WebkitTextFillColor: 'transparent',
                            WebkitBackgroundClip: 'text',
                            borderRadius: '10px',
                            boxShadow: '0 0 4px #00FFFF, 0 0 4px #14F195',
                        }}
                    >Create Liquidity Pool</Button>
                </div>
                <Separator className='mt-5  mb-7 bg-gray-700'/>
                <div className='w-full bg-[#161717] rounded-lg'>
                    <div className='flex justify-between p-5'>
                        <span>Address</span>
                        <span>{mintInfo.address.toBase58()}</span>
                    </div>
                    <Separator className='bg-gray-700'/>
                    <div className='flex justify-between p-5'>
                        <span>Supply</span>
                        <span>{mintInfo.supply.toString()}</span>
                    </div>
                    <Separator className='bg-gray-700'/>
                    <div className='flex justify-between p-5'>
                        <span>Mint Authority</span>
                        <span>{mintInfo.mintAuthority?.toBase58()}</span>
                    </div>
                    <Separator className='bg-gray-700'/>
                    <div className='flex justify-between p-5'>
                        <span>Freeze Authority</span>
                        <span>{mintInfo.freezeAuthority?.toBase58()}</span>
                    </div>
                    <Separator className='bg-gray-700'/>
                    <div className='flex justify-between p-5'>
                        <span>Decimals</span>
                        <span>{mintInfo.decimals.toString()}</span>
                    </div>
                </div>
            </div>
            )
        }
    </div>
  )
}

export default Token