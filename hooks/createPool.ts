import { Raydium, getCpmmPdaAmmConfigId, DEVNET_PROGRAM_ID, TxVersion } from "@raydium-io/raydium-sdk-v2";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@metaplex-foundation/umi";
import { BN } from "bn.js";

export function useCreatePool() {

    const { connection } = useConnection();
    const wallet = useWallet();

    const createPool = async (mintA: PublicKey, mintB: PublicKey, mintAAmount: number, mintBAmount: number) => {

        try {
            if (!wallet.publicKey) {
                return;
            }

            const raydium = await Raydium.load({
                connection,
                owner: wallet.publicKey
            });

            const mintAInfo = await raydium.token.getTokenInfo(mintA);
            const mintBInfo = await raydium.token.getTokenInfo(mintB);

            const feeConfigs = await raydium.api.getCpmmConfigs();

            // On devnet, re-derive config IDs from the devnet program
            if (raydium.cluster === "devnet") {
                feeConfigs.forEach((config) => {
                    config.id = getCpmmPdaAmmConfigId(
                        DEVNET_PROGRAM_ID.CREATE_CPMM_POOL_PROGRAM,
                        config.index
                    ).publicKey.toBase58()
                })
            }

            const { execute, extInfo } = await raydium.cpmm.createPool({
                programId: DEVNET_PROGRAM_ID.CREATE_CPMM_POOL_PROGRAM,
                poolFeeAccount: DEVNET_PROGRAM_ID.CREATE_CPMM_POOL_FEE_ACC,
                mintA: mintAInfo,
                mintB: mintBInfo,
                mintAAmount: new BN(mintAAmount),
                mintBAmount: new BN(mintBAmount),
                startTime: new BN(0),
                feeConfig: feeConfigs[0],
                associatedOnly: false,
                ownerInfo: {
                useSOLBalance: true,
                },
                txVersion: TxVersion.V0,
                // optional: set up priority fee here
                // computeBudgetConfig: {
                //   units: 600000,
                //   microLamports: 46591500,
                // },
            })

            const { txId } = await execute({ sendAndConfirm: true });
            console.log('pool created', {
                txId: `https://explorer.solana.com/tx/${txId}`,
                poolId: extInfo.address.poolId.toBase58(),
            });

        } catch (error: any) {
            console.error(error);
            throw new Error(error);
        }
    };

    return { createPool };
}
