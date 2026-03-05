import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys/web";
import { mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata';
import { useMemo } from 'react';

function useUmi() {

    const wallet = useWallet();
    const { connection } = useConnection();
    const umi = useMemo(() => {
        const umiInstance = createUmi(connection.rpcEndpoint)
            .use(mplTokenMetadata())
            .use(irysUploader());
        return umiInstance;
    }, [connection.rpcEndpoint]);

    useMemo(() => {
        umi.use(walletAdapterIdentity(wallet)); // For identifying the wallet
    }, [wallet.publicKey, wallet.connected])
    
    return { umi };
}

export default useUmi;