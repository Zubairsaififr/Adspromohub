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

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
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

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
interface IncomeWalletData {
  success?: boolean;

  balance: number | string;

  total_earned: number | string;

  total_withdrawn: number | string;
}

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
interface WalletData {
  balance: number;

  pending_balance: number;

  total_earned: number;

  total_withdrawn: number;
}

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
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

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
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

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
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

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
  // ============================================================
  // AUTH
  // ============================================================

  const token =
    localStorage.getItem("access_token");

<<<<<<< HEAD
  // ============================================================
  // AMOUNT CALCULATION
=======

  // ============================================================
  // AMOUNT CALCULATION
  //
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
  // UI preview only.
  // Backend is still source of truth.
  // ============================================================

  const numericAmount =
    Number(amount || 0);

  const fee =
    numericAmount * 0.05;

  const netAmount =
    numericAmount - fee;

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
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
  // ============================================================
  // AUTH HEADERS
  // ============================================================

  const authHeaders = () => ({
    Authorization: `Bearer ${token}`,
  });

<<<<<<< HEAD
  // ============================================================
  // CALCULATE PENDING BALANCE
=======

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
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
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

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
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

<<<<<<< HEAD
  // ============================================================
  // LOAD WALLET
  // Existing backend:
=======

  // ============================================================
  // LOAD WALLET
  //
  // Existing backend:
  //
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
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

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
  // ============================================================
  // REFRESH PAGE DATA
  // ============================================================

  const refreshData = async () => {
    const history =
      await loadWithdrawals();

    await loadWallet(history);
  };

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
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

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
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

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
    if (!token) {
      setError(
        "Please login again."
      );

      return;
    }

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
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

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
    if (numericAmount < 5) {
      setError(
        "Minimum withdrawal amount is $5.00."
      );

      return;
    }

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
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

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
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

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
      const data:
        CreateWithdrawalResponse &
        {
          detail?: string;
        } =
        await response.json();

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
      if (!response.ok) {
        throw new Error(
          data.detail ||
            "Withdrawal request failed."
        );
      }

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
      setWithdrawalId(
        data.withdrawal_id
      );

      setPhoneNumber(
        data.phone_number || ""
      );

<<<<<<< HEAD
      // DEVELOPMENT OTP
=======

      // ========================================================
      // DEVELOPMENT OTP
      // ========================================================
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

      if (data.dev_otp) {
        setDevOtp(
          data.dev_otp
        );
      }

<<<<<<< HEAD
      setStep("otp");

=======

      setStep("otp");


>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
      if (data.dev_otp) {
        setSuccessMessage(
          "Withdrawal created successfully. Use the development OTP shown below."
        );
      } else {
        setSuccessMessage(
          "OTP has been sent to your registered phone number."
        );
      }

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
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

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
  // ============================================================
  // VERIFY OTP
  // ============================================================

  const handleVerifyOTP = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setError("");

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
    if (!token) {
      setError(
        "Please login again."
      );

      return;
    }

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
    if (!withdrawalId) {
      setError(
        "Withdrawal request not found."
      );

      return;
    }

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
    if (
      otp.length !== 6 ||
      !/^\d{6}$/.test(otp)
    ) {
      setError(
        "Please enter the 6-digit OTP."
      );

      return;
    }

