import React, {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import {
  User,
  Copy,
  Check,
  Share2,
  CalendarDays,
  UserRoundCheck,
  BadgeDollarSign,
  ShieldCheck,
  Link2,
  CircleCheckBig,
  CircleX,
  Wallet,
} from "lucide-react";

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
// =====================================================
// API URL
// =====================================================

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:8000";

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
// =====================================================
// USER DETAILS
// =====================================================

interface UserDetails {
  id: number;
  full_name: string;
  email: string;
  customer_id: string;
  referral_code: string;
  sponsor_id: string | null;
  sponsor_name: string | null;
  joining_date: string;
  is_active: boolean;
  role: string;
  subscription_status: string;
  subscription_amount: number | null;
}

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
interface UserDetailsResponse {
  success: boolean;
  user: UserDetails;
}

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
// =====================================================
// SUBSCRIPTION
// =====================================================

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
// =====================================================
// INCOME WALLET
// =====================================================

interface IncomeWalletData {
  success: boolean;

  balance: string | number;

  total_earned: string | number;

  total_withdrawn: string | number;
}

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
// =====================================================
// COMPONENT
// =====================================================

const UserDetailsCard: React.FC = () => {
<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
  // ===================================================
  // STATES
  // ===================================================

<<<<<<< HEAD
  const [userDetails, setUserDetails] =
    useState<UserDetails | null>(null);

  const [subscription, setSubscription] =
    useState<SubscriptionData | null>(null);

  const [incomeWallet, setIncomeWallet] =
    useState<IncomeWalletData | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [copied, setCopied] =
    useState(false);

=======
  const [
    userDetails,
    setUserDetails,
  ] =
    useState<UserDetails | null>(
      null
    );


  const [
    subscription,
    setSubscription,
  ] =
    useState<SubscriptionData | null>(
      null
    );


  const [
    incomeWallet,
    setIncomeWallet,
  ] =
    useState<IncomeWalletData | null>(
      null
    );


  const [
    loading,
    setLoading,
  ] =
    useState(true);


  const [
    error,
    setError,
  ] =
    useState("");


  const [
    copied,
    setCopied,
  ] =
    useState(false);


>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
  // =====================================================
  // LOAD USER + SUBSCRIPTION + INCOME WALLET
  // =====================================================

  useEffect(() => {
<<<<<<< HEAD
    let isMounted = true;

    const loadUserDetails = async () => {
      try {
        setLoading(true);
        setError("");

        // =============================================
        // TOKEN
        // =============================================

        const token =
          localStorage.getItem("access_token");

        if (!token) {
          if (isMounted) {
            setError(
              "Your login session was not found."
            );
          }

          return;
        }

        const headers = {
          Authorization: `Bearer ${token}`,
        };

        // =============================================
        // LOAD ALL DATA TOGETHER
        // =============================================

        const [
          userResponse,
          subscriptionResponse,
          incomeWalletResponse,
        ] = await Promise.all([
          // -----------------------------------------
          // USER DETAILS
          // -----------------------------------------

          axios.get<UserDetailsResponse>(
            `${API_URL}/api/user/details`,
            {
              headers,
            }
          ),

          // -----------------------------------------
          // CURRENT SUBSCRIPTION
          // -----------------------------------------

          axios.get<SubscriptionData>(
            `${API_URL}/api/subscription/current`,
            {
              headers,
            }
          ),

          // -----------------------------------------
          // INCOME WALLET
          // -----------------------------------------

          axios.get<IncomeWalletData>(
            `${API_URL}/api/income-wallet`,
            {
              headers,
            }
          ),
        ]);

        // =============================================
        // USER DETAILS CHECK
        // =============================================

        if (
          !userResponse.data.success ||
          !userResponse.data.user
        ) {
          if (isMounted) {
=======

    let isMounted = true;


    const loadUserDetails =
      async () => {

        try {

          setLoading(true);

          setError("");


          // =============================================
          // TOKEN
          // =============================================

          const token =
            localStorage.getItem(
              "access_token"
            );


          if (!token) {

            if (isMounted) {

              setError(
                "Your login session was not found."
              );
            }

            return;
          }


          const headers = {
            Authorization:
              `Bearer ${token}`,
          };


          // =============================================
          // LOAD ALL DATA TOGETHER
          // =============================================

          const [
            userResponse,
            subscriptionResponse,
            incomeWalletResponse,
          ] =
            await Promise.all([

              // -----------------------------------------
              // USER DETAILS
              // -----------------------------------------

              axios.get<UserDetailsResponse>(
                `${API_URL}/api/user/details`,
                {
                  headers,
                }
              ),


              // -----------------------------------------
              // CURRENT SUBSCRIPTION
              // -----------------------------------------

              axios.get<SubscriptionData>(
                `${API_URL}/api/subscription/current`,
                {
                  headers,
                }
              ),


              // -----------------------------------------
              // INCOME WALLET
              // -----------------------------------------

              axios.get<IncomeWalletData>(
                `${API_URL}/api/income-wallet`,
                {
                  headers,
                }
              ),

            ]);


          // =============================================
          // USER DETAILS CHECK
          // =============================================

          if (
            !userResponse.data.success ||
            !userResponse.data.user
          ) {

            if (isMounted) {

              setError(
                "Unable to load user details."
              );
            }

            return;
          }


          if (!isMounted) {
            return;
          }


          // =============================================
          // SET USER
          // =============================================

          setUserDetails(
            userResponse.data.user
          );


          // =============================================
          // SET SUBSCRIPTION
          // =============================================

          setSubscription(
            subscriptionResponse.data
          );


          // =============================================
          // SET INCOME WALLET
          // =============================================

          setIncomeWallet(
            incomeWalletResponse.data
          );


        } catch (err) {

          console.error(
            "User details error:",
            err
          );


          if (!isMounted) {
            return;
          }


          if (
            axios.isAxiosError(err)
          ) {

            setError(

              err.response?.data?.detail ||

              "Unable to load user details."
            );

          } else {

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
            setError(
              "Unable to load user details."
            );
          }

<<<<<<< HEAD
          return;
        }

        if (!isMounted) {
          return;
        }

        // =============================================
        // SET USER
        // =============================================

        setUserDetails(
          userResponse.data.user
        );

        // =============================================
        // SET SUBSCRIPTION
        // =============================================

        setSubscription(
          subscriptionResponse.data
        );

        // =============================================
        // SET INCOME WALLET
        // =============================================

        setIncomeWallet(
          incomeWalletResponse.data
        );
      } catch (err) {
        console.error(
          "User details error:",
          err
        );

        if (!isMounted) {
          return;
        }

        if (axios.isAxiosError(err)) {
          setError(
            err.response?.data?.detail ||
              "Unable to load user details."
          );
        } else {
          setError(
            "Unable to load user details."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadUserDetails();

    return () => {
      isMounted = false;
    };
  }, []);

=======

        } finally {

          if (isMounted) {

            setLoading(false);
          }
        }
      };


    loadUserDetails();


    return () => {

      isMounted = false;
    };

  }, []);


>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
  // =====================================================
  // REAL SUBSCRIPTION VALUES
  // =====================================================

  const subscriptionAmount =
    Number(
<<<<<<< HEAD
      subscription?.current_amount || 0
    );

  const subscriptionActive =
    Boolean(
      subscription?.subscription_active
    ) && subscriptionAmount > 0;
=======
      subscription?.current_amount ||
      0
    );


  const subscriptionActive =
    Boolean(
      subscription
        ?.subscription_active
    ) &&
    subscriptionAmount > 0;

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

  const subscriptionStatus =
    subscriptionActive
      ? "ACTIVE"
      : "INACTIVE";

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
  // =====================================================
  // REAL TOTAL INCOME
  //
  // This comes directly from Income Wallet balance.
  // No frontend calculation.
  // =====================================================

  const totalIncome =
    Number(
<<<<<<< HEAD
      incomeWallet?.balance || 0
    );

=======
      incomeWallet?.balance ||
      0
    );


>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
  // =====================================================
  // REFERRAL LINK
  // =====================================================

  const referralLink =
    userDetails?.referral_code
<<<<<<< HEAD
      ? `https://www.adspromohub.com/register/${encodeURIComponent(
          userDetails.referral_code
        )}`
      : "";

=======

      ? `https://www.adspromohub.com/register/${encodeURIComponent(
          userDetails.referral_code
        )}`

      : "";


>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
  // =====================================================
  // COPY REFERRAL LINK
  // =====================================================

<<<<<<< HEAD
  const handleCopy = async () => {
    if (!referralLink) {
      return;
    }

    try {
      await navigator.clipboard.writeText(
        referralLink
      );

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error(
        "Referral copy failed:",
        err
      );
    }
  };
=======
  const handleCopy =
    async () => {

      if (!referralLink) {
        return;
      }


      try {

        await navigator
          .clipboard
          .writeText(
            referralLink
          );


        setCopied(true);


        window.setTimeout(
          () => {

            setCopied(false);

          },
          2000
        );


      } catch (err) {

        console.error(
          "Referral copy failed:",
          err
        );
      }
    };

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

  // =====================================================
  // SHARE REFERRAL LINK
  // =====================================================

<<<<<<< HEAD
  const handleShare = async () => {
    if (!referralLink) {
      return;
    }

    try {
      if (navigator.share) {
        await navigator.share({
          title: "Join AdsPromoHub",
          text: "Join AdsPromoHub using my referral link.",
          url: referralLink,
        });

        return;
      }

      await handleCopy();
    } catch (err) {
      console.error(
        "Referral share failed:",
        err
      );
    }
  };
=======
  const handleShare =
    async () => {

      if (!referralLink) {
        return;
      }


      try {

        if (
          navigator.share
        ) {

          await navigator.share({

            title:
              "Join AdsPromoHub",

            text:
              "Join AdsPromoHub using my referral link.",

            url:
              referralLink,
          });


          return;
        }


        await handleCopy();


      } catch (err) {

        console.error(
          "Referral share failed:",
          err
        );
      }
    };

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

  // =====================================================
  // DATE FORMAT
  // =====================================================

  const formatJoiningDate = (
    date: string
  ) => {
<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
    if (!date) {
      return "--";
    }

<<<<<<< HEAD
    const parsedDate = new Date(date);
=======

    const parsedDate =
      new Date(date);

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
<<<<<<< HEAD
      return "--";
    }

    return new Intl.DateTimeFormat(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    ).format(parsedDate);
  };

=======

      return "--";
    }


    return new Intl
      .DateTimeFormat(
        "en-IN",
        {
          day:
            "2-digit",

          month:
            "short",

          year:
            "numeric",
        }
      )
      .format(
        parsedDate
      );
  };


