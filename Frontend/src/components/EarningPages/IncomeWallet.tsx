import {
  useCallback,
  useEffect,
  useState,
} from "react";

import UserNavbar from "../UserDashboard/UserNavbar";


// ======================================================
// API
// ======================================================

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:8000";


// ======================================================
// TYPES
// ======================================================

interface IncomeWalletData {
  balance: number;
  total_earned: number;
  total_withdrawn: number;
}


interface WalletTransactionItem {
  id: number;
  income_type: string;
  amount: string | number;
  balance_before?: string | number;
  balance_after?: string | number;
  reference_type?: string | null;
  reference_id?: number | null;
  description?: string | null;
  status: string;
  created_at: string;
}


interface WalletIncomeSummary {
  success: boolean;

  daily_compounding: number;
  level_profit: number;

  rank_bonus: number;
  rank_hierarchy: number;

  team_rank_bonus: number;
  royalty: number;

  rank_achiever: number;

  total_income?: number;
}


// ======================================================
// REFERRAL
// ======================================================

interface ReferralSummaryData {
  total_referral_income: number;

  first_subscription_income: number;
  upgrade_income: number;

  total_referral_transactions: number;
}


interface ReferralHistoryItem {
  id: number;

  source_user_id: number;

  source_customer_id: string;
  source_name: string;

  income_type: string;

  base_amount: string | number;
  percentage: string | number;

  referral_amount: string | number;

  status: string;
  created_at: string;
}


interface ReferralHistoryResponse {
  success: boolean;

  total_referral_income:
    string | number;

  count: number;

  items: ReferralHistoryItem[];
}


// ======================================================
// LEVEL PROFIT
// ======================================================

interface LevelProfitSummaryData {
  success: boolean;

  direct_count: number;
  unlocked_up_to_level: number;

  today_total_level_profit: number;
  total_level_profit: number;
}


interface LevelProfitHistoryItem {
  id: number;

  source_user_id: number;

  source_customer_id?:
    string | null;

  source_referral_id?:
    string | null;

  source_user_name?:
    string | null;

  level: number;

  beneficiary_direct_count: number;

  source_growth_amount:
    string | number;

  percentage:
    string | number;

  calculated_amount:
    string | number;

  credited_amount:
    string | number;

  daily_cap:
    string | number;

  daily_earned_before:
    string | number;

  daily_earned_after:
    string | number;

  business_date: string;

  status: string;

  created_at: string;
}


interface LevelProfitHistoryResponse {
  success: boolean;

  total: number;

  history:
    LevelProfitHistoryItem[];
}


// ======================================================
// RANK BONUS
// ======================================================

interface RankHistoryItem {
  rank_name: string;

  display_name: string;

  status: string;

  achieved_at?:
    string | null;

  superseded_at?:
    string | null;

  instant_bonus?: number;

  instant_bonus_credited?:
    boolean;

  instant_bonus_received?:
    number;

  wallet_maintain?: number;

  hierarchy_cap?: number;
}


interface RankStatusResponse {
  current_rank?:
    string | null;

  current_rank_display?:
    string | null;

  rank_history?:
    RankHistoryItem[];
}


// ======================================================
// TEAM RANK BONUS
// ======================================================

interface TeamRankBonusItem {
  id: number;

  source_user_id: number;

  source_customer_id?:
    string | null;

  source_name?:
    string | null;

  rank_name: string;

  package_amount:
    string | number;

  rank_pool_amount:
    string | number;

  rank_percentage:
    string | number;

  bonus_amount:
    string | number;

  status: string;

  created_at: string;
}


interface TeamRankBonusResponse {
  total_earned:
    string | number;

  count: number;

  bonuses:
    TeamRankBonusItem[];
}


// ======================================================
// ROYALTY POOL
// ======================================================

interface RoyaltyHistoryItem {
  id: number;

  slab_threshold: number;

  daily_per_leg:
    string | number;

  slab_total_cap:
    string | number;

  power_leg_user_id:
    number | null;

  power_leg_member_count: number;

  qualifying_leg_count: number;

  non_power_leg_count: number;

  calculated_daily_amount:
    string | number;

  royalty_amount:
    string | number;

  cap_earned_before:
    string | number;

  cap_earned_after:
    string | number;

  status: string;

  payout_date: string;

  created_at: string;
}


interface RoyaltyHistoryResponse {
  total_earned:
    string | number;

  count: number;

  history:
    RoyaltyHistoryItem[];
}


// ======================================================
// RANK ACHIEVER
// ======================================================

interface RankAchieverHistoryItem {
  id: number;

  rank_name: string;

  fund_type: string;

  team_members: number;

  required_team_members: number;

  wallet_balance:
    string | number;

  required_wallet_balance:
    string | number;

  amount:
    string | number;

  payout_year: number;

  payout_month: number;

  payout_date: string;

  status: string;

  created_at: string;
}


interface RankAchieverHistoryResponse {
  success: boolean;

  total_paid:
    string | number;

  count: number;

  history:
    RankAchieverHistoryItem[];
}


// ======================================================
// UNIFIED ACTIVITY
// ======================================================

interface IncomeActivityItem {
  key: string;

  source:
    | "Referral"
    | "Daily Ads Income"
    | "Level Profit"
    | "Rank Bonus"
<<<<<<< HEAD
    | "Rank Hierarchy"
=======
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
    | "Team Rank Bonus"
    | "Royalty"
    | "Rank Achiever";

  userName: string;

  customerId: string;

  type: string;

  baseAmount: number;

  percentage: number;

  amount: number;

  status: string;

  createdAt: string;

  level?: number;

  detail?: string;
}


// ======================================================
// COMPONENT
// ======================================================

