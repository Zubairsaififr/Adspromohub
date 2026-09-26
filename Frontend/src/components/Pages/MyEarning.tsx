<<<<<<< HEAD
// import React, { useEffect, useState } from "react";

// import {
//     Wallet,
//     PlayCircle,
//     Users,
//     TrendingUp,
//     Gift,
//     ArrowUpRight,
//     CheckCircle2,
//     Sparkles,
//     UserPlus,
//     Coins,
// } from "lucide-react";

// import { useNavigate } from "react-router-dom";


// // =========================================================
// // API
// // =========================================================

// const API_URL = import.meta.env.VITE_API_URL;


// // =========================================================
// // TYPES
// // =========================================================

// interface ReferralSummary {
//     success: boolean;
//     total_referral_income: string | number;
//     first_subscription_income: string | number;
//     upgrade_income: string | number;
//     total_referral_transactions: number;
// }


// interface IncomeWalletResponse {
//     success: boolean;
//     balance: string | number;
//     total_earned: string | number;
//     total_withdrawn: string | number;
// }

// interface IncomeWalletSummaryResponse {
//     success: boolean;
//     daily_compounding: string | number;
// }


// interface DailyCompoundingStatus {
//     success: boolean;

//     subscription_active: boolean;

//     can_watch_ad: boolean;

//     reason: string;

//     message: string;

//     active_session: boolean;

//     daily_ad_used: boolean;

//     today_ads_watched: number;

//     daily_ad_limit: number;

//     ads_remaining_today: number;

//     inside_ad_window: boolean;

//     direct_referral_count: number;

//     growth_percentage: number;

//     earning_category: string;

//     earning_multiplier: number;

//     ad_watch_seconds: number;

//     credit_delay_minutes: number;

//     session?: {
//         id: number;
//         status: string;
//         ad_started_at?: string | null;
//         ad_completed_at?: string | null;
//         watch_complete_at?: string | null;
//         eligible_at?: string | null;
//         watch_remaining_seconds?: number;
//         credit_remaining_seconds?: number;
//     } | null;
// }


// // =========================================================
// // COMPONENT
// // =========================================================

// const MyEarning: React.FC = () => {

//     const navigate = useNavigate();


//     // =====================================================
//     // ADS EARNING
//     //
//     // Ads earning amount is not separately connected yet.
//     // Daily ad watching progress IS connected below.
//     // =====================================================

//     const [
//         adEarning,
//         setAdEarning,
//     ] = useState(0);


//     // =====================================================
//     // REFERRAL STATE
//     // =====================================================

//     const [
//         referralSummary,
//         setReferralSummary,
//     ] = useState<ReferralSummary>({
//         success: true,
//         total_referral_income: "0.00",
//         first_subscription_income: "0.00",
//         upgrade_income: "0.00",
//         total_referral_transactions: 0,
//     });


//     // =====================================================
//     // INCOME WALLET STATE
//     // =====================================================

//     const [
//         incomeWallet,
//         setIncomeWallet,
//     ] = useState<IncomeWalletResponse>({
//         success: true,
//         balance: "0.00",
//         total_earned: "0.00",
//         total_withdrawn: "0.00",
//     });


//     // =====================================================
//     // DAILY COMPOUNDING / ADS PROGRESS STATE
//     // =====================================================

//     const [
//         compoundingStatus,
//         setCompoundingStatus,
//     ] = useState<DailyCompoundingStatus>({
//         success: true,

//         subscription_active: false,

//         can_watch_ad: false,

//         reason: "",

//         message: "",

//         active_session: false,

//         daily_ad_used: false,

//         today_ads_watched: 0,

//         daily_ad_limit: 1,

//         ads_remaining_today: 1,

//         inside_ad_window: false,

//         direct_referral_count: 0,

//         growth_percentage: 0,

//         earning_category: "non_working",

//         earning_multiplier: 2.5,

//         ad_watch_seconds: 30,

//         credit_delay_minutes: 5,

//         session: null,
//     });


//     // =====================================================
//     // LOADING / ERROR
//     // =====================================================

//     const [
//         loading,
//         setLoading,
//     ] = useState(true);


//     const [
//         error,
//         setError,
//     ] = useState("");


//     // =====================================================
//     // GET TOKEN
//     // =====================================================

//     const getToken = (): string => {

//         try {

//             const directToken =
//                 localStorage.getItem(
//                     "access_token"
//                 );


//             if (directToken) {
//                 return directToken;
//             }


//             const storedUser =
//                 localStorage.getItem(
//                     "user"
//                 );


//             if (!storedUser) {
//                 return "";
//             }


//             const user =
//                 JSON.parse(
//                     storedUser
//                 );


//             return (
//                 user?.access_token ||
//                 user?.accessToken ||
//                 ""
//             );

//         } catch (error) {

//             console.error(
//                 "Unable to read token:",
//                 error
//             );


//             return "";
//         }
//     };


//     // =====================================================
//     // LOAD REAL EARNING DATA
//     // =====================================================

//     useEffect(() => {

//         let isMounted = true;


//         const loadEarningData =
//             async () => {

//                 try {

//                     setLoading(true);

//                     setError("");


//                     const token =
//                         getToken();


//                     if (!token) {

//                         if (isMounted) {

//                             setError(
//                                 "Login session not found. Please login again."
//                             );
//                         }

//                         return;
//                     }


//                     // =====================================
//                     // COMMON HEADERS
//                     // =====================================

//                     const headers = {

//                         Authorization:
//                             `Bearer ${token}`,

//                         "Content-Type":
//                             "application/json",
//                     };


//                     // =====================================
//                     // REFERRAL + WALLET + ADS STATUS
//                     // =====================================

//                     const [
//                         referralResponse,
//                         walletResponse,
//                         walletSummaryResponse,
//                         compoundingResponse,
//                     ] = await Promise.all([

//                         fetch(
//                             `${API_URL}/api/referral/summary`,
//                             {
//                                 method: "GET",
//                                 headers,
//                             }
//                         ),


//                         fetch(
//                             `${API_URL}/api/income-wallet`,
//                             {
//                                 method: "GET",
//                                 headers,
//                             }
//                         ),


//                         fetch(
//                             `${API_URL}/api/income-wallet/summary`,
//                             {
//                                 method: "GET",
//                                 headers,
//                             }
//                         ),


//                         fetch(
//                             `${API_URL}/api/daily-compounding/status`,
//                             {
//                                 method: "GET",
//                                 headers,
//                             }
//                         ),

//                     ]);


//                     // =====================================
//                     // SESSION EXPIRED
//                     // =====================================

//                     if (
//                         referralResponse.status === 401 ||
//                         walletResponse.status === 401 ||
//                         walletSummaryResponse.status === 401 ||
//                         compoundingResponse.status === 401
//                     ) {

//                         if (isMounted) {

//                             setError(
//                                 "Login session expired. Please login again."
//                             );
//                         }

//                         return;
//                     }


//                     // =====================================
//                     // JSON
//                     // =====================================

//                     const referralResult =
//                         await referralResponse.json();


//                     const walletResult =
//                         await walletResponse.json();


//                     const walletSummaryResult: IncomeWalletSummaryResponse =
//                         await walletSummaryResponse.json();


//                     const compoundingResult =
//                         await compoundingResponse.json();


//                     console.log(
//                         "Referral Summary:",
//                         referralResult
//                     );


//                     console.log(
//                         "Income Wallet:",
//                         walletResult
//                     );


//                     console.log(
//                         "Daily Compounding Status:",
//                         compoundingResult
//                     );


//                     // =====================================
//                     // REFERRAL ERROR
//                     // =====================================

//                     if (!referralResponse.ok) {

//                         throw new Error(

//                             referralResult?.detail ||

//                             referralResult?.message ||

//                             "Unable to load referral earnings."
//                         );
//                     }


//                     // =====================================
//                     // WALLET ERROR
//                     // =====================================

//                     if (!walletResponse.ok) {

//                         throw new Error(

//                             walletResult?.detail ||

//                             walletResult?.message ||

//                             "Unable to load income wallet."
//                         );
//                     }


//                     // =====================================
//                     // WALLET INCOME SUMMARY ERROR
//                     // =====================================

//                     if (!walletSummaryResponse.ok) {

//                         throw new Error(
//                             (walletSummaryResult as any)?.detail ||
//                             (walletSummaryResult as any)?.message ||
//                             "Unable to load ads earnings."
//                         );
//                     }


//                     // =====================================
//                     // COMPOUNDING STATUS ERROR
//                     // =====================================

//                     if (!compoundingResponse.ok) {

//                         throw new Error(

//                             compoundingResult?.detail ||

//                             compoundingResult?.message ||

//                             "Unable to load ads progress."
//                         );
//                     }


//                     if (!isMounted) {
//                         return;
//                     }


//                     // =====================================
//                     // SAVE REFERRAL
//                     // =====================================

//                     setReferralSummary({

//                         success:
//                             referralResult?.success ??
//                             true,

//                         total_referral_income:
//                             referralResult
//                                 ?.total_referral_income ??
//                             "0.00",

//                         first_subscription_income:
//                             referralResult
//                                 ?.first_subscription_income ??
//                             "0.00",

//                         upgrade_income:
//                             referralResult
//                                 ?.upgrade_income ??
//                             "0.00",

//                         total_referral_transactions:
//                             Number(
//                                 referralResult
//                                     ?.total_referral_transactions ??
//                                 0
//                             ),
//                     });


//                     // =====================================
//                     // SAVE WALLET
//                     // =====================================

//                     setIncomeWallet({

//                         success:
//                             walletResult?.success ??
//                             true,