<<<<<<< HEAD
    try {
      setLoading(true);

=======

    try {
      setLoading(true);


>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
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

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
      const data:
        VerifyOTPResponse &
        {
          detail?: string;
        } =
        await response.json();

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
      if (!response.ok) {
        throw new Error(
          data.detail ||
            "OTP verification failed."
        );
      }

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
      setCompletedWithdrawal(
        data
      );

      setStep("success");

<<<<<<< HEAD
      // $5 - $20
=======

      // ========================================================
      // $5 - $20
      // ========================================================
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

      if (
        data.next_action ===
        "auto_payment"
      ) {
        setSuccessMessage(
          "OTP verified successfully. Your withdrawal is now pending automatic payment processing."
        );
      }

<<<<<<< HEAD
      // ABOVE $20
=======
      // ========================================================
      // ABOVE $20
      // ========================================================
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

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

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
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

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
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

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
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

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
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
<<<<<<< HEAD
          ? "bg-[#B76E79]/15 text-[#E3AAB2] border-[#D99AA3]/30"
          : "bg-[#FFF0F2] text-[#8F4F5A] border-[#D99AA3]/40";

      case "approved":
        return isDark
          ? "bg-[#D99AA3]/15 text-[#E3AAB2] border-[#D99AA3]/30"
          : "bg-[#FFE5E8] text-[#8F4F5A] border-[#D99AA3]/40";

      case "otp_pending":
        return isDark
          ? "bg-[#E3AAB2]/15 text-[#E3AAB2] border-[#E3AAB2]/30"
          : "bg-[#FFF0F2] text-[#8F4F5A] border-[#E3AAB2]/40";

      case "pending":
        return isDark
          ? "bg-[#B76E79]/15 text-[#D99AA3] border-[#B76E79]/30"
          : "bg-[#FFF5F6] text-[#B76E79] border-[#D99AA3]/40";
=======
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

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

      case "rejected":
      case "cancelled":
        return isDark
<<<<<<< HEAD
          ? "bg-[#8F4F5A]/25 text-[#FFE5E8] border-[#D99AA3]/30"
          : "bg-[#FFE5E8] text-[#8F4F5A] border-[#D99AA3]/50";
=======
          ? "bg-red-500/10 text-red-400 border-red-500/20"
          : "bg-red-50 text-red-700 border-red-200";

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

      default:
        return isDark
          ? "bg-white/5 text-gray-300 border-white/10"
          : "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
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

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
  // ============================================================
  // STATUS MESSAGE
  // ============================================================

  const getHistoryStatusMessage = (
    item: Withdrawal
  ) => {
    const status =
      item.status.toLowerCase();

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
    if (status === "otp_pending") {
      return (
        "OTP verification is pending."
      );
    }

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
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

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
    if (status === "approved") {
      return (
        "Approved and waiting for payment."
      );
    }

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
    if (status === "paid") {
      return (
        "Withdrawal paid successfully."
      );
    }

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
    if (status === "rejected") {
      return (
        "Withdrawal was rejected and the reserved amount was returned to your wallet."
      );
    }

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
    if (status === "cancelled") {
      return (
        "Withdrawal was cancelled."
      );
    }

<<<<<<< HEAD
    return "";
  };

=======

    return "";
  };


>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
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

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
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

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
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

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
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
<<<<<<< HEAD
            : "bg-gradient-to-br from-[#FFF9FA] via-[#FDF3F5] to-white text-gray-900"
=======
            : "bg-gray-50 text-gray-900"
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
        }`}
      >
        <div className="flex min-w-0 flex-1 flex-col">
          <main
            className={`flex-1 p-4 sm:p-6 lg:p-8 ${
              isDark
                ? "animated-gradient"
<<<<<<< HEAD
                : "bg-gradient-to-br from-[#FFF9FA] via-[#FDF3F5] to-white"
=======
                : "bg-gray-50"
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
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
<<<<<<< HEAD
                        ? "border-[#B76E79]/30 bg-[#B76E79]/20"
                        : "border-[#D99AA3]/40 bg-[#FFE5E8]"
=======
                        ? "border-purple-500/20 bg-purple-600/20"
                        : "border-purple-200 bg-purple-100"
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                    }`}
                  >
                    <ArrowDownToLine
                      size={24}
                      className={
                        isDark
<<<<<<< HEAD
                          ? "text-[#E3AAB2]"
                          : "text-[#8F4F5A]"
=======
                          ? "text-purple-400"
                          : "text-purple-600"
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
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

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
              {/* ==================================================
                  WALLET SUMMARY
              ================================================== */}

              <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">

                {/* AVAILABLE */}

                <div
                  className={`rounded-2xl border p-5 shadow-sm ${
                    isDark
                      ? "border-white/10 bg-white/[0.03] backdrop-blur-xl"
<<<<<<< HEAD
                      : "border-[#E3AAB2]/25 bg-white"
=======
                      : "border-gray-200 bg-white"
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
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

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                {/* PENDING */}

                <div
                  className={`rounded-2xl border p-5 shadow-sm ${
                    isDark
                      ? "border-white/10 bg-white/[0.03] backdrop-blur-xl"
<<<<<<< HEAD
                      : "border-[#E3AAB2]/25 bg-white"
=======
                      : "border-gray-200 bg-white"
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
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
<<<<<<< HEAD
                        ? "text-[#E3AAB2]"
                        : "text-[#B76E79]"
=======
                        ? "text-yellow-400"
                        : "text-yellow-600"
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
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

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                {/* TOTAL WITHDRAWN */}

                <div
                  className={`rounded-2xl border p-5 shadow-sm ${
                    isDark
                      ? "border-white/10 bg-white/[0.03] backdrop-blur-xl"
<<<<<<< HEAD
                      : "border-[#E3AAB2]/25 bg-white"
=======
                      : "border-gray-200 bg-white"
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
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
<<<<<<< HEAD
                        ? "text-[#D99AA3]"
                        : "text-[#8F4F5A]"
=======
                        ? "text-green-400"
                        : "text-green-600"
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
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

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
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
<<<<<<< HEAD
                      : "border-[#E3AAB2]/30 bg-white"
                  }`}
                >

                  {/* AMOUNT STEP */}
=======
                      : "border-gray-200 bg-white"
                  }`}
                >

                  {/* ===============================================
                      AMOUNT STEP
                  =============================================== */}
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

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

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
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
<<<<<<< HEAD
                                  ? "border-white/10 bg-black/40 text-white focus:border-[#B76E79]"
                                  : "border-[#E3AAB2]/40 bg-white text-gray-900 focus:border-[#B76E79]"
=======
                                  ? "border-white/10 bg-black/40 text-white focus:border-purple-500"
                                  : "border-gray-200 bg-white text-gray-900 focus:border-purple-500"
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                              }`}
                            />
                          </div>
                        </div>

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                        {/* CALCULATION */}

                        {numericAmount > 0 && (
                          <div
                            className={`space-y-3 rounded-2xl border p-4 ${
                              isDark
                                ? "border-white/10 bg-black/30"
<<<<<<< HEAD
                                : "border-[#E3AAB2]/30 bg-[#FFF9FA]"
=======
                                : "border-gray-200 bg-gray-50"
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
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

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
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
<<<<<<< HEAD
                                    ? "text-[#D99AA3]"
                                    : "text-[#8F4F5A]"
=======
                                    ? "text-red-400"
                                    : "text-red-600"
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                                }
                              >
                                -$
                                {fee.toFixed(2)}
                              </span>
                            </div>

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                            <div
                              className={`flex justify-between border-t pt-3 ${
                                isDark
                                  ? "border-white/10"
<<<<<<< HEAD
                                  : "border-[#E3AAB2]/30"
=======
                                  : "border-gray-200"
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
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
<<<<<<< HEAD
                                    ? "text-[#E3AAB2]"
                                    : "text-[#8F4F5A]"
=======
                                    ? "text-green-400"
                                    : "text-green-600"
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                                }`}
                              >
                                $
                                {netAmount.toFixed(
                                  2
                                )}
                              </span>
                            </div>

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                            {processingDescription && (
                              <div
                                className={`border-t pt-3 text-xs leading-5 ${
                                  isDark
                                    ? "border-white/10 text-gray-400"
<<<<<<< HEAD
                                    : "border-[#E3AAB2]/30 text-gray-500"
=======
                                    : "border-gray-200 text-gray-500"
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                                }`}
                              >
                                {
                                  processingDescription
                                }
                              </div>
                            )}
                          </div>
                        )}

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                        {/* ERROR */}

                        {error && (
                          <div
                            className={`rounded-xl border px-4 py-3 text-sm ${
                              isDark
<<<<<<< HEAD
                                ? "border-[#D99AA3]/30 bg-[#8F4F5A]/20 text-[#FFE5E8]"
                                : "border-[#D99AA3]/50 bg-[#FFE5E8] text-[#8F4F5A]"
=======
                                ? "border-red-500/20 bg-red-500/10 text-red-400"
                                : "border-red-200 bg-red-50 text-red-700"
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                            }`}
                          >
                            {error}
                          </div>
                        )}

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                        <button
                          type="submit"
                          disabled={
                            loading ||
                            loadingWallet
                          }