export default function IncomeWallet() {

  // ====================================================
  // WALLET
  // ====================================================

  const [
    wallet,
    setWallet,
  ] =
    useState<IncomeWalletData | null>(
      null
    );


  const [
    walletIncomeSummary,
    setWalletIncomeSummary,
  ] =
    useState<WalletIncomeSummary>({
      success: true,

      daily_compounding: 0,

      level_profit: 0,

      rank_bonus: 0,

      rank_hierarchy: 0,

      team_rank_bonus: 0,

      royalty: 0,

      rank_achiever: 0,

      total_income: 0,
    });


  // ====================================================
  // WALLET TRANSACTION HISTORY
  // ====================================================

  const [
    walletTransactions,
    setWalletTransactions,
  ] =
    useState<WalletTransactionItem[]>(
      []
    );


  // ====================================================
  // REFERRAL
  // ====================================================

  const [
    referralSummary,
    setReferralSummary,
  ] =
    useState<ReferralSummaryData>({
      total_referral_income: 0,

      first_subscription_income: 0,

      upgrade_income: 0,

      total_referral_transactions: 0,
    });


  const [
    referralHistory,
    setReferralHistory,
  ] =
    useState<ReferralHistoryItem[]>(
      []
    );


  // ====================================================
  // LEVEL PROFIT
  // ====================================================

  const [
    levelProfitSummary,
    setLevelProfitSummary,
  ] =
    useState<LevelProfitSummaryData>({
      success: true,

      direct_count: 0,

      unlocked_up_to_level: 0,

      today_total_level_profit: 0,

      total_level_profit: 0,
    });


  const [
    levelProfitHistory,
    setLevelProfitHistory,
  ] =
    useState<LevelProfitHistoryItem[]>(
      []
    );


  // ====================================================
  // RANK
  // ====================================================

  const [
    rankStatus,
    setRankStatus,
  ] =
    useState<RankStatusResponse>({
      current_rank: null,

      current_rank_display: null,

      rank_history: [],
    });


  // ====================================================
  // TEAM RANK BONUS
  // ====================================================

  const [
    teamRankBonusHistory,
    setTeamRankBonusHistory,
  ] =
    useState<TeamRankBonusItem[]>(
      []
    );


  // ====================================================
  // ROYALTY
  // ====================================================

  const [
    royaltyHistory,
    setRoyaltyHistory,
  ] =
    useState<RoyaltyHistoryItem[]>(
      []
    );


  // ====================================================
  // RANK ACHIEVER
  // ====================================================

  const [
    rankAchieverHistory,
    setRankAchieverHistory,
  ] =
    useState<RankAchieverHistoryItem[]>(
      []
    );


  const [
    rankAchieverTotalPaid,
    setRankAchieverTotalPaid,
  ] =
    useState(0);


  // ====================================================
  // UI
  // ====================================================

  const [
    loading,
    setLoading,
  ] =
    useState(true);


  const [
    refreshing,
    setRefreshing,
  ] =
    useState(false);


  const [
    error,
    setError,
  ] =
    useState("");


  // ====================================================
  // NUMBER
  // ====================================================

  const toNumber = (
    value:
      | string
      | number
      | null
      | undefined
  ) => {

    const number =
      Number(value || 0);

    return Number.isFinite(number)
      ? number
      : 0;
  };


  // ====================================================
  // LOAD WALLET
  // ====================================================

  const loadIncomeWallet =
    useCallback(
      async (
        manualRefresh = false
      ) => {

        try {

          if (manualRefresh) {

            setRefreshing(true);

          } else {

            setLoading(true);
          }


          setError("");


          const token =
            localStorage.getItem(
              "access_token"
            ) ||
            localStorage.getItem(
              "token"
            );


          if (!token) {

            setError(
              "Please sign in again."
            );

            return;
          }


          const headers = {

            Authorization:
              `Bearer ${token}`,

            "Content-Type":
              "application/json",
          };


          // ==============================================
          // LOAD ALL IMPLEMENTED INCOME MODULES
          // ==============================================

          const [
            walletResponse,

            walletIncomeSummaryResponse,

            walletTransactionsResponse,

            referralSummaryResponse,

            referralHistoryResponse,

            levelSummaryResponse,

            levelHistoryResponse,

            rankStatusResponse,

            teamRankBonusResponse,

            royaltyHistoryResponse,

            rankAchieverHistoryResponse,
          ] =
            await Promise.all([

              fetch(
                `${API_URL}/api/income-wallet`,
                {
                  method: "GET",
                  headers,
                }
              ),


              fetch(
                `${API_URL}/api/income-wallet/summary`,
                {
                  method: "GET",
                  headers,
                }
              ),


              fetch(
                `${API_URL}/api/income-wallet/transactions`,
                {
                  method: "GET",
                  headers,
                }
              ),


              fetch(
                `${API_URL}/api/referral/summary`,
                {
                  method: "GET",
                  headers,
                }
              ),


              fetch(
                `${API_URL}/api/referral/history`,
                {
                  method: "GET",
                  headers,
                }
              ),


              fetch(
                `${API_URL}/api/level-profit/summary`,
                {
                  method: "GET",
                  headers,
                }
              ),


              fetch(
                `${API_URL}/api/level-profit/history`,
                {
                  method: "GET",
                  headers,
                }
              ),


              fetch(
                `${API_URL}/api/rank/status`,
                {
                  method: "GET",
                  headers,
                }
              ),


              fetch(
                `${API_URL}/api/team-rank-bonus/me`,
                {
                  method: "GET",
                  headers,
                }
              ),


              fetch(
                `${API_URL}/api/royalty-pool/history`,
                {
                  method: "GET",
                  headers,
                }
              ),


              fetch(
                `${API_URL}/api/rank-achiever/history`,
                {
                  method: "GET",
                  headers,
                }
              ),
            ]);


          // ==============================================
          // AUTH CHECK
          // ==============================================

          const responses = [

            walletResponse,

            walletIncomeSummaryResponse,

            walletTransactionsResponse,

            referralSummaryResponse,

            referralHistoryResponse,

            levelSummaryResponse,

            levelHistoryResponse,

            rankStatusResponse,

            teamRankBonusResponse,

            royaltyHistoryResponse,

            rankAchieverHistoryResponse,
          ];


          if (
            responses.some(
              (response) =>
                response.status === 401
            )
          ) {

            localStorage.removeItem(
              "access_token"
            );

            localStorage.removeItem(
              "token"
            );

            localStorage.removeItem(
              "refresh_token"
            );

            localStorage.removeItem(
              "user"
            );


            setError(
              "Your login session has expired. Please sign in again."
            );

            return;
          }


          // ==============================================
          // JSON
          // ==============================================

          const walletData =
            await walletResponse.json();


          const walletSummaryData =
            await walletIncomeSummaryResponse.json();


          const walletTransactionsData =
            await walletTransactionsResponse.json();


          const referralData =
            await referralSummaryResponse.json();


          const historyData:
            ReferralHistoryResponse =
            await referralHistoryResponse.json();


          const levelData:
            LevelProfitSummaryData =
            await levelSummaryResponse.json();


          const levelHistoryData:
            LevelProfitHistoryResponse =
            await levelHistoryResponse.json();


          const rankData:
            RankStatusResponse =
            await rankStatusResponse.json();


          const teamRankData:
            TeamRankBonusResponse =
            await teamRankBonusResponse.json();


          const royaltyData:
            RoyaltyHistoryResponse =
            await royaltyHistoryResponse.json();


          const rankAchieverData:
            RankAchieverHistoryResponse =
            await rankAchieverHistoryResponse.json();


          // ==============================================
          // ERROR CHECK
          // ==============================================

          if (!walletResponse.ok) {

            throw new Error(
              walletData?.detail ||
              "Failed to load income wallet."
            );
          }


          if (
            !walletIncomeSummaryResponse.ok
          ) {

            throw new Error(
              walletSummaryData?.detail ||
              "Failed to load wallet income summary."
            );
          }


          if (
            !walletTransactionsResponse.ok
          ) {

            throw new Error(
              walletTransactionsData?.detail ||
              "Failed to load wallet transaction history."
            );
          }


          if (
            !referralSummaryResponse.ok
          ) {

            throw new Error(
              referralData?.detail ||
              "Failed to load referral income."
            );
          }


          if (
            !referralHistoryResponse.ok
          ) {

            throw new Error(
              (historyData as any)
                ?.detail ||
              "Failed to load referral history."
            );
          }


          if (
            !levelSummaryResponse.ok
          ) {

            throw new Error(
              (levelData as any)
                ?.detail ||
              "Failed to load Level Profit."
            );
          }


          if (
            !levelHistoryResponse.ok
          ) {

            throw new Error(
              (levelHistoryData as any)
                ?.detail ||
              "Failed to load Level Profit history."
            );
          }


          if (!rankStatusResponse.ok) {

            throw new Error(
              (rankData as any)
                ?.detail ||
              "Failed to load rank status."
            );
          }


          if (!teamRankBonusResponse.ok) {

            throw new Error(
              (teamRankData as any)
                ?.detail ||
              "Failed to load Team Rank Bonus."
            );
          }


          if (!royaltyHistoryResponse.ok) {

            throw new Error(
              (royaltyData as any)
                ?.detail ||
              "Failed to load Royalty history."
            );
          }


          if (!rankAchieverHistoryResponse.ok) {

            throw new Error(
              (rankAchieverData as any)
                ?.detail ||
              "Failed to load Rank Achiever history."
            );
          }


          // ==============================================
          // WALLET
          // ==============================================

          setWallet({

            balance:
              toNumber(
                walletData.balance
              ),

            total_earned:
              toNumber(
                walletData.total_earned
              ),

            total_withdrawn:
              toNumber(
                walletData.total_withdrawn
              ),
          });


          // ==============================================
          // WALLET INCOME SUMMARY
          // ==============================================

          setWalletIncomeSummary({

            success:
              Boolean(
                walletSummaryData
                  ?.success
              ),

            daily_compounding:
              toNumber(
                walletSummaryData
                  ?.daily_compounding
              ),

            level_profit:
              toNumber(
                walletSummaryData
                  ?.level_profit
              ),

            rank_bonus:
              toNumber(
                walletSummaryData
                  ?.rank_bonus
              ),

            rank_hierarchy:
              toNumber(
                walletSummaryData
                  ?.rank_hierarchy
              ),

            team_rank_bonus:
              toNumber(
                walletSummaryData
                  ?.team_rank_bonus
              ),

            royalty:
              toNumber(
                walletSummaryData
                  ?.royalty
              ),

            rank_achiever:
              toNumber(
                walletSummaryData
                  ?.rank_achiever
              ),

            total_income:
              toNumber(
                walletSummaryData
                  ?.total_income
              ),
          });


          // ==============================================
          // WALLET TRANSACTION HISTORY
          // ==============================================

          setWalletTransactions(
            Array.isArray(walletTransactionsData)
              ? walletTransactionsData
              : Array.isArray(walletTransactionsData?.transactions)
                ? walletTransactionsData.transactions
                : Array.isArray(walletTransactionsData?.items)
                  ? walletTransactionsData.items
                  : Array.isArray(walletTransactionsData?.history)
                    ? walletTransactionsData.history
                    : []
          );


          // ==============================================
          // REFERRAL
          // ==============================================

          setReferralSummary({

            total_referral_income:
              toNumber(
                referralData
                  .total_referral_income
              ),

            first_subscription_income:
              toNumber(
                referralData
                  .first_subscription_income
              ),

            upgrade_income:
              toNumber(
                referralData
                  .upgrade_income
              ),

            total_referral_transactions:
              Number(
                referralData
                  .total_referral_transactions ||
                0
              ),
          });


          setReferralHistory(

            Array.isArray(
              historyData?.items
            )

              ? historyData.items

              : []
          );


          // ==============================================
          // LEVEL PROFIT
          // ==============================================

          setLevelProfitSummary({

            success:
              Boolean(
                levelData?.success
              ),

            direct_count:
              Number(
                levelData
                  ?.direct_count ||
                0
              ),

            unlocked_up_to_level:
              Number(
                levelData
                  ?.unlocked_up_to_level ||
                0
              ),

            today_total_level_profit:
              toNumber(
                levelData
                  ?.today_total_level_profit
              ),

            total_level_profit:
              toNumber(
                levelData
                  ?.total_level_profit
              ),
          });


          setLevelProfitHistory(

            Array.isArray(
              levelHistoryData
                ?.history
            )

              ? levelHistoryData.history

              : []
          );


          // ==============================================
          // RANK
          // ==============================================

          setRankStatus({

            current_rank:
              rankData
                ?.current_rank ||
              null,

            current_rank_display:
              rankData
                ?.current_rank_display ||
              null,

            rank_history:
              Array.isArray(
                rankData
                  ?.rank_history
              )

                ? rankData.rank_history

                : [],
          });


          // ==============================================
          // TEAM RANK BONUS
          // ==============================================

          setTeamRankBonusHistory(

            Array.isArray(
              teamRankData?.bonuses
            )

              ? teamRankData.bonuses

              : []
          );


          // ==============================================
          // ROYALTY
          // ==============================================

          setRoyaltyHistory(

            Array.isArray(
              royaltyData?.history
            )

              ? royaltyData.history

              : []
          );


          // ==============================================
          // RANK ACHIEVER
          // ==============================================

          setRankAchieverHistory(

            Array.isArray(
              rankAchieverData
                ?.history
            )

              ? rankAchieverData.history

              : []
          );


          setRankAchieverTotalPaid(

            toNumber(
              rankAchieverData
                ?.total_paid
            )
          );


        } catch (err: any) {

          console.error(
            "Income wallet error:",
            err
          );


          setError(
            err?.message ||
            "Failed to load income wallet."
          );


        } finally {

          setLoading(false);

          setRefreshing(false);
        }
      },
      []
    );


  // ====================================================
  // INITIAL LOAD + AUTO REFRESH
  // ====================================================

  useEffect(() => {

    loadIncomeWallet();


    const interval =
      window.setInterval(
        () => {

          loadIncomeWallet();

        },
        30000
      );


    return () => {

      window.clearInterval(
        interval
      );
    };

  }, [loadIncomeWallet]);


  // ====================================================
  // DATE FORMAT
  // ====================================================

  const formatDate = (
    date: string
  ) => {

    if (!date) {
      return "--";
    }


    const parsed =
      new Date(date);


    if (
      Number.isNaN(
        parsed.getTime()
      )
    ) {

      return "--";
    }


    return new Intl.DateTimeFormat(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",

        hour: "2-digit",
        minute: "2-digit",
      }
    ).format(parsed);
  };


  // ====================================================
  // INCOME TYPE
  // ====================================================

  const formatIncomeType = (
    type: string
  ) => {

    if (
      type ===
      "first_subscription"
    ) {

      return "First Subscription";
    }


    if (
      type ===
      "upgrade"
    ) {

      return "Subscription Upgrade";
    }


    if (
      type ===
      "daily_compounding"
    ) {

      return "Daily Ads Income";
    }


    if (
      type ===
      "level_profit"
    ) {

      return "Level Profit";
    }


    if (
      type ===
      "rank_bonus"
    ) {

      return "Instant Rank Bonus";
    }


    if (
      type ===
      "rank_hierarchy"
    ) {

      return "Rank Hierarchy";
    }


    if (
      type ===
      "team_rank_bonus"
    ) {

      return "Team Rank Bonus";
    }


    if (
      type ===
      "royalty"
    ) {

      return "Royalty Pool";
    }


    if (
      type ===
      "rank_achiever"
    ) {

      return "Rank Achiever";
    }


    return (
      type
        ?.replaceAll("_", " ")
        ?.replace(
          /\b\w/g,
          (letter) =>
            letter.toUpperCase()
        ) ||
      "--"
    );
  };


  // ====================================================
  // RANK NAME
  // ====================================================

  const formatRankName = (
    rankName: string
  ) => {

    return (
      rankName
        ?.replaceAll("_", " ")
        ?.replace(
          /\b\w/g,
          (letter) =>
            letter.toUpperCase()
        ) ||
      "--"
    );
  };


  // ====================================================
  // SAFE NUMBER FORMAT
  // ====================================================

  function formatNumberSafe(
    value:
      | string
      | number
      | null
      | undefined
  ) {

    return toNumber(
      value
    ).toLocaleString();
  }


  // ====================================================
  // MONTH NAME
  // ====================================================

  const formatMonthYear = (
    month: number,
    year: number
  ) => {

    if (
      month < 1 ||
      month > 12
    ) {

      return `${year}`;
    }


    const monthName =
      new Date(
        year,
        month - 1,
        1
      ).toLocaleString(
        "en-US",
        {
          month: "short",
        }
      );


    return `${monthName} ${year}`;
  };


  // ====================================================
  // LOADING
  // ====================================================

  if (loading) {

    return (
      <>
        <UserNavbar />

        <div className="min-h-screen bg-slate-50">

          <div className="flex min-h-[500px] items-center justify-center">

            <div className="text-center">

              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-purple-200 border-t-purple-600" />

              <div className="mt-4 text-sm font-medium text-purple-600">

                Loading income wallet...

              </div>

            </div>

          </div>

        </div>
      </>
    );
  }


  // ====================================================
  // ERROR
  // ====================================================

  if (error) {

    return (
      <>
        <UserNavbar />

        <div className="min-h-screen bg-slate-50 p-6 pt-28">

          <div className="mx-auto max-w-3xl rounded-2xl border border-red-200 bg-red-50 px-5 py-5 text-center text-sm text-red-600">

            {error}

            <div>

              <button
                type="button"
                onClick={() =>
                  loadIncomeWallet()
                }
                className="mt-4 rounded-xl bg-red-100 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-200"
              >

                Try Again

              </button>

            </div>

          </div>

        </div>
      </>
    );
  }


  // ====================================================
  // REAL INCOME VALUES
  // ====================================================

  const referralIncome =
    referralSummary
      .total_referral_income;


  const firstSubscriptionIncome =
    referralSummary
      .first_subscription_income;


  const upgradeIncome =
    referralSummary
      .upgrade_income;


  const dailyCompoundingIncome =
    walletIncomeSummary
      .daily_compounding;


  const levelIncome =
    walletIncomeSummary
      .level_profit;


  const todayLevelIncome =
    levelProfitSummary
      .today_total_level_profit;


  const rankBonusIncome =
    walletIncomeSummary
      .rank_bonus;


  const rankHierarchyIncome =
    walletIncomeSummary
      .rank_hierarchy;


  const teamRankBonusIncome =
    walletIncomeSummary
      .team_rank_bonus;


  const royaltyIncome =
    walletIncomeSummary
      .royalty;


  const rankAchieverIncome =
    walletIncomeSummary
      .rank_achiever;


  const currentRank =
    rankStatus
      .current_rank_display ||
    rankStatus
      .current_rank ||
    "No Rank";


  const receivedRankBonuses =
    (
      rankStatus
        .rank_history ||
      []
    ).filter(
      (rank) =>
        Boolean(
          rank
            .instant_bonus_credited
        )
    );


  // ====================================================
  // UNIFIED RECENT ACTIVITY
  // ====================================================

  const dailyCompoundingActivities:
    IncomeActivityItem[] =
    walletTransactions
      .filter(
        (item) =>
          item.income_type ===
          "daily_compounding"
      )
      .map(
        (item) => ({

          key:
            `daily-compounding-${item.id}`,

          source:
            "Daily Ads Income",

          userName:
            item.description ||
            "Ads Watch Income",

          customerId:
            "--",

          type:
            formatIncomeType(
              item.income_type
            ),

          baseAmount:
            toNumber(
              item.balance_before
            ),

          percentage: 0,

          amount:
            toNumber(
              item.amount
            ),

          status:
            item.status,

          createdAt:
            item.created_at,

          detail:
            item.description ||
            "Daily Ads Watch credit",
        })
      );


  const referralActivities:
    IncomeActivityItem[] =
    referralHistory.map(
      (item) => ({

        key:
          `referral-${item.id}`,

        source:
          "Referral",

        userName:
          item.source_name ||
          "--",

        customerId:
          item.source_customer_id ||
          "--",

        type:
          formatIncomeType(
            item.income_type
          ),

        baseAmount:
          toNumber(
            item.base_amount
          ),

        percentage:
          toNumber(
            item.percentage
          ),

        amount:
          toNumber(
            item.referral_amount
          ),

        status:
          item.status,

        createdAt:
          item.created_at,
      })
    );


  const levelActivities:
    IncomeActivityItem[] =
    levelProfitHistory.map(
      (item) => ({

        key:
          `level-${item.id}`,

        source:
          "Level Profit",

        userName:
          item.source_user_name ||
          "--",

        customerId:
          item.source_customer_id ||
          item.source_referral_id ||
          "--",

        type:
          `Level ${item.level} Profit`,

        baseAmount:
          toNumber(
            item.source_growth_amount
          ),

        percentage:
          toNumber(
            item.percentage
          ),

        amount:
          toNumber(
            item.credited_amount
          ),

        status:
          item.status,

        createdAt:
          item.created_at,

        level:
          item.level,
      })
    );


  const rankBonusActivities:
    IncomeActivityItem[] =
    receivedRankBonuses.map(
      (rank, index) => ({

        key:
          `rank-bonus-${rank.rank_name}-${index}`,

        source:
          "Rank Bonus",

        userName:
          currentRank,

        customerId:
          "--",

        type:
          `${rank.display_name} Instant Bonus`,

        baseAmount:
          toNumber(
            rank.wallet_maintain
          ),

        percentage: 0,

        amount:
          toNumber(
            rank.instant_bonus_received ||
            rank.instant_bonus
          ),

        status:
          "credited",

        createdAt:
          rank.achieved_at ||
          "",
      })
    );


