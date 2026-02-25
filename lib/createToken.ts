import {
    useConnection,
    useWallet,
} from "@solana/wallet-adapter-react";
import {
    Keypair,
    SystemProgram,
    Transaction,
} from "@solana/web3.js";
import {
    createInitializeMintInstruction,
    createAssociatedTokenAccountInstruction,
    MINT_SIZE,
    TOKEN_2022_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID,
    MintLayout,
    getAssociatedTokenAddressSync
} from "@solana/spl-token";

export function useCreateToken(props : { decimal: number, initialSupply: number }) {
    const { connection } = useConnection();
    const {publicKey, sendTransaction} = useWallet();

    const createToken = async () => {
        if (!publicKey) return;

        try {
            // Creating a mint account
            const mint = Keypair.generate();

            // Calculating the rent for initializing mint and storing mint configuration on-chain
            const rentExempt = await connection.getMinimumBalanceForRentExemption(
                MintLayout.span
            );

            const createAccountInstruction = SystemProgram.createAccount({
                fromPubkey: publicKey,
                newAccountPubkey: mint.publicKey,
                space: MINT_SIZE,
                lamports: rentExempt,
                programId: TOKEN_2022_PROGRAM_ID
            });

            const initializeMintInstruction = createInitializeMintInstruction(
                mint.publicKey, // mint pubkey
                props.decimal, // decimals
                publicKey, // mint authority
                publicKey, // freeze authority
                TOKEN_2022_PROGRAM_ID
            );

            let transaction = new Transaction().add(createAccountInstruction, initializeMintInstruction);

            const mintTxSignature = await sendTransaction(transaction, connection, {
                signers: [mint],
            });

            console.log("Mint Address:", mint.publicKey.toBase58());
            console.log("Mint Txn Signature:", mintTxSignature);

            const associatedTokenAccount = getAssociatedTokenAddressSync(
                mint.publicKey,
                publicKey,
                false, // allowOwnerOffCurve
                TOKEN_2022_PROGRAM_ID,
                ASSOCIATED_TOKEN_PROGRAM_ID
            );

            // Create associated token account instruction
            const createAssociatedTokenAccountIx = createAssociatedTokenAccountInstruction(
                publicKey, // payer
                associatedTokenAccount, // associated token account address
                publicKey, // owner
                mint.publicKey, // mint
                TOKEN_2022_PROGRAM_ID,
                ASSOCIATED_TOKEN_PROGRAM_ID
            );

            let associatedTokenAccountTx = new Transaction().add(createAssociatedTokenAccountIx);

            const associatedTokenAccountTxSig = await sendTransaction(associatedTokenAccountTx, connection);

            console.log("Associated Token Account Address:", associatedTokenAccount.toBase58());
            console.log("Transaction Signature:", associatedTokenAccountTxSig);

            return { mintTxSignature, associatedTokenAccountTxSig};
        } catch (error) {
            console.error("Mint creation failed:", error);
            throw error;
        }
    };
    return { createToken };
}
