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

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
// =====================================================
// API
// =====================================================

const RAW_API_URL =
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:8000";

const API_URL = RAW_API_URL.replace(/\/+$/, "");

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
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

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
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

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
// =====================================================
// COMPONENT
// =====================================================

const Support: React.FC = () => {
<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
  const navigate = useNavigate();

  // =====================================================
  // DARK MODE
  // =====================================================

  const [isDark] = useState(false);

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
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

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
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

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
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

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
  // =====================================================
  // TOKEN
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
<<<<<<< HEAD
    } catch (error) {
=======

    } catch (error) {

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
      console.error(
        "Unable to read token:",
        error
      );

      return "";
    }
  };

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
  // =====================================================
  // UNAUTHORIZED
  // =====================================================

  const handleUnauthorized = () => {
<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
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
<<<<<<< HEAD
      navigate("/signin", {
        replace: true,
      });
    }, 500);
  };

=======

      navigate(
        "/signin",
        {
          replace: true,
        }
      );

    }, 500);
  };


>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
  // =====================================================
  // API ERROR
  // =====================================================

  const getApiError = async (
    response: Response,
    fallback: string
  ) => {
<<<<<<< HEAD
    try {
=======

    try {

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
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
<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
        return data.detail
          .map(
            (item: any) =>
              item?.msg ||
              "Validation error"
          )
          .join(", ");
      }
<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
    } catch {
      // Ignore invalid JSON.
    }

    return fallback;
  };

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
  // =====================================================
  // DATE
  // =====================================================

  const formatDate = (
    date?: string | null
  ) => {
<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
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

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
  // =====================================================
  // STATUS
  // =====================================================

  const getStatusLabel = (
    status: string
  ) => {
<<<<<<< HEAD
    switch (
      status?.toLowerCase()
    ) {
=======

    switch (
      status?.toLowerCase()
    ) {

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
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

<<<<<<< HEAD
  const getStatusClass = (
    status: string
  ) => {
    switch (
      status?.toLowerCase()
    ) {
      case "open":
=======

  const getStatusClass = (
    status: string
  ) => {

    switch (
      status?.toLowerCase()
    ) {

      case "open":

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
        return isDark
          ? "bg-blue-500/10 text-blue-400"
          : "bg-blue-50 text-blue-600";

<<<<<<< HEAD
      case "in_progress":
        return isDark
          ? "bg-[#B76E79]/10 text-[#D99AA3]"
          : "bg-[#FFE5E8] text-[#8F4F5A]";

      case "waiting_for_user":
=======

      case "in_progress":

        return isDark
          ? "bg-purple-500/10 text-purple-400"
          : "bg-purple-50 text-purple-600";


      case "waiting_for_user":

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
        return isDark
          ? "bg-yellow-500/10 text-yellow-400"
          : "bg-yellow-50 text-yellow-700";

<<<<<<< HEAD
      case "resolved":
=======

      case "resolved":

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
        return isDark
          ? "bg-green-500/10 text-green-400"
          : "bg-green-50 text-green-600";

<<<<<<< HEAD
      case "closed":
=======

      case "closed":

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
        return isDark
          ? "bg-gray-800 text-gray-400"
          : "bg-gray-100 text-gray-500";

<<<<<<< HEAD
      default:
=======

      default:

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
        return isDark
          ? "bg-gray-800 text-gray-400"
          : "bg-gray-100 text-gray-500";
    }
  };

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
  // =====================================================
  // PRIORITY
  // =====================================================

  const getPriorityClass = (
    priority: string
  ) => {
<<<<<<< HEAD
    switch (
      priority?.toLowerCase()
    ) {
      case "urgent":
=======

    switch (
      priority?.toLowerCase()
    ) {

      case "urgent":

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
        return isDark
          ? "bg-red-500/10 text-red-400"
          : "bg-red-50 text-red-600";

<<<<<<< HEAD
      case "high":
=======

      case "high":

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
        return isDark
          ? "bg-orange-500/10 text-orange-400"
          : "bg-orange-50 text-orange-600";

<<<<<<< HEAD
      case "normal":
=======

      case "normal":

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
        return isDark
          ? "bg-blue-500/10 text-blue-400"
          : "bg-blue-50 text-blue-600";

<<<<<<< HEAD
      case "low":
=======

      case "low":

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
        return isDark
          ? "bg-gray-800 text-gray-400"
          : "bg-gray-100 text-gray-500";

<<<<<<< HEAD
      default:
=======

      default:

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
        return isDark
          ? "bg-gray-800 text-gray-400"
          : "bg-gray-100 text-gray-500";
    }
  };

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
  // =====================================================
  // LOAD TICKETS
  // =====================================================

  const loadTickets = async (
    showLoading = true
  ) => {
<<<<<<< HEAD
    try {
      const token = getToken();

      if (!token) {
        handleUnauthorized();
=======

    try {

      const token =
        getToken();

      if (!token) {

        handleUnauthorized();

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
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
<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
            headers: {
              Authorization:
                `Bearer ${token}`,
              Accept:
                "application/json",
            },
          }
        );

<<<<<<< HEAD
      if (
        response.status === 401
      ) {
        handleUnauthorized();
        return;
      }

      if (!response.ok) {
=======

      if (
        response.status === 401
      ) {

        handleUnauthorized();

        return;
      }


      if (!response.ok) {

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
        throw new Error(
          await getApiError(
            response,
            "Unable to load support tickets."
          )
        );
      }

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
      const result:
        TicketsResponse =
        await response.json();

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
      setTickets(
        Array.isArray(
          result?.tickets
        )
          ? result.tickets
          : []
      );
<<<<<<< HEAD
    } catch (err: any) {
=======

    } catch (err: any) {

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
      console.error(
        "Support tickets error:",
        err
      );

      setError(
        err?.message ||
        "Unable to load support tickets."
      );
<<<<<<< HEAD
    } finally {
=======

    } finally {

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
      setLoading(false);
      setRefreshing(false);
    }
  };

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
  // =====================================================
  // LOAD SINGLE TICKET
  // =====================================================

  const loadTicket = async (
    id: string | number,
    showLoading = true
  ) => {
<<<<<<< HEAD
    try {
      const token = getToken();

      if (!token) {
        handleUnauthorized();
        return;
      }

=======

    try {

      const token =
        getToken();

      if (!token) {

        handleUnauthorized();

        return;
      }


>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
      if (showLoading) {
        setLoadingDetail(true);
      }

      setError("");

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
      const response =
        await fetch(
          `${API_URL}/api/support/tickets/${id}`,
          {
            method: "GET",
<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
            headers: {
              Authorization:
                `Bearer ${token}`,
              Accept:
                "application/json",
            },
          }
        );

<<<<<<< HEAD
      if (
        response.status === 401
      ) {
        handleUnauthorized();
        return;
      }

      if (!response.ok) {
=======

      if (
        response.status === 401
      ) {

        handleUnauthorized();

        return;
      }


      if (!response.ok) {

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
        throw new Error(
          await getApiError(
            response,
            "Unable to load ticket details."
          )
        );
      }

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
      const result:
        TicketResponse =
        await response.json();

<<<<<<< HEAD
      if (!result?.ticket) {
=======

      if (!result?.ticket) {

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
        throw new Error(
          "Ticket details were not returned by server."
        );
      }

<<<<<<< HEAD
      setSelectedTicket(
        result.ticket
      );
    } catch (err: any) {
=======

      setSelectedTicket(
        result.ticket
      );

    } catch (err: any) {

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
      console.error(
        "Ticket detail error:",
        err
      );

      setError(
        err?.message ||
        "Unable to load ticket details."
      );
<<<<<<< HEAD
    } finally {
=======

    } finally {

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
      if (showLoading) {
        setLoadingDetail(false);
      }
    }
  };

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
<<<<<<< HEAD
    loadTickets(true);
  }, []);

=======

    loadTickets(true);

  }, []);


>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
  // =====================================================
  // AUTO REFRESH OPEN TICKET
  // =====================================================

  useEffect(() => {
<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
    if (
      !selectedTicket?.id
    ) {
      return;
    }

    const ticketId =
      selectedTicket.id;

<<<<<<< HEAD
    const interval =
      window.setInterval(
        () => {
=======

    const interval =
      window.setInterval(
        () => {

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
          loadTicket(
            ticketId,
            false
          );
<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
        },
        5000
      );

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
    return () =>
      window.clearInterval(
        interval
      );
<<<<<<< HEAD
  }, [selectedTicket?.id]);

=======

  }, [selectedTicket?.id]);


>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
  // =====================================================
  // CREATE TICKET
  // =====================================================

  const handleCreateTicket =
    async (
      e: React.FormEvent
    ) => {
<<<<<<< HEAD
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

=======

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

        const token =
          getToken();

        if (!token) {

          handleUnauthorized();

          return;
        }


        setSubmitting(true);

        setError("");
        setSuccess("");


>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
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

<<<<<<< HEAD
        if (
          response.status === 401
        ) {
          handleUnauthorized();
          return;
        }

        if (!response.ok) {
=======

        if (
          response.status === 401
        ) {

          handleUnauthorized();

          return;
        }


        if (!response.ok) {

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
          throw new Error(
            await getApiError(
              response,
              "Unable to create ticket."
            )
          );
        }

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
        const result:
          TicketResponse =
          await response.json();

<<<<<<< HEAD
        if (!result?.ticket) {
=======

        if (!result?.ticket) {

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
          throw new Error(
            "Ticket was created but server did not return ticket details."
          );
        }

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
        setSubject("");
        setDescription("");

        setCategory(
          categories[0]
        );

        setPriority(
          "normal"
        );

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
        setSuccess(
          result.message ||
          "Ticket created successfully."
        );

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
        await loadTickets(
          false
        );

<<<<<<< HEAD
        setSelectedTicket(
          result.ticket
        );
      } catch (err: any) {
=======

        // Open the newly created ticket.
        setSelectedTicket(
          result.ticket
        );

      } catch (err: any) {

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
        console.error(
          "Create ticket error:",
          err
        );

        setError(
          err?.message ||
          "Unable to create ticket."
        );
<<<<<<< HEAD
      } finally {
=======

      } finally {

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
        setSubmitting(false);
      }
    };

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
  // =====================================================
  // SEND USER REPLY
  // =====================================================

  const handleReply =
    async () => {
<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
      if (!selectedTicket) {
        return;
      }

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
      const cleanReply =
        reply.trim();

      if (!cleanReply) {
        return;
      }

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
      const ticketStatus =
        selectedTicket.status
          ?.toLowerCase();

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
      if (
        ticketStatus ===
          "resolved" ||
        ticketStatus ===
          "closed"
      ) {
<<<<<<< HEAD
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

=======

        setError(
          "This ticket is already closed."
        );

        return;
      }


      try {

        const token =
          getToken();

        if (!token) {

          handleUnauthorized();

          return;
        }


        setReplying(true);

        setError("");
        setSuccess("");


>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
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

<<<<<<< HEAD
        if (
          response.status === 401
        ) {
          handleUnauthorized();
          return;
        }

        if (!response.ok) {
=======

        if (
          response.status === 401
        ) {

          handleUnauthorized();

          return;
        }


        if (!response.ok) {

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
          throw new Error(
            await getApiError(
              response,
              "Unable to send reply."
            )
          );
        }

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
        const result:
          TicketResponse =
          await response.json();

<<<<<<< HEAD
        setReply("");

=======

        setReply("");


>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
        setSuccess(
          result.message ||
          "Reply sent successfully."
        );

<<<<<<< HEAD
        if (result?.ticket) {
          setSelectedTicket(
            result.ticket
          );
        } else {
=======

        if (result?.ticket) {

          setSelectedTicket(
            result.ticket
          );

        } else {

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
          await loadTicket(
            selectedTicket.id,
            false
          );
        }

<<<<<<< HEAD
        await loadTickets(
          false
        );
      } catch (err: any) {
=======

        await loadTickets(
          false
        );

      } catch (err: any) {

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
        console.error(
          "Reply error:",
          err
        );

        setError(
          err?.message ||
          "Unable to send reply."
        );
<<<<<<< HEAD
      } finally {
=======

      } finally {

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
        setReplying(false);
      }
    };

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
  // =====================================================
  // SUMMARY
  // =====================================================

  const totalTickets =
    tickets.length;

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
  const openTickets =
    tickets.filter(
      (ticket) =>
        ticket.status
          ?.toLowerCase() ===
        "open"
    ).length;

<<<<<<< HEAD
  const progressTickets =
    tickets.filter(
      (ticket) => {
=======

  const progressTickets =
    tickets.filter(
      (ticket) => {

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
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

<<<<<<< HEAD
  const resolvedTickets =
    tickets.filter(
      (ticket) => {
=======

  const resolvedTickets =
    tickets.filter(
      (ticket) => {

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
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

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
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
<<<<<<< HEAD
        <div className="flex min-w-0 flex-1 flex-col">
=======

        <div className="flex min-w-0 flex-1 flex-col">

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
          <main
            className={`flex-1 p-4 sm:p-6 lg:p-8 ${
              isDark
                ? "animated-gradient"
                : "bg-gray-50"
            }`}
          >
<<<<<<< HEAD
            {/* HEADER */}

            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
=======

            {/* HEADER */}

            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div>

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
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
<<<<<<< HEAD
              </div>

              <button
                type="button"
                onClick={async () => {
=======

              </div>


              <button
                type="button"
                onClick={async () => {

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                  await loadTickets(
                    false
                  );

                  if (
                    selectedTicket?.id
                  ) {
<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
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
<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                <RefreshCw
                  size={16}
                  className={
                    refreshing
                      ? "animate-spin"
                      : ""
                  }
                />

                Refresh
<<<<<<< HEAD
              </button>
            </div>

            {/* BACK */}

            {selectedTicket && (
              <button
                type="button"
                onClick={() => {
=======

              </button>

            </div>


            {/* BACK */}

            {selectedTicket && (

              <button
                type="button"
                onClick={() => {

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                  setSelectedTicket(
                    null
                  );

                  setReply("");
                  setError("");
                  setSuccess("");
<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                }}
                className={`mb-6 flex items-center gap-2 text-sm font-semibold transition ${
                  isDark
                    ? "text-gray-300 hover:text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                <ArrowLeft
                  size={18}
                />

                Back to Support
<<<<<<< HEAD
              </button>
            )}

            {/* ERROR */}

            {error && (
              <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
=======

              </button>

            )}


            {/* ERROR */}

            {error && (

              <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                <AlertCircle
                  size={18}
                  className="mt-0.5 shrink-0"
                />

                <span>
                  {error}
                </span>
<<<<<<< HEAD
              </div>
            )}

            {/* SUCCESS */}

            {success && (
              <div className="mb-6 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-600">
=======

              </div>

            )}


            {/* SUCCESS */}

            {success && (

              <div className="mb-6 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-600">

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                <CheckCircle2
                  size={18}
                  className="mt-0.5 shrink-0"
                />

                <span>
                  {success}
                </span>
<<<<<<< HEAD
              </div>
            )}

=======

              </div>

            )}


>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
            {/* ================================================= */}
            {/* TICKET DETAIL */}
            {/* ================================================= */}

            {selectedTicket ? (
<<<<<<< HEAD
              <div className="mx-auto max-w-5xl">
                {loadingDetail ? (
=======

              <div className="mx-auto max-w-5xl">

                {loadingDetail ? (

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                  <div
                    className={`rounded-2xl border p-10 text-center shadow-sm ${
                      isDark
                        ? "border-gray-800 bg-gray-900"
                        : "border-gray-200 bg-white"
                    }`}
                  >
<<<<<<< HEAD
                    <RefreshCw
                      size={28}
                      className="mx-auto animate-spin text-[#B76E79]"
=======

                    <RefreshCw
                      size={28}
                      className="mx-auto animate-spin text-purple-500"
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
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
<<<<<<< HEAD
                  </div>
                ) : (
=======

                  </div>

                ) : (

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                  <div
                    className={`overflow-hidden rounded-2xl border shadow-sm ${
                      isDark
                        ? "border-gray-800 bg-gray-900"
                        : "border-gray-200 bg-white"
                    }`}
                  >
<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                    {/* TICKET HEADER */}

                    <div
                      className={`border-b p-5 sm:p-6 ${
                        isDark
                          ? "border-gray-800"
                          : "border-gray-200"
                      }`}
                    >
<<<<<<< HEAD
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex items-start gap-3">
                          <div
                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                              isDark
                                ? "bg-[#B76E79]/20 text-[#D99AA3]"
                                : "bg-[#FFE5E8] text-[#B76E79]"
=======

                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                        <div className="flex items-start gap-3">

                          <div
                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                              isDark
                                ? "bg-purple-500/20 text-purple-400"
                                : "bg-purple-100 text-purple-600"
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                            }`}
                          >
                            <Ticket
                              size={21}
                            />
                          </div>

<<<<<<< HEAD
                          <div>
                            <p
                              className={`text-xs font-bold ${
                                isDark
                                  ? "text-[#D99AA3]"
                                  : "text-[#B76E79]"
=======

                          <div>

                            <p
                              className={`text-xs font-bold ${
                                isDark
                                  ? "text-purple-400"
                                  : "text-purple-600"
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                              }`}
                            >
                              {
                                selectedTicket.ticket_number
                              }
                            </p>

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
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
                              Created{" "}
                              {formatDate(
                                selectedTicket.created_at
                              )}
                            </p>
<<<<<<< HEAD
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
=======

                          </div>

                        </div>


                        <div className="flex flex-wrap gap-2">

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                              selectedTicket.status
                            )}`}
                          >
                            {getStatusLabel(
                              selectedTicket.status
                            )}
                          </span>

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${getPriorityClass(
                              selectedTicket.priority
                            )}`}
                          >
                            {
                              selectedTicket.priority
                            }
                          </span>
<<<<<<< HEAD
                        </div>
                      </div>

                      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
=======

                        </div>

                      </div>


                      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                        <div
                          className={`rounded-xl border p-3 ${
                            isDark
                              ? "border-gray-800 bg-gray-800/30"
                              : "border-gray-200 bg-gray-50"
                          }`}
                        >
<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
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
<<<<<<< HEAD
                        </div>

=======

                        </div>


>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                        <div
                          className={`rounded-xl border p-3 ${
                            isDark
                              ? "border-gray-800 bg-gray-800/30"
                              : "border-gray-200 bg-gray-50"
                          }`}
                        >
<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
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
<<<<<<< HEAD
                        </div>
                      </div>
                    </div>

=======

                        </div>

                      </div>

                    </div>


>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                    {/* ORIGINAL QUERY */}

                    <div
                      className={`border-b p-5 sm:p-6 ${
                        isDark
                          ? "border-gray-800"
                          : "border-gray-200"
                      }`}
                    >
<<<<<<< HEAD
                      <div className="mb-3 flex items-center gap-2">
=======

                      <div className="mb-3 flex items-center gap-2">

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                        <MessageCircle
                          size={18}
                          className={
                            isDark
<<<<<<< HEAD
                              ? "text-[#D99AA3]"
                              : "text-[#B76E79]"
=======
                              ? "text-purple-400"
                              : "text-purple-600"
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
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
<<<<<<< HEAD
                      </div>

=======

                      </div>


>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                      <div
                        className={`rounded-xl border p-4 ${
                          isDark
                            ? "border-gray-800 bg-gray-800/30"
                            : "border-gray-200 bg-gray-50"
                        }`}
                      >
<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
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
<<<<<<< HEAD
                      </div>
                    </div>

                    {/* CONVERSATION */}

                    <div className="p-5 sm:p-6">
                      <div className="mb-5 flex items-center gap-2">
=======

                      </div>

                    </div>


                    {/* CONVERSATION */}

                    <div className="p-5 sm:p-6">

                      <div className="mb-5 flex items-center gap-2">

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                        <MessageCircle
                          size={18}
                          className={
                            isDark
<<<<<<< HEAD
                              ? "text-[#D99AA3]"
                              : "text-[#B76E79]"
=======
                              ? "text-purple-400"
                              : "text-purple-600"
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
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
<<<<<<< HEAD
                      </div>

                      <div className="space-y-4">
                        {selectedTicket.messages &&
                        selectedTicket.messages.length > 0 ? (
                          selectedTicket.messages.map(
                            (message) => {
=======

                      </div>


                      <div className="space-y-4">

                        {selectedTicket.messages &&
                        selectedTicket.messages.length > 0 ? (

                          selectedTicket.messages.map(
                            (message) => {

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                              const sender =
                                message.sender_type
                                  ?.toLowerCase();

                              const isUser =
                                sender ===
                                "user";

                              const isSystem =
                                sender ===
                                "system";

<<<<<<< HEAD
                              if (isSystem) {
                                return (
=======

                              if (isSystem) {

                                return (

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                                  <div
                                    key={
                                      message.id
                                    }
                                    className="flex justify-center"
                                  >
<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                                    <div
                                      className={`max-w-2xl rounded-xl border px-4 py-3 text-center ${
                                        isDark
                                          ? "border-gray-800 bg-gray-800/40"
                                          : "border-gray-200 bg-gray-50"
                                      }`}
                                    >
<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
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

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
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
<<<<<<< HEAD
                                    </div>
=======

                                    </div>

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                                  </div>
                                );
                              }

<<<<<<< HEAD
                              return (
=======

                              return (

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
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
<<<<<<< HEAD
                                  <div className="max-w-[85%] sm:max-w-[70%]">
=======

                                  <div className="max-w-[85%] sm:max-w-[70%]">

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                                    <div
                                      className={`mb-1 flex items-center gap-2 ${
                                        isUser
                                          ? "justify-end"
                                          : "justify-start"
                                      }`}
                                    >
<<<<<<< HEAD
                                      {!isUser && (
=======

                                      {!isUser && (

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                                        <HelpCircle
                                          size={14}
                                          className="text-blue-500"
                                        />
<<<<<<< HEAD
                                      )}

=======

                                      )}


>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
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
<<<<<<< HEAD
                                    </div>

                                    <div
                                      className={`rounded-2xl px-4 py-3 ${
                                        isUser
                                          ? "rounded-tr-md bg-[#B76E79] text-white"
=======

                                    </div>


                                    <div
                                      className={`rounded-2xl px-4 py-3 ${
                                        isUser
                                          ? "rounded-tr-md bg-purple-600 text-white"
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                                          : isDark
                                            ? "rounded-tl-md bg-gray-800 text-gray-200"
                                            : "rounded-tl-md bg-gray-100 text-gray-700"
                                      }`}
                                    >
<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                                      <p className="whitespace-pre-wrap text-sm leading-6">
                                        {
                                          message.message
                                        }
                                      </p>

<<<<<<< HEAD
                                      <p
                                        className={`mt-2 text-[10px] ${
                                          isUser
                                            ? "text-[#FFE5E8]"
=======

                                      <p
                                        className={`mt-2 text-[10px] ${
                                          isUser
                                            ? "text-purple-200"
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                                            : isDark
                                              ? "text-gray-500"
                                              : "text-gray-400"
                                        }`}
                                      >
                                        {formatDate(
                                          message.created_at
                                        )}
                                      </p>
<<<<<<< HEAD
                                    </div>
                                  </div>
=======

                                    </div>

                                  </div>

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                                </div>
                              );
                            }
                          )
<<<<<<< HEAD
                        ) : (
=======

                        ) : (

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                          <div
                            className={`rounded-xl border p-8 text-center ${
                              isDark
                                ? "border-gray-800 bg-gray-800/30"
                                : "border-gray-200 bg-gray-50"
                            }`}
                          >
<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
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
<<<<<<< HEAD
                          </div>
                        )}
                      </div>

=======

                          </div>

                        )}

                      </div>


>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                      {/* REPLY */}

                      {selectedTicket.status?.toLowerCase() !==
                        "resolved" &&
                      selectedTicket.status?.toLowerCase() !==
                        "closed" ? (
<<<<<<< HEAD
                        <div className="mt-6">
=======

                        <div className="mt-6">

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                          <label
                            className={`mb-2 block text-sm font-semibold ${
                              isDark
                                ? "text-gray-200"
                                : "text-gray-700"
                            }`}
                          >
                            Reply to Support
                          </label>

<<<<<<< HEAD
                          <div className="flex flex-col gap-3 sm:flex-row">
=======

                          <div className="flex flex-col gap-3 sm:flex-row">

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
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
<<<<<<< HEAD
                                  ? "border-gray-800 bg-gray-800 text-white placeholder:text-gray-600 focus:border-[#B76E79]"
                                  : "border-gray-200 bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:border-[#B76E79]"
                              }`}
                            />

=======
                                  ? "border-gray-800 bg-gray-800 text-white placeholder:text-gray-600 focus:border-purple-500"
                                  : "border-gray-200 bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:border-purple-400"
                              }`}
                            />


>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                            <button
                              type="button"
                              onClick={
                                handleReply
                              }
                              disabled={
                                replying ||
                                !reply.trim()
                              }
<<<<<<< HEAD
                              className="flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-[#B76E79] px-5 text-sm font-semibold text-white transition hover:bg-[#8F4F5A] disabled:cursor-not-allowed disabled:opacity-50 sm:w-32"
                            >
                              {replying ? (
=======
                              className="flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 text-sm font-semibold text-white transition hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-50 sm:w-32"
                            >

                              {replying ? (

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                                <RefreshCw
                                  size={17}
                                  className="animate-spin"
                                />
<<<<<<< HEAD
                              ) : (
                                <Send
                                  size={17}
                                />
=======

                              ) : (

                                <Send
                                  size={17}
                                />

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                              )}

                              {replying
                                ? "Sending"
                                : "Send"}
<<<<<<< HEAD
                            </button>
                          </div>
                        </div>
                      ) : (
=======

                            </button>

                          </div>

                        </div>

                      ) : (

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                        <div
                          className={`mt-6 rounded-xl border p-4 text-center ${
                            isDark
                              ? "border-green-500/20 bg-green-500/5"
                              : "border-green-100 bg-green-50"
                          }`}
                        >
<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
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
<<<<<<< HEAD
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
=======

                        </div>

                      )}

                    </div>

                  </div>

                )}

              </div>

            ) : (

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
              <>
                {/* SUMMARY */}

                <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
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
<<<<<<< HEAD
                        ? "bg-[#B76E79]/20 text-[#D99AA3]"
                        : "bg-[#FFE5E8] text-[#B76E79]"
                    }
                  />

=======
                        ? "bg-purple-500/20 text-purple-400"
                        : "bg-purple-100 text-purple-600"
                    }
                  />


>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
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

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
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

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
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
<<<<<<< HEAD
                </div>

                {/* CREATE + LIST */}

                <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
=======

                </div>


                {/* CREATE + LIST */}

                <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                  {/* CREATE */}

                  <div
                    className={`overflow-hidden rounded-2xl border shadow-sm ${
                      isDark
                        ? "border-gray-800 bg-gray-900"
                        : "border-gray-200 bg-white"
                    }`}
                  >
<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                    <div
                      className={`border-b p-5 ${
                        isDark
                          ? "border-gray-800"
                          : "border-gray-200"
                      }`}
                    >
<<<<<<< HEAD
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                            isDark
                              ? "bg-[#B76E79]/20 text-[#D99AA3]"
                              : "bg-[#FFE5E8] text-[#B76E79]"
=======

                      <div className="flex items-center gap-3">

                        <div
                          className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                            isDark
                              ? "bg-purple-500/20 text-purple-400"
                              : "bg-purple-100 text-purple-600"
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                          }`}
                        >
                          <Plus
                            size={22}
                          />
                        </div>

<<<<<<< HEAD
                        <div>
=======

                        <div>

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
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
<<<<<<< HEAD
                        </div>
                      </div>
                    </div>

=======

                        </div>

                      </div>

                    </div>


>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                    <form
                      onSubmit={
                        handleCreateTicket
                      }
                      className="space-y-5 p-5"
                    >
<<<<<<< HEAD
                      <div>
=======

                      <div>

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
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
<<<<<<< HEAD
                          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none focus:border-[#B76E79]"
                        >
                          {categories.map(
                            (item) => (
=======
                          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none focus:border-purple-400"
                        >

                          {categories.map(
                            (item) => (

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                              <option
                                key={item}
                                value={item}
                              >
                                {item}
                              </option>
<<<<<<< HEAD
                            )
                          )}
                        </select>
                      </div>

                      <div>
=======

                            )
                          )}

                        </select>

                      </div>


                      <div>

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                          Priority
                        </label>

                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
<<<<<<< HEAD
                          {priorities.map(
                            (item) => (
=======

                          {priorities.map(
                            (item) => (

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
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
<<<<<<< HEAD
                                    ? "bg-[#B76E79] text-white"
=======
                                    ? "bg-purple-600 text-white"
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                                }`}
                              >
                                {item}
                              </button>
<<<<<<< HEAD
                            )
                          )}
                        </div>
                      </div>

                      <div>
=======

                            )
                          )}

                        </div>

                      </div>


                      <div>

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
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
<<<<<<< HEAD
                          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-[#B76E79]"
                        />
                      </div>

                      <div>
=======
                          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-purple-400"
                        />

                      </div>


                      <div>

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
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
<<<<<<< HEAD
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
=======
                          className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-purple-400"
                        />

                      </div>


                      <div className="rounded-xl border border-purple-100 bg-purple-50 p-4">

                        <div className="flex items-start gap-3">

                          <HelpCircle
                            size={18}
                            className="mt-0.5 shrink-0 text-purple-500"
                          />

                          <div>

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
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
<<<<<<< HEAD
                          </div>
                        </div>
                      </div>

=======

                          </div>

                        </div>

                      </div>


>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                      <button
                        type="submit"
                        disabled={
                          submitting ||
                          !subject.trim() ||
                          !description.trim()
                        }
<<<<<<< HEAD
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#B76E79] py-3.5 text-sm font-semibold text-white transition hover:bg-[#8F4F5A] disabled:cursor-not-allowed disabled:opacity-50"
                      >
=======
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 py-3.5 text-sm font-semibold text-white transition hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-50"
                      >

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
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
<<<<<<< HEAD
                      </button>
                    </form>
                  </div>

=======

                      </button>

                    </form>

                  </div>


>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                  {/* MY TICKETS */}

                  <div
                    className={`overflow-hidden rounded-2xl border shadow-sm ${
                      isDark
                        ? "border-gray-800 bg-gray-900"
                        : "border-gray-200 bg-white"
                    }`}
                  >
<<<<<<< HEAD
                    <div className="border-b border-gray-200 p-5">
                      <div className="flex items-center justify-between">
                        <div>
=======

                    <div className="border-b border-gray-200 p-5">

                      <div className="flex items-center justify-between">

                        <div>

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                          <h2 className="text-lg font-bold text-gray-900">
                            My Tickets
                          </h2>

                          <p className="mt-1 text-sm text-gray-500">
                            View your support
                            requests.
                          </p>
<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                        </div>

                        <Ticket
                          size={22}
<<<<<<< HEAD
                          className="text-[#B76E79]"
                        />
                      </div>
                    </div>

                    {loading && (
                      <div className="p-10 text-center">
                        <RefreshCw
                          size={27}
                          className="mx-auto animate-spin text-[#B76E79]"
=======
                          className="text-purple-600"
                        />

                      </div>

                    </div>


                    {loading && (

                      <div className="p-10 text-center">

                        <RefreshCw
                          size={27}
                          className="mx-auto animate-spin text-purple-500"
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                        />

                        <p className="mt-3 text-sm text-gray-500">
                          Loading tickets...
                        </p>
<<<<<<< HEAD
                      </div>
                    )}

                    {!loading &&
                    tickets.length === 0 && (
                      <div className="p-10 text-center">
=======

                      </div>

                    )}


                    {!loading &&
                    tickets.length === 0 && (

                      <div className="p-10 text-center">

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
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
<<<<<<< HEAD
                      </div>
                    )}

                    {!loading &&
                    tickets.length > 0 && (
                      <div className="max-h-[700px] space-y-3 overflow-y-auto p-4">
                        {tickets.map(
                          (ticket) => (
=======

                      </div>

                    )}


                    {!loading &&
                    tickets.length > 0 && (

                      <div className="max-h-[700px] space-y-3 overflow-y-auto p-4">

                        {tickets.map(
                          (ticket) => (

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                            <button
                              type="button"
                              key={
                                ticket.id
                              }
                              onClick={() => {
<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                                setError("");
                                setSuccess("");
                                setReply("");

                                loadTicket(
                                  ticket.id
                                );
                              }}
                              className="group w-full rounded-xl border border-gray-200 bg-gray-50 p-4 text-left transition hover:bg-gray-100"
                            >
<<<<<<< HEAD
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
=======

                              <div className="flex items-start justify-between gap-3">

                                <div className="flex min-w-0 items-start gap-3">

                                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-purple-600">

                                    <Ticket
                                      size={17}
                                    />

                                  </div>


                                  <div className="min-w-0">

                                    <div className="flex flex-wrap items-center gap-2">

                                      <span className="text-xs font-bold text-purple-600">
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                                        {
                                          ticket.ticket_number
                                        }
                                      </span>

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                                      <span
                                        className={`rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ${getPriorityClass(
                                          ticket.priority
                                        )}`}
                                      >
                                        {
                                          ticket.priority
                                        }
                                      </span>
<<<<<<< HEAD
                                    </div>

=======

                                    </div>


>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                                    <h3 className="mt-1 truncate text-sm font-semibold text-gray-900">
                                      {
                                        ticket.subject
                                      }
                                    </h3>

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                                    <p className="mt-1 truncate text-xs text-gray-400">
                                      {
                                        ticket.category
                                      }
                                    </p>
<<<<<<< HEAD
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

=======

                                  </div>

                                </div>


                                <ChevronRight
                                  size={18}
                                  className="mt-2 shrink-0 text-gray-400 transition group-hover:text-purple-600"
                                />

                              </div>


                              <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-3">

                                <span className="text-[11px] text-gray-400">
                                  {formatDate(
                                    ticket.updated_at ||
                                    ticket.created_at
                                  )}
                                </span>


>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                                <span
                                  className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${getStatusClass(
                                    ticket.status
                                  )}`}
                                >
                                  {getStatusLabel(
                                    ticket.status
                                  )}
                                </span>
<<<<<<< HEAD
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

=======

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


>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
        <style>
          {`
            .animated-gradient {
              background: linear-gradient(
                90deg,
                #60a5fa,
<<<<<<< HEAD
                #B76E79,
=======
                #a78bfa,
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
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
<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
      </div>
    </>
  );
};

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
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

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
const SummaryCard: React.FC<
  SummaryCardProps
> = ({
  isDark,
  title,
  value,
  icon,
  iconClass,
}) => {
<<<<<<< HEAD
  return (
=======

  return (

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
    <div
      className={`rounded-2xl border p-5 shadow-sm ${
        isDark
          ? "border-gray-800 bg-gray-900"
          : "border-gray-200 bg-white"
      }`}
    >
<<<<<<< HEAD
      <div className="flex items-center gap-3">
=======

      <div className="flex items-center gap-3">

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconClass}`}
        >
          {icon}
        </div>

<<<<<<< HEAD
        <div>
=======

        <div>

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
          <p
            className={`text-sm ${
              isDark
                ? "text-gray-400"
                : "text-gray-500"
            }`}
          >
            {title}
          </p>

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
          <h2
            className={`mt-1 text-2xl font-bold ${
              isDark
                ? "text-white"
                : "text-gray-900"
            }`}
          >
            {value}
          </h2>
<<<<<<< HEAD
        </div>
      </div>
=======

        </div>

      </div>

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
    </div>
  );
};

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
export default Support;