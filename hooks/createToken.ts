import {
    generateSigner,
    percentAmount
} from "@metaplex-foundation/umi";
import {
  createV1,
  TokenStandard,
} from '@metaplex-foundation/mpl-token-metadata';
import useUmi from "@/hooks/useUmi";

export function useCreateToken() {
    const { umiInstance } = useUmi();

    const createToken = async (name: string, uri: string, symbol: string, decimal: number) => {
        const umi = umiInstance();
        try {
            // Creating a mint account
            const mint = generateSigner(umi);

            // Creating new token mint
            const result = await createV1(umi, {
                mint: mint,
                authority: umi.identity,
                name: name,
                symbol: symbol,
                decimals: decimal,
                uri: uri,
                sellerFeeBasisPoints: percentAmount(0),
                tokenStandard: TokenStandard.Fungible
            }).sendAndConfirm(umi);

            return { mintPubKey: mint.publicKey };
        } catch (error) {
            console.error("Mint creation failed:", error);
            throw error;
        }
    };
    return { createToken };
}
