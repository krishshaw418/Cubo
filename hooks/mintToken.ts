import type { PublicKey } from "@solana/web3.js";
import { mintV1, TokenStandard } from '@metaplex-foundation/mpl-token-metadata';
import useUmi from "@/hooks/useUmi";
import { publicKey } from "@metaplex-foundation/umi";

export function useMintToken() {

  const { umi } = useUmi();

  const mintTokens = async (mintAddress: PublicKey, mintAmount: number) => {

    console.log("UMI identity:", umi.identity.publicKey.toString());

    try {
      const result = await mintV1(umi, {
        mint: publicKey(mintAddress.toBase58()),
        authority: umi.identity,
        amount: mintAmount,
        tokenOwner: umi.identity.publicKey,
        tokenStandard: TokenStandard.Fungible
      }).sendAndConfirm(umi);

      return result.signature;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  return { mintTokens };
}