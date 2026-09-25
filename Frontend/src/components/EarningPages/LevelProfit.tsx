import { useCallback, useEffect, useState } from "react";
import {
  Award,
  CheckCircle2,
  Lock,
  RefreshCw,
  TrendingUp,
  Users,
} from "lucide-react";


const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";


interface LevelSlab {
  levels: string;
  required_directs: number;
  unlocked: boolean;
  percentage: number;
  daily_cap: number;
  today_earned: number;
  remaining_cap: number;
}


interface LevelProfitSummary {
  success: boolean;

  direct_count: number;
  unlocked_up_to_level: number;

  today_total_level_profit: number;
  total_level_profit: number;

  level_1_2: LevelSlab;
  level_3_5: LevelSlab;
  level_6_8: LevelSlab;
  level_9_10: LevelSlab;
}


const formatMoney = (value: number | undefined) => {
  const amount = Number(value || 0);

  return `$${amount.toFixed(4)}`;
};


const LevelProfit = () => {
  const [data, setData] =
    useState<LevelProfitSummary | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState("");


  // =====================================================
  // FETCH LEVEL PROFIT
  // =====================================================

  const fetchLevelProfit = useCallback(
    async (manualRefresh = false) => {
      try {
        if (manualRefresh) {
          setRefreshing(true);
        }

        setError("");

        const token =
          localStorage.getItem("access_token");


        if (!token) {
          setError("Please sign in to view Level Profit.");
          return;
        }


        const response = await fetch(
          `${API_URL}/api/level-profit/summary`,
          {
            method: "GET",

            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );


        if (response.status === 401) {
          setError(
            "Your session has expired. Please sign in again."
          );

          return;
        }


        if (!response.ok) {
          const responseData =
            await response.json().catch(() => null);

          throw new Error(
            responseData?.detail ||
              "Unable to load Level Profit."
          );
        }


        const result: LevelProfitSummary =
          await response.json();

        setData(result);
      } catch (err) {
        console.error(
          "Level Profit error:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load Level Profit."
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    []
  );


  // =====================================================
  // INITIAL LOAD + AUTO REFRESH
  // =====================================================

  useEffect(() => {
    fetchLevelProfit();

    const interval = window.setInterval(
      () => {
        fetchLevelProfit();
      },
      30000
    );

    return () => {
      window.clearInterval(interval);
    };
  }, [fetchLevelProfit]);


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="w-full rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex min-h-[220px] items-center justify-center">
          <div className="text-center">
            <RefreshCw className="mx-auto h-7 w-7 animate-spin text-purple-600" />

            <p className="mt-3 text-sm text-gray-500">
              Loading Level Profit...
            </p>
          </div>
        </div>
      </div>
    );
  }


  // =====================================================
  // ERROR
  // =====================================================

  if (error || !data) {
    return (
      <div className="w-full rounded-2xl border border-red-100 bg-white p-6 shadow-sm">
        <div className="flex min-h-[180px] flex-col items-center justify-center text-center">
          <p className="text-sm font-medium text-red-600">
            {error || "Unable to load Level Profit."}
          </p>

          <button
            type="button"
            onClick={() => fetchLevelProfit(true)}
            className="mt-4 rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-purple-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }


  const slabs: LevelSlab[] = [
    data.level_1_2,
    data.level_3_5,
    data.level_6_8,
    data.level_9_10,
  ];


  return (
    <div className="w-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

      <div className="grid grid-cols-1 lg:grid-cols-2">

        {/* =================================================
            LEFT SIDE — LEVEL PROFIT INCOME
        ================================================= */}

        <div className="relative p-6 sm:p-7 lg:p-8">

          <div className="absolute right-0 top-0 h-28 w-28 rounded-bl-full bg-purple-50" />

          <div className="relative">

            {/* HEADER */}

            <div className="flex items-start justify-between gap-4">

              <div className="flex items-center gap-3">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-purple-600">
                    Level Profit
                  </p>

                  <h2 className="text-lg font-bold text-gray-900">
                    Level Profit Income
                  </h2>
                </div>

              </div>


              <button
                type="button"
                onClick={() =>
                  fetchLevelProfit(true)
                }
                disabled={refreshing}
                title="Refresh Level Profit"
                className="relative z-10 flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition hover:border-purple-200 hover:text-purple-600 disabled:opacity-50"
              >
                <RefreshCw
                  className={`h-4 w-4 ${
                    refreshing
                      ? "animate-spin"
                      : ""
                  }`}
                />
              </button>

            </div>


            {/* TOTAL INCOME */}

            <div className="mt-8">

              <p className="text-sm font-medium text-gray-500">
                Total Level Profit
              </p>

              <p className="mt-1 text-4xl font-bold tracking-tight text-gray-900">
                {formatMoney(
                  data.total_level_profit
                )}
              </p>

            </div>


            {/* TODAY */}

            <div className="mt-6 rounded-xl border border-purple-100 bg-purple-50 p-4">

              <div className="flex items-center justify-between gap-4">

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Today's Level Profit
                  </p>

                  <p className="mt-1 text-xl font-bold text-purple-700">
                    {formatMoney(
                      data.today_total_level_profit
                    )}
                  </p>
                </div>


                <Award className="h-8 w-8 text-purple-500" />

              </div>

            </div>


            {/* USER QUALIFICATION */}

            <div className="mt-6 grid grid-cols-2 gap-3">

              <div className="rounded-xl border border-gray-200 p-4">

                <div className="flex items-center gap-2 text-gray-500">
                  <Users className="h-4 w-4" />

                  <span className="text-xs font-medium">
                    Direct Referrals
                  </span>
                </div>

                <p className="mt-2 text-xl font-bold text-gray-900">
                  {data.direct_count}
                </p>

              </div>


              <div className="rounded-xl border border-gray-200 p-4">

                <div className="flex items-center gap-2 text-gray-500">
                  <Award className="h-4 w-4" />

                  <span className="text-xs font-medium">
                    Levels Unlocked
                  </span>
                </div>

                <p className="mt-2 text-xl font-bold text-gray-900">
                  {data.unlocked_up_to_level > 0
                    ? `1 - ${data.unlocked_up_to_level}`
                    : "Locked"}
                </p>

              </div>

            </div>

          </div>
        </div>


        {/* =================================================
            RIGHT SIDE — DESCRIPTION
        ================================================= */}

        <div className="border-t border-gray-200 bg-gray-50 p-6 sm:p-7 lg:border-l lg:border-t-0 lg:p-8">

          <div>

            <p className="text-xs font-semibold uppercase tracking-wider text-purple-600">
              Income Structure
            </p>

            <h3 className="mt-1 text-lg font-bold text-gray-900">
              Level Profit Description
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Earn Level Profit when eligible members
              in your referral network receive their
              Daily Compounding Growth after completing
              their daily ad activity.
            </p>

          </div>


          {/* LEVEL SLABS */}

          <div className="mt-6 space-y-3">

            {slabs.map((slab) => (
              <div
                key={slab.levels}
                className={`rounded-xl border p-4 transition ${
                  slab.unlocked
                    ? "border-purple-200 bg-white"
                    : "border-gray-200 bg-gray-100/70"
                }`}
              >

                <div className="flex items-center justify-between gap-3">

                  <div className="flex items-center gap-3">

                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                        slab.unlocked
                          ? "bg-purple-100 text-purple-600"
                          : "bg-gray-200 text-gray-400"
                      }`}
                    >
                      {slab.unlocked ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        <Lock className="h-4 w-4" />
                      )}
                    </div>


                    <div>
                      <p className="text-sm font-bold text-gray-900">
                        Level {slab.levels}
                      </p>

                      <p className="text-xs text-gray-500">
                        {slab.required_directs} Directs Required
                      </p>
                    </div>

                  </div>


                  <div className="text-right">

                    <p
                      className={`text-lg font-bold ${
                        slab.unlocked
                          ? "text-purple-600"
                          : "text-gray-400"
                      }`}
                    >
                      {slab.percentage}%
                    </p>

                    <p className="text-[11px] text-gray-500">
                      Max ${slab.daily_cap}/day
                    </p>

                  </div>

                </div>


                {/* UNLOCKED EARNING DETAILS */}

                {slab.unlocked && (
                  <div className="mt-3 grid grid-cols-2 gap-2 border-t border-gray-100 pt-3">

                    <div>
                      <p className="text-[11px] text-gray-500">
                        Today Earned
                      </p>

                      <p className="text-sm font-semibold text-gray-900">
                        {formatMoney(
                          slab.today_earned
                        )}
                      </p>
                    </div>


                    <div className="text-right">
                      <p className="text-[11px] text-gray-500">
                        Cap Remaining
                      </p>

                      <p className="text-sm font-semibold text-gray-900">
                        {formatMoney(
                          slab.remaining_cap
                        )}
                      </p>
                    </div>

                  </div>
                )}

              </div>
            ))}

          </div>


          {/* NOTE */}

          <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50 p-4">

            <p className="text-xs leading-5 text-blue-700">
              Level Profit is calculated from the
              downline member's actual credited Daily
              Compounding Growth. If no Daily
              Compounding Growth is credited, no Level
              Profit is generated from that activity.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
};


export default LevelProfit;