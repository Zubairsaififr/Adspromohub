<<<<<<< HEAD
// "use client";

// import React, { useEffect, useState } from "react";
// import {
//   CreditCard,
//   Wallet,
//   TrendingUp,
//   ArrowRight,
//   CheckCircle2,
//   AlertCircle,
//   Loader2,
//   RefreshCw,
// } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import UserNavbar from "../UserDashboard/UserNavbar";


// interface SubscriptionData {
//   success: boolean;
//   subscription_active: boolean;
//   subscription_status: string;

//   cycle_id: number | null;
//   cycle_number: number | null;

//   current_amount: string | number;
//   total_cycle_earnings: string | number;
//   pending_amount: string | number;

//   started_at: string | null;
//   expired_at: string | null;
// }


// interface PurchaseResponse {
//   success: boolean;
//   message: string;

//   transaction_id: number;
//   cycle_id: number;
//   cycle_number: number;

//   transaction_type: string;

//   amount: string | number;
//   current_approved_amount: string | number;
//   projected_amount: string | number;

//   payment_network: string;
//   tx_hash: string | null;

//   status: string;
// }


// // const API_URL = "http://127.0.0.1:8000";
// const API_URL =
//   import.meta.env.VITE_API_URL ||
//   "http://127.0.0.1:8000";


// const MIN_AMOUNT = 20;
// const MIN_UPGRADE = 10;
// const MAX_AMOUNT = 200;
// const SUBSCRIPTION_STEP = 10;


// export default function Subscription() {
//   const navigate = useNavigate();

//   const [isDark, setIsDark] = useState(false);

//   const [subscription, setSubscription] =
//     useState<SubscriptionData | null>(null);

//   const [amount, setAmount] = useState("");

//   const [loading, setLoading] = useState(true);
//   const [purchasing, setPurchasing] = useState(false);

//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");


//   // ==================================================
//   // THEME
//   // ==================================================

//   useEffect(() => {
//     const savedTheme = localStorage.getItem("theme");

//     if (savedTheme === "dark") {
//       setIsDark(true);
//     } else {
//       setIsDark(false);
//     }
//   }, []);


//   useEffect(() => {
//     localStorage.setItem(
//       "theme",
//       isDark ? "dark" : "light"
//     );
//   }, [isDark]);


//   // ==================================================
//   // GET TOKEN
//   // ==================================================

//   const getToken = () => {
//     return localStorage.getItem("access_token");
//   };


//   // ==================================================
//   // AUTH ERROR
//   // ==================================================

//   const handleUnauthorized = () => {
//     localStorage.removeItem("access_token");
//     localStorage.removeItem("refresh_token");
//     localStorage.removeItem("user");

//     navigate("/signin", {
//       replace: true,
//     });
//   };


//   // ==================================================
//   // LOAD CURRENT SUBSCRIPTION
//   // ==================================================

//   const loadSubscription = async () => {
//     try {
//       setLoading(true);
//       setError("");

//       const token = getToken();

//       if (!token) {
//         navigate("/signin", {
//           replace: true,
//         });
//         return;
//       }

//       const response = await fetch(
//         `${API_URL}/api/subscription/current`,
//         {
//           method: "GET",

//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );


//       if (response.status === 401) {
//         handleUnauthorized();
//         return;
//       }


//       const data = await response.json();

//       console.log(
//         "Current Subscription:",
//         data
//       );


//       if (!response.ok) {
//         throw new Error(
//           data?.detail ||
//             data?.message ||
//             "Unable to load subscription details."
//         );
//       }


//       setSubscription(data);

//     } catch (err) {
//       console.error(
//         "Subscription Load Error:",
//         err
//       );

//       setError(
//         err instanceof Error
//           ? err.message
//           : "Unable to load subscription details."
//       );

//     } finally {
//       setLoading(false);
//     }
//   };


//   useEffect(() => {
//     loadSubscription();
//   }, []);


//   // ==================================================
//   // CURRENT VALUES
//   // ==================================================

//   const currentAmount = Number(
//     subscription?.current_amount || 0
//   );


//   const remainingUpgrade = Math.max(
//     MAX_AMOUNT - currentAmount,
//     0
//   );


//   const hasActiveSubscription =
//     Boolean(
//       subscription?.subscription_active
//     ) &&
//     currentAmount > 0;


//   const packageFull =
//     hasActiveSubscription &&
//     currentAmount >= MAX_AMOUNT;


//   // ==================================================
//   // AMOUNT CHANGE
//   // ==================================================

//   const handleAmountChange = (
//     e: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     const value = e.target.value;


//     if (value === "") {
//       setAmount("");
//       setError("");
//       setSuccess("");
//       return;
//     }


//     // Whole numbers only.
//     if (!/^\d+$/.test(value)) {
//       return;
//     }


//     setAmount(value);
//     setError("");
//     setSuccess("");
//   };


//   // ==================================================
//   // PURCHASE / UPGRADE
//   // ==================================================

//   const handlePurchase = async () => {
//     setError("");
//     setSuccess("");


//     const numericAmount = Number(amount);


//     // ------------------------------------------------
//     // BASIC VALIDATION
//     // ------------------------------------------------

//     if (
//       !amount ||
//       Number.isNaN(numericAmount)
//     ) {
//       setError(
//         "Please enter a valid subscription amount."
//       );

//       return;
//     }


//     // ------------------------------------------------
//     // $10 MULTIPLE
//     // ------------------------------------------------

//     if (
//       numericAmount %
//         SUBSCRIPTION_STEP !==
//       0
//     ) {
//       setError(
//         "Subscription amount must be a multiple of $10."
//       );

//       return;
//     }


//     // =================================================
//     // NEW SUBSCRIPTION
//     // =================================================

//     if (!hasActiveSubscription) {
//       if (numericAmount < MIN_AMOUNT) {
//         setError(
//           `Minimum subscription amount is $${MIN_AMOUNT.toFixed(
//             2
//           )}.`
//         );

//         return;
//       }


//       if (numericAmount > MAX_AMOUNT) {
//         setError(
//           `Maximum subscription amount is $${MAX_AMOUNT.toFixed(
//             2
//           )}.`
//         );

//         return;
//       }
//     }


//     // =================================================
//     // UPGRADE
//     // =================================================

//     if (hasActiveSubscription) {
//       if (packageFull) {
//         setError(
//           "Your subscription has already reached the maximum limit of $200."
//         );

//         return;
//       }


//       if (numericAmount < MIN_UPGRADE) {
//         setError(
//           `Minimum upgrade amount is $${MIN_UPGRADE.toFixed(
//             2
//           )}.`
//         );

//         return;
//       }


