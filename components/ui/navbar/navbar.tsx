"use client";

import { useEffect, useState } from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import "./navbar.css";
import Image from "next/image";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { useWallet } from "@solana/wallet-adapter-react";
import { usePathname, useRouter } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

function Navbar() {
  const { connected: isConnected, disconnect } = useWallet();
  const pathname = usePathname() ?? "/";
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (isConnected) {
      setMenuOpen(false);
    }
  }, [isConnected]);

  const tabValue =
    pathname === "/"
      ? "home"
      : pathname.startsWith("/tokens")
        ? "tokens"
        : undefined;

  const navLinks = [
    { label: "Home", href: "/", value: "home" },
    { label: "Tokens", href: "/tokens", value: "tokens" },
  ];

  return (
    <nav
      id="navbar"
      aria-label="Main navigation"
      className="sticky top-0 z-50 flex w-full items-center justify-between
                 border-b border-white/5 bg-neutral-950/90
                 px-3 py-2 backdrop-blur-lg sm:px-5"
    >
      {/* Logo */}
      <Link href="/" className="flex min-w-0 items-center">
        <Image
          src="/logo.svg"
          alt="Cubo logo"
          width={56}
          height={56}
          priority
          className="cropped-svg h-11 w-11 sm:h-14 sm:w-14"
        />
        <span className="logo-text text-2xl sm:text-3xl">CUBO</span>
      </Link>

      {/* Desktop navigation */}
      <div className="hidden items-center gap-5 md:flex">
        {isConnected && (
          <Tabs
            value={tabValue}
            onValueChange={(value) => {
              if (value === "home") router.push("/");
              if (value === "tokens") router.push("/tokens");
            }}
          >
            <TabsList variant="line">
              {navLinks.map((item) => (
                <TabsTrigger
                  key={item.value}
                  value={item.value}
                  className="cursor-pointer"
                  asChild
                >
                  <Link href={item.href}>{item.label}</Link>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        )}

        <WalletMultiButton
          style={{
            fontFamily: "Orbitron, sans-serif",
            backgroundColor: "transparent",
            backgroundImage:
              "linear-gradient(135deg, #21e47f 0%, #68c4f6 100%)",
            WebkitTextFillColor: "transparent",
            WebkitBackgroundClip: "text",
            borderRadius: "10px",
            boxShadow: "0 0 4px #00FFFF, 0 0 4px #14F195",
            letterSpacing: "3px",
          }}
        />
      </div>

      {/* Mobile navigation */}
      <div className="md:hidden">
        <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
          <SheetTrigger asChild>
            <button
              type="button"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              className="group flex size-11 items-center justify-center
                         rounded-lg border border-emerald-400/30
                         bg-black/60 transition-colors
                         hover:border-cyan-400
                         focus-visible:outline-none
                         focus-visible:ring-2 focus-visible:ring-cyan-400"
            >
              <span className="relative h-5 w-6">
                <span
                  className={`absolute left-0 top-1 h-0.5 w-6 rounded-full
                    bg-emerald-300 transition-all duration-300 ease-in-out
                    ${menuOpen ? "top-[9px] rotate-45" : ""}`}
                />
                <span
                  className={`absolute left-0 top-[9px] h-0.5 w-6 rounded-full
                    bg-cyan-300 transition-all duration-200
                    ${menuOpen ? "scale-x-0 opacity-0" : ""}`}
                />
                <span
                  className={`absolute left-0 top-[17px] h-0.5 w-6 rounded-full
                    bg-emerald-300 transition-all duration-300 ease-in-out
                    ${menuOpen ? "top-[9px] -rotate-45" : ""}`}
                />
              </span>
            </button>
          </SheetTrigger>

          <SheetContent
            side="right"
            className="flex w-[min(85vw,20rem)] flex-col
             border-l border-emerald-400/30
             bg-[#0b0b0b] p-6 text-white"
          >
            <SheetHeader className="border-b border-emerald-400/20 pb-5">
              <SheetTitle
                className="font-orbitron text-xl tracking-[0.25em]
                           text-emerald-300"
              >
                CUBO
              </SheetTitle>
            </SheetHeader>

            <div className="mt-8 w-full min-w-0">
              {!isConnected ? (
                <div className="mobile-wallet-button">
                  <WalletMultiButton />
                </div>
              ) : (
                <div className="flex w-full min-w-0 flex-col items-stretch gap-3">
                  {navLinks.map((item) => (
                    <SheetClose asChild key={item.value}>
                      <Link
                        href={item.href}
                        className={`mobile-nav-link w-full ${
                          pathname === item.href ? "is-active" : ""
                        }`}
                      >
                        {item.label}
                      </Link>
                    </SheetClose>
                  ))}

                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      void disconnect();
                    }}
                    className="mobile-nav-link mobile-nav-disconnect w-full"
                  >
                    Disconnect Wallet
                  </button>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}

export default Navbar;
