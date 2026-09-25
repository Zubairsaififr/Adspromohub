import { useEffect, useState } from "react";

// const API_URL = 'http://127.0.0.1:8000';
const API_URL = import.meta.env.VITE_API_URL;

interface CompoundingData {
rate_percent: number;
direct_referrals: number;
subscription_amount: number;
income_wallet_balance_before: number;
compounding_base: number;
daily_earning: number;
earning_amount: number;
income_wallet_balance_after: number;
}

interface AvailabilityData {
available: boolean;
can_watch: boolean;
already_started?: boolean;
session_id?: number;
session_status?: string;
message?: string;
start_time?: string;
end_time?: string;
minimum_watch_seconds?: number;
}

export default function DailyCompounding() {
const [availability, setAvailability] =
useState<AvailabilityData | null>(null);

const [compounding, setCompounding] =
useState<CompoundingData | null>(null);

const [sessionId, setSessionId] =
useState<number | null>(null);

const [watching, setWatching] =
useState(false);

const [completing, setCompleting] =
useState(false);

const [loading, setLoading] =
useState(true);

const [error, setError] =
useState("");

const [message, setMessage] =
useState("");

const [watchSeconds, setWatchSeconds] =
useState(0);

// ======================================================
// TOKEN
// ======================================================

const getToken = () => {
return localStorage.getItem("access_token");
};

// ======================================================
// LOAD AVAILABILITY
// ======================================================

const loadAvailability = async () => {
try {
setLoading(true);
setError("");


  const token = getToken();

  if (!token) {
    setError("Please sign in again.");
    return;
  }

  const response = await fetch(
    `${API_URL}/ads/availability`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.detail?.message ||
        data?.detail ||
        "Failed to check ad availability."
    );
  }

  setAvailability(data);

  if (data.session_id) {
    setSessionId(data.session_id);
  }
} catch (err: any) {
  console.error(
    "Daily compounding availability error:",
    err
  );

  setError(
    err?.message ||
      "Failed to load daily compounding."
  );
} finally {
  setLoading(false);
}


};

// ======================================================
// INITIAL LOAD
// ======================================================

useEffect(() => {
loadAvailability();
}, []);

// ======================================================
// START AD
// ======================================================

const startAd = async () => {
try {
setError("");
setMessage("");
setCompounding(null);
setWatchSeconds(0);


  const token = getToken();

  if (!token) {
    setError("Please sign in again.");
    return;
  }

  const response = await fetch(
    `${API_URL}/ads/start`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.detail?.message ||
        data?.detail ||
        "Unable to start ad."
    );
  }

  setSessionId(data.session_id);
  setWatching(true);

  setAvailability({
    available: true,
    can_watch: false,
    already_started: true,
    session_id: data.session_id,
    session_status: "started",
    message: "Ad is currently being watched.",
  });

  setMessage(
    "Ad started. Please watch for at least 30 seconds."
  );
} catch (err: any) {
  console.error(
    "Start ad error:",
    err
  );

  setError(
    err?.message ||
      "Unable to start today's ad."
  );
}


};

// ======================================================
// WATCH TIMER
// ======================================================

useEffect(() => {
if (!watching) {
return;
}


const timer = window.setInterval(() => {
  setWatchSeconds((previous) => previous + 1);
}, 1000);

return () => {
  window.clearInterval(timer);
};


}, [watching]);

// ======================================================
// COMPLETE AD
// ======================================================

