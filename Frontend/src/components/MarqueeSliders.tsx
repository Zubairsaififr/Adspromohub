import React from "react";
import {
  Zap,
  Globe2,
  Eye,
} from "lucide-react";

interface BrandItem {
  name: string;
  category: string;
  views: string;
  cpc: string;
  badge: string;
  iconBg: string;
  accentColor: string;
}

const BRAND_PARTNERS: BrandItem[] = [
  {
    name: "Google Ads",
    category: "Search & Display",
    views: "14.2M views",
    cpc: "$0.45 avg",
    badge: "Verified Partner",
    iconBg: "bg-blue-600",
    accentColor: "border-blue-500/30 text-blue-400",
  },
  {
    name: "Binance Global",
    category: "Crypto Exchange",
    views: "8.9M views",
    cpc: "$0.85 avg",
    badge: "Hot Campaign",
    iconBg: "bg-amber-500",
    accentColor: "border-amber-500/30 text-amber-400",
  },
  {
    name: "Nike Air Series",
    category: "Athletics",
    views: "6.5M views",
    cpc: "$0.50 avg",
    badge: "Featured",
    iconBg: "bg-orange-600",
    accentColor: "border-orange-500/30 text-orange-400",
  },
  {
    name: "Tesla Energy",
    category: "Tech & EV",
    views: "5.1M views",
    cpc: "$0.70 avg",
    badge: "High Reward",
    iconBg: "bg-red-600",
    accentColor: "border-red-500/30 text-red-400",
  },
  {
    name: "Spotify Premium",
    category: "Audio Streaming",
    views: "9.3M views",
    cpc: "$0.38 avg",
    badge: "Daily Drops",
    iconBg: "bg-emerald-600",
    accentColor: "border-emerald-500/30 text-emerald-400",
  },
  {
    name: "Apple One",
    category: "Consumer Tech",
    views: "11.7M views",
    cpc: "$0.65 avg",
    badge: "Top Sponsor",
    iconBg: "bg-slate-700",
    accentColor: "border-slate-500/30 text-slate-300",
  },
  {
    name: "Shopify Sellers",
    category: "E-Commerce",
    views: "4.8M views",
    cpc: "$0.55 avg",
    badge: "Growing",
    iconBg: "bg-green-600",
    accentColor: "border-green-500/30 text-green-400",
  },
  {
    name: "Sony PlayStation",
    category: "Gaming",
    views: "7.4M views",
    cpc: "$0.60 avg",
    badge: "Trending",
    iconBg: "bg-indigo-600",
    accentColor: "border-indigo-500/30 text-indigo-400",
  },
];

interface ActivityItem {
  type: "watch" | "payout" | "rank" | "campaign";
  user: string;
  country: string;
  flag: string;
  message: string;
  amount?: string;
  timeAgo: string;
}

const LIVE_ACTIVITIES: ActivityItem[] = [
  {
    type: "watch",
    user: "alex_k",
    country: "USA",
    flag: "🇺🇸",
    message: "watched Nike Air Max Ad",
    amount: "+$0.48",
    timeAgo: "Just now",
  },
  {
    type: "payout",
    user: "sophie_fr",
    country: "France",
    flag: "🇫🇷",
    message: "instant payout to USDT",
    amount: "$185.00",
    timeAgo: "2m ago",
  },
  {
    type: "campaign",
    user: "ADSPROMOHUB",
    country: "Global",
    flag: "🌐",
    message: "New 100K Impression Pool Live",
    amount: "Active",
    timeAgo: "4m ago",
  },
  {
    type: "rank",
    user: "chen_wei",
    country: "Singapore",
    flag: "🇸🇬",
    message: "promoted to Diamond Pioneer",
    amount: "Tier 4",
    timeAgo: "6m ago",
  },
  {
    type: "watch",
    user: "mateo_br",
    country: "Brazil",
    flag: "🇧🇷",
    message: "completed daily 20 ads goal",
    amount: "+$6.50",
    timeAgo: "8m ago",
  },
  {
    type: "payout",
    user: "fatima_ae",
    country: "UAE",
    flag: "🇦🇪",
    message: "team bonus credited",
    amount: "$340.50",
    timeAgo: "11m ago",
  },
  {
    type: "watch",
    user: "david_uk",
    country: "UK",
    flag: "🇬🇧",
    message: "watched Binance Web3 Demo",
    amount: "+$0.82",
    timeAgo: "14m ago",
  },
  {
    type: "rank",
    user: "elena_es",
    country: "Spain",
    flag: "🇪🇸",
    message: "unlocked Gold Multiplier 1.4x",
    amount: "Rank Up",
    timeAgo: "18m ago",
  },
];

