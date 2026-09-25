import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  LayoutDashboard,
  Wallet,
  Users,
  CreditCard,
  ArrowDownToLine,
  LogOut,
  Menu,
  X,
  CheckCircle,
  Clock,
  XCircle,
  DollarSign,
  RefreshCw,
  ShieldCheck,
  MessageSquare,
  UserPlus,
  Copy,
} from "lucide-react";

const RAW_API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
const API_URL = RAW_API_URL.replace(/\/+$/, "");


/* ============================================================
   WITHDRAWAL
============================================================ */

interface Withdrawal {
  id: number;
  user_id: number;

  user?: {
    id?: number | null;
    customer_id?: string | null;
    referral_id?: string | null;
    full_name?: string | null;
    email?: string | null;
    phone_number?: string | null;
  };

  amount: string;
  fee_percentage: string;
  fee: string;
  net_amount: string;

  bep20_address: string;

  processing_type:
    | "auto"
    | "admin"
    | string;

  status:
    | "otp_pending"
    | "pending"
    | "approved"
    | "paid"
    | "rejected"
    | "cancelled"
    | string;

  otp_verified: boolean;
  otp_verified_at?: string | null;

  payment_reference?: string | null;

  admin_note?: string | null;

  approved_by?: number | null;
  rejected_by?: number | null;

  created_at: string;
  approved_at?: string | null;
  paid_at?: string | null;
  rejected_at?: string | null;
  cancelled_at?: string | null;
  updated_at?: string | null;
}


/* ============================================================
   SUPPORT
============================================================ */

interface SupportTicket {
  id: number;
  ticket_number: string;
  user_id: number;

  category: string;
  subject: string;
  description: string;

  priority: string;
  status: string;

  created_at: string;
  updated_at: string;
  resolved_at?: string | null;

  user?: {
    id?: number;
    full_name?: string;
    email?: string;
    customer_id?: string | null;
    referral_id?: string | null;
    referral_code?: string | null;
    phone_number?: string | null;
  };

  referral_id?: string | null;
  referral_code?: string | null;
  full_name?: string | null;
  email?: string | null;
  phone_number?: string | null;
  user_name?: string;
  user_email?: string;
}


/* ============================================================
   ADMIN USER
============================================================ */

interface AdminUser {
  id: number;

  full_name: string;
  email: string;

  customer_id: string;
  referral_code: string;

  referred_by: string | null;

  created_at: string;

  is_active: boolean;
  is_admin?: boolean;
}


/* ============================================================
   USERS RESPONSE
============================================================ */

interface UsersResponse {
  users?: AdminUser[];
}


