import type { PublicKey } from "@solana/web3.js";
import { mintV1, TokenStandard } from '@metaplex-foundation/mpl-token-metadata';
import useUmi from "@/hooks/useUmi";
import { publicKey } from "@metaplex-foundation/umi";

export function useMintToken() {

  const { umiInstance } = useUmi();

  const mintTokens = async (mintAddress: PublicKey, tokenOwner: PublicKey, mintAmount: number) => {
    try {
      if (!tokenOwner) {
        throw new Error("Token owner public key not found!");
      }
      
      const result = await mintV1(umiInstance(), {
        mint: publicKey(mintAddress.toBase58()),
        authority: umiInstance().identity,
        amount: mintAmount,
        tokenOwner: publicKey(tokenOwner),
        tokenStandard: TokenStandard.Fungible
      }).sendAndConfirm(umiInstance());

      return result.signature;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  return { mintTokens };
}