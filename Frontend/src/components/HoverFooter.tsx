import React, { useState } from "react";
import {
  Send,
  CheckCircle,
  Disc as Discord,
  Zap,
} from "lucide-react";
<<<<<<< HEAD
import logo from "../assets/Logo.png"
=======
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

export const HoverFooter: React.FC = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
<<<<<<< HEAD

    if (!email) return;

    setSubscribed(true);

=======
    if (!email) return;
    setSubscribed(true);
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
    setTimeout(() => {
      setEmail("");
      setSubscribed(false);
    }, 4000);
  };

  return (
<<<<<<< HEAD
    <footer
      className="
        relative
        pt-20
        pb-12
        overflow-hidden

        bg-[#120B0D]

        border-t
        border-[#B76E79]/20

        text-white
      "
    >
      {/* Ambient Rose Gold Background Glow */}
      <div
        className="
          absolute
          top-0
          left-1/2
          -translate-x-1/2

          w-full
          max-w-4xl
          h-44

          bg-gradient-to-b
          from-[#D99AA3]/15
          via-[#B76E79]/8
          to-transparent

          blur-3xl

          pointer-events-none
        "
      />

      {/* Soft Bottom Glow */}
      <div
        className="
          absolute
          bottom-0
          left-1/2
          -translate-x-1/2

          w-[600px]
          h-[180px]

          bg-[#B76E79]/10

          blur-[100px]

          pointer-events-none
        "
      />

      <div
        className="
          max-w-7xl
          mx-auto
          px-4
          sm:px-6
          lg:px-8

          relative
          z-10
        "
      >
        {/* =========================================
            TOP NEWSLETTER / CTA
        ========================================= */}
        <div
          className="
            mb-16
            p-8
            sm:p-10

            rounded-3xl

            bg-gradient-to-r
            from-[#8F4F5A]/40
            via-[#B76E79]/15
            to-[#1A0F12]

            border
            border-[#D99AA3]/25

            backdrop-blur-xl

            shadow-[0_20px_60px_rgba(183,110,121,0.10)]

            flex
            flex-col
            lg:flex-row
            items-center
            justify-between
            gap-8
          "
        >
          {/* CTA Content */}
          <div>
            <div
              className="
                flex
                items-center
                gap-2

                text-xs
                font-bold
                tracking-widest

                text-[#E3AAB2]

                uppercase
                mb-1
              "
            >
              <Zap className="w-3.5 h-3.5" />

              <span>GLOBAL REVENUE ALERTS</span>
            </div>

            <h3
              className="
                text-2xl
                sm:text-3xl
                font-black
                text-white
              "
            >
              Stay ahead of high-payout brand campaigns
            </h3>

            <p
              className="
                text-xs
                sm:text-sm
                text-[#D99AA3]/70

                mt-1
                max-w-xl
              "
            >
              Get notified immediately when Fortune 500 advertisers release
              100,000+ impression pools.
            </p>
          </div>

          {/* Newsletter Form */}
          <form
            onSubmit={handleSubscribe}
            className="
              w-full
              lg:w-auto

              flex
              flex-col
              sm:flex-row

              gap-2.5
            "
          >
=======
    <footer className="relative pt-20 pb-12 overflow-hidden bg-slate-950 border-t border-white/10 text-white">
      {/* Ambient background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-44 bg-gradient-to-b from-purple-600/10 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Newsletter & Call to Action Box */}
        <div className="mb-16 p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-purple-950/70 via-indigo-950/60 to-slate-900 border border-purple-500/30 backdrop-blur-xl shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-purple-400 uppercase mb-1">
              <Zap className="w-3.5 h-3.5" />
              <span>GLOBAL REVENUE ALERTS</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              Stay ahead of high-payout brand campaigns
            </h3>
            <p className="text-xs sm:text-sm text-gray-400 mt-1 max-w-xl">
              Get notified immediately when Fortune 500 advertisers release 100,000+ impression pools.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubscribe} className="w-full lg:w-auto flex flex-col sm:flex-row gap-2.5">
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
<<<<<<< HEAD
              className="
                px-4
                py-3

                rounded-xl

                bg-[#120B0D]/80

                border
                border-[#B76E79]/25

                text-sm
                text-white

                placeholder-[#D99AA3]/40

                focus:outline-none
                focus:border-[#D99AA3]/70

                focus:ring-2
                focus:ring-[#B76E79]/10

                min-w-[260px]

                transition-all
              "
            />

            <button
              type="submit"
              className="
                px-6
                py-3

                rounded-xl

                bg-gradient-to-r
                from-[#8F4F5A]
                via-[#B76E79]
                to-[#D99AA3]

                hover:from-[#B76E79]
                hover:via-[#D99AA3]
                hover:to-[#E3AAB2]

                text-white

                font-bold
                text-xs

                shadow-lg
                shadow-[#B76E79]/25

                transition-all

                flex
                items-center
                justify-center
                gap-2

                whitespace-nowrap
              "
            >
              {subscribed ? (
                <>
                  <CheckCircle className="w-4 h-4 text-[#FFE5E8]" />
=======
              className="px-4 py-3 rounded-xl bg-slate-900/90 border border-white/15 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 min-w-[260px]"
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
            >
              {subscribed ? (
                <>
                  <CheckCircle className="w-4 h-4 text-emerald-300" />
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                  <span>Subscribed!</span>
                </>
              ) : (
                <>
                  <span>Subscribe</span>
                  <Send className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        </div>

<<<<<<< HEAD
        {/* =========================================
            LINKS & BRAND COLUMNS
        ========================================= */}
        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-2
            lg:grid-cols-5

            gap-10

            mb-16
          "
        >
          {/* Brand Info */}
          <div className="lg:col-span-2">
            {/* Logo */}
            <div className="flex items-center gap-2.5 mb-4">
              <div
                className="
                  w-8
                  h-8
                  rounded-lg

                  

                  flex
                  items-center
                  justify-center

                  text-white
                  font-black
                  text-xs

                  shadow-lg
                  shadow-[#B76E79]/20
                "
              >
                <img src={logo} alt="" />
                
              </div>

              <span
                className="
                  text-xl
                  font-black
                  tracking-tight

                  bg-gradient-to-r
                  from-[#B76E79]
                  via-[#D99AA3]
                  to-[#E3AAB2]

                  bg-clip-text
                  text-transparent
                "
              >
                ADSPROMOHUB
              </span>
            </div>

            {/* Description */}
            <p
              className="
                text-xs
                text-[#D99AA3]/65

                max-w-sm
                leading-relaxed
                mb-6
              "
            >
              The premier decentralized attention economy network.
              Connecting premier brand advertisers with millions of real
              viewers worldwide with instant automated rewards.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              {/* X / Twitter */}
              <a
                href="https://x.com/AdsPromohub"
                className="
                  w-8
                  h-8
                  rounded-lg

                  bg-[#B76E79]/5

                  border
                  border-[#B76E79]/15

                  hover:border-[#D99AA3]/50
                  hover:bg-[#B76E79]/15

                  text-[#D99AA3]/60
                  hover:text-[#FFE5E8]

                  flex
                  items-center
                  justify-center

                  transition-all
                "
                title="X / Twitter"
              >
                <svg
                  className="w-3.5 h-3.5 fill-current"
                  viewBox="0 0 24 24"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>

              {/* Telegram */}
              <a
                href="t.me/Adspromohub10"
                className="
                  w-8
                  h-8
                  rounded-lg

                  bg-[#B76E79]/5

                  border
                  border-[#B76E79]/15

                  hover:border-[#D99AA3]/50
                  hover:bg-[#B76E79]/15

                  text-[#D99AA3]/60
                  hover:text-[#FFE5E8]

                  flex
                  items-center
                  justify-center

                  transition-all
                "
                title="Telegram"
              >
                <svg
                  className="w-3.5 h-3.5 fill-current"
                  viewBox="0 0 24 24"
                >
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="https://www.instagram.com/adspromohub01?utm_source=qr&stkn=dzlxbXFrODA4OWs4"
                className="
                  w-8
                  h-8
                  rounded-lg

                  bg-[#B76E79]/5

                  border
                  border-[#B76E79]/15

                  hover:border-[#D99AA3]/50
                  hover:bg-[#B76E79]/15

                  text-[#D99AA3]/60
                  hover:text-[#FFE5E8]

                  flex
                  items-center
                  justify-center

                  transition-all
                "
=======
        {/* Links & Brand Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-16">
          {/* Brand Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center text-white font-black text-xs shadow-md">
                A
              </div>
              <span className="text-xl font-black tracking-tight text-brand-gradient">
                ADSPROMOHUB
              </span>
            </div>
            <p className="text-xs text-gray-400 max-w-sm leading-relaxed mb-6">
              The premier decentralized attention economy network. Connecting premier brand advertisers with millions of real viewers worldwide with instant automated rewards.
            </p>
            <div className="flex items-center gap-3">
              {/* X / Twitter SVG */}
              <a
                href="https://x.com/AdsPromohub"
                className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 hover:border-purple-500/50 hover:bg-purple-600/20 text-gray-400 hover:text-white flex items-center justify-center transition-all"
                title="X / Twitter"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              {/* Telegram SVG */}
              <a
                href="t.me/Adspromohub10"
                className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 hover:border-purple-500/50 hover:bg-purple-600/20 text-gray-400 hover:text-white flex items-center justify-center transition-all"
                title="Telegram"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
              </a>
              {/* Discord */}
              <a
                href="https://www.instagram.com/adspromohub01?utm_source=qr&stkn=dzlxbXFrODA4OWs4"
                className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 hover:border-purple-500/50 hover:bg-purple-600/20 text-gray-400 hover:text-white flex items-center justify-center transition-all"
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                title="Instagram"
              >
                <Discord className="w-4 h-4" />
              </a>
<<<<<<< HEAD

              {/* YouTube */}
              <a
                href="https://youtube.com/@adspromohub01?si=_jxpd2dPXYnD7ik5"
                className="
                  w-8
                  h-8
                  rounded-lg

                  bg-[#B76E79]/5

                  border
                  border-[#B76E79]/15

                  hover:border-[#D99AA3]/50
                  hover:bg-[#B76E79]/15

                  text-[#D99AA3]/60
                  hover:text-[#FFE5E8]

                  flex
                  items-center
                  justify-center

                  transition-all
                "
                title="YouTube"
              >
                <svg
                  className="w-3.5 h-3.5 fill-current"
                  viewBox="0 0 24 24"
                >
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
=======
              {/* YouTube SVG */}
              <a
                href="https://youtube.com/@adspromohub01?si=_jxpd2dPXYnD7ik5"
                className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 hover:border-purple-500/50 hover:bg-purple-600/20 text-gray-400 hover:text-white flex items-center justify-center transition-all"
                title="YouTube"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                </svg>
              </a>
            </div>
          </div>

<<<<<<< HEAD
          {/* Platform */}
          <div>
            <h4
              className="
                text-xs
                font-bold
                text-white
                uppercase
                tracking-wider
                mb-4
              "
            >
              Platform
            </h4>

            <ul className="space-y-2.5 text-xs text-[#D99AA3]/60">
              <li>
                <a
                  href="#hero"
                  className="hover:text-[#E3AAB2] transition-colors"
                >
                  Overview
                </a>
              </li>

              <li>
                <a
                  href="#how-it-works"
                  className="hover:text-[#E3AAB2] transition-colors"
                >
                  How It Works
                </a>
              </li>

              <li>
                <a
                  href="#live-ads"
                  className="hover:text-[#E3AAB2] transition-colors"
                >
                  Live Ads Stream
                </a>
              </li>

              <li>
                <a
                  href="#calculator"
                  className="hover:text-[#E3AAB2] transition-colors"
                >
                  Compounding ROI
                </a>
              </li>

              <li>
                <a
                  href="#plans"
                  className="hover:text-[#E3AAB2] transition-colors"
                >
                  Membership Tiers
                </a>
              </li>
            </ul>
          </div>

          {/* Advertisers */}
          <div>
            <h4
              className="
                text-xs
                font-bold
                text-white
                uppercase
                tracking-wider
                mb-4
              "
            >
              Advertisers
            </h4>

            <ul className="space-y-2.5 text-xs text-[#D99AA3]/60">
              <li>
                <a
                  href="#"
                  className="hover:text-[#E3AAB2] transition-colors"
                >
                  Create Campaign
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="hover:text-[#E3AAB2] transition-colors"
                >
                  Audience Targeting
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="hover:text-[#E3AAB2] transition-colors"
                >
                  Anti-Fraud Shield
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="hover:text-[#E3AAB2] transition-colors"
                >
                  Advertiser API
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="hover:text-[#E3AAB2] transition-colors"
                >
                  Case Studies
                </a>
              </li>
            </ul>
          </div>

          {/* Legal & Trust */}
          <div>
            <h4
              className="
                text-xs
                font-bold
                text-white
                uppercase
                tracking-wider
                mb-4
              "
            >
              Legal & Trust
            </h4>

            <ul className="space-y-2.5 text-xs text-[#D99AA3]/60">
              <li>
                <a
                  href="#"
                  className="hover:text-[#E3AAB2] transition-colors"
                >
                  Privacy Policy
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="hover:text-[#E3AAB2] transition-colors"
                >
                  Terms of Service
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="hover:text-[#E3AAB2] transition-colors"
                >
                  KYC & Anti-Bot
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="hover:text-[#E3AAB2] transition-colors"
                >
                  Security Audits
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="hover:text-[#E3AAB2] transition-colors"
                >
                  Contact Support
                </a>
              </li>
=======
          {/* Nav Column 1 */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Platform
            </h4>
            <ul className="space-y-2.5 text-xs text-gray-400">
              <li><a href="#hero" className="hover:text-purple-400 transition-colors">Overview</a></li>
              <li><a href="#how-it-works" className="hover:text-purple-400 transition-colors">How It Works</a></li>
              <li><a href="#live-ads" className="hover:text-purple-400 transition-colors">Live Ads Stream</a></li>
              <li><a href="#calculator" className="hover:text-purple-400 transition-colors">Compounding ROI</a></li>
              <li><a href="#plans" className="hover:text-purple-400 transition-colors">Membership Tiers</a></li>
            </ul>
          </div>

          {/* Nav Column 2 */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Advertisers
            </h4>
            <ul className="space-y-2.5 text-xs text-gray-400">
              <li><a href="#" className="hover:text-purple-400 transition-colors">Create Campaign</a></li>
              <li><a href="#" className="hover:text-purple-400 transition-colors">Audience Targeting</a></li>
              <li><a href="#" className="hover:text-purple-400 transition-colors">Anti-Fraud Shield</a></li>
              <li><a href="#" className="hover:text-purple-400 transition-colors">Advertiser API</a></li>
              <li><a href="#" className="hover:text-purple-400 transition-colors">Case Studies</a></li>
            </ul>
          </div>

          {/* Nav Column 3 */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Legal & Trust
            </h4>
            <ul className="space-y-2.5 text-xs text-gray-400">
              <li><a href="#" className="hover:text-purple-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-purple-400 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-purple-400 transition-colors">KYC & Anti-Bot</a></li>
              <li><a href="#" className="hover:text-purple-400 transition-colors">Security Audits</a></li>
              <li><a href="#" className="hover:text-purple-400 transition-colors">Contact Support</a></li>
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
            </ul>
          </div>
        </div>

<<<<<<< HEAD
        {/* =========================================
            BOTTOM BAR
        ========================================= */}
        <div
          className="
            pt-8

            border-t
            border-[#B76E79]/15

            flex
            flex-col
            sm:flex-row

            items-center
            justify-between

            gap-4

            text-xs
            text-[#D99AA3]/45
          "
        >
          {/* Live Uptime */}
          <div className="flex items-center gap-2">
            <span
              className="
                h-2
                w-2
                rounded-full

                bg-[#E3AAB2]

                shadow-[0_0_10px_rgba(227,170,178,0.8)]

                animate-pulse
              "
            />

            <span
              className="
                font-mono
                text-[#D99AA3]/60
              "
            >
              Global Cluster: 99.98% Uptime • 140+ Countries Connected
            </span>
          </div>

          {/* Copyright */}
          <div className="text-center sm:text-right">
            © {new Date().getFullYear()} ADSPROMOHUB Inc. All rights reserved
            around the world.
=======
        {/* Bottom Bar with Live Uptime Indicator */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-gray-400">Global Cluster: 99.98% Uptime • 140+ Countries Connected</span>
          </div>
          <div>
            © {new Date().getFullYear()} ADSPROMOHUB Inc. All rights reserved around the world.
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
          </div>
        </div>
      </div>
    </footer>
  );
};

<<<<<<< HEAD
export default HoverFooter;
=======
export default HoverFooter;
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
