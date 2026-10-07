// function Footer() {
//   const quickLinks = [
//     { label: "Home", href: "#home" },
//     { label: "Daily Streak", href: "#streak" },
//     { label: "Rewards", href: "#rewards" },
//     { label: "Transactions", href: "#transactions" },
//   ];

//   const socials = ["X", "in", "IG"];

//   return (
//     <footer className="relative overflow-hidden bg-slate-950 text-slate-100">
//       <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(168,85,247,0.24),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(34,197,94,0.16),_transparent_30%)]" />

//       <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
//         <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-[0_30px_80px_rgba(15,23,42,0.55)] backdrop-blur-sm sm:p-8">
//           <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr_0.7fr_1fr]">
//             <div>
//               <div className="flex items-center gap-3">
//                 <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 via-purple-500 to-pink-500 text-lg font-black text-white shadow-lg shadow-violet-500/40">
//                   V
//                 </div>

//                 <div>
//                   <p className="text-xs font-semibold uppercase tracking-[0.35em] text-violet-300">
//                     VELOOP
//                   </p>
//                   <p className="text-sm text-slate-300">Rewards</p>
//                 </div>
//               </div>

//               <p className="mt-5 max-w-md text-sm leading-7 text-slate-300">
//                 Keep your momentum going, hit your daily streaks, and unlock premium rewards designed to keep you moving forward.
//               </p>

//               <div className="mt-6 flex flex-wrap gap-2">
//                 {['Daily wins', 'Goal tracking', 'Exclusive perks'].map((tag) => (
//                   <span
//                     key={tag}
//                     className="rounded-full border border-violet-400/30 bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-200"
//                   >
//                     {tag}
//                   </span>
//                 ))}
//               </div>
//             </div>

//             <div>
//               <h3 className="text-xs font-bold uppercase tracking-[0.28em] text-slate-400">
//                 Explore
//               </h3>

//               <div className="mt-5 flex flex-col gap-3">
//                 {quickLinks.map((link) => (
//                   <a
//                     key={link.label}
//                     href={link.href}
//                     className="text-sm text-slate-300 transition hover:text-white"
//                   >
//                     {link.label}
//                   </a>
//                 ))}
//               </div>
//             </div>

//             <div>
//               <h3 className="text-xs font-bold uppercase tracking-[0.28em] text-slate-400">
//                 Company
//               </h3>

//               <div className="mt-5 space-y-3 text-sm text-slate-300">
//                 <p>Privacy</p>
//                 <p>Terms</p>
//                 <p>Careers</p>
//               </div>
//             </div>

//             <div>
//               <h3 className="text-xs font-bold uppercase tracking-[0.28em] text-slate-400">
//                 Support
//               </h3>

//               <p className="mt-5 text-sm leading-7 text-slate-300">
//                 Need a hand? Our team is here to help you make the most of every reward.
//               </p>

//               <a
//                 href="mailto:velooprewardsofficial@gmail.com"
//                 className="mt-5 inline-flex rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-violet-500/30 transition hover:scale-[1.02]"
//               >
//                 Contact Support
//               </a>
//             </div>
//           </div>

//           <div className="mt-8 flex flex-col gap-5 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
//             <p className="text-sm text-slate-400">
//               © 2026 VELOOP Rewards. All rights reserved.
//             </p>

//             <div className="flex items-center gap-3">
//               {socials.map((social) => (
//                 <div
//                   key={social}
//                   className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-slate-900/70 text-xs font-bold text-slate-200 transition hover:border-violet-400/50 hover:text-violet-200"
//                 >
//                   {social}
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// }

// export default Footer;


