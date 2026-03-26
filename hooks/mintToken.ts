import { mintV1, TokenStandard } from '@metaplex-foundation/mpl-token-metadata';
import useUmi from "@/hooks/useUmi";
import { KeypairSigner } from "@metaplex-foundation/umi";

export function useMintToken() {

  const { umi } = useUmi();

  const mintTokens = async (mint: KeypairSigner, mintAmount: number) => {

    try {
      const result = await mintV1(umi, {
        mint: mint.publicKey,
        authority: umi.identity,
        amount: mintAmount,
        tokenOwner: umi.identity.publicKey,
        tokenStandard: TokenStandard.Fungible
      }).sendAndConfirm(umi, { confirm: { commitment: "finalized" } }); // using "finalized" is important here

      return result.signature;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  return { mintTokens };
}