import React, { useState, useEffect } from "react";
import { Radio, Megaphone, Sparkles, TrendingUp, MonitorPlay, MessageCircle, Users, Video, Gamepad2, Palette } from "lucide-react";

interface BrandGlobeProps {
  className?: string;
  size?: number; // base diameter in px, default 280
}

interface OrbitingBrand {
  name: string;
  category: string;
  color: string;
  textColor: string;
  borderColor: string;
  iconBg: string;
  logoLetter: string;
  metric: string;
}

const ORBITING_BRANDS: OrbitingBrand[] = [
  {
    name: "Google Ads",
    category: "Search & Display",
    color: "from-blue-500/30 to-blue-600/10",
    textColor: "text-blue-400",
    borderColor: "border-blue-500/40",
    iconBg: "bg-blue-500",
    logoLetter: "G",
    metric: "98.4% ROI",
  },
  {
    name: "Nike Promo",
    category: "Sports & Apparel",
    color: "from-amber-500/30 to-orange-600/10",
    textColor: "text-amber-400",
    borderColor: "border-amber-500/40",
    iconBg: "bg-orange-500",
    logoLetter: "N",
    metric: "3.2M Reach",
  },
  {
    name: "Binance Ads",
    category: "Web3 & Crypto",
    color: "from-yellow-500/30 to-amber-600/10",
    textColor: "text-yellow-400",
    borderColor: "border-yellow-500/40",
    iconBg: "bg-yellow-500",
    logoLetter: "B",
    metric: "Instant USDT",
  },
  {
    name: "Spotify Ads",
    category: "Audio Streaming",
    color: "from-emerald-500/30 to-teal-600/10",
    textColor: "text-emerald-400",
    borderColor: "border-emerald-500/40",
    iconBg: "bg-emerald-500",
    logoLetter: "S",
    metric: "Daily Rewards",
  },
  {
    name: "Apple Store",
    category: "Tech Ecosystem",
    color: "from-purple-500/30 to-indigo-600/10",
    textColor: "text-purple-400",
    borderColor: "border-purple-500/40",
    iconBg: "bg-purple-500",
    logoLetter: "A",
    metric: "Top Tier",
  },
  {
    name: "Netflix Media",
    category: "Entertainment",
    color: "from-rose-500/30 to-red-600/10",
    textColor: "text-rose-400",
    borderColor: "border-rose-500/40",
    iconBg: "bg-rose-500",
    logoLetter: "N",
    metric: "Global Views",
  },
];

const GLOBAL_BEACONS = [
  { city: "New York", top: "35%", left: "28%", impressions: "1.4M", delay: "0s" },
  { city: "London", top: "28%", left: "48%", impressions: "920K", delay: "0.6s" },
  { city: "Tokyo", top: "36%", left: "78%", impressions: "2.1M", delay: "1.2s" },
  { city: "Dubai", top: "45%", left: "58%", impressions: "840K", delay: "0.3s" },
  { city: "Singapore", top: "54%", left: "72%", impressions: "1.1M", delay: "1.5s" },
  { city: "São Paulo", top: "68%", left: "34%", impressions: "680K", delay: "0.9s" },
];

