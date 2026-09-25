import React, { useState } from "react";
import { Globe, Menu, X, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface NavHeaderProps {
  theme: "dark" | "light";
  onToggleTheme: () => void;
  onOpenAdSimulator: () => void;
}

export const NavHeader: React.FC<NavHeaderProps> = ({
  onOpenAdSimulator,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { label: "Overview", href: "#hero" },
    { label: "Services", href: "#services" },
    { label: "How It Works", href: "#referral" },
    { label: "FAQ", href: "#faq" },
  ];

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);

    const elem = document.querySelector(href);

    if (elem) {
      elem.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const handleLogin = () => {
    setMobileMenuOpen(false);
    navigate("/signin");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 backdrop-blur-xl bg-slate-950/75 dark:bg-slate-950/80 light:bg-white/85 border-b border-white/10 dark:border-white/10 light:border-black/10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">

        {/* Brand Logo */}
        <button
          onClick={() => handleNavClick("#hero")}
          className="flex items-center gap-2.5 group cursor-pointer"
        >
          <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-500 to-cyan-400 p-[1.5px] shadow-lg shadow-purple-600/30 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Globe
                className="w-5 h-5 text-purple-400 animate-spin"
                style={{ animationDuration: "16s" }}
              />
            </div>
          </div>

          <div>
            <span className="text-lg sm:text-xl font-black tracking-tight text-brand-gradient">
              ADSPROMOHUB
            </span>

            <div className="hidden sm:flex items-center gap-1.5 text-[9px] text-gray-400 tracking-wider uppercase font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span>Global Ad Ecosystem</span>
            </div>
          </div>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden xl:flex items-center gap-6">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => handleNavClick(link.href)}
              className="text-xs font-semibold text-gray-300 dark:text-gray-300 light:text-slate-700 hover:text-purple-400 dark:hover:text-purple-300 transition-colors"
            >
              {link.label}
            </button>
          ))}

          {/* Login Button */}
          <button
            onClick={handleLogin}
            className="relative px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-500 to-purple-600 text-white text-xs font-bold border border-purple-400/40 shadow-lg shadow-purple-600/30 hover:shadow-purple-500/60 hover:scale-105 transition-all duration-300"
          >
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-200 animate-pulse" />
              Login
            </span>
          </button>
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            className="xl:hidden p-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition-all"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-white/10 bg-slate-950/95 dark:bg-slate-950/95 light:bg-white/95 px-6 py-5 backdrop-blur-2xl animate-fadeIn">
          <div className="space-y-3">

            {/* Mobile Navigation Links */}
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.href)}
                className="block w-full text-left py-2 text-sm font-medium text-gray-300 hover:text-purple-400 transition-colors"
              >
                {link.label}
              </button>
            ))}

            {/* Mobile Login */}
            <button
              onClick={handleLogin}
              className="flex items-center justify-between w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600/30 via-indigo-500/20 to-purple-600/30 border border-purple-500/40 text-purple-200 text-sm font-bold shadow-lg shadow-purple-600/10 hover:border-purple-400/70 hover:bg-purple-600/30 transition-all"
            >
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                Login
              </span>

              <span className="text-purple-400">
                →
              </span>
            </button>

            {/* Demo Button */}
            <div className="pt-4 border-t border-white/10 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdSimulator();
                }}
                className="w-full py-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center justify-center gap-2 hover:bg-amber-500/30 hover:border-amber-400/60 transition-all"
              >
                <Zap className="w-4 h-4" />
                Watch Demo Ad
              </button>
            </div>

          </div>
        </div>
      )}
    </header>
  );
};

export default NavHeader;