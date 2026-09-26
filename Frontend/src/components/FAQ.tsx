import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "How does ADSPROMOHUB pay users for watching ads?",
      a: "Advertisers allocate marketing budgets to ADSPROMOHUB for targeted global reach. When you watch a verified 5-30 second advertisement, our proof-of-attention protocol verifies human engagement and automatically credits the designated reward directly into your account wallet in real time.",
    },
    {
      q: "What payment methods are supported and what is the minimum withdrawal?",
      a: "We support instant on-chain USDT (TRC-20, ERC-20, BEP-20), Bitcoin (BTC), PayPal, and direct SEPA/SWIFT bank transfers. The minimum withdrawal threshold starts at just $10.00 USD for standard accounts, with instant automated dispatch.",
    },
    {
      q: "Is it completely free to get started?",
      a: "Yes! Anyone can register for free without depositing any capital. Free tier accounts can watch up to 10 ads per day, invite friends to earn 10% Level 1 referral commissions, and cash out their balance at any time.",
    },
    {
      q: "How does the 5-Tier Referral System work?",
      a: "When you share your personal referral link, you earn 15% on direct referrals (Tier 1). You also earn secondary commissions down to 5 generations: 8% on Tier 2, 4% on Tier 3, 2% on Tier 4, and 1% on Tier 5. As your network grows, you also qualify for one-time cash bonuses and profit-sharing pools.",
    },
    {
      q: "Can businesses and brands submit their own advertising campaigns?",
      a: "Yes! Advertisers can target specific geographic regions, demographics, and viewer interests. Campaigns start at $50 and include real-time analytics with verified human view guarantees and zero bot fraud.",
    },
  ];

  return (
<<<<<<< HEAD
    <section
      id="faq"
      className="
        py-20
        sm:py-28
        relative
        bg-transparent
      "
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="text-center mb-14">

          {/* Badge */}
          <div
            className="
              inline-flex
              items-center
              gap-2
              px-3
              py-1
              rounded-full

              bg-[#B76E79]/10

              border
              border-[#D99AA3]/30

              text-[#E3AAB2]

              text-xs
              font-semibold
              mb-3

              shadow-[0_0_20px_rgba(217,154,163,0.08)]
            "
          >
            <HelpCircle className="w-3.5 h-3.5" />

            <span>COMMONLY ASKED QUESTIONS</span>
          </div>

          {/* Heading */}
          <h2
            className="
              text-3xl
              sm:text-4xl
              font-black
              tracking-tight
              text-white
            "
          >
            Frequently Asked{" "}
            <span className="text-brand-gradient">
              Questions
            </span>
          </h2>

          {/* Description */}
          <p
            className="
              mt-2
              text-sm
              text-[#D99AA3]/70
            "
          >
            Everything you need to know about watching ads,
            referral commissions, and payouts.
          </p>
        </div>

        {/* FAQ List */}
        <div className="space-y-3.5">

          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;

            return (
              <div
                key={faq.q}
                className={`
                  group
                  rounded-2xl
                  overflow-hidden

                  bg-[#120B0D]/70

                  border
                  ${
                    isOpen
                      ? "border-[#D99AA3]/45"
                      : "border-[#B76E79]/20"
                  }

                  backdrop-blur-xl

                  transition-all
                  duration-300

                  ${
                    isOpen
                      ? "shadow-[0_0_30px_rgba(183,110,121,0.12)]"
                      : "shadow-[0_0_15px_rgba(183,110,121,0.04)]"
                  }
                `}
              >

                {/* Question Button */}
                <button
                  onClick={() =>
                    setOpenIndex(isOpen ? null : idx)
                  }
                  className="
                    w-full
                    px-6
                    py-4.5

                    text-left

                    flex
                    items-center
                    justify-between
                    gap-4

                    transition-all
                    duration-300

                    hover:bg-[#B76E79]/5
                  "
                >

                  {/* Question */}
                  <span
                    className={`
                      text-sm
                      sm:text-base
                      font-bold

                      transition-colors
                      duration-300

                      ${
                        isOpen
                          ? "text-[#FFE5E8]"
                          : "text-white"
                      }
                    `}
                  >
                    {faq.q}
                  </span>

                  {/* Arrow */}
                  <div
                    className={`
                      shrink-0
                      w-8
                      h-8
                      rounded-full

                      flex
                      items-center
                      justify-center

                      border

                      transition-all
                      duration-300

                      ${
                        isOpen
                          ? `
                            bg-[#B76E79]/15
                            border-[#D99AA3]/40
                          `
                          : `
                            bg-[#B76E79]/5
                            border-[#B76E79]/20
                          `
                      }
                    `}
                  >
                    <ChevronDown
                      className={`
                        w-4
                        h-4

                        transition-all
                        duration-300

                        ${
                          isOpen
                            ? "rotate-180 text-[#E3AAB2]"
                            : "text-[#D99AA3]"
                        }
                      `}
                    />
                  </div>
                </button>

                {/* Answer */}
                {isOpen && (
                  <div
                    className="
                      px-6
                      pb-5
                      pt-1

                      text-xs
                      sm:text-sm

                      text-[#D99AA3]/75

                      leading-relaxed

                      border-t
                      border-[#B76E79]/15

                      bg-gradient-to-b
                      from-[#B76E79]/5
                      to-transparent

                      animate-in
                      fade-in
                      slide-in-from-top-1
                      duration-300
                    "
                  >
                    {faq.a}
                  </div>
                )}

              </div>
            );
          })}

        </div>
      </div>

      {/* Bottom Rose Glow */}
      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          -bottom-20
          -translate-x-1/2

          w-[500px]
          h-[180px]

          rounded-full

          bg-[#B76E79]/10

          blur-[100px]
        "
      />
=======
    <section id="faq" className="py-20 sm:py-28 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-semibold mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>COMMONLY ASKED QUESTIONS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            Frequently Asked <span className="text-brand-gradient">Questions</span>
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Everything you need to know about watching ads, referral commissions, and payouts.
          </p>
        </div>

        <div className="space-y-3.5">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={faq.q}
                className="rounded-2xl bg-slate-900/60 dark:bg-slate-900/60 light:bg-white border border-white/10 overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full px-6 py-4.5 text-left flex items-center justify-between gap-4 transition-colors hover:bg-white/5"
                >
                  <span className="text-sm sm:text-base font-bold text-white dark:text-white light:text-slate-900">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-purple-400 transition-transform duration-300 shrink-0 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-gray-400 leading-relaxed border-t border-white/5">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
    </section>
  );
};

<<<<<<< HEAD
export default FAQ;
=======
export default FAQ;
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
