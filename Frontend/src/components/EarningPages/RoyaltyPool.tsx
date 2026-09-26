import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Crown,
  DollarSign,
  RefreshCw,
  TrendingUp,
  Users,
  ShieldCheck,
  Target,
  Zap,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import UserNavbar from "../UserDashboard/UserNavbar";

const API_URL = import.meta.env.VITE_API_URL;

// =====================================================
// TYPES
// =====================================================

interface RoyaltyLeg {
  user_id: number;
  customer_id: string;
  full_name: string;
  member_count: number;
  is_power_leg: boolean;
  qualifies_current_slab: boolean;
}

interface RoyaltyStatus {
  qualified: boolean;
  qualification_reason: string;

  current_slab: number | null;

  daily_per_leg: number | string;

  current_cap: number | string;

  total_earned: number | string;

  remaining_cap: number | string;

  qualifying_leg_count: number;

  estimated_daily_royalty: number | string;

  power_leg: RoyaltyLeg | null;

  legs: RoyaltyLeg[];
}

interface RoyaltySummary {
  total_earned: number | string;

  total_transactions: number;

  last_royalty_amount: number | string;

  last_payout_date: string | null;

  current_slab: number | null;

  current_cap: number | string;

  remaining_cap: number | string;
}

interface RoyaltyHistoryItem {
  id: number;

  slab_threshold: number;

  daily_per_leg: number | string;

  slab_total_cap: number | string;

  power_leg_user_id: number | null;

  power_leg_member_count: number;

  qualifying_leg_count: number;

  non_power_leg_count: number;

  calculated_daily_amount: number | string;

  royalty_amount: number | string;

  cap_earned_before: number | string;

  cap_earned_after: number | string;

  status: string;

  payout_date: string;

  created_at: string;
}

interface RoyaltyHistory {
  total_earned: number | string;
  count: number;
  history: RoyaltyHistoryItem[];
}

// =====================================================
// HELPERS
// =====================================================

const getToken = () =>
  localStorage.getItem("access_token") ||
  localStorage.getItem("token");

const toNumber = (
  value: number | string | undefined | null
) => {
  const parsed = Number(value ?? 0);

  return Number.isFinite(parsed)
    ? parsed
    : 0;
};

const formatMoney = (
  value: number | string | undefined | null
) =>
  `$${toNumber(value).toFixed(2)}`;

const formatNumber = (
  value: number | string | undefined | null
) =>
  toNumber(value).toLocaleString();

const formatDate = (
  value: string | null | undefined
) => {
  if (!value) return "-";

  try {
    return new Date(value).toLocaleDateString(
      "en-US",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
      }
    );
  } catch {
    return "-";
  }
};

const getStatusClass = (
  status: string,
  isDark: boolean
) => {
  if (
    status === "credited" ||
    status === "completed"
  ) {
    return isDark
      ? "bg-emerald-500/10 text-emerald-400"
      : "bg-emerald-50 text-emerald-600";
  }

  return isDark
    ? "bg-yellow-500/10 text-yellow-400"
    : "bg-yellow-50 text-yellow-600";
};

const formatQualificationReason = (
  reason: string
) => {
  switch (reason) {
    case "qualified":
      return "Royalty Qualified";

    case "minimum_legs_not_met":
      return "Minimum 3 legs required";

    case "matching_not_met":
      return "Matching requirement not met";

    case "cap_reached":
      return "Royalty cap reached";

    default:
      return reason
        ? reason.replaceAll("_", " ")
        : "Not Qualified";
  }
};

// =====================================================
// COMPONENT
// =====================================================

