import {
  Transaction,
} from "@solana/web3.js";
import {
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddressSync,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createMintToInstruction,
  getMint
} from "@solana/spl-token";
import {
    useConnection,
    useWallet,
} from "@solana/wallet-adapter-react";
import type { PublicKey } from "@solana/web3.js";

export function useMintToken() {

  const { connection } = useConnection();
  const { publicKey, sendTransaction} = useWallet();

  const mintTokens = async (mintAddress: PublicKey, mintAmount: number) => {
    try {
      if (!publicKey) {
        throw new Error("Public key not found!");
      }

      // Fetching mint information
      const mintInfo = await getMint(
        connection,
        mintAddress,
        connection.commitment,
        TOKEN_PROGRAM_ID
      );

      if (!mintInfo.mintAuthority?.equals(publicKey)) {
        throw new Error("This wallet is not the mintAuthority of the provided mint address!");
      }

      // Calculating the assosiated token account address of the mint
      const associatedTokenAccount = getAssociatedTokenAddressSync(
        mintAddress,
        publicKey,
        false,
        TOKEN_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID
      );

      // Converting the amount to the smallest unit. Ex: if mintAmount = 1 token unit & mintDecimal = 9 then amount = 1 * 10^9 atomic unit
      const amount = mintAmount * Math.pow(10, mintInfo.decimals);

      // Creating mintToInstruction
      const mintToInstruction = createMintToInstruction(
        mintAddress,
        associatedTokenAccount,
        publicKey,
        amount,
        [],
        TOKEN_PROGRAM_ID
      )

      const mintTransaction = new Transaction().add(mintToInstruction);

      const mintTransactionSignature = await sendTransaction(mintTransaction, connection);

      console.log(`Successfully minted ${mintAmount} tokens`);
      console.log("Transaction Signature:", mintTransactionSignature);

      return mintTransactionSignature;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  return { mintTokens };
}