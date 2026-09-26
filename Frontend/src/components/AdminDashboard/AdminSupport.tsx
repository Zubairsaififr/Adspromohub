import React, {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

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
  RefreshCw,
  ShieldCheck,
  Headphones,
  MessageSquare,
  Eye,
  ArrowLeft,
  Send,
  User,
  Mail,
  Phone,
  Copy,
  AlertCircle,
  Loader2,
} from "lucide-react";


// ============================================
// API
// ============================================

const RAW_API_URL =
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:8000";

const API_URL =
  RAW_API_URL.replace(/\/+$/, "");


// ============================================
// TYPES
// ============================================

interface SupportTicket {
  id: number;
  ticket_number: string;
  user_id: number;

  full_name: string;
  email: string;
  phone_number?: string | null;

  referral_id?: string | null;
  referral_code?: string | null;

  category: string;
  subject: string;
  description: string;
  priority: string;
  status: string;

  created_at: string;
  updated_at: string;
  resolved_at?: string | null;
}


interface TicketMessage {
  id: number;
  sender_type: string;
  sender_id?: number | null;
  message: string;
  created_at: string;
}


interface TicketUser {
  id: number;
  full_name: string;
  email: string;
  phone_number?: string | null;

  referral_id?: string | null;
  referral_code?: string | null;

  customer_id?: string | null;
}


interface TicketDetail {
  id: number;
  ticket_number: string;

  user: TicketUser;

  category: string;
  subject: string;
  description: string;
  priority: string;
  status: string;

  created_at: string;
  updated_at: string;
  resolved_at?: string | null;

  messages: TicketMessage[];
}


interface TicketsResponse {
  success?: boolean;
  count?: number;
  tickets: SupportTicket[];
}


interface TicketDetailResponse {
  success?: boolean;
  message?: string;
  ticket: TicketDetail;
}


// ============================================
// COMPONENT
// ============================================

