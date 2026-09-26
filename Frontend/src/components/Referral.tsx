import React from "react";
import { Share2 } from "lucide-react";

export const Referral: React.FC = () => {
  return (
    <section
      id="referral"
      className="
        py-20
        sm:py-28
        relative

        bg-[#120B0D]/40

        overflow-hidden
      "
    >
      {/* Ambient Rose Glow */}
      <div
        className="
          absolute
          top-0
          left-1/2
          -translate-x-1/2

          w-[600px]
          h-[250px]

          bg-[#B76E79]/10

          blur-[100px]

          pointer-events-none
        "
      />

      <div
        className="
          absolute
          bottom-0
          right-0

          w-[350px]
          h-[250px]

          bg-[#D99AA3]/8

          blur-[100px]

          pointer-events-none
        "
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">

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
            <Share2 className="w-3.5 h-3.5" />

            <span>UNLIMITED NETWORK EXPANSION</span>
          </div>

          {/* Heading */}
          <h2
            className="
              text-3xl
              sm:text-4xl
              md:text-5xl

              font-black
              tracking-tight

              text-white
            "
          >
            Referral Network &{" "}
            <span className="text-brand-gradient">
              Rank Rewards
            </span>
          </h2>

          {/* Description */}
          <p
            className="
              mt-3

              text-base

              text-[#D99AA3]/70

              leading-relaxed
            "
          >
            Build your attention syndicate. Earn recurring commissions
            whenever your team watches ads around the world.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Referral;