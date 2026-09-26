import { useState, useEffect } from "react";
import NavHeader from "./components/NavHeader";
import ScrollGlobeHero from "./components/ScrollGlobeHero";
import MarqueeSliders from "./components/MarqueeSliders";

import LiveCampaigns from "./components/LiveCampaigns";

import Referral from "./components/Referral";
import FAQ from "./components/FAQ";
import HoverFooter from "./components/HoverFooter";
import AdSimulatorModal from "./components/AdSimulatorModal";
import type { SectionData, AdCampaign } from "./types";
import { Sparkles } from "lucide-react";
import Hero from "./components/Pages/Hero";

export function AppForm() {
  // Theme state: dark | light
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  const [balance, setBalance] = useState<number>(0.0);

  // Modal states
  const [adSimulatorOpen, setAdSimulatorOpen] = useState(false);

  // Toast alert
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Toggle Theme
  const handleToggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";

    setTheme(next);

    if (next === "light") {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.remove("light");
      document.documentElement.classList.add("dark");
    }
  };

  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  const handleAdRewardClaimed = (amount: number) => {
    setBalance((prev) => prev + amount);

    showToast(
      `dYZ% Reward Claimed: +$${amount.toFixed(
        2
      )} USD added to your wallet!`
    );
  };

  const handleWatchCampaign = (_camp: AdCampaign) => {
    setAdSimulatorOpen(true);
  };

  const demoSections: SectionData[] = [
    {
      id: "hero-1",
      badge: "Global Ad Exchange",
      title: "Watch & Earn with",
      subtitle: "ADSPROMOHUB",
      description:
        "Turn your daily attention into verified earnings. Watch global advertisements, build a high-yielding referral network across 140+ countries, and unlock exponential daily compounding rewards.",
      align: "left",
      actions: [
        {
          label: "Watch Sample Ad",
          variant: "primary",
          actionType: "watchAd",
        },
      ],
    },
    {
      id: "hero-2",
      badge: "Worldwide Reach",
      title: "Global Attention",
      subtitle: "That Creates Real Value",
      description:
        "ADSPROMOHUB links top multinational brands directly with engaged audiences. Advertisers secure authentic, fraud-free human engagement while viewers monetize every second spent.",
      align: "center",
      actions: [
        {
          label: "Explore Live Ads",
          variant: "primary",
          actionType: "explore",
        },
        {
          label: "View Pricing Plans",
          variant: "secondary",
          actionType: "plans",
        },
      ],
    },
    {
      id: "hero-3",
      badge: "Infinite Compounding",
      title: "Build Your",
      subtitle: "Global Earning Network",
      description:
        "Multiply your daily profits with our 5-tier affiliate compensation tree. Progress through leadership ranks and receive daily company profit pool distributions.",
      align: "left",
      features: [
        {
          title: "Watch & Earn",
          description:
            "Earn up to $0.85 per sponsored video view with instant credit.",
        },
        {
          title: "Refer & Grow",
          description:
            "Earn 15% Level 1 and down to 5 tiers on all team watch volume.",
        },
        {
          title: "Ranks & Pools",
          description:
            "Attain Diamond Leader status to unlock 2% global revenue sharing.",
        },
      ],
      actions: [
        {
          label: "Simulate Your Income",
          variant: "primary",
          actionType: "calculator",
        },
      ],
    },
    {
      id: "hero-4",
      badge: "Start Today",
      title: "Watch. Earn.",
      subtitle: "Refer. Prosper.",
      description:
        "Watch your first sponsored campaign, and request immediate payout to USDT, Bitcoin, or PayPal.",
      align: "center",
      actions: [
        {
          label: "Explore Tier Plans",
          variant: "primary",
          actionType: "plans",
        },
      ],
    },
  ];

  return (
    <div
      className={`
        min-h-screen
        ${theme}

        /* Rose Gold Selection */
        selection:bg-[#D99AA3]
        selection:text-white

        /* Rose Gold Light/Dark Blend */
        bg-gradient-to-br
        from-[#120B0D]
        via-[#1A0F12]
        to-[#24151A]
      `}
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 animate-bounce">
          <div
            className="
              px-4 py-3
              rounded-2xl

              bg-[#120B0D]/95

              border
              border-[#D99AA3]/50

              shadow-[0_0_30px_rgba(217,154,163,0.20)]

              backdrop-blur-xl

              text-white
              text-xs
              font-semibold

              flex
              items-center
              gap-2.5
            "
          >
            <Sparkles className="w-4 h-4 text-[#E3AAB2]" />

            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Navigation Header */}
      <NavHeader
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onOpenAdSimulator={() => setAdSimulatorOpen(true)}
      />

      {/* Main 3D Scroll Hero with Brand Globe */}
      <ScrollGlobeHero
        sections={demoSections}
        onOpenAdSimulator={() => setAdSimulatorOpen(true)}
        onOpenCalculator={() => {
          document
            .getElementById("calculator")
            ?.scrollIntoView({ behavior: "smooth" });
        }}
        onOpenPlans={() => {
          document
            .getElementById("plans")
            ?.scrollIntoView({ behavior: "smooth" });
        }}
      />

      {/* Flowing Marquee Sliders */}
      <div id="advertisers">
        <MarqueeSliders />
      </div>

      {/* How It Works 4-Step Guide */}
      {/* <HowItWorks onOpenAdDemo={() => setAdSimulatorOpen(true)} /> */}

      {/* Live Brand Campaigns Marketplace */}
      <LiveCampaigns onWatchCampaign={handleWatchCampaign} />

      {/* Dynamic Compounding & ROI Calculator */}
      {/* <DailyCompounding onGetStarted={() => setAdSimulatorOpen(true)} /> */}

      {/* 5-Tier Referral Network & Rank System */}
      <Referral />

      {/* Frequently Asked Questions */}
      <FAQ />

      {/* Hero */}
      <Hero />

      {/* Interactive Hover Footer */}
      <HoverFooter />

      {/* Interactive Watch & Earn Ad Simulator Modal */}
      <AdSimulatorModal
        isOpen={adSimulatorOpen}
        onClose={() => setAdSimulatorOpen(false)}
        onAdCompleted={handleAdRewardClaimed}
        currentBalance={balance}
      />
    </div>
  );
}

export default AppForm;