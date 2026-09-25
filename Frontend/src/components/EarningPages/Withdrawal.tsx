import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowDownToLine,
  CheckCircle2,
  Clock3,
  Copy,
  History,
  Loader2,
  ShieldCheck,
  XCircle,
  Wallet,
} from "lucide-react";

import UserNavbar from "../UserDashboard/UserNavbar";

const API_URL = import.meta.env.VITE_API_URL;


// ============================================================
// TYPES
// ============================================================

interface Withdrawal {
  id: number;

  amount: string;
  fee: string;
  net_amount: string;
  fee_percentage?: string;

  bep20_address?: string;

  processing_type?: "auto" | "admin" | string;

  status: string;

  otp_verified: boolean;

  payment_reference: string | null;

  created_at: string;

  otp_verified_at?: string | null;

  approved_at: string | null;

  paid_at: string | null;

  rejected_at: string | null;

  cancelled_at?: string | null;
}


interface IncomeWalletData {
  success?: boolean;

  balance: number | string;

  total_earned: number | string;

  total_withdrawn: number | string;
}


interface WalletData {
  balance: number;

  pending_balance: number;

  total_earned: number;

  total_withdrawn: number;
}


interface CreateWithdrawalResponse {
  success: boolean;

  message: string;

  withdrawal_id: number;

  amount: number;

  fee: number;

  net_amount: number;

  processing_type: string;

  status: string;

  phone_number?: string;

  dev_otp?: string;
}


interface VerifyOTPResponse {
  success: boolean;

  message: string;

  withdrawal_id: number;

  otp_verified: boolean;

  processing_type: string;

  status: string;

  next_action: string;

  amount: number;

  fee: number;

  net_amount: number;
}


// ============================================================
// COMPONENT
// ============================================================

