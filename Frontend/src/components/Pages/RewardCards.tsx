import React from "react";
import {
  Gift,
  TrendingUp,
  Crown,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";

type RewardCard = {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ElementType;
};

const rewards: RewardCard[] = [
  {
    title: "Rank Bonus",
    value: "",
    subtitle: "Special reward for your rank",
    icon: Crown,
  },
  {
    title: "Daily Growth",
    value: "",
    subtitle: "Daily earning opportunity",
    icon: TrendingUp,
  },
  {
    title: "Level Profit",
    value: "",
    subtitle: "Earn more as you level up",
    icon: Gift,
  },
  {
    title: "Extra Bonus",
    value: "",
    subtitle: "Additional performance reward",
    icon: Sparkles,
  },
];

const RewardCard = ({
  reward,
  index,
}: {
  reward: RewardCard;
  index: number;
}) => {
  const Icon = reward.icon;

  return (
    <div
      className="
        group relative w-full
        transition-all duration-500
        hover:-translate-y-3
        md:w-[250px]
        lg:w-[270px]
      "
      style={{
        zIndex: rewards.length - index,
      }}
    >
      {/* Bottom / Drop Shadow */}
      <div
        className="
          absolute
          -bottom-4
          left-[10%]
          right-[10%]
          h-8
          rounded-full
          bg-[#B76E79]/20
          blur-xl
        "
      />

      {/* Main Card */}
      <div
        className="
          relative overflow-hidden
          rounded-[20px]
          border border-[#D99AA3]/30
          bg-white

          shadow-[0_14px_30px_rgba(183,110,121,0.14)]

          transition-all duration-500

          group-hover:shadow-[0_22px_45px_rgba(183,110,121,0.25)]
        "
      >
        {/* Background Glow */}
        <div
          className="
            pointer-events-none
            absolute
            -right-10
            -top-10
            h-28
            w-28
            rounded-full
            bg-[#FFE5E8]
            blur-2xl
          "
        />

        {/* Sparkle */}
        <Sparkles
          size={18}
          className="
            absolute
            right-4
            top-4
            text-[#D99AA3]
            transition-transform
            duration-500
            group-hover:rotate-45
          "
        />

        {/* Content */}
        <div className="relative px-4 pb-5 pt-5 sm:px-5 sm:pt-6">
          {/* Icon */}
          <div
            className="
              mb-4
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl

              bg-gradient-to-br
              from-[#8F4F5A]
              via-[#B76E79]
              to-[#D99AA3]

              text-white

              shadow-lg
              shadow-[#B76E79]/30

              transition-all
              duration-500

              group-hover:scale-110
              group-hover:rotate-3

              sm:h-12
              sm:w-12
            "
          >
            <Icon size={21} />
          </div>

          {/* Heading */}
          <h3
            className="
              text-[17px]
              font-black
              leading-tight
              tracking-tight
              text-[#5A3038]

              sm:text-[21px]
            "
          >
            {reward.title}
          </h3>

          {/* Value */}
          <div className="mt-2">
            <span
              className="
                bg-gradient-to-r
                from-[#8F4F5A]
                via-[#B76E79]
                to-[#D99AA3]

                bg-clip-text
                text-3xl
                font-black
                text-transparent

                sm:text-4xl
              "
            >
              {reward.value}
            </span>
          </div>

          {/* Description */}
          <p
            className="
              mt-2
              max-w-[170px]
              text-[11px]
              leading-4
              text-slate-500

              sm:text-xs
              sm:leading-5
            "
          >
            {reward.subtitle}
          </p>

          {/* Arrow */}
          <div
            className="
              absolute
              bottom-5
              right-4

              flex
              h-7
              w-7
              items-center
              justify-center

              rounded-full
              bg-[#FFE5E8]
              text-[#8F4F5A]

              transition-all
              duration-300

              group-hover:bg-[#B76E79]
              group-hover:text-white

              sm:right-5
              sm:h-8
              sm:w-8
            "
          >
            <ArrowUpRight size={15} />
          </div>
        </div>

        {/* Bottom Strip */}
        <div
          className="
            relative
            h-9
            overflow-hidden

            bg-gradient-to-r
            from-[#8F4F5A]
            via-[#B76E79]
            to-[#D99AA3]

            sm:h-10
          "
        >
          <div className="flex h-full items-center justify-center">
            <span
              className="
                text-[10px]
                font-bold
                tracking-wide
                text-white

                sm:text-xs
              "
            >
              VIEW REWARD
            </span>
          </div>

          {/* Shine */}
          <div
            className="
              absolute
              left-0
              top-0
              h-full
              w-1/3

              -translate-x-full
              skew-x-[-20deg]

              bg-white/20

              transition-transform
              duration-700

              group-hover:translate-x-[350%]
            "
          />
        </div>
      </div>
    </div>
  );
};

export default function RewardCards() {
  return (
    <section
      className="
        relative
        overflow-hidden
        bg-gradient-to-br
        from-[#FFF9FA]
        via-[#FDF3F5]
        to-white
        py-14

        sm:py-20
      "
    >
      {/* Background Glow */}
      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-20

          h-72
          w-72
          -translate-x-1/2

          rounded-full
          bg-[#D99AA3]/20
          blur-[100px]
        "
      />

      <div
        className="
          relative
          mx-auto
          max-w-7xl
          px-4

          sm:px-8
        "
      >
        {/* Heading */}
        <div
          className="
            mb-10
            text-center

            sm:mb-14
          "
        >
          <div
            className="
              mb-3
              inline-flex
              items-center
              gap-2

              rounded-full
              border
              border-[#D99AA3]/40
              bg-white/80

              px-3
              py-1.5

              text-[10px]
              font-bold
              uppercase
              tracking-[0.15em]
              text-[#8F4F5A]

              shadow-sm

              sm:px-4
              sm:py-2
              sm:text-xs
            "
          >
            <span
              className="
                h-1.5
                w-1.5
                animate-pulse
                rounded-full
                bg-[#B76E79]

                sm:h-2
                sm:w-2
              "
            />

            Rewards & Benefits
          </div>

          <h2
            className="
              text-3xl
              font-black
              leading-tight
              tracking-tight
              text-[#4A252D]

              sm:text-5xl
            "
          >
            Grow your rewards

            <span
              className="
                block
                bg-gradient-to-r
                from-[#8F4F5A]
                via-[#B76E79]
                to-[#D99AA3]

                bg-clip-text
                text-transparent
              "
            >
              with every level
            </span>
          </h2>

          <p
            className="
              mx-auto
              mt-3
              max-w-xl
              text-xs
              leading-5
              text-slate-500

              sm:mt-4
              sm:text-base
              sm:leading-6
            "
          >
            Unlock different rewards and benefits as your rank and
            level increase.
          </p>
        </div>

        {/* ========================= */}
        {/* RESPONSIVE CARDS */}
        {/* ========================= */}

        <div
          className="
            grid
            grid-cols-2
            gap-3

            sm:gap-5

            md:flex
            md:items-center
            md:justify-center
            md:gap-0
          "
        >
          {rewards.map((reward, index) => (
            <RewardCard
              key={reward.title}
              reward={reward}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}