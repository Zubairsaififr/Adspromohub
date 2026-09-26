import React, { useState } from "react";
<<<<<<< HEAD
import { Menu, X, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/Logo.png";
=======
import { Globe, Menu, X, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

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
<<<<<<< HEAD
    <header
      className="
        fixed top-0 left-0 right-0 z-40
        backdrop-blur-md
        
        dark:bg-transparent
        border-b border-[#B76E79]/15
        shadow-[0_8px_30px_rgba(183,110,121,0.05)]
        transition-all duration-300
      "
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">

        {/* =====================================================
            BRAND LOGO
        ====================================================== */}
        <button
          type="button"
          onClick={() => handleNavClick("#hero")}
          className="flex items-center gap-2.5 group cursor-pointer"
        >
          {/* Transparent Logo Container */}
          <div
            className="
              relative
              w-9 h-9
              rounded-xl
              bg-transparent
              p-0
              shadow-none
              group-hover:scale-105
              transition-transform duration-300
            "
          >
            <div
              className="
                w-full h-full
                bg-transparent
                rounded-[10px]
                flex items-center justify-center
                overflow-hidden
              "
            >
              <img
                src={logo}
                alt="adspromohub"
                className="
                  w-full
                  h-full
                  object-contain
                "
=======
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
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
              />
            </div>
          </div>

<<<<<<< HEAD
          {/* =====================================================
              BRAND NAME - ROSE GOLD
          ====================================================== */}
          <div>
            <span
              className="
                text-lg sm:text-xl
                font-black
                tracking-tight

                bg-gradient-to-r
                from-[#8F4F5A]
                via-[#B76E79]
                to-[#D99AA3]

                bg-clip-text
                text-transparent

                drop-shadow-[0_2px_8px_rgba(183,110,121,0.18)]

                group-hover:from-[#B76E79]
                group-hover:via-[#D99AA3]
                group-hover:to-[#8F4F5A]

                transition-all duration-500
              "
            >
              ADSPROMOHUB
            </span>

            <div
              className="
                hidden sm:flex
                items-center
                gap-1.5
                text-[9px]
                text-slate-500
                dark:text-gray-400
                tracking-wider
                uppercase
                font-medium
              "
            >
              <span
                className="
                  h-1.5
                  w-1.5
                  rounded-full
                  bg-[#B76E79]
                  animate-ping
                "
              />

=======
          <div>
            <span className="text-lg sm:text-xl font-black tracking-tight text-brand-gradient">
              ADSPROMOHUB
            </span>

            <div className="hidden sm:flex items-center gap-1.5 text-[9px] text-gray-400 tracking-wider uppercase font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
              <span>Global Ad Ecosystem</span>
            </div>
          </div>
        </button>

<<<<<<< HEAD
        {/* =====================================================
            DESKTOP NAVIGATION
        ====================================================== */}
        <nav className="hidden xl:flex items-center gap-6">
          {navLinks.map((link) => (
            <button
              type="button"
              key={link.label}
              onClick={() => handleNavClick(link.href)}
              className="
                text-xs
                font-semibold
                text-slate-600
                dark:text-gray-300
                hover:text-[#B76E79]
                dark:hover:text-[#D99AA3]
                transition-colors duration-300
              "
=======
        {/* Desktop Navigation */}
        <nav className="hidden xl:flex items-center gap-6">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => handleNavClick(link.href)}
              className="text-xs font-semibold text-gray-300 dark:text-gray-300 light:text-slate-700 hover:text-purple-400 dark:hover:text-purple-300 transition-colors"
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
            >
              {link.label}
            </button>
          ))}

          {/* Login Button */}
          <button
<<<<<<< HEAD
            type="button"
            onClick={handleLogin}
            className="
              relative
              px-5
              py-2.5
              rounded-xl

              bg-gradient-to-r
              from-[#8F4F5A]
              via-[#B76E79]
              to-[#C9828C]

              text-white
              text-xs
              font-bold

              border
              border-[#E3AAB2]/50

              shadow-lg
              shadow-[#B76E79]/25

              hover:shadow-[#B76E79]/40
              hover:scale-105

              transition-all duration-300
            "
          >
            <span className="flex items-center gap-1.5">
              <span
                className="
                  w-1.5
                  h-1.5
                  rounded-full
                  bg-[#FFE5E8]
                  animate-pulse
                "
              />

=======
            onClick={handleLogin}
            className="relative px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-500 to-purple-600 text-white text-xs font-bold border border-purple-400/40 shadow-lg shadow-purple-600/30 hover:shadow-purple-500/60 hover:scale-105 transition-all duration-300"
          >
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-200 animate-pulse" />
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
              Login
            </span>
          </button>
        </nav>

<<<<<<< HEAD
        {/* =====================================================
            MOBILE MENU BUTTON
        ====================================================== */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={
              mobileMenuOpen
                ? "Close menu"
                : "Open menu"
            }
            className="
              xl:hidden
              p-2
              rounded-xl
              text-slate-600
              dark:text-gray-300
              hover:text-[#B76E79]
              hover:bg-[#B76E79]/10
              transition-all duration-300
            "
=======
        {/* Mobile Menu Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            className="xl:hidden p-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition-all"
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

<<<<<<< HEAD
      {/* =====================================================
          MOBILE DRAWER
      ====================================================== */}
      {mobileMenuOpen && (
        <div
          className="
            xl:hidden

            border-t
            border-[#B76E79]/15

            bg-white/20
            dark:bg-slate-950/20

            px-6
            py-5

            backdrop-blur-xl

            shadow-[0_20px_40px_rgba(183,110,121,0.10)]

            animate-fadeIn
          "
        >
=======
      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-white/10 bg-slate-950/95 dark:bg-slate-950/95 light:bg-white/95 px-6 py-5 backdrop-blur-2xl animate-fadeIn">
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
          <div className="space-y-3">

            {/* Mobile Navigation Links */}
            {navLinks.map((link) => (
              <button
<<<<<<< HEAD
                type="button"
                key={link.label}
                onClick={() => handleNavClick(link.href)}
                className="
                  block
                  w-full
                  text-left
                  py-2
                  text-sm
                  font-medium
                  text-slate-600
                  dark:text-gray-300
                  hover:text-[#B76E79]
                  transition-colors duration-300
                "
=======
                key={link.label}
                onClick={() => handleNavClick(link.href)}
                className="block w-full text-left py-2 text-sm font-medium text-gray-300 hover:text-purple-400 transition-colors"
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
              >
                {link.label}
              </button>
            ))}

            {/* Mobile Login */}
            <button
<<<<<<< HEAD
              type="button"
              onClick={handleLogin}
              className="
                flex
                items-center
                justify-between

                w-full

                py-3
                px-4

                rounded-xl

                bg-gradient-to-r
                from-[#B76E79]/15
                via-[#E3AAB2]/10
                to-[#B76E79]/15

                border
                border-[#B76E79]/30

                text-[#8F4F5A]
                dark:text-[#E5B4BB]

                text-sm
                font-bold

                shadow-lg
                shadow-[#B76E79]/10

                hover:border-[#B76E79]/50
                hover:bg-[#B76E79]/20

                transition-all duration-300
              "
            >
              <span className="flex items-center gap-2">
                <span
                  className="
                    w-2
                    h-2
                    rounded-full
                    bg-[#B76E79]
                    animate-pulse
                  "
                />

                Login
              </span>

              <span className="text-[#B76E79]">
=======
              onClick={handleLogin}
              className="flex items-center justify-between w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600/30 via-indigo-500/20 to-purple-600/30 border border-purple-500/40 text-purple-200 text-sm font-bold shadow-lg shadow-purple-600/10 hover:border-purple-400/70 hover:bg-purple-600/30 transition-all"
            >
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                Login
              </span>

              <span className="text-purple-400">
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                →
              </span>
            </button>

            {/* Demo Button */}
<<<<<<< HEAD
            <div
              className="
                pt-4
                border-t
                border-[#B76E79]/15
                flex
                flex-col
                gap-2
              "
            >
              <button
                type="button"
=======
            <div className="pt-4 border-t border-white/10 flex flex-col gap-2">
              <button
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdSimulator();
                }}
<<<<<<< HEAD
                className="
                  w-full
                  py-2.5
                  rounded-xl

                  bg-[#B76E79]/10

                  border
                  border-[#B76E79]/30

                  text-[#8F4F5A]
                  dark:text-[#E5B4BB]

                  text-xs
                  font-bold

                  flex
                  items-center
                  justify-center
                  gap-2

                  hover:bg-[#B76E79]/20
                  hover:border-[#B76E79]/50

                  transition-all duration-300
                "
              >
                <Zap
                  className="
                    w-4
                    h-4
                    text-[#B76E79]
                  "
                />

                Watch Demo Ad
              </button>
            </div>
=======
                className="w-full py-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center justify-center gap-2 hover:bg-amber-500/30 hover:border-amber-400/60 transition-all"
              >
                <Zap className="w-4 h-4" />
                Watch Demo Ad
              </button>
            </div>

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
          </div>
        </div>
      )}
    </header>
  );
};

export default NavHeader;