export default function Withdrawal() {
  const [isDark, setIsDark] = useState(false);

  const [amount, setAmount] = useState("");

  const [wallet, setWallet] =
    useState<WalletData | null>(null);

  const [withdrawals, setWithdrawals] =
    useState<Withdrawal[]>([]);

  const [withdrawalId, setWithdrawalId] =
    useState<number | null>(null);

  const [otp, setOtp] = useState("");

  const [devOtp, setDevOtp] = useState("");

  const [phoneNumber, setPhoneNumber] =
    useState("");

  const [step, setStep] =
    useState<"amount" | "otp" | "success">(
      "amount"
    );

  const [loading, setLoading] =
    useState(false);

  const [loadingWallet, setLoadingWallet] =
    useState(true);

  const [
    loadingHistory,
    setLoadingHistory,
  ] = useState(true);

  const [error, setError] = useState("");

  const [
    successMessage,
    setSuccessMessage,
  ] = useState("");

  const [
    completedWithdrawal,
    setCompletedWithdrawal,
  ] = useState<VerifyOTPResponse | null>(
    null
  );


  // ============================================================
  // AUTH
  // ============================================================

  const token =
    localStorage.getItem("access_token");


  // ============================================================
  // AMOUNT CALCULATION
  //
  // UI preview only.
  // Backend is still source of truth.
  // ============================================================

  const numericAmount =
    Number(amount || 0);

  const fee =
    numericAmount * 0.05;

  const netAmount =
    numericAmount - fee;


  // ============================================================
  // THEME
  // ============================================================

  useEffect(() => {
    const savedTheme =
      localStorage.getItem("theme");

    setIsDark(
      savedTheme === "dark"
    );
  }, []);


  useEffect(() => {
    localStorage.setItem(
      "theme",
      isDark ? "dark" : "light"
    );
  }, [isDark]);


  // ============================================================
  // AUTH HEADERS
  // ============================================================

  const authHeaders = () => ({
    Authorization: `Bearer ${token}`,
  });


  // ============================================================
  // CALCULATE PENDING BALANCE
  //
  // Reserved withdrawals:
  //
  // otp_pending
  // pending
  // approved
  //
  // Paid/rejected/cancelled are NOT pending.
  // ============================================================

  const calculatePendingBalance = (
    items: Withdrawal[]
  ) => {
    const pendingStatuses = [
      "otp_pending",
      "pending",
      "approved",
    ];

    return items.reduce(
      (total, item) => {
        if (
          pendingStatuses.includes(
            item.status.toLowerCase()
          )
        ) {
          return (
            total +
            Number(item.amount || 0)
          );
        }

        return total;
      },
      0
    );
  };


  // ============================================================
  // LOAD WITHDRAWALS
  // ============================================================

  const loadWithdrawals = async () => {
    if (!token) {
      setLoadingHistory(false);

      return [] as Withdrawal[];
    }

    try {
      setLoadingHistory(true);

      const response = await fetch(
        `${API_URL}/withdrawals/me`,
        {
          headers: authHeaders(),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail ||
            "Unable to load withdrawals."
        );
      }

      const items: Withdrawal[] =
        data.withdrawals || [];

      setWithdrawals(items);

      return items;
    } catch (error) {
      console.error(
        "Withdrawal history error:",
        error
      );

      return [] as Withdrawal[];
    } finally {
      setLoadingHistory(false);
    }
  };


  // ============================================================
  // LOAD WALLET
  //
  // Existing backend:
  //
  // GET /api/income-wallet
  // ============================================================

  const loadWallet = async (
    history?: Withdrawal[]
  ) => {
    if (!token) {
      setLoadingWallet(false);
      return;
    }

    try {
      setLoadingWallet(true);

      const response = await fetch(
        `${API_URL}/api/income-wallet`,
        {
          headers: authHeaders(),
        }
      );

      const data: IncomeWalletData =
        await response.json();

      if (!response.ok) {
        throw new Error(
          (data as any).detail ||
            "Unable to load wallet."
        );
      }

      let withdrawalHistory =
        history;

      if (!withdrawalHistory) {
        const historyResponse =
          await fetch(
            `${API_URL}/withdrawals/me`,
            {
              headers: authHeaders(),
            }
          );

        if (historyResponse.ok) {
          const historyData =
            await historyResponse.json();

          withdrawalHistory =
            historyData.withdrawals || [];
        } else {
          withdrawalHistory = [];
        }
      }

      const pendingBalance =
        calculatePendingBalance(
          withdrawalHistory || []
        );

      setWallet({
        balance:
          Number(data.balance || 0),

        pending_balance:
          pendingBalance,

        total_earned:
          Number(
            data.total_earned || 0
          ),

        total_withdrawn:
          Number(
            data.total_withdrawn || 0
          ),
      });
    } catch (error) {
      console.error(
        "Wallet error:",
        error
      );
    } finally {
      setLoadingWallet(false);
    }
  };


  // ============================================================
  // REFRESH PAGE DATA
  // ============================================================

  const refreshData = async () => {
    const history =
      await loadWithdrawals();

    await loadWallet(history);
  };


  // ============================================================
  // INITIAL LOAD
  // ============================================================

  useEffect(() => {
    if (!token) {
      setError(
        "Please login again."
      );

      setLoadingHistory(false);
      setLoadingWallet(false);

      return;
    }

    refreshData();
  }, []);


  // ============================================================
  // CREATE WITHDRAWAL
  // ============================================================

  const handleCreateWithdrawal = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setError("");
    setSuccessMessage("");
    setDevOtp("");
    setCompletedWithdrawal(null);


    if (!token) {
      setError(
        "Please login again."
      );

      return;
    }


    if (
      !amount ||
      !Number.isFinite(numericAmount) ||
      numericAmount <= 0
    ) {
      setError(
        "Please enter a valid withdrawal amount."
      );

      return;
    }


    if (numericAmount < 5) {
      setError(
        "Minimum withdrawal amount is $5.00."
      );

      return;
    }


    if (
      wallet &&
      numericAmount > wallet.balance
    ) {
      setError(
        `Insufficient balance. Available balance is $${wallet.balance.toFixed(
          2
        )}.`
      );

      return;
    }


    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/withdrawals/`,
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


      const data:
        CreateWithdrawalResponse &
        {
          detail?: string;
        } =
        await response.json();


      if (!response.ok) {
        throw new Error(
          data.detail ||
            "Withdrawal request failed."
        );
      }


      setWithdrawalId(
        data.withdrawal_id
      );

      setPhoneNumber(
        data.phone_number || ""
      );


      // ========================================================
      // DEVELOPMENT OTP
      // ========================================================

      if (data.dev_otp) {
        setDevOtp(
          data.dev_otp
        );
      }


      setStep("otp");


      if (data.dev_otp) {
        setSuccessMessage(
          "Withdrawal created successfully. Use the development OTP shown below."
        );
      } else {
        setSuccessMessage(
          "OTP has been sent to your registered phone number."
        );
      }


      await refreshData();
    } catch (error: any) {
      setError(
        error.message ||
          "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };


  // ============================================================
  // VERIFY OTP
  // ============================================================

  const handleVerifyOTP = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setError("");


    if (!token) {
      setError(
        "Please login again."
      );

      return;
    }


    if (!withdrawalId) {
      setError(
        "Withdrawal request not found."
      );

      return;
    }


    if (
      otp.length !== 6 ||
      !/^\d{6}$/.test(otp)
    ) {
      setError(
        "Please enter the 6-digit OTP."
      );

      return;
    }


    try {
      setLoading(true);


      const response = await fetch(
        `${API_URL}/withdrawals/${withdrawalId}/verify-otp`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            otp,
          }),
        }
      );


      const data:
        VerifyOTPResponse &
        {
          detail?: string;
        } =
        await response.json();


      if (!response.ok) {
        throw new Error(
          data.detail ||
            "OTP verification failed."
        );
      }


      setCompletedWithdrawal(
        data
      );

      setStep("success");


      // ========================================================
      // $5 - $20
      // ========================================================

      if (
        data.next_action ===
        "auto_payment"
      ) {
        setSuccessMessage(
          "OTP verified successfully. Your withdrawal is now pending automatic payment processing."
        );
      }

      // ========================================================
      // ABOVE $20
      // ========================================================

      else if (
        data.next_action ===
        "admin_approval"
      ) {
        setSuccessMessage(
          "OTP verified successfully. Your withdrawal is now pending admin approval."
        );
      }

      else {
        setSuccessMessage(
          data.message ||
            "OTP verified successfully."
        );
      }


      setDevOtp("");

      await refreshData();
    } catch (error: any) {
      setError(
        error.message ||
          "Invalid OTP."
      );
    } finally {
      setLoading(false);
    }
  };


  // ============================================================
  // RESET
  // ============================================================

  const startNewWithdrawal = () => {
    setAmount("");

    setOtp("");

    setDevOtp("");

    setWithdrawalId(null);

    setPhoneNumber("");

    setError("");

    setSuccessMessage("");

    setCompletedWithdrawal(null);

    setStep("amount");
  };


  // ============================================================
  // COPY
  // ============================================================

  const copyText = async (
    value: string
  ) => {
    try {
      await navigator.clipboard.writeText(
        value
      );
    } catch (error) {
      console.error(
        "Copy failed:",
        error
      );
    }
  };


  // ============================================================
  // STATUS STYLE
  // ============================================================

  const getStatusStyle = (
    status: string
  ) => {
    switch (
      status.toLowerCase()
    ) {
      case "paid":
      case "completed":
        return isDark
          ? "bg-green-500/10 text-green-400 border-green-500/20"
          : "bg-green-50 text-green-700 border-green-200";


      case "approved":
        return isDark
          ? "bg-blue-500/10 text-blue-300 border-blue-500/20"
          : "bg-blue-50 text-blue-700 border-blue-200";


      case "otp_pending":
        return isDark
          ? "bg-orange-500/10 text-orange-300 border-orange-500/20"
          : "bg-orange-50 text-orange-700 border-orange-200";


      case "pending":
        return isDark
          ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
          : "bg-yellow-50 text-yellow-700 border-yellow-200";


      case "rejected":
      case "cancelled":
        return isDark
          ? "bg-red-500/10 text-red-400 border-red-500/20"
          : "bg-red-50 text-red-700 border-red-200";


      default:
        return isDark
          ? "bg-white/5 text-gray-300 border-white/10"
          : "bg-gray-100 text-gray-600 border-gray-200";
    }
  };


  // ============================================================
  // STATUS LABEL
  // ============================================================

  const getStatusLabel = (
    status: string
  ) => {
    switch (
      status.toLowerCase()
    ) {
      case "otp_pending":
        return "OTP PENDING";

      case "pending":
        return "PENDING";

      case "approved":
        return "APPROVED";

      case "paid":
        return "PAID";

      case "rejected":
        return "REJECTED";

      case "cancelled":
        return "CANCELLED";

      default:
        return status
          .replace(/_/g, " ")
          .toUpperCase();
    }
  };


  // ============================================================
  // STATUS MESSAGE
  // ============================================================

  const getHistoryStatusMessage = (
    item: Withdrawal
  ) => {
    const status =
      item.status.toLowerCase();


    if (status === "otp_pending") {
      return (
        "OTP verification is pending."
      );
    }


    if (status === "pending") {
      if (
        item.processing_type ===
        "auto"
      ) {
        return (
          "Verified and waiting for automatic payment processing."
        );
      }

      return (
        "Verified and pending admin approval."
      );
    }


    if (status === "approved") {
      return (
        "Approved and waiting for payment."
      );
    }


    if (status === "paid") {
      return (
        "Withdrawal paid successfully."
      );
    }


    if (status === "rejected") {
      return (
        "Withdrawal was rejected and the reserved amount was returned to your wallet."
      );
    }


    if (status === "cancelled") {
      return (
        "Withdrawal was cancelled."
      );
    }


    return "";
  };


  // ============================================================
  // FORMAT DATE
  // ============================================================

  const formatDate = (
    date?: string | null
  ) => {
    if (!date) {
      return "-";
    }

    return new Date(
      date
    ).toLocaleString();
  };


  // ============================================================
  // SUCCESS DATA
  // ============================================================

  const successAmount =
    completedWithdrawal?.amount ??
    numericAmount;

  const successFee =
    completedWithdrawal?.fee ??
    fee;

  const successNetAmount =
    completedWithdrawal?.net_amount ??
    netAmount;


  // ============================================================
  // PROCESSING DESCRIPTION
  // ============================================================

  const processingDescription =
    useMemo(() => {
      if (
        numericAmount >= 5 &&
        numericAmount <= 20
      ) {
        return (
          "This amount qualifies for automatic processing after OTP verification."
        );
      }

      if (numericAmount > 20) {
        return (
          "Withdrawals above $20 require admin approval after OTP verification."
        );
      }

      return "";
    }, [numericAmount]);


  // ============================================================
  // UI
  // ============================================================

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
        <div className="flex min-w-0 flex-1 flex-col">
          <main
            className={`flex-1 p-4 sm:p-6 lg:p-8 ${
              isDark
                ? "animated-gradient"
                : "bg-gray-50"
            }`}
          >
            <div className="mx-auto max-w-6xl">

              {/* ==================================================
                  HEADER
              ================================================== */}

              <div className="mb-8">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${
                      isDark
                        ? "border-purple-500/20 bg-purple-600/20"
                        : "border-purple-200 bg-purple-100"
                    }`}
                  >
                    <ArrowDownToLine
                      size={24}
                      className={
                        isDark
                          ? "text-purple-400"
                          : "text-purple-600"
                      }
                    />
                  </div>

                  <div>
                    <h1
                      className={`text-2xl font-bold md:text-3xl ${
                        isDark
                          ? "text-white"
                          : "text-gray-900"
                      }`}
                    >
                      Withdrawal
                    </h1>

                    <p
                      className={`text-sm ${
                        isDark
                          ? "text-gray-400"
                          : "text-gray-500"
                      }`}
                    >
                      Withdraw your available earnings securely
                    </p>
                  </div>
                </div>
              </div>


              {/* ==================================================
                  WALLET SUMMARY
              ================================================== */}

              <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">

                {/* AVAILABLE */}

                <div
                  className={`rounded-2xl border p-5 shadow-sm ${
                    isDark
                      ? "border-white/10 bg-white/[0.03] backdrop-blur-xl"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <p
                    className={`text-sm ${
                      isDark
                        ? "text-gray-400"
                        : "text-gray-500"
                    }`}
                  >
                    Available Balance
                  </p>

                  <p
                    className={`mt-2 text-3xl font-bold ${
                      isDark
                        ? "text-white"
                        : "text-gray-900"
                    }`}
                  >
                    {loadingWallet
                      ? "..."
                      : `$${(
                          wallet?.balance ??
                          0
                        ).toFixed(2)}`}
                  </p>
                </div>


                {/* PENDING */}

                <div
                  className={`rounded-2xl border p-5 shadow-sm ${
                    isDark
                      ? "border-white/10 bg-white/[0.03] backdrop-blur-xl"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <p
                    className={`text-sm ${
                      isDark
                        ? "text-gray-400"
                        : "text-gray-500"
                    }`}
                  >
                    Pending Withdrawal
                  </p>

                  <p
                    className={`mt-2 text-3xl font-bold ${
                      isDark
                        ? "text-yellow-400"
                        : "text-yellow-600"
                    }`}
                  >
                    {loadingWallet
                      ? "..."
                      : `$${(
                          wallet?.pending_balance ??
                          0
                        ).toFixed(2)}`}
                  </p>
                </div>


                {/* TOTAL WITHDRAWN */}

                <div
                  className={`rounded-2xl border p-5 shadow-sm ${
                    isDark
                      ? "border-white/10 bg-white/[0.03] backdrop-blur-xl"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <p
                    className={`text-sm ${
                      isDark
                        ? "text-gray-400"
                        : "text-gray-500"
                    }`}
                  >
                    Total Withdrawal
                  </p>

                  <p
                    className={`mt-2 text-3xl font-bold ${
                      isDark
                        ? "text-green-400"
                        : "text-green-600"
                    }`}
                  >
                    {loadingWallet
                      ? "..."
                      : `$${(
                          wallet?.total_withdrawn ??
                          0
                        ).toFixed(2)}`}
                  </p>
                </div>
              </div>


              {/* ==================================================
                  MAIN GRID
              ================================================== */}

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

                {/* =================================================
                    WITHDRAWAL CARD
                ================================================= */}

                <div
                  className={`rounded-3xl border p-6 shadow-sm md:p-8 ${
                    isDark
                      ? "border-white/10 bg-white/[0.03] backdrop-blur-xl"
                      : "border-gray-200 bg-white"
                  }`}
                >

                  {/* ===============================================
                      AMOUNT STEP
                  =============================================== */}

                  {step === "amount" && (
                    <>
                      <div className="mb-6">
                        <h2
                          className={`text-xl font-semibold ${
                            isDark
                              ? "text-white"
                              : "text-gray-900"
                          }`}
                        >
                          Request Withdrawal
                        </h2>

                        <p
                          className={`mt-1 text-sm ${
                            isDark
                              ? "text-gray-400"
                              : "text-gray-500"
                          }`}
                        >
                          Minimum withdrawal amount is $5.00
                        </p>
                      </div>


                      <form
                        onSubmit={
                          handleCreateWithdrawal
                        }
                        className="space-y-5"
                      >
                        <div>
                          <label
                            className={`mb-2 block text-sm ${
                              isDark
                                ? "text-gray-300"
                                : "text-gray-700"
                            }`}
                          >
                            Withdrawal Amount
                          </label>

                          <div className="relative">
                            <span
                              className={`absolute left-4 top-1/2 -translate-y-1/2 text-lg ${
                                isDark
                                  ? "text-gray-400"
                                  : "text-gray-500"
                              }`}
                            >
                              $
                            </span>

                            <input
                              type="number"
                              min="5"
                              step="0.01"
                              value={amount}
                              onChange={(e) =>
                                setAmount(
                                  e.target.value
                                )
                              }
                              placeholder="Enter amount"
                              className={`w-full rounded-xl border py-4 pl-9 pr-4 text-lg outline-none transition ${
                                isDark
                                  ? "border-white/10 bg-black/40 text-white focus:border-purple-500"
                                  : "border-gray-200 bg-white text-gray-900 focus:border-purple-500"
                              }`}
                            />
                          </div>
                        </div>


                        {/* CALCULATION */}

                        {numericAmount > 0 && (
                          <div
                            className={`space-y-3 rounded-2xl border p-4 ${
                              isDark
                                ? "border-white/10 bg-black/30"
                                : "border-gray-200 bg-gray-50"
                            }`}
                          >
                            <div className="flex justify-between text-sm">
                              <span
                                className={
                                  isDark
                                    ? "text-gray-400"
                                    : "text-gray-500"
                                }
                              >
                                Withdrawal Amount
                              </span>

                              <span
                                className={
                                  isDark
                                    ? "text-white"
                                    : "text-gray-900"
                                }
                              >
                                $
                                {numericAmount.toFixed(
                                  2
                                )}
                              </span>
                            </div>


                            <div className="flex justify-between text-sm">
                              <span
                                className={
                                  isDark
                                    ? "text-gray-400"
                                    : "text-gray-500"
                                }
                              >
                                Withdrawal Fee (5%)
                              </span>

                              <span
                                className={
                                  isDark
                                    ? "text-red-400"
                                    : "text-red-600"
                                }
                              >
                                -$
                                {fee.toFixed(2)}
                              </span>
                            </div>


                            <div
                              className={`flex justify-between border-t pt-3 ${
                                isDark
                                  ? "border-white/10"
                                  : "border-gray-200"
                              }`}
                            >
                              <span
                                className={`font-medium ${
                                  isDark
                                    ? "text-white"
                                    : "text-gray-900"
                                }`}
                              >
                                You'll Receive
                              </span>

                              <span
                                className={`font-bold ${
                                  isDark
                                    ? "text-green-400"
                                    : "text-green-600"
                                }`}
                              >
                                $
                                {netAmount.toFixed(
                                  2
                                )}
                              </span>
                            </div>


                            {processingDescription && (
                              <div
                                className={`border-t pt-3 text-xs leading-5 ${
                                  isDark
                                    ? "border-white/10 text-gray-400"
                                    : "border-gray-200 text-gray-500"
                                }`}
                              >
                                {
                                  processingDescription
                                }
                              </div>
                            )}
                          </div>
                        )}


                        {/* ERROR */}

                        {error && (
                          <div
                            className={`rounded-xl border px-4 py-3 text-sm ${
                              isDark
                                ? "border-red-500/20 bg-red-500/10 text-red-400"
                                : "border-red-200 bg-red-50 text-red-700"
                            }`}
                          >
                            {error}
                          </div>
                        )}


                        <button
                          type="submit"
                          disabled={
                            loading ||
                            loadingWallet
                          }
                          className="flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-4 font-semibold text-white transition hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {loading ? (
                            <>
                              <Loader2
                                size={19}
                                className="animate-spin"
                              />

                              Processing...
                            </>
                          ) : (
                            <>
                              <ArrowDownToLine
                                size={19}
                              />

                              Continue Withdrawal
                            </>
                          )}
                        </button>
                      </form>


                      {/* SECURITY */}

                      <div
                        className={`mt-6 flex gap-3 rounded-xl border p-4 ${
                          isDark
                            ? "border-purple-500/10 bg-purple-500/5"
                            : "border-purple-100 bg-purple-50"
                        }`}
                      >
                        <ShieldCheck
                          size={20}
                          className={`mt-0.5 shrink-0 ${
                            isDark
                              ? "text-purple-400"
                              : "text-purple-600"
                          }`}
                        />

                        <p
                          className={`text-xs leading-5 ${
                            isDark
                              ? "text-gray-400"
                              : "text-gray-600"
                          }`}
                        >
                          OTP verification is required for every withdrawal.
                          The requested amount is reserved from your available
                          Income Wallet balance when the request is created.
                        </p>
                      </div>
                    </>
                  )}


                  {/* ===============================================
                      OTP STEP
                  =============================================== */}

                  {step === "otp" && (
                    <>
                      <div className="mb-6">
                        <div
                          className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${
                            isDark
                              ? "bg-purple-500/10"
                              : "bg-purple-100"
                          }`}
                        >
                          <ShieldCheck
                            size={28}
                            className={
                              isDark
                                ? "text-purple-400"
                                : "text-purple-600"
                            }
                          />
                        </div>

                        <h2
                          className={`text-xl font-semibold ${
                            isDark
                              ? "text-white"
                              : "text-gray-900"
                          }`}
                        >
                          Verify Withdrawal
                        </h2>

                        <p
                          className={`mt-2 text-sm ${
                            isDark
                              ? "text-gray-400"
                              : "text-gray-500"
                          }`}
                        >
                          Enter the 6-digit OTP for this withdrawal
                          {phoneNumber
                            ? ` (${phoneNumber})`
                            : "."}
                        </p>
                      </div>


                      {successMessage && (
                        <div
                          className={`mb-5 rounded-xl border px-4 py-3 text-sm ${
                            isDark
                              ? "border-green-500/20 bg-green-500/10 text-green-400"
                              : "border-green-200 bg-green-50 text-green-700"
                          }`}
                        >
                          {successMessage}
                        </div>
                      )}


                      {/* DEVELOPMENT OTP */}

                      {devOtp && (
                        <div
                          className={`mb-5 rounded-2xl border p-4 ${
                            isDark
                              ? "border-yellow-500/20 bg-yellow-500/10"
                              : "border-yellow-200 bg-yellow-50"
                          }`}
                        >
                          <p
                            className={`text-xs font-semibold uppercase tracking-wider ${
                              isDark
                                ? "text-yellow-300"
                                : "text-yellow-700"
                            }`}
                          >
                            Development OTP
                          </p>

                          <div className="mt-3 flex items-center justify-between gap-3">
                            <span
                              className={`text-2xl font-bold tracking-[0.3em] ${
                                isDark
                                  ? "text-white"
                                  : "text-gray-900"
                              }`}
                            >
                              {devOtp}
                            </span>

                            <button
                              type="button"
                              onClick={() =>
                                copyText(devOtp)
                              }
                              className={`rounded-lg p-2 ${
                                isDark
                                  ? "text-yellow-300 hover:bg-white/5"
                                  : "text-yellow-700 hover:bg-yellow-100"
                              }`}
                              title="Copy OTP"
                            >
                              <Copy size={17} />
                            </button>
                          </div>

                          <p
                            className={`mt-3 text-xs ${
                              isDark
                                ? "text-yellow-200/70"
                                : "text-yellow-700"
                            }`}
                          >
                            Testing only. This value is returned by the backend
                            because APP_ENV is development.
                          </p>
                        </div>
                      )}


                      <form
                        onSubmit={
                          handleVerifyOTP
                        }
                        className="space-y-5"
                      >
                        <div>
                          <label
                            className={`mb-2 block text-sm ${
                              isDark
                                ? "text-gray-300"
                                : "text-gray-700"
                            }`}
                          >
                            Enter OTP
                          </label>

                          <input
                            type="text"
                            inputMode="numeric"
                            maxLength={6}
                            value={otp}
                            onChange={(e) =>
                              setOtp(
                                e.target.value.replace(
                                  /\D/g,
                                  ""
                                )
                              )
                            }
                            placeholder="123456"
                            className={`w-full rounded-xl border px-4 py-4 text-center text-2xl tracking-[0.5em] outline-none ${
                              isDark
                                ? "border-white/10 bg-black/40 text-white focus:border-purple-500"
                                : "border-gray-200 bg-white text-gray-900 focus:border-purple-500"
                            }`}
                          />
                        </div>


                        {error && (
                          <div
                            className={`rounded-xl border px-4 py-3 text-sm ${
                              isDark
                                ? "border-red-500/20 bg-red-500/10 text-red-400"
                                : "border-red-200 bg-red-50 text-red-700"
                            }`}
                          >
                            {error}
                          </div>
                        )}


                        <button
                          type="submit"
                          disabled={loading}
                          className="flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-4 font-semibold text-white hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {loading ? (
                            <>
                              <Loader2
                                size={19}
                                className="animate-spin"
                              />

                              Verifying...
                            </>
                          ) : (
                            <>
                              <ShieldCheck
                                size={19}
                              />

                              Verify OTP
                            </>
                          )}
                        </button>
                      </form>


                      <button
                        type="button"
                        onClick={
                          startNewWithdrawal
                        }
                        className={`mt-4 w-full rounded-xl border px-5 py-3 text-sm transition ${
                          isDark
                            ? "border-white/10 text-gray-400 hover:bg-white/5 hover:text-white"
                            : "border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                      >
                        Back
                      </button>
                    </>
                  )}


                  {/* ===============================================
                      VERIFIED STEP
                  =============================================== */}

                  {step === "success" && (
                    <div className="text-center">
                      <div
                        className={`mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full border ${
                          isDark
                            ? "border-green-500/20 bg-green-500/10"
                            : "border-green-200 bg-green-50"
                        }`}
                      >
                        <CheckCircle2
                          size={42}
                          className={
                            isDark
                              ? "text-green-400"
                              : "text-green-600"
                          }
                        />
                      </div>


                      <h2
                        className={`text-2xl font-bold ${
                          isDark
                            ? "text-white"
                            : "text-gray-900"
                        }`}
                      >
                        Withdrawal Verified
                      </h2>


                      <p
                        className={`mt-2 text-sm leading-6 ${
                          isDark
                            ? "text-gray-400"
                            : "text-gray-500"
                        }`}
                      >
                        {successMessage}
                      </p>


                      <div
                        className={`mt-6 rounded-2xl border p-5 text-left ${
                          isDark
                            ? "border-white/10 bg-black/30"
                            : "border-gray-200 bg-gray-50"
                        }`}
                      >
                        <div className="flex justify-between py-2">
                          <span
                            className={
                              isDark
                                ? "text-gray-400"
                                : "text-gray-500"
                            }
                          >
                            Amount
                          </span>

                          <span
                            className={
                              isDark
                                ? "text-white"
                                : "text-gray-900"
                            }
                          >
                            $
                            {Number(
                              successAmount
                            ).toFixed(2)}
                          </span>
                        </div>


                        <div className="flex justify-between py-2">
                          <span
                            className={
                              isDark
                                ? "text-gray-400"
                                : "text-gray-500"
                            }
                          >
                            Fee
                          </span>

                          <span
                            className={
                              isDark
                                ? "text-red-400"
                                : "text-red-600"
                            }
                          >
                            -$
                            {Number(
                              successFee
                            ).toFixed(2)}
                          </span>
                        </div>


                        <div
                          className={`flex justify-between border-t pt-3 ${
                            isDark
                              ? "border-white/10"
                              : "border-gray-200"
                          }`}
                        >
                          <span
                            className={`font-semibold ${
                              isDark
                                ? "text-white"
                                : "text-gray-900"
                            }`}
                          >
                            Net Amount
                          </span>

                          <span
                            className={`font-bold ${
                              isDark
                                ? "text-green-400"
                                : "text-green-600"
                            }`}
                          >
                            $
                            {Number(
                              successNetAmount
                            ).toFixed(2)}
                          </span>
                        </div>


                        {completedWithdrawal && (
                          <>
                            <div
                              className={`mt-3 flex justify-between border-t pt-3 text-sm ${
                                isDark
                                  ? "border-white/10"
                                  : "border-gray-200"
                              }`}
                            >
                              <span
                                className={
                                  isDark
                                    ? "text-gray-400"
                                    : "text-gray-500"
                                }
                              >
                                Processing
                              </span>

                              <span
                                className={
                                  isDark
                                    ? "text-white"
                                    : "text-gray-900"
                                }
                              >
                                {completedWithdrawal.processing_type ===
                                "auto"
                                  ? "Automatic"
                                  : "Admin Approval"}
                              </span>
                            </div>


                            <div className="mt-3 flex justify-between text-sm">
                              <span
                                className={
                                  isDark
                                    ? "text-gray-400"
                                    : "text-gray-500"
                                }
                              >
                                Status
                              </span>

                              <span
                                className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStatusStyle(
                                  completedWithdrawal.status
                                )}`}
                              >
                                {getStatusLabel(
                                  completedWithdrawal.status
                                )}
                              </span>
                            </div>
                          </>
                        )}
                      </div>


                      <button
                        type="button"
                        onClick={
                          startNewWithdrawal
                        }
                        className="mt-6 w-full rounded-xl bg-purple-600 px-5 py-4 font-semibold text-white hover:bg-purple-500"
                      >
                        New Withdrawal
                      </button>
                    </div>
                  )}
                </div>


                {/* =================================================
                    WITHDRAWAL INFORMATION
                ================================================= */}

                <div
                  className={`rounded-3xl border p-6 shadow-sm md:p-8 ${
                    isDark
                      ? "border-white/10 bg-white/[0.03] backdrop-blur-xl"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <div className="mb-6">
                    <h2
                      className={`text-xl font-semibold ${
                        isDark
                          ? "text-white"
                          : "text-gray-900"
                      }`}
                    >
                      Withdrawal Information
                    </h2>

                    <p
                      className={`mt-1 text-sm ${
                        isDark
                          ? "text-gray-400"
                          : "text-gray-500"
                      }`}
                    >
                      Please review before making a withdrawal.
                    </p>
                  </div>


                  <div className="space-y-5">

                    <InfoItem
                      isDark={isDark}
                      title="Minimum Withdrawal"
                      description="$5.00 minimum withdrawal amount."
                    />


                    <InfoItem
                      isDark={isDark}
                      title="Withdrawal Fee"
                      description="A 5% fee is deducted from every withdrawal."
                    />


                    <InfoItem
                      isDark={isDark}
                      title="$5 – $20"
                      description="Eligible for automatic processing after successful OTP verification."
                    />


                    <InfoItem
                      isDark={isDark}
                      title="Above $20"
                      description="Requires admin approval after successful OTP verification."
                    />


                    <InfoItem
                      isDark={isDark}
                      title="OTP Verification"
                      description="OTP verification is required for every withdrawal."
                    />


                    <InfoItem
                      isDark={isDark}
                      title="BEP20 Address"
                      description="Payment is processed to the BEP20 address saved in your profile."
                    />


                    <InfoItem
                      isDark={isDark}
                      title="Secure Reservation"
                      description="The requested amount is reserved from your available Income Wallet balance when the request is created."
                    />
                  </div>
                </div>
              </div>


              {/* ==================================================
                  HISTORY
              ================================================== */}

              <div
                className={`mt-8 rounded-3xl border p-6 shadow-sm md:p-8 ${
                  isDark
                    ? "border-white/10 bg-white/[0.03] backdrop-blur-xl"
                    : "border-gray-200 bg-white"
                }`}
              >
                <div className="mb-6 flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                      isDark
                        ? "bg-purple-500/10"
                        : "bg-purple-100"
                    }`}
                  >
                    <History
                      size={21}
                      className={
                        isDark
                          ? "text-purple-400"
                          : "text-purple-600"
                      }
                    />
                  </div>


                  <div>
                    <h2
                      className={`text-xl font-semibold ${
                        isDark
                          ? "text-white"
                          : "text-gray-900"
                      }`}
                    >
                      Withdrawal History
                    </h2>

                    <p
                      className={`text-sm ${
                        isDark
                          ? "text-gray-400"
                          : "text-gray-500"
                      }`}
                    >
                      Your withdrawal requests and payment status
                    </p>
                  </div>
                </div>


                {loadingHistory ? (
                  <div className="flex items-center justify-center py-10">
                    <Loader2
                      size={25}
                      className={`animate-spin ${
                        isDark
                          ? "text-purple-400"
                          : "text-purple-600"
                      }`}
                    />
                  </div>
                ) : withdrawals.length ===
                  0 ? (
                  <div className="py-10 text-center">
                    <History
                      size={40}
                      className={`mx-auto mb-3 ${
                        isDark
                          ? "text-gray-600"
                          : "text-gray-300"
                      }`}
                    />

                    <p
                      className={
                        isDark
                          ? "text-gray-400"
                          : "text-gray-500"
                      }
                    >
                      No withdrawals yet.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {withdrawals.map(
                      (item) => {
                        const statusMessage =
                          getHistoryStatusMessage(
                            item
                          );

                        return (
                          <div
                            key={item.id}
                            className={`rounded-2xl border p-4 ${
                              isDark
                                ? "border-white/10 bg-black/20"
                                : "border-gray-200 bg-gray-50"
                            }`}
                          >
                            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                              <div>
                                <div className="flex flex-wrap items-center gap-3">
                                  <p
                                    className={`font-semibold ${
                                      isDark
                                        ? "text-white"
                                        : "text-gray-900"
                                    }`}
                                  >
                                    $
                                    {Number(
                                      item.amount
                                    ).toFixed(
                                      2
                                    )}
                                  </p>

                                  <span
                                    className={`rounded-full border px-3 py-1 text-xs font-medium ${getStatusStyle(
                                      item.status
                                    )}`}
                                  >
                                    {getStatusLabel(
                                      item.status
                                    )}
                                  </span>


                                  {item.processing_type && (
                                    <span
                                      className={`rounded-full border px-3 py-1 text-xs ${
                                        isDark
                                          ? "border-white/10 text-gray-300"
                                          : "border-gray-200 text-gray-600"
                                      }`}
                                    >
                                      {item.processing_type ===
                                      "auto"
                                        ? "AUTO"
                                        : "ADMIN"}
                                    </span>
                                  )}
                                </div>


                                <p
                                  className={`mt-1 text-xs ${
                                    isDark
                                      ? "text-gray-500"
                                      : "text-gray-400"
                                  }`}
                                >
                                  #
                                  {item.id} •{" "}
                                  {formatDate(
                                    item.created_at
                                  )}
                                </p>
                              </div>


                              <div className="text-left md:text-right">
                                <p
                                  className={`text-sm ${
                                    isDark
                                      ? "text-gray-400"
                                      : "text-gray-500"
                                  }`}
                                >
                                  Fee: $
                                  {Number(
                                    item.fee
                                  ).toFixed(
                                    2
                                  )}
                                </p>

                                <p
                                  className={`font-semibold ${
                                    isDark
                                      ? "text-green-400"
                                      : "text-green-600"
                                  }`}
                                >
                                  Net: $
                                  {Number(
                                    item.net_amount
                                  ).toFixed(
                                    2
                                  )}
                                </p>
                              </div>
                            </div>


                            {/* STATUS MESSAGE */}

                            {statusMessage && (
                              <div
                                className={`mt-3 flex items-start gap-2 text-xs ${
                                  item.status.toLowerCase() ===
                                  "rejected"
                                    ? isDark
                                      ? "text-red-400"
                                      : "text-red-600"
                                    : item.status.toLowerCase() ===
                                      "paid"
                                    ? isDark
                                      ? "text-green-400"
                                      : "text-green-600"
                                    : isDark
                                    ? "text-yellow-300"
                                    : "text-yellow-700"
                                }`}
                              >
                                {item.status.toLowerCase() ===
                                "rejected" ? (
                                  <XCircle
                                    size={14}
                                    className="mt-0.5 shrink-0"
                                  />
                                ) : item.status.toLowerCase() ===
                                  "paid" ? (
                                  <CheckCircle2
                                    size={14}
                                    className="mt-0.5 shrink-0"
                                  />
                                ) : (
                                  <Clock3
                                    size={14}
                                    className="mt-0.5 shrink-0"
                                  />
                                )}

                                <span>
                                  {
                                    statusMessage
                                  }
                                </span>
                              </div>
                            )}


                            {/* BEP20 */}

                            {item.bep20_address && (
                              <div
                                className={`mt-3 flex items-center justify-between rounded-xl border px-3 py-2 ${
                                  isDark
                                    ? "border-white/5 bg-black/30"
                                    : "border-gray-200 bg-white"
                                }`}
                              >
                                <div className="flex min-w-0 items-center gap-2">
                                  <Wallet
                                    size={14}
                                    className={
                                      isDark
                                        ? "text-gray-500"
                                        : "text-gray-400"
                                    }
                                  />

                                  <span
                                    className={`truncate text-xs ${
                                      isDark
                                        ? "text-gray-300"
                                        : "text-gray-700"
                                    }`}
                                  >
                                    {
                                      item.bep20_address
                                    }
                                  </span>
                                </div>


                                <button
                                  type="button"
                                  onClick={() =>
                                    copyText(
                                      item.bep20_address!
                                    )
                                  }
                                  className={`ml-3 shrink-0 rounded-lg p-2 transition ${
                                    isDark
                                      ? "text-gray-400 hover:bg-white/5 hover:text-white"
                                      : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                                  }`}
                                  title="Copy BEP20 address"
                                >
                                  <Copy
                                    size={15}
                                  />
                                </button>
                              </div>
                            )}


                            {/* PAYMENT REFERENCE */}

                            {item.payment_reference && (
                              <div
                                className={`mt-3 flex items-center justify-between rounded-xl border px-3 py-2 ${
                                  isDark
                                    ? "border-white/5 bg-black/30"
                                    : "border-gray-200 bg-white"
                                }`}
                              >
                                <div className="flex min-w-0 items-center gap-2">
                                  <span
                                    className={`text-xs ${
                                      isDark
                                        ? "text-gray-500"
                                        : "text-gray-400"
                                    }`}
                                  >
                                    Ref:
                                  </span>

                                  <span
                                    className={`truncate text-xs ${
                                      isDark
                                        ? "text-gray-300"
                                        : "text-gray-700"
                                    }`}
                                  >
                                    {
                                      item.payment_reference
                                    }
                                  </span>
                                </div>


                                <button
                                  type="button"
                                  onClick={() =>
                                    copyText(
                                      item.payment_reference!
                                    )
                                  }
                                  className={`ml-3 shrink-0 rounded-lg p-2 transition ${
                                    isDark
                                      ? "text-gray-400 hover:bg-white/5 hover:text-white"
                                      : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                                  }`}
                                  title="Copy payment reference"
                                >
                                  <Copy
                                    size={15}
                                  />
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      }
                    )}
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>


        {/* ======================================================
            GRADIENT
        ====================================================== */}

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


// ============================================================
// INFO ITEM
// ============================================================

function InfoItem({
  isDark,
  title,
  description,
}: {
  isDark: boolean;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div
        className={`mt-2 h-2 w-2 shrink-0 rounded-full ${
          isDark
            ? "bg-purple-400"
            : "bg-purple-600"
        }`}
      />

      <div>
        <p
          className={`font-medium ${
            isDark
              ? "text-white"
              : "text-gray-900"
          }`}
        >
          {title}
        </p>

        <p
          className={`mt-1 text-sm leading-5 ${
            isDark
              ? "text-gray-400"
              : "text-gray-500"
          }`}
        >
          {description}
        </p>
      </div>
    </div>
  );
}