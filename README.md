# Solana Token Launcher

[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Solana](https://img.shields.io/badge/Solana-9945FF?style=for-the-badge&logo=solana&logoColor=white)](https://solana.com/)

A modern, user-friendly web application for launching and managing SPL tokens on the Solana blockchain. Built with Next.js and TypeScript, this platform empowers users to create, deploy, and manage tokens with rich metadata through an intuitive interface — no command-line required.

## 🚀 Features

- **Token Creation**: Seamlessly create and deploy new SPL tokens with custom metadata using Metaplex standards.
- **Liquidity Pool Creation**: Establish liquidity pools for your tokens on Raydium DEX for trading.
- **Token Dashboard**: Monitor your token balances & metadata.
- **Pool Viewing**: Discover liquidity pools associated with your tokens.
- **Wallet Integration**: Secure connection with popular Solana wallets like Phantom and Solflare.

## 🛠️ Tech Stack

| Category            | Technology                                                              |
| ------------------- | ----------------------------------------------------------------------- |
| **Framework**       | [Next.js](https://nextjs.org/)                                          |
| **Language**        | [TypeScript](https://www.typescriptlang.org/)                           |
| **Styling**         | [Tailwind CSS](https://tailwindcss.com/)                                   |
| **Blockchain**      | [Solana](https://solana.com/)                                           |
| **Token Standard**  | [SPL Token](https://spl.solana.com/token)                               |
| **Metadata**        | [Metaplex](https://www.metaplex.com/)                                   |
| **DEX Integration** | [Raydium SDK](https://raydium.io/)                                      |
| **Wallet Adapter**  | [@solana/wallet-adapter](https://github.com/solana-labs/wallet-adapter) |
| **Web3**            | [@solana/web3.js](https://solana-labs.github.io/solana-web3.js/)        |

## 📋 Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm or yarn
- A Solana-compatible browser wallet (e.g., [Phantom](https://phantom.app/), [Solflare](https://solflare.com/))

## 🚀 Getting Started

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/krishshaw418/Cubo.git
   cd cubo
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Run the development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000) to access the application.

## 📖 Usage

1. Connect your Solana wallet.
2. Create a new token by filling out the token details form.
3. Deploy your token to the Solana blockchain.
4. Optionally, create a liquidity pool for trading.
5. View your tokens from the dashboard.

## 🏗️ Available Scripts

| Command         | Description                  |
| --------------- | ---------------------------- |
| `npm run dev`   | Start the development server |
| `npm run build` | Build the app for production |
| `npm run start` | Start the production server  |
| `npm run lint`  | Run ESLint for code quality  |

## ⚠️ Important Notes

- **Network Selection**: Ensure your wallet is connected to **Devnet** for testing to avoid using real SOL.
- **Fees**: A small amount of SOL is required in your wallet for transaction fees and account rent on Solana.
- **Security**: Always verify transactions in your wallet before confirming.
