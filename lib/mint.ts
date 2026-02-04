import { createInitializeMintInstruction, MintLayout, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { Keypair, SystemProgram, Transaction } from '@solana/web3.js';
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

export function useMint() {
    const { connection } = useConnection();
    const {publicKey, sendTransaction} = useWallet();

    const createMint = async () => {
        if (!publicKey) return;

        try {
            // Creating a mint account
            const mintKeypair = Keypair.generate();

            // Calculating the rent for initializing mint and storing mint configuration on-chain
            const rentExempt = await connection.getMinimumBalanceForRentExemption(
                MintLayout.span
            );

            // Creating a transaction to create a mint account and initialize it with the mint config
            const transaction = new Transaction().add(
                SystemProgram.createAccount({
                    fromPubkey: publicKey,
                    newAccountPubkey: mintKeypair.publicKey,
                    lamports: rentExempt,
                    space: MintLayout.span,
                    programId: TOKEN_PROGRAM_ID,
                }),
                createInitializeMintInstruction(
                    mintKeypair.publicKey,
                    9,
                    publicKey,
                    publicKey
                )
            );

            const signature = await sendTransaction(transaction, connection, {
                signers: [mintKeypair],
            });

            return signature;
        } catch (error) {
            console.error("Mint creation failed:", error);
            throw error;
        }
    };
    return { createMint };
}