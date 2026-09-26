import React, { useState } from "react";
import {
  Calculator,
  ArrowRight,
} from "lucide-react";

interface DailyCompoundingProps {
  onGetStarted: () => void;
}

export const DailyCompounding: React.FC<DailyCompoundingProps> = ({ onGetStarted }) => {
  const [adsPerDay, setAdsPerDay] = useState(25);
  const [referrals, setReferrals] = useState(8);
  const [tierMultiplier, setTierMultiplier] = useState(1.25); // Bronze default
  const [tierName, setTierName] = useState("Bronze");
  const [reinvest, setReinvest] = useState(true);

  // Baseline earnings per ad = $0.35
  const baseAdReward = 0.35;
  const personalDaily = adsPerDay * baseAdReward * tierMultiplier;

  // Referral estimate: each referral watches avg 15 ads/day @ 15% commission L1
  const referralDaily = referrals * 15 * baseAdReward * 0.15;
  const totalDaily = personalDaily + referralDaily;

  // Monthly without compounding
  const monthlyFlat = totalDaily * 30;

  // 30-day compounded with daily 1.2% reinvest bonus if toggled
  const monthlyCompounded = reinvest
    ? Array.from({ length: 30 }).reduce((acc: number) => {
        return (acc + totalDaily) * 1.008; // 0.8% daily reinvest boost
      }, 0)
    : monthlyFlat;

  // Yearly projected
  const yearlyProjected = monthlyCompounded * 12;

  const tiers = [
    { name: "Free", mult: 1.0, label: "1.0x Base" },
    { name: "Bronze", mult: 1.25, label: "1.25x Boost" },
    { name: "Gold", mult: 1.6, label: "1.60x Turbo" },
    { name: "Diamond", mult: 2.2, label: "2.20x Ultra" },
  ];

  return (
    <section id="calculator" className="py-20 sm:py-28 relative bg-gradient-to-b from-transparent via-indigo-950/20 to-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-3">
            <Calculator className="w-3.5 h-3.5" />
            <span>INTERACTIVE ROI CALCULATOR</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight">
            Daily Compounding & <span className="text-brand-gradient">Earnings Projection</span>
          </h2>
          <p className="mt-3 text-base text-gray-400">
            Simulate your revenue potential based on your daily attention, network size, and account tier multiplier.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Sliders & Configuration Box (7 cols) */}
          <div className="lg:col-span-7 rounded-3xl p-6 sm:p-8 bg-slate-900/80 dark:bg-slate-900/80 light:bg-white border border-purple-500/20 backdrop-blur-xl shadow-2xl shadow-purple-950/20">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center justify-between">
              <span>Earnings Simulator</span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 font-mono">
                Formula v2.4 Live
              </span>
            </h3>

            {/* Slider 1: Daily Ads */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-semibold text-gray-300">
                  Daily Ads Watched
                </label>
                <span className="text-base font-bold text-purple-400 font-mono">
                  {adsPerDay} Ads / Day
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="60"
                step="5"
                value={adsPerDay}
                onChange={(e) => setAdsPerDay(Number(e.target.value))}
                className="w-full h-2 rounded-lg bg-slate-800 accent-purple-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-500 mt-1">
                <span>5 ads (Casual)</span>
                <span>30 ads (Standard)</span>
                <span>60 ads (Max Daily Cap)</span>
              </div>
            </div>

            {/* Slider 2: Active Referrals */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-semibold text-gray-300">
                  Active Direct Referrals (Level 1)
                </label>
                <span className="text-base font-bold text-emerald-400 font-mono">
                  {referrals} Members
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                step="1"
                value={referrals}
                onChange={(e) => setReferrals(Number(e.target.value))}
                className="w-full h-2 rounded-lg bg-slate-800 accent-emerald-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-500 mt-1">
                <span>Solo (0)</span>
                <span>Squad (10)</span>
                <span>Power Leader (50+)</span>
              </div>
            </div>

            {/* Tier Selector Chips */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Select Account Multiplier Tier
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {tiers.map((t) => (
                  <button
                    key={t.name}
                    type="button"
                    onClick={() => {
                      setTierMultiplier(t.mult);
                      setTierName(t.name);
                    }}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all text-center ${
                      tierName === t.name
                        ? "bg-purple-600 border-purple-400 text-white shadow-lg shadow-purple-600/30 scale-[1.02]"
                        : "bg-slate-950/60 border-white/10 text-gray-400 hover:border-purple-500/40 hover:text-white"
                    }`}
                  >
                    <div>{t.name}</div>
                    <div className="text-[10px] font-normal opacity-80">{t.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Daily Reinvest Toggle */}
            <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/30 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-purple-200">
                  Enable Daily Compounding Reinvest (+0.8% daily boost)
                </span>
                <p className="text-[10px] text-gray-400">
                  Automatically reinvest daily ad revenue to amplify monthly returns.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={reinvest}
                  onChange={(e) => setReinvest(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600" />
              </label>
            </div>
          </div>

          {/* Results Display Panel (5 cols) */}
          <div className="lg:col-span-5 rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-purple-900/60 via-slate-900/90 to-slate-950 border border-purple-500/40 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-44 h-44 rounded-full bg-purple-600/20 blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between mb-6">
              <span className="text-xs font-bold tracking-widest text-purple-300 uppercase">
                ESTIMATED PROJECTION
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-mono font-bold">
                {tierMultiplier}x Speed
              </span>
            </div>

            {/* Daily Revenue Pill */}
            <div className="mb-6 p-4 rounded-2xl bg-black/40 border border-white/10">
              <div className="text-xs text-gray-400">Daily Revenue (Personal + Team)</div>
              <div className="text-3xl sm:text-4xl font-black font-mono text-emerald-400 mt-1">
                ${totalDaily.toFixed(2)}{" "}
                <span className="text-xs font-semibold text-gray-400">/ day</span>
              </div>
              <div className="mt-2 text-[11px] text-gray-400 flex items-center justify-between">
                <span>Personal: ${personalDaily.toFixed(2)}</span>
                <span>Team: ${referralDaily.toFixed(2)}</span>
              </div>
            </div>

            {/* Monthly & Yearly Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 rounded-2xl bg-black/40 border border-white/10">
                <div className="text-xs text-gray-400">30-Day Total</div>
                <div className="text-xl sm:text-2xl font-black font-mono text-white mt-1">
                  ${monthlyCompounded.toFixed(2)}
                </div>
                <div className="text-[10px] text-purple-300 mt-0.5">
                  {reinvest ? "Compounded" : "Standard"}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-black/40 border border-white/10">
                <div className="text-xs text-gray-400">12-Month Est.</div>
                <div className="text-xl sm:text-2xl font-black font-mono text-amber-300 mt-1">
                  ${yearlyProjected.toFixed(2)}
                </div>
                <div className="text-[10px] text-amber-400/80 mt-0.5">
                  Annualized Run-rate
                </div>
              </div>
            </div>

            <button
              onClick={onGetStarted}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-purple-600/40 transition-all flex items-center justify-center gap-2"
            >
              <span>Lock In This Earning Potential</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <p className="text-[10px] text-gray-400 text-center mt-3">
              *Projections are educational simulations based on consistent daily activity and active referral participation.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DailyCompounding;