export const BrandGlobe: React.FC<BrandGlobeProps> = ({ className, size = 280 }) => {
  const [activeBrandIndex, setActiveBrandIndex] = useState<number>(0);
  const [isHovered, setIsHovered] = useState(false);

  // Rotate active featured brand every 3.8 seconds
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setActiveBrandIndex((prev) => (prev + 1) % ORBITING_BRANDS.length);
    }, 3800);
    return () => clearInterval(interval);
  }, [isHovered]);

  const activeBrand = ORBITING_BRANDS[activeBrandIndex];

  return (
    <div
      className={`relative flex items-center justify-center select-none ${className || ""}`}
      style={{ width: size * 1.8, height: size * 1.8 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Outer Cosmic Atmosphere Ring */}
      <div
        className="absolute rounded-full pointer-events-none atmosphere-glow"
        style={{
          width: size * 1.45,
          height: size * 1.45,
          background: "radial-gradient(circle, rgba(115, 95, 212, 0.22) 0%, rgba(96, 165, 250, 0.12) 40%, transparent 70%)",
          filter: "blur(20px)",
        }}
      />

      {/* Tilted Orbit Ring 1 (Advertising Satellites) */}
      <div
        className="absolute pointer-events-none rounded-full border border-dashed border-indigo-400/25 orbit-a"
        style={{
          width: size * 1.55,
          height: size * 1.55,
          borderRadius: "50%",
        }}
      >
        {/* Orbital Satellite Node 1 */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/90 border border-purple-500/60 shadow-lg shadow-purple-500/20 backdrop-blur-md">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
          <Megaphone className="w-3 h-3 text-purple-400" />
          <span className="text-[10px] font-bold text-purple-200 tracking-wider">AD BEACON</span>
        </div>

        {/* Brand Logos orbiting on Ring 1 */}
        <div className="absolute top-1/4 -left-4 p-1.5 rounded-full bg-slate-900/90 border border-slate-700 text-white shadow-lg [transform:rotateX(-72deg)_rotateY(-15deg)]">
          <MonitorPlay size={16} />
        </div>
        <div className="absolute bottom-1/4 -right-4 p-1.5 rounded-full bg-slate-900/90 border border-[#1DA1F2]/30 text-[#1DA1F2] shadow-lg [transform:rotateX(-72deg)_rotateY(-15deg)]">
          <MessageCircle size={16} />
        </div>
        <div className="absolute top-3/4 -left-2 p-1.5 rounded-full bg-slate-900/90 border border-[#FF0000]/30 text-[#FF0000] shadow-lg [transform:rotateX(-72deg)_rotateY(-15deg)]">
          <Video size={16} />
        </div>

        {/* Orbital Satellite Node 2 */}
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-900/90 border border-blue-500/50 shadow-md">
          <Radio className="w-2.5 h-2.5 text-blue-400 animate-pulse" />
          <span className="text-[9px] font-semibold text-blue-200">GLOBAL ADS FEED</span>
        </div>
      </div>

      {/* Tilted Orbit Ring 2 (Secondary Ring) */}
      <div
        className="absolute pointer-events-none rounded-full border border-purple-400/20 orbit-b"
        style={{
          width: size * 1.35,
          height: size * 1.35,
          borderRadius: "50%",
        }}
      >
        <div className="absolute top-1/2 -right-3 -translate-y-1/2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-900/80 border border-amber-400/40">
          <Sparkles className="w-2.5 h-2.5 text-amber-400" />
          <span className="text-[9px] font-medium text-amber-200">PROMO HUB</span>
        </div>

        {/* Brand Logos orbiting on Ring 2 */}
        <div className="absolute top-1/3 -left-3 p-1.5 rounded-full bg-slate-900/90 border border-[#1877F2]/30 text-[#1877F2] shadow-lg [transform:rotateX(-65deg)_rotateY(30deg)]">
          <Users size={14} />
        </div>
        <div className="absolute bottom-1/4 left-1/4 p-1.5 rounded-full bg-slate-900/90 border border-[#9146FF]/30 text-[#9146FF] shadow-lg [transform:rotateX(-65deg)_rotateY(30deg)]">
          <Gamepad2 size={14} />
        </div>
        <div className="absolute top-0 right-1/4 p-1.5 rounded-full bg-slate-900/90 border border-[#ea4c89]/30 text-[#ea4c89] shadow-lg [transform:rotateX(-65deg)_rotateY(30deg)]">
          <Palette size={14} />
        </div>
      </div>

      {/* The 3D Rotating Earth Sphere */}
      <div
        className="relative overflow-hidden rounded-full cursor-pointer earth-sphere transition-all duration-500"
        style={{
          width: size,
          height: size,
          backgroundImage:
            "url('https://cdn.21st.dev/assets/mirror/f2/f2fe23d0c6a8406962e4c5ef969e13dc9de3faf37d3e7258a1067173325b254f.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "left",
          boxShadow: `
            0 0 45px rgba(115, 95, 212, 0.45),
            0 0 90px rgba(96, 165, 250, 0.25),
            -8px 0 16px #c3f4ff inset,
            24px 3px 38px #000 inset,
            -35px -3px 48px rgba(195, 244, 255, 0.6) inset,
            ${size * 0.95}px 0 60px rgba(0, 0, 0, 0.6) inset,
            ${size * 0.58}px 0 45px rgba(0, 0, 0, 0.8) inset
          `,
        }}
      >
        {/* Semi-transparent Atmosphere Layer */}
        <div className="absolute inset-0 rounded-full pointer-events-none bg-gradient-to-tr from-indigo-950/40 via-transparent to-cyan-400/20" />

        {/* Global Live Ad Broadcast Hotspot Beacons */}
        {GLOBAL_BEACONS.map((beacon) => (
          <div
            key={beacon.city}
            className="absolute group pointer-events-auto cursor-help"
            style={{ top: beacon.top, left: beacon.left }}
          >
            {/* Pulsing Radar Ring */}
            <div
              className="absolute -top-1.5 -left-1.5 h-4 w-4 rounded-full bg-cyan-400/40 beacon-pulse"
              style={{ animationDelay: beacon.delay }}
            />
            {/* Center Pin */}
            <div className="relative h-2 w-2 rounded-full bg-white shadow-[0_0_8px_#38bdf8] transition-transform duration-200 group-hover:scale-150" />

            {/* Hover City Tooltip */}
            <div className="absolute left-3 -top-3 hidden group-hover:flex items-center gap-1.5 px-2 py-0.5 rounded bg-black/90 text-white text-[10px] border border-cyan-400/50 shadow-xl whitespace-nowrap z-30">
              <span className="font-semibold text-cyan-300">{beacon.city}:</span>
              <span className="text-gray-300">{beacon.impressions} Ads Live</span>
            </div>
          </div>
        ))}

        {/* Brand Watermark Glow on Globe */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-25">
          <div className="text-center">
            <span className="text-[11px] font-black tracking-widest text-white/70 uppercase">
              ADSPROMOHUB
            </span>
          </div>
        </div>
      </div>

      {/* Floating Interactive Brand Broadcast Card */}
      <div
        className="absolute -bottom-6 sm:-bottom-8 z-30 flex items-center gap-3 px-3.5 py-2 rounded-xl backdrop-blur-xl border shadow-2xl transition-all duration-500 hover:scale-105"
        style={{
          background: "linear-gradient(135deg, rgba(15, 23, 42, 0.88), rgba(30, 41, 59, 0.88))",
          borderColor: "rgba(167, 139, 250, 0.35)",
        }}
      >
        <div className={`flex items-center justify-center w-7 h-7 rounded-lg text-white font-black text-xs shadow-md ${activeBrand.iconBg}`}>
          {activeBrand.logoLetter}
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-white">{activeBrand.name}</span>
            <span className="px-1.5 py-0.2 text-[9px] rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
              Active Ad
            </span>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-gray-300">
            <span>{activeBrand.category}</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-0.5">
              <TrendingUp className="w-2.5 h-2.5" />
              {activeBrand.metric}
            </span>
          </div>
        </div>
        <div className="pl-1 border-l border-white/10 flex flex-col items-center">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[8px] text-gray-400 font-mono mt-0.5">LIVE</span>
        </div>
      </div>

      {/* Space Twinkling Stars */}
      <div className="absolute -left-6 top-8 h-1.5 w-1.5 rounded-full bg-white animate-twinkle shadow-[0_0_6px_#fff]" />
      <div className="absolute -left-12 bottom-16 h-1 w-1 rounded-full bg-cyan-300 animate-twinkle shadow-[0_0_5px_#38bdf8]" style={{ animationDelay: "1.2s" }} />
      <div className="absolute -right-8 top-12 h-1.5 w-1.5 rounded-full bg-purple-300 animate-twinkle shadow-[0_0_6px_#c084fc]" style={{ animationDelay: "0.8s" }} />
      <div className="absolute -right-14 bottom-20 h-1 w-1 rounded-full bg-white animate-twinkle shadow-[0_0_4px_#fff]" style={{ animationDelay: "2s" }} />
      <div className="absolute left-1/4 -top-8 h-1 w-1 rounded-full bg-blue-300 animate-twinkle shadow-[0_0_4px_#60a5fa]" style={{ animationDelay: "1.5s" }} />
    </div>
  );
};

export default BrandGlobe;