function Footer() {
  const quickLinks = [
    { label: "Home", href: "#home" },
    { label: "Daily Streak", href: "#streak" },
    { label: "Rewards", href: "#rewards" },
    { label: "Transactions", href: "#transactions" },
  ];

  const socials = ["X", "in", "IG"];

  return (
    <footer className="relative overflow-hidden bg-[#080D18] text-white">
      {/* ================= BACKGROUND GLOW ================= */}
      <div className="pointer-events-none absolute -left-40 top-10 h-72 w-72 rounded-full bg-purple-600/10 blur-3xl sm:h-80 sm:w-80" />

      <div className="pointer-events-none absolute -right-40 bottom-0 h-72 w-72 rounded-full bg-indigo-600/10 blur-3xl sm:h-80 sm:w-80" />

      {/* ================= CONTAINER ================= */}
      <div className="relative mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-14">

        {/* ================= MAIN FOOTER CARD ================= */}
        <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.025] shadow-2xl shadow-black/20 sm:rounded-[2rem]">

          {/* ================= TOP CONTENT ================= */}
          <div
            className="
              grid
              grid-cols-1
              gap-9
              px-5
              py-8
              sm:grid-cols-2
              sm:gap-x-8
              sm:gap-y-10
              sm:px-7
              sm:py-9
              md:grid-cols-2
              lg:grid-cols-[1.4fr_0.7fr_0.7fr_1fr]
              lg:gap-10
              lg:px-10
              lg:py-10
          "
          >

            {/* ================= BRAND ================= */}
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-3">

                {/* Logo */}
                <div
                  className="
                    flex
                    h-11
                    w-11
                    shrink-0
                    items-center
                    justify-center
                    rounded-2xl
                    bg-gradient-to-br
                    from-purple-500
                    to-indigo-600
                    text-lg
                    font-black
                    text-white
                    shadow-lg
                    shadow-purple-900/30
                    sm:h-12
                    sm:w-12
                    sm:text-xl
                  "
                >
                  V
                </div>

                <div>
                  <p className="text-sm font-extrabold tracking-[0.2em] text-white sm:text-base">
                    VELOOP
                  </p>

                  <p className="text-xs font-medium text-slate-500">
                    Rewards
                  </p>
                </div>
              </div>

              <p className="mt-5 max-w-md text-sm leading-6 text-slate-400 sm:leading-7">
                Build your streak, complete daily check-ins, and unlock
                exciting rewards as you progress.
              </p>

              {/* Feature Tags */}
              <div className="mt-5 flex max-w-md flex-wrap gap-2 sm:mt-6">
                {[
                  "Daily Rewards",
                  "Streak Tracking",
                  "Exclusive Perks",
                ].map((tag) => (
                  <span
                    key={tag}
                    className="
                      rounded-full
                      border
                      border-purple-400/15
                      bg-purple-500/5
                      px-3
                      py-1.5
                      text-[10px]
                      font-semibold
                      text-purple-300
                      sm:text-[11px]
                    "
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* ================= EXPLORE ================= */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                Explore
              </h3>

              <div className="mt-4 flex flex-col gap-3 sm:mt-5">
                {quickLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="
                      group
                      flex
                      w-fit
                      items-center
                      gap-2
                      text-sm
                      text-slate-400
                      transition
                      hover:text-white
                    "
                  >
                    <span
                      className="
                        text-purple-500
                        opacity-0
                        transition
                        group-hover:translate-x-1
                        group-hover:opacity-100
                      "
                    >
                      →
                    </span>

                    <span>{link.label}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* ================= COMPANY ================= */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                Company
              </h3>

              <div className="mt-4 flex flex-col gap-3 sm:mt-5">
                <button
                  type="button"
                  className="w-fit text-left text-sm text-slate-400 transition hover:text-white"
                >
                  Privacy Policy
                </button>

                <button
                  type="button"
                  className="w-fit text-left text-sm text-slate-400 transition hover:text-white"
                >
                  Terms & Conditions
                </button>

                <button
                  type="button"
                  className="w-fit text-left text-sm text-slate-400 transition hover:text-white"
                >
                  Careers
                </button>
              </div>
            </div>

            {/* ================= SUPPORT ================= */}
            <div className="sm:col-span-2 lg:col-span-1">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                Support
              </h3>

              <p className="mt-4 max-w-sm text-sm leading-6 text-slate-400 sm:mt-5">
                Have a question or need help? Our support team is here to
                help you.
              </p>

              <a
                href="mailto:velooprewardsofficial@gmail.com"
                className="
                  mt-5
                  inline-flex
                  items-center
                  gap-2
                  rounded-xl
                  bg-purple-600
                  px-4
                  py-2.5
                  text-sm
                  font-bold
                  text-white
                  shadow-lg
                  shadow-purple-900/30
                  transition
                  hover:bg-purple-500
                  active:scale-[0.98]
                "
              >
                Contact Support
                <span>→</span>
              </a>
            </div>
          </div>

          {/* ================= DIVIDER ================= */}
          <div className="mx-5 border-t border-white/10 sm:mx-7 lg:mx-10" />

          {/* ================= BOTTOM AREA ================= */}
          <div
            className="
              flex
              flex-col
              gap-5
              px-5
              py-5
              sm:flex-row
              sm:items-center
              sm:justify-between
              sm:px-7
              sm:py-6
              lg:px-10
            "
          >

            {/* Copyright */}
            <div className="text-center sm:text-left">
              <p className="text-xs font-medium text-slate-500 sm:text-sm">
                © 2026 VELOOP Rewards
              </p>

              <p className="mt-1 text-[10px] text-slate-600 sm:text-[11px]">
                All rights reserved.
              </p>
            </div>

            {/* Socials */}
            <div className="flex items-center justify-center gap-2 sm:justify-end">
              {socials.map((social) => (
                <button
                  key={social}
                  type="button"
                  aria-label={`VELOOP ${social}`}
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-white/10
                    bg-white/[0.03]
                    text-xs
                    font-bold
                    text-slate-400
                    transition
                    hover:border-purple-400/30
                    hover:bg-purple-500/10
                    hover:text-purple-300
                    sm:h-10
                    sm:w-10
                  "
                >
                  {social}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ================= BOTTOM NOTE ================= */}
        <div className="mt-5 px-2 text-center sm:mt-6">
          <p className="text-[9px] leading-4 tracking-wide text-slate-700 sm:text-[10px]">
            Rewards and eligibility are subject to system verification.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;