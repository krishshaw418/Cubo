import "./home.css";
function Home() {
  return (
    <section aria-label="hero" className="flex w-screen items-center justify-between md:p-20 md:my-7 lg:p-30 lg:my-10 overflow-y-hidden">
      <div className="relative">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-linear-to-tr from-purple-500 rounded-full filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-linear-to-tl  from-pink-700 rounded-full filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-10 left-20 w-72 h-72 bg-linear-to-bl from-cyan-400 rounded-full filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        <div className="relative z-10 flex flex-col items-center">
          <div className="flex flex-col">
            <p className="text-1">
              Launch Your Token
            </p>
            <p className="text-2">
              at the Speed of Solana.
            </p>
            <p className="text-wrap w-150 text-3">
              Solana is the leading high performance network powering internet capital markets, payments, and crypto applications.
            </p>
          </div>
        </div>
      </div>
      <div className="hidden lg:block">
        <div className="cube-container">
            <div className="cube">
                <div className="cube-3d">
                    <div className="cube-face face-front"></div>
                    <div className="cube-face face-back"></div>
                    <div className="cube-face face-right"></div>
                    <div className="cube-face face-left"></div>
                    <div className="cube-face face-top"></div>
                    <div className="cube-face face-bottom"></div>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
}

export default Home;