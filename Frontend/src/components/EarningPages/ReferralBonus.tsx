import React, {
  useEffect,
  useState,
} from "react";

import {
  
  Users,
  DollarSign,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Gift,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";
import UserNavbar from "../UserDashboard/UserNavbar";


// =========================================================
// TYPES
// =========================================================

interface ReferralSummary {
  success: boolean;

  total_referral_income:
  | string
  | number;

  first_subscription_income:
  | string
  | number;

  upgrade_income:
  | string
  | number;

  total_referral_transactions:
  number;
}


interface ReferralHistoryItem {
  id: number;

  source_user_id: number;

  source_customer_id: string;

  source_name: string;

  income_type: string;

  base_amount:
  | string
  | number;

  percentage:
  | string
  | number;

  referral_amount:
  | string
  | number;

  status: string;

  created_at: string;
}



// =========================================================
// API URL
// =========================================================

const API_URL =
  import.meta.env.VITE_API_URL;


// =========================================================
// COMPONENT
// =========================================================

const ReferralBonus: React.FC = () => {

  const navigate =
    useNavigate();


  // =====================================================
  // STATE
  // =====================================================

  const [
    summary,
    setSummary,
  ] = useState<ReferralSummary>({

    success: true,

    total_referral_income:
      "0.00",

    first_subscription_income:
      "0.00",

    upgrade_income:
      "0.00",

    total_referral_transactions:
      0,
  });


  const [
    referrals,
    setReferrals,
  ] = useState<
    ReferralHistoryItem[]
  >([]);


  // SPLIT REFERRAL HISTORY
  const firstSubscriptionReferrals = referrals.filter(
    (item) => String(item.income_type || '').toLowerCase() === 'first_subscription'
  );

  const upgradeReferrals = referrals.filter(
    (item) => String(item.income_type || '').toLowerCase() === 'upgrade'
  );

  const referralCount = firstSubscriptionReferrals.length;
  const upgradeCount = upgradeReferrals.length;


  const [
    loading,
    setLoading,
  ] = useState(true);


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
  // HANDLE SESSION EXPIRED
  // =====================================================

  const handleSessionExpired =
    () => {

      localStorage.removeItem(
        "access_token"
      );

      localStorage.removeItem(
        "refresh_token"
      );

      localStorage.removeItem(
        "user"
      );


      setError(
        "Your login session has expired. Please login again."
      );


      setTimeout(() => {

        navigate(
          "/signin",
          {
            replace: true,
          }
        );

      }, 500);
    };


  // =====================================================
  // LOAD REFERRAL DATA
  // =====================================================

  useEffect(() => {

    let isMounted = true;


    const loadReferralData =
      async () => {

        try {

          setLoading(true);

          setError("");


          // =============================================
          // TOKEN
          // =============================================

          const token =
            getToken();


          console.log(
            "Referral Token Found:",
            Boolean(token)
          );


          if (!token) {

            if (isMounted) {

              setError(
                "Login session not found. Please login again."
              );
            }

            return;
          }


          // =============================================
          // FETCH SUMMARY + HISTORY TOGETHER
          // =============================================

          const [
            summaryResponse,
            historyResponse,
          ] = await Promise.all([

            fetch(
              `${API_URL}/api/referral/summary`,
              {
                method: "GET",

                headers: {
                  Authorization:
                    `Bearer ${token}`,

                  "Content-Type":
                    "application/json",
                },
              }
            ),


            fetch(
              `${API_URL}/api/referral/history`,
              {
                method: "GET",

                headers: {
                  Authorization:
                    `Bearer ${token}`,

                  "Content-Type":
                    "application/json",
                },
              }
            ),

          ]);


          // =============================================
          // SESSION EXPIRED
          // =============================================

          if (
            summaryResponse.status ===
            401 ||
            historyResponse.status ===
            401
          ) {

            if (isMounted) {
              handleSessionExpired();
            }

            return;
          }


          // =============================================
          // JSON
          // =============================================

          const summaryResult =
            await summaryResponse.json();


          const historyResult =
            await historyResponse.json();


          console.log(
            "Referral Summary:",
            summaryResult
          );


          console.log(
            "Referral History:",
            historyResult
          );


          // =============================================
          // SUMMARY ERROR
          // =============================================

          if (
            !summaryResponse.ok
          ) {

            throw new Error(

              summaryResult?.detail ||

              summaryResult?.message ||

              "Unable to load referral summary."
            );
          }


          // =============================================
          // HISTORY ERROR
          // =============================================

          if (
            !historyResponse.ok
          ) {

            throw new Error(

              historyResult?.detail ||

              historyResult?.message ||

              "Unable to load referral history."
            );
          }


          // =============================================
          // SAVE DATA
          // =============================================

          if (isMounted) {

            setSummary({

              success:
                summaryResult?.success ??
                true,

              total_referral_income:
                summaryResult
                  ?.total_referral_income ??
                "0.00",

              first_subscription_income:
                summaryResult
                  ?.first_subscription_income ??
                "0.00",

              upgrade_income:
                summaryResult
                  ?.upgrade_income ??
                "0.00",

              total_referral_transactions:
                Number(
                  summaryResult
                    ?.total_referral_transactions ??
                  0
                ),
            });


            setReferrals(

              Array.isArray(
                historyResult?.items
              )

                ? historyResult.items

                : []
            );
          }

        } catch (err) {

          console.error(
            "Referral details error:",
            err
          );


          if (isMounted) {

            setError(

              err instanceof Error

                ? err.message

                : "Unable to load referral details."
            );
          }

        } finally {

          if (isMounted) {

            setLoading(false);
          }
        }
      };


    loadReferralData();


    return () => {

      isMounted = false;
    };

  }, [navigate]);


  // =====================================================
  // FORMAT MONEY
  // =====================================================

  const formatMoney = (
    amount:
      | string
      | number
  ) => {

    const value =
      Number(
        amount || 0
      );


    return Number.isFinite(
      value
    )

      ? value.toFixed(2)

      : "0.00";
  };


  // =====================================================
  // FORMAT PERCENTAGE
  // =====================================================

  const formatPercentage = (
    percentage:
      | string
      | number
  ) => {

    const value =
      Number(
        percentage || 0
      );


    if (
      !Number.isFinite(value)
    ) {

      return "0%";
    }


    return `${value.toFixed(
      value % 1 === 0
        ? 0
        : 2
    )}%`;
  };


  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (
    date: string
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
      .toLocaleString(
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
  // FORMAT INCOME TYPE
  // =====================================================

  const formatIncomeType = (
    incomeType: string
  ) => {

    const value =
      String(
        incomeType || ""
      ).toLowerCase();


    if (
      value ===
      "first_subscription"
    ) {

      return "First Subscription";
    }


    if (
      value ===
      "upgrade"
    ) {

      return "Upgrade";
    }


    return (
      incomeType || "-"
    );
  };


  // =====================================================
  // STATUS CLASS
  // =====================================================

  const getStatusClass = (
    status: string
  ) => {

    const value =
      String(
        status || ""
      ).toLowerCase();


    if (
      value === "credited"
    ) {

      return (
        "bg-green-50 " +
        "text-green-600"
      );
    }


    if (
      value === "reversed"
    ) {

      return (
        "bg-red-50 " +
        "text-red-600"
      );
    }


    return (
      "bg-yellow-50 " +
      "text-yellow-600"
    );
  };


  // =====================================================
  // STATUS ICON
  // =====================================================

  const getStatusIcon = (
    status: string
  ) => {

    const value =
      String(
        status || ""
      ).toLowerCase();


    if (
      value === "credited"
    ) {

      return (
        <CheckCircle2
          size={16}
          className="text-green-500"
        />
      );
    }


    if (
      value === "reversed"
    ) {

      return (
        <XCircle
          size={16}
          className="text-red-500"
        />
      );
    }


    return null;
  };


  // =====================================================
  // UI
  // =====================================================

  return (
    <>
    <UserNavbar/>
      <div
        className="
        flex
        min-h-screen
        w-full
        bg-gray-50
        text-gray-900
      "
      >

        <div
          className="
          flex
          min-w-0
          flex-1
          flex-col
        "
        >

          <main
            className="
            flex-1
            bg-gray-50
            p-4
            sm:p-6
            lg:p-8
          "
          >

            {/* ========================================= */}
            {/* BACK BUTTON */}
            {/* ========================================= */}




            {/* ========================================= */}
            {/* SUMMARY CARDS */}
            {/* ========================================= */}

            <div
              className="
              mb-6
              grid
              grid-cols-1
              gap-5
              sm:grid-cols-2
              xl:grid-cols-5
            "
            >

              {/* TOTAL REFERRAL INCOME */}

              <div
                className="
                rounded-2xl
                border
                border-gray-200
                bg-white
                p-5
                shadow-sm
              "
              >

                <div
                  className="
                  flex
                  items-center
                  gap-3
                "
                >

                  <div
                    className="
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-xl
                    bg-purple-100
                    text-purple-600
                  "
                  >

                    <DollarSign
                      size={22}
                    />

                  </div>


                  <div>

                    <p
                      className="
                      text-sm
                      text-gray-500
                    "
                    >

                      Total Referral Income

                    </p>


                    <h2
                      className="
                      mt-1
                      text-2xl
                      font-bold
                      text-gray-900
                    "
                    >

                      {loading

                        ? "..."

                        : `$ ${formatMoney(
                          summary
                            .total_referral_income
                        )}`
                      }

                    </h2>

                  </div>

                </div>

              </div>


              {/* FIRST SUBSCRIPTION INCOME */}

              <div
                className="
                rounded-2xl
                border
                border-gray-200
                bg-white
                p-5
                shadow-sm
              "
              >

                <div
                  className="
                  flex
                  items-center
                  gap-3
                "
                >

                  <div
                    className="
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-xl
                    bg-green-100
                    text-green-600
                  "
                  >

                    <Gift
                      size={22}
                    />

                  </div>


                  <div>

                    <p
                      className="
                      text-sm
                      text-gray-500
                    "
                    >

                      First Subscription

                    </p>


                    <h2
                      className="
                      mt-1
                      text-2xl
                      font-bold
                      text-gray-900
                    "
                    >

                      {loading

                        ? "..."

                        : `$ ${formatMoney(
                          summary
                            .first_subscription_income
                        )}`
                      }

                    </h2>

                  </div>

                </div>

              </div>


              {/* UPGRADE INCOME */}

              <div
                className="
                rounded-2xl
                border
                border-gray-200
                bg-white
                p-5
                shadow-sm
              "
              >

                <div
                  className="
                  flex
                  items-center
                  gap-3
                "
                >

                  <div
                    className="
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-xl
                    bg-blue-100
                    text-blue-600
                  "
                  >

                    <TrendingUp
                      size={22}
                    />

                  </div>


                  <div>

                    <p
                      className="
                      text-sm
                      text-gray-500
                    "
                    >

                      Upgrade Income

                    </p>


                    <h2
                      className="
                      mt-1
                      text-2xl
                      font-bold
                      text-gray-900
                    "
                    >

                      {loading

                        ? "..."

                        : `$ ${formatMoney(
                          summary
                            .upgrade_income
                        )}`
                      }

                    </h2>

                  </div>

                </div>

              </div>


              {/* REFERRAL COUNT */}

              <div
                className="
                rounded-2xl
                border
                border-gray-200
                bg-white
                p-5
                shadow-sm
              "
              >

                <div
                  className="
                  flex
                  items-center
                  gap-3
                "
                >

                  <div
                    className="
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-xl
                    bg-orange-100
                    text-orange-600
                  "
                  >

                    <Users
                      size={22}
                    />

                  </div>


                  <div>

                    <p
                      className="
                      text-sm
                      text-gray-500
                    "
                    >

                      Referral Count

                    </p>


                    <h2
                      className="
                      mt-1
                      text-2xl
                      font-bold
                      text-gray-900
                    "
                    >

                      {loading

                        ? "..."

                        : referralCount
                      }

                    </h2>

                  </div>

                </div>

              </div>



              {/* UPGRADE COUNT */}

              <div
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                    <TrendingUp size={22} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Upgrade Count</p>
                    <h2 className="mt-1 text-2xl font-bold text-gray-900">
                      {loading ? "..." : upgradeCount}
                    </h2>
                  </div>
                </div>
              </div>

            </div>


            {/* ========================================= */}
            {/* ERROR */}
            {/* ========================================= */}

            {!loading &&
              error && (

                <div
                  className="
                  mb-6
                  rounded-xl
                  border
                  border-red-200
                  bg-red-50
                  p-4
                  text-sm
                  text-red-600
                "
                >

                  {error}

                </div>
              )}


            {/* ========================================= */}
            {/* FIRST SUBSCRIPTION HISTORY */}
            {/* ========================================= */}

            <div
              className="
              overflow-hidden
              rounded-2xl
              border
              border-gray-200
              bg-white
              shadow-sm
            "
            >

              {/* HEADER */}

              <div
                className="
                border-b
                border-gray-200
                p-5
              "
              >

                <div
                  className="
                  flex
                  items-center
                  justify-between
                "
                >

                  <div>

                    <h2
                      className="
                      text-lg
                      font-bold
                      text-gray-900
                    "
                    >

                      First Subscription History

                    </h2>


                    <p
                      className="
                      mt-1
                      text-sm
                      text-gray-500
                    "
                    >

                      Detailed history of referral
                      income generated by your
                      direct referrals.

                    </p>

                  </div>


                  <Users
                    size={22}
                    className="text-blue-600"
                  />

                </div>

              </div>


              {/* ======================================= */}
              {/* LOADING */}
              {/* ======================================= */}

              {loading && (

                <div
                  className="
                  p-10
                  text-center
                "
                >

                  <p
                    className="
                    text-sm
                    text-gray-500
                  "
                  >

                    Loading referral income
                    details...

                  </p>

                </div>
              )}


              {/* ======================================= */}
              {/* EMPTY */}
              {/* ======================================= */}

              {!loading &&
                !error &&
                firstSubscriptionReferrals.length === 0 && (

                  <div
                    className="
                    p-10
                    text-center
                  "
                  >

                    <Users
                      size={35}
                      className="
                      mx-auto
                      mb-3
                      text-gray-300
                    "
                    />


                    <p
                      className="
                      text-sm
                      font-medium
                      text-gray-600
                    "
                    >

                      No first subscription referral income yet.

                    </p>


                    <p
                      className="
                      mt-1
                      text-xs
                      text-gray-400
                    "
                    >

                      Your referral income
                      transactions will appear
                      here.

                    </p>

                  </div>
                )}


              {/* ======================================= */}
              {/* TABLE */}
              {/* ======================================= */}

              {!loading &&
                !error &&
                firstSubscriptionReferrals.length > 0 && (

                  <div
                    className="
                    w-full
                    overflow-x-auto
                  "
                  >

                    <table
                      className="
                      w-full
                      min-w-[1150px]
                    "
                    >

                      <thead>

                        <tr
                          className="
                          bg-gray-50
                        "
                        >

                          <th
                            className="
                            px-5
                            py-4
                            text-left
                            text-xs
                            font-bold
                            uppercase
                            tracking-wider
                            text-gray-500
                          "
                          >
                            Sr No
                          </th>


                          <th
                            className="
                            px-5
                            py-4
                            text-left
                            text-xs
                            font-bold
                            uppercase
                            tracking-wider
                            text-gray-500
                          "
                          >
                            User Name
                          </th>


                          <th
                            className="
                            px-5
                            py-4
                            text-left
                            text-xs
                            font-bold
                            uppercase
                            tracking-wider
                            text-gray-500
                          "
                          >
                            Customer ID
                          </th>


                          <th
                            className="
                            px-5
                            py-4
                            text-left
                            text-xs
                            font-bold
                            uppercase
                            tracking-wider
                            text-gray-500
                          "
                          >
                            Type
                          </th>


                          <th
                            className="
                            px-5
                            py-4
                            text-left
                            text-xs
                            font-bold
                            uppercase
                            tracking-wider
                            text-gray-500
                          "
                          >
                            Base Amount
                          </th>


                          <th
                            className="
                            px-5
                            py-4
                            text-left
                            text-xs
                            font-bold
                            uppercase
                            tracking-wider
                            text-gray-500
                          "
                          >
                            Rate
                          </th>


                          <th
                            className="
                            px-5
                            py-4
                            text-left
                            text-xs
                            font-bold
                            uppercase
                            tracking-wider
                            text-gray-500
                          "
                          >
                            Referral Amount
                          </th>


                          <th
                            className="
                            px-5
                            py-4
                            text-left
                            text-xs
                            font-bold
                            uppercase
                            tracking-wider
                            text-gray-500
                          "
                          >
                            Status
                          </th>


                          <th
                            className="
                            px-5
                            py-4
                            text-left
                            text-xs
                            font-bold
                            uppercase
                            tracking-wider
                            text-gray-500
                          "
                          >
                            Date
                          </th>

                        </tr>

                      </thead>


                      <tbody
                        className="
                        divide-y
                        divide-gray-100
                      "
                      >

                        {firstSubscriptionReferrals.map(
                          (
                            referral,
                            index
                          ) => (

                            <tr
                              key={
                                referral.id
                              }

                              className="
                              transition
                              hover:bg-gray-50
                            "
                            >

                              {/* SR NO */}

                              <td
                                className="
                                px-5
                                py-4
                                text-sm
                                font-medium
                                text-gray-700
                              "
                              >

                                {index + 1}

                              </td>


                              {/* USER */}

                              <td
                                className="
                                px-5
                                py-4
                                text-sm
                                font-semibold
                                text-gray-900
                              "
                              >

                                {referral
                                  .source_name ||
                                  "-"
                                }

                              </td>


                              {/* CUSTOMER ID */}

                              <td
                                className="
                                px-5
                                py-4
                              "
                              >

                                <span
                                  className="
                                  rounded-md
                                  bg-purple-50
                                  px-2.5
                                  py-1
                                  text-xs
                                  font-bold
                                  tracking-wide
                                  text-purple-600
                                "
                                >

                                  {referral
                                    .source_customer_id ||
                                    "-"
                                  }

                                </span>

                              </td>


                              {/* TYPE */}

                              <td
                                className="
                                px-5
                                py-4
                              "
                              >

                                <span
                                  className={`
                                  inline-flex
                                  rounded-full
                                  px-3
                                  py-1
                                  text-xs
                                  font-semibold

                                  ${referral
                                      .income_type ===
                                      "first_subscription"

                                      ? "bg-green-50 text-green-600"

                                      : "bg-blue-50 text-blue-600"
                                    }
                                `}
                                >

                                  {formatIncomeType(
                                    referral
                                      .income_type
                                  )}

                                </span>

                              </td>


                              {/* BASE AMOUNT */}

                              <td
                                className="
                                px-5
                                py-4
                                text-sm
                                font-semibold
                                text-gray-700
                              "
                              >

                                $
                                {formatMoney(
                                  referral
                                    .base_amount
                                )}

                              </td>


                              {/* RATE */}

                              <td
                                className="
                                px-5
                                py-4
                                text-sm
                                font-bold
                                text-purple-600
                              "
                              >

                                {formatPercentage(
                                  referral
                                    .percentage
                                )}

                              </td>


                              {/* REFERRAL AMOUNT */}

                              <td
                                className="
                                px-5
                                py-4
                                text-sm
                                font-bold
                                text-green-600
                              "
                              >

                                +$
                                {formatMoney(
                                  referral
                                    .referral_amount
                                )}

                              </td>


                              {/* STATUS */}

                              <td
                                className="
                                px-5
                                py-4
                              "
                              >

                                <span
                                  className={`
                                  inline-flex
                                  items-center
                                  gap-1.5
                                  rounded-full
                                  px-3
                                  py-1
                                  text-xs
                                  font-semibold
                                  capitalize

                                  ${getStatusClass(
                                    referral.status
                                  )}
                                `}
                                >

                                  {getStatusIcon(
                                    referral.status
                                  )}

                                  {referral.status ||
                                    "-"
                                  }

                                </span>

                              </td>


                              {/* DATE */}

                              <td
                                className="
                                px-5
                                py-4
                                text-sm
                                text-gray-600
                                whitespace-nowrap
                              "
                              >

                                {formatDate(
                                  referral
                                    .created_at
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


            <div className="mt-6">
            {/* ========================================= */}
            {/* UPGRADE HISTORY */}
            {/* ========================================= */}

            <div
              className="
              overflow-hidden
              rounded-2xl
              border
              border-gray-200
              bg-white
              shadow-sm
            "
            >

              {/* HEADER */}

              <div
                className="
                border-b
                border-gray-200
                p-5
              "
              >

                <div
                  className="
                  flex
                  items-center
                  justify-between
                "
                >

                  <div>

                    <h2
                      className="
                      text-lg
                      font-bold
                      text-gray-900
                    "
                    >

                      Upgrade History

                    </h2>


                    <p
                      className="
                      mt-1
                      text-sm
                      text-gray-500
                    "
                    >

                      Detailed history of referral
                      income generated by your
                      direct referrals.

                    </p>

                  </div>


                  <Users
                    size={22}
                    className="text-blue-600"
                  />

                </div>

              </div>


              {/* ======================================= */}
              {/* LOADING */}
              {/* ======================================= */}

              {loading && (

                <div
                  className="
                  p-10
                  text-center
                "
                >

                  <p
                    className="
                    text-sm
                    text-gray-500
                  "
                  >

                    Loading referral income
                    details...

                  </p>

                </div>
              )}


              {/* ======================================= */}
              {/* EMPTY */}
              {/* ======================================= */}

              {!loading &&
                !error &&
                upgradeReferrals.length === 0 && (

                  <div
                    className="
                    p-10
                    text-center
                  "
                  >

                    <Users
                      size={35}
                      className="
                      mx-auto
                      mb-3
                      text-gray-300
                    "
                    />


                    <p
                      className="
                      text-sm
                      font-medium
                      text-gray-600
                    "
                    >

                      No referral upgrade income yet.

                    </p>


                    <p
                      className="
                      mt-1
                      text-xs
                      text-gray-400
                    "
                    >

                      Your referral income
                      transactions will appear
                      here.

                    </p>

                  </div>
                )}


              {/* ======================================= */}
              {/* TABLE */}
              {/* ======================================= */}

              {!loading &&
                !error &&
                upgradeReferrals.length > 0 && (

                  <div
                    className="
                    w-full
                    overflow-x-auto
                  "
                  >

                    <table
                      className="
                      w-full
                      min-w-[1150px]
                    "
                    >

                      <thead>

                        <tr
                          className="
                          bg-gray-50
                        "
                        >

                          <th
                            className="
                            px-5
                            py-4
                            text-left
                            text-xs
                            font-bold
                            uppercase
                            tracking-wider
                            text-gray-500
                          "
                          >
                            Sr No
                          </th>


                          <th
                            className="
                            px-5
                            py-4
                            text-left
                            text-xs
                            font-bold
                            uppercase
                            tracking-wider
                            text-gray-500
                          "
                          >
                            User Name
                          </th>


                          <th
                            className="
                            px-5
                            py-4
                            text-left
                            text-xs
                            font-bold
                            uppercase
                            tracking-wider
                            text-gray-500
                          "
                          >
                            Customer ID
                          </th>


                          <th
                            className="
                            px-5
                            py-4
                            text-left
                            text-xs
                            font-bold
                            uppercase
                            tracking-wider
                            text-gray-500
                          "
                          >
                            Type
                          </th>


                          <th
                            className="
                            px-5
                            py-4
                            text-left
                            text-xs
                            font-bold
                            uppercase
                            tracking-wider
                            text-gray-500
                          "
                          >
                            Base Amount
                          </th>


                          <th
                            className="
                            px-5
                            py-4
                            text-left
                            text-xs
                            font-bold
                            uppercase
                            tracking-wider
                            text-gray-500
                          "
                          >
                            Rate
                          </th>


                          <th
                            className="
                            px-5
                            py-4
                            text-left
                            text-xs
                            font-bold
                            uppercase
                            tracking-wider
                            text-gray-500
                          "
                          >
                            Referral Amount
                          </th>


                          <th
                            className="
                            px-5
                            py-4
                            text-left
                            text-xs
                            font-bold
                            uppercase
                            tracking-wider
                            text-gray-500
                          "
                          >
                            Status
                          </th>


                          <th
                            className="
                            px-5
                            py-4
                            text-left
                            text-xs
                            font-bold
                            uppercase
                            tracking-wider
                            text-gray-500
                          "
                          >
                            Date
                          </th>

                        </tr>

                      </thead>


                      <tbody
                        className="
                        divide-y
                        divide-gray-100
                      "
                      >

                        {upgradeReferrals.map(
                          (
                            referral,
                            index
                          ) => (

                            <tr
                              key={
                                referral.id
                              }

                              className="
                              transition
                              hover:bg-gray-50
                            "
                            >

                              {/* SR NO */}

                              <td
                                className="
                                px-5
                                py-4
                                text-sm
                                font-medium
                                text-gray-700
                              "
                              >

                                {index + 1}

                              </td>


                              {/* USER */}

                              <td
                                className="
                                px-5
                                py-4
                                text-sm
                                font-semibold
                                text-gray-900
                              "
                              >

                                {referral
                                  .source_name ||
                                  "-"
                                }

                              </td>


                              {/* CUSTOMER ID */}

                              <td
                                className="
                                px-5
                                py-4
                              "
                              >

                                <span
                                  className="
                                  rounded-md
                                  bg-purple-50
                                  px-2.5
                                  py-1
                                  text-xs
                                  font-bold
                                  tracking-wide
                                  text-purple-600
                                "
                                >

                                  {referral
                                    .source_customer_id ||
                                    "-"
                                  }

                                </span>

                              </td>


                              {/* TYPE */}

                              <td
                                className="
                                px-5
                                py-4
                              "
                              >

                                <span
                                  className={`
                                  inline-flex
                                  rounded-full
                                  px-3
                                  py-1
                                  text-xs
                                  font-semibold

                                  ${referral
                                      .income_type ===
                                      "first_subscription"

                                      ? "bg-green-50 text-green-600"

                                      : "bg-blue-50 text-blue-600"
                                    }
                                `}
                                >

                                  {formatIncomeType(
                                    referral
                                      .income_type
                                  )}

                                </span>

                              </td>


                              {/* BASE AMOUNT */}

                              <td
                                className="
                                px-5
                                py-4
                                text-sm
                                font-semibold
                                text-gray-700
                              "
                              >

                                $
                                {formatMoney(
                                  referral
                                    .base_amount
                                )}

                              </td>


                              {/* RATE */}

                              <td
                                className="
                                px-5
                                py-4
                                text-sm
                                font-bold
                                text-purple-600
                              "
                              >

                                {formatPercentage(
                                  referral
                                    .percentage
                                )}

                              </td>


                              {/* REFERRAL AMOUNT */}

                              <td
                                className="
                                px-5
                                py-4
                                text-sm
                                font-bold
                                text-green-600
                              "
                              >

                                +$
                                {formatMoney(
                                  referral
                                    .referral_amount
                                )}

                              </td>


                              {/* STATUS */}

                              <td
                                className="
                                px-5
                                py-4
                              "
                              >

                                <span
                                  className={`
                                  inline-flex
                                  items-center
                                  gap-1.5
                                  rounded-full
                                  px-3
                                  py-1
                                  text-xs
                                  font-semibold
                                  capitalize

                                  ${getStatusClass(
                                    referral.status
                                  )}
                                `}
                                >

                                  {getStatusIcon(
                                    referral.status
                                  )}

                                  {referral.status ||
                                    "-"
                                  }

                                </span>

                              </td>


                              {/* DATE */}

                              <td
                                className="
                                px-5
                                py-4
                                text-sm
                                text-gray-600
                                whitespace-nowrap
                              "
                              >

                                {formatDate(
                                  referral
                                    .created_at
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

            </div>

          </main>

        </div>

      </div>
    </>
  );
};


export default ReferralBonus;