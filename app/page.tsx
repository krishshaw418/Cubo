"use client";
import "./page.css";
import { useNavBarHeight } from "@/hooks/navBarHeight";

function Page() {
  const height = useNavBarHeight();

  return (
    <main
      aria-label="hero"
      className="relative mx-auto flex w-full max-w-7xl flex-col items-center justify-center gap-8 px-5 py-10 sm:px-8 md:min-h-[calc(100dvh-5rem)] md:flex-row md:justify-between md:gap-10 md:px-10 lg:px-12"
      style={{ minHeight: `calc(100dvh - ${height}px)` }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div
          className="absolute left-0 top-0 h-72 w-72 rounded-full
                    bg-purple-500/70 blur-3xl"
        />

        <div
          className="absolute right-0 top-0 h-72 w-72 rounded-full
                    bg-pink-700/70 blur-3xl"
        />

        <div
          className="absolute bottom-0 left-1/4 h-72 w-72 rounded-full
                    bg-cyan-400/70 blur-3xl"
        />
      </div>
      <section className="relative z-10 flex w-full max-w-2xl flex-col justify-center py-4 md:w-1/2 md:py-10">
        <h1 className="font-orbitron text-3xl font-black leading-tight tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
          Launch Your Token
          <span className="mt-2 block bg-gradient-to-r from-emerald-400 to-violet-500 bg-clip-text text-2xl font-semibold text-transparent sm:text-3xl md:text-4xl lg:text-5xl">
            at the Speed of Solana.
          </span>
        </h1>
        <p className="mt-5 max-w-xl text-sm leading-7 sm:text-base md:text-lg">
          Solana is the leading high performance network powering internet
          capital markets, payments, and crypto applications.
        </p>
      </section>

      <section
        className="flex w-full items-center justify-center md:w-1/2"
        aria-label="Animated cube illustration"
      >
        <div className="cube-container">
          <div className="cube" aria-hidden="true">
            <div className="cube-3d">
              <div className="cube-face face-front" />
              <div className="cube-face face-back" />
              <div className="cube-face face-right" />
              <div className="cube-face face-left" />
              <div className="cube-face face-top" />
              <div className="cube-face face-bottom" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Page;