//       if (
//         currentAmount +
//           numericAmount >
//         MAX_AMOUNT
//       ) {
//         setError(
//           `You can add only up to $${remainingUpgrade.toFixed(
//             2
//           )}. Your maximum subscription limit is $200.00.`
//         );

//         return;
//       }
//     }


//     // ------------------------------------------------
//     // TOKEN
//     // ------------------------------------------------

//     const token = getToken();

//     if (!token) {
//       navigate("/signin", {
//         replace: true,
//       });

//       return;
//     }


//     try {
//       setPurchasing(true);


//       // =================================================
//       // BACKEND PURCHASE
//       // =================================================

//       const response = await fetch(
//         `${API_URL}/api/subscription/purchase`,
//         {
//           method: "POST",

//           headers: {
//             "Content-Type":
//               "application/json",

//             Authorization:
//               `Bearer ${token}`,
//           },

//           body: JSON.stringify({
//             amount: numericAmount,
//           }),
//         }
//       );


//       if (response.status === 401) {
//         handleUnauthorized();
//         return;
//       }


//       const data: PurchaseResponse =
//         await response.json();


//       console.log(
//         "Subscription Purchase Response:",
//         data
//       );


//       if (!response.ok) {
//         throw new Error(
//           (data as any)?.detail ||
//             data?.message ||
//             "Subscription purchase failed."
//         );
//       }


//       // =================================================
//       // SUCCESS
//       // =================================================

//       setSuccess(
//         data?.message ||
//           (
//             hasActiveSubscription
//               ? "Subscription upgraded successfully!"
//               : "Subscription activated successfully!"
//           )
//       );


//       setAmount("");


//       // Reload latest amount/status.
//       await loadSubscription();

//     } catch (err) {
//       console.error(
//         "Subscription Purchase Error:",
//         err
//       );


//       setError(
//         err instanceof Error
//           ? err.message
//           : "Something went wrong while processing your subscription."
//       );

//     } finally {
//       setPurchasing(false);
//     }
//   };


//   // ==================================================
//   // QUICK AMOUNT
//   // ==================================================

//   const selectAmount = (
//     value: number
//   ) => {
//     setAmount(
//       value.toString()
//     );

//     setError("");
//     setSuccess("");
//   };


//   // ==================================================
//   // FORMAT MONEY
//   // ==================================================

//   const money = (
//     value?: string | number
//   ) => {
//     const numeric = Number(
//       value || 0
//     );

//     return `$${numeric.toFixed(2)}`;
//   };


//   // ==================================================
//   // QUICK SELECT OPTIONS
//   // ==================================================

//   const quickAmounts =
//     hasActiveSubscription
//       ? [10, 20, 50, 100, 150]
//       : [20, 50, 100, 150, 200];


//   // ==================================================
//   // UI
//   // ==================================================

//   return (
//     <>
//       <UserNavbar />

//       <div
//         className={`flex min-h-screen w-full ${
//           isDark
//             ? "animated-gradient text-white"
//             : "bg-gray-50 text-gray-900"
//         }`}
//       >
//         {/* MAIN CONTENT */}
//         <div className="flex min-w-0 flex-1 flex-col">

//           <main
//             className={`flex-1 p-4 sm:p-6 lg:p-8 ${
//               isDark
//                 ? "animated-gradient"
//                 : "bg-gray-50"
//             }`}
//           >

//             {/* LOADING */}
//             {loading ? (
//               <div className="flex min-h-[60vh] items-center justify-center">

//                 <div
//                   className={`flex items-center gap-3 ${
//                     isDark
//                       ? "text-purple-300"
//                       : "text-purple-600"
//                   }`}
//                 >
//                   <Loader2 className="h-6 w-6 animate-spin" />

//                   <span>
//                     Loading subscription...
//                   </span>
//                 </div>

//               </div>
//             ) : (
//               <div className="mx-auto max-w-5xl mt-8">

//                 {/* HEADER */}
//                 <div className="mb-8">

//                   <div className="flex items-center gap-3">

//                     <div
//                       className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${
//                         isDark
//                           ? "border-purple-500/30 bg-purple-600/20"
//                           : "border-purple-200 bg-purple-100"
//                       }`}
//                     >
//                       <CreditCard
//                         className={`h-6 w-6 ${
//                           isDark
//                             ? "text-purple-400"
//                             : "text-purple-600"
//                         }`}
//                       />
//                     </div>


//                     <div>
//                       <h1
//                         className={`text-2xl font-bold md:text-3xl ${
//                           isDark
//                             ? "text-white"
//                             : "text-gray-900"
//                         }`}
//                       >
//                         Subscription
//                       </h1>


//                       <p
//                         className={`mt-1 text-sm ${
//                           isDark
//                             ? "text-gray-400"
//                             : "text-gray-500"
//                         }`}
//                       >
//                         Manage your subscription and start your
//                         earning cycle.
//                       </p>
//                     </div>

//                   </div>
//                 </div>


//                 {/* CURRENT SUBSCRIPTION */}
//                 {subscription && (
//                   <div
//                     className={`mb-8 rounded-3xl border p-6 shadow-sm ${
//                       isDark
//                         ? "border-purple-500/20 bg-gradient-to-br from-purple-950/40 via-black/40 to-black/20"
//                         : "border-purple-200 bg-gradient-to-br from-purple-50 via-white to-white"
//                     }`}
//                   >
//                     <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

//                       <div>
//                         <p
//                           className={`mb-2 text-sm ${
//                             isDark
//                               ? "text-gray-400"
//                               : "text-gray-500"
//                           }`}
//                         >
//                           Current Subscription
//                         </p>


//                         <div className="flex items-center gap-3">

//                           <h2
//                             className={`text-3xl font-bold ${
//                               isDark
//                                 ? "text-white"
//                                 : "text-gray-900"
//                             }`}
//                           >
//                             {money(
//                               subscription.current_amount
//                             )}
//                           </h2>


//                           <span
//                             className={`rounded-full border px-3 py-1 text-xs font-medium ${
//                               hasActiveSubscription
//                                 ? isDark
//                                   ? "border-green-500/20 bg-green-500/10 text-green-400"
//                                   : "border-green-200 bg-green-50 text-green-700"
//                                 : isDark
//                                 ? "border-red-500/20 bg-red-500/10 text-red-300"
//                                 : "border-red-200 bg-red-50 text-red-700"
//                             }`}
//                           >
//                             {hasActiveSubscription
//                               ? "ACTIVE"
//                               : "INACTIVE"}
//                           </span>

//                         </div>
//                       </div>


//                       <div className="grid grid-cols-2 gap-3 md:min-w-[360px]">