>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
<<<<<<< HEAD
    return (
      <div className="mb-12 sm:mb-16">
=======

    return (

      <div className="mb-12 sm:mb-16">

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
        <div
          className="
            animate-pulse
            rounded-3xl
            border
<<<<<<< HEAD
            border-[#D99AA3]/20
            bg-[#FFF9FA]
            p-5
            shadow-[0_15px_50px_rgba(183,110,121,0.08)]
=======
            border-slate-200
            bg-white
            p-5
            shadow-[0_15px_50px_rgba(15,23,42,0.08)]
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
            sm:p-7
            lg:p-8
          "
        >
<<<<<<< HEAD
          <div className="flex items-center gap-4">
=======

          <div className="flex items-center gap-4">

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
            <div
              className="
                h-14
                w-14
                rounded-2xl
<<<<<<< HEAD
                bg-[#D99AA3]/20
              "
            />

            <div className="flex-1">
=======
                bg-slate-200
              "
            />


            <div className="flex-1">

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
              <div
                className="
                  h-4
                  w-24
                  rounded
<<<<<<< HEAD
                  bg-[#D99AA3]/20
                "
              />

=======
                  bg-slate-200
                "
              />


>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
              <div
                className="
                  mt-3
                  h-6
                  w-48
                  max-w-full
                  rounded
<<<<<<< HEAD
                  bg-[#D99AA3]/20
                "
              />
            </div>
          </div>

=======
                  bg-slate-200
                "
              />

            </div>

          </div>


>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
          {/* ========================================= */}
          {/* 5 LOADING CARDS */}
          {/* ========================================= */}

          <div
            className="
              mt-7
              grid
              gap-3
              sm:grid-cols-2
              lg:grid-cols-5
            "
          >
<<<<<<< HEAD
            {[1, 2, 3, 4, 5].map(
              (item) => (
=======

            {[1, 2, 3, 4, 5].map(
              (item) => (

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                <div
                  key={item}
                  className="
                    h-28
                    rounded-2xl
<<<<<<< HEAD
                    bg-[#D99AA3]/10
                  "
                />
              )
            )}
          </div>

=======
                    bg-slate-100
                  "
                />

              )
            )}

          </div>


>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
          <div
            className="
              mt-4
              h-24
              rounded-2xl
<<<<<<< HEAD
              bg-[#D99AA3]/10
            "
          />
        </div>
=======
              bg-slate-100
            "
          />

        </div>

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
      </div>
    );
  }

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
<<<<<<< HEAD
    return (
      <div className="mb-12 sm:mb-16">
=======

    return (

      <div className="mb-12 sm:mb-16">

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
        <div
          className="
            flex
            items-start
            gap-3
            rounded-2xl
            border
<<<<<<< HEAD
            border-[#D99AA3]/30
            bg-[#FFF5F6]
            p-5
          "
        >
=======
            border-red-200
            bg-red-50
            p-5
          "
        >

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
          <CircleX
            size={20}
            className="
              mt-0.5
              shrink-0
<<<<<<< HEAD
              text-[#8F4F5A]
            "
          />

          <div>
=======
              text-red-500
            "
          />


          <div>

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
            <p
              className="
                text-sm
                font-bold
<<<<<<< HEAD
                text-[#8F4F5A]
              "
            >
              Unable to load account
            </p>

=======
                text-red-700
              "
            >

              Unable to load account

            </p>


>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
            <p
              className="
                mt-1
                text-xs
<<<<<<< HEAD
                text-[#B76E79]
              "
            >
              {error}
            </p>
          </div>
        </div>
=======
                text-red-500
              "
            >

              {error}

            </p>

          </div>

        </div>

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
      </div>
    );
  }

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
  // =====================================================
  // NO USER
  // =====================================================

  if (!userDetails) {
<<<<<<< HEAD
    return null;
  }

=======

    return null;
  }


>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
  // =====================================================
  // MAIN UI
  // =====================================================

  return (
<<<<<<< HEAD
    <div className="mb-12 sm:mb-16">
=======

    <div className="mb-12 sm:mb-16">

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
      <div
        className="
          group
          relative
          overflow-hidden
          rounded-3xl
          border
<<<<<<< HEAD
          border-[#D99AA3]/25
          bg-white/95
          shadow-[0_18px_60px_rgba(183,110,121,0.10)]
          backdrop-blur-xl
        "
      >
=======
          border-white
          bg-white/95
          shadow-[0_18px_60px_rgba(15,23,42,0.10)]
          backdrop-blur-xl
        "
      >

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
        {/* ==========================================
            TOP GRADIENT
        ========================================== */}

        <div
          className="
            absolute
            inset-x-0
            top-0
            h-1
            bg-gradient-to-r
<<<<<<< HEAD
            from-[#8F4F5A]
            via-[#B76E79]
            to-[#E3AAB2]
          "
        />

=======
            from-purple-600
            via-indigo-500
            to-pink-500
          "
        />


>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
        {/* ==========================================
            DECORATION
        ========================================== */}

        <div
          className="
            pointer-events-none
            absolute
            -right-24
            -top-24
            h-64
            w-64
            rounded-full
<<<<<<< HEAD
            bg-[#D99AA3]/20
=======
            bg-purple-100/80
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
            blur-3xl
          "
        />

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
        <div
          className="
            pointer-events-none
            absolute
            -bottom-24
            -left-24
            h-56
            w-56
            rounded-full
<<<<<<< HEAD
            bg-[#E3AAB2]/15
=======
            bg-indigo-100/60
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
            blur-3xl
          "
        />

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
        <div
          className="
            relative
            p-5
            sm:p-7
            lg:p-8
          "
        >
<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
          {/* ======================================
              HEADER
          ====================================== */}

          <div
            className="
              flex
              flex-col
              gap-5
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >
<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
            <div
              className="
                flex
                min-w-0
                items-center
                gap-4
              "
            >
<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
              {/* AVATAR */}

              <div
                className="
                  flex
                  h-14
                  w-14
                  shrink-0
                  items-center
                  justify-center
                  rounded-2xl
                  bg-gradient-to-br
<<<<<<< HEAD
                  from-[#8F4F5A]
                  via-[#B76E79]
                  to-[#D99AA3]
                  text-white
                  shadow-lg
                  shadow-[#B76E79]/25
=======
                  from-indigo-500
                  to-purple-600
                  text-white
                  shadow-lg
                  shadow-indigo-200/70
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                  transition
                  duration-300
                  group-hover:scale-105
                  sm:h-16
                  sm:w-16
                "
              >
<<<<<<< HEAD
                <User size={29} />
              </div>

              <div className="min-w-0">
=======

                <User
                  size={29}
                />

              </div>


              <div className="min-w-0">

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                <p
                  className="
                    text-[11px]
                    font-extrabold
                    uppercase
                    tracking-[0.18em]
<<<<<<< HEAD
                    text-[#B76E79]
                  "
                >
                  User Details
                </p>

=======
                    text-indigo-500
                  "
                >

                  User Details

                </p>


>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                <h2
                  className="
                    mt-1
                    truncate
                    text-xl
                    font-extrabold
                    tracking-tight
                    text-slate-900
                    sm:text-2xl
                  "
                >
<<<<<<< HEAD
                  {userDetails.full_name}
                </h2>

=======

                  {userDetails.full_name}

                </h2>


>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                <p
                  className="
                    mt-1
                    truncate
                    text-xs
                    text-slate-500
                    sm:text-sm
                  "
                >
<<<<<<< HEAD
                  {userDetails.email}
                </p>
              </div>
            </div>

            {/* ======================================
                SUBSCRIPTION ACTIVE STATUS
            ====================================== */}
=======

                  {userDetails.email}

                </p>

              </div>

            </div>


            {/* ====================================== */}
            {/* SUBSCRIPTION ACTIVE STATUS */}
            {/* ====================================== */}
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

            <div
              className={`
                inline-flex
                w-fit
                items-center
                gap-2
                rounded-full
                border
                px-4
                py-2
                text-xs
                font-extrabold

                ${
                  subscriptionActive
<<<<<<< HEAD
                    ? "border-[#D99AA3]/40 bg-[#FFE5E8]/70 text-[#8F4F5A]"
                    : "border-[#D99AA3]/30 bg-[#FFF5F6] text-[#B76E79]"
                }
              `}
            >
              {subscriptionActive ? (
                <CircleCheckBig size={15} />
              ) : (
                <CircleX size={15} />
              )}

              {subscriptionStatus}
            </div>
          </div>

=======

                    ? "border-emerald-200 bg-emerald-50 text-emerald-600"

                    : "border-red-200 bg-red-50 text-red-600"
                }
              `}
            >

              {subscriptionActive ? (

                <CircleCheckBig
                  size={15}
                />

              ) : (

                <CircleX
                  size={15}
                />

              )}


              {subscriptionStatus}

            </div>

          </div>


>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
          {/* ======================================
              INFORMATION CARDS
          ====================================== */}

          <div
            className="
              mt-7
              grid
              gap-3
              sm:grid-cols-2
              lg:grid-cols-5
            "
<<<<<<< HEAD
          >
=======
             
          >

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
            {/* ==================================== */}
            {/* CUSTOMER ID */}
            {/* ==================================== */}

            <InfoBox
              icon={
<<<<<<< HEAD
                <UserRoundCheck size={19} />
              }
              label="Customer ID"
              value={
                userDetails.customer_id
              }
              iconClass="
                bg-[#FFE5E8]
                text-[#8F4F5A]
              "
            />

=======
                <UserRoundCheck
                  size={19}
                />
              }

              label="Customer ID"

              value={
                userDetails.customer_id
              }

              iconClass="
                bg-indigo-100
                text-indigo-600
              "
            />


>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
            {/* ==================================== */}
            {/* SPONSOR */}
            {/* ==================================== */}

            <InfoBox
              icon={
<<<<<<< HEAD
                <ShieldCheck size={19} />
              }
              label="Sponsor ID"
=======
                <ShieldCheck
                  size={19}
                />
              }

              label="Sponsor ID"

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
              value={
                userDetails.sponsor_id ||
                "--"
              }
<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
              secondary={
                userDetails.sponsor_name ||
                undefined
              }
<<<<<<< HEAD
              iconClass="
                bg-[#F8E8EB]
                text-[#B76E79]
              "
            />

=======

              iconClass="
                bg-purple-100
                text-purple-600
              "
            />


>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
            {/* ==================================== */}
            {/* JOINING DATE */}
            {/* ==================================== */}

            <InfoBox
              icon={
<<<<<<< HEAD
                <CalendarDays size={19} />
              }
              label="Joining Date"
              value={formatJoiningDate(
                userDetails.joining_date
              )}
              iconClass="
                bg-[#FCEDEF]
                text-[#B76E79]
              "
            />

=======
                <CalendarDays
                  size={19}
                />
              }

              label="Joining Date"

              value={
                formatJoiningDate(
                  userDetails.joining_date
                )
              }

              iconClass="
                bg-blue-100
                text-blue-600
              "
            />


>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
            {/* ==================================== */}
            {/* REAL SUBSCRIPTION AMOUNT */}
            {/* ==================================== */}

            <InfoBox
              icon={
<<<<<<< HEAD
                <BadgeDollarSign size={19} />
              }
              label="Subscription Amount"
              value={`$${subscriptionAmount.toFixed(
                2
              )}`}
              secondary={
                subscriptionStatus
              }
              iconClass={
                subscriptionActive
                  ? "bg-[#FFE5E8] text-[#8F4F5A]"
                  : "bg-[#FFF0E6] text-[#B76E79]"
              }
              valueClass={
                subscriptionActive
                  ? "text-slate-900"
                  : "text-[#B76E79]"
              }
            />

=======
                <BadgeDollarSign
                  size={19}
                />
              }

              label="Subscription Amount"

              value={
                `$${subscriptionAmount.toFixed(
                  2
                )}`
              }

              secondary={
                subscriptionStatus
              }

              iconClass={
                subscriptionActive

                  ? "bg-emerald-100 text-emerald-600"

                  : "bg-amber-100 text-amber-600"
              }

              valueClass={
                subscriptionActive

                  ? "text-slate-900"

                  : "text-amber-600"
              }
            />


>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
            {/* ==================================== */}
            {/* TOTAL INCOME - REAL INCOME WALLET */}
            {/* ==================================== */}

            <InfoBox
<<<<<<< HEAD
              icon={<Wallet size={19} />}
              label="Total Income"
              value={`$${totalIncome.toFixed(
                2
              )}`}
              secondary="Income Wallet"
              iconClass="
                bg-[#FFE5E8]
                text-[#8F4F5A]
              "
              valueClass="
                text-[#8F4F5A]
              "
            />
          </div>

=======
              icon={
                <Wallet
                  size={19}
                />
              }

              label="Total Income"

              value={
                `$${totalIncome.toFixed(
                  2
                )}`
              }

              secondary="Income Wallet"

              iconClass="
                bg-purple-100
                text-purple-600
              "

              valueClass="
                text-purple-700
              "
            />

          </div>


>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
          {/* ======================================
              REFERRAL LINK
          ====================================== */}

          <div
            className="
              mt-5
              overflow-hidden
              rounded-2xl
              border
<<<<<<< HEAD
              border-[#D99AA3]/30
              bg-gradient-to-r
              from-[#FFF5F6]
              via-[#FFECEF]
              to-[#FFF9FA]
=======
              border-indigo-100
              bg-gradient-to-r
              from-indigo-50/90
              via-purple-50/70
              to-pink-50/60
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
              p-4
              sm:p-5
            "
          >
<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
            <div
              className="
                flex
                flex-col
                gap-4
                lg:flex-row
                lg:items-center
                lg:justify-between
              "
            >
<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
              <div
                className="
                  min-w-0
                  flex-1
                "
              >
<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                <div
                  className="
                    mb-2
                    flex
                    items-center
                    gap-2
                  "
                >
<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                  <div
                    className="
                      flex
                      h-8
                      w-8
                      shrink-0
                      items-center
                      justify-center
                      rounded-lg
<<<<<<< HEAD
                      bg-[#FFE5E8]
                      text-[#8F4F5A]
                    "
                  >
                    <Link2 size={16} />
                  </div>

                  <div>
=======
                      bg-indigo-100
                      text-indigo-600
                    "
                  >

                    <Link2
                      size={16}
                    />

                  </div>


                  <div>

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                    <p
                      className="
                        text-[11px]
                        font-extrabold
                        uppercase
                        tracking-wider
                        text-slate-500
                      "
                    >
<<<<<<< HEAD
                      Your Referral Link
                    </p>

=======

                      Your Referral Link

                    </p>


>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                    <p
                      className="
                        text-[10px]
                        text-slate-400
                      "
                    >
<<<<<<< HEAD
                      Invite friends and grow
                      your network
                    </p>
                  </div>
                </div>

=======

                      Invite friends and grow
                      your network

                    </p>

                  </div>

                </div>


>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                <div
                  className="
                    rounded-xl
                    border
<<<<<<< HEAD
                    border-[#D99AA3]/20
                    bg-white/80
=======
                    border-white
                    bg-white/70
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                    px-3
                    py-3
                    sm:px-4
                  "
                >
<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                  <p
                    className="
                      break-all
                      text-xs
                      font-semibold
                      leading-5
                      text-slate-700
                      sm:text-sm
                    "
                  >
<<<<<<< HEAD
                    {referralLink}
                  </p>
                </div>
              </div>

              {/* ==================================
                  ACTION BUTTONS
              ================================== */}
=======

                    {referralLink}

                  </p>

                </div>

              </div>


              {/* ================================== */}
              {/* ACTION BUTTONS */}
              {/* ================================== */}
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

              <div
                className="
                  flex
                  shrink-0
                  flex-col
                  gap-2
                  min-[400px]:flex-row
                "
              >
<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                {/* COPY */}

                <button
                  type="button"
<<<<<<< HEAD
                  onClick={handleCopy}
                  disabled={!referralLink}
=======

                  onClick={
                    handleCopy
                  }

                  disabled={
                    !referralLink
                  }

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                  className="
                    inline-flex
                    min-h-11
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
<<<<<<< HEAD
                    bg-[#8F4F5A]
=======
                    bg-slate-900
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                    px-5
                    py-2.5
                    text-sm
                    font-bold
                    text-white
                    transition-all
                    duration-300
                    hover:-translate-y-0.5
<<<<<<< HEAD
                    hover:bg-[#B76E79]
                    hover:shadow-lg
                    hover:shadow-[#B76E79]/20
=======
                    hover:bg-indigo-600
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
<<<<<<< HEAD
                  {copied ? (
                    <>
                      <Check size={17} />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy size={17} />
                      Copy Link
                    </>
                  )}
                </button>

=======

                  {copied ? (

                    <>

                      <Check
                        size={17}
                      />

                      Copied

                    </>

                  ) : (

                    <>

                      <Copy
                        size={17}
                      />

                      Copy Link

                    </>

                  )}

                </button>


>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                {/* SHARE */}

                <button
                  type="button"
<<<<<<< HEAD
                  onClick={handleShare}
                  disabled={!referralLink}
=======

                  onClick={
                    handleShare
                  }

                  disabled={
                    !referralLink
                  }

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                  className="
                    inline-flex
                    min-h-11
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    border
<<<<<<< HEAD
                    border-[#D99AA3]/40
=======
                    border-indigo-200
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                    bg-white
                    px-5
                    py-2.5
                    text-sm
                    font-bold
<<<<<<< HEAD
                    text-[#8F4F5A]
                    transition-all
                    duration-300
                    hover:-translate-y-0.5
                    hover:border-[#B76E79]/50
                    hover:bg-[#FFF5F6]
=======
                    text-indigo-600
                    transition-all
                    duration-300
                    hover:-translate-y-0.5
                    hover:border-indigo-300
                    hover:bg-indigo-50
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
<<<<<<< HEAD
                  <Share2 size={17} />
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
=======

                  <Share2
                    size={17}
                  />

                  Share

                </button>

              </div>

            </div>

          </div>

        </div>

      </div>

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
    </div>
  );
};

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
// =====================================================
// REUSABLE INFO BOX
// =====================================================

interface InfoBoxProps {
<<<<<<< HEAD
  icon: React.ReactNode;
  label: string;
  value: string;
  secondary?: string;
  iconClass?: string;
  valueClass?: string;
}

=======

  icon:
    React.ReactNode;

  label:
    string;

  value:
    string;

  secondary?:
    string;

  iconClass?:
    string;

  valueClass?:
    string;
}


>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
// =====================================================
// INFO BOX COMPONENT
// =====================================================

<<<<<<< HEAD
const InfoBox: React.FC<InfoBoxProps> = ({
  icon,
  label,
  value,
  secondary,
  iconClass = "",
  valueClass = "text-slate-900",
}) => {
  return (
    <div
      className="
        min-w-0
        rounded-2xl
        border
        border-[#D99AA3]/15
        bg-[#FFF9FA]/80
        p-4
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-[#D99AA3]/40
        hover:bg-white
        hover:shadow-lg
        hover:shadow-[#B76E79]/10
      "
    >
      <div
        className={`
          mb-3
          flex
          h-9
          w-9
          items-center
          justify-center
          rounded-xl
          ${iconClass}
        `}
      >
        {icon}
      </div>

      <p
        className="
          text-[10px]
          font-extrabold
          uppercase
          tracking-wider
          text-slate-400
          sm:text-[11px]
        "
      >
        {label}
      </p>

      <p
        className={`
          mt-1
          break-words
          text-sm
          font-extrabold
          ${valueClass}
        `}
      >
        {value}
      </p>

      {secondary && (
        <p
          className="
            mt-1
            truncate
            text-[11px]
            text-slate-400
          "
          title={secondary}
        >
          {secondary}
        </p>
      )}
    </div>
  );
};
=======
const InfoBox:
  React.FC<InfoBoxProps> = ({

    icon,

    label,

    value,

    secondary,

    iconClass = "",

    valueClass =
      "text-slate-900",

  }) => {

    return (

      <div
        className="
          min-w-0
          rounded-2xl
          border
          border-slate-100
          bg-slate-50/80
          p-4
          transition-all
          duration-300
          hover:-translate-y-1
          hover:border-indigo-100
          hover:bg-white
          hover:shadow-lg
        "
      >

        <div
          className={`
            mb-3
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-xl
            ${iconClass}
          `}
        >

          {icon}

        </div>


        <p
          className="
            text-[10px]
            font-extrabold
            uppercase
            tracking-wider
            text-slate-400
            sm:text-[11px]
          "
        >

          {label}

        </p>


        <p
          className={`
            mt-1
            break-words
            text-sm
            font-extrabold
            ${valueClass}
          `}
        >

          {value}

        </p>


        {secondary && (

          <p
            className="
              mt-1
              truncate
              text-[11px]
              text-slate-400
            "

            title={
              secondary
            }
          >

            {secondary}

          </p>

        )}

      </div>
    );
  };

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

export default UserDetailsCard;