//                         balance:
//                             walletResult?.balance ??
//                             "0.00",

//                         total_earned:
//                             walletResult?.total_earned ??
//                             "0.00",

//                         total_withdrawn:
//                             walletResult?.total_withdrawn ??
//                             "0.00",
//                     });


//                     // =====================================
//                     // SAVE ADS EARNING
//                     // =====================================

//                     setAdEarning(
//                         Math.max(
//                             Number(
//                                 walletSummaryResult?.daily_compounding ?? 0
//                             ),
//                             0
//                         )
//                     );


//                     // =====================================
//                     // SAVE ADS / COMPOUNDING STATUS
//                     // =====================================

//                     setCompoundingStatus({

//                         success:
//                             compoundingResult?.success ??
//                             true,

//                         subscription_active:
//                             Boolean(
//                                 compoundingResult
//                                     ?.subscription_active
//                             ),

//                         can_watch_ad:
//                             Boolean(
//                                 compoundingResult
//                                     ?.can_watch_ad
//                             ),

//                         reason:
//                             String(
//                                 compoundingResult?.reason ??
//                                 ""
//                             ),

//                         message:
//                             String(
//                                 compoundingResult?.message ??
//                                 ""
//                             ),

//                         active_session:
//                             Boolean(
//                                 compoundingResult
//                                     ?.active_session
//                             ),

//                         daily_ad_used:
//                             Boolean(
//                                 compoundingResult
//                                     ?.daily_ad_used
//                             ),

//                         today_ads_watched:
//                             Math.max(
//                                 Number(
//                                     compoundingResult
//                                         ?.today_ads_watched ??
//                                     0
//                                 ),
//                                 0
//                             ),

//                         daily_ad_limit:
//                             Math.max(
//                                 Number(
//                                     compoundingResult
//                                         ?.daily_ad_limit ??
//                                     1
//                                 ),
//                                 1
//                             ),

//                         ads_remaining_today:
//                             Math.max(
//                                 Number(
//                                     compoundingResult
//                                         ?.ads_remaining_today ??
//                                     0
//                                 ),
//                                 0
//                             ),

//                         inside_ad_window:
//                             Boolean(
//                                 compoundingResult
//                                     ?.inside_ad_window
//                             ),

//                         direct_referral_count:
//                             Number(
//                                 compoundingResult
//                                     ?.direct_referral_count ??
//                                 0
//                             ),

//                         growth_percentage:
//                             Number(
//                                 compoundingResult
//                                     ?.growth_percentage ??
//                                 0
//                             ),

//                         earning_category:
//                             String(
//                                 compoundingResult
//                                     ?.earning_category ??
//                                 "non_working"
//                             ),

//                         earning_multiplier:
//                             Number(
//                                 compoundingResult
//                                     ?.earning_multiplier ??
//                                 2.5
//                             ),

//                         ad_watch_seconds:
//                             Number(
//                                 compoundingResult
//                                     ?.ad_watch_seconds ??
//                                 30
//                             ),

//                         credit_delay_minutes:
//                             Number(
//                                 compoundingResult
//                                     ?.credit_delay_minutes ??
//                                 5
//                             ),

//                         session:
//                             compoundingResult?.session ??
//                             null,
//                     });


//                 } catch (err) {

//                     console.error(
//                         "My Earning API Error:",
//                         err
//                     );


//                     if (isMounted) {

//                         let message =
//                             "Unable to load earnings.";


//                         if (
//                             err instanceof Error
//                         ) {

//                             message =
//                                 err.message;
//                         }


//                         setError(
//                             message
//                         );
//                     }

//                 } finally {

//                     if (isMounted) {

//                         setLoading(
//                             false
//                         );
//                     }
//                 }
//             };


//         loadEarningData();


//         return () => {

//             isMounted = false;
//         };

//     }, []);


//     // =====================================================
//     // NUMBER HELPER
//     // =====================================================

//     const toNumber = (
//         value: string | number
//     ): number => {

//         const parsed =
//             Number(
//                 value || 0
//             );


//         return Number.isFinite(
//             parsed
//         )
//             ? parsed
//             : 0;
//     };


//     // =====================================================
//     // REAL BACKEND VALUES
//     // =====================================================

//     const totalEarning =
//         toNumber(
//             incomeWallet.balance
//         );


//     const totalEarned =
//         toNumber(
//             incomeWallet.total_earned
//         );


//     const totalWithdrawn =
//         toNumber(
//             incomeWallet.total_withdrawn
//         );


//     const referralEarning =
//         toNumber(
//             referralSummary
//                 .total_referral_income
//         );


//     const firstSubscriptionIncome =
//         toNumber(
//             referralSummary
//                 .first_subscription_income
//         );


//     const upgradeIncome =
//         toNumber(
//             referralSummary
//                 .upgrade_income
//         );


//     const referralTransactions =
//         referralSummary
//             .total_referral_transactions;


//     // =====================================================
//     // REAL ADS PROGRESS VALUES
//     // =====================================================

//     const adsWatched =
//         Math.max(
//             Number(
//                 compoundingStatus
//                     .today_ads_watched || 0
//             ),
//             0
//         );


//     const totalAds =
//         Math.max(
//             Number(
//                 compoundingStatus
//                     .daily_ad_limit || 1
//             ),
//             1
//         );


//     const adsRemaining =
//         Math.max(
//             Number(
//                 compoundingStatus
//                     .ads_remaining_today ?? 0
//             ),
//             0
//         );


//     // =====================================================
//     // ADS PROGRESS %
//     // =====================================================

//     const adProgress =
//         totalAds > 0
//             ? Math.min(
//                 (
//                     adsWatched /
//                     totalAds
//                 )
//                 *
//                 100,
//                 100
//             )
//             : 0;


//     // =====================================================
//     // ADS STATUS TEXT
//     // =====================================================

//     const getAdsStatusText = () => {

//         if (loading) {
//             return "Loading today's ads progress...";
//         }


//         if (
//             compoundingStatus.reason ===
//             "ad_running"
//         ) {

//             return (
//                 "Advertisement is currently being watched."
//             );
//         }


//         if (
//             compoundingStatus.reason ===
//             "credit_pending"
//         ) {

//             return (
//                 "Today's ad is completed. Compounding income is pending."
//             );
//         }


//         if (
//             compoundingStatus.reason ===
//             "credit_ready"
//         ) {

//             return (
//                 "Today's ad is completed. Compounding income is ready."
//             );
//         }


//         if (
//             compoundingStatus.reason ===
//             "daily_ad_completed"
//         ) {

//             return (
//                 "You already watched today's ad. Please come back tomorrow."
//             );
//         }


//         if (
//             compoundingStatus.reason ===
//             "available"
//         ) {

//             return (
//                 "Today's ad is available to watch."
//             );
//         }


//         if (
//             compoundingStatus.reason ===
//             "outside_ad_window"
//         ) {

//             return (
//                 compoundingStatus.message ||
//                 "Ads are currently outside the available watching time."
//             );
//         }


//         if (
//             compoundingStatus.reason ===
//             "subscription_inactive"
//         ) {

//             return (
//                 "An active subscription is required to watch ads."
//             );
//         }


//         if (
//             compoundingStatus.reason ===
//             "cycle_limit_reached"
//         ) {

//             return (
//                 "Your current subscription cycle has reached its earning limit."
//             );
//         }


//         return (
//             compoundingStatus.message ||
//             "Track your daily ad watching progress."
//         );
//     };


//     // =====================================================
//     // STATIC CONTENT
//     // =====================================================

//     const earningPoints = [

//         {
//             icon: PlayCircle,

//             title:
//                 "Watch Ads & Earn",

//             description:
//                 "Watch available advertisements and receive rewards for completed ad views.",
//         },

//         {
//             icon: Users,

//             title:
//                 "Build Your Referral Network",

//             description:
//                 "Invite new users and grow your network to unlock additional earning opportunities.",
//         },

//         {
//             icon: TrendingUp,

//             title:
//                 "Increase Your Activity",

//             description:
//                 "Regular activity can help you maintain consistent earning progress.",
//         },

//         {
//             icon: Gift,

//             title:
//                 "Unlock More Rewards",

//             description:
//                 "Participate in available campaigns, bonuses and promotional reward programs.",
//         },
//     ];
//   const handlewithdwar = () => {
//     navigate("/claim-ads-points");
//   };


//     // =====================================================
//     // UI
//     // =====================================================

//     return (

//         <div className="min-h-screen w-full bg-gray-50 px-4 py-5 text-gray-900 sm:px-6 lg:px-8">

//             <div className="mx-auto max-w-7xl space-y-6">


//                 {/* ================================================= */}
//                 {/* HEADER */}
//                 {/* ================================================= */}

//                 <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

//                     <div>

//                         <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-purple-100 bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700">

//                             <Sparkles className="h-3.5 w-3.5" />

//                             Earning Dashboard

//                         </div>


//                         <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">

//                             My Earning

//                         </h1>


//                         <p className="mt-1 text-sm text-gray-500 sm:text-base">

//                             Track your ads, referrals and reward earnings in one place.

//                         </p>

//                     </div>


//                     <button className="flex w-fit items-center gap-2 rounded-xl bg-purple-600 px-5 py-
//                      text-sm font-semibold text-white shadow-lg shadow-purple-200 transition hover:bg-purple-700 p-2"
//                      onClick={handlewithdwar}
//                      >

//                         <Wallet className="h-4 w-4" />

//                         Withdraw

//                         <ArrowUpRight className="h-4 w-4" />

//                     </button>

//                 </div>


//                 {/* ================================================= */}
//                 {/* MAIN EARNING CARD */}
//                 {/* ================================================= */}