export default function AdminSupport() {

  const navigate =
    useNavigate();

  const { ticketId } =
    useParams();


  // ============================================
  // STATE
  // ============================================

  const [
    sidebarOpen,
    setSidebarOpen,
  ] = useState(false);


  const [
    tickets,
    setTickets,
  ] = useState<SupportTicket[]>([]);


  const [
    ticket,
    setTicket,
  ] = useState<TicketDetail | null>(
    null
  );


  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    detailLoading,
    setDetailLoading,
  ] = useState(false);


  const [
    actionLoading,
    setActionLoading,
  ] = useState(false);


  const [
    filter,
    setFilter,
  ] = useState("all");


  const [
    reply,
    setReply,
  ] = useState("");


  const [
    error,
    setError,
  ] = useState("");


  const [
    success,
    setSuccess,
  ] = useState("");


  // ============================================
  // TOKEN
  // ============================================

  const getToken = (): string => {

    try {

      const directToken =
        localStorage.getItem(
          "access_token"
        );

      if (directToken) {
        return directToken;
      }


      const savedUser =
        localStorage.getItem(
          "user"
        );

      if (!savedUser) {
        return "";
      }


      const parsed =
        JSON.parse(savedUser);


      return (
        parsed?.access_token ||
        parsed?.accessToken ||
        ""
      );

    } catch {

      return "";
    }
  };


  // ============================================
  // LOGOUT / INVALID SESSION
  // ============================================

  const clearSession = () => {

    localStorage.removeItem(
      "access_token"
    );

    localStorage.removeItem(
      "user"
    );

    localStorage.removeItem(
      "rememberMe"
    );
  };


  const handleUnauthorized = () => {

    clearSession();

    navigate(
      "/signin",
      {
        replace: true,
      }
    );
  };


  // ============================================
  // API ERROR
  // ============================================

  const getApiError = async (
    response: Response,
    fallback: string
  ) => {

    try {

      const data =
        await response.json();


      if (
        typeof data?.detail ===
        "string"
      ) {
        return data.detail;
      }


      if (
        typeof data?.message ===
        "string"
      ) {
        return data.message;
      }


      if (
        Array.isArray(data?.detail)
      ) {

        return data.detail
          .map(
            (item: any) =>
              item?.msg ||
              "Validation error"
          )
          .join(", ");
      }

    } catch {
      // Ignore invalid JSON response.
    }


    return fallback;
  };


  // ============================================
  // ADMIN CHECK
  // ============================================

  useEffect(() => {

    const token =
      getToken();

    const savedUser =
      localStorage.getItem(
        "user"
      );


    if (
      !token ||
      !savedUser
    ) {

      handleUnauthorized();

      return;
    }


    try {

      const user =
        JSON.parse(savedUser);


      const isAdmin =
        user?.is_admin === true ||
        user?.role === "admin";


      if (!isAdmin) {

        navigate(
          "/newdashboard",
          {
            replace: true,
          }
        );
      }

    } catch {

      handleUnauthorized();
    }

  }, [navigate]);


  // ============================================
  // LOAD TICKETS
  // ============================================

  const loadTickets = async (
    showLoading = true
  ) => {

    try {

      if (showLoading) {
        setLoading(true);
      }

      setError("");


      const token =
        getToken();


      if (!token) {

        handleUnauthorized();

        return;
      }


      let url =
        `${API_URL}/api/admin/support/tickets`;


      if (
        filter !== "all"
      ) {

        url +=
          `?status_filter=${encodeURIComponent(
            filter
          )}`;
      }


      const response =
        await fetch(
          url,
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


      if (
        response.status === 401
      ) {

        handleUnauthorized();

        return;
      }


      if (
        response.status === 403
      ) {

        setError(
          "Administrator access is required."
        );

        return;
      }


      if (!response.ok) {

        throw new Error(
          await getApiError(
            response,
            "Failed to load support tickets."
          )
        );
      }


      const data:
        TicketsResponse =
        await response.json();


      setTickets(
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


      setError(
        err?.message ||
        "Failed to load support tickets."
      );

    } finally {

      if (showLoading) {
        setLoading(false);
      }
    }
  };


  // ============================================
  // LOAD SINGLE TICKET
  // ============================================

  const loadTicket = async (
    id: string | number,
    showLoading = true
  ) => {

    try {

      if (showLoading) {
        setDetailLoading(true);
      }

      setError("");


      const token =
        getToken();


      if (!token) {

        handleUnauthorized();

        return;
      }


      const response =
        await fetch(
          `${API_URL}/api/admin/support/tickets/${id}`,
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


      if (
        response.status === 401
      ) {

        handleUnauthorized();

        return;
      }


      if (
        response.status === 403
      ) {

        setError(
          "Administrator access is required."
        );

        return;
      }


      if (!response.ok) {

        throw new Error(
          await getApiError(
            response,
            "Failed to load ticket."
          )
        );
      }


      const data:
        TicketDetailResponse =
        await response.json();


      if (!data?.ticket) {

        throw new Error(
          "Ticket details were not returned by server."
        );
      }


      setTicket(
        data.ticket
      );

    } catch (err: any) {

      console.error(
        "Ticket detail error:",
        err
      );


      setError(
        err?.message ||
        "Failed to load ticket."
      );

    } finally {

      if (showLoading) {
        setDetailLoading(false);
      }
    }
  };


  // ============================================
  // LOAD LIST
  // ============================================

  useEffect(() => {

    loadTickets(true);

  }, [filter]);


  // ============================================
  // LOAD DETAIL
  // ============================================

  useEffect(() => {

    if (ticketId) {

      setReply("");

      loadTicket(
        ticketId,
        true
      );

    } else {

      setTicket(null);
    }

  }, [ticketId]);


  // ============================================
  // AUTO REFRESH OPEN DETAIL
  // ============================================

  useEffect(() => {

    if (!ticketId) {
      return;
    }


    const interval =
      window.setInterval(
        () => {

          loadTicket(
            ticketId,
            false
          );

        },
        5000
      );


    return () => {

      window.clearInterval(
        interval
      );
    };

  }, [ticketId]);


  // ============================================
  // OPEN TICKET
  // ============================================

  const openTicket = (
    id: number
  ) => {

    setError("");
    setSuccess("");
    setReply("");

    navigate(
      `/admin/support/${id}`
    );
  };


  // ============================================
  // BACK
  // ============================================

  const backToTickets = () => {

    setTicket(null);
    setReply("");
    setError("");
    setSuccess("");

    navigate(
      "/admin/support"
    );
  };


  // ============================================
  // ADMIN REPLY
  // ============================================

  const handleReply =
    async () => {

      if (!ticket) {
        return;
      }


      const cleanReply =
        reply.trim();


      if (!cleanReply) {

        setError(
          "Please enter a reply."
        );

        return;
      }


      const currentStatus =
        ticket.status
          ?.toLowerCase();


      if (
        currentStatus ===
          "resolved" ||
        currentStatus ===
          "closed"
      ) {

        setError(
          "This ticket is already resolved or closed."
        );

        return;
      }


      try {

        setActionLoading(
          true
        );

        setError("");
        setSuccess("");


        const token =
          getToken();


        if (!token) {

          handleUnauthorized();

          return;
        }


        const response =
          await fetch(
            `${API_URL}/api/admin/support/tickets/${ticket.id}/reply`,
            {
              method: "POST",

              headers: {
                Authorization:
                  `Bearer ${token}`,

                "Content-Type":
                  "application/json",

                Accept:
                  "application/json",
              },

              body:
                JSON.stringify({
                  message:
                    cleanReply,
                }),
            }
          );


        if (
          response.status === 401
        ) {

          handleUnauthorized();

          return;
        }


        if (
          response.status === 403
        ) {

          setError(
            "Administrator access is required."
          );

          return;
        }


        if (!response.ok) {

          throw new Error(
            await getApiError(
              response,
              "Failed to send reply."
            )
          );
        }


        const data =
          await response.json();


        setReply("");


        setSuccess(
          data?.message ||
          "Reply sent successfully."
        );


        if (data?.ticket) {

          setTicket(
            data.ticket
          );

        } else {

          await loadTicket(
            ticket.id,
            false
          );
        }


        await loadTickets(
          false
        );

      } catch (err: any) {

        console.error(
          "Admin reply error:",
          err
        );


        setError(
          err?.message ||
          "Failed to send reply."
        );

      } finally {

        setActionLoading(
          false
        );
      }
    };


  // ============================================
  // STATUS UPDATE
  // ============================================

  const updateStatus =
    async (
      status: string
    ) => {

      if (!ticket) {
        return;
      }


      if (
        ticket.status ===
        status
      ) {
        return;
      }


      try {

        setActionLoading(
          true
        );

        setError("");
        setSuccess("");


        const token =
          getToken();


        if (!token) {

          handleUnauthorized();

          return;
        }


        const response =
          await fetch(
            `${API_URL}/api/admin/support/tickets/${ticket.id}/status`,
            {
              method: "PUT",

              headers: {
                Authorization:
                  `Bearer ${token}`,

                "Content-Type":
                  "application/json",

                Accept:
                  "application/json",
              },

              body:
                JSON.stringify({
                  status,
                }),
            }
          );


        if (
          response.status === 401
        ) {

          handleUnauthorized();

          return;
        }


        if (
          response.status === 403
        ) {

          setError(
            "Administrator access is required."
          );

          return;
        }


        if (!response.ok) {

          throw new Error(
            await getApiError(
              response,
              "Failed to update ticket status."
            )
          );
        }


        const data =
          await response.json();


        setSuccess(
          data?.message ||
          "Ticket status updated successfully."
        );


        if (data?.ticket) {

          setTicket(
            data.ticket
          );

        } else {

          await loadTicket(
            ticket.id,
            false
          );
        }


        await loadTickets(
          false
        );

      } catch (err: any) {

        console.error(
          "Status update error:",
          err
        );


        setError(
          err?.message ||
          "Failed to update ticket status."
        );

      } finally {

        setActionLoading(
          false
        );
      }
    };


  // ============================================
  // COPY REFERRAL
  // ============================================

  const getReferralId = (
    user:
      | TicketUser
      | SupportTicket
  ) => {

    return (
      user.referral_id ||
      user.referral_code ||
      "-"
    );
  };


  const copyReferral =
    async (
      code: string
    ) => {

      if (
        !code ||
        code === "-"
      ) {
        return;
      }


      try {

        await navigator.clipboard
          .writeText(
            code
          );


        setSuccess(
          "Referral ID copied."
        );


        window.setTimeout(
          () => {

            setSuccess("");

          },
          2000
        );

      } catch {

        setError(
          "Unable to copy referral ID."
        );
      }
    };


  // ============================================
  // LOGOUT
  // ============================================

  const handleLogout = () => {

    clearSession();

    navigate(
      "/signin",
      {
        replace: true,
      }
    );
  };


  // ============================================
  // STATS
  // ============================================

  const totalTickets =
    tickets.length;


  const openTickets =
    tickets.filter(
      (item) =>
        item.status
          ?.toLowerCase() ===
        "open"
    ).length;


  const inProgressTickets =
    tickets.filter(
      (item) =>
        item.status
          ?.toLowerCase() ===
        "in_progress"
    ).length;


  const waitingTickets =
    tickets.filter(
      (item) =>
        item.status
          ?.toLowerCase() ===
        "waiting_for_user"
    ).length;


  const resolvedTickets =
    tickets.filter(
      (item) => {

        const status =
          item.status
            ?.toLowerCase();

        return (
          status ===
            "resolved" ||
          status ===
            "closed"
        );
      }
    ).length;


  // ============================================
  // STATUS BADGE
  // ============================================

  const statusBadge = (
    rawStatus: string
  ) => {

    const status =
      rawStatus
        ?.toLowerCase();


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
        <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/50">

          <XCircle className="h-3 w-3" />

          Closed

        </span>
      );
    }


    if (
      status ===
      "in_progress"
    ) {

      return (
        <span className="inline-flex items-center gap-1 rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1 text-xs text-blue-300">

          <Loader2 className="h-3 w-3" />

          In Progress

        </span>
      );
    }


    if (
      status ===
      "waiting_for_user"
    ) {

      return (
        <span className="inline-flex items-center gap-1 rounded-full border border-yellow-400/20 bg-yellow-500/10 px-3 py-1 text-xs text-yellow-300">

          <Clock className="h-3 w-3" />

          Waiting for User

        </span>
      );
    }


    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-purple-400/20 bg-purple-500/10 px-3 py-1 text-xs text-purple-300">

        <AlertCircle className="h-3 w-3" />

        Open

      </span>
    );
  };


  // ============================================
  // PRIORITY BADGE
  // ============================================

  const priorityBadge = (
    rawPriority: string
  ) => {

    const priority =
      rawPriority
        ?.toLowerCase();


    if (
      priority ===
      "urgent"
    ) {

      return (
        <span className="rounded-full bg-red-500/10 px-2.5 py-1 text-[10px] uppercase tracking-wide text-red-300">
          Urgent
        </span>
      );
    }


    if (
      priority ===
      "high"
    ) {

      return (
        <span className="rounded-full bg-orange-500/10 px-2.5 py-1 text-[10px] uppercase tracking-wide text-orange-300">
          High
        </span>
      );
    }


    if (
      priority ===
      "low"
    ) {

      return (
        <span className="rounded-full bg-white/5 px-2.5 py-1 text-[10px] uppercase tracking-wide text-white/40">
          Low
        </span>
      );
    }


    return (
      <span className="rounded-full bg-blue-500/10 px-2.5 py-1 text-[10px] uppercase tracking-wide text-blue-300">
        Normal
      </span>
    );
  };


  // ============================================
  // DATE
  // ============================================

  const formatDate = (
    date?: string | null
  ) => {

    if (!date) {
      return "-";
    }


    const parsed =
      new Date(date);


    if (
      Number.isNaN(
        parsed.getTime()
      )
    ) {
      return date;
    }


    return parsed.toLocaleString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };


  // ============================================
  // SIDEBAR
  // ============================================

  const SidebarContent = () => (

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
            type="button"
            onClick={() =>
              setSidebarOpen(false)
            }
            className="cursor-pointer lg:hidden"
          >

            <X className="h-5 w-5 text-white/60" />

          </button>

        </div>


        {/* NAV */}

        <nav className="flex-1 space-y-2 p-4">

          <button
            type="button"
            onClick={() =>
              navigate(
                "/admin"
              )
            }
            className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-4 py-3 text-sm text-white/60 transition hover:bg-white/5 hover:text-white"
          >

            <LayoutDashboard className="h-4 w-4" />

            Dashboard

          </button>


          <button
            type="button"
            onClick={() =>
              navigate(
                "/admin/withdrawals"
              )
            }
            className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-4 py-3 text-sm text-white/60 transition hover:bg-white/5 hover:text-white"
          >

            <ArrowDownToLine className="h-4 w-4" />

            Withdrawals

          </button>


          <button
            type="button"
            className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-4 py-3 text-sm text-white/60 transition hover:bg-white/5 hover:text-white"
          >

            <Users className="h-4 w-4" />

            Users

          </button>


          <button
            type="button"
            className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-4 py-3 text-sm text-white/60 transition hover:bg-white/5 hover:text-white"
          >

            <CreditCard className="h-4 w-4" />

            Subscriptions

          </button>


          <button
            type="button"
            className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-4 py-3 text-sm text-white/60 transition hover:bg-white/5 hover:text-white"
          >

            <Wallet className="h-4 w-4" />

            Transactions

          </button>


          <button
            type="button"
            onClick={() => {

              navigate(
                "/admin/support"
              );

              setSidebarOpen(
                false
              );
            }}
            className="flex w-full cursor-pointer items-center gap-3 rounded-xl bg-purple-500/15 px-4 py-3 text-sm text-purple-200"
          >

            <Headphones className="h-4 w-4" />

            Support Tickets

          </button>

        </nav>


        {/* LOGOUT */}

        <div className="border-t border-white/10 p-4">

          <button
            type="button"
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
  );


  // ============================================
  // DETAIL VIEW
  // ============================================

  if (ticketId) {

    return (

      <div className="min-h-screen bg-black text-white">

        {/* BACKGROUND */}

        <div className="fixed inset-0 -z-10 bg-gradient-to-br from-purple-950 via-black to-black" />

        <div className="fixed left-1/4 top-0 -z-10 h-96 w-96 rounded-full bg-purple-600/10 blur-[120px]" />

        <div className="fixed bottom-0 right-1/4 -z-10 h-96 w-96 rounded-full bg-purple-500/10 blur-[120px]" />


        {/* MOBILE HEADER */}

        <div className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-white/10 bg-black/80 px-4 backdrop-blur-xl lg:hidden">

          <button
            type="button"
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

          <SidebarContent />


          {sidebarOpen && (

            <div
              onClick={() =>
                setSidebarOpen(false)
              }
              className="fixed inset-0 z-40 bg-black/60 lg:hidden"
            />

          )}


          <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">

            {/* HEADER */}

            <div className="mb-8 flex items-center justify-between">

              <div>

                <button
                  type="button"
                  onClick={
                    backToTickets
                  }
                  className="mb-4 inline-flex cursor-pointer items-center gap-2 text-sm text-white/50 transition hover:text-white"
                >

                  <ArrowLeft className="h-4 w-4" />

                  Back to Support Tickets

                </button>


                <h1 className="text-2xl font-semibold">
                  Ticket Details
                </h1>


                <p className="mt-1 text-sm text-white/40">
                  Review and manage user support request
                </p>

              </div>


              <div className="hidden items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-2 sm:flex">

                <ShieldCheck className="h-4 w-4 text-purple-300" />

                <span className="text-sm text-white/70">
                  Administrator
                </span>

              </div>

            </div>


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


            {detailLoading ||
            !ticket ? (

              <div className="flex min-h-80 items-center justify-center text-white/40">

                <div className="flex items-center gap-2">

                  <RefreshCw className="h-4 w-4 animate-spin" />

                  Loading ticket...

                </div>

              </div>

            ) : (

              <div className="grid grid-cols-1 gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">

                {/* USER CARD */}

                <div className="h-fit rounded-2xl border border-white/10 bg-white/[0.03] p-5">

                  <div className="mb-5 flex items-center gap-3">

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/10 text-purple-300">

                      <User className="h-5 w-5" />

                    </div>


                    <div>

                      <h2 className="font-semibold">
                        {
                          ticket.user.full_name
                        }
                      </h2>

                      <p className="text-xs text-white/40">
                        User #
                        {
                          ticket.user.id
                        }
                      </p>

                    </div>

                  </div>


                  <div className="space-y-4">

                    {/* EMAIL */}

                    <div>

                      <p className="mb-1 text-[10px] uppercase tracking-wider text-white/30">
                        Email
                      </p>

                      <div className="flex items-center gap-2 text-sm text-white/70">

                        <Mail className="h-3.5 w-3.5 shrink-0 text-white/30" />

                        <span className="break-all">
                          {
                            ticket.user.email
                          }
                        </span>

                      </div>

                    </div>


                    {/* PHONE */}

                    <div>

                      <p className="mb-1 text-[10px] uppercase tracking-wider text-white/30">
                        Phone
                      </p>

                      <div className="flex items-center gap-2 text-sm text-white/70">

                        <Phone className="h-3.5 w-3.5 shrink-0 text-white/30" />

                        {
                          ticket.user.phone_number ||
                          "Not available"
                        }

                      </div>

                    </div>


                    {/* CUSTOMER ID */}

                    {ticket.user.customer_id && (

                      <div>

                        <p className="mb-1 text-[10px] uppercase tracking-wider text-white/30">
                          Customer ID
                        </p>

                        <span className="text-sm text-white/70">
                          {
                            ticket.user.customer_id
                          }
                        </span>

                      </div>

                    )}


                    {/* REFERRAL */}

                    <div>

                      <p className="mb-1 text-[10px] uppercase tracking-wider text-white/30">
                        Referral ID
                      </p>


                      <div className="flex items-center justify-between rounded-lg border border-purple-400/10 bg-purple-500/5 px-3 py-2">

                        <span className="text-sm font-medium text-purple-200">
                          {getReferralId(
                            ticket.user
                          )}
                        </span>


                        <button
                          type="button"
                          onClick={() =>
                            copyReferral(
                              getReferralId(
                                ticket.user
                              )
                            )
                          }
                          disabled={
                            getReferralId(
                              ticket.user
                            ) === "-"
                          }
                          className="cursor-pointer rounded-md p-1.5 text-white/40 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                        >

                          <Copy className="h-3.5 w-3.5" />

                        </button>

                      </div>

                    </div>


                    {/* STATUS */}

                    <div className="border-t border-white/10 pt-4">

                      <p className="mb-2 text-[10px] uppercase tracking-wider text-white/30">
                        Ticket Status
                      </p>

                      {statusBadge(
                        ticket.status
                      )}

                    </div>


                    {/* PRIORITY */}

                    <div>

                      <p className="mb-2 text-[10px] uppercase tracking-wider text-white/30">
                        Priority
                      </p>

                      {priorityBadge(
                        ticket.priority
                      )}

                    </div>


                    {/* CATEGORY */}

                    <div>

                      <p className="mb-2 text-[10px] uppercase tracking-wider text-white/30">
                        Category
                      </p>

                      <span className="text-sm text-white/70">
                        {
                          ticket.category
                        }
                      </span>

                    </div>


                    {/* CREATED */}

                    <div>

                      <p className="mb-2 text-[10px] uppercase tracking-wider text-white/30">
                        Created
                      </p>

                      <span className="text-xs text-white/40">
                        {formatDate(
                          ticket.created_at
                        )}
                      </span>

                    </div>


                    {/* UPDATED */}

                    <div>

                      <p className="mb-2 text-[10px] uppercase tracking-wider text-white/30">
                        Last Updated
                      </p>

                      <span className="text-xs text-white/40">
                        {formatDate(
                          ticket.updated_at
                        )}
                      </span>

                    </div>

                  </div>

                </div>


                {/* CONVERSATION */}

                <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">

                  {/* HEADER */}

                  <div className="border-b border-white/10 p-5">

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                      <div>

                        <div className="mb-2 flex flex-wrap items-center gap-2">

                          <span className="rounded-lg bg-purple-500/10 px-2.5 py-1 text-xs font-medium text-purple-300">
                            {
                              ticket.ticket_number
                            }
                          </span>


                          {statusBadge(
                            ticket.status
                          )}

                        </div>


                        <h2 className="text-lg font-semibold">
                          {
                            ticket.subject
                          }
                        </h2>


                        <p className="mt-1 text-xs text-white/40">
                          {
                            ticket.category
                          }
                        </p>

                      </div>


                      {/* STATUS UPDATE */}

                      <select
                        value={
                          ticket.status
                        }
                        disabled={
                          actionLoading
                        }
                        onChange={(e) =>
                          updateStatus(
                            e.target.value
                          )
                        }
                        className="cursor-pointer rounded-lg border border-white/10 bg-black px-3 py-2 text-xs text-white outline-none disabled:cursor-not-allowed disabled:opacity-50"
                      >

                        <option value="open">
                          Open
                        </option>

                        <option value="in_progress">
                          In Progress
                        </option>

                        <option value="waiting_for_user">
                          Waiting for User
                        </option>

                        <option value="resolved">
                          Resolved
                        </option>

                        <option value="closed">
                          Closed
                        </option>

                      </select>

                    </div>

                  </div>


                  {/* DESCRIPTION */}

                  <div className="border-b border-white/10 p-5">

                    <div className="mb-2 flex items-center gap-2 text-xs font-medium text-white/50">

                      <MessageSquare className="h-3.5 w-3.5" />

                      Original Query

                    </div>


                    <div className="whitespace-pre-wrap rounded-xl border border-white/5 bg-black/20 p-4 text-sm leading-6 text-white/70">
                      {
                        ticket.description
                      }
                    </div>

                  </div>


                  {/* MESSAGES */}

                  <div className="max-h-[500px] space-y-4 overflow-y-auto p-5">

                    {!ticket.messages ||
                    ticket.messages.length ===
                      0 ? (

                      <div className="py-10 text-center text-sm text-white/30">
                        No conversation messages.
                      </div>

                    ) : (

                      ticket.messages.map(
                        (message) => {

                          const sender =
                            message.sender_type
                              ?.toLowerCase();


                          const isAdmin =
                            sender ===
                            "admin";


                          const isSystem =
                            sender ===
                            "system";


                          if (isSystem) {

                            return (

                              <div
                                key={
                                  message.id
                                }
                                className="flex justify-center"
                              >

                                <div className="max-w-[90%] rounded-xl border border-purple-400/10 bg-purple-500/5 px-4 py-3 text-center">

                                  <div className="mb-2 flex items-center justify-center gap-2">

                                    <ShieldCheck className="h-3.5 w-3.5 text-purple-300" />

                                    <span className="text-[10px] uppercase tracking-wider text-white/40">
                                      System
                                    </span>

                                  </div>


                                  <p className="whitespace-pre-wrap text-sm leading-6 text-white/70">
                                    {
                                      message.message
                                    }
                                  </p>


                                  <p className="mt-2 text-[10px] text-white/25">
                                    {formatDate(
                                      message.created_at
                                    )}
                                  </p>

                                </div>

                              </div>
                            );
                          }


                          return (

                            <div
                              key={
                                message.id
                              }
                              className={`flex ${
                                isAdmin
                                  ? "justify-end"
                                  : "justify-start"
                              }`}
                            >

                              <div
                                className={`max-w-[85%] rounded-2xl border p-4 ${
                                  isAdmin
                                    ? "rounded-tr-md border-purple-400/10 bg-purple-500/10"
                                    : "rounded-tl-md border-white/10 bg-white/5"
                                }`}
                              >

                                <div className="mb-2 flex items-center gap-2">

                                  {isAdmin ? (

                                    <ShieldCheck className="h-3.5 w-3.5 text-purple-300" />

                                  ) : (

                                    <User className="h-3.5 w-3.5 text-white/40" />

                                  )}


                                  <span className="text-[10px] uppercase tracking-wider text-white/40">

                                    {isAdmin
                                      ? "AdsPromoHub Support"
                                      : "User"}

                                  </span>

                                </div>


                                <p className="whitespace-pre-wrap text-sm leading-6 text-white/75">
                                  {
                                    message.message
                                  }
                                </p>


                                <p className="mt-2 text-[10px] text-white/25">
                                  {formatDate(
                                    message.created_at
                                  )}
                                </p>

                              </div>

                            </div>
                          );
                        }
                      )

                    )}

                  </div>


                  {/* REPLY */}

                  {ticket.status
                    ?.toLowerCase() !==
                    "closed" &&
                  ticket.status
                    ?.toLowerCase() !==
                    "resolved" ? (

                    <div className="border-t border-white/10 p-5">

                      <div className="mb-2 flex items-center gap-2 text-xs font-medium text-white/50">

                        <Send className="h-3.5 w-3.5" />

                        Reply to User

                      </div>


                      <textarea
                        value={reply}
                        onChange={(e) =>
                          setReply(
                            e.target.value
                          )
                        }
                        placeholder="Type your reply..."
                        rows={4}
                        maxLength={10000}
                        disabled={
                          actionLoading
                        }
                        className="w-full resize-none rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-white/20 focus:border-purple-400/30 disabled:opacity-50"
                      />


                      <div className="mt-3 flex justify-end">

                        <button
                          type="button"
                          onClick={
                            handleReply
                          }
                          disabled={
                            actionLoading ||
                            !reply.trim()
                          }
                          className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-50"
                        >

                          {actionLoading ? (

                            <RefreshCw className="h-4 w-4 animate-spin" />

                          ) : (

                            <Send className="h-4 w-4" />

                          )}

                          {actionLoading
                            ? "Sending..."
                            : "Send Reply"}

                        </button>

                      </div>

                    </div>

                  ) : (

                    <div className="border-t border-white/10 p-5">

                      <div className="rounded-xl border border-green-400/10 bg-green-500/5 p-4 text-center">

                        <CheckCircle className="mx-auto h-5 w-5 text-green-300" />

                        <p className="mt-2 text-sm font-medium text-green-300">
                          This ticket is {
                            ticket.status
                          }.
                        </p>

                      </div>

                    </div>

                  )}

                </div>

              </div>

            )}

          </main>

        </div>

      </div>
    );
  }


  // ============================================
  // LIST VIEW
  // ============================================

  return (

    <div className="min-h-screen bg-black text-white">

      {/* BACKGROUND */}

      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-purple-950 via-black to-black" />

      <div className="fixed left-1/4 top-0 -z-10 h-96 w-96 rounded-full bg-purple-600/10 blur-[120px]" />

      <div className="fixed bottom-0 right-1/4 -z-10 h-96 w-96 rounded-full bg-purple-500/10 blur-[120px]" />


      {/* MOBILE HEADER */}

      <div className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-white/10 bg-black/80 px-4 backdrop-blur-xl lg:hidden">

        <button
          type="button"
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

        <SidebarContent />


        {sidebarOpen && (

          <div
            onClick={() =>
              setSidebarOpen(false)
            }
            className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          />

        )}


        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">

          {/* HEADER */}

          <div className="mb-8 hidden items-center justify-between lg:flex">

            <div>

              <h1 className="text-2xl font-semibold">
                Support Tickets
              </h1>

              <p className="mt-1 text-sm text-white/40">
                Manage user support requests
              </p>

            </div>


            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-2">

              <ShieldCheck className="h-4 w-4 text-purple-300" />

              <span className="text-sm text-white/70">
                Administrator
              </span>

            </div>

          </div>


          {/* MOBILE TITLE */}

          <div className="mb-6 lg:hidden">

            <h1 className="text-xl font-semibold">
              Support Tickets
            </h1>

            <p className="mt-1 text-xs text-white/40">
              Manage user support requests
            </p>

          </div>


          {/* ALERTS */}

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


          {/* STATS */}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">

            <AdminStatCard
              title="Total Tickets"
              value={
                totalTickets
              }
              icon={
                <Headphones />
              }
            />


            <AdminStatCard
              title="Open"
              value={
                openTickets
              }
              icon={
                <AlertCircle />
              }
            />


            <AdminStatCard
              title="In Progress"
              value={
                inProgressTickets
              }
              icon={
                <Clock />
              }
            />


            <AdminStatCard
              title="Waiting"
              value={
                waitingTickets
              }
              icon={
                <MessageSquare />
              }
            />


            <AdminStatCard
              title="Resolved"
              value={
                resolvedTickets
              }
              icon={
                <CheckCircle />
              }
            />

          </div>


          {/* TICKETS */}

          <div className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">

            {/* TABLE HEADER */}

            <div className="flex flex-col gap-4 border-b border-white/10 p-5 sm:flex-row sm:items-center sm:justify-between">

              <div>

                <h2 className="font-semibold">
                  Received Tickets
                </h2>

                <p className="mt-1 text-xs text-white/40">
                  User queries received by support
                </p>

              </div>


              <div className="flex items-center gap-2">

                <select
                  value={
                    filter
                  }
                  onChange={(e) =>
                    setFilter(
                      e.target.value
                    )
                  }
                  className="cursor-pointer rounded-lg border border-white/10 bg-black px-3 py-2 text-xs text-white outline-none"
                >

                  <option value="all">
                    All Tickets
                  </option>

                  <option value="open">
                    Open
                  </option>

                  <option value="in_progress">
                    In Progress
                  </option>

                  <option value="waiting_for_user">
                    Waiting for User
                  </option>

                  <option value="resolved">
                    Resolved
                  </option>

                  <option value="closed">
                    Closed
                  </option>

                </select>


                <button
                  type="button"
                  onClick={() =>
                    loadTickets(true)
                  }
                  disabled={
                    loading
                  }
                  className="cursor-pointer rounded-lg border border-white/10 bg-white/5 p-2 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
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

                <div className="flex min-h-60 items-center justify-center text-sm text-white/40">

                  <div className="flex items-center gap-2">

                    <RefreshCw className="h-4 w-4 animate-spin" />

                    Loading support tickets...

                  </div>

                </div>

              ) : tickets.length ===
                0 ? (

                <div className="flex min-h-60 flex-col items-center justify-center text-center">

                  <Headphones className="mb-3 h-8 w-8 text-white/20" />

                  <p className="text-sm text-white/40">
                    No support tickets found
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
                        Updated
                      </th>

                      <th className="px-5 py-4">
                        Action
                      </th>

                    </tr>

                  </thead>


                  <tbody>

                    {tickets.map(
                      (item) => (

                        <tr
                          key={
                            item.id
                          }
                          className="border-b border-white/5 transition hover:bg-white/[0.03]"
                        >

                          {/* TICKET */}

                          <td className="px-5 py-4">

                            <p className="text-sm font-medium text-purple-200">
                              {
                                item.ticket_number
                              }
                            </p>

                            <p className="mt-1 text-[10px] text-white/25">
                              #{item.id}
                            </p>

                          </td>


                          {/* USER */}

                          <td className="px-5 py-4">

                            <p className="text-sm text-white/80">
                              {
                                item.full_name
                              }
                            </p>

                            <p className="mt-1 text-xs text-white/30">
                              User #
                              {
                                item.user_id
                              }
                            </p>

                          </td>


                          {/* REFERRAL */}

                          <td className="px-5 py-4">

                            <span className="rounded-lg bg-purple-500/10 px-2.5 py-1 text-xs text-purple-300">
                              {getReferralId(
                                item
                              )}
                            </span>

                          </td>


                          {/* CATEGORY */}

                          <td className="px-5 py-4">

                            <span className="text-xs text-white/60">
                              {
                                item.category
                              }
                            </span>

                          </td>


                          {/* SUBJECT */}

                          <td className="max-w-[240px] px-5 py-4">

                            <p className="truncate text-sm text-white/70">
                              {
                                item.subject
                              }
                            </p>

                          </td>


                          {/* PRIORITY */}

                          <td className="px-5 py-4">

                            {priorityBadge(
                              item.priority
                            )}

                          </td>


                          {/* STATUS */}

                          <td className="px-5 py-4">

                            {statusBadge(
                              item.status
                            )}

                          </td>


                          {/* UPDATED */}

                          <td className="px-5 py-4">

                            <span className="text-xs text-white/30">
                              {formatDate(
                                item.updated_at ||
                                item.created_at
                              )}
                            </span>

                          </td>


                          {/* ACTION */}

                          <td className="px-5 py-4">

                            <button
                              type="button"
                              onClick={() =>
                                openTicket(
                                  item.id
                                )
                              }
                              className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-purple-500/10 px-3 py-2 text-xs text-purple-300 transition hover:bg-purple-500/20"
                            >

                              <Eye className="h-3.5 w-3.5" />

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

        </main>

      </div>

    </div>
  );
}


// ============================================
// ADMIN STAT CARD
// ============================================

function AdminStatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
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