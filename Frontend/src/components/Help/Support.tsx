import React, { useEffect, useState } from "react";

import {
  ArrowLeft,
  Ticket,
  MessageCircle,
  Send,
  Plus,
  Clock3,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ChevronRight,
  HelpCircle,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import UserNavbar from "../UserDashboard/UserNavbar";

// =====================================================
// API
// =====================================================

const RAW_API_URL =
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:8000";

const API_URL = RAW_API_URL.replace(/\/+$/, "");

// =====================================================
// TYPES
// =====================================================

interface TicketMessage {
  id: number;
  sender_type: string;
  sender_id?: number | null;
  message: string;
  created_at: string;
}

interface SupportTicket {
  id: number;
  ticket_number: string;
  category: string;
  subject: string;
  description: string;
  priority: string;
  status: string;
  created_at: string;
  updated_at: string;
  resolved_at?: string | null;
  messages?: TicketMessage[];
}

interface TicketsResponse {
  success?: boolean;
  count?: number;
  tickets: SupportTicket[];
}

interface TicketResponse {
  success?: boolean;
  message?: string;
  ticket: SupportTicket;
}

// =====================================================
// OPTIONS
// =====================================================

const categories = [
  "Account / ID Activation",
  "Subscription Purchase",
  "Withdrawal Problem",
  "Earning / Compounding",
  "Referral / Direct Income",
  "Rank / Rank Achiever",
  "Wallet / Payment",
  "Technical Problem",
  "Other",
];

const priorities = [
  "low",
  "normal",
  "high",
  "urgent",
];

// =====================================================
// COMPONENT
// =====================================================

const Support: React.FC = () => {
  const navigate = useNavigate();

  // =====================================================
  // DARK MODE
  // =====================================================

  const [isDark] = useState(false);

  // =====================================================
  // TICKETS
  // =====================================================

  const [tickets, setTickets] =
    useState<SupportTicket[]>([]);

  const [
    selectedTicket,
    setSelectedTicket,
  ] = useState<SupportTicket | null>(
    null
  );

  // =====================================================
  // FORM
  // =====================================================

  const [category, setCategory] =
    useState(categories[0]);

  const [priority, setPriority] =
    useState("normal");

  const [subject, setSubject] =
    useState("");

  const [
    description,
    setDescription,
  ] = useState("");

  const [reply, setReply] =
    useState("");

  // =====================================================
  // STATES
  // =====================================================

  const [loading, setLoading] =
    useState(true);

  const [
    loadingDetail,
    setLoadingDetail,
  ] = useState(false);

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  const [replying, setReplying] =
    useState(false);

  const [
    refreshing,
    setRefreshing,
  ] = useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  // =====================================================
  // TOKEN
  // =====================================================

  const getToken = (): string => {
    try {
      const directToken =
        localStorage.getItem(
          "access_token"
        );

      if (directToken) {
        return directToken;
      }

      const storedUser =
        localStorage.getItem("user");

      if (!storedUser) {
        return "";
      }

      const user =
        JSON.parse(storedUser);

      return (
        user?.access_token ||
        user?.accessToken ||
        ""
      );
    } catch (error) {
      console.error(
        "Unable to read token:",
        error
      );

      return "";
    }
  };

  // =====================================================
  // UNAUTHORIZED
  // =====================================================

  const handleUnauthorized = () => {
    localStorage.removeItem(
      "access_token"
    );

    localStorage.removeItem(
      "user"
    );

    setError(
      "Your login session has expired. Please login again."
    );

    setTimeout(() => {
      navigate("/signin", {
        replace: true,
      });
    }, 500);
  };

  // =====================================================
  // API ERROR
  // =====================================================

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
      // Ignore invalid JSON.
    }

    return fallback;
  };

  // =====================================================
  // DATE
  // =====================================================

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

  // =====================================================
  // STATUS
  // =====================================================

  const getStatusLabel = (
    status: string
  ) => {
    switch (
      status?.toLowerCase()
    ) {
      case "open":
        return "Open";

      case "in_progress":
        return "In Progress";

      case "waiting_for_user":
        return "Waiting for You";

      case "resolved":
        return "Resolved";

      case "closed":
        return "Closed";

      default:
        return (
          status || "Unknown"
        );
    }
  };

  const getStatusClass = (
    status: string
  ) => {
    switch (
      status?.toLowerCase()
    ) {
      case "open":
        return isDark
          ? "bg-blue-500/10 text-blue-400"
          : "bg-blue-50 text-blue-600";

      case "in_progress":
        return isDark
          ? "bg-[#B76E79]/10 text-[#D99AA3]"
          : "bg-[#FFE5E8] text-[#8F4F5A]";

      case "waiting_for_user":
        return isDark
          ? "bg-yellow-500/10 text-yellow-400"
          : "bg-yellow-50 text-yellow-700";

      case "resolved":
        return isDark
          ? "bg-green-500/10 text-green-400"
          : "bg-green-50 text-green-600";

      case "closed":
        return isDark
          ? "bg-gray-800 text-gray-400"
          : "bg-gray-100 text-gray-500";

      default:
        return isDark
          ? "bg-gray-800 text-gray-400"
          : "bg-gray-100 text-gray-500";
    }
  };

  // =====================================================
  // PRIORITY
  // =====================================================

  const getPriorityClass = (
    priority: string
  ) => {
    switch (
      priority?.toLowerCase()
    ) {
      case "urgent":
        return isDark
          ? "bg-red-500/10 text-red-400"
          : "bg-red-50 text-red-600";

      case "high":
        return isDark
          ? "bg-orange-500/10 text-orange-400"
          : "bg-orange-50 text-orange-600";

      case "normal":
        return isDark
          ? "bg-blue-500/10 text-blue-400"
          : "bg-blue-50 text-blue-600";

      case "low":
        return isDark
          ? "bg-gray-800 text-gray-400"
          : "bg-gray-100 text-gray-500";

      default:
        return isDark
          ? "bg-gray-800 text-gray-400"
          : "bg-gray-100 text-gray-500";
    }
  };

  // =====================================================
  // LOAD TICKETS
  // =====================================================

  const loadTickets = async (
    showLoading = true
  ) => {
    try {
      const token = getToken();

      if (!token) {
        handleUnauthorized();
        return;
      }

      if (showLoading) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      setError("");

      const response =
        await fetch(
          `${API_URL}/api/support/tickets`,
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

      if (!response.ok) {
        throw new Error(
          await getApiError(
            response,
            "Unable to load support tickets."
          )
        );
      }

      const result:
        TicketsResponse =
        await response.json();

      setTickets(
        Array.isArray(
          result?.tickets
        )
          ? result.tickets
          : []
      );
    } catch (err: any) {
      console.error(
        "Support tickets error:",
        err
      );

      setError(
        err?.message ||
        "Unable to load support tickets."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // =====================================================
  // LOAD SINGLE TICKET
  // =====================================================

  const loadTicket = async (
    id: string | number,
    showLoading = true
  ) => {
    try {
      const token = getToken();

      if (!token) {
        handleUnauthorized();
        return;
      }

      if (showLoading) {
        setLoadingDetail(true);
      }

      setError("");

      const response =
        await fetch(
          `${API_URL}/api/support/tickets/${id}`,
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

      if (!response.ok) {
        throw new Error(
          await getApiError(
            response,
            "Unable to load ticket details."
          )
        );
      }

      const result:
        TicketResponse =
        await response.json();

      if (!result?.ticket) {
        throw new Error(
          "Ticket details were not returned by server."
        );
      }

      setSelectedTicket(
        result.ticket
      );
    } catch (err: any) {
      console.error(
        "Ticket detail error:",
        err
      );

      setError(
        err?.message ||
        "Unable to load ticket details."
      );
    } finally {
      if (showLoading) {
        setLoadingDetail(false);
      }
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    loadTickets(true);
  }, []);

  // =====================================================
  // AUTO REFRESH OPEN TICKET
  // =====================================================

  useEffect(() => {
    if (
      !selectedTicket?.id
    ) {
      return;
    }

    const ticketId =
      selectedTicket.id;

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

    return () =>
      window.clearInterval(
        interval
      );
  }, [selectedTicket?.id]);

  // =====================================================
  // CREATE TICKET
  // =====================================================

  const handleCreateTicket =
    async (
      e: React.FormEvent
    ) => {
      e.preventDefault();

      if (!subject.trim()) {
        setError(
          "Please enter a subject."
        );
        return;
      }

      if (!description.trim()) {
        setError(
          "Please describe your problem."
        );
        return;
      }

      try {
        const token = getToken();

        if (!token) {
          handleUnauthorized();
          return;
        }

        setSubmitting(true);
        setError("");
        setSuccess("");

        const response =
          await fetch(
            `${API_URL}/api/support/tickets`,
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

              body: JSON.stringify({
                category,
                subject:
                  subject.trim(),
                description:
                  description.trim(),
                priority,
              }),
            }
          );

        if (
          response.status === 401
        ) {
          handleUnauthorized();
          return;
        }

        if (!response.ok) {
          throw new Error(
            await getApiError(
              response,
              "Unable to create ticket."
            )
          );
        }

        const result:
          TicketResponse =
          await response.json();

        if (!result?.ticket) {
          throw new Error(
            "Ticket was created but server did not return ticket details."
          );
        }

        setSubject("");
        setDescription("");

        setCategory(
          categories[0]
        );

        setPriority(
          "normal"
        );

        setSuccess(
          result.message ||
          "Ticket created successfully."
        );

        await loadTickets(
          false
        );

        setSelectedTicket(
          result.ticket
        );
      } catch (err: any) {
        console.error(
          "Create ticket error:",
          err
        );

        setError(
          err?.message ||
          "Unable to create ticket."
        );
      } finally {
        setSubmitting(false);
      }
    };

  // =====================================================
  // SEND USER REPLY
  // =====================================================

  const handleReply =
    async () => {
      if (!selectedTicket) {
        return;
      }

      const cleanReply =
        reply.trim();

      if (!cleanReply) {
        return;
      }

      const ticketStatus =
        selectedTicket.status
          ?.toLowerCase();

      if (
        ticketStatus ===
          "resolved" ||
        ticketStatus ===
          "closed"
      ) {
        setError(
          "This ticket is already closed."
        );
        return;
      }

      try {
        const token = getToken();

        if (!token) {
          handleUnauthorized();
          return;
        }

        setReplying(true);
        setError("");
        setSuccess("");

        const response =
          await fetch(
            `${API_URL}/api/support/tickets/${selectedTicket.id}/reply`,
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

              body: JSON.stringify({
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

        if (!response.ok) {
          throw new Error(
            await getApiError(
              response,
              "Unable to send reply."
            )
          );
        }

        const result:
          TicketResponse =
          await response.json();

        setReply("");

        setSuccess(
          result.message ||
          "Reply sent successfully."
        );

        if (result?.ticket) {
          setSelectedTicket(
            result.ticket
          );
        } else {
          await loadTicket(
            selectedTicket.id,
            false
          );
        }

        await loadTickets(
          false
        );
      } catch (err: any) {
        console.error(
          "Reply error:",
          err
        );

        setError(
          err?.message ||
          "Unable to send reply."
        );
      } finally {
        setReplying(false);
      }
    };

  // =====================================================
  // SUMMARY
  // =====================================================

  const totalTickets =
    tickets.length;

  const openTickets =
    tickets.filter(
      (ticket) =>
        ticket.status
          ?.toLowerCase() ===
        "open"
    ).length;

  const progressTickets =
    tickets.filter(
      (ticket) => {
        const status =
          ticket.status
            ?.toLowerCase();

        return (
          status ===
            "in_progress" ||
          status ===
            "waiting_for_user"
        );
      }
    ).length;

  const resolvedTickets =
    tickets.filter(
      (ticket) => {
        const status =
          ticket.status
            ?.toLowerCase();

        return (
          status ===
            "resolved" ||
          status ===
            "closed"
        );
      }
    ).length;

  // =====================================================
  // UI
  // =====================================================

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
            {/* HEADER */}

            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1
                  className={`text-2xl font-bold ${
                    isDark
                      ? "text-white"
                      : "text-gray-900"
                  }`}
                >
                  Help & Support
                </h1>

                <p
                  className={`mt-1 text-sm ${
                    isDark
                      ? "text-gray-400"
                      : "text-gray-500"
                  }`}
                >
                  We're here to help you with
                  any problem.
                </p>
              </div>

              <button
                type="button"
                onClick={async () => {
                  await loadTickets(
                    false
                  );

                  if (
                    selectedTicket?.id
                  ) {
                    await loadTicket(
                      selectedTicket.id,
                      false
                    );
                  }
                }}
                disabled={refreshing}
                className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${
                  isDark
                    ? "border-gray-800 bg-gray-900 text-gray-300 hover:bg-gray-800"
                    : "border-gray-200 bg-white text-gray-600 hover:bg-gray-100"
                }`}
              >
                <RefreshCw
                  size={16}
                  className={
                    refreshing
                      ? "animate-spin"
                      : ""
                  }
                />

                Refresh
              </button>
            </div>

            {/* BACK */}

            {selectedTicket && (
              <button
                type="button"
                onClick={() => {
                  setSelectedTicket(
                    null
                  );

                  setReply("");
                  setError("");
                  setSuccess("");
                }}
                className={`mb-6 flex items-center gap-2 text-sm font-semibold transition ${
                  isDark
                    ? "text-gray-300 hover:text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <ArrowLeft
                  size={18}
                />

                Back to Support
              </button>
            )}

            {/* ERROR */}

            {error && (
              <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                <AlertCircle
                  size={18}
                  className="mt-0.5 shrink-0"
                />

                <span>
                  {error}
                </span>
              </div>
            )}

            {/* SUCCESS */}

            {success && (
              <div className="mb-6 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-600">
                <CheckCircle2
                  size={18}
                  className="mt-0.5 shrink-0"
                />

                <span>
                  {success}
                </span>
              </div>
            )}

            {/* ================================================= */}
            {/* TICKET DETAIL */}
            {/* ================================================= */}

            {selectedTicket ? (
              <div className="mx-auto max-w-5xl">
                {loadingDetail ? (
                  <div
                    className={`rounded-2xl border p-10 text-center shadow-sm ${
                      isDark
                        ? "border-gray-800 bg-gray-900"
                        : "border-gray-200 bg-white"
                    }`}
                  >
                    <RefreshCw
                      size={28}
                      className="mx-auto animate-spin text-[#B76E79]"
                    />

                    <p
                      className={`mt-3 text-sm ${
                        isDark
                          ? "text-gray-400"
                          : "text-gray-500"
                      }`}
                    >
                      Loading ticket...
                    </p>
                  </div>
                ) : (
                  <div
                    className={`overflow-hidden rounded-2xl border shadow-sm ${
                      isDark
                        ? "border-gray-800 bg-gray-900"
                        : "border-gray-200 bg-white"
                    }`}
                  >
                    {/* TICKET HEADER */}

                    <div
                      className={`border-b p-5 sm:p-6 ${
                        isDark
                          ? "border-gray-800"
                          : "border-gray-200"
                      }`}
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex items-start gap-3">
                          <div
                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                              isDark
                                ? "bg-[#B76E79]/20 text-[#D99AA3]"
                                : "bg-[#FFE5E8] text-[#B76E79]"
                            }`}
                          >
                            <Ticket
                              size={21}
                            />
                          </div>

                          <div>
                            <p
                              className={`text-xs font-bold ${
                                isDark
                                  ? "text-[#D99AA3]"
                                  : "text-[#B76E79]"
                              }`}
                            >
                              {
                                selectedTicket.ticket_number
                              }
                            </p>

                            <h2
                              className={`mt-1 text-xl font-bold ${
                                isDark
                                  ? "text-white"
                                  : "text-gray-900"
                              }`}
                            >
                              {
                                selectedTicket.subject
                              }
                            </h2>

                            <p
                              className={`mt-1 text-xs ${
                                isDark
                                  ? "text-gray-500"
                                  : "text-gray-400"
                              }`}
                            >
                              Created{" "}
                              {formatDate(
                                selectedTicket.created_at
                              )}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                              selectedTicket.status
                            )}`}
                          >
                            {getStatusLabel(
                              selectedTicket.status
                            )}
                          </span>

                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${getPriorityClass(
                              selectedTicket.priority
                            )}`}
                          >
                            {
                              selectedTicket.priority
                            }
                          </span>
                        </div>
                      </div>

                      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div
                          className={`rounded-xl border p-3 ${
                            isDark
                              ? "border-gray-800 bg-gray-800/30"
                              : "border-gray-200 bg-gray-50"
                          }`}
                        >
                          <p
                            className={`text-[11px] ${
                              isDark
                                ? "text-gray-500"
                                : "text-gray-400"
                            }`}
                          >
                            Category
                          </p>

                          <p
                            className={`mt-1 text-sm font-semibold ${
                              isDark
                                ? "text-gray-200"
                                : "text-gray-700"
                            }`}
                          >
                            {
                              selectedTicket.category
                            }
                          </p>
                        </div>

                        <div
                          className={`rounded-xl border p-3 ${
                            isDark
                              ? "border-gray-800 bg-gray-800/30"
                              : "border-gray-200 bg-gray-50"
                          }`}
                        >
                          <p
                            className={`text-[11px] ${
                              isDark
                                ? "text-gray-500"
                                : "text-gray-400"
                            }`}
                          >
                            Last Updated
                          </p>

                          <p
                            className={`mt-1 text-sm font-semibold ${
                              isDark
                                ? "text-gray-200"
                                : "text-gray-700"
                            }`}
                          >
                            {formatDate(
                              selectedTicket.updated_at
                            )}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* ORIGINAL QUERY */}

                    <div
                      className={`border-b p-5 sm:p-6 ${
                        isDark
                          ? "border-gray-800"
                          : "border-gray-200"
                      }`}
                    >
                      <div className="mb-3 flex items-center gap-2">
                        <MessageCircle
                          size={18}
                          className={
                            isDark
                              ? "text-[#D99AA3]"
                              : "text-[#B76E79]"
                          }
                        />

                        <h3
                          className={`text-sm font-bold ${
                            isDark
                              ? "text-white"
                              : "text-gray-900"
                          }`}
                        >
                          Your Query
                        </h3>
                      </div>

                      <div
                        className={`rounded-xl border p-4 ${
                          isDark
                            ? "border-gray-800 bg-gray-800/30"
                            : "border-gray-200 bg-gray-50"
                        }`}
                      >
                        <p
                          className={`whitespace-pre-wrap text-sm leading-6 ${
                            isDark
                              ? "text-gray-300"
                              : "text-gray-700"
                          }`}
                        >
                          {
                            selectedTicket.description
                          }
                        </p>
                      </div>
                    </div>

                    {/* CONVERSATION */}

                    <div className="p-5 sm:p-6">
                      <div className="mb-5 flex items-center gap-2">
                        <MessageCircle
                          size={18}
                          className={
                            isDark
                              ? "text-[#D99AA3]"
                              : "text-[#B76E79]"
                          }
                        />

                        <h3
                          className={`text-sm font-bold ${
                            isDark
                              ? "text-white"
                              : "text-gray-900"
                          }`}
                        >
                          Conversation
                        </h3>
                      </div>

                      <div className="space-y-4">
                        {selectedTicket.messages &&
                        selectedTicket.messages.length > 0 ? (
                          selectedTicket.messages.map(
                            (message) => {
                              const sender =
                                message.sender_type
                                  ?.toLowerCase();

                              const isUser =
                                sender ===
                                "user";

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
                                    <div
                                      className={`max-w-2xl rounded-xl border px-4 py-3 text-center ${
                                        isDark
                                          ? "border-gray-800 bg-gray-800/40"
                                          : "border-gray-200 bg-gray-50"
                                      }`}
                                    >
                                      <p
                                        className={`text-xs leading-5 ${
                                          isDark
                                            ? "text-gray-300"
                                            : "text-gray-600"
                                        }`}
                                      >
                                        {
                                          message.message
                                        }
                                      </p>

                                      <p
                                        className={`mt-2 text-[10px] ${
                                          isDark
                                            ? "text-gray-600"
                                            : "text-gray-400"
                                        }`}
                                      >
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
                                    isUser
                                      ? "justify-end"
                                      : "justify-start"
                                  }`}
                                >
                                  <div className="max-w-[85%] sm:max-w-[70%]">
                                    <div
                                      className={`mb-1 flex items-center gap-2 ${
                                        isUser
                                          ? "justify-end"
                                          : "justify-start"
                                      }`}
                                    >
                                      {!isUser && (
                                        <HelpCircle
                                          size={14}
                                          className="text-blue-500"
                                        />
                                      )}

                                      <span
                                        className={`text-[11px] ${
                                          isDark
                                            ? "text-gray-500"
                                            : "text-gray-400"
                                        }`}
                                      >
                                        {isUser
                                          ? "You"
                                          : "AdsPromoHub Support"}
                                      </span>
                                    </div>

                                    <div
                                      className={`rounded-2xl px-4 py-3 ${
                                        isUser
                                          ? "rounded-tr-md bg-[#B76E79] text-white"
                                          : isDark
                                            ? "rounded-tl-md bg-gray-800 text-gray-200"
                                            : "rounded-tl-md bg-gray-100 text-gray-700"
                                      }`}
                                    >
                                      <p className="whitespace-pre-wrap text-sm leading-6">
                                        {
                                          message.message
                                        }
                                      </p>

                                      <p
                                        className={`mt-2 text-[10px] ${
                                          isUser
                                            ? "text-[#FFE5E8]"
                                            : isDark
                                              ? "text-gray-500"
                                              : "text-gray-400"
                                        }`}
                                      >
                                        {formatDate(
                                          message.created_at
                                        )}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              );
                            }
                          )
                        ) : (
                          <div
                            className={`rounded-xl border p-8 text-center ${
                              isDark
                                ? "border-gray-800 bg-gray-800/30"
                                : "border-gray-200 bg-gray-50"
                            }`}
                          >
                            <MessageCircle
                              size={26}
                              className="mx-auto text-gray-400"
                            />

                            <p
                              className={`mt-3 text-sm ${
                                isDark
                                  ? "text-gray-500"
                                  : "text-gray-400"
                              }`}
                            >
                              No messages yet.
                            </p>
                          </div>
                        )}
                      </div>

                      {/* REPLY */}

                      {selectedTicket.status?.toLowerCase() !==
                        "resolved" &&
                      selectedTicket.status?.toLowerCase() !==
                        "closed" ? (
                        <div className="mt-6">
                          <label
                            className={`mb-2 block text-sm font-semibold ${
                              isDark
                                ? "text-gray-200"
                                : "text-gray-700"
                            }`}
                          >
                            Reply to Support
                          </label>

                          <div className="flex flex-col gap-3 sm:flex-row">
                            <textarea
                              value={reply}
                              onChange={(e) =>
                                setReply(
                                  e.target.value
                                )
                              }
                              rows={3}
                              maxLength={10000}
                              placeholder="Write your reply..."
                              className={`flex-1 rounded-xl border px-4 py-3 text-sm outline-none transition ${
                                isDark
                                  ? "border-gray-800 bg-gray-800 text-white placeholder:text-gray-600 focus:border-[#B76E79]"
                                  : "border-gray-200 bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:border-[#B76E79]"
                              }`}
                            />

                            <button
                              type="button"
                              onClick={
                                handleReply
                              }
                              disabled={
                                replying ||
                                !reply.trim()
                              }
                              className="flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-[#B76E79] px-5 text-sm font-semibold text-white transition hover:bg-[#8F4F5A] disabled:cursor-not-allowed disabled:opacity-50 sm:w-32"
                            >
                              {replying ? (
                                <RefreshCw
                                  size={17}
                                  className="animate-spin"
                                />
                              ) : (
                                <Send
                                  size={17}
                                />
                              )}

                              {replying
                                ? "Sending"
                                : "Send"}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div
                          className={`mt-6 rounded-xl border p-4 text-center ${
                            isDark
                              ? "border-green-500/20 bg-green-500/5"
                              : "border-green-100 bg-green-50"
                          }`}
                        >
                          <CheckCircle2
                            size={22}
                            className="mx-auto text-green-500"
                          />

                          <p
                            className={`mt-2 text-sm font-semibold ${
                              isDark
                                ? "text-green-400"
                                : "text-green-600"
                            }`}
                          >
                            This ticket has been
                            resolved.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                {/* SUMMARY */}

                <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  <SummaryCard
                    isDark={isDark}
                    title="Total Tickets"
                    value={
                      loading
                        ? "..."
                        : totalTickets
                    }
                    icon={
                      <Ticket
                        size={22}
                      />
                    }
                    iconClass={
                      isDark
                        ? "bg-[#B76E79]/20 text-[#D99AA3]"
                        : "bg-[#FFE5E8] text-[#B76E79]"
                    }
                  />

                  <SummaryCard
                    isDark={isDark}
                    title="Open Tickets"
                    value={
                      loading
                        ? "..."
                        : openTickets
                    }
                    icon={
                      <Clock3
                        size={22}
                      />
                    }
                    iconClass={
                      isDark
                        ? "bg-blue-500/20 text-blue-400"
                        : "bg-blue-100 text-blue-600"
                    }
                  />

                  <SummaryCard
                    isDark={isDark}
                    title="In Progress"
                    value={
                      loading
                        ? "..."
                        : progressTickets
                    }
                    icon={
                      <MessageCircle
                        size={22}
                      />
                    }
                    iconClass={
                      isDark
                        ? "bg-orange-500/20 text-orange-400"
                        : "bg-orange-100 text-orange-600"
                    }
                  />

                  <SummaryCard
                    isDark={isDark}
                    title="Resolved"
                    value={
                      loading
                        ? "..."
                        : resolvedTickets
                    }
                    icon={
                      <CheckCircle2
                        size={22}
                      />
                    }
                    iconClass={
                      isDark
                        ? "bg-green-500/20 text-green-400"
                        : "bg-green-100 text-green-600"
                    }
                  />
                </div>

                {/* CREATE + LIST */}

                <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                  {/* CREATE */}

                  <div
                    className={`overflow-hidden rounded-2xl border shadow-sm ${
                      isDark
                        ? "border-gray-800 bg-gray-900"
                        : "border-gray-200 bg-white"
                    }`}
                  >
                    <div
                      className={`border-b p-5 ${
                        isDark
                          ? "border-gray-800"
                          : "border-gray-200"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                            isDark
                              ? "bg-[#B76E79]/20 text-[#D99AA3]"
                              : "bg-[#FFE5E8] text-[#B76E79]"
                          }`}
                        >
                          <Plus
                            size={22}
                          />
                        </div>

                        <div>
                          <h2
                            className={`text-lg font-bold ${
                              isDark
                                ? "text-white"
                                : "text-gray-900"
                            }`}
                          >
                            Raise New Ticket
                          </h2>

                          <p
                            className={`mt-1 text-sm ${
                              isDark
                                ? "text-gray-400"
                                : "text-gray-500"
                            }`}
                          >
                            Tell us what problem
                            you're facing.
                          </p>
                        </div>
                      </div>
                    </div>

                    <form
                      onSubmit={
                        handleCreateTicket
                      }
                      className="space-y-5 p-5"
                    >
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                          Category
                        </label>

                        <select
                          value={category}
                          onChange={(e) =>
                            setCategory(
                              e.target.value
                            )
                          }
                          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none focus:border-[#B76E79]"
                        >
                          {categories.map(
                            (item) => (
                              <option
                                key={item}
                                value={item}
                              >
                                {item}
                              </option>
                            )
                          )}
                        </select>
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                          Priority
                        </label>

                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                          {priorities.map(
                            (item) => (
                              <button
                                type="button"
                                key={item}
                                onClick={() =>
                                  setPriority(
                                    item
                                  )
                                }
                                className={`rounded-xl px-2 py-2.5 text-xs font-semibold capitalize transition ${
                                  priority ===
                                  item
                                    ? "bg-[#B76E79] text-white"
                                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                                }`}
                              >
                                {item}
                              </button>
                            )
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                          Subject
                        </label>

                        <input
                          type="text"
                          value={subject}
                          onChange={(e) =>
                            setSubject(
                              e.target.value
                            )
                          }
                          maxLength={255}
                          placeholder="Enter your problem title"
                          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-[#B76E79]"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                          Describe Your Problem
                        </label>

                        <textarea
                          value={description}
                          onChange={(e) =>
                            setDescription(
                              e.target.value
                            )
                          }
                          rows={6}
                          maxLength={10000}
                          placeholder="Please explain your issue in detail..."
                          className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-[#B76E79]"
                        />
                      </div>

                      <div className="rounded-xl border border-[#D99AA3]/40 bg-[#FFE5E8] p-4">
                        <div className="flex items-start gap-3">
                          <HelpCircle
                            size={18}
                            className="mt-0.5 shrink-0 text-[#B76E79]"
                          />

                          <div>
                            <p className="text-sm font-semibold text-gray-700">
                              What happens next?
                            </p>

                            <p className="mt-1 text-xs leading-5 text-gray-500">
                              Your ticket will be
                              linked to your
                              AdsPromoHub account.
                              Thank you for
                              connecting with
                              AdsPromoHub. Our
                              support team will
                              connect with you
                              soon.
                            </p>
                          </div>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={
                          submitting ||
                          !subject.trim() ||
                          !description.trim()
                        }
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#B76E79] py-3.5 text-sm font-semibold text-white transition hover:bg-[#8F4F5A] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {submitting ? (
                          <>
                            <RefreshCw
                              size={17}
                              className="animate-spin"
                            />

                            Creating Ticket...
                          </>
                        ) : (
                          <>
                            <Send
                              size={17}
                            />

                            Submit Ticket
                          </>
                        )}
                      </button>
                    </form>
                  </div>

                  {/* MY TICKETS */}

                  <div
                    className={`overflow-hidden rounded-2xl border shadow-sm ${
                      isDark
                        ? "border-gray-800 bg-gray-900"
                        : "border-gray-200 bg-white"
                    }`}
                  >
                    <div className="border-b border-gray-200 p-5">
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="text-lg font-bold text-gray-900">
                            My Tickets
                          </h2>

                          <p className="mt-1 text-sm text-gray-500">
                            View your support
                            requests.
                          </p>
                        </div>

                        <Ticket
                          size={22}
                          className="text-[#B76E79]"
                        />
                      </div>
                    </div>

                    {loading && (
                      <div className="p-10 text-center">
                        <RefreshCw
                          size={27}
                          className="mx-auto animate-spin text-[#B76E79]"
                        />

                        <p className="mt-3 text-sm text-gray-500">
                          Loading tickets...
                        </p>
                      </div>
                    )}

                    {!loading &&
                    tickets.length === 0 && (
                      <div className="p-10 text-center">
                        <MessageCircle
                          size={32}
                          className="mx-auto text-gray-400"
                        />

                        <h3 className="mt-4 text-sm font-bold text-gray-900">
                          No Tickets Yet
                        </h3>

                        <p className="mx-auto mt-2 max-w-sm text-xs text-gray-400">
                          If you are facing any
                          problem, create a
                          support ticket and our
                          team will help you.
                        </p>
                      </div>
                    )}

                    {!loading &&
                    tickets.length > 0 && (
                      <div className="max-h-[700px] space-y-3 overflow-y-auto p-4">
                        {tickets.map(
                          (ticket) => (
                            <button
                              type="button"
                              key={
                                ticket.id
                              }
                              onClick={() => {
                                setError("");
                                setSuccess("");
                                setReply("");

                                loadTicket(
                                  ticket.id
                                );
                              }}
                              className="group w-full rounded-xl border border-gray-200 bg-gray-50 p-4 text-left transition hover:bg-gray-100"
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex min-w-0 items-start gap-3">
                                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFE5E8] text-[#B76E79]">
                                    <Ticket
                                      size={17}
                                    />
                                  </div>

                                  <div className="min-w-0">
                                    <div className="flex flex-wrap items-center gap-2">
                                      <span className="text-xs font-bold text-[#B76E79]">
                                        {
                                          ticket.ticket_number
                                        }
                                      </span>

                                      <span
                                        className={`rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ${getPriorityClass(
                                          ticket.priority
                                        )}`}
                                      >
                                        {
                                          ticket.priority
                                        }
                                      </span>
                                    </div>

                                    <h3 className="mt-1 truncate text-sm font-semibold text-gray-900">
                                      {
                                        ticket.subject
                                      }
                                    </h3>

                                    <p className="mt-1 truncate text-xs text-gray-400">
                                      {
                                        ticket.category
                                      }
                                    </p>
                                  </div>
                                </div>

                                <ChevronRight
                                  size={18}
                                  className="mt-2 shrink-0 text-gray-400 transition group-hover:text-[#B76E79]"
                                />
                              </div>

                              <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-3">
                                <span className="text-[11px] text-gray-400">
                                  {formatDate(
                                    ticket.updated_at ||
                                      ticket.created_at
                                  )}
                                </span>

                                <span
                                  className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${getStatusClass(
                                    ticket.status
                                  )}`}
                                >
                                  {getStatusLabel(
                                    ticket.status
                                  )}
                                </span>
                              </div>
                            </button>
                          )
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </main>
        </div>

        <style>
          {`
            .animated-gradient {
              background: linear-gradient(
                90deg,
                #60a5fa,
                #B76E79,
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
};

// =====================================================
// SUMMARY CARD
// =====================================================

interface SummaryCardProps {
  isDark: boolean;
  title: string;
  value: string | number;
  icon: React.ReactNode;
  iconClass: string;
}

const SummaryCard: React.FC<
  SummaryCardProps
> = ({
  isDark,
  title,
  value,
  icon,
  iconClass,
}) => {
  return (
    <div
      className={`rounded-2xl border p-5 shadow-sm ${
        isDark
          ? "border-gray-800 bg-gray-900"
          : "border-gray-200 bg-white"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconClass}`}
        >
          {icon}
        </div>

        <div>
          <p
            className={`text-sm ${
              isDark
                ? "text-gray-400"
                : "text-gray-500"
            }`}
          >
            {title}
          </p>

          <h2
            className={`mt-1 text-2xl font-bold ${
              isDark
                ? "text-white"
                : "text-gray-900"
            }`}
          >
            {value}
          </h2>
        </div>
      </div>
    </div>
  );
};

export default Support;