/* ============================================================
   COMPONENT
============================================================ */

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const [withdrawals, setWithdrawals] =
    useState<Withdrawal[]>([]);

  const [
    supportTickets,
    setSupportTickets,
  ] = useState<SupportTicket[]>([]);


  /* ============================================================
     USERS STATE
  ============================================================ */

  const [users, setUsers] =
    useState<AdminUser[]>([]);

  const [
    usersLoading,
    setUsersLoading,
  ] = useState(false);

  const [
    usersLoaded,
    setUsersLoaded,
  ] = useState(false);

  const [
    activeSection,
    setActiveSection,
  ] = useState<
    "dashboard" | "users"
  >("dashboard");


  /* ============================================================
     COMMON STATE
  ============================================================ */

  const [loading, setLoading] =
    useState(true);

  const [
    supportLoading,
    setSupportLoading,
  ] = useState(true);

  const [
    actionLoading,
    setActionLoading,
  ] = useState<number | null>(
    null
  );

  const [filter, setFilter] =
    useState("all");

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");


  /* ============================================================
     ADMIN CHECK
  ============================================================ */

  useEffect(() => {
    const token =
      localStorage.getItem(
        "access_token"
      );

    const savedUser =
      localStorage.getItem("user");

    if (!token || !savedUser) {
      navigate("/signin", {
        replace: true,
      });

      return;
    }

    try {
      const user =
        JSON.parse(savedUser);

      if (user.is_admin !== true && user.role !== "admin") {
        navigate(
          "/userdashboard",
          {
            replace: true,
          }
        );

        return;
      }
    } catch {
      localStorage.removeItem(
        "access_token"
      );

      localStorage.removeItem(
        "user"
      );

      localStorage.removeItem(
        "rememberMe"
      );

      navigate("/signin", {
        replace: true,
      });
    }
  }, [navigate]);


  /* ============================================================
     LOAD WITHDRAWALS
  ============================================================ */

  const loadWithdrawals =
    async () => {
      try {
        setLoading(true);
        setError("");

        const token =
          localStorage.getItem(
            "access_token"
          );

        if (!token) {
          navigate("/signin");
          return;
        }

        let url =
          `${API_URL}/api/admin/withdrawals`;

        if (filter !== "all") {
          url +=
            `?status=${encodeURIComponent(
              filter
            )}`;
        }

        const response =
          await fetch(url, {
            method: "GET",

            headers: {
              Authorization:
                `Bearer ${token}`,

              Accept:
                "application/json",
            },
          });

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data?.detail ||
              "Failed to load withdrawals."
          );
        }

        setWithdrawals(
          Array.isArray(
            data?.withdrawals
          )
            ? data.withdrawals
            : []
        );
      } catch (err: any) {
        console.error(
          "Admin withdrawal error:",
          err
        );

        setWithdrawals([]);

        setError(
          err?.message ||
            "Failed to load withdrawals."
        );
      } finally {
        setLoading(false);
      }
    };


  useEffect(() => {
    loadWithdrawals();
  }, [filter]);


  /* ============================================================
     LOAD SUPPORT TICKETS
  ============================================================ */

  const loadSupportTickets =
    async () => {
      try {
        setSupportLoading(true);

        const token =
          localStorage.getItem(
            "access_token"
          );

        if (!token) {
          navigate("/signin");
          return;
        }

        const response =
          await fetch(
            `${API_URL}/api/admin/support/tickets`,
            {
              method: "GET",

              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data?.detail ||
              "Failed to load support tickets."
          );
        }

        setSupportTickets(
          Array.isArray(
            data?.tickets
          )
            ? data.tickets
            : []
        );
      } catch (err: any) {
        console.error(
          "Admin support error:",
          err
        );
      } finally {
        setSupportLoading(
          false
        );
      }
    };


  useEffect(() => {
    loadSupportTickets();
  }, []);


  /* ============================================================
     LOAD USERS
  ============================================================ */

  const loadUsers =
    async () => {
      try {
        setUsersLoading(true);
        setError("");

        const token =
          localStorage.getItem(
            "access_token"
          );

        if (!token) {
          navigate("/signin");
          return;
        }

        const response =
          await fetch(
            `${API_URL}/api/admin/users`,
            {
              method: "GET",

              headers: {
                Authorization:
                  `Bearer ${token}`,

                Accept:
                  "application/json",
              },
            }
          );

        const data:
          | AdminUser[]
          | UsersResponse =
          await response.json();

        console.log(
          "Admin users API response:",
          data
        );

        if (!response.ok) {
          const errorData =
            data as any;

          throw new Error(
            errorData?.detail ||
              "Failed to load users."
          );
        }

        let userList:
          AdminUser[] = [];

        if (Array.isArray(data)) {
          userList = data;
        } else if (
          data &&
          Array.isArray(
            data.users
          )
        ) {
          userList =
            data.users;
        }

        setUsers(userList);

        setUsersLoaded(true);

        console.log(
          `Loaded ${userList.length} users`
        );
      } catch (err: any) {
        console.error(
          "Admin users error:",
          err
        );

        setUsers([]);

        setUsersLoaded(false);

        setError(
          err?.message ||
            "Failed to load users."
        );
      } finally {
        setUsersLoading(false);
      }
    };


  /* ============================================================
     OPEN USERS
  ============================================================ */

  const handleUsersClick =
    () => {
      setActiveSection(
        "users"
      );

      setSidebarOpen(false);

      loadUsers();
    };


  /* ============================================================
     LOGIN AS USER
  ============================================================ */

  const handleLoginAsUser =
    async (
      targetUserId: number
    ) => {
      try {
        setError("");
        setSuccess("");

        const adminToken =
          localStorage.getItem(
            "access_token"
          );

        const adminUser =
          localStorage.getItem(
            "user"
          );

        if (
          !adminToken ||
          !adminUser
        ) {
          navigate("/signin");
          return;
        }

        const response =
          await fetch(
            `${API_URL}/api/admin/users/${targetUserId}/login`,
            {
              method: "POST",

              headers: {
                Authorization:
                  `Bearer ${adminToken}`,

                "Content-Type":
                  "application/json",

                Accept:
                  "application/json",
              },
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data?.detail ||
              "Unable to login as this user."
          );
        }

        const impersonationToken =
          data?.access_token;

        if (
          !impersonationToken
        ) {
          throw new Error(
            "Impersonation token was not returned by server."
          );
        }

        const userWindow =
          window.open(
            "about:blank",
            "_blank"
          );

        if (!userWindow) {
          throw new Error(
            "Popup blocked. Please allow popups for this site and try again."
          );
        }

        const dashboardUrl =
          `${window.location.origin}/userdashboard?impersonation_token=${encodeURIComponent(
            impersonationToken
          )}`;

        userWindow.location.href =
          dashboardUrl;

        setSuccess(
          `Logged in as ${
            data.full_name ||
            "user"
          } in a new tab.`
        );
      } catch (err: any) {
        console.error(
          "Login as user error:",
          err
        );

        setError(
          err?.message ||
            "Unable to login as this user."
        );
      }
    };


  /* ============================================================
     DASHBOARD CLICK
  ============================================================ */

  const handleDashboardClick =
    () => {
      setActiveSection(
        "dashboard"
      );

      setSidebarOpen(false);

      setError("");
      setSuccess("");
    };


  /* ============================================================
     WITHDRAWALS CLICK
  ============================================================ */

  const handleWithdrawalsClick =
    () => {
      setActiveSection(
        "dashboard"
      );

      setSidebarOpen(false);

      setError("");
      setSuccess("");

      /*
       * Refresh withdrawal data
       * whenever admin opens it.
       */
      loadWithdrawals();

      setTimeout(() => {
        document
          .getElementById(
            "admin-withdrawals"
          )
          ?.scrollIntoView({
            behavior:
              "smooth",

            block:
              "start",
          });
      }, 100);
    };


  /* ============================================================
     COPY TEXT
  ============================================================ */

  const copyText =
    async (
      value: string
    ) => {
      try {
        await navigator.clipboard.writeText(
          value
        );

        setSuccess(
          "Copied to clipboard."
        );

        setTimeout(() => {
          setSuccess("");
        }, 2000);
      } catch {
        setError(
          "Unable to copy."
        );
      }
    };


  /* ============================================================
     WITHDRAWAL ACTION
  ============================================================ */

  const handleAction =
    async (
      withdrawal: Withdrawal,

      action:
        | "approve"
        | "reject"
        | "mark-paid"
    ) => {
      try {
        setActionLoading(
          withdrawal.id
        );

        setError("");
        setSuccess("");

        const token =
          localStorage.getItem(
            "access_token"
          );

        if (!token) {
          navigate("/signin");
          return;
        }


        let body:
          Record<
            string,
            string | null
          > = {};


        /* ====================================================
           APPROVE
        ==================================================== */

        if (
          action ===
          "approve"
        ) {
          const note =
            window.prompt(
              `Approve withdrawal #${withdrawal.id}?\n\n` +
                `User: ${
                  withdrawal.user
                    ?.full_name ||
                  `User #${withdrawal.user_id}`
                }\n` +
                `Amount: $${Number(
                  withdrawal.amount
                ).toFixed(
                  2
                )}\n` +
                `Net Payout: $${Number(
                  withdrawal.net_amount
                ).toFixed(
                  2
                )}\n\n` +
                `Optional admin note:`,

              "Verified and approved by admin."
            );

          if (
            note === null
          ) {
            return;
          }

          body = {
            admin_note:
              note.trim() ||
              null,
          };
        }


        /* ====================================================
           REJECT
        ==================================================== */

        if (
          action ===
          "reject"
        ) {
          const note =
            window.prompt(
              `Enter rejection reason for withdrawal #${withdrawal.id}:`
            );

          if (
            note === null
          ) {
            return;
          }

          if (
            !note.trim()
          ) {
            setError(
              "Please enter a rejection reason."
            );

            return;
          }

          const confirmed =
            window.confirm(
              `Reject withdrawal #${withdrawal.id}?\n\n` +
                `$${Number(
                  withdrawal.amount
                ).toFixed(
                  2
                )} will be returned to the user's Income Wallet.`
            );

          if (
            !confirmed
          ) {
            return;
          }

          body = {
            admin_note:
              note.trim(),
          };
        }


        /* ====================================================
           MARK PAID
        ==================================================== */

        if (
          action ===
          "mark-paid"
        ) {
          const reference =
            window.prompt(
              `Enter USDT payment reference / TX hash for withdrawal #${withdrawal.id}:`
            );

          if (
            reference === null
          ) {
            return;
          }

          if (
            !reference.trim()
          ) {
            setError(
              "Payment reference / TX hash is required."
            );

            return;
          }

          const confirmed =
            window.confirm(
              `Confirm payment?\n\n` +
                `Withdrawal: #${withdrawal.id}\n` +
                `Gross Amount: $${Number(
                  withdrawal.amount
                ).toFixed(
                  2
                )}\n` +
                `Net USDT: $${Number(
                  withdrawal.net_amount
                ).toFixed(
                  2
                )}\n` +
                `BEP20: ${
                  withdrawal.bep20_address
                }\n\n` +
                `Only continue if payment has actually been sent.`
            );

          if (
            !confirmed
          ) {
            return;
          }

          body = {
            payment_reference:
              reference.trim(),
          };
        }


        /* ====================================================
           API
        ==================================================== */

        const endpoint =
          `${API_URL}/api/admin/withdrawals/` +
          `${withdrawal.id}/${action}`;


        const response =
          await fetch(
            endpoint,
            {
              method:
                "POST",

              headers: {
                Authorization:
                  `Bearer ${token}`,

                "Content-Type":
                  "application/json",

                Accept:
                  "application/json",
              },

              body:
                JSON.stringify(
                  body
                ),
            }
          );


        const data =
          await response.json();


        if (
          !response.ok
        ) {
          throw new Error(
            data?.detail ||
              "Withdrawal action failed."
          );
        }


        if (
          action ===
          "approve"
        ) {
          setSuccess(
            `Withdrawal #${withdrawal.id} approved successfully.`
          );
        }


        if (
          action ===
          "reject"
        ) {
          setSuccess(
            `Withdrawal #${withdrawal.id} rejected. Reserved amount has been refunded to the user's wallet.`
          );
        }


        if (
          action ===
          "mark-paid"
        ) {
          setSuccess(
            `Withdrawal #${withdrawal.id} marked as paid successfully.`
          );
        }


        await loadWithdrawals();
      } catch (err: any) {
        console.error(
          "Admin withdrawal action error:",
          err
        );

        setError(
          err?.message ||
            "Withdrawal action failed."
        );
      } finally {
        setActionLoading(
          null
        );
      }
    };


  /* ============================================================
     LOGOUT
  ============================================================ */

  const handleLogout =
    () => {
      localStorage.removeItem(
        "access_token"
      );

      localStorage.removeItem(
        "user"
      );

      localStorage.removeItem(
        "rememberMe"
      );

      navigate(
        "/signin",
        {
          replace: true,
        }
      );
    };


  /* ============================================================
     WITHDRAWAL STATS
  ============================================================ */

  const totalWithdrawals =
    withdrawals.length;


  const otpPendingWithdrawals =
    withdrawals.filter(
      (item) =>
        item.status ===
        "otp_pending"
    ).length;


  const pendingWithdrawals =
    withdrawals.filter(
      (item) =>
        item.status ===
        "pending"
    ).length;


  const approvedWithdrawals =
    withdrawals.filter(
      (item) =>
        item.status ===
        "approved"
    ).length;


  const paidWithdrawals =
    withdrawals.filter(
      (item) =>
        item.status ===
        "paid"
    ).length;


  const totalPaid =
    withdrawals
      .filter(
        (item) =>
          item.status ===
          "paid"
      )
      .reduce(
        (
          sum,
          item
        ) =>
          sum +
          Number(
            item.net_amount
          ),
        0
      );


  /* ============================================================
     SUPPORT STATS
  ============================================================ */

  const openSupportTickets = supportTickets.filter(
    (ticket) => ticket.status?.toLowerCase() === "open"
  ).length;

  const inProgressTickets = supportTickets.filter(
    (ticket) => ticket.status?.toLowerCase() === "in_progress"
  ).length;


  /* ============================================================
     WITHDRAWAL STATUS BADGE
  ============================================================ */

  const statusBadge =
    (
      status: string
    ) => {
      const value =
        status.toLowerCase();


      if (
        value ===
        "paid"
      ) {
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-green-400/20 bg-green-500/10 px-3 py-1 text-xs text-green-300">
            <CheckCircle className="h-3 w-3" />

            Paid
          </span>
        );
      }


      if (
        value ===
        "approved"
      ) {
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1 text-xs text-blue-300">
            <CheckCircle className="h-3 w-3" />

            Approved
          </span>
        );
      }


      if (
        value ===
        "rejected"
      ) {
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-red-400/20 bg-red-500/10 px-3 py-1 text-xs text-red-300">
            <XCircle className="h-3 w-3" />

            Rejected
          </span>
        );
      }


      if (
        value ===
        "cancelled"
      ) {
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/40">
            <XCircle className="h-3 w-3" />

            Cancelled
          </span>
        );
      }


      if (
        value ===
        "otp_pending"
      ) {
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-orange-400/20 bg-orange-500/10 px-3 py-1 text-xs text-orange-300">
            <Clock className="h-3 w-3" />

            OTP Pending
          </span>
        );
      }


      return (
        <span className="inline-flex items-center gap-1 rounded-full border border-yellow-400/20 bg-yellow-500/10 px-3 py-1 text-xs text-yellow-300">
          <Clock className="h-3 w-3" />

          Pending
        </span>
      );
    };


  /* ============================================================
     SUPPORT STATUS
  ============================================================ */

  const supportStatusBadge =
    (
      status: string
    ) => {
      if (
        status ===
        "open"
      ) {
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-red-400/20 bg-red-500/10 px-3 py-1 text-xs text-red-300">
            <span className="h-1.5 w-1.5 rounded-full bg-red-400" />

            Open
          </span>
        );
      }


      if (
        status ===
        "in_progress"
      ) {
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-yellow-400/20 bg-yellow-500/10 px-3 py-1 text-xs text-yellow-300">
            <Clock className="h-3 w-3" />

            In Progress
          </span>
        );
      }


      if (
        status ===
        "waiting_for_user"
      ) {
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1 text-xs text-blue-300">
            <Clock className="h-3 w-3" />

            Waiting
          </span>
        );
      }


      if (
        status ===
        "resolved"
      ) {
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-green-400/20 bg-green-500/10 px-3 py-1 text-xs text-green-300">
            <CheckCircle className="h-3 w-3" />

            Resolved
          </span>
        );
      }


      if (
        status ===
        "closed"
      ) {
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/40">
            <XCircle className="h-3 w-3" />

            Closed
          </span>
        );
      }


      return (
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/40">
          {status}
        </span>
      );
    };


  /* ============================================================
     SUPPORT PRIORITY
  ============================================================ */

  const supportPriorityBadge =
    (
      priority: string
    ) => {
      if (
        priority ===
        "urgent"
      ) {
        return (
          <span className="rounded-full border border-red-400/20 bg-red-500/10 px-3 py-1 text-xs text-red-300">
            Urgent
          </span>
        );
      }


      if (
        priority ===
        "high"
      ) {
        return (
          <span className="rounded-full border border-orange-400/20 bg-orange-500/10 px-3 py-1 text-xs text-orange-300">
            High
          </span>
        );
      }


      if (
        priority ===
        "normal"
      ) {
        return (
          <span className="rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1 text-xs text-blue-300">
            Normal
          </span>
        );
      }


      return (
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/50">
          {priority}
        </span>
      );
    };


  /* ============================================================
     UI
  ============================================================ */

  return (
    <div className="min-h-screen bg-black text-white">

      {/* BACKGROUND */}

      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-purple-950 via-black to-black" />

      <div className="fixed left-1/4 top-0 -z-10 h-96 w-96 rounded-full bg-purple-600/10 blur-[120px]" />

      <div className="fixed bottom-0 right-1/4 -z-10 h-96 w-96 rounded-full bg-purple-500/10 blur-[120px]" />


      {/* ======================================================
          MOBILE HEADER
      ====================================================== */}

      <div className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-white/10 bg-black/80 px-4 backdrop-blur-xl lg:hidden">

        <button
          onClick={() =>
            setSidebarOpen(true)
          }
          className="cursor-pointer rounded-lg p-2 hover:bg-white/10"
        >
          <Menu className="h-5 w-5" />
        </button>


        <div className="font-bold tracking-widest">
          APH ADMIN
        </div>


        <ShieldCheck className="h-5 w-5 text-purple-300" />

      </div>


      <div className="flex min-h-screen">

        {/* ====================================================
            SIDEBAR
        ==================================================== */}

        <aside
          className={`
            fixed inset-y-0 left-0 z-50
            w-64 border-r border-white/10
            bg-black/90 backdrop-blur-xl
            transition-transform duration-300
            lg:static lg:translate-x-0
            ${
              sidebarOpen
                ? "translate-x-0"
                : "-translate-x-full"
            }
          `}
        >

          <div className="flex h-full flex-col">

            {/* LOGO */}

            <div className="flex h-20 items-center justify-between border-b border-white/10 px-6">

              <div>

                <div className="text-lg font-bold tracking-widest">
                  APH
                </div>

                <div className="text-[10px] uppercase tracking-[0.25em] text-purple-300">
                  Admin Panel
                </div>

              </div>


              <button
                onClick={() =>
                  setSidebarOpen(
                    false
                  )
                }
                className="cursor-pointer lg:hidden"
              >
                <X className="h-5 w-5 text-white/60" />
              </button>

            </div>


            {/* ==================================================
                NAVIGATION
            ================================================== */}

            <nav className="flex-1 space-y-2 p-4">

              {/* DASHBOARD */}

              <button
                onClick={
                  handleDashboardClick
                }
                className={`flex w-full cursor-pointer items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
                  activeSection ===
                  "dashboard"
                    ? "bg-purple-500/15 text-purple-200"
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                }`}
              >
                <LayoutDashboard className="h-4 w-4" />

                Dashboard
              </button>


              {/* WITHDRAWALS */}

              <button
                onClick={
                  handleWithdrawalsClick
                }
                className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-4 py-3 text-sm text-white/60 transition hover:bg-white/5 hover:text-white"
              >
                <ArrowDownToLine className="h-4 w-4" />

                Withdrawals

                {pendingWithdrawals >
                  0 && (
                  <span className="ml-auto rounded-full bg-yellow-500/15 px-2 py-0.5 text-[10px] text-yellow-300">
                    {
                      pendingWithdrawals
                    }
                  </span>
                )}
              </button>


              {/* USERS */}

              <button
                onClick={
                  handleUsersClick
                }
                className={`flex w-full cursor-pointer items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
                  activeSection ===
                  "users"
                    ? "bg-purple-500/15 text-purple-200"
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Users className="h-4 w-4" />

                Users

                {usersLoaded &&
                  users.length >
                    0 && (
                    <span className="ml-auto rounded-full bg-purple-500/15 px-2 py-0.5 text-[10px] text-purple-300">
                      {
                        users.length
                      }
                    </span>
                  )}

              </button>


              {/* SUBSCRIPTIONS */}

              <button className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-4 py-3 text-sm text-white/60 transition hover:bg-white/5 hover:text-white">

                <CreditCard className="h-4 w-4" />

                Subscriptions

              </button>


              {/* TRANSACTIONS */}

              <button className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-4 py-3 text-sm text-white/60 transition hover:bg-white/5 hover:text-white">

                <Wallet className="h-4 w-4" />

                Transactions

              </button>


              {/* SUPPORT */}

              <button
                onClick={() => {
                  navigate(
                    "/admin/support"
                  );

                  setSidebarOpen(
                    false
                  );
                }}
                className="flex w-full cursor-pointer items-center justify-between rounded-xl px-4 py-3 text-sm text-white/60 transition hover:bg-white/5 hover:text-white"
              >

                <div className="flex items-center gap-3">

                  <MessageSquare className="h-4 w-4" />

                  Support Tickets

                </div>


                {openSupportTickets >
                  0 && (
                  <span className="min-w-[22px] rounded-full bg-red-500/20 px-2 py-0.5 text-center text-[10px] font-medium text-red-300">
                    {
                      openSupportTickets
                    }
                  </span>
                )}

              </button>

            </nav>


            {/* LOGOUT */}

            <div className="border-t border-white/10 p-4">

              <button
                onClick={
                  handleLogout
                }
                className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-4 py-3 text-sm text-red-300 transition hover:bg-red-500/10"
              >
                <LogOut className="h-4 w-4" />

                Logout
              </button>

            </div>

          </div>

        </aside>


        {/* MOBILE OVERLAY */}

        {sidebarOpen && (
          <div
            onClick={() =>
              setSidebarOpen(
                false
              )
            }
            className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          />
        )}


        {/* ====================================================
            MAIN
        ==================================================== */}

        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">

          {/* ==================================================
              USERS SECTION
          ================================================== */}

          {activeSection ===
          "users" ? (

            <>

              {/* USERS HEADER */}

              <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div>

                  <h1 className="text-2xl font-semibold">
                    Users
                  </h1>

                  <p className="mt-1 text-sm text-white/40">
                    Manage registered APH users
                  </p>

                </div>


                <div className="flex flex-wrap items-center gap-2">

                  <button
                    onClick={() =>
                      navigate(
                        "/admin/test-users"
                      )
                    }
                    className="flex cursor-pointer items-center gap-2 rounded-xl border border-purple-400/20 bg-purple-500/10 px-4 py-2 text-xs font-medium text-purple-300 transition hover:bg-purple-500/20"
                  >
                    <UserPlus className="h-4 w-4" />

                    Activate Test Users
                  </button>


                  <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-2">

                    <span className="text-xs text-white/40">
                      Total Users
                    </span>

                    <span className="ml-2 text-sm font-semibold text-purple-300">
                      {
                        users.length
                      }
                    </span>

                  </div>


                  <button
                    onClick={
                      loadUsers
                    }
                    disabled={
                      usersLoading
                    }
                    className="cursor-pointer rounded-lg border border-white/10 bg-white/5 p-2 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
                    title="Refresh users"
                  >
                    <RefreshCw
                      className={`h-4 w-4 ${
                        usersLoading
                          ? "animate-spin"
                          : ""
                      }`}
                    />
                  </button>

                </div>

              </div>


              {/* USERS ERROR */}

              {error && (
                <div className="mb-5 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  {error}
                </div>
              )}


              {success && (
                <div className="mb-5 rounded-xl border border-green-400/20 bg-green-500/10 px-4 py-3 text-sm text-green-300">
                  {success}
                </div>
              )}


              {/* USERS TABLE */}

              <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">

                <div className="border-b border-white/10 p-5">

                  <div className="flex items-center gap-2">

                    <Users className="h-5 w-5 text-purple-300" />

                    <h2 className="font-semibold">
                      Registered Users
                    </h2>

                  </div>


                  <p className="mt-1 text-xs text-white/40">
                    All users registered in Ads Promo Hub
                  </p>

                </div>


                <div className="overflow-x-auto">

                  {usersLoading ? (

                    <div className="flex min-h-60 items-center justify-center text-sm text-white/40">

                      <div className="flex items-center gap-3">

                        <RefreshCw className="h-4 w-4 animate-spin text-purple-300" />

                        Loading users...

                      </div>

                    </div>

                  ) : users.length ===
                    0 ? (

                    <div className="flex min-h-60 flex-col items-center justify-center text-center">

                      <Users className="mb-3 h-8 w-8 text-white/20" />

                      <p className="text-sm text-white/40">
                        No users found
                      </p>

                      <p className="mt-1 text-xs text-white/20">
                        Registered users will appear here
                      </p>


                      <button
                        onClick={
                          loadUsers
                        }
                        disabled={
                          usersLoading
                        }
                        className="mt-4 flex cursor-pointer items-center gap-2 rounded-lg bg-purple-500/10 px-3 py-2 text-xs text-purple-300 transition hover:bg-purple-500/20 disabled:opacity-50"
                      >
                        <RefreshCw
                          className={`h-3.5 w-3.5 ${
                            usersLoading
                              ? "animate-spin"
                              : ""
                          }`}
                        />

                        Refresh
                      </button>

                    </div>

                  ) : (

                    <table className="w-full min-w-[1000px] text-left">

                      <thead>

                        <tr className="border-b border-white/10 text-xs text-white/40">

                          <th className="px-5 py-4">
                            S.N
                          </th>

                          <th className="px-5 py-4">
                            Name
                          </th>

                          <th className="px-5 py-4">
                            Referral ID
                          </th>

                          <th className="px-5 py-4">
                            Customer ID
                          </th>

                          <th className="px-5 py-4">
                            Sponsor ID
                          </th>

                          <th className="px-5 py-4">
                            Date of Join
                          </th>

                          <th className="px-5 py-4">
                            Login
                          </th>

                        </tr>

                      </thead>


                      <tbody>

                        {users.map(
                          (
                            user,
                            index
                          ) => (

                            <tr
                              key={
                                user.id
                              }
                              className="border-b border-white/5 transition hover:bg-white/[0.03]"
                            >

                              <td className="px-5 py-4">

                                <span className="text-sm text-white/50">
                                  {
                                    index +
                                    1
                                  }
                                </span>

                              </td>


                              <td className="px-5 py-4">

                                <div className="text-sm font-medium text-white/90">
                                  {
                                    user.full_name
                                  }
                                </div>

                                <div className="mt-1 max-w-[220px] truncate text-xs text-white/30">
                                  {
                                    user.email
                                  }
                                </div>

                              </td>


                              <td className="px-5 py-4">

                                <span className="inline-flex rounded-lg border border-purple-400/20 bg-purple-500/10 px-2.5 py-1 text-xs font-medium text-purple-300">
                                  {
                                    user.referral_code
                                  }
                                </span>

                              </td>


                              <td className="px-5 py-4">

                                <span className="text-sm font-medium text-white/80">
                                  {
                                    user.customer_id
                                  }
                                </span>

                              </td>


                              <td className="px-5 py-4">

                                {user.referred_by ? (

                                  <span className="inline-flex rounded-lg border border-blue-400/20 bg-blue-500/10 px-2.5 py-1 text-xs font-medium text-blue-300">
                                    {
                                      user.referred_by
                                    }
                                  </span>

                                ) : (

                                  <span className="text-sm text-white/30">
                                    —
                                  </span>

                                )}

                              </td>


                              <td className="px-5 py-4">

                                <div className="text-xs text-white/60">
                                  {user.created_at
                                    ? new Date(
                                        user.created_at
                                      ).toLocaleDateString(
                                        "en-IN"
                                      )
                                    : "—"}
                                </div>

                                <div className="mt-1 text-[10px] text-white/25">
                                  {user.created_at
                                    ? new Date(
                                        user.created_at
                                      ).toLocaleTimeString(
                                        "en-IN",
                                        {
                                          hour:
                                            "2-digit",

                                          minute:
                                            "2-digit",
                                        }
                                      )
                                    : ""}
                                </div>

                              </td>


                              <td className="px-5 py-4">

                                {user.is_admin ? (

                                  <span className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/30">

                                    <ShieldCheck className="h-3.5 w-3.5" />

                                    Admin

                                  </span>

                                ) : (

                                  <button
                                    onClick={() =>
                                      handleLoginAsUser(
                                        user.id
                                      )
                                    }
                                    disabled={
                                      !user.is_active
                                    }
                                    className="cursor-pointer rounded-lg bg-purple-500/10 px-3 py-2 text-xs text-purple-300 transition hover:bg-purple-500/20 disabled:cursor-not-allowed disabled:opacity-40"
                                    title={
                                      user.is_active
                                        ? `Login as ${user.full_name}`
                                        : "User account is inactive"
                                    }
                                  >
                                    {user.is_active
                                      ? "Login"
                                      : "Inactive"}
                                  </button>

                                )}

                              </td>

                            </tr>

                          )
                        )}

                      </tbody>

                    </table>

                  )}

                </div>

              </div>

            </>

          ) : (

            <>

              {/* =================================================
                  DASHBOARD HEADER
              ================================================= */}

              <div className="mb-8 hidden items-center justify-between lg:flex">

                <div>

                  <h1 className="text-2xl font-semibold">
                    Admin Dashboard
                  </h1>

                  <p className="mt-1 text-sm text-white/40">
                    Manage Ads Promo Hub
                  </p>

                </div>


                <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-2">

                  <ShieldCheck className="h-4 w-4 text-purple-300" />

                  <span className="text-sm text-white/70">
                    Administrator
                  </span>

                </div>

              </div>


              {/* MESSAGES */}

              {error && (
                <div className="mb-5 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  {error}
                </div>
              )}


              {success && (
                <div className="mb-5 rounded-xl border border-green-400/20 bg-green-500/10 px-4 py-3 text-sm text-green-300">
                  {success}
                </div>
              )}


              {/* =================================================
                  STATS
              ================================================= */}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-7">

                <StatCard
                  title="Total Withdrawals"
                  value={
                    totalWithdrawals
                  }
                  icon={
                    <ArrowDownToLine />
                  }
                />


                <StatCard
                  title="OTP Pending"
                  value={
                    otpPendingWithdrawals
                  }
                  icon={
                    <Clock />
                  }
                />


                <StatCard
                  title="Pending"
                  value={
                    pendingWithdrawals
                  }
                  icon={
                    <Clock />
                  }
                />


                <StatCard
                  title="Approved"
                  value={
                    approvedWithdrawals
                  }
                  icon={
                    <CheckCircle />
                  }
                />


                <StatCard
                  title="Paid"
                  value={
                    paidWithdrawals
                  }
                  icon={
                    <DollarSign />
                  }
                />


                <StatCard
                  title="Total Paid"
                  value={`$${totalPaid.toFixed(
                    2
                  )}`}
                  icon={
                    <Wallet />
                  }
                />


                <StatCard
                  title="Open Tickets"
                  value={
                    openSupportTickets
                  }
                  icon={
                    <MessageSquare />
                  }
                />

              </div>


              {/* =================================================
                  WITHDRAWALS
              ================================================= */}

              <div
                id="admin-withdrawals"
                className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]"
              >

                {/* HEADER */}

                <div className="flex flex-col gap-4 border-b border-white/10 p-5 sm:flex-row sm:items-center sm:justify-between">

                  <div>

                    <div className="flex items-center gap-2">

                      <ArrowDownToLine className="h-5 w-5 text-purple-300" />

                      <h2 className="font-semibold">
                        Withdrawal Management
                      </h2>

                    </div>


                    <p className="mt-1 text-xs text-white/40">
                      Manage APH user withdrawal requests
                    </p>

                  </div>


                  <div className="flex items-center gap-2">

                    <select
                      value={
                        filter
                      }
                      onChange={(
                        e
                      ) =>
                        setFilter(
                          e.target.value
                        )
                      }
                      className="cursor-pointer rounded-lg border border-white/10 bg-black px-3 py-2 text-xs text-white outline-none"
                    >

                      <option value="all">
                        All
                      </option>

                      <option value="otp_pending">
                        OTP Pending
                      </option>

                      <option value="pending">
                        Pending
                      </option>

                      <option value="approved">
                        Approved
                      </option>

                      <option value="paid">
                        Paid
                      </option>

                      <option value="rejected">
                        Rejected
                      </option>

                      <option value="cancelled">
                        Cancelled
                      </option>

                    </select>


                    <button
                      onClick={
                        loadWithdrawals
                      }
                      disabled={
                        loading
                      }
                      className="cursor-pointer rounded-lg border border-white/10 bg-white/5 p-2 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
                      title="Refresh withdrawals"
                    >
                      <RefreshCw
                        className={`h-4 w-4 ${
                          loading
                            ? "animate-spin"
                            : ""
                        }`}
                      />
                    </button>

                  </div>

                </div>


                {/* TABLE */}

                <div className="overflow-x-auto">

                  {loading ? (

                    <div className="flex min-h-60 items-center justify-center">

                      <div className="flex items-center gap-3 text-sm text-white/40">

                        <RefreshCw className="h-4 w-4 animate-spin text-purple-300" />

                        Loading withdrawals...

                      </div>

                    </div>

                  ) : withdrawals.length ===
                    0 ? (

                    <div className="flex min-h-60 flex-col items-center justify-center text-center">

                      <ArrowDownToLine className="mb-3 h-8 w-8 text-white/20" />

                      <p className="text-sm text-white/40">
                        No withdrawals found
                      </p>

                      <p className="mt-1 text-xs text-white/20">
                        Withdrawal requests will appear here
                      </p>

                    </div>

                  ) : (

                    <table className="w-full min-w-[1550px] text-left">

                      <thead>

                        <tr className="border-b border-white/10 text-xs text-white/40">

                          <th className="px-5 py-4">
                            ID
                          </th>

                          <th className="px-5 py-4">
                            User
                          </th>

                          <th className="px-5 py-4">
                            Customer ID
                          </th>

                          <th className="px-5 py-4">
                            Type
                          </th>

                          <th className="px-5 py-4">
                            Amount
                          </th>

                          <th className="px-5 py-4">
                            Fee
                          </th>

                          <th className="px-5 py-4">
                            Net Payout
                          </th>

                          <th className="px-5 py-4">
                            BEP20 Address
                          </th>

                          <th className="px-5 py-4">
                            OTP
                          </th>

                          <th className="px-5 py-4">
                            Status
                          </th>

                          <th className="px-5 py-4">
                            Created
                          </th>

                          <th className="px-5 py-4">
                            Action
                          </th>

                        </tr>

                      </thead>


                      <tbody>

                        {withdrawals.map(
                          (
                            withdrawal
                          ) => {

                            const isLoading =
                              actionLoading ===
                              withdrawal.id;


                            const isAdmin =
                              withdrawal.processing_type ===
                              "admin";


                            const isAuto =
                              withdrawal.processing_type ===
                              "auto";


                            return (

                              <tr
                                key={
                                  withdrawal.id
                                }
                                className="border-b border-white/5 transition hover:bg-white/[0.03]"
                              >

                                {/* ID */}

                                <td className="px-5 py-4">

                                  <span className="text-sm font-medium">
                                    #
                                    {
                                      withdrawal.id
                                    }
                                  </span>

                                </td>


                                {/* USER */}

                                <td className="px-5 py-4">

                                  <div className="max-w-[200px]">

                                    <div className="truncate text-sm font-medium text-white/90">
                                      {withdrawal.user
                                        ?.full_name ||
                                        `User #${withdrawal.user_id}`}
                                    </div>


                                    {withdrawal.user
                                      ?.email && (

                                      <div className="mt-1 truncate text-xs text-white/30">
                                        {
                                          withdrawal
                                            .user
                                            .email
                                        }
                                      </div>

                                    )}


                                    {withdrawal.user
                                      ?.phone_number && (

                                      <div className="mt-1 text-[10px] text-white/25">
                                        {
                                          withdrawal
                                            .user
                                            .phone_number
                                        }
                                      </div>

                                    )}

                                  </div>

                                </td>


                                {/* CUSTOMER ID */}

                                <td className="px-5 py-4">

                                  <span className="inline-flex rounded-lg border border-purple-400/20 bg-purple-500/10 px-2.5 py-1 text-xs font-medium text-purple-300">
                                    {withdrawal.user
                                      ?.customer_id ||
                                      withdrawal.user
                                        ?.referral_id ||
                                      `#${withdrawal.user_id}`}
                                  </span>

                                </td>


                                {/* TYPE */}

                                <td className="px-5 py-4">

                                  {isAuto ? (

                                    <span className="inline-flex rounded-full border border-green-400/20 bg-green-500/10 px-3 py-1 text-xs font-medium text-green-300">
                                      AUTO
                                    </span>

                                  ) : isAdmin ? (

                                    <span className="inline-flex rounded-full border border-purple-400/20 bg-purple-500/10 px-3 py-1 text-xs font-medium text-purple-300">
                                      ADMIN
                                    </span>

                                  ) : (

                                    <span className="text-xs text-white/30">
                                      {
                                        withdrawal.processing_type
                                      }
                                    </span>

                                  )}

                                </td>


                                {/* AMOUNT */}

                                <td className="px-5 py-4">

                                  <span className="text-sm font-semibold">
                                    $
                                    {Number(
                                      withdrawal.amount
                                    ).toFixed(
                                      2
                                    )}
                                  </span>

                                </td>


                                {/* FEE */}

                                <td className="px-5 py-4">

                                  <div className="text-sm text-red-300">
                                    -$
                                    {Number(
                                      withdrawal.fee
                                    ).toFixed(
                                      2
                                    )}
                                  </div>

                                  <div className="mt-1 text-[10px] text-white/30">
                                    {Number(
                                      withdrawal.fee_percentage
                                    ).toFixed(
                                      0
                                    )}
                                    %
                                  </div>

                                </td>


                                {/* NET PAYOUT */}

                                <td className="px-5 py-4">

                                  <span className="text-sm font-semibold text-green-300">
                                    $
                                    {Number(
                                      withdrawal.net_amount
                                    ).toFixed(
                                      2
                                    )}
                                  </span>

                                </td>


                                {/* BEP20 */}

                                <td className="px-5 py-4">

                                  <div className="flex max-w-[210px] items-center gap-2">

                                    <span
                                      className="truncate text-xs text-white/50"
                                      title={
                                        withdrawal.bep20_address
                                      }
                                    >
                                      {
                                        withdrawal.bep20_address
                                      }
                                    </span>


                                    <button
                                      type="button"
                                      onClick={() =>
                                        copyText(
                                          withdrawal.bep20_address
                                        )
                                      }
                                      className="cursor-pointer rounded-md border border-white/10 bg-white/5 p-1.5 text-purple-300 transition hover:bg-white/10"
                                      title="Copy BEP20 address"
                                    >
                                      <Copy className="h-3 w-3" />
                                    </button>

                                  </div>

                                </td>


                                {/* OTP */}

                                <td className="px-5 py-4">

                                  {withdrawal.otp_verified ? (

                                    <span className="inline-flex items-center gap-1 text-xs text-green-300">

                                      <CheckCircle className="h-3.5 w-3.5" />

                                      Verified

                                    </span>

                                  ) : (

                                    <span className="inline-flex items-center gap-1 text-xs text-yellow-300">

                                      <Clock className="h-3.5 w-3.5" />

                                      Pending

                                    </span>

                                  )}

                                </td>


                                {/* STATUS */}

                                <td className="px-5 py-4">

                                  {statusBadge(
                                    withdrawal.status
                                  )}

                                </td>


                                {/* CREATED */}

                                <td className="px-5 py-4">

                                  <div className="text-xs text-white/60">
                                    {withdrawal.created_at
                                      ? new Date(
                                          withdrawal.created_at
                                        ).toLocaleDateString(
                                          "en-IN"
                                        )
                                      : "—"}
                                  </div>


                                  <div className="mt-1 text-[10px] text-white/25">
                                    {withdrawal.created_at
                                      ? new Date(
                                          withdrawal.created_at
                                        ).toLocaleTimeString(
                                          "en-IN",
                                          {
                                            hour:
                                              "2-digit",

                                            minute:
                                              "2-digit",
                                          }
                                        )
                                      : ""}
                                  </div>

                                </td>


                                {/* ACTION */}

                                <td className="px-5 py-4">

                                  <div className="flex min-w-[200px] flex-wrap items-center gap-2">


                                    {/* ====================================
                                        ADMIN > $20
                                        PENDING
                                    ==================================== */}

                                    {withdrawal.status ===
                                      "pending" &&
                                      isAdmin &&
                                      withdrawal.otp_verified && (

                                        <>

                                          <button
                                            disabled={
                                              isLoading
                                            }
                                            onClick={() =>
                                              handleAction(
                                                withdrawal,
                                                "approve"
                                              )
                                            }
                                            className="cursor-pointer rounded-lg bg-green-500/10 px-3 py-2 text-xs text-green-300 transition hover:bg-green-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                                          >
                                            {isLoading
                                              ? "..."
                                              : "Approve"}
                                          </button>


                                          <button
                                            disabled={
                                              isLoading
                                            }
                                            onClick={() =>
                                              handleAction(
                                                withdrawal,
                                                "reject"
                                              )
                                            }
                                            className="cursor-pointer rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-300 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                                          >
                                            Reject
                                          </button>

                                        </>

                                      )}


                                    {/* ====================================
                                        AUTO $5-$20
                                    ==================================== */}

                                    {withdrawal.status ===
                                      "pending" &&
                                      isAuto &&
                                      withdrawal.otp_verified && (

                                        <>

                                          <button
                                            disabled={
                                              isLoading
                                            }
                                            onClick={() =>
                                              handleAction(
                                                withdrawal,
                                                "mark-paid"
                                              )
                                            }
                                            className="cursor-pointer rounded-lg bg-purple-500/10 px-3 py-2 text-xs text-purple-300 transition hover:bg-purple-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                                          >
                                            {isLoading
                                              ? "Processing..."
                                              : "Mark Paid"}
                                          </button>


                                          <button
                                            disabled={
                                              isLoading
                                            }
                                            onClick={() =>
                                              handleAction(
                                                withdrawal,
                                                "reject"
                                              )
                                            }
                                            className="cursor-pointer rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-300 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                                          >
                                            Reject
                                          </button>

                                        </>

                                      )}


                                    {/* ====================================
                                        APPROVED
                                    ==================================== */}

                                    {withdrawal.status ===
                                      "approved" && (

                                        <>

                                          <button
                                            disabled={
                                              isLoading
                                            }
                                            onClick={() =>
                                              handleAction(
                                                withdrawal,
                                                "mark-paid"
                                              )
                                            }
                                            className="cursor-pointer rounded-lg bg-purple-500/10 px-3 py-2 text-xs text-purple-300 transition hover:bg-purple-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                                          >
                                            {isLoading
                                              ? "Processing..."
                                              : "Mark Paid"}
                                          </button>


                                          <button
                                            disabled={
                                              isLoading
                                            }
                                            onClick={() =>
                                              handleAction(
                                                withdrawal,
                                                "reject"
                                              )
                                            }
                                            className="cursor-pointer rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-300 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                                          >
                                            Reject
                                          </button>

                                        </>

                                      )}


                                    {/* OTP PENDING */}

                                    {withdrawal.status ===
                                      "otp_pending" && (

                                      <span className="inline-flex items-center gap-1 text-xs text-yellow-300/70">

                                        <Clock className="h-3.5 w-3.5" />

                                        Waiting for OTP

                                      </span>

                                    )}


                                    {/* PAID */}

                                    {withdrawal.status ===
                                      "paid" && (

                                      <div>

                                        <div className="inline-flex items-center gap-1 text-xs text-green-300">

                                          <CheckCircle className="h-3.5 w-3.5" />

                                          Completed

                                        </div>


                                        {withdrawal.payment_reference && (

                                          <button
                                            type="button"
                                            onClick={() =>
                                              copyText(
                                                withdrawal.payment_reference!
                                              )
                                            }
                                            className="mt-1 flex max-w-[170px] cursor-pointer items-center gap-1 text-[10px] text-purple-300 hover:underline"
                                            title={
                                              withdrawal.payment_reference
                                            }
                                          >

                                            <Copy className="h-3 w-3 shrink-0" />

                                            <span className="truncate">
                                              {
                                                withdrawal.payment_reference
                                              }
                                            </span>

                                          </button>

                                        )}

                                      </div>

                                    )}


                                    {/* REJECTED */}

                                    {withdrawal.status ===
                                      "rejected" && (

                                      <div>

                                        <div className="inline-flex items-center gap-1 text-xs text-white/40">

                                          <XCircle className="h-3.5 w-3.5" />

                                          Refunded

                                        </div>


                                        {withdrawal.admin_note && (

                                          <div
                                            className="mt-1 max-w-[180px] truncate text-[10px] text-red-300/60"
                                            title={
                                              withdrawal.admin_note
                                            }
                                          >
                                            {
                                              withdrawal.admin_note
                                            }
                                          </div>

                                        )}

                                      </div>

                                    )}


                                    {/* CANCELLED */}

                                    {withdrawal.status ===
                                      "cancelled" && (

                                      <span className="text-xs text-white/30">
                                        Cancelled
                                      </span>

                                    )}


                                    {/* PENDING BUT OTP NOT VERIFIED */}

                                    {withdrawal.status ===
                                      "pending" &&
                                      !withdrawal.otp_verified && (

                                      <span className="text-xs text-yellow-300/70">
                                        OTP verification required
                                      </span>

                                    )}

                                  </div>

                                </td>

                              </tr>

                            );
                          }
                        )}

                      </tbody>

                    </table>

                  )}

                </div>

              </div>


              {/* =================================================
                  RECENT SUPPORT TICKETS
              ================================================= */}

              <div className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">

                {/* HEADER */}

                <div className="flex flex-col gap-4 border-b border-white/10 p-5 sm:flex-row sm:items-center sm:justify-between">

                  <div>

                    <div className="flex items-center gap-2">

                      <MessageSquare className="h-5 w-5 text-purple-300" />

                      <h2 className="font-semibold">
                        Recent Support Tickets
                      </h2>


                      {openSupportTickets >
                        0 && (

                        <span className="rounded-full bg-red-500/15 px-2 py-0.5 text-[10px] text-red-300">
                          {
                            openSupportTickets
                          }{" "}
                          Open
                        </span>

                      )}

                    </div>


                    <p className="mt-1 text-xs text-white/40">
                      User queries and support requests
                    </p>

                  </div>


                  <div className="flex items-center gap-2">

                    <button
                      onClick={
                        loadSupportTickets
                      }
                      className="cursor-pointer rounded-lg border border-white/10 bg-white/5 p-2 transition hover:bg-white/10"
                      title="Refresh support tickets"
                    >
                      <RefreshCw
                        className={`h-4 w-4 ${
                          supportLoading
                            ? "animate-spin"
                            : ""
                        }`}
                      />
                    </button>


                    <button
                      onClick={() =>
                        navigate(
                          "/admin/support"
                        )
                      }
                      className="cursor-pointer rounded-lg bg-purple-500/10 px-4 py-2 text-xs text-purple-300 transition hover:bg-purple-500/20"
                    >
                      View All
                    </button>

                  </div>

                </div>


                {/* SUPPORT TABLE */}

                <div className="overflow-x-auto">

                  {supportLoading ? (

                    <div className="flex min-h-48 items-center justify-center text-sm text-white/40">
                      Loading support tickets...
                    </div>

                  ) : supportTickets.length ===
                    0 ? (

                    <div className="flex min-h-48 flex-col items-center justify-center text-center">

                      <MessageSquare className="mb-3 h-8 w-8 text-white/20" />

                      <p className="text-sm text-white/40">
                        No support tickets found
                      </p>

                      <p className="mt-1 text-xs text-white/20">
                        New user queries will appear here
                      </p>

                    </div>

                  ) : (

                    <table className="w-full min-w-[1100px] text-left">

                      <thead>

                        <tr className="border-b border-white/10 text-xs text-white/40">

                          <th className="px-5 py-4">
                            Ticket
                          </th>

                          <th className="px-5 py-4">
                            User
                          </th>

                          <th className="px-5 py-4">
                            Referral ID
                          </th>

                          <th className="px-5 py-4">
                            Category
                          </th>

                          <th className="px-5 py-4">
                            Subject
                          </th>

                          <th className="px-5 py-4">
                            Priority
                          </th>

                          <th className="px-5 py-4">
                            Status
                          </th>

                          <th className="px-5 py-4">
                            Created
                          </th>

                          <th className="px-5 py-4">
                            Action
                          </th>

                        </tr>

                      </thead>


                      <tbody>

                        {supportTickets
                          .slice(
                            0,
                            5
                          )
                          .map(
                            (
                              ticket
                            ) => (

                              <tr
                                key={
                                  ticket.id
                                }
                                className="border-b border-white/5 transition hover:bg-white/[0.03]"
                              >

                                {/* TICKET */}

                                <td className="px-5 py-4">

                                  <div className="text-sm font-medium text-white/90">
                                    {
                                      ticket.ticket_number
                                    }
                                  </div>

                                  <div className="mt-1 text-[10px] text-white/30">
                                    Ticket #
                                    {
                                      ticket.id
                                    }
                                  </div>

                                </td>


                                {/* USER */}

                                <td className="px-5 py-4">

                                  <div className="text-sm text-white/80">
                                    {ticket.user
                                      ?.full_name ||
                                      ticket.user_name ||
                                      `User #${ticket.user_id}`}
                                  </div>


                                  {(ticket.user
                                    ?.email ||
                                    ticket.user_email) && (

                                    <div className="mt-1 max-w-[180px] truncate text-xs text-white/30">
                                      {ticket.user
                                        ?.email ||
                                        ticket.user_email}
                                    </div>

                                  )}

                                </td>


                                {/* REFERRAL */}

                                <td className="px-5 py-4">

                                  <span className="inline-flex rounded-lg border border-purple-400/20 bg-purple-500/10 px-2.5 py-1 text-xs font-medium text-purple-300">
                                    {ticket.user
                                      ?.referral_code ||
                                      ticket.referral_code ||
                                      "—"}
                                  </span>

                                </td>


                                {/* CATEGORY */}

                                <td className="px-5 py-4">

                                  <span className="text-xs text-white/60">
                                    {
                                      ticket.category
                                    }
                                  </span>

                                </td>


                                {/* SUBJECT */}

                                <td className="max-w-[220px] px-5 py-4">

                                  <div className="truncate text-sm text-white/80">
                                    {
                                      ticket.subject
                                    }
                                  </div>


                                  {ticket.description && (

                                    <div className="mt-1 max-w-[220px] truncate text-xs text-white/25">
                                      {
                                        ticket.description
                                      }
                                    </div>

                                  )}

                                </td>


                                {/* PRIORITY */}

                                <td className="px-5 py-4">

                                  {supportPriorityBadge(
                                    ticket.priority
                                  )}

                                </td>


                                {/* STATUS */}

                                <td className="px-5 py-4">

                                  {supportStatusBadge(
                                    ticket.status
                                  )}

                                </td>


                                {/* CREATED */}

                                <td className="px-5 py-4">

                                  <div className="text-xs text-white/50">
                                    {ticket.created_at
                                      ? new Date(
                                          ticket.created_at
                                        ).toLocaleDateString(
                                          "en-IN"
                                        )
                                      : "—"}
                                  </div>


                                  <div className="mt-1 text-[10px] text-white/25">
                                    {ticket.created_at
                                      ? new Date(
                                          ticket.created_at
                                        ).toLocaleTimeString(
                                          "en-IN",
                                          {
                                            hour:
                                              "2-digit",

                                            minute:
                                              "2-digit",
                                          }
                                        )
                                      : ""}
                                  </div>

                                </td>


                                {/* ACTION */}

                                <td className="px-5 py-4">

                                  <button
                                    onClick={() =>
                                      navigate(
                                        `/admin/support/${ticket.id}`
                                      )
                                    }
                                    className="cursor-pointer rounded-lg bg-purple-500/10 px-3 py-2 text-xs text-purple-300 transition hover:bg-purple-500/20"
                                  >
                                    View
                                  </button>

                                </td>

                              </tr>

                            )
                          )}

                      </tbody>

                    </table>

                  )}

                </div>

              </div>


              {/* =================================================
                  SUPPORT SUMMARY
              ================================================= */}

              {!supportLoading &&
                supportTickets.length >
                  0 && (

                  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">

                    <div className="rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3">

                      <div className="flex items-center justify-between">

                        <span className="text-xs text-white/40">
                          Total Tickets
                        </span>

                        <MessageSquare className="h-4 w-4 text-purple-300" />

                      </div>


                      <div className="mt-2 text-lg font-semibold">
                        {
                          supportTickets.length
                        }
                      </div>

                    </div>


                    <div className="rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3">

                      <div className="flex items-center justify-between">

                        <span className="text-xs text-white/40">
                          Open
                        </span>

                        <span className="h-2 w-2 rounded-full bg-red-400" />

                      </div>


                      <div className="mt-2 text-lg font-semibold text-red-300">
                        {
                          openSupportTickets
                        }
                      </div>

                    </div>


                    <div className="rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3">

                      <div className="flex items-center justify-between">

                        <span className="text-xs text-white/40">
                          In Progress
                        </span>

                        <Clock className="h-4 w-4 text-yellow-300" />

                      </div>


                      <div className="mt-2 text-lg font-semibold text-yellow-300">
                        {
                          inProgressTickets
                        }
                      </div>

                    </div>

                  </div>

                )}

            </>

          )}

        </main>

      </div>

    </div>
  );
}


/* ============================================================
   STAT CARD
============================================================ */

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;

  value:
    | string
    | number;

  icon:
    React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-purple-400/20 hover:bg-white/[0.05]">

      <div className="mb-4 flex items-center justify-between">

        <span className="text-xs text-white/40">
          {title}
        </span>


        <div className="rounded-lg bg-purple-500/10 p-2 text-purple-300">

          {React.cloneElement(
            icon as React.ReactElement<{
              className?: string;
            }>,

            {
              className:
                "h-4 w-4",
            }
          )}

        </div>

      </div>


      <div className="text-2xl font-semibold">
        {value}
      </div>

    </div>
  );
}