<<<<<<< HEAD
  const rankHierarchyActivities:
    IncomeActivityItem[] =
    walletTransactions
      .filter(
        (item) =>
          item.income_type ===
          "rank_hierarchy"
      )
      .map(
        (item) => ({
          key: `rank-hierarchy-${item.id}`,
          source: "Rank Hierarchy",
          userName: currentRank,
          customerId: "--",
          type: formatIncomeType(item.income_type),
          baseAmount: toNumber(item.balance_before),
          percentage: 0.5,
          amount: toNumber(item.amount),
          status: item.status,
          createdAt: item.created_at,
          detail:
            item.description ||
            "Rank Hierarchy 0.50% daily income",
        })
      );


=======
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
  const teamRankBonusActivities:
    IncomeActivityItem[] =
    teamRankBonusHistory.map(
      (item) => ({

        key:
          `team-rank-${item.id}`,

        source:
          "Team Rank Bonus",

        userName:
          item.source_name ||
          "--",

        customerId:
          item.source_customer_id ||
          "--",

        type:
          `Team Rank Bonus - ${formatRankName(
            item.rank_name
          )}`,

        baseAmount:
          toNumber(
            item.rank_pool_amount
          ),

        percentage:
          toNumber(
            item.rank_percentage
          ),

        amount:
          toNumber(
            item.bonus_amount
          ),

        status:
          item.status,

        createdAt:
          item.created_at,
      })
    );


  const royaltyActivities:
    IncomeActivityItem[] =
    royaltyHistory.map(
      (item) => ({

        key:
          `royalty-${item.id}`,

        source:
          "Royalty",

        userName:
          "Royalty Pool",

        customerId:
          "--",

        type:
          `${formatNumberSafe(
            item.slab_threshold
          )}+ Matching Slab`,

        baseAmount:
          toNumber(
            item.calculated_daily_amount
          ),

        percentage: 0,

        amount:
          toNumber(
            item.royalty_amount
          ),

        status:
          item.status,

        createdAt:
          item.created_at,

        detail:
          `${item.qualifying_leg_count} qualifying legs × $${toNumber(
            item.daily_per_leg
          ).toFixed(2)}`,
      })
    );


  // ====================================================
  // RANK ACHIEVER ACTIVITY
  // ====================================================

  const rankAchieverActivities:
    IncomeActivityItem[] =
    rankAchieverHistory.map(
      (item) => ({

        key:
          `rank-achiever-${item.id}`,

        source:
          "Rank Achiever",

        userName:
          item.fund_type ||
          "Rank Achiever Fund",

        customerId:
          "--",

        type:
          `${item.rank_name} - ${item.fund_type}`,

        baseAmount:
          toNumber(
            item.wallet_balance
          ),

        percentage: 0,

        amount:
          toNumber(
            item.amount
          ),

        status:
          item.status,

        createdAt:
          item.created_at,

        detail:
          `${item.team_members.toLocaleString()} team members • ${formatMonthYear(
            item.payout_month,
            item.payout_year
          )}`,
      })
    );


  const recentIncomeActivity =
    [
      ...dailyCompoundingActivities,

      ...referralActivities,

      ...levelActivities,

      ...rankBonusActivities,

<<<<<<< HEAD
      ...rankHierarchyActivities,

=======
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
      ...teamRankBonusActivities,

      ...royaltyActivities,

      ...rankAchieverActivities,
    ]
      .filter(
        (item) => {

          if (!item.createdAt) {
            return false;
          }


          return !Number.isNaN(
            new Date(
              item.createdAt
            ).getTime()
          );
        }
      )
      .sort(
        (a, b) =>
          new Date(
            b.createdAt
          ).getTime()
          -
          new Date(
            a.createdAt
          ).getTime()
      )
      .slice(
        0,
        25
      );


  // ====================================================
  // PAGE
  // ====================================================

  return (
    <>
      <UserNavbar />

      <div className="min-h-screen bg-slate-50">

        <div className="space-y-6 px-4 pb-12 pt-28 sm:px-6 lg:px-10">


          {/* =================================================
              HEADER
          ================================================= */}

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

            <div>

              <h1 className="text-2xl font-bold text-slate-900">

                Income Wallet

              </h1>


              <p className="mt-1 text-sm text-slate-500">

                Manage and track your available earnings.

              </p>

            </div>


            <button
              type="button"
              onClick={() =>
                loadIncomeWallet(true)
              }
              disabled={refreshing}
              className="rounded-xl border border-purple-200 bg-purple-50 px-4 py-2 text-sm font-medium text-purple-700 transition hover:bg-purple-100 disabled:opacity-50"
            >

              {refreshing
                ? "Refreshing..."
                : "Refresh"}

            </button>

          </div>


          {/* =================================================
              WALLET CARDS
          ================================================= */}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">


            <div className="rounded-2xl border border-purple-200 bg-white p-6 shadow-sm">

              <p className="text-sm text-slate-500">

                Available Balance

              </p>


              <h2 className="mt-2 text-3xl font-bold text-slate-900">

                $
                {toNumber(
                  wallet?.balance
                ).toFixed(2)}

              </h2>


              <p className="mt-2 text-xs font-medium text-purple-600">

                Current Income Wallet

              </p>

            </div>


            <div className="rounded-2xl border border-emerald-200 bg-white p-6 shadow-sm">

              <p className="text-sm text-slate-500">

                Total Earned

              </p>


              <h2 className="mt-2 text-3xl font-bold text-slate-900">

                $
                {toNumber(
                  wallet?.total_earned
                ).toFixed(2)}

              </h2>


              <p className="mt-2 text-xs font-medium text-emerald-600">

                Lifetime earnings

              </p>

            </div>


            <div className="rounded-2xl border border-blue-200 bg-white p-6 shadow-sm">

              <p className="text-sm text-slate-500">

                Total Withdrawn

              </p>


              <h2 className="mt-2 text-3xl font-bold text-slate-900">

                $
                {toNumber(
                  wallet?.total_withdrawn
                ).toFixed(2)}

              </h2>


              <p className="mt-2 text-xs font-medium text-blue-600">

                Lifetime withdrawals

              </p>

            </div>

          </div>


          {/* =================================================
              WALLET SUMMARY
          ================================================= */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between">

              <div>

                <h3 className="text-lg font-semibold text-slate-900">

                  Wallet Summary

                </h3>


                <p className="mt-1 text-xs text-slate-500">

                  Current status of your income wallet

                </p>

              </div>


              <div className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1">

                <span className="text-xs font-medium text-emerald-600">

                  Active

                </span>

              </div>

            </div>


            <div className="mt-6 space-y-4">


              <div className="flex items-center justify-between border-b border-slate-100 pb-4">

                <div>

                  <p className="text-sm text-slate-700">

                    Available Income

                  </p>

                  <p className="mt-1 text-xs text-slate-500">

                    Amount currently available

                  </p>

                </div>


                <span className="font-semibold text-slate-900">

                  $
                  {toNumber(
                    wallet?.balance
                  ).toFixed(2)}

                </span>

              </div>


              <div className="flex items-center justify-between border-b border-slate-100 pb-4">

                <div>

                  <p className="text-sm text-slate-700">

                    Lifetime Earned

                  </p>

                  <p className="mt-1 text-xs text-slate-500">

                    Total income generated

                  </p>

                </div>


                <span className="font-semibold text-emerald-600">

                  $
                  {toNumber(
                    wallet?.total_earned
                  ).toFixed(2)}

                </span>

              </div>


              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm text-slate-700">

                    Lifetime Withdrawn

                  </p>

                  <p className="mt-1 text-xs text-slate-500">

                    Total amount withdrawn

                  </p>

                </div>


                <span className="font-semibold text-blue-600">

                  $
                  {toNumber(
                    wallet?.total_withdrawn
                  ).toFixed(2)}

                </span>

              </div>

            </div>

          </div>


          {/* =================================================
              INCOME SOURCES
          ================================================= */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

              <div>

                <h3 className="text-lg font-semibold text-slate-900">

                  Income Sources

                </h3>


                <p className="mt-1 text-sm text-slate-500">

                  Track where your wallet income is coming from.

                </p>

              </div>


              <div className="text-xs text-slate-500">

                Total Wallet Earned:{" "}

                <span className="font-semibold text-emerald-600">

                  $
                  {toNumber(
                    wallet?.total_earned
                  ).toFixed(2)}

                </span>

              </div>

            </div>


            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">


              {/* REFERRAL */}

              <div className="rounded-xl border border-purple-200 bg-purple-50 p-4">

                <div className="flex items-start justify-between gap-3">

                  <div>

                    <p className="text-sm font-medium text-slate-900">

                      Referral Income

                    </p>

                    <p className="mt-1 text-xs text-slate-500">

                      Direct referral commissions

                    </p>

                  </div>


                  <span className="rounded-full border border-emerald-200 bg-white px-2 py-1 text-[10px] font-semibold text-emerald-600">

                    Active

                  </span>

                </div>


                <p className="mt-4 text-2xl font-bold text-purple-700">

                  ${referralIncome.toFixed(2)}

                </p>


                <p className="mt-1 text-xs text-slate-500">

                  {
                    referralSummary
                      .total_referral_transactions
                  } credited transaction
                  {
                    referralSummary
                      .total_referral_transactions === 1
                      ? ""
                      : "s"
                  }

                </p>

              </div>


              {/* DAILY COMPOUNDING */}

              <div className="rounded-xl border border-cyan-200 bg-cyan-50 p-4">

                <div className="flex items-start justify-between gap-3">

                  <div>

                    <p className="text-sm font-medium text-slate-900">

                      Daily Ads Income

                    </p>


                    <p className="mt-1 text-xs text-slate-500">

                      Credited daily growth income

                    </p>

                  </div>


                  <span className="rounded-full border border-emerald-200 bg-white px-2 py-1 text-[10px] font-semibold text-emerald-600">

                    Active

                  </span>

                </div>


                <p className="mt-4 text-2xl font-bold text-cyan-700">

                  $
                  {dailyCompoundingIncome.toFixed(
                    2
                  )}

                </p>


               

              </div>


              {/* LEVEL PROFIT */}

              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">

                <div className="flex items-start justify-between gap-3">

                  <div>

                    <p className="text-sm font-medium text-slate-900">

                      Level Profit

                    </p>


                    <p className="mt-1 text-xs text-slate-500">

                      Network Level Profit income

                    </p>

                  </div>


                  <span className="rounded-full border border-emerald-200 bg-white px-2 py-1 text-[10px] font-semibold text-emerald-600">

                    Active

                  </span>

                </div>


                <p className="mt-4 text-2xl font-bold text-amber-700">

                  ${levelIncome.toFixed(2)}

                </p>


                <div className="mt-2 flex items-center justify-between gap-3">

                  <p className="text-xs text-slate-500">

                    Today

                  </p>


                  <p className="text-xs font-medium text-amber-700">

                    +${todayLevelIncome.toFixed(2)}

                  </p>

                </div>

              </div>


              {/* RANK INSTANT BONUS */}

              <div className="rounded-xl border border-fuchsia-200 bg-fuchsia-50 p-4">

                <div className="flex items-start justify-between gap-3">

                  <div>

                    <p className="text-sm font-medium text-slate-900">

                      Rank Hierarchy Instant Bonus

                    </p>


                    <p className="mt-1 text-xs text-slate-500">

                      One-time rank achievement rewards

                    </p>

                  </div>


                  <span className="rounded-full border border-emerald-200 bg-white px-2 py-1 text-[10px] font-semibold text-emerald-600">

                    Active

                  </span>

                </div>


                <p className="mt-4 text-2xl font-bold text-fuchsia-700">

                  ${rankBonusIncome.toFixed(2)}

                </p>


                <p className="mt-1 text-xs text-slate-500">

                  Current Rank: {currentRank}

                </p>


                {receivedRankBonuses.length > 0 && (

                  <div className="mt-3 space-y-1 border-t border-fuchsia-200 pt-3">

                    {receivedRankBonuses.map(
                      (rank) => (

                        <div
                          key={
                            rank.rank_name
                          }
                          className="flex items-center justify-between text-xs"
                        >

                          <span className="text-slate-500">

                            {rank.display_name}

                          </span>


                          <span className="font-medium text-emerald-600">

                            +
                            {`$${toNumber(
                              rank.instant_bonus_received ||
                              rank.instant_bonus
                            ).toFixed(2)}`}

                          </span>

                        </div>

                      )
                    )}

                  </div>

                )}

              </div>


              {/* TEAM RANK BONUS */}

              <div className="rounded-xl border border-violet-200 bg-violet-50 p-4">

                <div className="flex items-start justify-between gap-3">

                  <div>

                    <p className="text-sm font-medium text-slate-900">

                      Team Rank Bonus

                    </p>


                    <p className="mt-1 text-xs text-slate-500">

                      Rank-based team distribution income

                    </p>

                  </div>


                  <span className="rounded-full border border-emerald-200 bg-white px-2 py-1 text-[10px] font-semibold text-emerald-600">

                    Active

                  </span>

                </div>


                <p className="mt-4 text-2xl font-bold text-violet-700">

                  $
                  {teamRankBonusIncome.toFixed(
                    2
                  )}

                </p>


                <p className="mt-1 text-xs text-slate-500">

                  {
                    teamRankBonusHistory.length
                  } credited transaction
                  {
                    teamRankBonusHistory.length === 1
                      ? ""
                      : "s"
                  }

                </p>

              </div>


              {/* RANK HIERARCHY */}

<<<<<<< HEAD
              <div className="rounded-xl border border-sky-200 bg-sky-50 p-4">

                <div className="flex items-start justify-between gap-3">

                  <div>

                    <p className="text-sm font-medium text-slate-900">

                      Rank Hierarchy

                    </p>

                    <p className="mt-1 text-xs text-slate-500">

                      0.50% daily rank hierarchy income

                    </p>

                  </div>

                  <span className="rounded-full border border-emerald-200 bg-white px-2 py-1 text-[10px] font-semibold text-emerald-600">

                    Active

                  </span>

                </div>

                <p className="mt-4 text-2xl font-bold text-sky-700">
=======
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">

                <p className="text-sm font-medium text-slate-900">

                  Rank Hierarchy

                </p>


                <p className="mt-1 text-xs text-slate-500">

                  Rank hierarchy income

                </p>


                <p className="mt-4 text-2xl font-bold text-slate-700">
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

                  ${rankHierarchyIncome.toFixed(2)}

                </p>

<<<<<<< HEAD
                <p className="mt-1 text-xs text-slate-500">

                  Current Rank: {currentRank}

                </p>
=======

                <span className="mt-2 inline-block rounded-full border border-slate-200 bg-white px-2 py-1 text-[10px] text-slate-500">

                  Coming Soon

                </span>
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

              </div>


              {/* ROYALTY */}

              <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-4">

                <div className="flex items-start justify-between gap-3">

                  <div>

                    <p className="text-sm font-medium text-slate-900">

                      Royalty Income

                    </p>


                    <p className="mt-1 text-xs text-slate-500">

                      Matching-leg Royalty Pool income

                    </p>

                  </div>


                  <span className="rounded-full border border-emerald-200 bg-white px-2 py-1 text-[10px] font-semibold text-emerald-600">

                    Active

                  </span>

                </div>


                <p className="mt-4 text-2xl font-bold text-indigo-700">

                  ${royaltyIncome.toFixed(2)}

                </p>


                <p className="mt-1 text-xs text-slate-500">

                  {royaltyHistory.length} credited transaction
                  {royaltyHistory.length === 1
                    ? ""
                    : "s"}

                </p>


                {royaltyHistory.length > 0 && (

                  <div className="mt-3 border-t border-indigo-200 pt-3">

                    <div className="flex items-center justify-between text-xs">

                      <span className="text-slate-500">

                        Latest Credit

                      </span>


                      <span className="font-semibold text-emerald-600">

                        +$
                        {toNumber(
                          royaltyHistory[0]
                            ?.royalty_amount
                        ).toFixed(2)}

                      </span>

                    </div>

                  </div>

                )}

              </div>


              {/* RANK ACHIEVER */}

              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">

                <div className="flex items-start justify-between gap-3">

                  <div>

                    <p className="text-sm font-medium text-slate-900">

                      Rank Achiever Funds

                    </p>


                    <p className="mt-1 text-xs text-slate-500">

                      Monthly team and wallet maintenance rewards

                    </p>

                  </div>


                  <span className="rounded-full border border-emerald-200 bg-white px-2 py-1 text-[10px] font-semibold text-emerald-600">

                    Active

                  </span>

                </div>


                <p className="mt-4 text-2xl font-bold text-emerald-700">

                  ${rankAchieverIncome.toFixed(2)}

                </p>


                <p className="mt-1 text-xs text-slate-500">

                  {rankAchieverHistory.length} credited payout
                  {rankAchieverHistory.length === 1
                    ? ""
                    : "s"}

                </p>


                {rankAchieverHistory.length > 0 && (

                  <div className="mt-3 border-t border-emerald-200 pt-3">

                    <div className="flex items-center justify-between gap-3 text-xs">

                      <span className="text-slate-500">

                        Latest Credit

                      </span>


                      <span className="font-semibold text-emerald-700">

                        +$
                        {toNumber(
                          rankAchieverHistory[0]
                            ?.amount
                        ).toFixed(2)}

                      </span>

                    </div>


                    <div className="mt-2 flex items-center justify-between gap-3 text-xs">

                      <span className="text-slate-500">

                        Fund

                      </span>


                      <span className="text-right font-medium text-slate-700">

                        {
                          rankAchieverHistory[0]
                            ?.fund_type
                        }

                      </span>

                    </div>

                  </div>

                )}

              </div>

            </div>

          </div>


          {/* =================================================
              REFERRAL BREAKDOWN
          ================================================= */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div>

              <h3 className="text-lg font-semibold text-slate-900">

                Referral Income Breakdown

              </h3>


              <p className="mt-1 text-sm text-slate-500">

                Breakdown of income currently credited from your referrals.

              </p>

            </div>


            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">


              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">

                <p className="text-xs text-slate-500">

                  First Subscription

                </p>


                <p className="mt-2 text-xl font-bold text-slate-900">

                  ${firstSubscriptionIncome.toFixed(2)}

                </p>


                <p className="mt-1 text-xs font-medium text-purple-600">

                  10% referral rule

                </p>

              </div>


              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">

                <p className="text-xs text-slate-500">

                  Upgrade Income

                </p>


                <p className="mt-2 text-xl font-bold text-slate-900">

                  ${upgradeIncome.toFixed(2)}

                </p>


                <p className="mt-1 text-xs font-medium text-purple-600">

                  5% upgrade rule

                </p>

              </div>


              <div className="rounded-xl border border-purple-200 bg-purple-50 p-4">

                <p className="text-xs font-medium text-purple-600">

                  Total Referral Income

                </p>


                <p className="mt-2 text-xl font-bold text-slate-900">

                  ${referralIncome.toFixed(2)}

                </p>


                <p className="mt-1 text-xs text-slate-500">

                  {
                    referralSummary
                      .total_referral_transactions
                  } total credits

                </p>

              </div>

            </div>

          </div>


          {/* =================================================
              RECENT INCOME ACTIVITY
          ================================================= */}

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="border-b border-slate-200 p-6">

              <h3 className="text-lg font-semibold text-slate-900">

                Recent Income Activity

              </h3>


              <p className="mt-1 text-sm text-slate-500">

                Daily Ads Income, Referral, Level Profit, Rank Bonus,
<<<<<<< HEAD
                Rank Hierarchy, Team Rank Bonus, Royalty and Rank Achiever credits to your wallet.
=======
                Team Rank Bonus, Royalty and Rank Achiever credits to your wallet.
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

              </p>

            </div>


            {recentIncomeActivity.length === 0 ? (

              <div className="p-8 text-center">

                <p className="text-sm text-slate-500">

                  No income activity yet.

                </p>


                <p className="mt-1 text-xs text-slate-400">

                  Your credited income will appear here.

                </p>

              </div>

            ) : (

              <div className="overflow-x-auto">

                <table className="w-full min-w-[1000px]">

                  <thead>

                    <tr className="border-b border-slate-200 bg-slate-50">

                      <th className="px-5 py-4 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                        Source
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                        User / Detail
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                        Customer ID
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                        Type
                      </th>

                      <th className="px-5 py-4 text-right text-xs font-medium uppercase tracking-wider text-slate-500">
                        Base
                      </th>

                      <th className="px-5 py-4 text-right text-xs font-medium uppercase tracking-wider text-slate-500">
                        Rate / Weight
                      </th>

                      <th className="px-5 py-4 text-right text-xs font-medium uppercase tracking-wider text-slate-500">
                        Income
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                        Date
                      </th>

                    </tr>

                  </thead>


                  <tbody>

                    {recentIncomeActivity.map(
                      (item) => (

                        <tr
                          key={item.key}
                          className="border-b border-slate-100 transition hover:bg-slate-50"
                        >

                          <td className="px-5 py-4">

                            <span
                              className={
                                item.source ===
                                "Level Profit"

                                  ? "rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700"

                                  : item.source ===
                                    "Rank Bonus"

                                    ? "rounded-full border border-fuchsia-200 bg-fuchsia-50 px-2.5 py-1 text-xs font-medium text-fuchsia-700"

                                    : item.source ===
                                      "Team Rank Bonus"

                                      ? "rounded-full border border-violet-200 bg-violet-50 px-2.5 py-1 text-xs font-medium text-violet-700"

                                      : item.source ===
                                        "Daily Ads Income"

                                        ? "rounded-full border border-cyan-200 bg-cyan-50 px-2.5 py-1 text-xs font-medium text-cyan-700"

                                        : item.source ===
                                          "Royalty"

                                          ? "rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700"

                                          : item.source ===
                                            "Rank Achiever"

                                            ? "rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700"

                                            : "rounded-full border border-purple-200 bg-purple-50 px-2.5 py-1 text-xs font-medium text-purple-700"
                              }
                            >

                              {item.source}

                            </span>

                          </td>


                          <td className="px-5 py-4">

                            <div className="text-sm font-medium text-slate-900">

                              {item.userName}

                            </div>


                            {item.detail && (

                              <div className="mt-1 text-[11px] text-slate-500">

                                {item.detail}

                              </div>

                            )}

                          </td>


                          <td className="px-5 py-4 text-sm text-slate-500">

                            {item.customerId}

                          </td>


                          <td className="px-5 py-4 text-sm text-slate-700">

                            {item.type}

                          </td>


                          <td className="px-5 py-4 text-right text-sm text-slate-500">

                            $
                            {item.baseAmount.toFixed(
                              4
                            )}

                          </td>


                          <td className="px-5 py-4 text-right text-sm text-slate-500">

                            {
                              item.percentage > 0

                                ? item.source ===
                                  "Team Rank Bonus"

                                  ? `${item.percentage.toFixed(
                                      0
                                    )}/30`

                                  : `${item.percentage.toFixed(
                                      2
                                    )}%`

                                : "--"
                            }

                          </td>


                          <td className="px-5 py-4 text-right">

                            <span className="font-semibold text-emerald-600">

                              +$
                              {item.amount.toFixed(
                                4
                              )}

                            </span>

                          </td>


                          <td className="px-5 py-4 text-xs text-slate-500">

                            {formatDate(
                              item.createdAt
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


          {/* =================================================
              ROYALTY QUICK HISTORY
          ================================================= */}

          {royaltyHistory.length > 0 && (

            <div className="rounded-2xl border border-indigo-200 bg-white p-6 shadow-sm">

              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

                <div>

                  <h3 className="text-lg font-semibold text-slate-900">

                    Royalty Pool Summary

                  </h3>


                  <p className="mt-1 text-sm text-slate-500">

                    Recent Royalty credits received in your Income Wallet.

                  </p>

                </div>


                <div className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">

                  Active

                </div>

              </div>


              <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">

                <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-4">

                  <p className="text-xs text-slate-500">

                    Total Royalty

                  </p>


                  <p className="mt-2 text-xl font-bold text-indigo-700">

                    ${royaltyIncome.toFixed(2)}

                  </p>

                </div>


                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">

                  <p className="text-xs text-slate-500">

                    Royalty Credits

                  </p>


                  <p className="mt-2 text-xl font-bold text-slate-900">

                    {royaltyHistory.length}

                  </p>

                </div>


                <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">

                  <p className="text-xs text-slate-500">

                    Latest Royalty

                  </p>


                  <p className="mt-2 text-xl font-bold text-emerald-700">

                    +$
                    {toNumber(
                      royaltyHistory[0]
                        ?.royalty_amount
                    ).toFixed(2)}

                  </p>

                </div>

              </div>

            </div>

          )}


          {/* =================================================
              RANK ACHIEVER QUICK HISTORY
          ================================================= */}

          <div className="rounded-2xl border border-emerald-200 bg-white p-6 shadow-sm">

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

              <div>

                <h3 className="text-lg font-semibold text-slate-900">

                  Rank Achiever Fund Summary

                </h3>


                <p className="mt-1 text-sm text-slate-500">

                  Monthly rewards credited for maintaining the required
                  team and Income Wallet balance.

                </p>

              </div>


              <div className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">

                Active

              </div>

            </div>


            <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">

              <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">

                <p className="text-xs text-slate-500">

                  Total Rank Achiever Income

                </p>


                <p className="mt-2 text-xl font-bold text-emerald-700">

                  ${rankAchieverIncome.toFixed(2)}

                </p>

              </div>


              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">

                <p className="text-xs text-slate-500">

                  Total Payouts

                </p>


                <p className="mt-2 text-xl font-bold text-slate-900">

                  {rankAchieverHistory.length}

                </p>

              </div>


              <div className="rounded-xl border border-purple-100 bg-purple-50 p-4">

                <p className="text-xs text-slate-500">

                  Total Paid

                </p>


                <p className="mt-2 text-xl font-bold text-purple-700">

                  ${rankAchieverTotalPaid.toFixed(2)}

                </p>

              </div>

            </div>


            {rankAchieverHistory.length === 0 ? (

              <div className="mt-5 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center">

                <p className="text-sm font-medium text-slate-700">

                  No Rank Achiever payout yet.

                </p>


                <p className="mt-1 text-xs text-slate-500">

                  Monthly credited rewards will appear here.

                </p>

              </div>

            ) : (

              <div className="mt-5 overflow-x-auto rounded-xl border border-slate-200">

                <table className="w-full min-w-[850px]">

                  <thead>

                    <tr className="border-b border-slate-200 bg-slate-50">

                      <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">

                        Fund

                      </th>


                      <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">

                        Rank

                      </th>


                      <th className="px-4 py-3 text-right text-xs font-medium uppercase text-slate-500">

                        Team

                      </th>


                      <th className="px-4 py-3 text-right text-xs font-medium uppercase text-slate-500">

                        Wallet

                      </th>


                      <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">

                        Month

                      </th>


                      <th className="px-4 py-3 text-right text-xs font-medium uppercase text-slate-500">

                        Reward

                      </th>


                      <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">

                        Status

                      </th>

                    </tr>

                  </thead>


                  <tbody>

                    {rankAchieverHistory.map(
                      (item) => (

                        <tr
                          key={item.id}
                          className="border-b border-slate-100 last:border-b-0"
                        >

                          <td className="px-4 py-4 text-sm font-medium text-slate-900">

                            {item.fund_type}

                          </td>


                          <td className="px-4 py-4 text-sm text-slate-600">

                            {item.rank_name}

                          </td>


                          <td className="px-4 py-4 text-right text-sm text-slate-600">

                            {item.team_members.toLocaleString()}

                          </td>


                          <td className="px-4 py-4 text-right text-sm text-slate-600">

                            $
                            {toNumber(
                              item.wallet_balance
                            ).toFixed(2)}

                          </td>


                          <td className="px-4 py-4 text-sm text-slate-600">

                            {formatMonthYear(
                              item.payout_month,
                              item.payout_year
                            )}

                          </td>


                          <td className="px-4 py-4 text-right text-sm font-semibold text-emerald-600">

                            +$
                            {toNumber(
                              item.amount
                            ).toFixed(2)}

                          </td>


                          <td className="px-4 py-4">

                            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-600">

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

        </div>

      </div>
    </>
  );
}