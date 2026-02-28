import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys/web";
import { mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata';

function useUmi() {

    const wallet = useWallet();
    const connection = useConnection();
    const umi = createUmi(connection.connection.rpcEndpoint);

    // Plugins
    umi.use(walletAdapterIdentity(wallet)); // For identifying the wallet
    umi.use(irysUploader()); // for ipfs upload
    umi.use(mplTokenMetadata()); // for creating metadata account
    
    const umiInstance = () => {
        return umi;
    }
    
    return { umiInstance };
}

export default useUmi;