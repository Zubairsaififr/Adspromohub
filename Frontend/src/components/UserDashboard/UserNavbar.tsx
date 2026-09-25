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

return ( <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#090611]/90 text-white shadow-[0_8px_30px_rgba(0,0,0,0.35)] backdrop-blur-xl"> <div className="mx-auto flex min-h-[72px] max-w-[1600px] items-center justify-between px-4 sm:px-6 lg:px-8">

    {/* =================================================
        LOGO
    ================================================= */}

    <button
      onClick={() => handleNavigate("/dashboard")}
      className="group flex items-center gap-3"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-purple-500/30 bg-purple-600/15 shadow-[0_0_25px_rgba(168,85,247,0.18)] transition-all duration-300 group-hover:border-purple-400/60 group-hover:bg-purple-500/20">
        <Crown
          size={21}
          className="text-purple-400 transition-transform duration-300 group-hover:scale-110"
        />
      </div>

      <div className="hidden sm:block">
        <h1 className="text-base font-bold tracking-wide text-white">
          ADS
          <span className="text-purple-400">
            PROMOHUB
          </span>
        </h1>

        <p className="text-[9px] uppercase tracking-[0.25em] text-gray-500"></p>
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
            ? "border border-purple-500/30 bg-purple-500/15 text-white shadow-[0_0_20px_rgba(168,85,247,0.15)]"
            : "text-gray-300 hover:bg-purple-500/10 hover:text-white"
        }`}
      >
        <ShoppingCart
          size={17}
          className={`transition-colors duration-300 ${
            isActive("/subscription")
              ? "text-purple-400"
              : "text-gray-500 group-hover:text-purple-400"
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
                ? "border border-purple-500/30 bg-purple-500/15 text-white shadow-[0_0_20px_rgba(168,85,247,0.15)]"
                : "text-gray-300 hover:bg-purple-500/10 hover:text-white"
            }`}
          >
            <Icon
              size={17}
              className={`transition-colors duration-300 ${
                active
                  ? "text-purple-400"
                  : "text-gray-500 group-hover:text-purple-400"
              }`}
            />

            <span>{item.label}</span>
          </button>
        );
      })}

      {/* =================================================
          LOGOUT
      ================================================= */}

      <div className="ml-2 border-l border-white/10 pl-2">
        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          className="
            group flex items-center gap-2
            rounded-xl
            border border-red-500/20
            bg-red-500/5
            px-3 py-2.5
            text-sm font-medium
            text-red-300
            transition-all duration-300
            hover:border-red-500/40
            hover:bg-red-500/10
            hover:text-red-200
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
      className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-gray-300 transition-all hover:border-purple-500/30 hover:bg-purple-500/10 hover:text-purple-300 lg:hidden"
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
    <div className="border-t border-white/10 bg-[#090611]/98 px-4 pb-5 pt-3 backdrop-blur-xl lg:hidden">

      {/* MOBILE BUY SUBSCRIPTION */}

      <button
        onClick={() => handleNavigate("/subscription")}
        className={`group flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-left text-sm font-medium transition-all duration-300 ${
          isActive("/subscription")
            ? "border border-purple-500/30 bg-purple-500/15 text-white shadow-[0_0_20px_rgba(168,85,247,0.12)]"
            : "text-gray-300 hover:bg-purple-500/10 hover:text-white"
        }`}
      >
        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all ${
            isActive("/subscription")
              ? "bg-purple-500/15"
              : "bg-white/5 group-hover:bg-purple-500/10"
          }`}
        >
          <ShoppingCart
            size={17}
            className={`transition-colors ${
              isActive("/subscription")
                ? "text-purple-400"
                : "text-gray-500 group-hover:text-purple-400"
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
                  ? "border border-purple-500/30 bg-purple-500/15 text-white shadow-[0_0_20px_rgba(168,85,247,0.12)]"
                  : "text-gray-300 hover:bg-purple-500/10 hover:text-white"
              }`}
            >
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all ${
                  active
                    ? "bg-purple-500/15"
                    : "bg-white/5 group-hover:bg-purple-500/10"
                }`}
              >
                <Icon
                  size={17}
                  className={`transition-colors ${
                    active
                      ? "text-purple-400"
                      : "text-gray-500 group-hover:text-purple-400"
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

      <div className="mt-3 border-t border-white/10 pt-3">
        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          className="
            group flex w-full
            items-center gap-3
            rounded-xl
            border border-red-500/20
            bg-red-500/5
            px-4 py-3.5
            text-left
            text-sm font-medium
            text-red-300
            transition-all duration-300
            hover:border-red-500/40
            hover:bg-red-500/10
            hover:text-red-200
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-500/10">
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