const completeAd = async () => {
if (!sessionId) {
setError("Ad session not found.");
return;
}


if (watchSeconds < 30) {
  setError(
    `Please watch for ${
      30 - watchSeconds
    } more seconds.`
  );
  return;
}

try {
  setCompleting(true);
  setError("");
  setMessage("");

  const token = getToken();

  if (!token) {
    setError("Please sign in again.");
    return;
  }

  const response = await fetch(
    `${API_URL}/ads/complete/${sessionId}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.detail?.message ||
        data?.detail ||
        "Unable to complete ad."
    );
  }

  setWatching(false);

  // --------------------------------------------------
  // Daily compounding result
  // --------------------------------------------------

  if (data.compounding) {
    setCompounding({
      rate_percent: Number(
        data.compounding.rate_percent || 0
      ),

      direct_referrals: Number(
        data.compounding.direct_referrals || 0
      ),

      subscription_amount: Number(
        data.compounding.subscription_amount || 0
      ),

      income_wallet_balance_before: Number(
        data.compounding
          .income_wallet_balance_before || 0
      ),

      compounding_base: Number(
        data.compounding.compounding_base || 0
      ),

      daily_earning: Number(
        data.compounding.daily_earning || 0
      ),

      earning_amount: Number(
        data.compounding.earning_amount || 0
      ),

      income_wallet_balance_after: Number(
        data.compounding
          .income_wallet_balance_after || 0
      ),
    });
  }

  // --------------------------------------------------
  // Success message
  // --------------------------------------------------

  setMessage(
    data.message ||
      "Ad completed successfully."
  );

  // --------------------------------------------------
  // Reload availability
  // --------------------------------------------------

  await loadAvailability();
} catch (err: any) {
  console.error(
    "Complete ad error:",
    err
  );

  setError(
    err?.message ||
      "Unable to complete today's ad."
  );
} finally {
  setCompleting(false);
}


};

// ======================================================
// FORMAT MONEY
// ======================================================

const money = (value: number) => {
return `$${Number(value || 0).toFixed(2)}`;
};

// ======================================================
// RENDER
// ======================================================

if (loading) {
return ( <div className="w-full flex justify-center py-10"> <div className="text-sm text-gray-500">
Loading Daily Compounding... </div> </div>
);
}

return ( <div className="w-full space-y-6">


  {/* ==================================================
      HEADER
  ================================================== */}

  <div>
    <h1 className="text-2xl font-bold">
      Daily Compounding
    </h1>

    <p className="text-sm text-gray-500 mt-1">
      Complete your daily ad watch to earn
      compounding income.
    </p>
  </div>

  {/* ==================================================
      ERROR
  ================================================== */}

  {error && (
    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
      {error}
    </div>
  )}

  {/* ==================================================
      MESSAGE
  ================================================== */}

  {message && (
    <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
      {message}
    </div>
  )}

  {/* ==================================================
      COMPOUNDING RESULT
  ================================================== */}

  {compounding && (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">

      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold">
            Today's Compounding
          </h2>

          <p className="text-sm text-gray-500">
            Your earning from today's completed ad
          </p>
        </div>

        <div className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
          Credited
        </div>
      </div>

      {/* Today's earning */}

      <div className="rounded-xl bg-gray-50 p-5 mb-5">
        <p className="text-sm text-gray-500">
          Today's Growth
        </p>

        <p className="text-3xl font-bold mt-1">
          {money(
            compounding.earning_amount
          )}
        </p>

        <p className="text-xs text-green-600 mt-1">
          Added to Income Wallet
        </p>
      </div>

      {/* Stats */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        <div className="rounded-xl border p-4">
          <p className="text-xs text-gray-500">
            Compounding Rate
          </p>

          <p className="text-lg font-semibold mt-1">
            {compounding.rate_percent.toFixed(2)}%
          </p>
        </div>

        <div className="rounded-xl border p-4">
          <p className="text-xs text-gray-500">
            Subscription
          </p>

          <p className="text-lg font-semibold mt-1">
            {money(
              compounding.subscription_amount
            )}
          </p>
        </div>

        <div className="rounded-xl border p-4">
          <p className="text-xs text-gray-500">
            Income Wallet
          </p>

          <p className="text-lg font-semibold mt-1">
            {money(
              compounding
                .income_wallet_balance_before
            )}
          </p>
        </div>

        <div className="rounded-xl border p-4">
          <p className="text-xs text-gray-500">
            Direct Referrals
          </p>

          <p className="text-lg font-semibold mt-1">
            {compounding.direct_referrals}
          </p>
        </div>

      </div>

      {/* Calculation */}

      <div className="mt-5 rounded-xl border p-4">

        <p className="text-sm font-semibold mb-3">
          Compounding Calculation
        </p>

        <div className="space-y-2 text-sm">

          <div className="flex justify-between">
            <span className="text-gray-500">
              Subscription
            </span>

            <span>
              {money(
                compounding.subscription_amount
              )}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">
              Income Wallet
            </span>

            <span>
              {money(
                compounding
                  .income_wallet_balance_before
              )}
            </span>
          </div>

          <div className="flex justify-between font-medium border-t pt-2">
            <span>
              Compounding Base
            </span>

            <span>
              {money(
                compounding.compounding_base
              )}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">
              Rate
            </span>

            <span>
              {compounding.rate_percent.toFixed(2)}%
            </span>
          </div>

          <div className="flex justify-between font-semibold border-t pt-2">
            <span>
              Daily Earning
            </span>

            <span>
              {money(
                compounding.earning_amount
              )}
            </span>
          </div>

          <div className="flex justify-between font-semibold text-green-600">
            <span>
              New Income Wallet Balance
            </span>

            <span>
              {money(
                compounding
                  .income_wallet_balance_after
              )}
            </span>
          </div>

        </div>
      </div>

    </div>
  )}

  {/* ==================================================
      WATCH CARD
  ================================================== */}

  {!compounding && (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">

      <h2 className="text-lg font-semibold">
        Daily Ad
      </h2>

      <p className="text-sm text-gray-500 mt-1">
        Watch today's required advertisement
        to receive your daily compounding.
      </p>

      {/* ----------------------------------------------
          WATCHING
      ---------------------------------------------- */}

      {watching ? (
        <div className="mt-6">

          <div className="rounded-xl bg-gray-50 p-6 text-center">

            <p className="text-sm text-gray-500">
              Advertisement in progress
            </p>

            <p className="text-4xl font-bold mt-2">
              {watchSeconds}s
            </p>

            <p className="text-xs text-gray-500 mt-2">
              Minimum required watch time:
              {" "}
              30 seconds
            </p>

          </div>

          <button
            type="button"
            onClick={completeAd}
            disabled={
              completing ||
              watchSeconds < 30
            }
            className="w-full mt-5 rounded-xl px-5 py-3 font-semibold bg-black text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {completing
              ? "Processing..."
              : watchSeconds < 30
              ? `Watch ${
                  30 - watchSeconds
                } more seconds`
              : "Complete Ad"}
          </button>

        </div>
      ) : (
        /* --------------------------------------------
           NOT WATCHING
        -------------------------------------------- */

        <div className="mt-6">

          {availability?.can_watch ? (
            <button
              type="button"
              onClick={startAd}
              className="w-full rounded-xl px-5 py-3 font-semibold bg-black text-white"
            >
              Watch Today's Ad
            </button>
          ) : (
            <div className="rounded-xl bg-gray-50 p-5">

              <p className="text-sm font-medium">
                {availability?.message ||
                  "Today's ad is not available."}
              </p>

              {availability?.start_time &&
                availability?.end_time && (
                  <p className="text-xs text-gray-500 mt-2">
                    Available from{" "}
                    {availability.start_time}
                    {" "}
                    to{" "}
                    {availability.end_time}
                  </p>
                )}

            </div>
          )}

        </div>
      )}

    </div>
  )}

  {/* ==================================================
      INFO
  ================================================== */}

  <div className="rounded-2xl border bg-white p-5">

    <h3 className="font-semibold">
      How Daily Compounding Works
    </h3>

    <ul className="mt-3 space-y-2 text-sm text-gray-600">

      <li>
        • Complete the required daily ad watch.
      </li>

      <li>
        • 0–3 direct referrals: 2% daily rate.
      </li>

      <li>
        • 4–7 direct referrals: 2.5% daily rate.
      </li>

      <li>
        • 8–9 direct referrals: 3% daily rate.
      </li>

      <li>
        • Calculation uses your subscription
        plus current Income Wallet balance.
      </li>

      <li>
        • The earning is automatically credited
        to your Income Wallet.
      </li>

    </ul>

  </div>

</div>


);
}
