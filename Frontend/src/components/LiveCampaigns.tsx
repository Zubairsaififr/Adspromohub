import React, { useState } from "react";
import { Play, Eye, Clock, DollarSign, Sparkles } from "lucide-react";
import type { AdCampaign } from "../types";

interface LiveCampaignsProps {
  onWatchCampaign: (campaign: AdCampaign) => void;
}

const CAMPAIGNS: AdCampaign[] = [
  {
    id: "camp-1",
    brand: "Binance Web3",
    brandLogo: "B",
    title: "Next-Gen Decentralized Finance & Staking",
    description:
      "Discover seamless multi-chain swapping and yield opportunities with zero custody risk.",
    reward: 0.65,
    duration: 5,
    category: "Crypto",
    impressionsLeft: 14200,
    videoThumb:
      "https://images.unsplash.com/photo-1622979135225-d2ba269bc1df?w=600&auto=format&fit=crop&q=80",
    sponsorUrl: "https://binance.com",
  },
  {
    id: "camp-2",
    brand: "Nike Air Pulse",
    brandLogo: "N",
    title: "Engineered for 24/7 Energy & Urban Run",
    description:
      "The most cushioned lifestyle runner built from recycled space-age composites.",
    reward: 0.5,
    duration: 5,
    category: "Lifestyle",
    impressionsLeft: 8400,
    videoThumb:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80",
    sponsorUrl: "https://nike.com",
  },
  {
    id: "camp-3",
    brand: "Tesla Cybercab",
    brandLogo: "T",
    title: "Full Autonomous Mobility Network Debut",
    description:
      "Experience the design philosophy behind driverless electric transit.",
    reward: 0.85,
    duration: 5,
    category: "Tech",
    impressionsLeft: 5900,
    videoThumb:
      "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=600&auto=format&fit=crop&q=80",
    sponsorUrl: "https://tesla.com",
  },
  {
    id: "camp-4",
    brand: "Cyberpunk 2077 VR",
    brandLogo: "C",
    title: "Night City Immersion in Virtual Reality",
    description:
      "Explore the neon-drenched futuristic metropolis in 120 FPS high dynamic range.",
    reward: 0.45,
    duration: 5,
    category: "Gaming",
    impressionsLeft: 11200,
    videoThumb:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80",
    sponsorUrl: "https://cyberpunk.net",
  },
  {
    id: "camp-5",
    brand: "Shopify Global",
    brandLogo: "S",
    title: "Launch an AI-Powered Store in 15 Minutes",
    description:
      "Automated dropshipping, instant payment gateways, and global logistics built in.",
    reward: 0.55,
    duration: 5,
    category: "Finance",
    impressionsLeft: 7100,
    videoThumb:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80",
    sponsorUrl: "https://shopify.com",
  },
  {
    id: "camp-6",
    brand: "Sony PlayStation 5 Pro",
    brandLogo: "P",
    title: "Spectral Super Resolution & 8K Gaming",
    description:
      "Push hardware limits with ray-tracing acceleration and ultra-fast SSD streaming.",
    reward: 0.6,
    duration: 5,
    category: "Gaming",
    impressionsLeft: 9600,
    videoThumb:
      "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600&auto=format&fit=crop&q=80",
    sponsorUrl: "https://playstation.com",
  },
];

