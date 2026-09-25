import React, {
  useEffect,
  useState,
} from "react";

import {
  Trophy,
  Users,
  Wallet,
  CheckCircle2,
  Clock,
  Crown,
  Plane,
  Car,
  Home,
  Briefcase,
  Gem,
  RefreshCw,
  History,
  CalendarDays,
  CircleDollarSign,
} from "lucide-react";
import UserNavbar from "../UserDashboard/UserNavbar";


// ============================================================
// API
// ============================================================

const API_URL = import.meta.env.VITE_API_URL;


// ============================================================
// TYPES
// ============================================================

interface Fund {
  rank: string;

  fund_type: string;

  rank_unlocked: boolean;

  required_team_members: number;

  team_members: number;

  team_requirement_met: boolean;

  required_wallet_balance: number;

  wallet_balance: number;

  wallet_maintenance_met: boolean;

  monthly_amount: number;

  is_eligible: boolean;

  eligible_at: string | null;

  paid_this_month: boolean;

  last_payout_date: string | null;

  total_paid: number;
}


interface RankData {
  success: boolean;

  team_members: number;

  wallet_balance: number;

  payout_year: number;

  payout_month: number;

  funds: Fund[];
}


interface HistoryItem {
  id: number;

  rank_name: string;

  fund_type: string;

  team_members: number;

  required_team_members: number;

  wallet_balance: number;

  required_wallet_balance: number;

  amount: number;

  payout_year: number;

  payout_month: number;

  payout_date: string;

  status: string;

  created_at: string;
}


interface HistoryData {
  success: boolean;

  total_paid: number;

  count: number;

  history: HistoryItem[];
}


// ============================================================
// ICONS
// ============================================================

const rankIcons: Record<
  string,
  React.ReactNode
> = {
  Emerald: <Briefcase size={24} />,

  Sapphire: <Plane size={24} />,

  Topaz: <Car size={24} />,

  Amethyst: <Home size={24} />,

  Diamond: <Gem size={24} />,

  "Crown Jewel": <Crown size={24} />,
};


// ============================================================
// FORMAT MONEY
// ============================================================

const formatMoney = (
  amount: number | string
) => {

  return `$${Number(
    amount || 0
  ).toFixed(2)}`;
};


// ============================================================
// FORMAT DATE
// ============================================================

const formatDate = (
  date: string | null
) => {

  if (!date) {
    return "Not paid yet";
  }

  return new Date(
    date
  ).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    }
  );
};


// ============================================================
// MONTH NAME
// ============================================================

const getMonthName = (
  month: number
) => {

  if (
    month < 1 ||
    month > 12
  ) {
    return "";
  }

  return new Date(
    2000,
    month - 1,
    1
  ).toLocaleString(
    "en-US",
    {
      month: "long",
    }
  );
};


// ============================================================
// COMPONENT
// ============================================================