<<<<<<< HEAD
                          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#B76E79] px-5 py-4 font-semibold text-white shadow-lg shadow-[#B76E79]/20 transition hover:bg-[#8F4F5A] disabled:cursor-not-allowed disabled:opacity-50"
=======
                          className="flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-4 font-semibold text-white transition hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-50"
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
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

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                      {/* SECURITY */}

                      <div
                        className={`mt-6 flex gap-3 rounded-xl border p-4 ${
                          isDark
<<<<<<< HEAD
                            ? "border-[#B76E79]/20 bg-[#B76E79]/10"
                            : "border-[#D99AA3]/35 bg-[#FFF0F2]"
=======
                            ? "border-purple-500/10 bg-purple-500/5"
                            : "border-purple-100 bg-purple-50"
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                        }`}
                      >
                        <ShieldCheck
                          size={20}
                          className={`mt-0.5 shrink-0 ${
                            isDark
<<<<<<< HEAD
                              ? "text-[#E3AAB2]"
                              : "text-[#8F4F5A]"
=======
                              ? "text-purple-400"
                              : "text-purple-600"
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
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

<<<<<<< HEAD
                  {/* =================================================
                      OTP STEP
                  ================================================= */}
=======

                  {/* ===============================================
                      OTP STEP
                  =============================================== */}
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

                  {step === "otp" && (
                    <>
                      <div className="mb-6">
                        <div
                          className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${
                            isDark
<<<<<<< HEAD
                              ? "bg-[#B76E79]/15"
                              : "bg-[#FFE5E8]"
=======
                              ? "bg-purple-500/10"
                              : "bg-purple-100"
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                          }`}
                        >
                          <ShieldCheck
                            size={28}
                            className={
                              isDark
<<<<<<< HEAD
                                ? "text-[#E3AAB2]"
                                : "text-[#8F4F5A]"
=======
                                ? "text-purple-400"
                                : "text-purple-600"
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
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

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                      {successMessage && (
                        <div
                          className={`mb-5 rounded-xl border px-4 py-3 text-sm ${
                            isDark
<<<<<<< HEAD
                              ? "border-[#D99AA3]/30 bg-[#B76E79]/15 text-[#E3AAB2]"
                              : "border-[#D99AA3]/40 bg-[#FFF0F2] text-[#8F4F5A]"
=======
                              ? "border-green-500/20 bg-green-500/10 text-green-400"
                              : "border-green-200 bg-green-50 text-green-700"
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                          }`}
                        >
                          {successMessage}
                        </div>
                      )}

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                      {/* DEVELOPMENT OTP */}

                      {devOtp && (
                        <div
                          className={`mb-5 rounded-2xl border p-4 ${
                            isDark
<<<<<<< HEAD
                              ? "border-[#D99AA3]/30 bg-[#B76E79]/15"
                              : "border-[#D99AA3]/50 bg-[#FFE5E8]"
=======
                              ? "border-yellow-500/20 bg-yellow-500/10"
                              : "border-yellow-200 bg-yellow-50"
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                          }`}
                        >
                          <p
                            className={`text-xs font-semibold uppercase tracking-wider ${
                              isDark
<<<<<<< HEAD
                                ? "text-[#E3AAB2]"
                                : "text-[#8F4F5A]"
=======
                                ? "text-yellow-300"
                                : "text-yellow-700"
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
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
<<<<<<< HEAD
                                  ? "text-[#E3AAB2] hover:bg-white/5"
                                  : "text-[#8F4F5A] hover:bg-[#FFF0F2]"
=======
                                  ? "text-yellow-300 hover:bg-white/5"
                                  : "text-yellow-700 hover:bg-yellow-100"
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                              }`}
                              title="Copy OTP"
                            >
                              <Copy size={17} />
                            </button>
                          </div>

                          <p
                            className={`mt-3 text-xs ${
                              isDark
<<<<<<< HEAD
                                ? "text-[#D99AA3]/80"
                                : "text-[#8F4F5A]"
=======
                                ? "text-yellow-200/70"
                                : "text-yellow-700"
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                            }`}
                          >
                            Testing only. This value is returned by the backend
                            because APP_ENV is development.
                          </p>
                        </div>
                      )}

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
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
<<<<<<< HEAD
                                ? "border-white/10 bg-black/40 text-white focus:border-[#B76E79]"
                                : "border-[#E3AAB2]/40 bg-white text-gray-900 focus:border-[#B76E79]"
=======
                                ? "border-white/10 bg-black/40 text-white focus:border-purple-500"
                                : "border-gray-200 bg-white text-gray-900 focus:border-purple-500"
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                            }`}
                          />
                        </div>

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                        {error && (
                          <div
                            className={`rounded-xl border px-4 py-3 text-sm ${
                              isDark
<<<<<<< HEAD
                                ? "border-[#D99AA3]/30 bg-[#8F4F5A]/20 text-[#FFE5E8]"
                                : "border-[#D99AA3]/50 bg-[#FFE5E8] text-[#8F4F5A]"
=======
                                ? "border-red-500/20 bg-red-500/10 text-red-400"
                                : "border-red-200 bg-red-50 text-red-700"
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                            }`}
                          >
                            {error}
                          </div>
                        )}

<<<<<<< HEAD
                        <button
                          type="submit"
                          disabled={loading}
                          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#B76E79] px-5 py-4 font-semibold text-white shadow-lg shadow-[#B76E79]/20 hover:bg-[#8F4F5A] disabled:cursor-not-allowed disabled:opacity-50"
=======

                        <button
                          type="submit"
                          disabled={loading}
                          className="flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-4 font-semibold text-white hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-50"
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
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

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                      <button
                        type="button"
                        onClick={
                          startNewWithdrawal
                        }
                        className={`mt-4 w-full rounded-xl border px-5 py-3 text-sm transition ${
                          isDark
                            ? "border-white/10 text-gray-400 hover:bg-white/5 hover:text-white"
<<<<<<< HEAD
                            : "border-[#E3AAB2]/40 text-gray-600 hover:bg-[#FFF9FA] hover:text-[#8F4F5A]"
=======
                            : "border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                        }`}
                      >
                        Back
                      </button>
                    </>
                  )}