//                 <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-700 via-purple-600 to-purple-500 p-6 text-white shadow-xl shadow-purple-200 sm:p-8">

//                     <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

//                     <div className="absolute -bottom-24 left-1/3 h-72 w-72 rounded-full bg-purple-300/20 blur-3xl" />


//                     <div className="relative z-10 grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-center">

//                         <div>

//                             <div className="mb-3 flex items-center gap-2 text-sm text-purple-100">

//                                 <Wallet className="h-5 w-5" />

//                                 Total Earnings

//                             </div>


//                             <div className="flex items-end gap-2">

//                                 <span className="text-5xl font-extrabold tracking-tight sm:text-6xl">

//                                     {loading
//                                         ? "..."
//                                         : `$${totalEarning.toFixed(2)}`
//                                     }

//                                 </span>

//                             </div>


//                             <div className="mt-4 flex flex-wrap items-center gap-3">

//                                 <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium backdrop-blur">

//                                     <TrendingUp className="h-3.5 w-3.5" />

//                                     Income Wallet

//                                 </span>


//                                 <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium backdrop-blur">

//                                     <CheckCircle2 className="h-3.5 w-3.5" />

//                                     Available Balance

//                                 </span>

//                             </div>

//                         </div>


//                         <div className="grid grid-cols-2 gap-3">

//                             {/* ADS EARNING */}

//                             <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">

//                                 <PlayCircle className="mb-3 h-6 w-6 text-purple-100" />

//                                 <p className="text-xs text-purple-100">

//                                     Ads Earnings

//                                 </p>


//                                 <p className="mt-1 text-xl font-bold">

//                                     {loading
//                                         ? "..."
//                                         : `$${adEarning.toFixed(2)}`
//                                     }

//                                 </p>

//                             </div>


//                             {/* REFERRAL */}

//                             <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">

//                                 <Users className="mb-3 h-6 w-6 text-purple-100" />

//                                 <p className="text-xs text-purple-100">

//                                     Referral Earnings

//                                 </p>


//                                 <p className="mt-1 text-xl font-bold">

//                                     {loading
//                                         ? "..."
//                                         : `$${referralEarning.toFixed(2)}`
//                                     }

//                                 </p>

//                             </div>


//                             {/* TOTAL EARNED */}

//                             <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">

//                                 <TrendingUp className="mb-3 h-6 w-6 text-purple-100" />

//                                 <p className="text-xs text-purple-100">

//                                     Total Earned

//                                 </p>


//                                 <p className="mt-1 text-xl font-bold">

//                                     {loading
//                                         ? "..."
//                                         : `$${totalEarned.toFixed(2)}`
//                                     }

//                                 </p>

//                             </div>


//                             {/* TOTAL WITHDRAWN */}

//                             <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">

//                                 <Coins className="mb-3 h-6 w-6 text-purple-100" />

//                                 <p className="text-xs text-purple-100">

//                                     Total Withdrawl

//                                 </p>


//                                 <p className="mt-1 text-xl font-bold">

//                                     {loading
//                                         ? "..."
//                                         : `$${totalWithdrawn.toFixed(2)}`
//                                     }

//                                 </p>

//                             </div>

//                         </div>

//                     </div>

//                 </div>


//                 {/* ================================================= */}
//                 {/* ERROR */}
//                 {/* ================================================= */}

//                 {error && (

//                     <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">

//                         {error}

//                     </div>

//                 )}


//                 {/* ================================================= */}
//                 {/* EARNING STATS */}
//                 {/* ================================================= */}

//                 <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">


//                     {/* ADS EARNINGS */}

//                     <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

//                         <div className="mb-4 flex items-center justify-between">

//                             <div className="rounded-xl bg-purple-50 p-3 text-purple-600">

//                                 <PlayCircle className="h-6 w-6" />

//                             </div>


//                             <span className="text-xs font-semibold text-purple-600">

//                                 Credited

//                             </span>

//                         </div>


//                         <p className="text-sm text-gray-500">

//                             Ads Earnings

//                         </p>


//                         <p className="mt-1 text-2xl font-bold text-gray-900">

//                             ${adEarning.toFixed(2)}

//                         </p>

//                     </div>


//                     {/* REFERRAL EARNINGS */}

//                     <div
//                         className="cursor-pointer rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
//                         onClick={() =>
//                             navigate(
//                                 "/referral"
//                             )
//                         }
//                     >

//                         <div className="mb-4 flex items-center justify-between">

//                             <div className="rounded-xl bg-purple-50 p-3 text-purple-600">

//                                 <Users className="h-6 w-6" />

//                             </div>


//                             <span className="text-xs font-semibold text-green-600">

//                                 {loading
//                                     ? "..."
//                                     : `${referralTransactions} Credits`
//                                 }

//                             </span>

//                         </div>


//                         <p className="text-sm text-gray-500">

//                             Referral Earnings

//                         </p>


//                         <p className="mt-1 text-2xl font-bold text-gray-900">

//                             {loading
//                                 ? "..."
//                                 : `$${referralEarning.toFixed(2)}`
//                             }

//                         </p>

//                     </div>


//                     {/* INCOME WALLET */}

//                     <div
//                         className="cursor-pointer rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"

//                         onClick={() =>
//                             navigate(
//                                 "/incomewallet"
//                             )
//                         }
//                     >

//                         <div className="mb-4 flex items-center justify-between">

//                             <div className="rounded-xl bg-purple-50 p-3 text-purple-600">

//                                 <Wallet className="h-6 w-6" />

//                             </div>


//                             <span className="text-xs font-semibold text-purple-600">

//                                 Available

//                             </span>

//                         </div>


//                         <p className="text-sm text-gray-500">

//                             Income Wallet

//                         </p>


//                         <p className="mt-1 text-2xl font-bold text-gray-900">

//                             {loading
//                                 ? "..."
//                                 : `$${totalEarning.toFixed(2)}`
//                             }

//                         </p>

//                     </div>


//                     {/* REFERRAL CREDITS */}

//                     <div
//                         className="cursor-pointer rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"

//                         onClick={() =>
//                             navigate(
//                                 "/referral"
//                             )
//                         }
//                     >

//                         <div className="mb-4 flex items-center justify-between">

//                             <div className="rounded-xl bg-purple-50 p-3 text-purple-600">

//                                 <UserPlus className="h-6 w-6" />

//                             </div>


//                             <span className="text-xs font-semibold text-green-600">

//                                 Credited

//                             </span>

//                         </div>


//                         <p className="text-sm text-gray-500">

//                             Referral Transactions

//                         </p>


//                         <p className="mt-1 text-2xl font-bold text-gray-900">

//                             {loading
//                                 ? "..."
//                                 : referralTransactions
//                             }

//                         </p>

//                     </div>

//                 </div>


//                 {/* ================================================= */}
//                 {/* PROGRESS + REFERRAL */}
//                 {/* ================================================= */}

//                 <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">


//                     {/* ================================================= */}
//                     {/* ADS PROGRESS */}
//                     {/* ================================================= */}

//                     <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">

//                         <div className="flex items-start justify-between gap-4">

//                             <div>

//                                 <div className="mb-2 flex items-center gap-2">

//                                     <div className="rounded-xl bg-purple-50 p-2.5 text-purple-600">

//                                         <PlayCircle className="h-5 w-5" />

//                                     </div>


//                                     <h2 className="font-bold text-gray-900">

//                                         Ads Watching Progress

//                                     </h2>

//                                 </div>


//                                 <p className="text-sm text-gray-500">

//                                     {getAdsStatusText()}

//                                 </p>

//                             </div>


//                             <span className="shrink-0 rounded-full bg-purple-50 px-3 py-1 text-xs font-bold text-purple-700">

//                                 {loading
//                                     ? ".../..."
//                                     : `${adsWatched}/${totalAds}`
//                                 }

//                             </span>

//                         </div>


//                         <div className="mt-6">

//                             <div className="mb-2 flex justify-between text-xs font-medium">

//                                 <span className="text-gray-500">

//                                     Today's progress

//                                 </span>


//                                 <span className="text-purple-600">

//                                     {loading
//                                         ? "..."
//                                         : `${adProgress.toFixed(0)}%`
//                                     }

//                                 </span>

//                             </div>


//                             <div className="h-3 overflow-hidden rounded-full bg-purple-50">

//                                 <div
//                                     className="h-full rounded-full bg-purple-600 transition-all duration-700"

//                                     style={{
//                                         width:
//                                             `${adProgress}%`,
//                                     }}
//                                 />

//                             </div>

//                         </div>


//                         <div className="mt-6 grid grid-cols-2 gap-3">

//                             <div className="rounded-2xl bg-gray-50 p-4">

//                                 <p className="text-xs text-gray-500">

//                                     Ads Completed

//                                 </p>


//                                 <p className="mt-1 text-xl font-bold text-gray-900">

//                                     {loading
//                                         ? "..."
//                                         : adsWatched
//                                     }

//                                 </p>

//                             </div>


//                             <div className="rounded-2xl bg-gray-50 p-4">

//                                 <p className="text-xs text-gray-500">

//                                     Remaining

//                                 </p>


//                                 <p className="mt-1 text-xl font-bold text-purple-600">

//                                     {loading
//                                         ? "..."
//                                         : adsRemaining
//                                     }

//                                 </p>

//                             </div>

//                         </div>

//                     </div>


//                     {/* ================================================= */}
//                     {/* REFERRAL NETWORK */}
//                     {/* ================================================= */}

//                     <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">

//                         <div className="flex items-start justify-between">

//                             <div>

//                                 <div className="mb-2 flex items-center gap-2">

