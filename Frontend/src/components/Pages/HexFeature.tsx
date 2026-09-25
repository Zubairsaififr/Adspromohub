import React from "react";
import {
  Eye,
  Gift,
  Users,
} from "lucide-react";

type Feature = {
  title: string;
  description: string;
  icon: React.ElementType;
};

const features: Feature[] = [
  {
    title: "WATCH ADS & EARN",
    description:
      "Watch available advertisements and promotional videos to earn rewards directly through your account.",
    icon: Eye,
  },
  {
    title: "REFER & EARN",
    description:
      "Invite friends and grow your network while earning referral rewards from eligible activities.",
    icon: Users,
  },
  {
    title: "EXCITING REWARDS",
    description:
      "Turn your earned points and rewards into valuable benefits through our simple and transparent reward system.",
    icon: Gift,
  },
];

const Hexagon = ({ Icon }: { Icon: React.ElementType }) => {
  return (
    <div className="relative h-[150px] w-[150px] shrink-0 sm:h-[170px] sm:w-[170px]">
      {/* Outer shadow / floating hexagon */}
      <div
        className="
          absolute inset-[8px]
          bg-violet-300/30
          blur-[14px]
          [clip-path:polygon(25%_3%,75%_3%,100%_50%,75%_97%,25%_97%,0_50%)]
        "
      />

      {/* Back / layered hexagon */}
      <div
        className="
          absolute inset-[7px]
          translate-y-3
          bg-violet-100
          [clip-path:polygon(25%_3%,75%_3%,100%_50%,75%_97%,25%_97%,0_50%)]
        "
      />

      {/* Purple border hexagon */}
      <div
        className="
          absolute inset-0
          bg-gradient-to-br from-violet-400 via-purple-500 to-violet-600
          [clip-path:polygon(25%_0%,75%_0%,100%_50%,75%_100%,25%_100%,0_50%)]
          shadow-2xl shadow-violet-400/40
        "
      />

      {/* Main white hexagon */}
      <div
        className="
          absolute inset-[2px]
          flex items-center justify-center
          bg-gradient-to-br from-white via-violet-50 to-purple-50
          [clip-path:polygon(25%_0%,75%_0%,100%_50%,75%_100%,25%_100%,0_50%)]
        "
      >
        {/* Inner hexagon */}
        <div
          className="
            flex h-20 w-20 items-center justify-center
            bg-gradient-to-br from-violet-600 to-purple-500
            text-white
            shadow-xl shadow-violet-400/40
            transition-all duration-500
            group-hover:scale-110
            group-hover:rotate-6
            [clip-path:polygon(25%_0%,75%_0%,100%_50%,75%_100%,25%_100%,0_50%)]
          "
        >
          <Icon size={34} strokeWidth={1.6} />
        </div>
      </div>

      {/* Small decorative dot */}
      <span
        className="
          absolute right-[10px] top-[28px]
          h-3 w-3 rounded-full
          bg-purple-400
          shadow-[0_0_15px_rgba(168,85,247,0.8)]
        "
      />
    </div>
  );
};

const HexFeature = ({ feature }: { feature: Feature }) => {
  const Icon = feature.icon;

  return (
    <div className="group relative flex items-center gap-5 sm:gap-7">
      <Hexagon Icon={Icon} />

      {/* Connector */}
      <div className="hidden h-px w-6 bg-gradient-to-r from-violet-300 to-transparent sm:block" />

      {/* Text - NOT inside a card */}
      <div className="max-w-[330px]">
        <div className="mb-2 flex items-start gap-2">
          <span
            className="
              mt-1 flex h-5 w-5 shrink-0
              items-center justify-center
              rounded-full bg-violet-700
              text-[10px] text-white
              shadow-md shadow-violet-300
            "
          >
            →
          </span>

          <h3
            className="
              text-lg font-black leading-tight
              tracking-wide text-violet-700
              sm:text-xl
            "
          >
            {feature.title}
          </h3>
        </div>

        <p className="text-sm leading-6 text-slate-600 sm:text-[15px]">
          {feature.description}
        </p>
      </div>
    </div>
  );
};

export default function HexFeatures() {
  return (
    <section className="overflow-hidden bg-[#fcfbff] px-5 py-20 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        {/* Heading */}
        <div className="mb-20 text-center">
          <span
            className="
              inline-flex items-center gap-2
              text-sm font-bold uppercase tracking-[0.2em]
              text-violet-600
            "
          >
            <span className="h-2 w-2 rounded-full bg-violet-500" />
            Powerful Features
          </span>

          <h2 className="mt-4 text-4xl font-black text-slate-950 sm:text-5xl">
            Earn More with{" "}
            <span className="bg-gradient-to-r from-violet-600 to-purple-500 bg-clip-text text-transparent">
              Ads & Referrals
            </span>
          </h2>
        </div>

        {/* Hexagon layout */}
        <div
          className="
            grid gap-x-14 gap-y-20
            md:grid-cols-2
            xl:grid-cols-3
          "
        >
          {features.map((feature) => (
            <HexFeature
              key={feature.title}
              feature={feature}
            />
          ))}
        </div>
      </div>
    </section>
  );
}