//                         <div
//                           className={`rounded-2xl border p-4 ${
//                             isDark
//                               ? "border-white/10 bg-white/[0.03]"
//                               : "border-gray-200 bg-white"
//                           }`}
//                         >
//                           <div
//                             className={`mb-2 flex items-center gap-2 text-xs ${
//                               isDark
//                                 ? "text-gray-400"
//                                 : "text-gray-500"
//                             }`}
//                           >
//                             <TrendingUp className="h-4 w-4" />
//                             Subscription
//                           </div>


//                           <p
//                             className={`font-semibold ${
//                               isDark
//                                 ? "text-white"
//                                 : "text-gray-900"
//                             }`}
//                           >
//                             {money(
//                               subscription.current_amount
//                             )}
//                           </p>
//                         </div>


//                         <div
//                           className={`rounded-2xl border p-4 ${
//                             isDark
//                               ? "border-white/10 bg-white/[0.03]"
//                               : "border-gray-200 bg-white"
//                           }`}
//                         >
//                           <div
//                             className={`mb-2 flex items-center gap-2 text-xs ${
//                               isDark
//                                 ? "text-gray-400"
//                                 : "text-gray-500"
//                             }`}
//                           >
//                             <Wallet className="h-4 w-4" />
//                             Upgrade Left
//                           </div>


//                           <p
//                             className={`font-semibold ${
//                               isDark
//                                 ? "text-white"
//                                 : "text-gray-900"
//                             }`}
//                           >
//                             {money(
//                               remainingUpgrade
//                             )}
//                           </p>
//                         </div>

//                       </div>
//                     </div>
//                   </div>
//                 )}


//                 {/* ERROR */}
//                 {error && (
//                   <div
//                     className={`mb-5 flex items-start gap-3 rounded-2xl border px-4 py-3 ${
//                       isDark
//                         ? "border-red-500/20 bg-red-500/10 text-red-300"
//                         : "border-red-200 bg-red-50 text-red-700"
//                     }`}
//                   >
//                     <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

//                     <p className="text-sm">
//                       {error}
//                     </p>
//                   </div>
//                 )}


//                 {/* SUCCESS */}
//                 {success && (
//                   <div
//                     className={`mb-5 flex items-start gap-3 rounded-2xl border px-4 py-3 ${
//                       isDark
//                         ? "border-green-500/20 bg-green-500/10 text-green-300"
//                         : "border-green-200 bg-green-50 text-green-700"
//                     }`}
//                   >
//                     <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />

//                     <p className="text-sm">
//                       {success}
//                     </p>
//                   </div>
//                 )}


//                 {/* PURCHASE AREA */}
//                 <div className="grid gap-6 lg:grid-cols-3">

//                   {/* LEFT */}
//                   <div
//                     className={`rounded-3xl border p-6 shadow-sm md:p-8 lg:col-span-2 ${
//                       isDark
//                         ? "border-white/10 bg-white/[0.03] backdrop-blur-xl"
//                         : "border-gray-200 bg-white"
//                     }`}
//                   >

//                     <div className="mb-7">
//                       <h2
//                         className={`text-xl font-semibold ${
//                           isDark
//                             ? "text-white"
//                             : "text-gray-900"
//                         }`}
//                       >
//                         {hasActiveSubscription
//                           ? packageFull
//                             ? "Subscription Limit Reached"
//                             : "Upgrade Subscription"
//                           : "Choose Subscription Amount"}
//                       </h2>


//                       <p
//                         className={`mt-2 text-sm ${
//                           isDark
//                             ? "text-gray-400"
//                             : "text-gray-500"
//                         }`}
//                       >
//                         {packageFull
//                           ? "Your active subscription has reached the maximum limit of $200."
//                           : "Enter the amount you want to subscribe with."}
//                       </p>
//                     </div>


//                     {/* QUICK AMOUNTS */}
//                     <div className="mb-6">

//                       <p
//                         className={`mb-3 text-xs uppercase tracking-wider ${
//                           isDark
//                             ? "text-gray-500"
//                             : "text-gray-400"
//                         }`}
//                       >
//                         Quick Select
//                       </p>


//                       <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">

//                         {quickAmounts.map(
//                           (value) => {
//                             const disabled =
//                               packageFull ||
//                               (
//                                 hasActiveSubscription &&
//                                 value >
//                                   remainingUpgrade
//                               );

//                             return (
//                               <button
//                                 key={value}
//                                 type="button"
//                                 disabled={disabled}
//                                 onClick={() =>
//                                   selectAmount(value)
//                                 }
//                                 className={`rounded-xl border px-4 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-40 ${
//                                   Number(amount) ===
//                                   value
//                                     ? isDark
//                                       ? "border-purple-500 bg-purple-600/20 text-purple-300"
//                                       : "border-purple-500 bg-purple-50 text-purple-700"
//                                     : isDark
//                                     ? "border-white/10 bg-white/[0.03] text-gray-300 hover:border-purple-500/40 hover:bg-purple-500/10"
//                                     : "border-gray-200 bg-white text-gray-700 hover:border-purple-300 hover:bg-purple-50"
//                                 }`}
//                               >
//                                 ${value}
//                               </button>
//                             );
//                           }
//                         )}

//                       </div>
//                     </div>


//                     {/* AMOUNT INPUT */}
//                     <div className="mb-6">

//                       <label
//                         className={`mb-2 block text-sm ${
//                           isDark
//                             ? "text-gray-300"
//                             : "text-gray-700"
//                         }`}
//                       >
//                         Subscription Amount
//                       </label>


//                       <div className="relative">

//                         <span
//                           className={`absolute left-5 top-1/2 -translate-y-1/2 text-xl font-semibold ${
//                             isDark
//                               ? "text-purple-400"
//                               : "text-purple-600"
//                           }`}
//                         >
//                           $
//                         </span>


//                         <input
//                           type="text"
//                           inputMode="numeric"
//                           value={amount}
//                           disabled={packageFull}
//                           onChange={
//                             handleAmountChange
//                           }
//                           placeholder="Enter amount"
//                           className={`w-full rounded-2xl border py-4 pl-10 pr-5 text-xl font-semibold outline-none transition focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50 ${
//                             isDark
//                               ? "border-white/10 bg-black/40 text-white placeholder:text-gray-600 focus:border-purple-500/60 focus:ring-purple-500/10"
//                               : "border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500/20"
//                           }`}
//                         />

//                       </div>


