import { useEffect, useState } from "react";
import {
  Award,
  RefreshCw,
  Users,
  Wallet,
  TrendingUp,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

interface TeamRankBonusItem {
  id: number;
  source_user_id: number;
  source_customer_id: string;
  source_name: string;
  rank_name: string;
  package_amount: number;
  rank_pool_amount: number;
  rank_percentage: number;
  bonus_amount: number;
  status: string;
  created_at: string;
}

interface TeamRankBonusResponse {
  total_earned: number;
  count: number;
  bonuses: TeamRankBonusItem[];
}

const formatMoney = (value: number | string | null | undefined) => {
  const amount = Number(value ?? 0);

  return amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const formatRank = (rank: string) => {
  return rank
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const formatDate = (date: string) => {
  if (!date) return "-";

  return new Date(date).toLocaleString();
};

export default function TeamRankBonus() {
  const [data, setData] = useState<TeamRankBonusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTeamRankBonus = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("access_token");

      if (!token) {
        setError("Please sign in again.");
        return;
      }

      const response = await fetch(
        `${API_URL}/api/team-rank-bonus/me`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);

        throw new Error(
          errorData?.detail ||
            "Unable to load Team Rank Bonus."
        );
      }

      const result: TeamRankBonusResponse =
        await response.json();

      setData(result);
    } catch (err) {
      console.error("Team Rank Bonus error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load Team Rank Bonus."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamRankBonus();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07030f] p-6 text-white">
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <RefreshCw className="mx-auto mb-4 h-8 w-8 animate-spin text-purple-400" />
            <p className="text-gray-400">
              Loading Team Rank Bonus...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07030f] p-4 text-white md:p-6">
      <div className="mx-auto max-w-7xl">
        {/* HEADER */}
        <div className="mb-8">
          <p className="mb-2 text-sm font-medium uppercase tracking-[0.25em] text-purple-400">
            APH Income
          </p>

          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h1 className="text-3xl font-bold md:text-4xl">
                Team Rank Bonus
              </h1>

              <p className="mt-2 max-w-2xl text-sm text-gray-400">
                View Team Rank Bonus earnings generated
                from eligible new package activations in
                your referral upline network.
              </p>
            </div>

            <button
              onClick={fetchTeamRankBonus}
              className="flex items-center justify-center gap-2 rounded-xl border border-purple-500/30 bg-purple-500/10 px-4 py-2 text-sm text-purple-300 transition hover:bg-purple-500/20"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
            {error}
          </div>
        )}

        {/* SUMMARY CARDS */}
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-purple-500/20 bg-white/[0.04] p-5">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/15">
              <Wallet className="h-5 w-5 text-purple-400" />
            </div>

            <p className="text-sm text-gray-400">
              Total Team Rank Bonus
            </p>

            <h2 className="mt-1 text-2xl font-bold">
              ${formatMoney(data?.total_earned)}
            </h2>
          </div>

          <div className="rounded-2xl border border-purple-500/20 bg-white/[0.04] p-5">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/15">
              <Award className="h-5 w-5 text-purple-400" />
            </div>

            <p className="text-sm text-gray-400">
              Bonus Transactions
            </p>

            <h2 className="mt-1 text-2xl font-bold">
              {data?.count ?? 0}
            </h2>
          </div>

          <div className="rounded-2xl border border-purple-500/20 bg-white/[0.04] p-5">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/15">
              <TrendingUp className="h-5 w-5 text-purple-400" />
            </div>

            <p className="text-sm text-gray-400">
              Distribution Rule
            </p>

            <h2 className="mt-1 text-xl font-bold">
              15% × 30%
            </h2>

            <p className="mt-1 text-xs text-gray-500">
              Distributed by eligible rank weight
            </p>
          </div>
        </div>

        {/* RANK STRUCTURE */}
        <div className="mb-8 rounded-2xl border border-purple-500/20 bg-white/[0.04] p-5">
          <div className="mb-5 flex items-center gap-3">
            <Users className="h-5 w-5 text-purple-400" />

            <h2 className="text-lg font-semibold">
              Rank Distribution
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
            {[
              ["Ruby", "5"],
              ["Emerald", "5"],
              ["Sapphire", "5"],
              ["Topaz", "5"],
              ["Amethyst", "4"],
              ["Diamond", "3"],
              ["Crown Jewel", "3"],
            ].map(([rank, weight]) => (
              <div
                key={rank}
                className="rounded-xl border border-white/10 bg-black/20 p-3 text-center"
              >
                <p className="text-sm font-semibold">
                  {rank}
                </p>

                <p className="mt-1 text-xs text-purple-400">
                  {weight}/30
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* TRANSACTION TABLE */}
        <div className="overflow-hidden rounded-2xl border border-purple-500/20 bg-white/[0.04]">
          <div className="border-b border-white/10 p-5">
            <h2 className="text-lg font-semibold">
              Team Rank Bonus History
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Your credited Team Rank Bonus transactions.
            </p>
          </div>

          {!data?.bonuses?.length ? (
            <div className="p-12 text-center">
              <Award className="mx-auto mb-4 h-10 w-10 text-gray-600" />

              <p className="font-medium text-gray-300">
                No Team Rank Bonus yet
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Eligible bonus transactions will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px]">
                <thead>
                  <tr className="border-b border-white/10 bg-black/20 text-left text-xs uppercase tracking-wider text-gray-500">
                    <th className="px-5 py-4">#</th>
                    <th className="px-5 py-4">
                      Source User
                    </th>
                    <th className="px-5 py-4">Rank</th>
                    <th className="px-5 py-4">
                      Package
                    </th>
                    <th className="px-5 py-4">
                      Distribution Pool
                    </th>
                    <th className="px-5 py-4">
                      Weight
                    </th>
                    <th className="px-5 py-4">
                      Bonus
                    </th>
                    <th className="px-5 py-4">
                      Status
                    </th>
                    <th className="px-5 py-4">Date</th>
                  </tr>
                </thead>

                <tbody>
                  {data.bonuses.map((bonus, index) => (
                    <tr
                      key={bonus.id}
                      className="border-b border-white/5 text-sm transition hover:bg-white/[0.03]"
                    >
                      <td className="px-5 py-4 text-gray-500">
                        {index + 1}
                      </td>

                      <td className="px-5 py-4">
                        <p className="font-medium">
                          {bonus.source_name || "-"}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          {bonus.source_customer_id}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <span className="rounded-full bg-purple-500/10 px-3 py-1 text-xs font-medium text-purple-300">
                          {formatRank(bonus.rank_name)}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        ${formatMoney(bonus.package_amount)}
                      </td>

                      <td className="px-5 py-4">
                        ${formatMoney(bonus.rank_pool_amount)}
                      </td>

                      <td className="px-5 py-4">
                        {formatMoney(
                          bonus.rank_percentage
                        )}
                        /30
                      </td>

                      <td className="px-5 py-4 font-semibold text-green-400">
                        +$
                        {formatMoney(bonus.bonus_amount)}
                      </td>

                      <td className="px-5 py-4">
                        <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs text-green-400">
                          {bonus.status}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-gray-400">
                        {formatDate(bonus.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}