export default function RankAchiever() {

  const [
    isDark,
    setIsDark,
  ] = useState(false);


  const [
    data,
    setData,
  ] = useState<RankData | null>(
    null
  );


  const [
    history,
    setHistory,
  ] = useState<HistoryData | null>(
    null
  );


  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    refreshing,
    setRefreshing,
  ] = useState(false);


  const [
    error,
    setError,
  ] = useState("");


  // ==========================================================
  // THEME
  // ==========================================================

  useEffect(() => {

    const savedTheme =
      localStorage.getItem(
        "theme"
      );

    setIsDark(
      savedTheme === "dark"
    );

  }, []);


  useEffect(() => {

    localStorage.setItem(
      "theme",
      isDark
        ? "dark"
        : "light"
    );

  }, [isDark]);


  // ==========================================================
  // FETCH STATUS + HISTORY
  // ==========================================================

  const fetchRankAchiever = async (
    isRefresh = false
  ) => {

    try {

      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }


      setError("");


      const token =
        localStorage.getItem(
          "access_token"
        );


      if (!token) {

        setError(
          "Please login again."
        );

        return;
      }


      // ------------------------------------------------------
      // STATUS + HISTORY PARALLEL
      // ------------------------------------------------------

      const [
        statusResponse,
        historyResponse,
      ] = await Promise.all([

        fetch(
          `${API_URL}/api/rank-achiever/status`,
          {
            method: "GET",

            headers: {
              Authorization:
                `Bearer ${token}`,

              "Content-Type":
                "application/json",
            },
          }
        ),

        fetch(
          `${API_URL}/api/rank-achiever/history`,
          {
            method: "GET",

            headers: {
              Authorization:
                `Bearer ${token}`,

              "Content-Type":
                "application/json",
            },
          }
        ),

      ]);


      // ------------------------------------------------------
      // STATUS
      // ------------------------------------------------------

      const statusResult =
        await statusResponse.json();


      if (!statusResponse.ok) {

        throw new Error(
          statusResult?.detail ||
          "Failed to load Rank Achiever status."
        );
      }


      // ------------------------------------------------------
      // HISTORY
      // ------------------------------------------------------

      const historyResult =
        await historyResponse.json();


      if (!historyResponse.ok) {

        throw new Error(
          historyResult?.detail ||
          "Failed to load Rank Achiever history."
        );
      }


      setData(
        statusResult
      );


      setHistory(
        historyResult
      );

    } catch (err: any) {

      console.error(
        "Rank Achiever Error:",
        err
      );


      setError(
        err?.message ||
        "Something went wrong."
      );

    } finally {

      setLoading(false);

      setRefreshing(false);
    }
  };


  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(() => {

    fetchRankAchiever();

  }, []);


  // ==========================================================
  // CALCULATED VALUES
  // ==========================================================

  const eligibleFunds =
    data?.funds.filter(
      (fund) =>
        fund.is_eligible
    ) || [];


  const paidFunds =
    data?.funds.filter(
      (fund) =>
        fund.paid_this_month
    ) || [];


  const availableMonthlyReward =
    eligibleFunds.reduce(
      (
        total,
        fund
      ) =>
        total +
        Number(
          fund.monthly_amount || 0
        ),
      0
    );


  const paidThisMonthAmount =
    paidFunds.reduce(
      (
        total,
        fund
      ) =>
        total +
        Number(
          fund.monthly_amount || 0
        ),
      0
    );


  // ==========================================================
  // UI
  // ==========================================================

  return (
    <>
    <UserNavbar/>
      <div
        className={`flex min-h-screen w-full ${isDark
          ? "animated-gradient text-white"
          : "bg-gray-50 text-gray-900"
          }`}
      >

        <div
          className="flex min-w-0 flex-1 flex-col"
        >

          <main
            className={`flex-1 p-4 sm:p-6 lg:p-8 ${isDark
              ? "animated-gradient"
              : "bg-gray-50"
              }`}
          >

            {/* =================================================
              LOADING
          ================================================= */}

            {loading ? (

              <div
                className="flex min-h-[60vh] items-center justify-center"
              >

                <div
                  className="text-center"
                >

                  <RefreshCw
                    size={32}
                    className={`mx-auto mb-4 animate-spin ${isDark
                      ? "text-purple-400"
                      : "text-purple-600"
                      }`}
                  />

                  <p
                    className={
                      isDark
                        ? "text-gray-400"
                        : "text-gray-500"
                    }
                  >
                    Loading Rank Achiever...
                  </p>

                </div>

              </div>


            ) : error ? (

              /* ===============================================
                 ERROR
              =============================================== */

              <div
                className="flex min-h-[60vh] items-center justify-center px-5"
              >

                <div
                  className={`w-full max-w-md rounded-3xl border p-8 text-center shadow-sm ${isDark
                    ? "border-red-500/20 bg-white/[0.04]"
                    : "border-red-200 bg-white"
                    }`}
                >

                  <div
                    className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full ${isDark
                      ? "bg-red-500/10"
                      : "bg-red-50"
                      }`}
                  >

                    <Trophy
                      className={
                        isDark
                          ? "text-red-400"
                          : "text-red-600"
                      }
                    />

                  </div>


                  <h2
                    className={`mb-2 text-xl font-semibold ${isDark
                      ? "text-white"
                      : "text-gray-900"
                      }`}
                  >
                    Unable to load data
                  </h2>


                  <p
                    className={`mb-6 text-sm ${isDark
                      ? "text-gray-400"
                      : "text-gray-500"
                      }`}
                  >
                    {error}
                  </p>


                  <button
                    onClick={() =>
                      fetchRankAchiever()
                    }
                    className="rounded-xl bg-purple-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-purple-500"
                  >
                    Try Again
                  </button>

                </div>

              </div>


            ) : data ? (

              /* ===============================================
                 DATA
              =============================================== */

              <div
                className="mx-auto max-w-7xl"
              >

                {/* =============================================
                  HEADER
              ============================================= */}

                <div
                  className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
                >

                  <div>

                    <div
                      className="mb-2 flex items-center gap-2"
                    >

                      <Trophy
                        size={25}
                        className={
                          isDark
                            ? "text-purple-400"
                            : "text-purple-600"
                        }
                      />


                      <span
                        className={`text-sm font-medium ${isDark
                          ? "text-purple-400"
                          : "text-purple-600"
                          }`}
                      >
                        RANK ACHIEVER
                      </span>

                    </div>


                    <h1
                      className={`text-3xl font-bold tracking-tight sm:text-4xl ${isDark
                        ? "text-white"
                        : "text-gray-900"
                        }`}
                    >
                      Rank Achiever Funds
                    </h1>


                    <p
                      className={`mt-2 text-sm sm:text-base ${isDark
                        ? "text-gray-400"
                        : "text-gray-500"
                        }`}
                    >
                      Maintain your team and wallet
                      requirements to qualify for
                      monthly rewards.
                    </p>

                  </div>


                  <button
                    onClick={() =>
                      fetchRankAchiever(
                        true
                      )
                    }
                    disabled={refreshing}
                    className={`flex w-fit items-center gap-2 rounded-xl border px-4 py-3 text-sm transition ${isDark
                      ? "border-white/10 bg-white/[0.05] text-gray-300 hover:bg-white/[0.08]"
                      : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                  >

                    <RefreshCw
                      size={17}
                      className={
                        refreshing
                          ? "animate-spin"
                          : ""
                      }
                    />

                    Refresh

                  </button>

                </div>


                {/* =============================================
                  TOP STATS
              ============================================= */}

                <div
                  className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
                >

                  {/* TEAM */}

                  <div
                    className={`rounded-2xl border p-5 shadow-sm ${isDark
                      ? "border-blue-500/20 bg-gradient-to-br from-blue-500/10 to-transparent"
                      : "border-blue-200 bg-gradient-to-br from-blue-50 to-white"
                      }`}
                  >

                    <div
                      className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${isDark
                        ? "bg-blue-500/15"
                        : "bg-blue-100"
                        }`}
                    >

                      <Users
                        size={22}
                        className={
                          isDark
                            ? "text-blue-400"
                            : "text-blue-600"
                        }
                      />

                    </div>


                    <p
                      className={`text-sm ${isDark
                        ? "text-gray-400"
                        : "text-gray-500"
                        }`}
                    >
                      Total Team Members
                    </p>


                    <h2
                      className={`mt-1 text-2xl font-bold ${isDark
                        ? "text-white"
                        : "text-gray-900"
                        }`}
                    >
                      {data.team_members.toLocaleString()}
                    </h2>

                  </div>


                  {/* WALLET */}

                  <div
                    className={`rounded-2xl border p-5 shadow-sm ${isDark
                      ? "border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-transparent"
                      : "border-emerald-200 bg-gradient-to-br from-emerald-50 to-white"
                      }`}
                  >

                    <div
                      className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${isDark
                        ? "bg-emerald-500/15"
                        : "bg-emerald-100"
                        }`}
                    >

                      <Wallet
                        size={22}
                        className={
                          isDark
                            ? "text-emerald-400"
                            : "text-emerald-600"
                        }
                      />

                    </div>


                    <p
                      className={`text-sm ${isDark
                        ? "text-gray-400"
                        : "text-gray-500"
                        }`}
                    >
                      Current Wallet Balance
                    </p>


                    <h2
                      className={`mt-1 text-2xl font-bold ${isDark
                        ? "text-white"
                        : "text-gray-900"
                        }`}
                    >
                      {formatMoney(
                        data.wallet_balance
                      )}
                    </h2>

                  </div>


                  {/* ELIGIBLE MONTHLY */}

                  <div
                    className={`rounded-2xl border p-5 shadow-sm ${isDark
                      ? "border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-transparent"
                      : "border-purple-200 bg-gradient-to-br from-purple-50 to-white"
                      }`}
                  >

                    <div
                      className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${isDark
                        ? "bg-purple-500/15"
                        : "bg-purple-100"
                        }`}
                    >

                      <CircleDollarSign
                        size={22}
                        className={
                          isDark
                            ? "text-purple-400"
                            : "text-purple-600"
                        }
                      />

                    </div>


                    <p
                      className={`text-sm ${isDark
                        ? "text-gray-400"
                        : "text-gray-500"
                        }`}
                    >
                      Eligible Monthly Reward
                    </p>


                    <h2
                      className={`mt-1 text-2xl font-bold ${isDark
                        ? "text-white"
                        : "text-gray-900"
                        }`}
                    >
                      {formatMoney(
                        availableMonthlyReward
                      )}
                    </h2>

                  </div>


                  {/* TOTAL PAID */}

                  <div
                    className={`rounded-2xl border p-5 shadow-sm ${isDark
                      ? "border-yellow-500/20 bg-gradient-to-br from-yellow-500/10 to-transparent"
                      : "border-yellow-200 bg-gradient-to-br from-yellow-50 to-white"
                      }`}
                  >

                    <div
                      className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${isDark
                        ? "bg-yellow-500/15"
                        : "bg-yellow-100"
                        }`}
                    >

                      <Trophy
                        size={22}
                        className={
                          isDark
                            ? "text-yellow-400"
                            : "text-yellow-600"
                        }
                      />

                    </div>


                    <p
                      className={`text-sm ${isDark
                        ? "text-gray-400"
                        : "text-gray-500"
                        }`}
                    >
                      Total Fund Paid
                    </p>


                    <h2
                      className={`mt-1 text-2xl font-bold ${isDark
                        ? "text-white"
                        : "text-gray-900"
                        }`}
                    >
                      {formatMoney(
                        history?.total_paid || 0
                      )}
                    </h2>

                  </div>

                </div>


                {/* =============================================
                  CURRENT MONTH OVERVIEW
              ============================================= */}

                <div
                  className={`mb-8 rounded-3xl border p-5 shadow-sm sm:p-7 ${isDark
                    ? "border-white/10 bg-white/[0.035]"
                    : "border-gray-200 bg-white"
                    }`}
                >

                  <div
                    className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
                  >

                    <div>

                      <div
                        className="flex items-center gap-2"
                      >

                        <CalendarDays
                          size={20}
                          className={
                            isDark
                              ? "text-purple-400"
                              : "text-purple-600"
                          }
                        />


                        <h2
                          className={`text-xl font-semibold ${isDark
                            ? "text-white"
                            : "text-gray-900"
                            }`}
                        >
                          {getMonthName(
                            data.payout_month
                          )}{" "}
                          {data.payout_year}
                        </h2>

                      </div>


                      <p
                        className={`mt-1 text-sm ${isDark
                          ? "text-gray-500"
                          : "text-gray-500"
                          }`}
                      >
                        Current monthly Rank Achiever
                        qualification.
                      </p>

                    </div>


                    <div
                      className="flex gap-3"
                    >

                      <div
                        className={`rounded-xl border px-4 py-2 ${isDark
                          ? "border-emerald-500/20 bg-emerald-500/10"
                          : "border-emerald-200 bg-emerald-50"
                          }`}
                      >

                        <p
                          className={`text-[11px] ${isDark
                            ? "text-emerald-400"
                            : "text-emerald-700"
                            }`}
                        >
                          Eligible Funds
                        </p>

                        <p
                          className={`text-lg font-bold ${isDark
                            ? "text-white"
                            : "text-gray-900"
                            }`}
                        >
                          {eligibleFunds.length}
                        </p>

                      </div>


                      <div
                        className={`rounded-xl border px-4 py-2 ${isDark
                          ? "border-purple-500/20 bg-purple-500/10"
                          : "border-purple-200 bg-purple-50"
                          }`}
                      >

                        <p
                          className={`text-[11px] ${isDark
                            ? "text-purple-400"
                            : "text-purple-700"
                            }`}
                        >
                          Paid This Month
                        </p>

                        <p
                          className={`text-lg font-bold ${isDark
                            ? "text-white"
                            : "text-gray-900"
                            }`}
                        >
                          {formatMoney(
                            paidThisMonthAmount
                          )}
                        </p>

                      </div>

                    </div>

                  </div>


                  {/* FUND JOURNEY */}

                  <div
                    className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6"
                  >

                    {data.funds.map(
                      (fund) => {

                        const completed =
                          fund.paid_this_month;

                        const eligible =
                          fund.is_eligible;


                        return (

                          <div
                            key={fund.rank}
                            className={`rounded-2xl border p-4 text-center ${completed
                              ? isDark
                                ? "border-blue-500/30 bg-blue-500/10"
                                : "border-blue-300 bg-blue-50"
                              : eligible
                                ? isDark
                                  ? "border-emerald-500/30 bg-emerald-500/10"
                                  : "border-emerald-300 bg-emerald-50"
                                : isDark
                                  ? "border-white/10 bg-white/[0.025]"
                                  : "border-gray-200 bg-gray-50"
                              }`}
                          >

                            <div
                              className={`mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl ${completed
                                ? isDark
                                  ? "bg-blue-500/15 text-blue-400"
                                  : "bg-blue-100 text-blue-600"
                                : eligible
                                  ? isDark
                                    ? "bg-emerald-500/15 text-emerald-400"
                                    : "bg-emerald-100 text-emerald-600"
                                  : isDark
                                    ? "bg-purple-500/10 text-purple-400"
                                    : "bg-purple-100 text-purple-600"
                                }`}
                            >
                              {rankIcons[
                                fund.rank
                              ]}
                            </div>


                            <p
                              className={`text-xs font-medium ${isDark
                                ? "text-gray-200"
                                : "text-gray-800"
                                }`}
                            >
                              {fund.rank}
                            </p>


                            <p
                              className={`mt-1 text-[10px] ${completed
                                ? isDark
                                  ? "text-blue-400"
                                  : "text-blue-600"
                                : eligible
                                  ? isDark
                                    ? "text-emerald-400"
                                    : "text-emerald-600"
                                  : isDark
                                    ? "text-gray-500"
                                    : "text-gray-400"
                                }`}
                            >
                              {completed
                                ? "Paid"
                                : eligible
                                  ? "Eligible"
                                  : "In Progress"}
                            </p>

                          </div>

                        );
                      }
                    )}

                  </div>

                </div>


                {/* =============================================
                  MONTHLY FUNDS
              ============================================= */}

                <div>

                  <div
                    className="mb-5"
                  >

                    <h2
                      className={`text-2xl font-bold ${isDark
                        ? "text-white"
                        : "text-gray-900"
                        }`}
                    >
                      Monthly Funds
                    </h2>


                    <p
                      className={`mt-1 text-sm ${isDark
                        ? "text-gray-500"
                        : "text-gray-500"
                        }`}
                    >
                      Maintain both the required team
                      size and Income Wallet balance.
                    </p>

                  </div>


                  <div
                    className="grid grid-cols-1 gap-5 lg:grid-cols-2"
                  >

                    {data.funds.map(
                      (fund) => {

                        const teamProgress =
                          Math.min(
                            (
                              fund.team_members /
                              fund.required_team_members
                            ) * 100,
                            100
                          );


                        const walletProgress =
                          Math.min(
                            (
                              fund.wallet_balance /
                              fund.required_wallet_balance
                            ) * 100,
                            100
                          );


                        return (

                          <div
                            key={fund.rank}
                            className={`overflow-hidden rounded-3xl border p-6 shadow-sm ${fund.paid_this_month
                              ? isDark
                                ? "border-blue-500/30 bg-gradient-to-br from-blue-500/10 via-white/[0.03] to-transparent"
                                : "border-blue-300 bg-gradient-to-br from-blue-50 via-white to-white"
                              : fund.is_eligible
                                ? isDark
                                  ? "border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 via-white/[0.03] to-transparent"
                                  : "border-emerald-300 bg-gradient-to-br from-emerald-50 via-white to-white"
                                : isDark
                                  ? "border-white/10 bg-white/[0.025]"
                                  : "border-gray-200 bg-white"
                              }`}
                          >

                            {/* HEADER */}

                            <div
                              className="mb-6 flex items-start justify-between gap-4"
                            >

                              <div
                                className="flex items-center gap-4"
                              >

                                <div
                                  className={`flex h-14 w-14 items-center justify-center rounded-2xl ${fund.paid_this_month
                                    ? isDark
                                      ? "bg-blue-500/15 text-blue-400"
                                      : "bg-blue-100 text-blue-600"
                                    : fund.is_eligible
                                      ? isDark
                                        ? "bg-emerald-500/15 text-emerald-400"
                                        : "bg-emerald-100 text-emerald-600"
                                      : isDark
                                        ? "bg-purple-500/10 text-purple-400"
                                        : "bg-purple-100 text-purple-600"
                                    }`}
                                >
                                  {rankIcons[
                                    fund.rank
                                  ]}
                                </div>


                                <div>

                                  <h3
                                    className={`text-xl font-bold ${isDark
                                      ? "text-white"
                                      : "text-gray-900"
                                      }`}
                                  >
                                    {fund.fund_type}
                                  </h3>


                                  <p
                                    className={`mt-1 text-sm ${isDark
                                      ? "text-gray-500"
                                      : "text-gray-500"
                                      }`}
                                  >
                                    {fund.rank}
                                  </p>

                                </div>

                              </div>


                              {/* STATUS */}

                              {fund.paid_this_month ? (

                                <div
                                  className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium ${isDark
                                    ? "border-blue-500/20 bg-blue-500/10 text-blue-400"
                                    : "border-blue-200 bg-blue-50 text-blue-700"
                                    }`}
                                >

                                  <CheckCircle2
                                    size={14}
                                  />

                                  Paid

                                </div>


                              ) : fund.is_eligible ? (

                                <div
                                  className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium ${isDark
                                    ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                                    : "border-emerald-200 bg-emerald-50 text-emerald-700"
                                    }`}
                                >

                                  <CheckCircle2
                                    size={14}
                                  />

                                  Eligible

                                </div>


                              ) : (

                                <div
                                  className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium ${isDark
                                    ? "border-yellow-500/20 bg-yellow-500/10 text-yellow-400"
                                    : "border-yellow-200 bg-yellow-50 text-yellow-700"
                                    }`}
                                >

                                  <Clock
                                    size={14}
                                  />

                                  In Progress

                                </div>

                              )}

                            </div>


                            {/* MONTHLY REWARD */}

                            <div
                              className={`mb-6 rounded-2xl border p-5 ${isDark
                                ? "border-white/10 bg-black/20"
                                : "border-gray-200 bg-gray-50"
                                }`}
                            >

                              <p
                                className={`text-xs uppercase tracking-wider ${isDark
                                  ? "text-gray-500"
                                  : "text-gray-400"
                                  }`}
                              >
                                Monthly Reward
                              </p>


                              <div
                                className="mt-1"
                              >

                                <span
                                  className={`text-3xl font-bold ${isDark
                                    ? "text-white"
                                    : "text-gray-900"
                                    }`}
                                >
                                  {formatMoney(
                                    fund.monthly_amount
                                  )}
                                </span>


                                <span
                                  className={`ml-2 text-sm ${isDark
                                    ? "text-gray-500"
                                    : "text-gray-400"
                                    }`}
                                >
                                  / month
                                </span>

                              </div>

                            </div>


                            {/* =================================
                              TEAM REQUIREMENT
                          ================================= */}

                            <div
                              className="mb-5"
                            >

                              <div
                                className="mb-2 flex items-center justify-between text-sm"
                              >

                                <div
                                  className="flex items-center gap-2"
                                >

                                  <Users
                                    size={16}
                                    className={
                                      fund.team_requirement_met
                                        ? isDark
                                          ? "text-emerald-400"
                                          : "text-emerald-600"
                                        : isDark
                                          ? "text-gray-500"
                                          : "text-gray-400"
                                    }
                                  />


                                  <span
                                    className={
                                      isDark
                                        ? "text-gray-300"
                                        : "text-gray-700"
                                    }
                                  >
                                    Team Members
                                  </span>

                                </div>


                                <span
                                  className={
                                    fund.team_requirement_met
                                      ? isDark
                                        ? "text-emerald-400"
                                        : "text-emerald-600"
                                      : isDark
                                        ? "text-gray-400"
                                        : "text-gray-500"
                                  }
                                >
                                  {fund.team_members.toLocaleString()}
                                  {" / "}
                                  {fund.required_team_members.toLocaleString()}
                                </span>

                              </div>


                              <div
                                className={`h-2 overflow-hidden rounded-full ${isDark
                                  ? "bg-white/5"
                                  : "bg-gray-200"
                                  }`}
                              >

                                <div
                                  className={`h-full rounded-full transition-all ${fund.team_requirement_met
                                    ? "bg-emerald-500"
                                    : "bg-purple-500"
                                    }`}
                                  style={{
                                    width:
                                      `${teamProgress}%`,
                                  }}
                                />

                              </div>

                            </div>


                            {/* =================================
                              WALLET REQUIREMENT
                          ================================= */}

                            <div>

                              <div
                                className="mb-2 flex items-center justify-between text-sm"
                              >

                                <div
                                  className="flex items-center gap-2"
                                >

                                  <Wallet
                                    size={16}
                                    className={
                                      fund.wallet_maintenance_met
                                        ? isDark
                                          ? "text-emerald-400"
                                          : "text-emerald-600"
                                        : isDark
                                          ? "text-gray-500"
                                          : "text-gray-400"
                                    }
                                  />


                                  <span
                                    className={
                                      isDark
                                        ? "text-gray-300"
                                        : "text-gray-700"
                                    }
                                  >
                                    Wallet Maintenance
                                  </span>

                                </div>


                                <span
                                  className={
                                    fund.wallet_maintenance_met
                                      ? isDark
                                        ? "text-emerald-400"
                                        : "text-emerald-600"
                                      : isDark
                                        ? "text-gray-400"
                                        : "text-gray-500"
                                  }
                                >
                                  {formatMoney(
                                    fund.wallet_balance
                                  )}
                                  {" / "}
                                  {formatMoney(
                                    fund.required_wallet_balance
                                  )}
                                </span>

                              </div>


                              <div
                                className={`h-2 overflow-hidden rounded-full ${isDark
                                  ? "bg-white/5"
                                  : "bg-gray-200"
                                  }`}
                              >

                                <div
                                  className={`h-full rounded-full transition-all ${fund.wallet_maintenance_met
                                    ? "bg-emerald-500"
                                    : "bg-purple-500"
                                    }`}
                                  style={{
                                    width:
                                      `${walletProgress}%`,
                                  }}
                                />

                              </div>

                            </div>


                            {/* =================================
                              REQUIREMENT CHECKS
                          ================================= */}

                            <div
                              className="mt-6 grid grid-cols-2 gap-3"
                            >

                              <div
                                className={`rounded-xl border p-3 ${fund.team_requirement_met
                                  ? isDark
                                    ? "border-emerald-500/20 bg-emerald-500/10"
                                    : "border-emerald-200 bg-emerald-50"
                                  : isDark
                                    ? "border-white/10 bg-white/[0.03]"
                                    : "border-gray-200 bg-gray-50"
                                  }`}
                              >

                                <div
                                  className="flex items-center gap-2"
                                >

                                  {fund.team_requirement_met ? (

                                    <CheckCircle2
                                      size={16}
                                      className={
                                        isDark
                                          ? "text-emerald-400"
                                          : "text-emerald-600"
                                      }
                                    />

                                  ) : (

                                    <Clock
                                      size={16}
                                      className={
                                        isDark
                                          ? "text-gray-500"
                                          : "text-gray-400"
                                      }
                                    />

                                  )}


                                  <span
                                    className={`text-xs ${fund.team_requirement_met
                                      ? isDark
                                        ? "text-emerald-300"
                                        : "text-emerald-700"
                                      : isDark
                                        ? "text-gray-400"
                                        : "text-gray-500"
                                      }`}
                                  >
                                    Team Maintain
                                  </span>

                                </div>

                              </div>


                              <div
                                className={`rounded-xl border p-3 ${fund.wallet_maintenance_met
                                  ? isDark
                                    ? "border-emerald-500/20 bg-emerald-500/10"
                                    : "border-emerald-200 bg-emerald-50"
                                  : isDark
                                    ? "border-white/10 bg-white/[0.03]"
                                    : "border-gray-200 bg-gray-50"
                                  }`}
                              >

                                <div
                                  className="flex items-center gap-2"
                                >

                                  {fund.wallet_maintenance_met ? (

                                    <CheckCircle2
                                      size={16}
                                      className={
                                        isDark
                                          ? "text-emerald-400"
                                          : "text-emerald-600"
                                      }
                                    />

                                  ) : (

                                    <Clock
                                      size={16}
                                      className={
                                        isDark
                                          ? "text-gray-500"
                                          : "text-gray-400"
                                      }
                                    />

                                  )}


                                  <span
                                    className={`text-xs ${fund.wallet_maintenance_met
                                      ? isDark
                                        ? "text-emerald-300"
                                        : "text-emerald-700"
                                      : isDark
                                        ? "text-gray-400"
                                        : "text-gray-500"
                                      }`}
                                  >
                                    Wallet Maintain
                                  </span>

                                </div>

                              </div>

                            </div>


                            {/* =================================
                              STATUS MESSAGE
                          ================================= */}

                            <div
                              className={`mt-5 rounded-xl px-4 py-3 text-sm ${fund.paid_this_month
                                ? isDark
                                  ? "bg-blue-500/10 text-blue-300"
                                  : "bg-blue-50 text-blue-700"
                                : fund.is_eligible
                                  ? isDark
                                    ? "bg-emerald-500/10 text-emerald-300"
                                    : "bg-emerald-50 text-emerald-700"
                                  : isDark
                                    ? "bg-white/[0.03] text-gray-500"
                                    : "bg-gray-50 text-gray-500"
                                }`}
                            >

                              {fund.paid_this_month ? (

                                <div
                                  className="flex items-center gap-2"
                                >

                                  <CheckCircle2
                                    size={16}
                                  />

                                  <span>
                                    Monthly reward already
                                    paid for{" "}
                                    {getMonthName(
                                      data.payout_month
                                    )}.
                                  </span>

                                </div>


                              ) : fund.is_eligible ? (

                                <div
                                  className="flex items-center gap-2"
                                >

                                  <CheckCircle2
                                    size={16}
                                  />

                                  <span>
                                    Team and wallet
                                    requirements are
                                    maintained. Fund is
                                    eligible for monthly
                                    payout.
                                  </span>

                                </div>


                              ) : (

                                <div
                                  className="flex items-center gap-2"
                                >

                                  <Clock
                                    size={16}
                                  />

                                  <span>
                                    Maintain both team and
                                    wallet requirements to
                                    qualify for this monthly
                                    fund.
                                  </span>

                                </div>

                              )}

                            </div>


                            {/* =================================
                              PAYOUT INFORMATION
                          ================================= */}

                            <div
                              className="mt-5 grid grid-cols-2 gap-3"
                            >

                              <div
                                className={`rounded-xl border p-3 ${isDark
                                  ? "border-white/5 bg-black/20"
                                  : "border-gray-200 bg-gray-50"
                                  }`}
                              >

                                <p
                                  className={`text-[11px] ${isDark
                                    ? "text-gray-600"
                                    : "text-gray-400"
                                    }`}
                                >
                                  Last Payout
                                </p>


                                <p
                                  className={`mt-1 text-xs ${isDark
                                    ? "text-gray-400"
                                    : "text-gray-600"
                                    }`}
                                >
                                  {formatDate(
                                    fund.last_payout_date
                                  )}
                                </p>

                              </div>


                              <div
                                className={`rounded-xl border p-3 ${isDark
                                  ? "border-white/5 bg-black/20"
                                  : "border-gray-200 bg-gray-50"
                                  }`}
                              >

                                <p
                                  className={`text-[11px] ${isDark
                                    ? "text-gray-600"
                                    : "text-gray-400"
                                    }`}
                                >
                                  Total Paid
                                </p>


                                <p
                                  className={`mt-1 text-sm font-semibold ${isDark
                                    ? "text-gray-300"
                                    : "text-gray-800"
                                    }`}
                                >
                                  {formatMoney(
                                    fund.total_paid
                                  )}
                                </p>

                              </div>

                            </div>

                          </div>

                        );
                      }
                    )}

                  </div>

                </div>


                {/* =============================================
                  PAYOUT HISTORY
              ============================================= */}

                <div
                  className={`mt-8 overflow-hidden rounded-3xl border shadow-sm ${isDark
                    ? "border-white/10 bg-white/[0.035]"
                    : "border-gray-200 bg-white"
                    }`}
                >

                  <div
                    className={`flex items-center justify-between border-b p-5 sm:p-6 ${isDark
                      ? "border-white/10"
                      : "border-gray-200"
                      }`}
                  >

                    <div>

                      <div
                        className="flex items-center gap-2"
                      >

                        <History
                          size={20}
                          className={
                            isDark
                              ? "text-purple-400"
                              : "text-purple-600"
                          }
                        />


                        <h2
                          className={`text-xl font-bold ${isDark
                            ? "text-white"
                            : "text-gray-900"
                            }`}
                        >
                          Payout History
                        </h2>

                      </div>


                      <p
                        className={`mt-1 text-sm ${isDark
                          ? "text-gray-500"
                          : "text-gray-500"
                          }`}
                      >
                        Your credited Rank Achiever
                        monthly rewards.
                      </p>

                    </div>


                    <div
                      className="text-right"
                    >

                      <p
                        className={`text-xs ${isDark
                          ? "text-gray-500"
                          : "text-gray-400"
                          }`}
                      >
                        Total Paid
                      </p>


                      <p
                        className={`text-lg font-bold ${isDark
                          ? "text-emerald-400"
                          : "text-emerald-600"
                          }`}
                      >
                        {formatMoney(
                          history?.total_paid || 0
                        )}
                      </p>

                    </div>

                  </div>


                  {!history ||
                    history.history.length === 0 ? (

                    <div
                      className="p-10 text-center"
                    >

                      <div
                        className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full ${isDark
                          ? "bg-white/5"
                          : "bg-gray-100"
                          }`}
                      >

                        <History
                          size={24}
                          className={
                            isDark
                              ? "text-gray-500"
                              : "text-gray-400"
                          }
                        />

                      </div>


                      <p
                        className={`font-medium ${isDark
                          ? "text-gray-300"
                          : "text-gray-700"
                          }`}
                      >
                        No payouts yet
                      </p>


                      <p
                        className={`mt-1 text-sm ${isDark
                          ? "text-gray-500"
                          : "text-gray-500"
                          }`}
                      >
                        Your credited Rank Achiever
                        rewards will appear here.
                      </p>

                    </div>


                  ) : (

                    <div
                      className="overflow-x-auto"
                    >

                      <table
                        className="w-full min-w-[900px]"
                      >

                        <thead>

                          <tr
                            className={
                              isDark
                                ? "bg-black/20"
                                : "bg-gray-50"
                            }
                          >

                            <th className="px-5 py-4 text-left text-xs font-medium text-gray-500">
                              Fund
                            </th>

                            <th className="px-5 py-4 text-left text-xs font-medium text-gray-500">
                              Rank
                            </th>

                            <th className="px-5 py-4 text-left text-xs font-medium text-gray-500">
                              Team
                            </th>

                            <th className="px-5 py-4 text-left text-xs font-medium text-gray-500">
                              Wallet
                            </th>

                            <th className="px-5 py-4 text-left text-xs font-medium text-gray-500">
                              Month
                            </th>

                            <th className="px-5 py-4 text-left text-xs font-medium text-gray-500">
                              Amount
                            </th>

                            <th className="px-5 py-4 text-left text-xs font-medium text-gray-500">
                              Status
                            </th>

                          </tr>

                        </thead>


                        <tbody>

                          {history.history.map(
                            (item) => (

                              <tr
                                key={item.id}
                                className={`border-t ${isDark
                                  ? "border-white/5"
                                  : "border-gray-100"
                                  }`}
                              >

                                <td
                                  className={`px-5 py-4 text-sm font-medium ${isDark
                                    ? "text-gray-200"
                                    : "text-gray-800"
                                    }`}
                                >
                                  {item.fund_type}
                                </td>


                                <td
                                  className={`px-5 py-4 text-sm ${isDark
                                    ? "text-gray-400"
                                    : "text-gray-600"
                                    }`}
                                >
                                  {item.rank_name}
                                </td>


                                <td
                                  className={`px-5 py-4 text-sm ${isDark
                                    ? "text-gray-400"
                                    : "text-gray-600"
                                    }`}
                                >
                                  {item.team_members.toLocaleString()}
                                </td>


                                <td
                                  className={`px-5 py-4 text-sm ${isDark
                                    ? "text-gray-400"
                                    : "text-gray-600"
                                    }`}
                                >
                                  {formatMoney(
                                    item.wallet_balance
                                  )}
                                </td>


                                <td
                                  className={`px-5 py-4 text-sm ${isDark
                                    ? "text-gray-400"
                                    : "text-gray-600"
                                    }`}
                                >
                                  {getMonthName(
                                    item.payout_month
                                  )}{" "}
                                  {item.payout_year}
                                </td>


                                <td
                                  className={`px-5 py-4 text-sm font-semibold ${isDark
                                    ? "text-emerald-400"
                                    : "text-emerald-600"
                                    }`}
                                >
                                  {formatMoney(
                                    item.amount
                                  )}
                                </td>


                                <td
                                  className="px-5 py-4"
                                >

                                  <span
                                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${item.status ===
                                      "credited"
                                      ? isDark
                                        ? "bg-emerald-500/10 text-emerald-400"
                                        : "bg-emerald-50 text-emerald-700"
                                      : isDark
                                        ? "bg-gray-500/10 text-gray-400"
                                        : "bg-gray-100 text-gray-600"
                                      }`}
                                  >
                                    {item.status}
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


                {/* =============================================
                  INFO
              ============================================= */}

                <div
                  className={`mt-8 rounded-3xl border p-6 ${isDark
                    ? "border-purple-500/15 bg-purple-500/[0.04]"
                    : "border-purple-200 bg-purple-50"
                    }`}
                >

                  <div
                    className="flex gap-4"
                  >

                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${isDark
                        ? "bg-purple-500/10"
                        : "bg-purple-100"
                        }`}
                    >

                      <Trophy
                        size={21}
                        className={
                          isDark
                            ? "text-purple-400"
                            : "text-purple-600"
                        }
                      />

                    </div>


                    <div>

                      <h3
                        className={`font-semibold ${isDark
                          ? "text-white"
                          : "text-gray-900"
                          }`}
                      >
                        How Rank Achiever Funds Work
                      </h3>


                      <p
                        className={`mt-2 text-sm leading-6 ${isDark
                          ? "text-gray-500"
                          : "text-gray-600"
                          }`}
                      >
                        Rank Achiever Funds are based
                        on two live requirements:
                        maintaining the required team
                        size and maintaining the required
                        Income Wallet balance. When both
                        requirements are satisfied, the
                        respective fund becomes eligible
                        for its monthly reward. Each fund
                        can be credited only once for the
                        same payout month.
                      </p>

                    </div>

                  </div>

                </div>

              </div>

            ) : null}

          </main>

        </div>


        {/* =====================================================
          GRADIENT
      ===================================================== */}

        <style>
          {`
          .animated-gradient {
            background: linear-gradient(
              90deg,
              #60a5fa,
              #a78bfa,
              #f472b6,
              #60a5fa
            );

            background-size: 300% 300%;

            animation:
              gradientMove
              10s
              ease
              infinite;
          }

          @keyframes gradientMove {

            0% {
              background-position:
                0% 50%;
            }

            50% {
              background-position:
                100% 50%;
            }

            100% {
              background-position:
                0% 50%;
            }
          }
        `}
        </style>

      </div>
    </>
  );
}