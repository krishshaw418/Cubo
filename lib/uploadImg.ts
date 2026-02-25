import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys/web";

const uploadImg = async () => {
    const wallet = useWallet();
    const connection = useConnection();
    const umi = createUmi(connection.connection.rpcEndpoint);

    umi.use(walletAdapterIdentity(wallet));

    // const [imgURI] = await umi.uploader.upload(["./uploads"],
    //     {
    //         onProgress: (percent) => {
    //         console.log(`${percent * 100}% uploaded...`);
    //     },
    //     }
    // );
}