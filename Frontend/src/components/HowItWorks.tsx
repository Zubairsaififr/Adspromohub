import React from "react";
import { Eye, DollarSign, Users, Award, ArrowRight } from "lucide-react";

export const HowItWorks: React.FC<{ onOpenAdDemo: () => void }> = ({ onOpenAdDemo }) => {
  const steps = [
    {
      step: "01",
      icon: Eye,
      title: "Watch Sponsored Ads",
      description:
        "Select from hundreds of global brand campaigns. Watch 5-30 second high-definition advertisements with verified proof of attention.",
      badge: "Zero Investment Needed",
      accent: "from-blue-500/20 to-cyan-500/20 text-blue-400 border-blue-500/30",
    },
    {
      step: "02",
      icon: DollarSign,
      title: "Earn Instant Rewards",
      description:
        "Every completed view instantly credits real USD/USDT to your personal wallet. No hidden thresholds or complicated point ratios.",
      badge: "Instant Credit",
      accent: "from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30",
    },
    {
      step: "03",
      icon: Users,
      title: "Build Referral Network",
      description:
        "Share your unique referral link. Earn 15% on Level 1, 8% on Level 2, and down to 5 affiliate tiers whenever your team watches ads.",
      badge: "Passive Recurring Income",
      accent: "from-purple-500/20 to-indigo-500/20 text-purple-400 border-purple-500/30",
    },
    {
      step: "04",
      icon: Award,
      title: "Rank Up & Cash Out",
      description:
        "Climb the ADSPROMOHUB rank ladder from Silver to Crown Ambassador. Unlock daily compounding multipliers and instant cryptocurrency withdrawals.",
      badge: "Global Fast Payouts",
      accent: "from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30",
    },
  ];

  return (
    <section id="how-it-works" className="py-20 sm:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-semibold mb-3">
            <span>HOW ADSPROMOHUB WORKS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight">
            Turn Real Attention Into <span className="text-brand-gradient">Daily Earnings</span>
          </h2>
          <p className="mt-3 text-base text-gray-400">
            A transparent 4-step workflow connecting multinational advertisers with a worldwide community of engaged viewers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="relative rounded-2xl p-6 bg-slate-900/60 dark:bg-slate-900/60 light:bg-white/80 border border-white/10 hover:border-purple-500/50 backdrop-blur-xl shadow-xl transition-all duration-300 hover:-translate-y-2 group"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl font-black font-mono text-white/20 group-hover:text-purple-400/40 transition-colors">
                    {item.step}
                  </span>
                  <div className={`p-3 rounded-xl border bg-gradient-to-br ${item.accent}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-semibold bg-white/5 text-gray-300 mb-2">
                  {item.badge}
                </span>

                <h3 className="text-lg font-bold text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-xs leading-relaxed text-gray-400">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Quick CTA Banner */}
        <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-950/60 via-indigo-950/60 to-slate-950/80 border border-purple-500/30 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold text-white">
              Want to see it in action right now?
            </h3>
            <p className="text-sm text-gray-400 mt-1">
              Watch a 5-second simulated brand ad and get your first test reward credited instantly.
            </p>
          </div>
          <button
            onClick={onOpenAdDemo}
            className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-lg shadow-purple-600/30 transition-all flex items-center gap-2 whitespace-nowrap"
          >
            <span>Launch Ad Simulator</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
