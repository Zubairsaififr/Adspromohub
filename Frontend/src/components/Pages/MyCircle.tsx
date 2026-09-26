import React, { useEffect, useState } from "react";

import {
  Users,
  DollarSign,
  RefreshCw,
  Network,
  Crown,
  ArrowRight,
  UserRound,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import UserNavbar from "../UserDashboard/UserNavbar";

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

interface CircleMember {
  user_id: number;

  customer_id: string | null;

  referral_id: string | null;

  full_name: string;

  level: number;

  parent_referral_id: string | null;

  root_leg_referral_id: string | null;

  root_leg_name: string | null;

  direct_team_count: number;

  total_team_count: number;

  branch_member_count?: number;

  is_power_leg: boolean;

  ads_watched_today: boolean;

  created_at: string | null;
}

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
interface MyCircleResponse {
  success: boolean;

  total: number;

  members: CircleMember[];
}

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
interface CircleSummary {
  success: boolean;

  direct_members: number;

  all_circle_members: number;

  total_legs: number;

  power_leg_members: number;

  other_legs_members: number;

  power_leg_referral_id: string | null;

  power_leg_name: string | null;

  power_legs?: Array<{
    user_id: number;

    customer_id: string | null;

    referral_id: string | null;

    full_name: string;

    branch_member_count: number;
  }>;
}

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
// =========================================================
// COMPONENT
// =========================================================

const MyCircle: React.FC = () => {
<<<<<<< HEAD
  const navigate = useNavigate();

=======

  const navigate = useNavigate();


>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
  // =====================================================
  // STATE
  // =====================================================

  const [
    circleData,
    setCircleData,
  ] = useState<MyCircleResponse>({
    success: true,
    total: 0,
    members: [],
  });

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
  const [
    circleSummary,
    setCircleSummary,
  ] = useState<CircleSummary>({
    success: true,

    direct_members: 0,

    all_circle_members: 0,

    total_legs: 0,

    power_leg_members: 0,

    other_legs_members: 0,

    power_leg_referral_id: null,

    power_leg_name: null,

    power_legs: [],
  });

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
  const [
    referralIncome,
    setReferralIncome,
  ] = useState<number>(0);

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
  const [
    loading,
    setLoading,
  ] = useState(true);

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
  const [
    refreshing,
    setRefreshing,
  ] = useState(false);

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
      if (directToken) {
        return directToken;
      }

=======

      if (directToken) {

        return directToken;
      }


>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
      const storedUser =
        localStorage.getItem(
          "user"
        );

<<<<<<< HEAD
      if (!storedUser) {
        return "";
      }

=======

      if (!storedUser) {

        return "";
      }


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
  // CLEAR AUTH
  // =====================================================

  const clearAuthentication = () => {
<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
    localStorage.removeItem(
      "access_token"
    );

    localStorage.removeItem(
      "refresh_token"
    );

    localStorage.removeItem(
      "user"
    );
  };

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
  // =====================================================
  // LOAD CIRCLE
  // =====================================================

  const loadCircle =
    async (
      showLoader = true
    ) => {
<<<<<<< HEAD
      try {
        if (showLoader) {
          setLoading(true);
        } else {
          setRefreshing(true);
        }

        setError("");

        const token =
          getToken();

        if (!token) {
=======

      try {

        if (showLoader) {

          setLoading(true);

        } else {

          setRefreshing(true);
        }


        setError("");


        const token =
          getToken();


        if (!token) {

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
          setError(
            "Login session not found. Please login again."
          );

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
          navigate(
            "/signin",
            {
              replace: true,
            }
          );

<<<<<<< HEAD
          return;
        }

        const headers = {
=======

          return;
        }


        const headers = {

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
          Authorization:
            `Bearer ${token}`,

          "Content-Type":
            "application/json",
        };

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
        // ===============================================
        // LOAD ALL REQUIRED DATA TOGETHER
        // ===============================================

        const [
          circleResponse,
          summaryResponse,
          referralResponse,
        ] = await Promise.all([
<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
          fetch(
            `${API_URL}/api/circle/my-circle`,
            {
              method: "GET",
              headers,
            }
          ),

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
          fetch(
            `${API_URL}/api/circle/summary`,
            {
              method: "GET",
              headers,
            }
          ),

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
          fetch(
            `${API_URL}/api/referral/summary`,
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
        // ===============================================
        // AUTH EXPIRED
        // ===============================================

        if (
          circleResponse.status === 401 ||
          summaryResponse.status === 401 ||
          referralResponse.status === 401
        ) {
<<<<<<< HEAD
          clearAuthentication();

=======

          clearAuthentication();


>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
          setError(
            "Your login session has expired. Please login again."
          );

<<<<<<< HEAD
          setTimeout(
            () => {
=======

          setTimeout(
            () => {

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
              navigate(
                "/signin",
                {
                  replace: true,
                }
              );
<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
            },
            500
          );

<<<<<<< HEAD
          return;
        }

=======

          return;
        }


>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
        // ===============================================
        // JSON
        // ===============================================

        const circleResult =
          await circleResponse.json();

<<<<<<< HEAD
        const summaryResult =
          await summaryResponse.json();

        const referralResult =
          await referralResponse.json();

=======

        const summaryResult =
          await summaryResponse.json();


        const referralResult =
          await referralResponse.json();


>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
        console.log(
          "My Circle:",
          circleResult
        );

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
        console.log(
          "Circle Summary:",
          summaryResult
        );

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
        console.log(
          "Referral Summary:",
          referralResult
        );

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
        // ===============================================
        // ERRORS
        // ===============================================

        if (!circleResponse.ok) {
<<<<<<< HEAD
          throw new Error(
            circleResult?.detail ||
            circleResult?.message ||
=======

          throw new Error(

            circleResult?.detail ||

            circleResult?.message ||

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
            "Unable to load My Circle."
          );
        }

<<<<<<< HEAD
        if (!summaryResponse.ok) {
          throw new Error(
            summaryResult?.detail ||
            summaryResult?.message ||
=======

        if (!summaryResponse.ok) {

          throw new Error(

            summaryResult?.detail ||

            summaryResult?.message ||

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
            "Unable to load circle summary."
          );
        }

<<<<<<< HEAD
        if (!referralResponse.ok) {
          throw new Error(
            referralResult?.detail ||
            referralResult?.message ||
=======

        if (!referralResponse.ok) {

          throw new Error(

            referralResult?.detail ||

            referralResult?.message ||

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
            "Unable to load referral income."
          );
        }

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
        // ===============================================
        // SAVE MY CIRCLE
        // ===============================================

        setCircleData({
<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
          success:
            circleResult?.success ??
            true,

          total:
            Number(
              circleResult?.total ??
              0
            ),

          members:
            Array.isArray(
              circleResult?.members
            )
              ? circleResult.members
              : [],
        });

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
        // ===============================================
        // SAVE SUMMARY
        // ===============================================

        setCircleSummary({
<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
          success:
            summaryResult?.success ??
            true,

          direct_members:
            Number(
              summaryResult
                ?.direct_members ??
              0
            ),

          all_circle_members:
            Number(
              summaryResult
                ?.all_circle_members ??
              0
            ),

          total_legs:
            Number(
              summaryResult
                ?.total_legs ??
              0
            ),

          power_leg_members:
            Number(
              summaryResult
                ?.power_leg_members ??
              0
            ),

          other_legs_members:
            Number(
              summaryResult
                ?.other_legs_members ??
              0
            ),

          power_leg_referral_id:
            summaryResult
              ?.power_leg_referral_id ??
            null,

          power_leg_name:
            summaryResult
              ?.power_leg_name ??
            null,

          power_legs:
            Array.isArray(
              summaryResult?.power_legs
            )
              ? summaryResult.power_legs
              : [],
        });

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
        // ===============================================
        // SAVE REFERRAL INCOME
        // ===============================================

        const income =
          Number(
            referralResult
              ?.total_referral_income ??
            0
          );

<<<<<<< HEAD
        setReferralIncome(
=======

        setReferralIncome(

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
          Number.isFinite(income)
            ? income
            : 0
        );
<<<<<<< HEAD
      } catch (err) {
=======


      } catch (err) {

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
        console.error(
          "My Circle API Error:",
          err
        );

<<<<<<< HEAD
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load circle details."
        );
      } finally {
        setLoading(false);
=======

        setError(

          err instanceof Error

            ? err.message

            : "Unable to load circle details."
        );

      } finally {

        setLoading(false);

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
        setRefreshing(false);
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
    loadCircle();
  }, []);

=======

    loadCircle();

  }, []);


>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
  // =====================================================
  // AUTO REFRESH
  // =====================================================

  useEffect(() => {
<<<<<<< HEAD
    const interval =
      setInterval(
        () => {
          loadCircle(false);
=======

    const interval =
      setInterval(
        () => {

          loadCircle(false);

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
        },
        30000
      );

<<<<<<< HEAD
    return () => {
=======

    return () => {

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
      clearInterval(
        interval
      );
    };
<<<<<<< HEAD
  }, []);

=======

  }, []);


>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (
    date: string | null
  ) => {
<<<<<<< HEAD
    if (!date) {
      return "-";
    }

    const parsedDate =
      new Date(date);

=======

    if (!date) {

      return "-";
    }


    const parsedDate =
      new Date(date);


>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
<<<<<<< HEAD
      return date;
    }

=======

      return date;
    }


>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
    return parsedDate
      .toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",

          month: "short",

          year: "numeric",
        }
      );
  };

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
  // =====================================================
  // FORMAT MONEY
  // =====================================================

  const formatMoney = (
    amount: number
  ) => {
<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
    return Number.isFinite(
      amount
    )
      ? amount.toFixed(2)
      : "0.00";
  };

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
  // =====================================================
  // UI
  // =====================================================

  return (
<<<<<<< HEAD
    <>
      <UserNavbar />

      <div
        className="
          flex
          min-h-screen
          w-full
          bg-gradient-to-br
          from-[#FFF9FA]
          via-[#FDF3F5]
          to-white
          p-10
          text-gray-900
        "
      >
        <div className="flex min-w-0 flex-1 flex-col">

          <main
            className="
              flex-1
              bg-transparent
              p-4
              sm:p-6
              lg:p-8
            "
          >
=======

    <>

      <UserNavbar />


      <div className="flex min-h-screen w-full bg-gray-50 text-gray-900 p-10">

        <div className="flex min-w-0 flex-1 flex-col">


          <main className="flex-1 bg-gray-50 p-4 sm:p-6 lg:p-8">

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

            {/* =========================================== */}
            {/* PAGE HEADER */}
            {/* =========================================== */}

<<<<<<< HEAD
            <div
              className="
                mb-6
                flex
                flex-col
                gap-4
                sm:flex-row
                sm:items-center
                sm:justify-between
              "
            >
=======
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

              <div>

                <h1 className="text-2xl font-bold text-gray-900">
<<<<<<< HEAD
                  My Circle
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                  Track your direct referrals and their complete team size.
=======

                  My Circle

                </h1>


                <p className="mt-1 text-sm text-gray-500">

                  Track your direct referrals and their complete team size.

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                </p>

              </div>

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
              {/* ========================================= */}
              {/* HEADER BUTTONS */}
              {/* ========================================= */}

              <div className="flex flex-wrap items-center gap-3">

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                {/* MY ALL CIRCLE */}

                <button
                  type="button"
<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                  onClick={() =>
                    navigate(
                      "/myallcircle"
                    )
                  }
<<<<<<< HEAD
                  className="
                    flex
                    items-center
                    gap-2
                    rounded-xl
                    bg-[#B76E79]
                    px-4
                    py-2
                    text-sm
                    font-semibold
                    text-white
                    shadow-sm
                    shadow-[#B76E79]/20
                    transition
                    hover:bg-[#8F4F5A]
                  "
                >
=======

                  className="flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-purple-700"
                >

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                  <Network size={16} />

                  My All Circle

                  <ArrowRight size={16} />
<<<<<<< HEAD
                </button>

=======

                </button>


>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                {/* REFRESH */}

                <button
                  type="button"
<<<<<<< HEAD
                  onClick={() =>
                    loadCircle(false)
                  }
                  disabled={refreshing}
                  className={`
                    flex
                    items-center
                    gap-2
                    rounded-xl
                    border
                    border-[#D99AA3]/20
                    bg-white
                    px-4
                    py-2
                    text-sm
                    font-semibold
                    text-gray-700
                    shadow-sm
                    transition
                    hover:border-[#D99AA3]/40
                    hover:bg-[#FFF9FA]
                    ${
                      refreshing
                        ? "cursor-not-allowed opacity-60"
                        : "cursor-pointer"
                    }
                  `}
=======

                  onClick={() =>
                    loadCircle(false)
                  }

                  disabled={refreshing}

                  className={`flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-100 ${
                    refreshing
                      ? "cursor-not-allowed opacity-60"
                      : "cursor-pointer"
                  }`}
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                >

                  <RefreshCw
                    size={16}
<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                    className={
                      refreshing
                        ? "animate-spin"
                        : ""
                    }
                  />

                  Refresh

                </button>

              </div>

            </div>

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
            {/* =========================================== */}
            {/* SUMMARY */}
            {/* =========================================== */}

<<<<<<< HEAD
            <div
              className="
                mb-6
                grid
                grid-cols-1
                gap-5
                sm:grid-cols-2
                lg:grid-cols-4
              "
            >

              {/* REFERRAL INCOME */}

              <div
                className="
                  rounded-2xl
                  border
                  border-[#D99AA3]/25
                  bg-white
                  p-5
                  shadow-sm
                  shadow-[#B76E79]/5
                  transition
                  hover:-translate-y-0.5
                  hover:shadow-md
                "
              >

                <div className="flex items-center gap-3">

                  <div
                    className="
                      flex
                      h-11
                      w-11
                      items-center
                      justify-center
                      rounded-xl
                      bg-[#FFE5E8]
                      text-[#8F4F5A]
                    "
                  >
                    <DollarSign size={22} />
                  </div>

                  <div>

                    <p className="text-sm text-gray-500">
                      Total Referral Income
                    </p>

                    <h2 className="mt-1 text-2xl font-bold text-gray-900">
=======
            <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">


              {/* REFERRAL INCOME */}

              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

                <div className="flex items-center gap-3">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100 text-purple-600">

                    <DollarSign size={22} />

                  </div>


                  <div>

                    <p className="text-sm text-gray-500">

                      Total Referral Income

                    </p>


                    <h2 className="mt-1 text-2xl font-bold text-gray-900">

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                      {loading
                        ? "..."
                        : `$ ${formatMoney(
                            referralIncome
<<<<<<< HEAD
                          )}`}
=======
                          )}`
                      }

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                    </h2>

                  </div>

                </div>

              </div>

<<<<<<< HEAD
              {/* DIRECT MEMBERS */}

              <div
                className="
                  rounded-2xl
                  border
                  border-[#D99AA3]/25
                  bg-white
                  p-5
                  shadow-sm
                  shadow-[#B76E79]/5
                  transition
                  hover:-translate-y-0.5
                  hover:shadow-md
                "
              >

                <div className="flex items-center gap-3">

                  <div
                    className="
                      flex
                      h-11
                      w-11
                      items-center
                      justify-center
                      rounded-xl
                      bg-[#FFF0F2]
                      text-[#B76E79]
                    "
                  >
                    <Users size={22} />
                  </div>

                  <div>

                    <p className="text-sm text-gray-500">
                      My Circle
                    </p>

                    <h2 className="mt-1 text-2xl font-bold text-gray-900">
                      {loading
                        ? "..."
                        : circleSummary
                            .direct_members}
=======

              {/* DIRECT MEMBERS */}

              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

                <div className="flex items-center gap-3">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600">

                    <Users size={22} />

                  </div>


                  <div>

                    <p className="text-sm text-gray-500">

                      My Circle

                    </p>


                    <h2 className="mt-1 text-2xl font-bold text-gray-900">

                      {loading
                        ? "..."
                        : circleSummary
                            .direct_members
                      }

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                    </h2>

                  </div>

                </div>

              </div>

<<<<<<< HEAD
              {/* ALL CIRCLE */}

              <div
                className="
                  rounded-2xl
                  border
                  border-[#D99AA3]/25
                  bg-white
                  p-5
                  shadow-sm
                  shadow-[#B76E79]/5
                  transition
                  hover:-translate-y-0.5
                  hover:shadow-md
                "
              >

                <div className="flex items-center gap-3">

                  <div
                    className="
                      flex
                      h-11
                      w-11
                      items-center
                      justify-center
                      rounded-xl
                      bg-[#FFE5E8]
                      text-[#8F4F5A]
                    "
                  >
                    <Network size={22} />
                  </div>

                  <div>

                    <p className="text-sm text-gray-500">
                      My All Circle
                    </p>

                    <h2 className="mt-1 text-2xl font-bold text-gray-900">
                      {loading
                        ? "..."
                        : circleSummary
                            .all_circle_members}
=======

              {/* ALL CIRCLE */}

              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

                <div className="flex items-center gap-3">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">

                    <Network size={22} />

                  </div>


                  <div>

                    <p className="text-sm text-gray-500">

                      My All Circle

                    </p>


                    <h2 className="mt-1 text-2xl font-bold text-gray-900">

                      {loading
                        ? "..."
                        : circleSummary
                            .all_circle_members
                      }

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                    </h2>

                  </div>

                </div>

              </div>

<<<<<<< HEAD
              {/* POWER LEG */}

              <div
                className="
                  rounded-2xl
                  border
                  border-[#D99AA3]/25
                  bg-white
                  p-5
                  shadow-sm
                  shadow-[#B76E79]/5
                  transition
                  hover:-translate-y-0.5
                  hover:shadow-md
                "
              >

                <div className="flex items-center gap-3">

                  <div
                    className="
                      flex
                      h-11
                      w-11
                      items-center
                      justify-center
                      rounded-xl
                      bg-[#FFF0F2]
                      text-[#8F4F5A]
                    "
                  >
                    <Crown size={22} />
                  </div>

                  <div className="min-w-0">

                    <p className="text-sm text-gray-500">
                      Power Leg
                    </p>

                    <h2 className="mt-1 truncate text-xl font-bold text-gray-900">
=======

              {/* POWER LEG */}

              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

                <div className="flex items-center gap-3">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-100 text-yellow-600">

                    <Crown size={22} />

                  </div>


                  <div className="min-w-0">

                    <p className="text-sm text-gray-500">

                      Power Leg

                    </p>


                    <h2 className="mt-1 truncate text-xl font-bold text-gray-900">

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                      {loading
                        ? "..."
                        : circleSummary
                            .power_leg_name ||
<<<<<<< HEAD
                          "-"}
                    </h2>

=======
                          "-"
                      }

                    </h2>


>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                    {!loading &&
                      circleSummary
                        .power_leg_name && (

<<<<<<< HEAD
                        <p
                          className="
                            mt-1
                            text-xs
                            font-semibold
                            text-[#B76E79]
                          "
                        >
=======
                        <p className="mt-1 text-xs font-semibold text-yellow-600">

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                          {
                            circleSummary
                              .power_leg_members
                          }{" "}
                          Members
<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                        </p>

                      )}

                  </div>

                </div>

              </div>

            </div>

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
            {/* =========================================== */}
            {/* ERROR */}
            {/* =========================================== */}

            {!loading &&
              error && (

<<<<<<< HEAD
                <div
                  className="
                    mb-6
                    rounded-xl
                    border
                    border-[#D99AA3]/40
                    bg-[#FFE5E8]/60
                    p-4
                    text-sm
                    text-[#8F4F5A]
                  "
                >
                  {error}
=======
                <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">

                  {error}

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                </div>

              )}

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
            {/* =========================================== */}
            {/* MY CIRCLE TABLE */}
            {/* =========================================== */}

<<<<<<< HEAD
            <div
              className="
                overflow-hidden
                rounded-2xl
                border
                border-[#D99AA3]/25
                bg-white
                shadow-sm
                shadow-[#B76E79]/5
              "
            >

              {/* TABLE HEADER */}

              <div className="border-b border-[#D99AA3]/20 p-5">
=======
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">


              {/* TABLE HEADER */}

              <div className="border-b border-gray-200 p-5">
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

                <div className="flex items-center justify-between">

                  <div>

                    <h2 className="text-lg font-bold text-gray-900">
<<<<<<< HEAD
                      My Circle Details
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      Your direct referrals and complete team under each referral.
=======

                      My Circle Details

                    </h2>


                    <p className="mt-1 text-sm text-gray-500">

                      Your direct referrals and complete team under each referral.

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                    </p>

                  </div>

<<<<<<< HEAD
                  <Users
                    size={22}
                    className="text-[#B76E79]"
=======

                  <Users
                    size={22}
                    className="text-blue-600"
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                  />

                </div>

              </div>

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
              {/* LOADING */}

              {loading && (

                <div className="p-10 text-center">

                  <div className="flex justify-center">

                    <RefreshCw
                      size={25}
<<<<<<< HEAD
                      className="
                        animate-spin
                        text-[#B76E79]
                      "
=======
                      className="animate-spin text-blue-500"
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                    />

                  </div>

<<<<<<< HEAD
                  <p className="mt-3 text-sm text-gray-500">
                    Loading your circle...
=======

                  <p className="mt-3 text-sm text-gray-500">

                    Loading your circle...

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                  </p>

                </div>

              )}

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
              {/* EMPTY */}

              {!loading &&
                !error &&
                circleData
                  .members
                  .length === 0 && (

                  <div className="p-10 text-center">

                    <Users
                      size={35}
<<<<<<< HEAD
                      className="
                        mx-auto
                        mb-3
                        text-[#D99AA3]
                      "
                    />

                    <p className="text-sm font-medium text-gray-600">
                      No members in your circle yet.
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      Users who join directly through your referral will appear here.
=======
                      className="mx-auto mb-3 text-gray-300"
                    />


                    <p className="text-sm font-medium text-gray-600">

                      No members in your circle yet.

                    </p>


                    <p className="mt-1 text-xs text-gray-400">

                      Users who join directly through your referral will appear here.

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                    </p>

                  </div>

                )}

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
              {/* TABLE */}

              {!loading &&
                !error &&
                circleData
                  .members
                  .length > 0 && (

                  <div className="w-full overflow-x-auto">

                    <table className="w-full min-w-[1180px]">

<<<<<<< HEAD
                      <thead>

                        <tr className="bg-[#FFF9FA]">

                          <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                            Sr No
                          </th>

                          <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                            User
                          </th>

                          <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                            Customer ID
                          </th>

                          <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                            Referral ID
                          </th>

                          <th className="px-5 py-4 text-center text-xs font-bold uppercase tracking-wider text-gray-500">
                            Direct Team
                          </th>

                          <th className="px-5 py-4 text-center text-xs font-bold uppercase tracking-wider text-gray-500">
                            Total Team
                          </th>

                          <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                            Today Ads
                          </th>

                          <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                            Leg
                          </th>

                          <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                            Joined
=======

                      <thead>

                        <tr className="bg-gray-50">

                          <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">

                            Sr No

                          </th>


                          <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">

                            User

                          </th>


                          <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">

                            Customer ID

                          </th>


                          <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">

                            Referral ID

                          </th>


                          <th className="px-5 py-4 text-center text-xs font-bold uppercase tracking-wider text-gray-500">

                            Direct Team

                          </th>


                          <th className="px-5 py-4 text-center text-xs font-bold uppercase tracking-wider text-gray-500">

                            Total Team

                          </th>


                          <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">

                            Today Ads

                          </th>


                          <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">

                            Leg

                          </th>


                          <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">

                            Joined

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                          </th>

                        </tr>

                      </thead>

<<<<<<< HEAD
                      <tbody className="divide-y divide-[#D99AA3]/10">
=======

                      <tbody className="divide-y divide-gray-100">
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

                        {circleData
                          .members
                          .map(
                            (
                              member,
                              index
                            ) => (

                              <tr
                                key={
                                  member.user_id
                                }
<<<<<<< HEAD
                                className={`
                                  transition
                                  ${
                                    member
                                      .is_power_leg
                                      ? "bg-[#FFF0F2]/70 hover:bg-[#FFE5E8]/70"
                                      : "hover:bg-[#FFF9FA]"
                                  }
                                `}
                              >

                                {/* SR NO */}

                                <td className="px-5 py-4 text-sm font-medium text-gray-700">
                                  {index + 1}
                                </td>

=======

                                className={`transition ${
                                  member
                                    .is_power_leg

                                    ? "bg-yellow-50/40 hover:bg-yellow-50"

                                    : "hover:bg-gray-50"
                                }`}
                              >


                                {/* SR NO */}

                                <td className="px-5 py-4 text-sm font-medium text-gray-700">

                                  {index + 1}

                                </td>


>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                                {/* USER */}

                                <td className="px-5 py-4">

                                  <div className="flex items-center gap-3">

<<<<<<< HEAD
                                    <div
                                      className="
                                        flex
                                        h-9
                                        w-9
                                        shrink-0
                                        items-center
                                        justify-center
                                        rounded-full
                                        bg-[#FFE5E8]
                                        text-[#8F4F5A]
                                      "
                                    >
                                      <UserRound size={17} />
                                    </div>

                                    <div>

                                      <p className="font-semibold text-gray-900">
                                        {
                                          member.full_name
                                        }
                                      </p>

                                      <p className="mt-0.5 text-xs text-gray-400">
                                        Level 1
=======
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-purple-50 text-purple-600">

                                      <UserRound size={17} />

                                    </div>


                                    <div>

                                      <p className="font-semibold text-gray-900">

                                        {
                                          member.full_name
                                        }

                                      </p>


                                      <p className="mt-0.5 text-xs text-gray-400">

                                        Level 1

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                                      </p>

                                    </div>

                                  </div>

                                </td>

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                                {/* CUSTOMER ID */}

                                <td className="px-5 py-4">

<<<<<<< HEAD
                                  <span
                                    className="
                                      rounded-md
                                      bg-gray-100
                                      px-2.5
                                      py-1
                                      text-xs
                                      font-bold
                                      tracking-wide
                                      text-gray-700
                                    "
                                  >
=======
                                  <span className="rounded-md bg-gray-100 px-2.5 py-1 text-xs font-bold tracking-wide text-gray-700">

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                                    {
                                      member
                                        .customer_id ||
                                      "-"
                                    }
<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                                  </span>

                                </td>

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                                {/* REFERRAL ID */}

                                <td className="px-5 py-4">

<<<<<<< HEAD
                                  <span
                                    className="
                                      rounded-md
                                      bg-[#FFF0F2]
                                      px-2.5
                                      py-1
                                      text-xs
                                      font-bold
                                      tracking-wide
                                      text-[#8F4F5A]
                                    "
                                  >
=======
                                  <span className="rounded-md bg-blue-50 px-2.5 py-1 text-xs font-bold tracking-wide text-blue-600">

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                                    {
                                      member
                                        .referral_id ||
                                      "-"
                                    }
<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                                  </span>

                                </td>

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                                {/* DIRECT TEAM */}

                                <td className="px-5 py-4 text-center">

<<<<<<< HEAD
                                  <span
                                    className="
                                      inline-flex
                                      min-w-[42px]
                                      justify-center
                                      rounded-full
                                      bg-[#FFE5E8]
                                      px-3
                                      py-1
                                      text-sm
                                      font-bold
                                      text-[#8F4F5A]
                                    "
                                  >
=======
                                  <span className="inline-flex min-w-[42px] justify-center rounded-full bg-purple-50 px-3 py-1 text-sm font-bold text-purple-700">

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                                    {
                                      member
                                        .direct_team_count
                                    }
<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                                  </span>

                                </td>

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                                {/* TOTAL TEAM */}

                                <td className="px-5 py-4 text-center">

                                  <span className="text-base font-bold text-gray-900">
<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                                    {
                                      member
                                        .total_team_count
                                    }
<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                                  </span>

                                </td>

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                                {/* TODAY ADS */}

                                <td className="px-5 py-4">

                                  {member
                                    .ads_watched_today ? (

<<<<<<< HEAD
                                    <span
                                      className="
                                        inline-flex
                                        items-center
                                        rounded-full
                                        bg-[#FFE5E8]
                                        px-3
                                        py-1.5
                                        text-xs
                                        font-bold
                                        text-[#8F4F5A]
                                      "
                                    >
                                      Watched
=======
                                    <span className="inline-flex items-center rounded-full bg-green-50 px-3 py-1.5 text-xs font-bold text-green-600">

                                      Watched

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                                    </span>

                                  ) : (

<<<<<<< HEAD
                                    <span
                                      className="
                                        inline-flex
                                        items-center
                                        rounded-full
                                        bg-[#FFF0F2]
                                        px-3
                                        py-1.5
                                        text-xs
                                        font-bold
                                        text-[#B76E79]
                                      "
                                    >
                                      Not Watched
=======
                                    <span className="inline-flex items-center rounded-full bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600">

                                      Not Watched

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                                    </span>

                                  )}

                                </td>

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                                {/* LEG */}

                                <td className="px-5 py-4">

                                  {member
                                    .is_power_leg ? (

<<<<<<< HEAD
                                    <span
                                      className="
                                        inline-flex
                                        items-center
                                        gap-1.5
                                        rounded-full
                                        bg-[#FFE5E8]
                                        px-3
                                        py-1.5
                                        text-xs
                                        font-bold
                                        text-[#8F4F5A]
                                      "
                                    >
                                      <Crown size={14} />

                                      Power Leg
=======
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-100 px-3 py-1.5 text-xs font-bold text-yellow-700">

                                      <Crown size={14} />

                                      Power Leg

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                                    </span>

                                  ) : (

<<<<<<< HEAD
                                    <span
                                      className="
                                        inline-flex
                                        rounded-full
                                        bg-gray-100
                                        px-3
                                        py-1.5
                                        text-xs
                                        font-semibold
                                        text-gray-600
                                      "
                                    >
                                      Normal Leg
=======
                                    <span className="inline-flex rounded-full bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-600">

                                      Normal Leg

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                                    </span>

                                  )}

                                </td>

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                                {/* JOINED */}

                                <td className="px-5 py-4 text-sm text-gray-600">

                                  {formatDate(
                                    member.created_at
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

          </main>

        </div>
<<<<<<< HEAD
      </div>
    </>
  );
};

=======

      </div>

    </>

  );
};


>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
export default MyCircle;