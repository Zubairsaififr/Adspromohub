
import {
  Share2,
  
} from "lucide-react";

export const Referral: React.FC = () => {

  



  return (
    <section id="referral" className="py-20 sm:py-28 relative bg-slate-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold mb-3">
            <Share2 className="w-3.5 h-3.5" />
            <span>UNLIMITED NETWORK EXPANSION</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight">
            Referral Network & <span className="text-brand-gradient">Rank Rewards</span>
          </h2>
          <p className="mt-3 text-base text-gray-400">
            Build your attention syndicate. Earn recurring commissions whenever your team watches ads around the world.
          </p>
        </div>

      

       
      </div>
    </section>
  );
};

export default Referral;