//                                     <div className="rounded-xl bg-purple-50 p-2.5 text-purple-600">

//                                         <Users className="h-5 w-5" />

//                                     </div>


//                                     <h2 className="font-bold text-gray-900">

//                                         Referral Network

//                                     </h2>

//                                 </div>


//                                 <p className="text-sm text-gray-500">

//                                     Track your referral income generated from subscriptions and upgrades.

//                                 </p>

//                             </div>


//                             <UserPlus className="h-6 w-6 text-purple-500" />

//                         </div>


//                         {/* TOTAL REFERRAL */}

//                         <div className="mt-6">

//                             <div className="mb-2 flex justify-between text-xs font-medium">

//                                 <span className="text-gray-500">

//                                     Total referral income

//                                 </span>


//                                 <span className="text-purple-600">

//                                     {loading
//                                         ? "..."
//                                         : `$${referralEarning.toFixed(2)}`
//                                     }

//                                 </span>

//                             </div>


//                             <div className="h-3 overflow-hidden rounded-full bg-purple-50">

//                                 <div
//                                     className="h-full rounded-full bg-purple-600 transition-all duration-700"

//                                     style={{
//                                         width:
//                                             referralEarning > 0
//                                                 ? "100%"
//                                                 : "0%",
//                                     }}
//                                 />

//                             </div>

//                         </div>


//                         {/* REFERRAL BREAKDOWN */}

//                         <div className="mt-6 grid grid-cols-2 gap-3">

//                             <div className="rounded-2xl bg-gray-50 p-4">

//                                 <p className="text-xs text-gray-500">

//                                     First Subscription

//                                 </p>


//                                 <p className="mt-1 text-xl font-bold text-gray-900">

//                                     {loading
//                                         ? "..."
//                                         : `$${firstSubscriptionIncome.toFixed(2)}`
//                                     }

//                                 </p>


//                                 <p className="mt-1 text-xs text-gray-400">

//                                     10% referral income

//                                 </p>

//                             </div>


//                             <div className="rounded-2xl bg-gray-50 p-4">

//                                 <p className="text-xs text-gray-500">

//                                     Upgrade Income

//                                 </p>


//                                 <p className="mt-1 text-xl font-bold text-purple-600">

//                                     {loading
//                                         ? "..."
//                                         : `$${upgradeIncome.toFixed(2)}`
//                                     }

//                                 </p>


//                                 <p className="mt-1 text-xs text-gray-400">

//                                     5% upgrade income

//                                 </p>

//                             </div>

//                         </div>


//                         {/* REFERRAL CREDITS */}

//                         <div className="mt-3 flex items-center justify-between rounded-2xl bg-purple-50 p-4">

//                             <div>

//                                 <p className="text-xs text-purple-600">

//                                     Referral Credits

//                                 </p>


//                                 <p className="mt-1 text-2xl font-bold text-purple-900">

//                                     {loading
//                                         ? "..."
//                                         : referralTransactions
//                                     }

//                                 </p>

//                             </div>


//                             <div className="rounded-xl bg-purple-600 p-3 text-white">

//                                 <TrendingUp className="h-5 w-5" />

//                             </div>

//                         </div>

//                     </div>

//                 </div>


//                 {/* ================================================= */}
//                 {/* WAYS TO GROW */}
//                 {/* ================================================= */}

//                 <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">

//                     <div className="mb-6">

//                         <div className="mb-2 flex items-center gap-2">

//                             <Sparkles className="h-5 w-5 text-purple-600" />


//                             <h2 className="text-xl font-bold text-gray-900">

//                                 Ways to Grow Your Earnings

//                             </h2>

//                         </div>


//                         <p className="text-sm text-gray-500">

//                             Stay active and explore the available earning opportunities.

//                         </p>

//                     </div>


//                     <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

//                         {earningPoints.map(
//                             (
//                                 item,
//                                 index
//                             ) => {

//                                 const Icon =
//                                     item.icon;


//                                 return (

//                                     <div
//                                         key={index}

//                                         className="group rounded-2xl border border-gray-100 bg-gray-50 p-5 transition duration-300 hover:border-purple-200 hover:bg-purple-50"
//                                     >

//                                         <div className="flex gap-4">

//                                             <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-purple-600 shadow-sm transition group-hover:bg-purple-600 group-hover:text-white">

//                                                 <Icon className="h-6 w-6" />

//                                             </div>


//                                             <div>

//                                                 <h3 className="font-bold text-gray-900">

//                                                     {item.title}

//                                                 </h3>


//                                                 <p className="mt-1 text-sm leading-6 text-gray-500">

//                                                     {item.description}

//                                                 </p>

//                                             </div>

//                                         </div>

//                                     </div>
//                                 );
//                             }
//                         )}

//                     </div>

//                 </div>


//                 {/* ================================================= */}
//                 {/* RECENT ACTIVITY */}
//                 {/* ================================================= */}

//                 <div className="rounded-3xl border border-gray-200 bg-white shadow-sm">
//                 </div>


//                 {/* ================================================= */}
//                 {/* BOTTOM CTA */}
//                 {/* ================================================= */}

//                 <div className="rounded-3xl border border-purple-100 bg-purple-50 p-6 sm:p-8">

//                     <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

//                         <div>

//                             <div className="mb-2 flex items-center gap-2">

//                                 <Gift className="h-5 w-5 text-purple-600" />


//                                 <h2 className="text-xl font-bold text-purple-900">

//                                     Keep Growing Your Network

//                                 </h2>

//                             </div>


//                             <p className="max-w-2xl text-sm leading-6 text-purple-700">

//                                 Watch eligible advertisements, stay active and invite new
//                                 members to explore the available reward opportunities.

//                             </p>

//                         </div>


//                         <button className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-200 transition hover:bg-purple-700">

//                             <UserPlus className="h-4 w-4" />

//                             Invite Friends

//                             <ArrowUpRight className="h-4 w-4" />

//                         </button>

//                     </div>

//                 </div>

//             </div>

//         </div>
//     );
// };


// export default MyEarning;

































=======
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
import React, { useEffect, useState } from "react";

