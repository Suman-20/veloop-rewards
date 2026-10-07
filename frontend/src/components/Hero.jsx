// import MobileHero from "../assets/Mobile_Hero.png";
// // import BiggerStreak from "../assets/Bigger_Streak.png";

// function Hero() {
//   return (
//     <section
//       id="home"
//       className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-white to-pink-50 bg-white text-gray-900 dark:bg-[#0d0918] dark:text-white"
//     >
//       {/* Decorative shapes */}
//       {/* <img
//   src={BiggerStreak}
//   alt="Bigger Streak"
//   className="pointer-events-none absolute left-4 top-20 hidden w-40 lg:block"
// /> */}

//       <div className="mx-auto grid min-h-[560px] max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-20">

//         {/* Left Content */}
//         <div className="relative z-10 max-w-xl">

//           {/* Small Badge */}
//           <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-purple-200 bg-white px-4 py-2 shadow-sm">
//             <span className="text-lg">🔥</span>

//             <span className="text-sm font-semibold text-purple-700">
//               Daily Streak Rewards
//             </span>
//           </div>

//           {/* Heading */}
//           <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
//             Keep Your
//             <span className="block text-purple-600">
//               Streak Alive
//             </span>
//           </h1>

//           {/* Description */}
//           <p className="mt-5 max-w-lg text-base leading-7 text-gray-600 sm:text-lg">
//             Check in every day, maintain your streak, and unlock bigger
//             rewards as you progress through the week.
//           </p>

//           {/* CTA */}
//           <div className="mt-8 flex flex-col gap-3 sm:flex-row">

//             <button
//               type="button"
//               className="rounded-xl bg-purple-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-purple-200 transition hover:bg-purple-700 active:scale-[0.98]"
//             >
//               Claim Today's Reward
//             </button>

//             <button
//               type="button"
//               className="rounded-xl border border-gray-200 bg-white px-6 py-3.5 text-sm font-bold text-gray-700 transition hover:border-purple-200 hover:bg-purple-50 hover:text-purple-700"
//             >
//               View Streak
//             </button>

//           </div>

//           {/* Small Trust Text */}
//           <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-500">
//             <span className="flex items-center gap-1.5">
//               ✓ Daily Rewards
//             </span>

//             <span className="flex items-center gap-1.5">
//               ✓ 7-Day Streak
//             </span>

//             <span className="flex items-center gap-1.5">
//               ✓ Secure
//             </span>
//           </div>
//         </div>

//         {/* Right Visual */}
//         <div className="relative flex items-center justify-center">

//           {/* Background Glow */}
//           <div className="absolute h-72 w-72 rounded-full bg-purple-200/50 blur-3xl sm:h-96 sm:w-96" />

//           {/* Main Company Asset */}
//           <img
//             src={MobileHero}
//             alt="VELOOP Rewards"
//             className="relative z-10 w-full max-w-md object-contain drop-shadow-2xl sm:max-w-lg"
//           />

//         </div>
//       </div>
//     </section>
//   );
// }

// export default Hero;



import MobileHero from "../assets/Mobile_Hero.png";

function Hero() {
  const handleViewStreak = () => {
    document.getElementById("streak")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleClaim = () => {
    document.getElementById("rewards")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <section
      id="home"
      className="relative overflow-hidden bg-[#0B1220] text-white"
    >
      <div className="mx-auto grid min-h-[560px] max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-20">

        {/* ================= LEFT CONTENT ================= */}
        <div className="relative z-10 max-w-xl">

          {/* Small Badge */}
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-purple-400/20 bg-purple-500/10 px-4 py-2">
            <span className="text-lg">🔥</span>

            <span className="text-sm font-semibold text-purple-300">
              Daily Streak Rewards
            </span>
          </div>


          {/* Heading */}
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            Keep Your

            <span className="block text-purple-400">
              Streak Alive
            </span>
          </h1>


          {/* Description */}
          <p className="mt-5 max-w-lg text-base leading-7 text-slate-400 sm:text-lg">
            Check in every day, maintain your streak, and unlock
            bigger rewards as you progress through the week.
          </p>


          {/* CTA */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">

            <button
              type="button"
              onClick={handleClaim}
              className="rounded-xl bg-purple-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-purple-900/20 transition hover:bg-purple-500 active:scale-[0.98]"
            >
              Claim Today's Reward
            </button>


            <button
              type="button"
              onClick={handleViewStreak}
              className="rounded-xl border border-white/10 bg-white/[0.04] px-6 py-3.5 text-sm font-bold text-slate-300 transition hover:border-purple-400/30 hover:bg-purple-500/10 hover:text-purple-300"
            >
              View Streak
            </button>

          </div>


          {/* Trust Text */}
          <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-500">

            <span className="flex items-center gap-1.5">
              <span className="text-emerald-400">✓</span>
              Daily Rewards
            </span>

            <span className="flex items-center gap-1.5">
              <span className="text-purple-400">✓</span>
              7-Day Streak
            </span>

            <span className="flex items-center gap-1.5">
              <span className="text-blue-400">✓</span>
              Secure
            </span>

          </div>

        </div>


        {/* ================= RIGHT VISUAL ================= */}
        <div className="relative flex items-center justify-center">

          {/* Simple Background Glow */}
          <div className="absolute h-72 w-72 rounded-full bg-purple-600/10 blur-3xl sm:h-96 sm:w-96" />

          {/* Main Image */}
          <img
            src={MobileHero}
            alt="VELOOP Rewards"
            className="relative z-10 w-full max-w-md object-contain drop-shadow-2xl sm:max-w-lg"
          />

        </div>

      </div>
    </section>
  );
}

export default Hero;