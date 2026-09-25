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


// =========================================================
// API
// =========================================================

const API_URL = import.meta.env.VITE_API_URL;


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


interface MyCircleResponse {
  success: boolean;

  total: number;

  members: CircleMember[];
}


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


// =========================================================
// COMPONENT
// =========================================================

const MyCircle: React.FC = () => {

  const navigate = useNavigate();


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


  const [
    referralIncome,
    setReferralIncome,
  ] = useState<number>(0);


  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    refreshing,
    setRefreshing,
  ] = useState(false);


  const [
    error,
    setError,
  ] = useState("");


  // =====================================================
  // GET TOKEN
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
        localStorage.getItem(
          "user"
        );


      if (!storedUser) {

        return "";
      }


      const user =
        JSON.parse(
          storedUser
        );


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
  // CLEAR AUTH
  // =====================================================

  const clearAuthentication = () => {

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


  // =====================================================
  // LOAD CIRCLE
  // =====================================================

  const loadCircle =
    async (
      showLoader = true
    ) => {

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

          setError(
            "Login session not found. Please login again."
          );


          navigate(
            "/signin",
            {
              replace: true,
            }
          );


          return;
        }


        const headers = {

          Authorization:
            `Bearer ${token}`,

          "Content-Type":
            "application/json",
        };


        // ===============================================
        // LOAD ALL REQUIRED DATA TOGETHER
        // ===============================================

        const [
          circleResponse,
          summaryResponse,
          referralResponse,
        ] = await Promise.all([

          fetch(
            `${API_URL}/api/circle/my-circle`,
            {
              method: "GET",
              headers,
            }
          ),


          fetch(
            `${API_URL}/api/circle/summary`,
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

        ]);


        // ===============================================
        // AUTH EXPIRED
        // ===============================================

        if (
          circleResponse.status === 401 ||
          summaryResponse.status === 401 ||
          referralResponse.status === 401
        ) {

          clearAuthentication();


          setError(
            "Your login session has expired. Please login again."
          );


          setTimeout(
            () => {

              navigate(
                "/signin",
                {
                  replace: true,
                }
              );

            },
            500
          );


          return;
        }


        // ===============================================
        // JSON
        // ===============================================

        const circleResult =
          await circleResponse.json();


        const summaryResult =
          await summaryResponse.json();


        const referralResult =
          await referralResponse.json();


        console.log(
          "My Circle:",
          circleResult
        );


        console.log(
          "Circle Summary:",
          summaryResult
        );


        console.log(
          "Referral Summary:",
          referralResult
        );


        // ===============================================
        // ERRORS
        // ===============================================

        if (!circleResponse.ok) {

          throw new Error(

            circleResult?.detail ||

            circleResult?.message ||

            "Unable to load My Circle."
          );
        }


        if (!summaryResponse.ok) {

          throw new Error(

            summaryResult?.detail ||

            summaryResult?.message ||

            "Unable to load circle summary."
          );
        }


        if (!referralResponse.ok) {

          throw new Error(

            referralResult?.detail ||

            referralResult?.message ||

            "Unable to load referral income."
          );
        }


        // ===============================================
        // SAVE MY CIRCLE
        // ===============================================

        setCircleData({

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


        // ===============================================
        // SAVE SUMMARY
        // ===============================================

        setCircleSummary({

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


        // ===============================================
        // SAVE REFERRAL INCOME
        // ===============================================

        const income =
          Number(
            referralResult
              ?.total_referral_income ??
            0
          );


        setReferralIncome(

          Number.isFinite(income)
            ? income
            : 0
        );


      } catch (err) {

        console.error(
          "My Circle API Error:",
          err
        );


        setError(

          err instanceof Error

            ? err.message

            : "Unable to load circle details."
        );

      } finally {

        setLoading(false);

        setRefreshing(false);
      }
    };


  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {

    loadCircle();

  }, []);


  // =====================================================
  // AUTO REFRESH
  // =====================================================

  useEffect(() => {

    const interval =
      setInterval(
        () => {

          loadCircle(false);

        },
        30000
      );


    return () => {

      clearInterval(
        interval
      );
    };

  }, []);


  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (
    date: string | null
  ) => {

    if (!date) {

      return "-";
    }


    const parsedDate =
      new Date(date);


    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {

      return date;
    }


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


  // =====================================================
  // FORMAT MONEY
  // =====================================================

  const formatMoney = (
    amount: number
  ) => {

    return Number.isFinite(
      amount
    )
      ? amount.toFixed(2)
      : "0.00";
  };


  // =====================================================
  // UI
  // =====================================================

  return (

    <>

      <UserNavbar />


      <div className="flex min-h-screen w-full bg-gray-50 text-gray-900 p-10">

        <div className="flex min-w-0 flex-1 flex-col">


          <main className="flex-1 bg-gray-50 p-4 sm:p-6 lg:p-8">


            {/* =========================================== */}
            {/* PAGE HEADER */}
            {/* =========================================== */}

            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div>

                <h1 className="text-2xl font-bold text-gray-900">

                  My Circle

                </h1>


                <p className="mt-1 text-sm text-gray-500">

                  Track your direct referrals and their complete team size.

                </p>

              </div>


              {/* ========================================= */}
              {/* HEADER BUTTONS */}
              {/* ========================================= */}

              <div className="flex flex-wrap items-center gap-3">


                {/* MY ALL CIRCLE */}

                <button
                  type="button"

                  onClick={() =>
                    navigate(
                      "/myallcircle"
                    )
                  }

                  className="flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-purple-700"
                >

                  <Network size={16} />

                  My All Circle

                  <ArrowRight size={16} />

                </button>


                {/* REFRESH */}

                <button
                  type="button"

                  onClick={() =>
                    loadCircle(false)
                  }

                  disabled={refreshing}

                  className={`flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-100 ${
                    refreshing
                      ? "cursor-not-allowed opacity-60"
                      : "cursor-pointer"
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

            </div>


            {/* =========================================== */}
            {/* SUMMARY */}
            {/* =========================================== */}

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

                      {loading
                        ? "..."
                        : `$ ${formatMoney(
                            referralIncome
                          )}`
                      }

                    </h2>

                  </div>

                </div>

              </div>


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

                    </h2>

                  </div>

                </div>

              </div>


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

                    </h2>

                  </div>

                </div>

              </div>


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

                      {loading
                        ? "..."
                        : circleSummary
                            .power_leg_name ||
                          "-"
                      }

                    </h2>


                    {!loading &&
                      circleSummary
                        .power_leg_name && (

                        <p className="mt-1 text-xs font-semibold text-yellow-600">

                          {
                            circleSummary
                              .power_leg_members
                          }{" "}
                          Members

                        </p>

                      )}

                  </div>

                </div>

              </div>

            </div>


            {/* =========================================== */}
            {/* ERROR */}
            {/* =========================================== */}

            {!loading &&
              error && (

                <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">

                  {error}

                </div>

              )}


            {/* =========================================== */}
            {/* MY CIRCLE TABLE */}
            {/* =========================================== */}

            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">


              {/* TABLE HEADER */}

              <div className="border-b border-gray-200 p-5">

                <div className="flex items-center justify-between">

                  <div>

                    <h2 className="text-lg font-bold text-gray-900">

                      My Circle Details

                    </h2>


                    <p className="mt-1 text-sm text-gray-500">

                      Your direct referrals and complete team under each referral.

                    </p>

                  </div>


                  <Users
                    size={22}
                    className="text-blue-600"
                  />

                </div>

              </div>


              {/* LOADING */}

              {loading && (

                <div className="p-10 text-center">

                  <div className="flex justify-center">

                    <RefreshCw
                      size={25}
                      className="animate-spin text-blue-500"
                    />

                  </div>


                  <p className="mt-3 text-sm text-gray-500">

                    Loading your circle...

                  </p>

                </div>

              )}


              {/* EMPTY */}

              {!loading &&
                !error &&
                circleData
                  .members
                  .length === 0 && (

                  <div className="p-10 text-center">

                    <Users
                      size={35}
                      className="mx-auto mb-3 text-gray-300"
                    />


                    <p className="text-sm font-medium text-gray-600">

                      No members in your circle yet.

                    </p>


                    <p className="mt-1 text-xs text-gray-400">

                      Users who join directly through your referral will appear here.

                    </p>

                  </div>

                )}


              {/* TABLE */}

              {!loading &&
                !error &&
                circleData
                  .members
                  .length > 0 && (

                  <div className="w-full overflow-x-auto">

                    <table className="w-full min-w-[1180px]">


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

                          </th>

                        </tr>

                      </thead>


                      <tbody className="divide-y divide-gray-100">

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


                                {/* USER */}

                                <td className="px-5 py-4">

                                  <div className="flex items-center gap-3">

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

                                      </p>

                                    </div>

                                  </div>

                                </td>


                                {/* CUSTOMER ID */}

                                <td className="px-5 py-4">

                                  <span className="rounded-md bg-gray-100 px-2.5 py-1 text-xs font-bold tracking-wide text-gray-700">

                                    {
                                      member
                                        .customer_id ||
                                      "-"
                                    }

                                  </span>

                                </td>


                                {/* REFERRAL ID */}

                                <td className="px-5 py-4">

                                  <span className="rounded-md bg-blue-50 px-2.5 py-1 text-xs font-bold tracking-wide text-blue-600">

                                    {
                                      member
                                        .referral_id ||
                                      "-"
                                    }

                                  </span>

                                </td>


                                {/* DIRECT TEAM */}

                                <td className="px-5 py-4 text-center">

                                  <span className="inline-flex min-w-[42px] justify-center rounded-full bg-purple-50 px-3 py-1 text-sm font-bold text-purple-700">

                                    {
                                      member
                                        .direct_team_count
                                    }

                                  </span>

                                </td>


                                {/* TOTAL TEAM */}

                                <td className="px-5 py-4 text-center">

                                  <span className="text-base font-bold text-gray-900">

                                    {
                                      member
                                        .total_team_count
                                    }

                                  </span>

                                </td>


                                {/* TODAY ADS */}

                                <td className="px-5 py-4">

                                  {member
                                    .ads_watched_today ? (

                                    <span className="inline-flex items-center rounded-full bg-green-50 px-3 py-1.5 text-xs font-bold text-green-600">

                                      Watched

                                    </span>

                                  ) : (

                                    <span className="inline-flex items-center rounded-full bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600">

                                      Not Watched

                                    </span>

                                  )}

                                </td>


                                {/* LEG */}

                                <td className="px-5 py-4">

                                  {member
                                    .is_power_leg ? (

                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-100 px-3 py-1.5 text-xs font-bold text-yellow-700">

                                      <Crown size={14} />

                                      Power Leg

                                    </span>

                                  ) : (

                                    <span className="inline-flex rounded-full bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-600">

                                      Normal Leg

                                    </span>

                                  )}

                                </td>


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

      </div>

    </>

  );
};


export default MyCircle;