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
<<<<<<< HEAD
      {/* Bottom / Drop Shadow */}
=======
      {/* Bottom/drop shadow */}
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
      <div
        className="
          absolute
          -bottom-4
          left-[10%]
          right-[10%]
          h-8
          rounded-full
<<<<<<< HEAD
          bg-[#B76E79]/20
=======
          bg-purple-500/20
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
          blur-xl
        "
      />

      {/* Main Card */}
      <div
        className="
          relative overflow-hidden
          rounded-[20px]
<<<<<<< HEAD
          border border-[#D99AA3]/30
          bg-white

          shadow-[0_14px_30px_rgba(183,110,121,0.14)]

          transition-all duration-500

          group-hover:shadow-[0_22px_45px_rgba(183,110,121,0.25)]
        "
      >
        {/* Background Glow */}
=======
          border border-purple-100
          bg-white

          shadow-[0_14px_30px_rgba(91,33,182,0.14)]

          transition-all duration-500

          group-hover:shadow-[0_22px_45px_rgba(91,33,182,0.25)]
        "
      >
        {/* Background glow */}
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
        <div
          className="
            pointer-events-none
            absolute
            -right-10
            -top-10
            h-28
            w-28
            rounded-full
<<<<<<< HEAD
            bg-[#FFE5E8]
=======
            bg-purple-100
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
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
<<<<<<< HEAD
            text-[#D99AA3]
=======
            text-purple-300
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
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
<<<<<<< HEAD
              from-[#8F4F5A]
              via-[#B76E79]
              to-[#D99AA3]
=======
              from-violet-600
              to-purple-500
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

              text-white

              shadow-lg
<<<<<<< HEAD
              shadow-[#B76E79]/30
=======
              shadow-purple-300/40
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

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
<<<<<<< HEAD
              text-[#5A3038]
=======
              text-purple-950
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

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
<<<<<<< HEAD
                from-[#8F4F5A]
                via-[#B76E79]
                to-[#D99AA3]

=======
                from-violet-600
                to-purple-500
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
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
<<<<<<< HEAD
              bg-[#FFE5E8]
              text-[#8F4F5A]
=======
              bg-purple-50
              text-purple-600
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

              transition-all
              duration-300

<<<<<<< HEAD
              group-hover:bg-[#B76E79]
=======
              group-hover:bg-purple-600
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
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
<<<<<<< HEAD
            from-[#8F4F5A]
            via-[#B76E79]
            to-[#D99AA3]
=======
            from-violet-700
            via-purple-600
            to-fuchsia-500
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

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
<<<<<<< HEAD
        bg-gradient-to-br
        from-[#FFF9FA]
        via-[#FDF3F5]
        to-white
=======
        bg-[#fcfaff]
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
        py-14

        sm:py-20
      "
    >
<<<<<<< HEAD
      {/* Background Glow */}
=======
      {/* Background glow */}
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
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
<<<<<<< HEAD
          bg-[#D99AA3]/20
=======
          bg-purple-200/30
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
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
<<<<<<< HEAD
              border-[#D99AA3]/40
              bg-white/80
=======
              border-purple-100
              bg-white
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

              px-3
              py-1.5

              text-[10px]
              font-bold
              uppercase
              tracking-[0.15em]
<<<<<<< HEAD
              text-[#8F4F5A]
=======
              text-purple-600
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

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
<<<<<<< HEAD
                bg-[#B76E79]
=======
                bg-purple-500
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

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
<<<<<<< HEAD
              text-[#4A252D]
=======
              text-purple-950
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

              sm:text-5xl
            "
          >
            Grow your rewards

            <span
              className="
                block
                bg-gradient-to-r
<<<<<<< HEAD
                from-[#8F4F5A]
                via-[#B76E79]
                to-[#D99AA3]
=======
                from-violet-600
                via-purple-600
                to-fuchsia-500
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

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