export const MarqueeSliders: React.FC = () => {
  return (
    <section className="py-16 md:py-24 relative overflow-hidden bg-gradient-to-b from-transparent via-purple-950/10 to-transparent border-y border-white/5">
      {/* Header Banner */}
      <div className="max-w-7xl mx-auto px-4 mb-10 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold mb-3">
          <Globe2 className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: "12s" }} />
          <span>REAL-TIME GLOBAL ADVERTISING NETWORK</span>
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
          Global Brands Advertising Around the World
        </h2>
        <p className="mt-2 text-sm sm:text-base text-gray-400 max-w-2xl mx-auto">
          From Fortune 500 giants to high-growth tech innovators, advertisers deploy campaigns across 140+ countries while users monetize real attention.
        </p>
      </div>

      {/* Slider 1: Flowing Left to Right (Brand Partners) */}
      <div className="relative mb-6 group">
        {/* Soft edge fades */}
        <div className="absolute left-0 top-0 bottom-0 w-20 md:w-36 bg-gradient-to-r from-[var(--bg-primary)] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 md:w-36 bg-gradient-to-l from-[var(--bg-primary)] to-transparent z-10 pointer-events-none" />

        {/* Section Label Tag */}
        <div className="max-w-7xl mx-auto px-4 mb-3 flex items-center justify-between text-xs text-gray-400">
          <span className="flex items-center gap-1.5 font-medium">
            <span className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
            Active Advertiser Brands • Flowing Worldwide (Left → Right)
          </span>
          <span className="hidden sm:inline-block text-[11px] text-gray-500">
            Hover card to inspect campaign
          </span>
        </div>

        {/* Flow Container */}
        <div className="flex overflow-hidden select-none">
          <div className="flex gap-4 animate-marquee-right group-hover:[animation-play-state:paused] py-2">
            {[...BRAND_PARTNERS, ...BRAND_PARTNERS].map((brand, idx) => (
              <div
                key={`${brand.name}-${idx}`}
                className="flex items-center gap-3 px-4 py-3 min-w-[280px] sm:min-w-[320px] rounded-xl bg-slate-900/60 dark:bg-slate-900/80 light:bg-white/90 border border-white/10 hover:border-purple-500/50 backdrop-blur-md shadow-lg transition-all duration-300 hover:scale-[1.03] hover:shadow-purple-500/10 cursor-pointer"
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-md ${brand.iconBg}`}
                >
                  {brand.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="text-sm font-bold text-gray-200 dark:text-gray-100 light:text-gray-900 truncate">
                      {brand.name}
                    </h4>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded border ${brand.accentColor} font-medium whitespace-nowrap`}>
                      {brand.badge}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-400 mt-1">
                    <span className="truncate text-[11px]">{brand.category}</span>
                    <span className="flex items-center gap-1 text-emerald-400 font-semibold text-[11px]">
                      <Eye className="w-3 h-3" />
                      {brand.views}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Slider 2: Flowing Right to Left (Live Platform Activity & Payouts) */}
      <div className="relative group">
        {/* Soft edge fades */}
        <div className="absolute left-0 top-0 bottom-0 w-20 md:w-36 bg-gradient-to-r from-[var(--bg-primary)] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 md:w-36 bg-gradient-to-l from-[var(--bg-primary)] to-transparent z-10 pointer-events-none" />

        {/* Section Label Tag */}
        <div className="max-w-7xl mx-auto px-4 mb-3 flex items-center justify-between text-xs text-gray-400">
          <span className="flex items-center gap-1.5 font-medium">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            Live Global Watch & Earn Activity Stream • Flowing (Right ← Left)
          </span>
          <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
            <Zap className="w-3 h-3" /> 100% On-Chain Verified
          </span>
        </div>

        {/* Flow Container */}
        <div className="flex overflow-hidden select-none">
          <div className="flex gap-4 animate-marquee-left group-hover:[animation-play-state:paused] py-2">
            {[...LIVE_ACTIVITIES, ...LIVE_ACTIVITIES].map((item, idx) => (
              <div
                key={`${item.user}-${idx}`}
                className="flex items-center gap-3 px-4 py-2.5 min-w-[270px] sm:min-w-[310px] rounded-xl bg-slate-900/50 dark:bg-slate-900/70 light:bg-white/90 border border-white/10 hover:border-emerald-500/40 backdrop-blur-md shadow-md transition-all duration-300 hover:scale-[1.02]"
              >
                <div className="text-xl select-none" title={item.country}>
                  {item.flag}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs font-mono font-semibold text-purple-400 truncate">
                      @{item.user}
                    </span>
                    <span className="text-[10px] text-gray-500">{item.timeAgo}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2 mt-0.5">
                    <span className="text-[11px] text-gray-300 dark:text-gray-300 light:text-gray-700 truncate">
                      {item.message}
                    </span>
                    {item.amount && (
                      <span className="text-xs font-bold text-emerald-400 font-mono whitespace-nowrap">
                        {item.amount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MarqueeSliders;