//                       <div
//                         className={`mt-2 flex justify-between text-xs ${
//                           isDark
//                             ? "text-gray-500"
//                             : "text-gray-400"
//                         }`}
//                       >
//                         <span>
//                           {hasActiveSubscription
//                             ? `Minimum Upgrade: $${MIN_UPGRADE.toFixed(
//                                 2
//                               )}`
//                             : `Minimum: $${MIN_AMOUNT.toFixed(
//                                 2
//                               )}`}
//                         </span>


//                         <span>
//                           {hasActiveSubscription
//                             ? `Upgrade Left: $${remainingUpgrade.toFixed(
//                                 2
//                               )}`
//                             : `Maximum: $${MAX_AMOUNT.toFixed(
//                                 2
//                               )}`}
//                         </span>

//                       </div>


//                       <p
//                         className={`mt-1 text-xs ${
//                           isDark
//                             ? "text-gray-600"
//                             : "text-gray-400"
//                         }`}
//                       >
//                         Amount must be in $10 increments.
//                       </p>

//                     </div>


//                     {/* PURCHASE BUTTON */}
//                     <button
//                       type="button"
//                       onClick={handlePurchase}
//                       disabled={
//                         purchasing ||
//                         packageFull
//                       }
//                       className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-purple-600 to-fuchsia-600 px-6 py-4 font-semibold text-white shadow-lg shadow-purple-900/20 transition hover:from-purple-500 hover:to-fuchsia-500 disabled:cursor-not-allowed disabled:opacity-50"
//                     >

//                       {purchasing ? (
//                         <>
//                           <Loader2 className="h-5 w-5 animate-spin" />
//                           Processing...
//                         </>
//                       ) : packageFull ? (
//                         <>
//                           <CheckCircle2 className="h-5 w-5" />
//                           Maximum Subscription Reached
//                         </>
//                       ) : (
//                         <>
//                           {hasActiveSubscription
//                             ? "Upgrade Subscription"
//                             : "Purchase Subscription"}

//                           <ArrowRight className="h-5 w-5" />
//                         </>
//                       )}

//                     </button>


//                     {/* PAYMENT NOTE */}
//                     <p
//                       className={`mt-4 text-center text-xs ${
//                         isDark
//                           ? "text-gray-600"
//                           : "text-gray-400"
//                       }`}
//                     >
//                       Payment gateway will be integrated here
//                       later.
//                     </p>

//                   </div>


//                   {/* RIGHT - INFO */}
//                   <div
//                     className={`rounded-3xl border p-6 shadow-sm ${
//                       isDark
//                         ? "border-white/10 bg-gradient-to-b from-purple-950/30 to-black/20"
//                         : "border-gray-200 bg-gradient-to-b from-purple-50 to-white"
//                     }`}
//                   >

//                     <div
//                       className={`mb-5 flex h-11 w-11 items-center justify-center rounded-xl border ${
//                         isDark
//                           ? "border-purple-500/20 bg-purple-500/10"
//                           : "border-purple-200 bg-purple-100"
//                       }`}
//                     >
//                       <TrendingUp
//                         className={`h-5 w-5 ${
//                           isDark
//                             ? "text-purple-400"
//                             : "text-purple-600"
//                         }`}
//                       />
//                     </div>


//                     <h3
//                       className={`mb-3 text-lg font-semibold ${
//                         isDark
//                           ? "text-white"
//                           : "text-gray-900"
//                       }`}
//                     >
//                       Subscription Benefits
//                     </h3>


//                     <div className="space-y-4">

//                       <div className="flex gap-3">
//                         <CheckCircle2
//                           className={`h-5 w-5 shrink-0 ${
//                             isDark
//                               ? "text-green-400"
//                               : "text-green-600"
//                           }`}
//                         />

//                         <div>
//                           <p
//                             className={`text-sm font-medium ${
//                               isDark
//                                 ? "text-white"
//                                 : "text-gray-900"
//                             }`}
//                           >
//                             Earning Cycle
//                           </p>

//                           <p
//                             className={`mt-1 text-xs ${
//                               isDark
//                                 ? "text-gray-500"
//                                 : "text-gray-500"
//                             }`}
//                           >
//                             Your subscription amount determines
//                             your earning cycle.
//                           </p>
//                         </div>
//                       </div>


//                       <div className="flex gap-3">
//                         <CheckCircle2
//                           className={`h-5 w-5 shrink-0 ${
//                             isDark
//                               ? "text-green-400"
//                               : "text-green-600"
//                           }`}
//                         />

//                         <div>
//                           <p
//                             className={`text-sm font-medium ${
//                               isDark
//                                 ? "text-white"
//                                 : "text-gray-900"
//                             }`}
//                           >
//                             Flexible Amount
//                           </p>

//                           <p
//                             className={`mt-1 text-xs ${
//                               isDark
//                                 ? "text-gray-500"
//                                 : "text-gray-500"
//                             }`}
//                           >
//                             Choose an amount between $20 and
//                             $200 in $10 increments.
//                           </p>
//                         </div>
//                       </div>


//                       <div className="flex gap-3">
//                         <CheckCircle2
//                           className={`h-5 w-5 shrink-0 ${
//                             isDark
//                               ? "text-green-400"
//                               : "text-green-600"
//                           }`}
//                         />

//                         <div>
//                           <p
//                             className={`text-sm font-medium ${
//                               isDark
//                                 ? "text-white"
//                                 : "text-gray-900"
//                             }`}
//                           >
//                             Upgrade Anytime
//                           </p>

//                           <p
//                             className={`mt-1 text-xs ${
//                               isDark
//                                 ? "text-gray-500"
//                                 : "text-gray-500"
//                             }`}
//                           >
//                             Increase your active subscription
//                             up to the maximum limit.
//                           </p>
//                         </div>
//                       </div>

//                     </div>


//                     {/* REFRESH */}
//                     <button
//                       type="button"
//                       onClick={
//                         loadSubscription
//                       }
//                       disabled={loading}
//                       className={`mt-7 flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm transition ${
//                         isDark
//                           ? "border-white/10 bg-white/[0.03] text-gray-300 hover:bg-white/[0.06]"
//                           : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
//                       }`}
//                     >
//                       <RefreshCw className="h-4 w-4" />
//                       Refresh Subscription
//                     </button>

//                   </div>
//                 </div>
//               </div>
//             )}
//           </main>
//         </div>


//         {/* GRADIENT ANIMATION */}
//         <style>
//           {`
//             .animated-gradient {
//               background: linear-gradient(
//                 90deg,
//                 #60a5fa,
//                 #a78bfa,
//                 #f472b6,
//                 #60a5fa
//               );
//               background-size: 300% 300%;
//               animation: gradientMove 10s ease infinite;
//             }

//             @keyframes gradientMove {
//               0% {
//                 background-position: 0% 50%;
//               }

