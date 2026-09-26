import React, { useState, useEffect } from "react";
import {
  X,
  CheckCircle,
  Sparkles,
  DollarSign,
  Volume2,
  VolumeX,
} from "lucide-react";

interface AdSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdCompleted: (rewardAmount: number) => void;
  currentBalance: number;
}

const SAMPLE_ADS = [
  {
    brand: "Binance Web3 Wallet",
    headline: "Swap, Stake & Earn in Decentralized Finance",
    sponsor: "Binance Official",
    reward: 0.50,
    duration: 5,
    tag: "Crypto & Finance",
    videoBg: "from-amber-900/60 via-slate-900 to-black",
    accent: "text-amber-400 border-amber-500/40 bg-amber-500/10",
    image: "https://images.unsplash.com/photo-1622979135225-d2ba269bc1df?w=800&auto=format&fit=crop&q=80",
  },
  {
    brand: "Nike Air Max Pulse",
    headline: "Unreal Comfort. Re-engineered for the Next Generation.",
    sponsor: "Nike Athletics",
    reward: 0.45,
    duration: 5,
    tag: "Fashion & Lifestyle",
    videoBg: "from-orange-900/60 via-slate-900 to-black",
    accent: "text-orange-400 border-orange-500/40 bg-orange-500/10",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80",
  },
  {
    brand: "Tesla Cybercab & Solar",
    headline: "Autonomous Electric Future. Power Your World.",
    sponsor: "Tesla Motors",
    reward: 0.60,
    duration: 5,
    tag: "Automotive Tech",
    videoBg: "from-red-900/60 via-slate-900 to-black",
    accent: "text-red-400 border-red-500/40 bg-red-500/10",
    image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&auto=format&fit=crop&q=80",
  },
];

export const AdSimulatorModal: React.FC<AdSimulatorModalProps> = ({
  isOpen,
  onClose,
  onAdCompleted,
  currentBalance,
}) => {
  const [adIndex, setAdIndex] = useState(0);
  const [secondsRemaining, setSecondsRemaining] = useState(5);
  const [isCompleted, setIsCompleted] = useState(false);
  const [hasClaimed, setHasClaimed] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const currentAd = SAMPLE_ADS[adIndex];

  // Reset and start countdown when modal opens or ad changes
  useEffect(() => {
    if (!isOpen) {
      setSecondsRemaining(5);
      setIsCompleted(false);
      setHasClaimed(false);
      return;
    }

    setSecondsRemaining(5);
    setIsCompleted(false);
    setHasClaimed(false);

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsCompleted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, adIndex]);

  if (!isOpen) return null;

  const handleClaim = () => {
    if (hasClaimed) return;
    setHasClaimed(true);
    onAdCompleted(currentAd.reward);
  };

  const handleNextAd = () => {
    setAdIndex((prev) => (prev + 1) % SAMPLE_ADS.length);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl rounded-2xl overflow-hidden bg-slate-950 border border-purple-500/30 shadow-2xl shadow-purple-950/50 flex flex-col">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-slate-900/90 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold text-gray-300">
              Live Sponsored Advertisement
            </span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full border ${currentAd.accent}`}>
              {currentAd.tag}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="text-gray-400 hover:text-white transition-colors p-1"
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Ad Video / Graphic Mockup Viewport */}
        <div className="relative aspect-video w-full overflow-hidden bg-black flex items-center justify-center">
          <img
            src={currentAd.image}
            alt={currentAd.brand}
            className="w-full h-full object-cover opacity-80 transition-transform duration-1000 scale-105"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

          {/* Attention Verification Timer Overlay */}
          <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-white/20 text-white font-mono text-xs shadow-lg">
            {!isCompleted ? (
              <>
                <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping" />
                <span>Ad Playing: {secondsRemaining}s</span>
              </>
            ) : (
              <>
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-semibold">Reward Ready!</span>
              </>
            )}
          </div>

          {/* Bottom Ad Copy on Screen */}
          <div className="absolute bottom-4 left-6 right-6">
            <span className="text-[11px] font-bold tracking-widest text-purple-400 uppercase">
              {currentAd.sponsor}
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white mt-0.5">
              {currentAd.headline}
            </h3>
            <p className="text-xs text-gray-300 mt-1 flex items-center gap-2">
              <span>Verified Campaign</span>
              <span>•</span>
              <span className="text-emerald-400 font-semibold">
                Earn +${currentAd.reward.toFixed(2)} USD
              </span>
            </p>
          </div>

          {/* Progress bar along bottom of player */}
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/20">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-1000 ease-linear"
              style={{
                width: `${((5 - secondsRemaining) / 5) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Footer Controls & Claim Area */}
        <div className="p-6 bg-slate-900/90 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-gray-400">Simulated Wallet Balance</div>
              <div className="text-lg font-bold font-mono text-white">
                ${currentBalance.toFixed(2)} USD
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            {!isCompleted ? (
              <button
                disabled
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gray-800 text-gray-400 text-sm font-semibold cursor-not-allowed flex items-center justify-center gap-2"
              >
                <span>Watch {secondsRemaining}s to Claim</span>
              </button>
            ) : !hasClaimed ? (
              <button
                onClick={handleClaim}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-sm font-bold shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2 transform hover:scale-105 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>Claim +${currentAd.reward.toFixed(2)} USD</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" /> Credited to Wallet!
                </span>
                <button
                  onClick={handleNextAd}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-colors"
                >
                  Watch Next Ad →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdSimulatorModal;
