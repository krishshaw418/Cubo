# Solana Token Launcher

A Next.js web application for launching and managing tokens on the Solana blockchain. Built with a modern stack, this app allows users to create and deploy SPL tokens with on-chain metadata powered by Metaplex — all from a clean, responsive UI.

---

## About

Solana Token Launcher provides a streamlined interface for creating Solana SPL tokens without needing to interact with the CLI. Users can define token details such as name, symbol, decimals, and supply, and deploy directly to Solana from the browser.

---

## Tech Stack

- **Framework** — [Next.js](https://nextjs.org/)
- **Language** — TypeScript
- **Styling** — Tailwind CSS
- **Blockchain** — Solana
- **Token Standard** — [SPL Token](https://spl.solana.com/token) (`@solana/spl-token`)
- **NFT/Metadata** — [Metaplex](https://www.metaplex.com/) (`@metaplex-foundation/mpl-token-metadata`)
- **Wallet Adapter** — `@solana/wallet-adapter-react`
- **Web3** — `@solana/web3.js`

---

## Prerequisites

- [Node.js](https://nodejs.org/) v18+
- npm
- A Solana-compatible browser wallet (e.g. [Phantom](https://phantom.app/))

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/solana-token-launcher.git
cd solana-token-launcher
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

---

## Notes

- Make sure your wallet is set to **Devnet** when testing to avoid spending real SOL.
- You'll need a small amount of SOL in your wallet to pay for transaction fees and account rent.