//               50% {
//                 background-position: 100% 50%;
//               }

//               100% {
//                 background-position: 0% 50%;
//               }
//             }
//           `}
//         </style>

//       </div>
//     </>
//   );
// }














=======
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
"use client";

import React, { useEffect, useState } from "react";
import {
  CreditCard,
  Wallet,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import UserNavbar from "../UserDashboard/UserNavbar";

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
interface SubscriptionData {
  success: boolean;
  subscription_active: boolean;
  subscription_status: string;

  cycle_id: number | null;
  cycle_number: number | null;

  current_amount: string | number;
  total_cycle_earnings: string | number;
  pending_amount: string | number;

  started_at: string | null;
  expired_at: string | null;
}

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
interface PurchaseResponse {
  success: boolean;
  message: string;

  transaction_id: number;
  cycle_id: number;
  cycle_number: number;

  transaction_type: string;

  amount: string | number;
  current_approved_amount: string | number;
  projected_amount: string | number;

  payment_network: string;
  tx_hash: string | null;

  status: string;
}

<<<<<<< HEAD
=======

// const API_URL = "http://127.0.0.1:8000";
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:8000";

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
const MIN_AMOUNT = 20;
const MIN_UPGRADE = 10;
const MAX_AMOUNT = 200;
const SUBSCRIPTION_STEP = 10;

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
export default function Subscription() {
  const navigate = useNavigate();

  const [isDark, setIsDark] = useState(false);

  const [subscription, setSubscription] =
    useState<SubscriptionData | null>(null);

  const [amount, setAmount] = useState("");

  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
  // ==================================================
  // THEME
  // ==================================================

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
      setIsDark(true);
    } else {
      setIsDark(false);
    }
  }, []);

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
  useEffect(() => {
    localStorage.setItem(
      "theme",
      isDark ? "dark" : "light"
    );
  }, [isDark]);

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
  // ==================================================
  // GET TOKEN
  // ==================================================

  const getToken = () => {
    return localStorage.getItem("access_token");
  };

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
  // ==================================================
  // AUTH ERROR
  // ==================================================

  const handleUnauthorized = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");

    navigate("/signin", {
      replace: true,
    });
  };

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
  // ==================================================
  // LOAD CURRENT SUBSCRIPTION
  // ==================================================

  const loadSubscription = async () => {
    try {
      setLoading(true);
      setError("");

      const token = getToken();

      if (!token) {
        navigate("/signin", {
          replace: true,
        });
        return;
      }

      const response = await fetch(
        `${API_URL}/api/subscription/current`,
        {
          method: "GET",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
      const data = await response.json();

      console.log(
        "Current Subscription:",
        data
      );

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
      if (!response.ok) {
        throw new Error(
          data?.detail ||
            data?.message ||
            "Unable to load subscription details."
        );
      }

<<<<<<< HEAD
      setSubscription(data);
=======

      setSubscription(data);

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
    } catch (err) {
      console.error(
        "Subscription Load Error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load subscription details."
      );
<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
    } finally {
      setLoading(false);
    }
  };

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
  useEffect(() => {
    loadSubscription();
  }, []);

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
  // ==================================================
  // CURRENT VALUES
  // ==================================================

  const currentAmount = Number(
    subscription?.current_amount || 0
  );

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
  const remainingUpgrade = Math.max(
    MAX_AMOUNT - currentAmount,
    0
  );

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
  const hasActiveSubscription =
    Boolean(
      subscription?.subscription_active
    ) &&
    currentAmount > 0;

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
  const packageFull =
    hasActiveSubscription &&
    currentAmount >= MAX_AMOUNT;

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
  // ==================================================
  // AMOUNT CHANGE
  // ==================================================

  const handleAmountChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
    if (value === "") {
      setAmount("");
      setError("");
      setSuccess("");
      return;
    }

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
    // Whole numbers only.
    if (!/^\d+$/.test(value)) {
      return;
    }

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
    setAmount(value);
    setError("");
    setSuccess("");
  };

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
  // ==================================================
  // PURCHASE / UPGRADE
  // ==================================================

  const handlePurchase = async () => {
    setError("");
    setSuccess("");

<<<<<<< HEAD
    const numericAmount = Number(amount);

=======

    const numericAmount = Number(amount);


>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
    // ------------------------------------------------
    // BASIC VALIDATION
    // ------------------------------------------------

    if (
      !amount ||
      Number.isNaN(numericAmount)
    ) {
      setError(
        "Please enter a valid subscription amount."
      );

      return;
    }

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
    // ------------------------------------------------
    // $10 MULTIPLE
    // ------------------------------------------------

    if (
      numericAmount %
        SUBSCRIPTION_STEP !==
      0
    ) {
      setError(
        "Subscription amount must be a multiple of $10."
      );

      return;
    }

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
    // =================================================
    // NEW SUBSCRIPTION
    // =================================================

    if (!hasActiveSubscription) {
      if (numericAmount < MIN_AMOUNT) {
        setError(
          `Minimum subscription amount is $${MIN_AMOUNT.toFixed(
            2
          )}.`
        );

        return;
      }

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
      if (numericAmount > MAX_AMOUNT) {
        setError(
          `Maximum subscription amount is $${MAX_AMOUNT.toFixed(
            2
          )}.`
        );

        return;
      }
    }

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
    // =================================================
    // UPGRADE
    // =================================================

    if (hasActiveSubscription) {
      if (packageFull) {
        setError(
          "Your subscription has already reached the maximum limit of $200."
        );

        return;
      }

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
      if (numericAmount < MIN_UPGRADE) {
        setError(
          `Minimum upgrade amount is $${MIN_UPGRADE.toFixed(
            2
          )}.`
        );

        return;
      }

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
      if (
        currentAmount +
          numericAmount >
        MAX_AMOUNT
      ) {
        setError(
          `You can add only up to $${remainingUpgrade.toFixed(
            2
          )}. Your maximum subscription limit is $200.00.`
        );

        return;
      }
    }

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
    // ------------------------------------------------
    // TOKEN
    // ------------------------------------------------

    const token = getToken();

    if (!token) {
      navigate("/signin", {
        replace: true,
      });

      return;
    }

<<<<<<< HEAD
    try {
      setPurchasing(true);

=======

    try {
      setPurchasing(true);


>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
      // =================================================
      // BACKEND PURCHASE
      // =================================================

      const response = await fetch(
        `${API_URL}/api/subscription/purchase`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            amount: numericAmount,
          }),
        }
      );

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

<<<<<<< HEAD
      const data: PurchaseResponse =
        await response.json();

=======

      const data: PurchaseResponse =
        await response.json();


>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
      console.log(
        "Subscription Purchase Response:",
        data
      );

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
      if (!response.ok) {
        throw new Error(
          (data as any)?.detail ||
            data?.message ||
            "Subscription purchase failed."
        );
      }

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
      // =================================================
      // SUCCESS
      // =================================================

      setSuccess(
        data?.message ||
          (
            hasActiveSubscription
              ? "Subscription upgraded successfully!"
              : "Subscription activated successfully!"
          )
      );

<<<<<<< HEAD
      setAmount("");

      // Reload latest amount/status.
      await loadSubscription();
=======

      setAmount("");


      // Reload latest amount/status.
      await loadSubscription();

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
    } catch (err) {
      console.error(
        "Subscription Purchase Error:",
        err
      );

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while processing your subscription."
      );