import {
    Wallet,
    PlayCircle,
    Users,
    TrendingUp,
    Gift,
    ArrowUpRight,
    CheckCircle2,
    Sparkles,
    UserPlus,
    Coins,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
// =========================================================
// API
// =========================================================

const API_URL = import.meta.env.VITE_API_URL;

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
// =========================================================
// TYPES
// =========================================================

interface ReferralSummary {
    success: boolean;
    total_referral_income: string | number;
    first_subscription_income: string | number;
    upgrade_income: string | number;
    total_referral_transactions: number;
}

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
interface IncomeWalletResponse {
    success: boolean;
    balance: string | number;
    total_earned: string | number;
    total_withdrawn: string | number;
}

interface IncomeWalletSummaryResponse {
    success: boolean;
    daily_compounding: string | number;
}

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
interface DailyCompoundingStatus {
    success: boolean;

    subscription_active: boolean;

    can_watch_ad: boolean;

    reason: string;

    message: string;

    active_session: boolean;

    daily_ad_used: boolean;

    today_ads_watched: number;

    daily_ad_limit: number;

    ads_remaining_today: number;

    inside_ad_window: boolean;

    direct_referral_count: number;

    growth_percentage: number;

    earning_category: string;

    earning_multiplier: number;

    ad_watch_seconds: number;

    credit_delay_minutes: number;

    session?: {
        id: number;
        status: string;
        ad_started_at?: string | null;
        ad_completed_at?: string | null;
        watch_complete_at?: string | null;
        eligible_at?: string | null;
        watch_remaining_seconds?: number;
        credit_remaining_seconds?: number;
    } | null;
}

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
// =========================================================
// COMPONENT
// =========================================================

const MyEarning: React.FC = () => {
<<<<<<< HEAD
    const navigate = useNavigate();

=======

    const navigate = useNavigate();


>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
    // =====================================================
    // ADS EARNING
    //
    // Ads earning amount is not separately connected yet.
    // Daily ad watching progress IS connected below.
    // =====================================================

    const [
        adEarning,
        setAdEarning,
    ] = useState(0);

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
    // =====================================================
    // REFERRAL STATE
    // =====================================================

    const [
        referralSummary,
        setReferralSummary,
    ] = useState<ReferralSummary>({
        success: true,
        total_referral_income: "0.00",
        first_subscription_income: "0.00",
        upgrade_income: "0.00",
        total_referral_transactions: 0,
    });

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
    // =====================================================
    // INCOME WALLET STATE
    // =====================================================

    const [
        incomeWallet,
        setIncomeWallet,
    ] = useState<IncomeWalletResponse>({
        success: true,
        balance: "0.00",
        total_earned: "0.00",
        total_withdrawn: "0.00",
    });

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
    // =====================================================
    // DAILY COMPOUNDING / ADS PROGRESS STATE
    // =====================================================

    const [
        compoundingStatus,
        setCompoundingStatus,
    ] = useState<DailyCompoundingStatus>({
        success: true,

        subscription_active: false,

        can_watch_ad: false,

        reason: "",

        message: "",

        active_session: false,

        daily_ad_used: false,

        today_ads_watched: 0,

        daily_ad_limit: 1,

        ads_remaining_today: 1,

        inside_ad_window: false,

        direct_referral_count: 0,

        growth_percentage: 0,

        earning_category: "non_working",

        earning_multiplier: 2.5,

        ad_watch_seconds: 30,

        credit_delay_minutes: 5,

        session: null,
    });

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
    // =====================================================
    // LOADING / ERROR
    // =====================================================

    const [
        loading,
        setLoading,
    ] = useState(true);

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
    const [
        error,
        setError,
    ] = useState("");

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
    // =====================================================
    // GET TOKEN
    // =====================================================

    const getToken = (): string => {
<<<<<<< HEAD
        try {
=======

        try {

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
            const directToken =
                localStorage.getItem(
                    "access_token"
                );

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
            if (directToken) {
                return directToken;
            }

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
            const storedUser =
                localStorage.getItem(
                    "user"
                );

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
            if (!storedUser) {
                return "";
            }

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
            const user =
                JSON.parse(
                    storedUser
                );

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
            return (
                user?.access_token ||
                user?.accessToken ||
                ""
            );
<<<<<<< HEAD
        } catch (error) {
=======

        } catch (error) {

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
            console.error(
                "Unable to read token:",
                error
            );

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
            return "";
        }
    };

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
    // =====================================================
    // LOAD REAL EARNING DATA
    // =====================================================

    useEffect(() => {
<<<<<<< HEAD
        let isMounted = true;

        const loadEarningData =
            async () => {
                try {
                    setLoading(true);
                    setError("");

                    const token =
                        getToken();

                    if (!token) {
                        if (isMounted) {
=======

        let isMounted = true;


        const loadEarningData =
            async () => {

                try {

                    setLoading(true);

                    setError("");


                    const token =
                        getToken();


                    if (!token) {

                        if (isMounted) {

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                            setError(
                                "Login session not found. Please login again."
                            );
                        }

                        return;
                    }

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                    // =====================================
                    // COMMON HEADERS
                    // =====================================

                    const headers = {
<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                        Authorization:
                            `Bearer ${token}`,

                        "Content-Type":
                            "application/json",
                    };

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                    // =====================================
                    // REFERRAL + WALLET + ADS STATUS
                    // =====================================

                    const [
                        referralResponse,
                        walletResponse,
                        walletSummaryResponse,
                        compoundingResponse,
                    ] = await Promise.all([

                        fetch(
                            `${API_URL}/api/referral/summary`,
                            {
                                method: "GET",
                                headers,
                            }
                        ),

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                        fetch(
                            `${API_URL}/api/income-wallet`,
                            {
                                method: "GET",
                                headers,
                            }
                        ),

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                        fetch(
                            `${API_URL}/api/income-wallet/summary`,
                            {
                                method: "GET",
                                headers,
                            }
                        ),

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                        fetch(
                            `${API_URL}/api/daily-compounding/status`,
                            {
                                method: "GET",
                                headers,
                            }
                        ),
<<<<<<< HEAD
                    ]);

=======

                    ]);


>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                    // =====================================
                    // SESSION EXPIRED
                    // =====================================

                    if (
                        referralResponse.status === 401 ||
                        walletResponse.status === 401 ||
                        walletSummaryResponse.status === 401 ||
                        compoundingResponse.status === 401
                    ) {
<<<<<<< HEAD
                        if (isMounted) {
=======

                        if (isMounted) {

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                            setError(
                                "Login session expired. Please login again."
                            );
                        }

                        return;
                    }

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                    // =====================================
                    // JSON
                    // =====================================

                    const referralResult =
                        await referralResponse.json();

<<<<<<< HEAD
                    const walletResult =
                        await walletResponse.json();

                    const walletSummaryResult:
                        IncomeWalletSummaryResponse =
                        await walletSummaryResponse.json();

                    const compoundingResult =
                        await compoundingResponse.json();

=======

                    const walletResult =
                        await walletResponse.json();


                    const walletSummaryResult: IncomeWalletSummaryResponse =
                        await walletSummaryResponse.json();


                    const compoundingResult =
                        await compoundingResponse.json();


>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                    console.log(
                        "Referral Summary:",
                        referralResult
                    );

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                    console.log(
                        "Income Wallet:",
                        walletResult
                    );

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                    console.log(
                        "Daily Compounding Status:",
                        compoundingResult
                    );

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                    // =====================================
                    // REFERRAL ERROR
                    // =====================================

                    if (!referralResponse.ok) {
<<<<<<< HEAD
                        throw new Error(
                            referralResult?.detail ||
                            referralResult?.message ||
=======

                        throw new Error(

                            referralResult?.detail ||

                            referralResult?.message ||

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                            "Unable to load referral earnings."
                        );
                    }

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                    // =====================================
                    // WALLET ERROR
                    // =====================================

                    if (!walletResponse.ok) {
<<<<<<< HEAD
                        throw new Error(
                            walletResult?.detail ||
                            walletResult?.message ||
=======

                        throw new Error(

                            walletResult?.detail ||

                            walletResult?.message ||

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                            "Unable to load income wallet."
                        );
                    }

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                    // =====================================
                    // WALLET INCOME SUMMARY ERROR
                    // =====================================

                    if (!walletSummaryResponse.ok) {
<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                        throw new Error(
                            (walletSummaryResult as any)?.detail ||
                            (walletSummaryResult as any)?.message ||
                            "Unable to load ads earnings."
                        );
                    }

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                    // =====================================
                    // COMPOUNDING STATUS ERROR
                    // =====================================

                    if (!compoundingResponse.ok) {
<<<<<<< HEAD
                        throw new Error(
                            compoundingResult?.detail ||
                            compoundingResult?.message ||
=======

                        throw new Error(

                            compoundingResult?.detail ||

                            compoundingResult?.message ||

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                            "Unable to load ads progress."
                        );
                    }

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                    if (!isMounted) {
                        return;
                    }

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                    // =====================================
                    // SAVE REFERRAL
                    // =====================================

                    setReferralSummary({
<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                        success:
                            referralResult?.success ??
                            true,

                        total_referral_income:
                            referralResult
                                ?.total_referral_income ??
                            "0.00",

                        first_subscription_income:
                            referralResult
                                ?.first_subscription_income ??
                            "0.00",

                        upgrade_income:
                            referralResult
                                ?.upgrade_income ??
                            "0.00",

                        total_referral_transactions:
                            Number(
                                referralResult
                                    ?.total_referral_transactions ??
                                0
                            ),
                    });

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                    // =====================================
                    // SAVE WALLET
                    // =====================================

                    setIncomeWallet({
<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                        success:
                            walletResult?.success ??
                            true,

                        balance:
                            walletResult?.balance ??
                            "0.00",

                        total_earned:
                            walletResult?.total_earned ??
                            "0.00",

                        total_withdrawn:
                            walletResult?.total_withdrawn ??
                            "0.00",
                    });

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                    // =====================================
                    // SAVE ADS EARNING
                    // =====================================

                    setAdEarning(
                        Math.max(
                            Number(
                                walletSummaryResult?.daily_compounding ?? 0
                            ),
                            0
                        )
                    );

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                    // =====================================
                    // SAVE ADS / COMPOUNDING STATUS
                    // =====================================

                    setCompoundingStatus({
<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                        success:
                            compoundingResult?.success ??
                            true,

                        subscription_active:
                            Boolean(
                                compoundingResult
                                    ?.subscription_active
                            ),

                        can_watch_ad:
                            Boolean(
                                compoundingResult
                                    ?.can_watch_ad
                            ),

                        reason:
                            String(
                                compoundingResult?.reason ??
                                ""
                            ),

                        message:
                            String(
                                compoundingResult?.message ??
                                ""
                            ),

                        active_session:
                            Boolean(
                                compoundingResult
                                    ?.active_session
                            ),

                        daily_ad_used:
                            Boolean(
                                compoundingResult
                                    ?.daily_ad_used
                            ),

                        today_ads_watched:
                            Math.max(
                                Number(
                                    compoundingResult
                                        ?.today_ads_watched ??
                                    0
                                ),
                                0
                            ),

                        daily_ad_limit:
                            Math.max(
                                Number(
                                    compoundingResult
                                        ?.daily_ad_limit ??
                                    1
                                ),
                                1
                            ),

                        ads_remaining_today:
                            Math.max(
                                Number(
                                    compoundingResult
                                        ?.ads_remaining_today ??
                                    0
                                ),
                                0
                            ),

                        inside_ad_window:
                            Boolean(
                                compoundingResult
                                    ?.inside_ad_window
                            ),

                        direct_referral_count:
                            Number(
                                compoundingResult
                                    ?.direct_referral_count ??
                                0
                            ),

                        growth_percentage:
                            Number(
                                compoundingResult
                                    ?.growth_percentage ??
                                0
                            ),

                        earning_category:
                            String(
                                compoundingResult
                                    ?.earning_category ??
                                "non_working"
                            ),

                        earning_multiplier:
                            Number(
                                compoundingResult
                                    ?.earning_multiplier ??
                                2.5
                            ),

                        ad_watch_seconds:
                            Number(
                                compoundingResult
                                    ?.ad_watch_seconds ??
                                30
                            ),

                        credit_delay_minutes:
                            Number(
                                compoundingResult
                                    ?.credit_delay_minutes ??
                                5
                            ),

                        session:
                            compoundingResult?.session ??
                            null,
                    });

<<<<<<< HEAD
                } catch (err) {
=======

                } catch (err) {

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                    console.error(
                        "My Earning API Error:",
                        err
                    );

<<<<<<< HEAD
                    if (isMounted) {
                        let message =
                            "Unable to load earnings.";

                        if (
                            err instanceof Error
                        ) {
=======

                    if (isMounted) {

                        let message =
                            "Unable to load earnings.";


                        if (
                            err instanceof Error
                        ) {

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                            message =
                                err.message;
                        }

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                        setError(
                            message
                        );
                    }
<<<<<<< HEAD
                } finally {
                    if (isMounted) {
=======

                } finally {

                    if (isMounted) {

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                        setLoading(
                            false
                        );
                    }
                }
            };

<<<<<<< HEAD
        loadEarningData();

        return () => {
            isMounted = false;
        };
    }, []);

=======

        loadEarningData();


        return () => {

            isMounted = false;
        };

    }, []);


>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
    // =====================================================
    // NUMBER HELPER
    // =====================================================

    const toNumber = (
        value: string | number
    ): number => {
<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
        const parsed =
            Number(
                value || 0
            );

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
        return Number.isFinite(
            parsed
        )
            ? parsed
            : 0;
    };

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
    // =====================================================
    // REAL BACKEND VALUES
    // =====================================================

    const totalEarning =
        toNumber(
            incomeWallet.balance
        );

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
    const totalEarned =
        toNumber(
            incomeWallet.total_earned
        );

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
    const totalWithdrawn =
        toNumber(
            incomeWallet.total_withdrawn
        );

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
    const referralEarning =
        toNumber(
            referralSummary
                .total_referral_income
        );

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
    const firstSubscriptionIncome =
        toNumber(
            referralSummary
                .first_subscription_income
        );

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
    const upgradeIncome =
        toNumber(
            referralSummary
                .upgrade_income
        );

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
    const referralTransactions =
        referralSummary
            .total_referral_transactions;

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
    // =====================================================
    // REAL ADS PROGRESS VALUES
    // =====================================================

    const adsWatched =
        Math.max(
            Number(
                compoundingStatus
                    .today_ads_watched || 0
            ),
            0
        );

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
    const totalAds =
        Math.max(
            Number(
                compoundingStatus
                    .daily_ad_limit || 1
            ),
            1
        );

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
    const adsRemaining =
        Math.max(
            Number(
                compoundingStatus
                    .ads_remaining_today ?? 0
            ),
            0
        );

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
    // =====================================================
    // ADS PROGRESS %
    // =====================================================

    const adProgress =
        totalAds > 0
            ? Math.min(
                (
                    adsWatched /
                    totalAds
                )
                *
                100,
                100
            )
            : 0;

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
    // =====================================================
    // ADS STATUS TEXT
    // =====================================================

    const getAdsStatusText = () => {
<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
        if (loading) {
            return "Loading today's ads progress...";
        }

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
        if (
            compoundingStatus.reason ===
            "ad_running"
        ) {
<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
            return (
                "Advertisement is currently being watched."
            );
        }

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
        if (
            compoundingStatus.reason ===
            "credit_pending"
        ) {
<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
            return (
                "Today's ad is completed. Compounding income is pending."
            );
        }

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
        if (
            compoundingStatus.reason ===
            "credit_ready"
        ) {
<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
            return (
                "Today's ad is completed. Compounding income is ready."
            );
        }

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
        if (
            compoundingStatus.reason ===
            "daily_ad_completed"
        ) {
<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
            return (
                "You already watched today's ad. Please come back tomorrow."
            );
        }

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
        if (
            compoundingStatus.reason ===
            "available"
        ) {
<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
            return (
                "Today's ad is available to watch."
            );
        }

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
        if (
            compoundingStatus.reason ===
            "outside_ad_window"
        ) {
<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
            return (
                compoundingStatus.message ||
                "Ads are currently outside the available watching time."
            );
        }

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
        if (
            compoundingStatus.reason ===
            "subscription_inactive"
        ) {
<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
            return (
                "An active subscription is required to watch ads."
            );
        }

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
        if (
            compoundingStatus.reason ===
            "cycle_limit_reached"
        ) {
<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
            return (
                "Your current subscription cycle has reached its earning limit."
            );
        }

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
        return (
            compoundingStatus.message ||
            "Track your daily ad watching progress."
        );
    };

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
    // =====================================================
    // STATIC CONTENT
    // =====================================================

    const earningPoints = [
<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
        {
            icon: PlayCircle,

            title:
                "Watch Ads & Earn",

            description:
                "Watch available advertisements and receive rewards for completed ad views.",
        },

        {
            icon: Users,

            title:
                "Build Your Referral Network",

            description:
                "Invite new users and grow your network to unlock additional earning opportunities.",
        },

        {
            icon: TrendingUp,

            title:
                "Increase Your Activity",

            description:
                "Regular activity can help you maintain consistent earning progress.",
        },

        {
            icon: Gift,

            title:
                "Unlock More Rewards",

            description:
                "Participate in available campaigns, bonuses and promotional reward programs.",
        },
    ];
<<<<<<< HEAD

    const handlewithdwar = () => {
        navigate("/claim-ads-points");
    };
=======
  const handlewithdwar = () => {
    navigate("/claim-ads-points");
  };

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

    // =====================================================
    // UI
    // =====================================================

    return (
<<<<<<< HEAD
        <div className="min-h-screen w-full bg-gradient-to-br from-[#FFF9FA] via-[#F8EEF0] to-[#FFFFFF] px-4 py-5 text-gray-900 sm:px-6 lg:px-8">

            <div className="mx-auto max-w-7xl space-y-6">

=======

        <div className="min-h-screen w-full bg-gray-50 px-4 py-5 text-gray-900 sm:px-6 lg:px-8">

            <div className="mx-auto max-w-7xl space-y-6">


>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                {/* ================================================= */}
                {/* HEADER */}
                {/* ================================================= */}

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                    <div>

<<<<<<< HEAD
                        <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-[#D99AA3]/30 bg-[#FFE5E8]/70 px-3 py-1 text-xs font-semibold text-[#8F4F5A]">
=======
                        <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-purple-100 bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700">
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

                            <Sparkles className="h-3.5 w-3.5" />

                            Earning Dashboard

                        </div>

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">

                            My Earning

                        </h1>

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                        <p className="mt-1 text-sm text-gray-500 sm:text-base">

                            Track your ads, referrals and reward earnings in one place.

                        </p>

                    </div>

<<<<<<< HEAD
                    <button
                        className="flex w-fit items-center gap-2 rounded-xl bg-gradient-to-r from-[#8F4F5A] via-[#B76E79] to-[#D99AA3] px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-[#B76E79]/25 transition hover:from-[#7C414B] hover:via-[#A85F6B] hover:to-[#C9828C]"
                        onClick={handlewithdwar}
                    >
=======

                    <button className="flex w-fit items-center gap-2 rounded-xl bg-purple-600 px-5 py-
                     text-sm font-semibold text-white shadow-lg shadow-purple-200 transition hover:bg-purple-700 p-2"
                     onClick={handlewithdwar}
                     >
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

                        <Wallet className="h-4 w-4" />

                        Withdraw

                        <ArrowUpRight className="h-4 w-4" />

                    </button>

                </div>

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                {/* ================================================= */}
                {/* MAIN EARNING CARD */}
                {/* ================================================= */}

<<<<<<< HEAD
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#8F4F5A] via-[#B76E79] to-[#D99AA3] p-6 text-white shadow-xl shadow-[#B76E79]/20 sm:p-8">

                    <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

                    <div className="absolute -bottom-24 left-1/3 h-72 w-72 rounded-full bg-[#FFE5E8]/20 blur-3xl" />
=======
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-700 via-purple-600 to-purple-500 p-6 text-white shadow-xl shadow-purple-200 sm:p-8">

                    <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

                    <div className="absolute -bottom-24 left-1/3 h-72 w-72 rounded-full bg-purple-300/20 blur-3xl" />

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

                    <div className="relative z-10 grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-center">

                        <div>

<<<<<<< HEAD
                            <div className="mb-3 flex items-center gap-2 text-sm text-[#FFE5E8]">
=======
                            <div className="mb-3 flex items-center gap-2 text-sm text-purple-100">
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

                                <Wallet className="h-5 w-5" />

                                Total Earnings

                            </div>

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                            <div className="flex items-end gap-2">

                                <span className="text-5xl font-extrabold tracking-tight sm:text-6xl">

                                    {loading
                                        ? "..."
                                        : `$${totalEarning.toFixed(2)}`
                                    }

                                </span>

                            </div>

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                            <div className="mt-4 flex flex-wrap items-center gap-3">

                                <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium backdrop-blur">

                                    <TrendingUp className="h-3.5 w-3.5" />

                                    Income Wallet

                                </span>

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                                <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium backdrop-blur">

                                    <CheckCircle2 className="h-3.5 w-3.5" />

                                    Available Balance

                                </span>

                            </div>

                        </div>

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                        <div className="grid grid-cols-2 gap-3">

                            {/* ADS EARNING */}

                            <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">

<<<<<<< HEAD
                                <PlayCircle className="mb-3 h-6 w-6 text-[#FFE5E8]" />

                                <p className="text-xs text-[#FFE5E8]">
=======
                                <PlayCircle className="mb-3 h-6 w-6 text-purple-100" />

                                <p className="text-xs text-purple-100">
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

                                    Ads Earnings

                                </p>

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                                <p className="mt-1 text-xl font-bold">

                                    {loading
                                        ? "..."
                                        : `$${adEarning.toFixed(2)}`
                                    }

                                </p>

                            </div>

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                            {/* REFERRAL */}

                            <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">

<<<<<<< HEAD
                                <Users className="mb-3 h-6 w-6 text-[#FFE5E8]" />

                                <p className="text-xs text-[#FFE5E8]">
=======
                                <Users className="mb-3 h-6 w-6 text-purple-100" />

                                <p className="text-xs text-purple-100">
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

                                    Referral Earnings

                                </p>

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                                <p className="mt-1 text-xl font-bold">

                                    {loading
                                        ? "..."
                                        : `$${referralEarning.toFixed(2)}`
                                    }

                                </p>

                            </div>

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                            {/* TOTAL EARNED */}

                            <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">

<<<<<<< HEAD
                                <TrendingUp className="mb-3 h-6 w-6 text-[#FFE5E8]" />

                                <p className="text-xs text-[#FFE5E8]">
=======
                                <TrendingUp className="mb-3 h-6 w-6 text-purple-100" />

                                <p className="text-xs text-purple-100">
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

                                    Total Earned

                                </p>

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                                <p className="mt-1 text-xl font-bold">

                                    {loading
                                        ? "..."
                                        : `$${totalEarned.toFixed(2)}`
                                    }

                                </p>

                            </div>

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                            {/* TOTAL WITHDRAWN */}

                            <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">

<<<<<<< HEAD
                                <Coins className="mb-3 h-6 w-6 text-[#FFE5E8]" />

                                <p className="text-xs text-[#FFE5E8]">
=======
                                <Coins className="mb-3 h-6 w-6 text-purple-100" />

                                <p className="text-xs text-purple-100">
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

                                    Total Withdrawl

                                </p>

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                                <p className="mt-1 text-xl font-bold">

                                    {loading
                                        ? "..."
                                        : `$${totalWithdrawn.toFixed(2)}`
                                    }

                                </p>

                            </div>

                        </div>

                    </div>

                </div>

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                {/* ================================================= */}
                {/* ERROR */}
                {/* ================================================= */}

                {error && (

<<<<<<< HEAD
                    <div className="rounded-xl border border-[#D99AA3]/40 bg-[#FFF5F6] px-4 py-3 text-sm text-[#8F4F5A]">
=======
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

                        {error}

                    </div>

                )}

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                {/* ================================================= */}
                {/* EARNING STATS */}
                {/* ================================================= */}

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

<<<<<<< HEAD
                    {/* ADS EARNINGS */}

                    <div className="rounded-2xl border border-[#D99AA3]/25 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-[#D99AA3]/50 hover:shadow-lg">

                        <div className="mb-4 flex items-center justify-between">

                            <div className="rounded-xl bg-[#FFE5E8] p-3 text-[#B76E79]">
=======

                    {/* ADS EARNINGS */}

                    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

                        <div className="mb-4 flex items-center justify-between">

                            <div className="rounded-xl bg-purple-50 p-3 text-purple-600">
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

                                <PlayCircle className="h-6 w-6" />

                            </div>

<<<<<<< HEAD
                            <span className="text-xs font-semibold text-[#B76E79]">
=======

                            <span className="text-xs font-semibold text-purple-600">
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

                                Credited

                            </span>

                        </div>

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                        <p className="text-sm text-gray-500">

                            Ads Earnings

                        </p>

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                        <p className="mt-1 text-2xl font-bold text-gray-900">

                            ${adEarning.toFixed(2)}

                        </p>

                    </div>

<<<<<<< HEAD
                    {/* REFERRAL EARNINGS */}

                    <div
                        className="cursor-pointer rounded-2xl border border-[#D99AA3]/25 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-[#D99AA3]/50 hover:shadow-lg"
=======

                    {/* REFERRAL EARNINGS */}

                    <div
                        className="cursor-pointer rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                        onClick={() =>
                            navigate(
                                "/referral"
                            )
                        }
                    >

                        <div className="mb-4 flex items-center justify-between">

<<<<<<< HEAD
                            <div className="rounded-xl bg-[#FFE5E8] p-3 text-[#B76E79]">
=======
                            <div className="rounded-xl bg-purple-50 p-3 text-purple-600">
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

                                <Users className="h-6 w-6" />

                            </div>

<<<<<<< HEAD
                            <span className="text-xs font-semibold text-[#8F4F5A]">
=======

                            <span className="text-xs font-semibold text-green-600">
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

                                {loading
                                    ? "..."
                                    : `${referralTransactions} Credits`
                                }

                            </span>

                        </div>

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                        <p className="text-sm text-gray-500">

                            Referral Earnings

                        </p>

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                        <p className="mt-1 text-2xl font-bold text-gray-900">

                            {loading
                                ? "..."
                                : `$${referralEarning.toFixed(2)}`
                            }

                        </p>

                    </div>

<<<<<<< HEAD
                    {/* INCOME WALLET */}

                    <div
                        className="cursor-pointer rounded-2xl border border-[#D99AA3]/25 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-[#D99AA3]/50 hover:shadow-lg"
=======

                    {/* INCOME WALLET */}

                    <div
                        className="cursor-pointer rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

                        onClick={() =>
                            navigate(
                                "/incomewallet"
                            )
                        }
                    >

                        <div className="mb-4 flex items-center justify-between">

<<<<<<< HEAD
                            <div className="rounded-xl bg-[#FFE5E8] p-3 text-[#B76E79]">
=======
                            <div className="rounded-xl bg-purple-50 p-3 text-purple-600">
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

                                <Wallet className="h-6 w-6" />

                            </div>

<<<<<<< HEAD
                            <span className="text-xs font-semibold text-[#B76E79]">
=======

                            <span className="text-xs font-semibold text-purple-600">
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

                                Available

                            </span>

                        </div>

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                        <p className="text-sm text-gray-500">

                            Income Wallet

                        </p>

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                        <p className="mt-1 text-2xl font-bold text-gray-900">

                            {loading
                                ? "..."
                                : `$${totalEarning.toFixed(2)}`
                            }

                        </p>

                    </div>

<<<<<<< HEAD
                    {/* REFERRAL CREDITS */}

                    <div
                        className="cursor-pointer rounded-2xl border border-[#D99AA3]/25 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-[#D99AA3]/50 hover:shadow-lg"
=======

                    {/* REFERRAL CREDITS */}

                    <div
                        className="cursor-pointer rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

                        onClick={() =>
                            navigate(
                                "/referral"
                            )
                        }
                    >

                        <div className="mb-4 flex items-center justify-between">

<<<<<<< HEAD
                            <div className="rounded-xl bg-[#FFE5E8] p-3 text-[#B76E79]">
=======
                            <div className="rounded-xl bg-purple-50 p-3 text-purple-600">
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

                                <UserPlus className="h-6 w-6" />

                            </div>

<<<<<<< HEAD
                            <span className="text-xs font-semibold text-[#8F4F5A]">
=======

                            <span className="text-xs font-semibold text-green-600">
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

                                Credited

                            </span>

                        </div>

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                        <p className="text-sm text-gray-500">

                            Referral Transactions

                        </p>

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                        <p className="mt-1 text-2xl font-bold text-gray-900">

                            {loading
                                ? "..."
                                : referralTransactions
                            }

                        </p>

                    </div>

                </div>

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                {/* ================================================= */}
                {/* PROGRESS + REFERRAL */}
                {/* ================================================= */}

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                    {/* ================================================= */}
                    {/* ADS PROGRESS */}
                    {/* ================================================= */}

<<<<<<< HEAD
                    <div className="rounded-3xl border border-[#D99AA3]/25 bg-white p-6 shadow-sm">
=======
                    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

                        <div className="flex items-start justify-between gap-4">

                            <div>

                                <div className="mb-2 flex items-center gap-2">

<<<<<<< HEAD
                                    <div className="rounded-xl bg-[#FFE5E8] p-2.5 text-[#B76E79]">
=======
                                    <div className="rounded-xl bg-purple-50 p-2.5 text-purple-600">
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

                                        <PlayCircle className="h-5 w-5" />

                                    </div>

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                                    <h2 className="font-bold text-gray-900">

                                        Ads Watching Progress

                                    </h2>

                                </div>

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                                <p className="text-sm text-gray-500">

                                    {getAdsStatusText()}

                                </p>

                            </div>

<<<<<<< HEAD
                            <span className="shrink-0 rounded-full bg-[#FFE5E8] px-3 py-1 text-xs font-bold text-[#8F4F5A]">
=======

                            <span className="shrink-0 rounded-full bg-purple-50 px-3 py-1 text-xs font-bold text-purple-700">
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

                                {loading
                                    ? ".../..."
                                    : `${adsWatched}/${totalAds}`
                                }

                            </span>

                        </div>

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                        <div className="mt-6">

                            <div className="mb-2 flex justify-between text-xs font-medium">

                                <span className="text-gray-500">

                                    Today's progress

                                </span>

<<<<<<< HEAD
                                <span className="text-[#B76E79]">
=======

                                <span className="text-purple-600">
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

                                    {loading
                                        ? "..."
                                        : `${adProgress.toFixed(0)}%`
                                    }

                                </span>

                            </div>

<<<<<<< HEAD
                            <div className="h-3 overflow-hidden rounded-full bg-[#FFE5E8]">

                                <div
                                    className="h-full rounded-full bg-gradient-to-r from-[#8F4F5A] via-[#B76E79] to-[#D99AA3] transition-all duration-700"
=======

                            <div className="h-3 overflow-hidden rounded-full bg-purple-50">

                                <div
                                    className="h-full rounded-full bg-purple-600 transition-all duration-700"
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

                                    style={{
                                        width:
                                            `${adProgress}%`,
                                    }}
                                />

                            </div>

                        </div>

<<<<<<< HEAD
                        <div className="mt-6 grid grid-cols-2 gap-3">

                            <div className="rounded-2xl bg-[#FFF9FA] p-4">
=======

                        <div className="mt-6 grid grid-cols-2 gap-3">

                            <div className="rounded-2xl bg-gray-50 p-4">
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

                                <p className="text-xs text-gray-500">

                                    Ads Completed

                                </p>

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                                <p className="mt-1 text-xl font-bold text-gray-900">

                                    {loading
                                        ? "..."
                                        : adsWatched
                                    }

                                </p>

                            </div>

<<<<<<< HEAD
                            <div className="rounded-2xl bg-[#FFF9FA] p-4">
=======

                            <div className="rounded-2xl bg-gray-50 p-4">
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

                                <p className="text-xs text-gray-500">

                                    Remaining

                                </p>

<<<<<<< HEAD
                                <p className="mt-1 text-xl font-bold text-[#B76E79]">
=======

                                <p className="mt-1 text-xl font-bold text-purple-600">
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

                                    {loading
                                        ? "..."
                                        : adsRemaining
                                    }

                                </p>

                            </div>

                        </div>

                    </div>

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                    {/* ================================================= */}
                    {/* REFERRAL NETWORK */}
                    {/* ================================================= */}

<<<<<<< HEAD
                    <div className="rounded-3xl border border-[#D99AA3]/25 bg-white p-6 shadow-sm">
=======
                    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

                        <div className="flex items-start justify-between">

                            <div>

                                <div className="mb-2 flex items-center gap-2">

<<<<<<< HEAD
                                    <div className="rounded-xl bg-[#FFE5E8] p-2.5 text-[#B76E79]">
=======
                                    <div className="rounded-xl bg-purple-50 p-2.5 text-purple-600">
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

                                        <Users className="h-5 w-5" />

                                    </div>

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                                    <h2 className="font-bold text-gray-900">

                                        Referral Network

                                    </h2>

                                </div>

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                                <p className="text-sm text-gray-500">

                                    Track your referral income generated from subscriptions and upgrades.

                                </p>

                            </div>

<<<<<<< HEAD
                            <UserPlus className="h-6 w-6 text-[#B76E79]" />

                        </div>

=======

                            <UserPlus className="h-6 w-6 text-purple-500" />

                        </div>


>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                        {/* TOTAL REFERRAL */}

                        <div className="mt-6">

                            <div className="mb-2 flex justify-between text-xs font-medium">

                                <span className="text-gray-500">

                                    Total referral income

                                </span>

<<<<<<< HEAD
                                <span className="text-[#B76E79]">
=======

                                <span className="text-purple-600">
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

                                    {loading
                                        ? "..."
                                        : `$${referralEarning.toFixed(2)}`
                                    }

                                </span>

                            </div>

<<<<<<< HEAD
                            <div className="h-3 overflow-hidden rounded-full bg-[#FFE5E8]">

                                <div
                                    className="h-full rounded-full bg-gradient-to-r from-[#8F4F5A] via-[#B76E79] to-[#D99AA3] transition-all duration-700"
=======

                            <div className="h-3 overflow-hidden rounded-full bg-purple-50">

                                <div
                                    className="h-full rounded-full bg-purple-600 transition-all duration-700"
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

                                    style={{
                                        width:
                                            referralEarning > 0
                                                ? "100%"
                                                : "0%",
                                    }}
                                />

                            </div>

                        </div>

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                        {/* REFERRAL BREAKDOWN */}

                        <div className="mt-6 grid grid-cols-2 gap-3">

<<<<<<< HEAD
                            <div className="rounded-2xl bg-[#FFF9FA] p-4">
=======
                            <div className="rounded-2xl bg-gray-50 p-4">
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

                                <p className="text-xs text-gray-500">

                                    First Subscription

                                </p>

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                                <p className="mt-1 text-xl font-bold text-gray-900">

                                    {loading
                                        ? "..."
                                        : `$${firstSubscriptionIncome.toFixed(2)}`
                                    }

                                </p>

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                                <p className="mt-1 text-xs text-gray-400">

                                    10% referral income

                                </p>

                            </div>

<<<<<<< HEAD
                            <div className="rounded-2xl bg-[#FFF9FA] p-4">
=======

                            <div className="rounded-2xl bg-gray-50 p-4">
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

                                <p className="text-xs text-gray-500">

                                    Upgrade Income

                                </p>

<<<<<<< HEAD
                                <p className="mt-1 text-xl font-bold text-[#B76E79]">
=======

                                <p className="mt-1 text-xl font-bold text-purple-600">
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

                                    {loading
                                        ? "..."
                                        : `$${upgradeIncome.toFixed(2)}`
                                    }

                                </p>

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                                <p className="mt-1 text-xs text-gray-400">

                                    5% upgrade income

                                </p>

                            </div>

                        </div>

<<<<<<< HEAD
                        {/* REFERRAL CREDITS */}

                        <div className="mt-3 flex items-center justify-between rounded-2xl bg-[#FFE5E8] p-4">

                            <div>

                                <p className="text-xs text-[#8F4F5A]">
=======

                        {/* REFERRAL CREDITS */}

                        <div className="mt-3 flex items-center justify-between rounded-2xl bg-purple-50 p-4">

                            <div>

                                <p className="text-xs text-purple-600">
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

                                    Referral Credits

                                </p>

<<<<<<< HEAD
                                <p className="mt-1 text-2xl font-bold text-[#8F4F5A]">
=======

                                <p className="mt-1 text-2xl font-bold text-purple-900">
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

                                    {loading
                                        ? "..."
                                        : referralTransactions
                                    }

                                </p>

                            </div>

<<<<<<< HEAD
                            <div className="rounded-xl bg-gradient-to-br from-[#8F4F5A] to-[#B76E79] p-3 text-white">
=======

                            <div className="rounded-xl bg-purple-600 p-3 text-white">
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

                                <TrendingUp className="h-5 w-5" />

                            </div>

                        </div>

                    </div>

                </div>

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                {/* ================================================= */}
                {/* WAYS TO GROW */}
                {/* ================================================= */}

<<<<<<< HEAD
                <div className="rounded-3xl border border-[#D99AA3]/25 bg-white p-6 shadow-sm sm:p-8">
=======
                <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

                    <div className="mb-6">

                        <div className="mb-2 flex items-center gap-2">

<<<<<<< HEAD
                            <Sparkles className="h-5 w-5 text-[#B76E79]" />
=======
                            <Sparkles className="h-5 w-5 text-purple-600" />

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

                            <h2 className="text-xl font-bold text-gray-900">

                                Ways to Grow Your Earnings

                            </h2>

                        </div>

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                        <p className="text-sm text-gray-500">

                            Stay active and explore the available earning opportunities.

                        </p>

                    </div>

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                        {earningPoints.map(
                            (
                                item,
                                index
                            ) => {

                                const Icon =
                                    item.icon;

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                                return (

                                    <div
                                        key={index}

<<<<<<< HEAD
                                        className="group rounded-2xl border border-[#F3E2E5] bg-[#FFF9FA] p-5 transition duration-300 hover:border-[#D99AA3]/50 hover:bg-[#FFF5F6]"
=======
                                        className="group rounded-2xl border border-gray-100 bg-gray-50 p-5 transition duration-300 hover:border-purple-200 hover:bg-purple-50"
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                                    >

                                        <div className="flex gap-4">

<<<<<<< HEAD
                                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-[#B76E79] shadow-sm transition group-hover:bg-gradient-to-br group-hover:from-[#8F4F5A] group-hover:to-[#B76E79] group-hover:text-white">
=======
                                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-purple-600 shadow-sm transition group-hover:bg-purple-600 group-hover:text-white">
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

                                                <Icon className="h-6 w-6" />

                                            </div>

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                                            <div>

                                                <h3 className="font-bold text-gray-900">

                                                    {item.title}

                                                </h3>

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                                                <p className="mt-1 text-sm leading-6 text-gray-500">

                                                    {item.description}

                                                </p>

                                            </div>

                                        </div>

                                    </div>
                                );
                            }
                        )}

                    </div>

                </div>

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                {/* ================================================= */}
                {/* RECENT ACTIVITY */}
                {/* ================================================= */}

<<<<<<< HEAD
                <div className="rounded-3xl border border-[#D99AA3]/25 bg-white shadow-sm">
                </div>

=======
                <div className="rounded-3xl border border-gray-200 bg-white shadow-sm">
                </div>


>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                {/* ================================================= */}
                {/* BOTTOM CTA */}
                {/* ================================================= */}

<<<<<<< HEAD
                <div className="rounded-3xl border border-[#D99AA3]/35 bg-gradient-to-r from-[#FFF5F6] via-[#FFECEF] to-[#FFF9FA] p-6 sm:p-8">
=======
                <div className="rounded-3xl border border-purple-100 bg-purple-50 p-6 sm:p-8">
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

                    <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

                        <div>

                            <div className="mb-2 flex items-center gap-2">

<<<<<<< HEAD
                                <Gift className="h-5 w-5 text-[#B76E79]" />

                                <h2 className="text-xl font-bold text-[#8F4F5A]">
=======
                                <Gift className="h-5 w-5 text-purple-600" />


                                <h2 className="text-xl font-bold text-purple-900">
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

                                    Keep Growing Your Network

                                </h2>

                            </div>

<<<<<<< HEAD
                            <p className="max-w-2xl text-sm leading-6 text-[#8F4F5A]/75">
=======

                            <p className="max-w-2xl text-sm leading-6 text-purple-700">
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

                                Watch eligible advertisements, stay active and invite new
                                members to explore the available reward opportunities.

                            </p>

                        </div>

<<<<<<< HEAD
                        <button
                            className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#8F4F5A] via-[#B76E79] to-[#D99AA3] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#B76E79]/20 transition hover:from-[#7C414B] hover:via-[#A85F6B] hover:to-[#C9828C]"
                        >
=======

                        <button className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-200 transition hover:bg-purple-700">
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

                            <UserPlus className="h-4 w-4" />

                            Invite Friends

                            <ArrowUpRight className="h-4 w-4" />

                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
};

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
export default MyEarning;