export const LiveCampaigns: React.FC<LiveCampaignsProps> = ({
  onWatchCampaign,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = [
    "All",
    "Tech",
    "Crypto",
    "Gaming",
    "Lifestyle",
    "Finance",
  ];

  const filteredCampaigns =
    selectedCategory === "All"
      ? CAMPAIGNS
      : CAMPAIGNS.filter((c) => c.category === selectedCategory);

  return (
    <section
      id="live-ads"
      className="py-20 sm:py-28 relative overflow-hidden"
    >
      {/* Ambient Rose Gold Glow */}
      <div className="absolute top-10 left-[-120px] w-[320px] h-[320px] rounded-full bg-[#B76E79]/10 blur-[120px] pointer-events-none" />

      <div className="absolute bottom-0 right-[-100px] w-[300px] h-[300px] rounded-full bg-[#D99AA3]/8 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B76E79]/10 border border-[#D99AA3]/30 text-[#E3AAB2] text-xs font-semibold mb-3 shadow-[0_0_20px_rgba(183,110,121,0.08)]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>SPONSORED AD MARKETPLACE</span>
            </div>

            {/* Heading */}
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Live Verified{" "}
              <span className="text-brand-gradient">
                Brand Campaigns
              </span>
            </h2>

            {/* Description */}
            <p className="text-sm text-[#D99AA3]/70 mt-2 max-w-xl">
              Advertisers deposit collateral into smart contracts before
              broadcast. Watch verified videos to claim immediate dollar
              rewards.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all duration-200 ${
                  selectedCategory === cat
                    ? "bg-[#B76E79] border-[#D99AA3] text-white shadow-md shadow-[#B76E79]/30"
                    : "bg-[#120B0D]/60 border-white/10 text-gray-400 hover:text-[#E3AAB2] hover:border-[#B76E79]/40 hover:bg-[#B76E79]/5"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Campaign Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCampaigns.map((camp) => (
            <div
              key={camp.id}
              className="rounded-2xl overflow-hidden bg-[#120B0D]/70 dark:bg-[#120B0D]/70 light:bg-white border border-[#B76E79]/20 hover:border-[#D99AA3]/50 backdrop-blur-xl shadow-xl shadow-black/10 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_15px_45px_rgba(183,110,121,0.12)] flex flex-col justify-between group"
            >
              <div>
                {/* Thumbnail Header */}
                <div className="relative aspect-video w-full overflow-hidden bg-[#0D080A]">
                  <img
                    src={camp.videoThumb}
                    alt={camp.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                  />

                  {/* Thumbnail Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#120B0D] via-transparent to-transparent" />

                  {/* Category & Duration Badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-white text-[10px] font-semibold border border-white/10">
                      {camp.category}
                    </span>

                    <span className="px-2 py-0.5 rounded-md bg-[#8F4F5A]/80 backdrop-blur-md text-[#FFE5E8] text-[10px] font-mono flex items-center gap-1 border border-[#D99AA3]/20">
                      <Clock className="w-3.5 h-3.5" />
                      {camp.duration}s
                    </span>
                  </div>

                  {/* Reward Badge */}
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-xl bg-[#E3AAB2]/95 text-[#120B0D] font-black font-mono text-xs shadow-lg shadow-[#D99AA3]/20 flex items-center gap-1">
                    <DollarSign className="w-3 h-3" />
                    +{camp.reward.toFixed(2)} USD
                  </div>

                  {/* Center Play Button */}
                  <button
                    onClick={() => onWatchCampaign(camp)}
                    className="absolute inset-0 flex items-center justify-center bg-[#120B0D]/40 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <div className="w-12 h-12 rounded-full bg-[#B76E79]/95 text-white flex items-center justify-center shadow-xl shadow-[#B76E79]/30 transform scale-90 group-hover:scale-100 transition-transform">
                      <Play className="w-5 h-5 fill-white ml-0.5" />
                    </div>
                  </button>
                </div>

                {/* Content */}
                <div className="p-5">
                  {/* Brand */}
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-5 h-5 rounded-md bg-[#B76E79]/20 text-[#E3AAB2] font-bold text-[10px] flex items-center justify-center border border-[#D99AA3]/20">
                      {camp.brandLogo}
                    </div>

                    <span className="text-xs font-bold text-gray-300">
                      {camp.brand}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-sm font-bold text-white mb-1 line-clamp-1 group-hover:text-[#E3AAB2] transition-colors">
                    {camp.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                    {camp.description}
                  </p>
                </div>
              </div>

              {/* Bottom Action Footer */}
              <div className="px-5 pb-5 pt-2 border-t border-[#B76E79]/10 flex items-center justify-between">
                <span className="text-[11px] text-gray-500 flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  {camp.impressionsLeft.toLocaleString()} left
                </span>

                <button
                  onClick={() => onWatchCampaign(camp)}
                  className="px-4 py-2 rounded-xl bg-[#8F4F5A]/90 hover:bg-[#B76E79] text-white font-bold text-xs shadow-md shadow-[#B76E79]/20 transition-all flex items-center gap-1.5"
                >
                  <Play className="w-3 h-3 fill-white" />
                  <span>Watch & Earn</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Ambient Glow */}
      <div className="absolute bottom-[-180px] left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-[#B76E79]/8 blur-[130px] pointer-events-none" />
    </section>
  );
};

export default LiveCampaigns;