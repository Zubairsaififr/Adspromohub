import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  ShoppingCart,
  Wallet,
  Users,
  Gift,
  Crown,
  Trophy,
  UserCircle,
  Ticket,
  LogOut,
  Loader2,
} from "lucide-react";
import logo from "../../assets/Logo.png";

interface UserNavbarProps {
  onNavigate?: (path: string) => void;
}

const UserNavbar: React.FC<UserNavbarProps> = ({ onNavigate }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  // =====================================================
  // CHECK ACTIVE PAGE
  // =====================================================

  const isActive = (path: string) => {
    return location.pathname === path.trim();
  };

  // =====================================================
  // NAVIGATION
  // =====================================================

  const handleNavigate = (path: string) => {
    setMobileOpen(false);

    if (onNavigate) {
      onNavigate(path);
    } else {
      navigate(path);
    }
  };

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = async () => {
    if (loggingOut) return;

    try {
      setLoggingOut(true);

      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");
      localStorage.removeItem("rememberMe");

      setMobileOpen(false);

      navigate("/signin", {
        replace: true,
      });
    } catch (error) {
      console.error("Logout error:", error);

      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");
      localStorage.removeItem("rememberMe");

      navigate("/signin", {
        replace: true,
      });
    } finally {
      setLoggingOut(false);
    }
  };

  // =====================================================
  // MENU ITEMS
  // =====================================================

  const menuItems = [
    {
      label: "My Earning",
      icon: Wallet,
      path: "/totalearning",
    },
    {
      label: "My Circle",
      icon: Users,
      path: "/mycircle",
    },
    {
      label: "Claim Ads Points",
      icon: Gift,
      path: "/claim-ads-points",
    },
    {
      label: "Rank Hierarchy",
      icon: Crown,
      path: "/rank-hierarchy",
    },
    {
      label: "Royalty Pool",
      icon: Trophy,
      path: "/royalty-pool",
    },
    {
      label: "Rank Achiever",
      icon: Ticket,
      path: "/rank_archiever",
    },
    {
      label: "Update Profile",
      icon: UserCircle,
      path: "/update-profile",
    },
    {
      label: "My Ticket",
      icon: Ticket,
      path: "/my-ticket",
    },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-[#B76E79]/20 bg-[#120B0D]/90 text-white shadow-[0_8px_30px_rgba(0,0,0,0.35)] backdrop-blur-xl">
      <div className="mx-auto flex min-h-[72px] max-w-[1600px] items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* =================================================
            LOGO
        ================================================= */}

        <button
          onClick={() => handleNavigate("/dashboard")}
          className="group flex items-center gap-3"
        >
          <div className="flex items-center gap-2.5 mb-4 mt-4">
            <div
              className="
                w-8
                h-8
                rounded-lg
                flex
                items-center
                justify-center
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
                from-[#8F4F5A]
                via-[#B76E79]
                to-[#E3AAB2]
                bg-clip-text
                text-transparent
              "
            >
              ADSPROMOHUB
            </span>
          </div>
        </button>

        {/* =================================================
            DESKTOP NAVIGATION
        ================================================= */}

        <div className="hidden items-center gap-1 lg:flex">

          {/* BUY SUBSCRIPTION */}

          <button
            onClick={() => handleNavigate("/subscription")}
            className={`group flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-300 ${
              isActive("/subscription")
                ? "border border-[#D99AA3]/35 bg-[#B76E79]/15 text-white shadow-[0_0_20px_rgba(183,110,121,0.15)]"
                : "text-gray-300 hover:bg-[#B76E79]/10 hover:text-white"
            }`}
          >
            <ShoppingCart
              size={17}
              className={`transition-colors duration-300 ${
                isActive("/subscription")
                  ? "text-[#E3AAB2]"
                  : "text-gray-500 group-hover:text-[#D99AA3]"
              }`}
            />

            <span>Buy Subscription</span>
          </button>

          {/* OTHER ITEMS */}

          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <button
                key={item.path}
                onClick={() => handleNavigate(item.path)}
                className={`group flex items-center gap-1 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300 ${
                  active
                    ? "border border-[#D99AA3]/35 bg-[#B76E79]/15 text-white shadow-[0_0_20px_rgba(183,110,121,0.15)]"
                    : "text-gray-300 hover:bg-[#B76E79]/10 hover:text-white"
                }`}
              >
                <Icon
                  size={17}
                  className={`transition-colors duration-300 ${
                    active
                      ? "text-[#E3AAB2]"
                      : "text-gray-500 group-hover:text-[#D99AA3]"
                  }`}
                />

                <span>{item.label}</span>
              </button>
            );
          })}

          {/* =================================================
              LOGOUT
          ================================================= */}

          <div className="ml-2 border-l border-[#B76E79]/15 pl-2">
            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="
                group flex items-center gap-2
                rounded-xl
                border border-[#8F4F5A]/40
                bg-[#8F4F5A]/10
                px-3 py-2.5
                text-sm font-medium
                text-[#E3AAB2]
                transition-all duration-300
                hover:border-[#D99AA3]/50
                hover:bg-[#B76E79]/15
                hover:text-[#FFE5E8]
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              {loggingOut ? (
                <Loader2
                  size={17}
                  className="animate-spin"
                />
              ) : (
                <LogOut
                  size={17}
                  className="transition-transform duration-300 group-hover:translate-x-0.5"
                />
              )}

              <span>
                {loggingOut
                  ? "Logging out..."
                  : "Logout"}
              </span>
            </button>
          </div>
        </div>

        {/* =================================================
            MOBILE MENU BUTTON
        ================================================= */}

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="
            flex h-10 w-10
            items-center justify-center
            rounded-xl
            border border-[#B76E79]/20
            bg-[#B76E79]/5
            text-gray-300
            transition-all
            hover:border-[#D99AA3]/40
            hover:bg-[#B76E79]/10
            hover:text-[#E3AAB2]
            lg:hidden
          "
        >
          {mobileOpen ? (
            <X size={21} />
          ) : (
            <Menu size={21} />
          )}
        </button>
      </div>

      {/* ===================================================
          MOBILE NAVIGATION
      =================================================== */}

      {mobileOpen && (
        <div
          className="
            border-t
            border-[#B76E79]/15
            bg-[#120B0D]/98
            px-4
            pb-5
            pt-3
            backdrop-blur-xl
            lg:hidden
          "
        >
          {/* MOBILE BUY SUBSCRIPTION */}

          <button
            onClick={() => handleNavigate("/subscription")}
            className={`group flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-left text-sm font-medium transition-all duration-300 ${
              isActive("/subscription")
                ? "border border-[#D99AA3]/35 bg-[#B76E79]/15 text-white shadow-[0_0_20px_rgba(183,110,121,0.12)]"
                : "text-gray-300 hover:bg-[#B76E79]/10 hover:text-white"
            }`}
          >
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all ${
                isActive("/subscription")
                  ? "bg-[#B76E79]/15"
                  : "bg-white/5 group-hover:bg-[#B76E79]/10"
              }`}
            >
              <ShoppingCart
                size={17}
                className={`transition-colors ${
                  isActive("/subscription")
                    ? "text-[#E3AAB2]"
                    : "text-gray-500 group-hover:text-[#D99AA3]"
                }`}
              />
            </div>

            <span>Buy Subscription</span>
          </button>

          {/* MOBILE MENU ITEMS */}

          <div className="mt-1 grid grid-cols-1 gap-1 sm:grid-cols-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <button
                  key={item.path}
                  onClick={() => handleNavigate(item.path)}
                  className={`group flex items-center gap-3 rounded-xl px-4 py-3.5 text-left text-sm font-medium transition-all duration-300 ${
                    active
                      ? "border border-[#D99AA3]/35 bg-[#B76E79]/15 text-white shadow-[0_0_20px_rgba(183,110,121,0.12)]"
                      : "text-gray-300 hover:bg-[#B76E79]/10 hover:text-white"
                  }`}
                >
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all ${
                      active
                        ? "bg-[#B76E79]/15"
                        : "bg-white/5 group-hover:bg-[#B76E79]/10"
                    }`}
                  >
                    <Icon
                      size={17}
                      className={`transition-colors ${
                        active
                          ? "text-[#E3AAB2]"
                          : "text-gray-500 group-hover:text-[#D99AA3]"
                      }`}
                    />
                  </div>

                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* =================================================
              MOBILE LOGOUT
          ================================================= */}

          <div className="mt-3 border-t border-[#B76E79]/15 pt-3">
            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="
                group flex w-full
                items-center gap-3
                rounded-xl
                border border-[#8F4F5A]/40
                bg-[#8F4F5A]/10
                px-4 py-3.5
                text-left
                text-sm font-medium
                text-[#E3AAB2]
                transition-all duration-300
                hover:border-[#D99AA3]/50
                hover:bg-[#B76E79]/15
                hover:text-[#FFE5E8]
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#8F4F5A]/15">
                {loggingOut ? (
                  <Loader2
                    size={17}
                    className="animate-spin"
                  />
                ) : (
                  <LogOut size={17} />
                )}
              </div>

              <span>
                {loggingOut
                  ? "Logging out..."
                  : "Logout"}
              </span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default UserNavbar;