const RoyaltyPool: React.FC = () => {
  const navigate = useNavigate();

  const [isDark, setIsDark] = useState(true);

  const [
    royaltyStatus,
    setRoyaltyStatus,
  ] = useState<RoyaltyStatus | null>(null);

  const [
    royaltySummary,
    setRoyaltySummary,
  ] = useState<RoyaltySummary | null>(null);

  const [
    royaltyHistory,
    setRoyaltyHistory,
  ] = useState<RoyaltyHistory | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState("");

  // ===================================================
  // THEME
  // ===================================================

  useEffect(() => {
    const savedTheme =
      localStorage.getItem("theme");

    if (savedTheme === "light") {
      setIsDark(false);
    }
  }, []);

  // ===================================================
  // LOGOUT / INVALID TOKEN
  // ===================================================

  const handleUnauthorized =
    useCallback(() => {
      localStorage.removeItem(
        "access_token"
      );

      localStorage.removeItem(
        "token"
      );

      localStorage.removeItem(
        "user"
      );

      localStorage.removeItem(
        "rememberMe"
      );

      navigate("/signin");
    }, [navigate]);

  // ===================================================
  // API HELPER
  // ===================================================

  const fetchJson = useCallback(
    async (
      endpoint: string,
      token: string
    ) => {
      const response = await fetch(
        `${API_URL}${endpoint}`,
        {
          method: "GET",

          headers: {
            Authorization:
              `Bearer ${token}`,

            "Content-Type":
              "application/json",
          },
        }
      );

      if (response.status === 401) {
        handleUnauthorized();

        throw new Error(
          "Session expired."
        );
      }

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result?.detail ||
          result?.message ||
          "Unable to load Royalty Pool."
        );
      }

      return result;
    },
    [handleUnauthorized]
  );

  // ===================================================
  // FETCH ALL ROYALTY DATA
  // ===================================================

  const fetchRoyalty =
    useCallback(
      async (
        showRefresh = false
      ) => {
        const token = getToken();

        if (!token) {
          navigate("/signin");
          return;
        }

        try {
          if (showRefresh) {
            setRefreshing(true);
          } else {
            setLoading(true);
          }

          setError("");

          const [
            statusResult,
            summaryResult,
            historyResult,
          ] = await Promise.all([
            fetchJson(
              "/api/royalty-pool/status",
              token
            ),

            fetchJson(
              "/api/royalty-pool/summary",
              token
            ),

            fetchJson(
              "/api/royalty-pool/history",
              token
            ),
          ]);

          setRoyaltyStatus(
            statusResult
          );

          setRoyaltySummary(
            summaryResult
          );

          setRoyaltyHistory(
            historyResult
          );

        } catch (err: any) {
          console.error(
            "Royalty Pool Error:",
            err
          );

          if (
            err?.message !==
            "Session expired."
          ) {
            setError(
              err?.message ||
              "Something went wrong while loading Royalty Pool."
            );
          }

        } finally {
          setLoading(false);
          setRefreshing(false);
        }
      },
      [
        fetchJson,
        navigate,
      ]
    );

  // ===================================================
  // INITIAL LOAD
  // ===================================================

  useEffect(() => {
    fetchRoyalty(false);
  }, [fetchRoyalty]);

  // ===================================================
  // DERIVED VALUES
  // ===================================================

  const history =
    royaltyHistory?.history || [];

  const todayEarned = useMemo(
    () => {
      if (!history.length) {
        return 0;
      }

      const today =
        new Date().toLocaleDateString(
          "en-CA"
        );

      return history.reduce(
        (
          total,
          item
        ) => {
          if (
            item.payout_date === today
          ) {
            return (
              total +
              toNumber(
                item.royalty_amount
              )
            );
          }

          return total;
        },
        0
      );
    },
    [history]
  );

  const qualifyingLegs =
    royaltyStatus?.legs?.filter(
      (leg) =>
        !leg.is_power_leg &&
        leg.qualifies_current_slab
    ) || [];

  // ===================================================
  // THEME CLASSES
  // ===================================================

  const bgClass = isDark
    ? "bg-[#120B0D] text-white"
    : "bg-[#FFF9FA] text-slate-900";

  const cardClass = isDark
    ? "border-white/10 bg-white/[0.04]"
    : "border-slate-200 bg-white";

  const mutedClass = isDark
    ? "text-gray-400"
    : "text-slate-500";

  // ===================================================
  // UI
  // ===================================================

  return (
    <>
      <UserNavbar />

      <div
        className={`min-h-screen overflow-x-hidden ${bgClass}`}
      >
        {/* Background Glow */}

        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-[#B76E79]/10 blur-3xl" />

          <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-[#D99AA3]/10 blur-3xl" />
        </div>

        <div className="relative min-h-screen lg:pl-64">
          <main className="px-4 pb-12 pt-24 sm:px-6 lg:px-8 sm:mr-[220px]">
            <div className="mx-auto max-w-7xl">

              {/* =======================================
                  HEADER
              ======================================= */}

              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#B76E79]/15 text-[#D99AA3]">
                    <Crown size={23} />
                  </div>

                  <div>
                    <h1 className="text-2xl font-bold sm:text-3xl">
                      Royalty Pool
                    </h1>

                    <p
                      className={`mt-1 text-sm ${mutedClass}`}
                    >
                      Power Leg matching,
                      daily Royalty and
                      payout history
                    </p>
                  </div>
                </div>

                <button
                  type="button"

                  onClick={() =>
                    fetchRoyalty(true)
                  }

                  disabled={refreshing}

                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#B76E79]/20 bg-[#B76E79]/10 px-4 py-2.5 text-sm font-medium text-[#D99AA3] transition hover:bg-[#B76E79]/20 disabled:opacity-50"
                >
                  <RefreshCw
                    size={16}

                    className={
                      refreshing
                        ? "animate-spin"
                        : ""
                    }
                  />

                  Refresh
                </button>
              </div>

              {/* =======================================
                  LOADING
              ======================================= */}

              {loading && (
                <div className="flex min-h-[400px] items-center justify-center">
                  <div className="text-center">

                    <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-[#B76E79]/20 border-t-[#B76E79]" />

                    <p
                      className={`text-sm ${mutedClass}`}
                    >
                      Loading Royalty Pool...
                    </p>

                  </div>
                </div>
              )}

              {/* =======================================
                  ERROR
              ======================================= */}

              {!loading && error && (
                <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6 text-center">

                  <p className="text-sm text-red-400">
                    {error}
                  </p>

                  <button
                    type="button"

                    onClick={() =>
                      fetchRoyalty(false)
                    }

                    className="mt-4 rounded-xl bg-red-500/10 px-4 py-2 text-sm text-red-300 transition hover:bg-red-500/20"
                  >
                    Try Again
                  </button>

                </div>
              )}

              {/* =======================================
                  CONTENT
              ======================================= */}

              {!loading &&
                !error &&
                royaltyStatus &&
                royaltySummary &&
                royaltyHistory && (
                  <>

                    {/* =================================
                        SUMMARY CARDS
                    ================================= */}

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

                      {/* TODAY */}

                      <div
                        className={`rounded-2xl border p-5 backdrop-blur-xl ${cardClass}`}
                      >
                        <div className="mb-4 flex items-center justify-between">

                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#B76E79]/15 text-[#D99AA3]">
                            <TrendingUp
                              size={19}
                            />
                          </div>

                          <span className="text-xs text-gray-500">
                            TODAY
                          </span>

                        </div>

                        <div className="text-2xl font-bold">
                          {formatMoney(
                            todayEarned
                          )}
                        </div>

                        <div
                          className={`mt-1 text-xs ${mutedClass}`}
                        >
                          Today's Royalty
                        </div>
                      </div>

                      {/* TOTAL */}

                      <div
                        className={`rounded-2xl border p-5 backdrop-blur-xl ${cardClass}`}
                      >
                        <div className="mb-4 flex items-center justify-between">

                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-300">
                            <DollarSign
                              size={19}
                            />
                          </div>

                          <span className="text-xs text-gray-500">
                            TOTAL
                          </span>

                        </div>

                        <div className="text-2xl font-bold">
                          {formatMoney(
                            royaltySummary.total_earned
                          )}
                        </div>

                        <div
                          className={`mt-1 text-xs ${mutedClass}`}
                        >
                          Total Royalty earned
                        </div>
                      </div>

                      {/* DAILY ESTIMATE */}

                      <div
                        className={`rounded-2xl border p-5 backdrop-blur-xl ${cardClass}`}
                      >
                        <div className="mb-4 flex items-center justify-between">

                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/15 text-blue-300">
                            <Zap size={19} />
                          </div>

                          <span className="text-xs text-gray-500">
                            DAILY
                          </span>

                        </div>

                        <div className="text-2xl font-bold">
                          {formatMoney(
                            royaltyStatus.estimated_daily_royalty
                          )}
                        </div>

                        <div
                          className={`mt-1 text-xs ${mutedClass}`}
                        >
                          Current estimated
                          daily Royalty
                        </div>
                      </div>

                      {/* PAYOUTS */}

                      <div
                        className={`rounded-2xl border p-5 backdrop-blur-xl ${cardClass}`}
                      >
                        <div className="mb-4 flex items-center justify-between">

                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15 text-amber-300">
                            <Crown size={19} />
                          </div>

                          <span className="text-xs text-gray-500">
                            PAYOUTS
                          </span>

                        </div>

                        <div className="text-2xl font-bold">
                          {formatNumber(
                            royaltySummary.total_transactions
                          )}
                        </div>

                        <div
                          className={`mt-1 text-xs ${mutedClass}`}
                        >
                          Royalty credits
                        </div>
                      </div>

                    </div>

                    {/* =================================
                        CURRENT QUALIFICATION
                    ================================= */}

                    <div
                      className={`mt-6 rounded-2xl border p-5 backdrop-blur-xl ${cardClass}`}
                    >
                      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                        <div className="flex items-start gap-3">

                          <div
                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                              royaltyStatus.qualified
                                ? "bg-emerald-500/10 text-emerald-400"
                                : "bg-amber-500/10 text-amber-400"
                            }`}
                          >
                            {royaltyStatus.qualified ? (
                              <CheckCircle2
                                size={21}
                              />
                            ) : (
                              <XCircle
                                size={21}
                              />
                            )}
                          </div>

                          <div>
                            <div className="flex flex-wrap items-center gap-2">

                              <h2 className="font-semibold">
                                Royalty Status
                              </h2>

                              <span
                                className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                                  royaltyStatus.qualified
                                    ? "bg-emerald-500/10 text-emerald-400"
                                    : "bg-amber-500/10 text-amber-400"
                                }`}
                              >
                                {royaltyStatus.qualified
                                  ? "QUALIFIED"
                                  : "NOT QUALIFIED"}
                              </span>

                            </div>

                            <p
                              className={`mt-1 text-xs ${mutedClass}`}
                            >
                              {formatQualificationReason(
                                royaltyStatus.qualification_reason
                              )}
                            </p>
                          </div>

                        </div>

                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">

                          <div className="rounded-xl bg-[#B76E79]/[0.06] px-4 py-3">
                            <div
                              className={`text-[11px] ${mutedClass}`}
                            >
                              Matching Slab
                            </div>

                            <div className="mt-1 font-bold text-[#D99AA3]">
                              {royaltyStatus.current_slab
                                ? `${formatNumber(
                                    royaltyStatus.current_slab
                                  )}+`
                                : "-"}
                            </div>
                          </div>

                          <div className="rounded-xl bg-[#B76E79]/[0.06] px-4 py-3">
                            <div
                              className={`text-[11px] ${mutedClass}`}
                            >
                              Per Leg
                            </div>

                            <div className="mt-1 font-bold">
                              {formatMoney(
                                royaltyStatus.daily_per_leg
                              )}
                            </div>
                          </div>

                          <div className="rounded-xl bg-[#B76E79]/[0.06] px-4 py-3">
                            <div
                              className={`text-[11px] ${mutedClass}`}
                            >
                              Qualifying Legs
                            </div>

                            <div className="mt-1 font-bold">
                              {formatNumber(
                                royaltyStatus.qualifying_leg_count
                              )}
                            </div>
                          </div>

                          <div className="rounded-xl bg-[#B76E79]/[0.06] px-4 py-3">
                            <div
                              className={`text-[11px] ${mutedClass}`}
                            >
                              Current Cap
                            </div>

                            <div className="mt-1 font-bold">
                              {formatMoney(
                                royaltyStatus.current_cap
                              )}
                            </div>
                          </div>

                        </div>

                      </div>

                      {/* CAP PROGRESS */}

                      <div className="mt-5">

                        <div className="mb-2 flex items-center justify-between gap-4">

                          <span
                            className={`text-xs ${mutedClass}`}
                          >
                            Royalty Cap Progress
                          </span>

                          <span className="text-xs font-medium">
                            {formatMoney(
                              royaltyStatus.total_earned
                            )}
                            {" / "}
                            {formatMoney(
                              royaltyStatus.current_cap
                            )}
                          </span>

                        </div>

                        <div
                          className={`h-2 overflow-hidden rounded-full ${
                            isDark
                              ? "bg-white/5"
                              : "bg-slate-100"
                          }`}
                        >
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-[#8F4F5A] via-[#B76E79] to-[#D99AA3] transition-all duration-500"

                            style={{
                              width: `${
                                toNumber(
                                  royaltyStatus.current_cap
                                ) > 0
                                  ? Math.min(
                                      100,
                                      (
                                        toNumber(
                                          royaltyStatus.total_earned
                                        ) /
                                        toNumber(
                                          royaltyStatus.current_cap
                                        )
                                      ) *
                                        100
                                    )
                                  : 0
                              }%`,
                            }}
                          />
                        </div>

                        <div
                          className={`mt-2 text-right text-[11px] ${mutedClass}`}
                        >
                          Remaining{" "}
                          {formatMoney(
                            royaltyStatus.remaining_cap
                          )}
                        </div>

                      </div>
                    </div>

                    {/* =================================
                        TEAM LEGS
                    ================================= */}

                    <div
                      className={`mt-6 overflow-hidden rounded-2xl border backdrop-blur-xl ${cardClass}`}
                    >

                      <div
                        className={`border-b p-5 ${
                          isDark
                            ? "border-white/5"
                            : "border-slate-100"
                        }`}
                      >
                        <div className="flex items-center gap-3">

                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-300">
                            <Users size={18} />
                          </div>

                          <div>
                            <h2 className="font-semibold">
                              Royalty Team Legs
                            </h2>

                            <p
                              className={`mt-1 text-xs ${mutedClass}`}
                            >
                              Largest leg becomes
                              Power Leg and is excluded
                              from Royalty matching.
                            </p>
                          </div>

                        </div>
                      </div>

                      {(royaltyStatus.legs?.length ?? 0) ===
                        0 && (
                        <div className="px-6 py-12 text-center">

                          <Users
                            size={28}
                            className="mx-auto text-[#D99AA3]"
                          />

                          <h3 className="mt-3 font-semibold">
                            No Team Legs Yet
                          </h3>

                          <p
                            className={`mt-1 text-sm ${mutedClass}`}
                          >
                            Direct referral legs will
                            appear here.
                          </p>

                        </div>
                      )}

                      {(royaltyStatus.legs?.length ?? 0) >
                        0 && (
                        <div className="overflow-x-auto">

                          <table className="w-full min-w-[800px]">

                            <thead>
                              <tr
                                className={`border-b text-left text-xs uppercase tracking-wider ${
                                  isDark
                                    ? "border-white/5 text-gray-500"
                                    : "border-slate-100 text-slate-400"
                                }`}
                              >
                                <th className="px-5 py-4 font-medium">
                                  Team Leg
                                </th>

                                <th className="px-5 py-4 font-medium">
                                  Members
                                </th>

                                <th className="px-5 py-4 font-medium">
                                  Leg Type
                                </th>

                                <th className="px-5 py-4 font-medium">
                                  Current Slab
                                </th>

                                <th className="px-5 py-4 font-medium">
                                  Status
                                </th>
                              </tr>
                            </thead>

                            <tbody>
                              {royaltyStatus.legs.map(
                                (leg) => (
                                  <tr
                                    key={leg.user_id}

                                    className={`border-b transition ${
                                      isDark
                                        ? "border-white/5 hover:bg-white/[0.025]"
                                        : "border-slate-100 hover:bg-slate-50"
                                    }`}
                                  >

                                    <td className="px-5 py-4">

                                      <div className="flex items-center gap-3">

                                        <div
                                          className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                                            leg.is_power_leg
                                              ? "bg-amber-500/10 text-amber-300"
                                              : "bg-[#B76E79]/10 text-[#D99AA3]"
                                          }`}
                                        >
                                          {leg.is_power_leg ? (
                                            <Crown
                                              size={16}
                                            />
                                          ) : (
                                            <Users
                                              size={15}
                                            />
                                          )}
                                        </div>

                                        <div>
                                          <div className="text-sm font-medium">
                                            {leg.full_name}
                                          </div>

                                          <div className="mt-0.5 text-[11px] text-gray-500">
                                            {leg.customer_id}
                                          </div>
                                        </div>

                                      </div>

                                    </td>

                                    <td className="px-5 py-4">
                                      <div className="text-sm font-semibold">
                                        {formatNumber(
                                          leg.member_count
                                        )}
                                      </div>

                                      <div className="text-[11px] text-gray-500">
                                        team members
                                      </div>
                                    </td>

                                    <td className="px-5 py-4">

                                      {leg.is_power_leg ? (
                                        <span className="inline-flex rounded-full bg-amber-500/10 px-2.5 py-1 text-[11px] font-semibold text-amber-300">
                                          POWER LEG
                                        </span>
                                      ) : (
                                        <span className="inline-flex rounded-full bg-blue-500/10 px-2.5 py-1 text-[11px] font-semibold text-blue-300">
                                          MATCHING LEG
                                        </span>
                                      )}

                                    </td>

                                    <td className="px-5 py-4">

                                      {leg.is_power_leg ? (
                                        <span className="text-xs text-gray-500">
                                          Excluded
                                        </span>
                                      ) : royaltyStatus.current_slab ? (
                                        <span className="text-sm">
                                          {formatNumber(
                                            royaltyStatus.current_slab
                                          )}
                                          +
                                        </span>
                                      ) : (
                                        <span className="text-xs text-gray-500">
                                          -
                                        </span>
                                      )}

                                    </td>

                                    <td className="px-5 py-4">

                                      {leg.is_power_leg ? (
                                        <span className="inline-flex items-center gap-1.5 text-xs text-amber-300">
                                          <ShieldCheck
                                            size={14}
                                          />
                                          Excluded
                                        </span>
                                      ) : leg.qualifies_current_slab ? (
                                        <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400">
                                          <CheckCircle2
                                            size={14}
                                          />
                                          Qualified
                                        </span>
                                      ) : (
                                        <span className="inline-flex items-center gap-1.5 text-xs text-gray-500">
                                          <XCircle
                                            size={14}
                                          />
                                          Not Qualified
                                        </span>
                                      )}

                                    </td>

                                  </tr>
                                )
                              )}
                            </tbody>

                          </table>

                        </div>
                      )}

                    </div>

                    {/* =================================
                        HISTORY
                    ================================= */}

                    <div
                      className={`mt-6 overflow-hidden rounded-2xl border backdrop-blur-xl ${cardClass}`}
                    >

                      <div
                        className={`border-b p-5 ${
                          isDark
                            ? "border-white/5"
                            : "border-slate-100"
                        }`}
                      >
                        <div className="flex items-center gap-3">

                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#B76E79]/10 text-[#D99AA3]">
                            <Target size={18} />
                          </div>

                          <div>
                            <h2 className="font-semibold">
                              Royalty Income History
                            </h2>

                            <p
                              className={`mt-1 text-xs ${mutedClass}`}
                            >
                              Daily Royalty credits and
                              cap progress
                            </p>
                          </div>

                        </div>
                      </div>

                      {history.length === 0 && (
                        <div className="px-6 py-16 text-center">

                          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#B76E79]/10 text-[#D99AA3]">
                            <Crown size={25} />
                          </div>

                          <h3 className="font-semibold">
                            No Royalty Income Yet
                          </h3>

                          <p
                            className={`mt-2 text-sm ${mutedClass}`}
                          >
                            Royalty credits will
                            appear here when matching
                            requirements are met.
                          </p>

                        </div>
                      )}

                      {history.length > 0 && (
                        <div className="overflow-x-auto">

                          <table className="w-full min-w-[1050px]">

                            <thead>
                              <tr
                                className={`border-b text-left text-xs uppercase tracking-wider ${
                                  isDark
                                    ? "border-white/5 text-gray-500"
                                    : "border-slate-100 text-slate-400"
                                }`}
                              >
                                <th className="px-5 py-4 font-medium">
                                  Date
                                </th>

                                <th className="px-5 py-4 font-medium">
                                  Slab
                                </th>

                                <th className="px-5 py-4 font-medium">
                                  Power Leg
                                </th>

                                <th className="px-5 py-4 font-medium">
                                  Qualifying Legs
                                </th>

                                <th className="px-5 py-4 font-medium">
                                  Per Leg
                                </th>

                                <th className="px-5 py-4 font-medium">
                                  Calculated
                                </th>

                                <th className="px-5 py-4 font-medium">
                                  Credited
                                </th>

                                <th className="px-5 py-4 font-medium">
                                  Cap Progress
                                </th>

                                <th className="px-5 py-4 font-medium">
                                  Status
                                </th>
                              </tr>
                            </thead>

                            <tbody>
                              {history.map(
                                (income) => (
                                  <tr
                                    key={income.id}

                                    className={`border-b transition ${
                                      isDark
                                        ? "border-white/5 hover:bg-white/[0.025]"
                                        : "border-slate-100 hover:bg-slate-50"
                                    }`}
                                  >

                                    <td className="px-5 py-4">
                                      <div className="text-sm">
                                        {formatDate(
                                          income.payout_date
                                        )}
                                      </div>
                                    </td>

                                    <td className="px-5 py-4">
                                      <span className="inline-flex rounded-lg bg-[#B76E79]/10 px-2.5 py-1 text-xs font-semibold text-[#D99AA3]">
                                        {formatNumber(
                                          income.slab_threshold
                                        )}
                                        +
                                      </span>
                                    </td>

                                    <td className="px-5 py-4">
                                      <div className="text-sm font-semibold">
                                        {formatNumber(
                                          income.power_leg_member_count
                                        )}
                                      </div>

                                      <div className="text-[11px] text-gray-500">
                                        members
                                      </div>
                                    </td>

                                    <td className="px-5 py-4">
                                      <div className="text-sm font-semibold">
                                        {formatNumber(
                                          income.qualifying_leg_count
                                        )}
                                      </div>

                                      <div className="text-[11px] text-gray-500">
                                        matching legs
                                      </div>
                                    </td>

                                    <td className="px-5 py-4">
                                      <div className="text-sm font-medium">
                                        {formatMoney(
                                          income.daily_per_leg
                                        )}
                                      </div>
                                    </td>

                                    <td className="px-5 py-4">
                                      <div className="text-sm">
                                        {formatMoney(
                                          income.calculated_daily_amount
                                        )}
                                      </div>
                                    </td>

                                    <td className="px-5 py-4">
                                      <div className="text-sm font-semibold text-emerald-400">
                                        +
                                        {formatMoney(
                                          income.royalty_amount
                                        )}
                                      </div>
                                    </td>

                                    <td className="px-5 py-4">

                                      <div className="text-sm font-medium">
                                        {formatMoney(
                                          income.cap_earned_after
                                        )}
                                      </div>

                                      <div className="text-[11px] text-gray-500">
                                        of{" "}
                                        {formatMoney(
                                          income.slab_total_cap
                                        )}
                                      </div>

                                    </td>

                                    <td className="px-5 py-4">

                                      <span
                                        className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium ${getStatusClass(
                                          income.status,
                                          isDark
                                        )}`}
                                      >
                                        {income.status
                                          .charAt(0)
                                          .toUpperCase() +
                                          income.status.slice(
                                            1
                                          )}
                                      </span>

                                    </td>

                                  </tr>
                                )
                              )}
                            </tbody>

                          </table>

                        </div>
                      )}

                    </div>

                    {/* =================================
                        INFO
                    ================================= */}

                    <div className="mt-6 rounded-2xl border border-[#B76E79]/10 bg-[#B76E79]/[0.03] p-5">

                      <div className="flex gap-3">

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#B76E79]/10 text-[#D99AA3]">
                          <Crown size={18} />
                        </div>

                        <div>
                          <h3 className="font-semibold text-[#D99AA3]">
                            How Royalty Pool Works
                          </h3>

                          <p
                            className={`mt-1 text-xs leading-5 ${mutedClass}`}
                          >
                            Your largest team leg is
                            treated as the Power Leg
                            and is excluded from
                            Royalty matching. After
                            excluding the Power Leg,
                            at least two different
                            non-power legs must meet
                            the same matching
                            threshold. The highest
                            matching slab becomes
                            your current Royalty
                            slab. Every additional
                            non-power leg that also
                            meets that selected
                            threshold is included in
                            the per-leg daily
                            Royalty calculation.
                          </p>

                          <p
                            className={`mt-2 text-xs leading-5 ${mutedClass}`}
                          >
                            If your team no longer
                            meets the required
                            matching condition,
                            daily Royalty pauses.
                            Your previously earned
                            Royalty remains
                            preserved and earning
                            can resume when the
                            matching requirement is
                            met again, subject to
                            the applicable Royalty
                            cap.
                          </p>
                        </div>

                      </div>

                    </div>

                    {/* =================================
                        QUICK STATS
                    ================================= */}

                    {qualifyingLegs.length > 0 && (
                      <div
                        className={`mt-4 rounded-2xl border p-4 ${cardClass}`}
                      >
                        <div
                          className={`text-xs ${mutedClass}`}
                        >
                          Current matching:
                          {" "}
                          <span className="font-semibold text-[#D99AA3]">
                            {qualifyingLegs.length}
                            {" qualifying non-power "}
                            {qualifyingLegs.length === 1
                              ? "leg"
                              : "legs"}
                          </span>
                          {" at "}
                          <span className="font-semibold text-[#D99AA3]">
                            {formatNumber(
                              royaltyStatus.current_slab
                            )}
                            +
                          </span>
                        </div>
                      </div>
                    )}

                  </>
                )}

            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default RoyaltyPool;