<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
    } finally {
      setPurchasing(false);
    }
  };

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
  // ==================================================
  // QUICK AMOUNT
  // ==================================================

  const selectAmount = (
    value: number
  ) => {
    setAmount(
      value.toString()
    );

    setError("");
    setSuccess("");
  };

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
  // ==================================================
  // FORMAT MONEY
  // ==================================================

  const money = (
    value?: string | number
  ) => {
    const numeric = Number(
      value || 0
    );

    return `$${numeric.toFixed(2)}`;
  };

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
  // ==================================================
  // QUICK SELECT OPTIONS
  // ==================================================

  const quickAmounts =
    hasActiveSubscription
      ? [10, 20, 50, 100, 150]
      : [20, 50, 100, 150, 200];

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
  // ==================================================
  // UI
  // ==================================================

  return (
    <>
      <UserNavbar />

      <div
        className={`flex min-h-screen w-full ${
          isDark
            ? "animated-gradient text-white"
            : "bg-gray-50 text-gray-900"
        }`}
      >
        {/* MAIN CONTENT */}
        <div className="flex min-w-0 flex-1 flex-col">

          <main
            className={`flex-1 p-4 sm:p-6 lg:p-8 ${
              isDark
                ? "animated-gradient"
                : "bg-gray-50"
            }`}
          >

            {/* LOADING */}
            {loading ? (
              <div className="flex min-h-[60vh] items-center justify-center">

                <div
                  className={`flex items-center gap-3 ${
                    isDark
<<<<<<< HEAD
                      ? "text-[#D99AA3]"
                      : "text-[#B76E79]"
=======
                      ? "text-purple-300"
                      : "text-purple-600"
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                  }`}
                >
                  <Loader2 className="h-6 w-6 animate-spin" />

                  <span>
                    Loading subscription...
                  </span>
                </div>

              </div>
            ) : (
              <div className="mx-auto max-w-5xl mt-8">

                {/* HEADER */}
                <div className="mb-8">

                  <div className="flex items-center gap-3">

                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${
                        isDark
<<<<<<< HEAD
                          ? "border-[#B76E79]/30 bg-[#B76E79]/20"
                          : "border-[#D99AA3]/40 bg-[#FFE5E8]"
=======
                          ? "border-purple-500/30 bg-purple-600/20"
                          : "border-purple-200 bg-purple-100"
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                      }`}
                    >
                      <CreditCard
                        className={`h-6 w-6 ${
                          isDark
<<<<<<< HEAD
                            ? "text-[#D99AA3]"
                            : "text-[#B76E79]"
=======
                            ? "text-purple-400"
                            : "text-purple-600"
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                        }`}
                      />
                    </div>

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                    <div>
                      <h1
                        className={`text-2xl font-bold md:text-3xl ${
                          isDark
                            ? "text-white"
                            : "text-gray-900"
                        }`}
                      >
                        Subscription
                      </h1>

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                      <p
                        className={`mt-1 text-sm ${
                          isDark
                            ? "text-gray-400"
                            : "text-gray-500"
                        }`}
                      >
                        Manage your subscription and start your
                        earning cycle.
                      </p>
                    </div>

                  </div>
                </div>

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                {/* CURRENT SUBSCRIPTION */}
                {subscription && (
                  <div
                    className={`mb-8 rounded-3xl border p-6 shadow-sm ${
                      isDark
<<<<<<< HEAD
                        ? "border-[#B76E79]/20 bg-gradient-to-br from-[#8F4F5A]/30 via-black/40 to-black/20"
                        : "border-[#D99AA3]/40 bg-gradient-to-br from-[#FFE5E8] via-white to-white"
=======
                        ? "border-purple-500/20 bg-gradient-to-br from-purple-950/40 via-black/40 to-black/20"
                        : "border-purple-200 bg-gradient-to-br from-purple-50 via-white to-white"
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                    }`}
                  >
                    <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

                      <div>
                        <p
                          className={`mb-2 text-sm ${
                            isDark
                              ? "text-gray-400"
                              : "text-gray-500"
                          }`}
                        >
                          Current Subscription
                        </p>

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                        <div className="flex items-center gap-3">

                          <h2
                            className={`text-3xl font-bold ${
                              isDark
                                ? "text-white"
                                : "text-gray-900"
                            }`}
                          >
                            {money(
                              subscription.current_amount
                            )}
                          </h2>

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                          <span
                            className={`rounded-full border px-3 py-1 text-xs font-medium ${
                              hasActiveSubscription
                                ? isDark
                                  ? "border-green-500/20 bg-green-500/10 text-green-400"
                                  : "border-green-200 bg-green-50 text-green-700"
                                : isDark
                                ? "border-red-500/20 bg-red-500/10 text-red-300"
                                : "border-red-200 bg-red-50 text-red-700"
                            }`}
                          >
                            {hasActiveSubscription
                              ? "ACTIVE"
                              : "INACTIVE"}
                          </span>

                        </div>
                      </div>

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                      <div className="grid grid-cols-2 gap-3 md:min-w-[360px]">

                        <div
                          className={`rounded-2xl border p-4 ${
                            isDark
                              ? "border-white/10 bg-white/[0.03]"
                              : "border-gray-200 bg-white"
                          }`}
                        >
                          <div
                            className={`mb-2 flex items-center gap-2 text-xs ${
                              isDark
                                ? "text-gray-400"
                                : "text-gray-500"
                            }`}
                          >
                            <TrendingUp className="h-4 w-4" />
                            Subscription
                          </div>

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                          <p
                            className={`font-semibold ${
                              isDark
                                ? "text-white"
                                : "text-gray-900"
                            }`}
                          >
                            {money(
                              subscription.current_amount
                            )}
                          </p>
                        </div>

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                        <div
                          className={`rounded-2xl border p-4 ${
                            isDark
                              ? "border-white/10 bg-white/[0.03]"
                              : "border-gray-200 bg-white"
                          }`}
                        >
                          <div
                            className={`mb-2 flex items-center gap-2 text-xs ${
                              isDark
                                ? "text-gray-400"
                                : "text-gray-500"
                            }`}
                          >
                            <Wallet className="h-4 w-4" />
                            Upgrade Left
                          </div>

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                          <p
                            className={`font-semibold ${
                              isDark
                                ? "text-white"
                                : "text-gray-900"
                            }`}
                          >
                            {money(
                              remainingUpgrade
                            )}
                          </p>
                        </div>

                      </div>
                    </div>
                  </div>
                )}

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                {/* ERROR */}
                {error && (
                  <div
                    className={`mb-5 flex items-start gap-3 rounded-2xl border px-4 py-3 ${
                      isDark
                        ? "border-red-500/20 bg-red-500/10 text-red-300"
                        : "border-red-200 bg-red-50 text-red-700"
                    }`}
                  >
                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

                    <p className="text-sm">
                      {error}
                    </p>
                  </div>
                )}

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                {/* SUCCESS */}
                {success && (
                  <div
                    className={`mb-5 flex items-start gap-3 rounded-2xl border px-4 py-3 ${
                      isDark
                        ? "border-green-500/20 bg-green-500/10 text-green-300"
                        : "border-green-200 bg-green-50 text-green-700"
                    }`}
                  >
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />

                    <p className="text-sm">
                      {success}
                    </p>
                  </div>
                )}

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                {/* PURCHASE AREA */}
                <div className="grid gap-6 lg:grid-cols-3">

                  {/* LEFT */}
                  <div
                    className={`rounded-3xl border p-6 shadow-sm md:p-8 lg:col-span-2 ${
                      isDark
                        ? "border-white/10 bg-white/[0.03] backdrop-blur-xl"
                        : "border-gray-200 bg-white"
                    }`}
                  >

                    <div className="mb-7">
                      <h2
                        className={`text-xl font-semibold ${
                          isDark
                            ? "text-white"
                            : "text-gray-900"
                        }`}
                      >
                        {hasActiveSubscription
                          ? packageFull
                            ? "Subscription Limit Reached"
                            : "Upgrade Subscription"
                          : "Choose Subscription Amount"}
                      </h2>

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                      <p
                        className={`mt-2 text-sm ${
                          isDark
                            ? "text-gray-400"
                            : "text-gray-500"
                        }`}
                      >
                        {packageFull
                          ? "Your active subscription has reached the maximum limit of $200."
                          : "Enter the amount you want to subscribe with."}
                      </p>
                    </div>

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                    {/* QUICK AMOUNTS */}
                    <div className="mb-6">

                      <p
                        className={`mb-3 text-xs uppercase tracking-wider ${
                          isDark
                            ? "text-gray-500"
                            : "text-gray-400"
                        }`}
                      >
                        Quick Select
                      </p>

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">

                        {quickAmounts.map(
                          (value) => {
                            const disabled =
                              packageFull ||
                              (
                                hasActiveSubscription &&
                                value >
                                  remainingUpgrade
                              );

                            return (
                              <button
                                key={value}
                                type="button"
                                disabled={disabled}
                                onClick={() =>
                                  selectAmount(value)
                                }
                                className={`rounded-xl border px-4 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-40 ${
                                  Number(amount) ===
                                  value
                                    ? isDark
<<<<<<< HEAD
                                      ? "border-[#B76E79] bg-[#B76E79]/20 text-[#E3AAB2]"
                                      : "border-[#B76E79] bg-[#FFE5E8] text-[#8F4F5A]"
                                    : isDark
                                    ? "border-white/10 bg-white/[0.03] text-gray-300 hover:border-[#B76E79]/50 hover:bg-[#B76E79]/10"
                                    : "border-gray-200 bg-white text-gray-700 hover:border-[#D99AA3] hover:bg-[#FFE5E8]"
=======
                                      ? "border-purple-500 bg-purple-600/20 text-purple-300"
                                      : "border-purple-500 bg-purple-50 text-purple-700"
                                    : isDark
                                    ? "border-white/10 bg-white/[0.03] text-gray-300 hover:border-purple-500/40 hover:bg-purple-500/10"
                                    : "border-gray-200 bg-white text-gray-700 hover:border-purple-300 hover:bg-purple-50"
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                                }`}
                              >
                                ${value}
                              </button>
                            );
                          }
                        )}

                      </div>
                    </div>

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                    {/* AMOUNT INPUT */}
                    <div className="mb-6">

                      <label
                        className={`mb-2 block text-sm ${
                          isDark
                            ? "text-gray-300"
                            : "text-gray-700"
                        }`}
                      >
                        Subscription Amount
                      </label>

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                      <div className="relative">

                        <span
                          className={`absolute left-5 top-1/2 -translate-y-1/2 text-xl font-semibold ${
                            isDark
<<<<<<< HEAD
                              ? "text-[#D99AA3]"
                              : "text-[#B76E79]"
=======
                              ? "text-purple-400"
                              : "text-purple-600"
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                          }`}
                        >
                          $
                        </span>

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                        <input
                          type="text"
                          inputMode="numeric"
                          value={amount}
                          disabled={packageFull}
                          onChange={
                            handleAmountChange
                          }
                          placeholder="Enter amount"
                          className={`w-full rounded-2xl border py-4 pl-10 pr-5 text-xl font-semibold outline-none transition focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                            isDark
<<<<<<< HEAD
                              ? "border-white/10 bg-black/40 text-white placeholder:text-gray-600 focus:border-[#B76E79]/60 focus:ring-[#B76E79]/10"
                              : "border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:border-[#B76E79] focus:ring-[#B76E79]/20"
=======
                              ? "border-white/10 bg-black/40 text-white placeholder:text-gray-600 focus:border-purple-500/60 focus:ring-purple-500/10"
                              : "border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500/20"
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                          }`}
                        />

                      </div>

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                      <div
                        className={`mt-2 flex justify-between text-xs ${
                          isDark
                            ? "text-gray-500"
                            : "text-gray-400"
                        }`}
                      >
                        <span>
                          {hasActiveSubscription
                            ? `Minimum Upgrade: $${MIN_UPGRADE.toFixed(
                                2
                              )}`
                            : `Minimum: $${MIN_AMOUNT.toFixed(
                                2
                              )}`}
                        </span>

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                        <span>
                          {hasActiveSubscription
                            ? `Upgrade Left: $${remainingUpgrade.toFixed(
                                2
                              )}`
                            : `Maximum: $${MAX_AMOUNT.toFixed(
                                2
                              )}`}
                        </span>
<<<<<<< HEAD
                      </div>

=======

                      </div>


>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                      <p
                        className={`mt-1 text-xs ${
                          isDark
                            ? "text-gray-600"
                            : "text-gray-400"
                        }`}
                      >
                        Amount must be in $10 increments.
                      </p>

                    </div>

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                    {/* PURCHASE BUTTON */}
                    <button
                      type="button"
                      onClick={handlePurchase}
                      disabled={
                        purchasing ||
                        packageFull
                      }
<<<<<<< HEAD
                      className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-[#8F4F5A] via-[#B76E79] to-[#D99AA3] px-6 py-4 font-semibold text-white shadow-lg shadow-[#8F4F5A]/20 transition hover:from-[#B76E79] hover:to-[#E3AAB2] disabled:cursor-not-allowed disabled:opacity-50"
=======
                      className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-purple-600 to-fuchsia-600 px-6 py-4 font-semibold text-white shadow-lg shadow-purple-900/20 transition hover:from-purple-500 hover:to-fuchsia-500 disabled:cursor-not-allowed disabled:opacity-50"
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                    >

                      {purchasing ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Processing...
                        </>
                      ) : packageFull ? (
                        <>
                          <CheckCircle2 className="h-5 w-5" />
                          Maximum Subscription Reached
                        </>
                      ) : (
                        <>
                          {hasActiveSubscription
                            ? "Upgrade Subscription"
                            : "Purchase Subscription"}

                          <ArrowRight className="h-5 w-5" />
                        </>
                      )}

                    </button>

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                    {/* PAYMENT NOTE */}
                    <p
                      className={`mt-4 text-center text-xs ${
                        isDark
                          ? "text-gray-600"
                          : "text-gray-400"
                      }`}
                    >
                      Payment gateway will be integrated here
                      later.
                    </p>

                  </div>

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                  {/* RIGHT - INFO */}
                  <div
                    className={`rounded-3xl border p-6 shadow-sm ${
                      isDark
<<<<<<< HEAD
                        ? "border-white/10 bg-gradient-to-b from-[#8F4F5A]/25 to-black/20"
                        : "border-gray-200 bg-gradient-to-b from-[#FFE5E8] to-white"
=======
                        ? "border-white/10 bg-gradient-to-b from-purple-950/30 to-black/20"
                        : "border-gray-200 bg-gradient-to-b from-purple-50 to-white"
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                    }`}
                  >

                    <div
                      className={`mb-5 flex h-11 w-11 items-center justify-center rounded-xl border ${
                        isDark
<<<<<<< HEAD
                          ? "border-[#B76E79]/25 bg-[#B76E79]/10"
                          : "border-[#D99AA3]/40 bg-[#FFE5E8]"
=======
                          ? "border-purple-500/20 bg-purple-500/10"
                          : "border-purple-200 bg-purple-100"
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                      }`}
                    >
                      <TrendingUp
                        className={`h-5 w-5 ${
                          isDark
<<<<<<< HEAD
                            ? "text-[#D99AA3]"
                            : "text-[#B76E79]"
=======
                            ? "text-purple-400"
                            : "text-purple-600"
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                        }`}
                      />
                    </div>

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                    <h3
                      className={`mb-3 text-lg font-semibold ${
                        isDark
                          ? "text-white"
                          : "text-gray-900"
                      }`}
                    >
                      Subscription Benefits
                    </h3>

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                    <div className="space-y-4">

                      <div className="flex gap-3">
                        <CheckCircle2
                          className={`h-5 w-5 shrink-0 ${
                            isDark
                              ? "text-green-400"
                              : "text-green-600"
                          }`}
                        />

                        <div>
                          <p
                            className={`text-sm font-medium ${
                              isDark
                                ? "text-white"
                                : "text-gray-900"
                            }`}
                          >
                            Earning Cycle
                          </p>

                          <p
                            className={`mt-1 text-xs ${
                              isDark
                                ? "text-gray-500"
                                : "text-gray-500"
                            }`}
                          >
                            Your subscription amount determines
                            your earning cycle.
                          </p>
                        </div>
                      </div>

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                      <div className="flex gap-3">
                        <CheckCircle2
                          className={`h-5 w-5 shrink-0 ${
                            isDark
                              ? "text-green-400"
                              : "text-green-600"
                          }`}
                        />

                        <div>
                          <p
                            className={`text-sm font-medium ${
                              isDark
                                ? "text-white"
                                : "text-gray-900"
                            }`}
                          >
                            Flexible Amount
                          </p>

                          <p
                            className={`mt-1 text-xs ${
                              isDark
                                ? "text-gray-500"
                                : "text-gray-500"
                            }`}
                          >
                            Choose an amount between $20 and
                            $200 in $10 increments.
                          </p>
                        </div>
                      </div>

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                      <div className="flex gap-3">
                        <CheckCircle2
                          className={`h-5 w-5 shrink-0 ${
                            isDark
                              ? "text-green-400"
                              : "text-green-600"
                          }`}
                        />

                        <div>
                          <p
                            className={`text-sm font-medium ${
                              isDark
                                ? "text-white"
                                : "text-gray-900"
                            }`}
                          >
                            Upgrade Anytime
                          </p>

                          <p
                            className={`mt-1 text-xs ${
                              isDark
                                ? "text-gray-500"
                                : "text-gray-500"
                            }`}
                          >
                            Increase your active subscription
                            up to the maximum limit.
                          </p>
                        </div>
                      </div>

                    </div>

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                    {/* REFRESH */}
                    <button
                      type="button"
                      onClick={
                        loadSubscription
                      }
                      disabled={loading}
                      className={`mt-7 flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm transition ${
                        isDark
                          ? "border-white/10 bg-white/[0.03] text-gray-300 hover:bg-white/[0.06]"
                          : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <RefreshCw className="h-4 w-4" />
                      Refresh Subscription
                    </button>

                  </div>
                </div>
              </div>
            )}
          </main>
        </div>

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
        {/* GRADIENT ANIMATION */}
        <style>
          {`
            .animated-gradient {
              background: linear-gradient(
                90deg,
<<<<<<< HEAD
                #8F4F5A,
                #B76E79,
                #D99AA3,
                #8F4F5A
=======
                #60a5fa,
                #a78bfa,
                #f472b6,
                #60a5fa
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
              );
              background-size: 300% 300%;
              animation: gradientMove 10s ease infinite;
            }

            @keyframes gradientMove {
              0% {
                background-position: 0% 50%;
              }

              50% {
                background-position: 100% 50%;
              }

              100% {
                background-position: 0% 50%;
              }
            }
          `}
        </style>

      </div>
    </>
  );
}