<<<<<<< HEAD
                  {/* =================================================
                      VERIFIED STEP
                  ================================================= */}
=======

                  {/* ===============================================
                      VERIFIED STEP
                  =============================================== */}
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

                  {step === "success" && (
                    <div className="text-center">
                      <div
                        className={`mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full border ${
                          isDark
<<<<<<< HEAD
                            ? "border-[#D99AA3]/30 bg-[#B76E79]/15"
                            : "border-[#D99AA3]/50 bg-[#FFE5E8]"
=======
                            ? "border-green-500/20 bg-green-500/10"
                            : "border-green-200 bg-green-50"
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                        }`}
                      >
                        <CheckCircle2
                          size={42}
                          className={
                            isDark
<<<<<<< HEAD
                              ? "text-[#E3AAB2]"
                              : "text-[#8F4F5A]"
=======
                              ? "text-green-400"
                              : "text-green-600"
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                          }
                        />
                      </div>

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                      <h2
                        className={`text-2xl font-bold ${
                          isDark
                            ? "text-white"
                            : "text-gray-900"
                        }`}
                      >
                        Withdrawal Verified
                      </h2>

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                      <p
                        className={`mt-2 text-sm leading-6 ${
                          isDark
                            ? "text-gray-400"
                            : "text-gray-500"
                        }`}
                      >
                        {successMessage}
                      </p>

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                      <div
                        className={`mt-6 rounded-2xl border p-5 text-left ${
                          isDark
                            ? "border-white/10 bg-black/30"
<<<<<<< HEAD
                            : "border-[#E3AAB2]/30 bg-[#FFF9FA]"
=======
                            : "border-gray-200 bg-gray-50"
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
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

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
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
<<<<<<< HEAD
                                ? "text-[#D99AA3]"
                                : "text-[#8F4F5A]"
=======
                                ? "text-red-400"
                                : "text-red-600"
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                            }
                          >
                            -$
                            {Number(
                              successFee
                            ).toFixed(2)}
                          </span>
                        </div>

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                        <div
                          className={`flex justify-between border-t pt-3 ${
                            isDark
                              ? "border-white/10"
<<<<<<< HEAD
                              : "border-[#E3AAB2]/30"
=======
                              : "border-gray-200"
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
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
<<<<<<< HEAD
                                ? "text-[#E3AAB2]"
                                : "text-[#8F4F5A]"
=======
                                ? "text-green-400"
                                : "text-green-600"
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                            }`}
                          >
                            $
                            {Number(
                              successNetAmount
                            ).toFixed(2)}
                          </span>
                        </div>

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                        {completedWithdrawal && (
                          <>
                            <div
                              className={`mt-3 flex justify-between border-t pt-3 text-sm ${
                                isDark
                                  ? "border-white/10"
<<<<<<< HEAD
                                  : "border-[#E3AAB2]/30"
=======
                                  : "border-gray-200"
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
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

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
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

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                      <button
                        type="button"
                        onClick={
                          startNewWithdrawal
                        }
<<<<<<< HEAD
                        className="mt-6 w-full rounded-xl bg-[#B76E79] px-5 py-4 font-semibold text-white shadow-lg shadow-[#B76E79]/20 hover:bg-[#8F4F5A]"
=======
                        className="mt-6 w-full rounded-xl bg-purple-600 px-5 py-4 font-semibold text-white hover:bg-purple-500"
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                      >
                        New Withdrawal
                      </button>
                    </div>
                  )}
                </div>

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                {/* =================================================
                    WITHDRAWAL INFORMATION
                ================================================= */}

                <div
                  className={`rounded-3xl border p-6 shadow-sm md:p-8 ${
                    isDark
                      ? "border-white/10 bg-white/[0.03] backdrop-blur-xl"
<<<<<<< HEAD
                      : "border-[#E3AAB2]/30 bg-white"
=======
                      : "border-gray-200 bg-white"
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
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

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                  <div className="space-y-5">

                    <InfoItem
                      isDark={isDark}
                      title="Minimum Withdrawal"
                      description="$5.00 minimum withdrawal amount."
                    />

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                    <InfoItem
                      isDark={isDark}
                      title="Withdrawal Fee"
                      description="A 5% fee is deducted from every withdrawal."
                    />

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                    <InfoItem
                      isDark={isDark}
                      title="$5 – $20"
                      description="Eligible for automatic processing after successful OTP verification."
                    />

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                    <InfoItem
                      isDark={isDark}
                      title="Above $20"
                      description="Requires admin approval after successful OTP verification."
                    />

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                    <InfoItem
                      isDark={isDark}
                      title="OTP Verification"
                      description="OTP verification is required for every withdrawal."
                    />

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                    <InfoItem
                      isDark={isDark}
                      title="BEP20 Address"
                      description="Payment is processed to the BEP20 address saved in your profile."
                    />

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                    <InfoItem
                      isDark={isDark}
                      title="Secure Reservation"
                      description="The requested amount is reserved from your available Income Wallet balance when the request is created."
                    />
                  </div>
                </div>
              </div>

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
              {/* ==================================================
                  HISTORY
              ================================================== */}

              <div
                className={`mt-8 rounded-3xl border p-6 shadow-sm md:p-8 ${
                  isDark
                    ? "border-white/10 bg-white/[0.03] backdrop-blur-xl"
<<<<<<< HEAD
                    : "border-[#E3AAB2]/30 bg-white"
=======
                    : "border-gray-200 bg-white"
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                }`}
              >
                <div className="mb-6 flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                      isDark
<<<<<<< HEAD
                        ? "bg-[#B76E79]/15"
                        : "bg-[#FFE5E8]"
=======
                        ? "bg-purple-500/10"
                        : "bg-purple-100"
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                    }`}
                  >
                    <History
                      size={21}
                      className={
                        isDark
<<<<<<< HEAD
                          ? "text-[#E3AAB2]"
                          : "text-[#8F4F5A]"
=======
                          ? "text-purple-400"
                          : "text-purple-600"
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                      }
                    />
                  </div>

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
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

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                {loadingHistory ? (
                  <div className="flex items-center justify-center py-10">
                    <Loader2
                      size={25}
                      className={`animate-spin ${
                        isDark
<<<<<<< HEAD
                          ? "text-[#E3AAB2]"
                          : "text-[#B76E79]"
=======
                          ? "text-purple-400"
                          : "text-purple-600"
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
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
<<<<<<< HEAD
                          : "text-[#D99AA3]"
=======
                          : "text-gray-300"
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
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
<<<<<<< HEAD
                                : "border-[#E3AAB2]/30 bg-[#FFF9FA]"
=======
                                : "border-gray-200 bg-gray-50"
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
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

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                                  {item.processing_type && (
                                    <span
                                      className={`rounded-full border px-3 py-1 text-xs ${
                                        isDark
                                          ? "border-white/10 text-gray-300"
<<<<<<< HEAD
                                          : "border-[#E3AAB2]/30 text-[#8F4F5A]"
=======
                                          : "border-gray-200 text-gray-600"
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                                      }`}
                                    >
                                      {item.processing_type ===
                                      "auto"
                                        ? "AUTO"
                                        : "ADMIN"}
                                    </span>
                                  )}
                                </div>

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
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

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
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
<<<<<<< HEAD
                                      ? "text-[#E3AAB2]"
                                      : "text-[#8F4F5A]"
=======
                                      ? "text-green-400"
                                      : "text-green-600"
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
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

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                            {/* STATUS MESSAGE */}

                            {statusMessage && (
                              <div
                                className={`mt-3 flex items-start gap-2 text-xs ${
                                  item.status.toLowerCase() ===
                                  "rejected"
                                    ? isDark
<<<<<<< HEAD
                                      ? "text-[#E3AAB2]"
                                      : "text-[#8F4F5A]"
                                    : item.status.toLowerCase() ===
                                      "paid"
                                    ? isDark
                                      ? "text-[#E3AAB2]"
                                      : "text-[#8F4F5A]"
                                    : isDark
                                    ? "text-[#D99AA3]"
                                    : "text-[#B76E79]"
=======
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
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
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

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                            {/* BEP20 */}

                            {item.bep20_address && (
                              <div
                                className={`mt-3 flex items-center justify-between rounded-xl border px-3 py-2 ${
                                  isDark
                                    ? "border-white/5 bg-black/30"
<<<<<<< HEAD
                                    : "border-[#E3AAB2]/30 bg-white"
=======
                                    : "border-gray-200 bg-white"
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                                }`}
                              >
                                <div className="flex min-w-0 items-center gap-2">
                                  <Wallet
                                    size={14}
                                    className={
                                      isDark
<<<<<<< HEAD
                                        ? "text-[#D99AA3]"
                                        : "text-[#B76E79]"
=======
                                        ? "text-gray-500"
                                        : "text-gray-400"
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
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

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                                <button
                                  type="button"
                                  onClick={() =>
                                    copyText(
                                      item.bep20_address!
                                    )
                                  }
                                  className={`ml-3 shrink-0 rounded-lg p-2 transition ${
                                    isDark
<<<<<<< HEAD
                                      ? "text-gray-400 hover:bg-[#B76E79]/10 hover:text-[#E3AAB2]"
                                      : "text-[#B76E79] hover:bg-[#FFE5E8] hover:text-[#8F4F5A]"
=======
                                      ? "text-gray-400 hover:bg-white/5 hover:text-white"
                                      : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                                  }`}
                                  title="Copy BEP20 address"
                                >
                                  <Copy
                                    size={15}
                                  />
                                </button>
                              </div>
                            )}

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                            {/* PAYMENT REFERENCE */}

                            {item.payment_reference && (
                              <div
                                className={`mt-3 flex items-center justify-between rounded-xl border px-3 py-2 ${
                                  isDark
                                    ? "border-white/5 bg-black/30"
<<<<<<< HEAD
                                    : "border-[#E3AAB2]/30 bg-white"
=======
                                    : "border-gray-200 bg-white"
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
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

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                                <button
                                  type="button"
                                  onClick={() =>
                                    copyText(
                                      item.payment_reference!
                                    )
                                  }
                                  className={`ml-3 shrink-0 rounded-lg p-2 transition ${
                                    isDark
<<<<<<< HEAD
                                      ? "text-gray-400 hover:bg-[#B76E79]/10 hover:text-[#E3AAB2]"
                                      : "text-[#B76E79] hover:bg-[#FFE5E8] hover:text-[#8F4F5A]"
=======
                                      ? "text-gray-400 hover:bg-white/5 hover:text-white"
                                      : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
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

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
        {/* ======================================================
            GRADIENT
        ====================================================== */}

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

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
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
<<<<<<< HEAD
            ? "bg-[#D99AA3]"
            : "bg-[#B76E79]"
=======
            ? "bg-purple-400"
            : "bg-purple-600"
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
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
<<<<<<< HEAD
} 
=======
}
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
