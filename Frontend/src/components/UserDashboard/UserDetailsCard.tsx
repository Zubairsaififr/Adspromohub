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


// =====================================================
// API URL
// =====================================================

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:8000";


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


interface UserDetailsResponse {
  success: boolean;
  user: UserDetails;
}


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


// =====================================================
// INCOME WALLET
// =====================================================

interface IncomeWalletData {
  success: boolean;

  balance: string | number;

  total_earned: string | number;

  total_withdrawn: string | number;
}


// =====================================================
// COMPONENT
// =====================================================

const UserDetailsCard: React.FC = () => {

  // ===================================================
  // STATES
  // ===================================================

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


  // =====================================================
  // LOAD USER + SUBSCRIPTION + INCOME WALLET
  // =====================================================

  useEffect(() => {

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


  // =====================================================
  // REAL SUBSCRIPTION VALUES
  // =====================================================

  const subscriptionAmount =
    Number(
      subscription?.current_amount ||
      0
    );


  const subscriptionActive =
    Boolean(
      subscription
        ?.subscription_active
    ) &&
    subscriptionAmount > 0;


  const subscriptionStatus =
    subscriptionActive
      ? "ACTIVE"
      : "INACTIVE";


  // =====================================================
  // REAL TOTAL INCOME
  //
  // This comes directly from Income Wallet balance.
  // No frontend calculation.
  // =====================================================

  const totalIncome =
    Number(
      incomeWallet?.balance ||
      0
    );


  // =====================================================
  // REFERRAL LINK
  // =====================================================

  const referralLink =
    userDetails?.referral_code

      ? `https://www.adspromohub.com/register/${encodeURIComponent(
          userDetails.referral_code
        )}`

      : "";


  // =====================================================
  // COPY REFERRAL LINK
  // =====================================================

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


  // =====================================================
  // SHARE REFERRAL LINK
  // =====================================================

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


  // =====================================================
  // DATE FORMAT
  // =====================================================

  const formatJoiningDate = (
    date: string
  ) => {

    if (!date) {
      return "--";
    }


    const parsedDate =
      new Date(date);


    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {

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


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (

      <div className="mb-12 sm:mb-16">

        <div
          className="
            animate-pulse
            rounded-3xl
            border
            border-slate-200
            bg-white
            p-5
            shadow-[0_15px_50px_rgba(15,23,42,0.08)]
            sm:p-7
            lg:p-8
          "
        >

          <div className="flex items-center gap-4">

            <div
              className="
                h-14
                w-14
                rounded-2xl
                bg-slate-200
              "
            />


            <div className="flex-1">

              <div
                className="
                  h-4
                  w-24
                  rounded
                  bg-slate-200
                "
              />


              <div
                className="
                  mt-3
                  h-6
                  w-48
                  max-w-full
                  rounded
                  bg-slate-200
                "
              />

            </div>

          </div>


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

            {[1, 2, 3, 4, 5].map(
              (item) => (

                <div
                  key={item}
                  className="
                    h-28
                    rounded-2xl
                    bg-slate-100
                  "
                />

              )
            )}

          </div>


          <div
            className="
              mt-4
              h-24
              rounded-2xl
              bg-slate-100
            "
          />

        </div>

      </div>
    );
  }


  // =====================================================
  // ERROR
  // =====================================================

  if (error) {

    return (

      <div className="mb-12 sm:mb-16">

        <div
          className="
            flex
            items-start
            gap-3
            rounded-2xl
            border
            border-red-200
            bg-red-50
            p-5
          "
        >

          <CircleX
            size={20}
            className="
              mt-0.5
              shrink-0
              text-red-500
            "
          />


          <div>

            <p
              className="
                text-sm
                font-bold
                text-red-700
              "
            >

              Unable to load account

            </p>


            <p
              className="
                mt-1
                text-xs
                text-red-500
              "
            >

              {error}

            </p>

          </div>

        </div>

      </div>
    );
  }


  // =====================================================
  // NO USER
  // =====================================================

  if (!userDetails) {

    return null;
  }


  // =====================================================
  // MAIN UI
  // =====================================================

  return (

    <div className="mb-12 sm:mb-16">

      <div
        className="
          group
          relative
          overflow-hidden
          rounded-3xl
          border
          border-white
          bg-white/95
          shadow-[0_18px_60px_rgba(15,23,42,0.10)]
          backdrop-blur-xl
        "
      >

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
            from-purple-600
            via-indigo-500
            to-pink-500
          "
        />


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
            bg-purple-100/80
            blur-3xl
          "
        />


        <div
          className="
            pointer-events-none
            absolute
            -bottom-24
            -left-24
            h-56
            w-56
            rounded-full
            bg-indigo-100/60
            blur-3xl
          "
        />


        <div
          className="
            relative
            p-5
            sm:p-7
            lg:p-8
          "
        >

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

            <div
              className="
                flex
                min-w-0
                items-center
                gap-4
              "
            >

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
                  from-indigo-500
                  to-purple-600
                  text-white
                  shadow-lg
                  shadow-indigo-200/70
                  transition
                  duration-300
                  group-hover:scale-105
                  sm:h-16
                  sm:w-16
                "
              >

                <User
                  size={29}
                />

              </div>


              <div className="min-w-0">

                <p
                  className="
                    text-[11px]
                    font-extrabold
                    uppercase
                    tracking-[0.18em]
                    text-indigo-500
                  "
                >

                  User Details

                </p>


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

                  {userDetails.full_name}

                </h2>


                <p
                  className="
                    mt-1
                    truncate
                    text-xs
                    text-slate-500
                    sm:text-sm
                  "
                >

                  {userDetails.email}

                </p>

              </div>

            </div>


            {/* ====================================== */}
            {/* SUBSCRIPTION ACTIVE STATUS */}
            {/* ====================================== */}

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
             
          >

            {/* ==================================== */}
            {/* CUSTOMER ID */}
            {/* ==================================== */}

            <InfoBox
              icon={
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


            {/* ==================================== */}
            {/* SPONSOR */}
            {/* ==================================== */}

            <InfoBox
              icon={
                <ShieldCheck
                  size={19}
                />
              }

              label="Sponsor ID"

              value={
                userDetails.sponsor_id ||
                "--"
              }

              secondary={
                userDetails.sponsor_name ||
                undefined
              }

              iconClass="
                bg-purple-100
                text-purple-600
              "
            />


            {/* ==================================== */}
            {/* JOINING DATE */}
            {/* ==================================== */}

            <InfoBox
              icon={
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


            {/* ==================================== */}
            {/* REAL SUBSCRIPTION AMOUNT */}
            {/* ==================================== */}

            <InfoBox
              icon={
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


            {/* ==================================== */}
            {/* TOTAL INCOME - REAL INCOME WALLET */}
            {/* ==================================== */}

            <InfoBox
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


          {/* ======================================
              REFERRAL LINK
          ====================================== */}

          <div
            className="
              mt-5
              overflow-hidden
              rounded-2xl
              border
              border-indigo-100
              bg-gradient-to-r
              from-indigo-50/90
              via-purple-50/70
              to-pink-50/60
              p-4
              sm:p-5
            "
          >

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

              <div
                className="
                  min-w-0
                  flex-1
                "
              >

                <div
                  className="
                    mb-2
                    flex
                    items-center
                    gap-2
                  "
                >

                  <div
                    className="
                      flex
                      h-8
                      w-8
                      shrink-0
                      items-center
                      justify-center
                      rounded-lg
                      bg-indigo-100
                      text-indigo-600
                    "
                  >

                    <Link2
                      size={16}
                    />

                  </div>


                  <div>

                    <p
                      className="
                        text-[11px]
                        font-extrabold
                        uppercase
                        tracking-wider
                        text-slate-500
                      "
                    >

                      Your Referral Link

                    </p>


                    <p
                      className="
                        text-[10px]
                        text-slate-400
                      "
                    >

                      Invite friends and grow
                      your network

                    </p>

                  </div>

                </div>


                <div
                  className="
                    rounded-xl
                    border
                    border-white
                    bg-white/70
                    px-3
                    py-3
                    sm:px-4
                  "
                >

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

                    {referralLink}

                  </p>

                </div>

              </div>


              {/* ================================== */}
              {/* ACTION BUTTONS */}
              {/* ================================== */}

              <div
                className="
                  flex
                  shrink-0
                  flex-col
                  gap-2
                  min-[400px]:flex-row
                "
              >

                {/* COPY */}

                <button
                  type="button"

                  onClick={
                    handleCopy
                  }

                  disabled={
                    !referralLink
                  }

                  className="
                    inline-flex
                    min-h-11
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-slate-900
                    px-5
                    py-2.5
                    text-sm
                    font-bold
                    text-white
                    transition-all
                    duration-300
                    hover:-translate-y-0.5
                    hover:bg-indigo-600
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >

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


                {/* SHARE */}

                <button
                  type="button"

                  onClick={
                    handleShare
                  }

                  disabled={
                    !referralLink
                  }

                  className="
                    inline-flex
                    min-h-11
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    border
                    border-indigo-200
                    bg-white
                    px-5
                    py-2.5
                    text-sm
                    font-bold
                    text-indigo-600
                    transition-all
                    duration-300
                    hover:-translate-y-0.5
                    hover:border-indigo-300
                    hover:bg-indigo-50
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >

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

    </div>
  );
};


// =====================================================
// REUSABLE INFO BOX
// =====================================================

interface InfoBoxProps {

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


// =====================================================
// INFO BOX COMPONENT
// =====================================================

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


export default UserDetailsCard;