<<<<<<< HEAD


import React, { useEffect, useMemo, useRef, useState } from "react";

import {

  Crown,

  Gem,

  Users,

  Wallet,

  Trophy,

  Zap,

  ShieldCheck,

  ChevronRight,

  RefreshCw,

  CheckCircle2,

  Lock,

  Clock3,

} from "lucide-react";



import UserNavbar from "../UserDashboard/UserNavbar";



const API_URL = import.meta.env.VITE_API_URL;



// ============================================================

// TYPES

// ============================================================



type RankName =

  | "Ruby"

  | "Emerald"

  | "Sapphire"

  | "Topaz"

  | "Amethyst"

  | "Diamond"

  | "Crown Jewel";



type MatchedLeg = {

  required_rank?: string;



  root_leg_referral_id?: string;

  root_leg_user_id?: number;

  root_leg_user_name?: string;



  matched_user_id?: number;

  matched_user_referral_id?: string;

  matched_user_name?: string;

};



type Qualification = {

  rank_name?: string;

  qualified?: boolean;



  direct_count?: number;

  required_directs?: number;



  requirements?: Record<string, number>;



  required_distinct_legs?: number;

  available_root_legs?: number;



  matched_legs?: MatchedLeg[];

};



type RankHistoryItem = {

  rank_name: string;

  display_name: string;



  status: string;



  achieved_at?: string | null;

  superseded_at?: string | null;



  instant_bonus?: number;

  instant_bonus_credited?: boolean;

  instant_bonus_received?: number;



  wallet_maintain?: number;

  hierarchy_cap?: number;

};



type NextRankData = {

  rank_name: string;

  display_name: string;



  qualified?: boolean;



  requirements?: Record<string, number>;



  wallet_maintain?: number;

  instant_bonus?: number;

  hierarchy_cap?: number;



  qualification?: Qualification;

};



type RankStatusResponse = {

  current_rank?: string | null;

  current_rank_display?: string | null;



  rank_history?: RankHistoryItem[];



  next_rank?: NextRankData | null;

};



type BonusStatusItem = {

  rank_name: string;

  display_name: string;



  required_wallet_balance?: number;

  instant_bonus?: number;



  status?: {

    rank_name?: string;



    rank_achieved?: boolean;



    required_wallet_balance?: number;

    current_wallet_balance?: number;



    wallet_maintained?: boolean;



    bonus_amount?: number;



    already_claimed?: boolean;

    eligible?: boolean;

  };

};



type BonusStatusResponse = {

  success?: boolean;

  ranks?: BonusStatusItem[];

};



type WalletResponse = {

  balance?: number;

  total_earned?: number;

  total_withdrawn?: number;

};



type CircleSummary = {

  direct_members?: number;

  all_circle_members?: number;



  total_legs?: number;



  power_leg_members?: number;

  other_legs_members?: number;

};



type RankConfig = {

  wallet: number;

  instantBonus: number;

  hierarchyCap: number;



  directsRequired?: number;



  requirements?: Record<string, number>;

};



// ============================================================

// LOCKED RANK BUSINESS CONFIG

// ============================================================



const RANK_CONFIG: Record<RankName, RankConfig> = {

  Ruby: {

    wallet: 50,

    instantBonus: 20,

    hierarchyCap: 100,

    directsRequired: 10,

  },



  Emerald: {

    wallet: 100,

    instantBonus: 100,

    hierarchyCap: 200,



    requirements: {

      Ruby: 3,

    },

  },



  Sapphire: {

    wallet: 300,

    instantBonus: 200,

    hierarchyCap: 600,



    requirements: {

      Emerald: 1,

      Ruby: 2,

    },

  },



  Topaz: {

    wallet: 500,

    instantBonus: 350,

    hierarchyCap: 1000,



    requirements: {

      Sapphire: 2,

      Ruby: 2,

    },

  },



  Amethyst: {

    wallet: 1000,

    instantBonus: 500,

    hierarchyCap: 2000,



    requirements: {

      Topaz: 1,

      Sapphire: 1,

      Emerald: 1,

      Ruby: 2,

    },

  },



  Diamond: {

    wallet: 3000,

    instantBonus: 1000,

    hierarchyCap: 6000,



    requirements: {

      Amethyst: 1,

      Topaz: 1,

      Sapphire: 2,

      Emerald: 1,

    },

  },



  "Crown Jewel": {

    wallet: 5000,

    instantBonus: 2000,

    hierarchyCap: 10000,



    requirements: {

      Diamond: 1,

      Amethyst: 1,

      Topaz: 2,

      Sapphire: 2,

    },

  },

};



const RANK_ORDER: RankName[] = [

  "Ruby",

  "Emerald",

  "Sapphire",

  "Topaz",

  "Amethyst",

  "Diamond",

  "Crown Jewel",

];



// ============================================================

// HELPERS

// ============================================================



const normalizeRank = (

  rank?: string | null

): RankName | null => {

  if (!rank) {

    return null;

  }



  const normalized = rank

    .trim()

    .toLowerCase()

    .replace(/_/g, " ");



  const match = RANK_ORDER.find(

    (item) => item.toLowerCase() === normalized

  );



  return match || null;

};



const formatMoney = (

  amount: string | number | undefined | null

=======
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Crown,
  Gem,
  Users,
  Wallet,
  Trophy,
  Zap,
  ShieldCheck,
  ChevronRight,
  RefreshCw,
  CheckCircle2,
  Lock,
  Clock3,
} from "lucide-react";

import UserNavbar from "../UserDashboard/UserNavbar";

const API_URL = import.meta.env.VITE_API_URL;


// ============================================================
// TYPES
// ============================================================

type RankName =
  | "Ruby"
  | "Emerald"
  | "Sapphire"
  | "Topaz"
  | "Amethyst"
  | "Diamond"
  | "Crown Jewel";


type MatchedLeg = {
  required_rank?: string;

  root_leg_referral_id?: string;
  root_leg_user_id?: number;
  root_leg_user_name?: string;

  matched_user_id?: number;
  matched_user_referral_id?: string;
  matched_user_name?: string;
};


type Qualification = {
  rank_name?: string;
  qualified?: boolean;

  direct_count?: number;
  required_directs?: number;

  requirements?: Record<string, number>;

  required_distinct_legs?: number;
  available_root_legs?: number;

  matched_legs?: MatchedLeg[];
};


type RankHistoryItem = {
  rank_name: string;
  display_name: string;

  status: string;

  achieved_at?: string | null;
  superseded_at?: string | null;

  instant_bonus?: number;
  instant_bonus_credited?: boolean;
  instant_bonus_received?: number;

  wallet_maintain?: number;
  hierarchy_cap?: number;
};


type NextRankData = {
  rank_name: string;
  display_name: string;

  qualified?: boolean;

  requirements?: Record<string, number>;

  wallet_maintain?: number;
  instant_bonus?: number;
  hierarchy_cap?: number;

  qualification?: Qualification;
};


type RankStatusResponse = {
  current_rank?: string | null;
  current_rank_display?: string | null;

  rank_history?: RankHistoryItem[];

  next_rank?: NextRankData | null;
};


type BonusStatusItem = {
  rank_name: string;
  display_name: string;

  required_wallet_balance?: number;
  instant_bonus?: number;

  status?: {
    rank_name?: string;

    rank_achieved?: boolean;

    required_wallet_balance?: number;
    current_wallet_balance?: number;

    wallet_maintained?: boolean;

    bonus_amount?: number;

    already_claimed?: boolean;
    eligible?: boolean;
  };
};


type BonusStatusResponse = {
  success?: boolean;
  ranks?: BonusStatusItem[];
};


type WalletResponse = {
  balance?: number;
  total_earned?: number;
  total_withdrawn?: number;
};


type CircleSummary = {
  direct_members?: number;
  all_circle_members?: number;

  total_legs?: number;

  power_leg_members?: number;
  other_legs_members?: number;
};


type RankConfig = {
  wallet: number;
  instantBonus: number;
  hierarchyCap: number;

  directsRequired?: number;

  requirements?: Record<string, number>;
};


// ============================================================
// LOCKED RANK BUSINESS CONFIG
// ============================================================

const RANK_CONFIG: Record<RankName, RankConfig> = {
  Ruby: {
    wallet: 50,
    instantBonus: 20,
    hierarchyCap: 100,
    directsRequired: 10,
  },

  Emerald: {
    wallet: 100,
    instantBonus: 100,
    hierarchyCap: 200,

    requirements: {
      Ruby: 3,
    },
  },

  Sapphire: {
    wallet: 300,
    instantBonus: 200,
    hierarchyCap: 600,

    requirements: {
      Emerald: 1,
      Ruby: 2,
    },
  },

  Topaz: {
    wallet: 500,
    instantBonus: 350,
    hierarchyCap: 1000,

    requirements: {
      Sapphire: 2,
      Ruby: 2,
    },
  },

  Amethyst: {
    wallet: 1000,
    instantBonus: 500,
    hierarchyCap: 2000,

    requirements: {
      Topaz: 1,
      Sapphire: 1,
      Emerald: 1,
      Ruby: 2,
    },
  },

  Diamond: {
    wallet: 3000,
    instantBonus: 1000,
    hierarchyCap: 6000,

    requirements: {
      Amethyst: 1,
      Topaz: 1,
      Sapphire: 2,
      Emerald: 1,
    },
  },

  "Crown Jewel": {
    wallet: 5000,
    instantBonus: 2000,
    hierarchyCap: 10000,

    requirements: {
      Diamond: 1,
      Amethyst: 1,
      Topaz: 2,
      Sapphire: 2,
    },
  },
};


const RANK_ORDER: RankName[] = [
  "Ruby",
  "Emerald",
  "Sapphire",
  "Topaz",
  "Amethyst",
  "Diamond",
  "Crown Jewel",
];


// ============================================================
// HELPERS
// ============================================================

const normalizeRank = (
  rank?: string | null
): RankName | null => {

  if (!rank) {
    return null;
  }

  const normalized = rank
    .trim()
    .toLowerCase()
    .replace(/_/g, " ");

  const match = RANK_ORDER.find(
    (item) => item.toLowerCase() === normalized
  );

  return match || null;
};


const formatMoney = (
  amount: string | number | undefined | null
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
) => {

  const value = Number(amount || 0);

<<<<<<< HEAD


  if (!Number.isFinite(value)) {

    return "$0.00";

  }



  return `$${value.toFixed(2)}`;

};



const getRankIcon = (rank?: string | null) => {

  const colorClass = "text-[#B76E79]";



  if (rank === "Crown Jewel") {

    return (

      <Crown

        className={`h-7 w-7 ${colorClass}`}

      />

    );

  }



  if (

    rank &&

    RANK_ORDER.includes(rank as RankName)

  ) {

    return (

      <Gem

        className={`h-7 w-7 ${colorClass}`}

      />

    );

  }



  return (

    <Trophy

      className={`h-7 w-7 ${colorClass}`}

    />

  );

};



const getRequirementText = (

  rank: RankName

=======
  if (!Number.isFinite(value)) {
    return "$0.00";
  }

  return `$${value.toFixed(2)}`;
};


const getRankIcon = (rank?: string | null) => {

  const colorClass = "text-purple-600";

  if (rank === "Crown Jewel") {
    return (
      <Crown
        className={`h-7 w-7 ${colorClass}`}
      />
    );
  }

  if (
    rank &&
    RANK_ORDER.includes(rank as RankName)
  ) {
    return (
      <Gem
        className={`h-7 w-7 ${colorClass}`}
      />
    );
  }

  return (
    <Trophy
      className={`h-7 w-7 ${colorClass}`}
    />
  );
};


const getRequirementText = (
  rank: RankName
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
) => {

  const config = RANK_CONFIG[rank];

<<<<<<< HEAD


  if (rank === "Ruby") {

    return `${config.directsRequired || 10} direct users`;

  }



  if (!config.requirements) {

    return "";

  }



  const parts = Object.entries(

    config.requirements

  ).map(

    ([requiredRank, count]) =>

      `${count} ${requiredRank}`

  );



  return `${parts.join(

    " + "

  )} in different direct legs`;

};



// ============================================================

// COMPONENT

// ============================================================



const RankHierarchy: React.FC = () => {

  const [rankData, setRankData] =

    useState<RankStatusResponse>({

      current_rank: null,

      current_rank_display: null,

      rank_history: [],

      next_rank: null,

    });



  const [bonusData, setBonusData] =

    useState<BonusStatusResponse>({

      success: false,

      ranks: [],

    });



  const [walletData, setWalletData] =

    useState<WalletResponse>({

      balance: 0,

      total_earned: 0,

      total_withdrawn: 0,

    });



  const [circleData, setCircleData] =

    useState<CircleSummary>({

      direct_members: 0,

      all_circle_members: 0,

      total_legs: 0,

    });



  const [loading, setLoading] =

    useState(true);



  const [refreshing, setRefreshing] =

    useState(false);



  const [error, setError] =

    useState("");



  // ==========================================================

  // FETCH

  // ==========================================================



  const rankRequestInFlight = useRef(false);



  const fetchRank = async () => {

    if (rankRequestInFlight.current) return;

    rankRequestInFlight.current = true;



=======
  if (rank === "Ruby") {
    return `${config.directsRequired || 10} direct users`;
  }

  if (!config.requirements) {
    return "";
  }

  const parts = Object.entries(
    config.requirements
  ).map(
    ([requiredRank, count]) =>
      `${count} ${requiredRank}`
  );

  return `${parts.join(
    " + "
  )} in different direct legs`;
};


// ============================================================
// COMPONENT
// ============================================================

const RankHierarchy: React.FC = () => {

  const [rankData, setRankData] =
    useState<RankStatusResponse>({
      current_rank: null,
      current_rank_display: null,
      rank_history: [],
      next_rank: null,
    });


  const [bonusData, setBonusData] =
    useState<BonusStatusResponse>({
      success: false,
      ranks: [],
    });


  const [walletData, setWalletData] =
    useState<WalletResponse>({
      balance: 0,
      total_earned: 0,
      total_withdrawn: 0,
    });


  const [circleData, setCircleData] =
    useState<CircleSummary>({
      direct_members: 0,
      all_circle_members: 0,
      total_legs: 0,
    });


  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState("");


  // ==========================================================
  // FETCH
  // ==========================================================

  const rankRequestInFlight = useRef(false);

  const fetchRank = async () => {

    if (rankRequestInFlight.current) return;
    rankRequestInFlight.current = true;

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
    try {

      setError("");

<<<<<<< HEAD


      const token =

        localStorage.getItem("access_token");



=======
      const token =
        localStorage.getItem("access_token");

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
      if (!token) {

        setError("Please login first.");

        return;
<<<<<<< HEAD

      }



      const headers = {

        Authorization: `Bearer ${token}`,

        "Content-Type": "application/json",

      };



      // Complete evaluation before reading rank, bonus, or wallet data.

      const evaluationResponse = await fetch(

        `${API_URL}/api/rank/evaluate`,

        { method: "POST", headers }

      );



      if (evaluationResponse.status === 401) {

        setError(

          "Session expired. Please login again."

        );

        return;

      }



      if (!evaluationResponse.ok) {

        throw new Error(

          `Rank evaluation failed (HTTP ${evaluationResponse.status}). Please try again or contact support.`

        );

      }



      const evaluationResult =

        await evaluationResponse.json();



      if (evaluationResult.success !== true) {

        throw new Error(

          "Rank evaluation did not complete. Please try again or contact support."

        );

      }



      const [

        rankResponse,

        bonusResponse,

        walletResponse,

        circleResponse,

      ] = await Promise.all([

        fetch(

          `${API_URL}/api/rank/status`,

          {

            method: "GET",

            headers,

          }

        ),



        fetch(

          `${API_URL}/api/rank/bonus-status`,

          {

            method: "GET",

            headers,

          }

        ),



        fetch(

          `${API_URL}/api/income-wallet`,

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

      ]);



      if (rankResponse.status === 401) {

        setError(

          "Session expired. Please login again."

        );

        return;

      }



      if (!rankResponse.ok) {

        throw new Error(

          "Failed to load rank status."

        );

      }



      const rankResult =

        await rankResponse.json();



      setRankData(rankResult);



      if (bonusResponse.ok) {

        const result =

          await bonusResponse.json();



        setBonusData(result);

      }



      if (walletResponse.ok) {

        const result =

          await walletResponse.json();



        setWalletData(result);

      }



      if (circleResponse.ok) {

        const result =

          await circleResponse.json();



        setCircleData(result);

=======
      }


      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };


      // Complete evaluation before reading rank, bonus, or wallet data.
      const evaluationResponse = await fetch(
        `${API_URL}/api/rank/evaluate`,
        { method: "POST", headers }
      );

      if (evaluationResponse.status === 401) {
        setError("Session expired. Please login again.");
        return;
      }

      if (!evaluationResponse.ok) {
        throw new Error(
          `Rank evaluation failed (HTTP ${evaluationResponse.status}). Please try again or contact support.`
        );
      }

      const evaluationResult = await evaluationResponse.json();
      if (evaluationResult.success !== true) {
        throw new Error("Rank evaluation did not complete. Please try again or contact support.");
      }

      const [
        rankResponse,
        bonusResponse,
        walletResponse,
        circleResponse,
      ] = await Promise.all([

        fetch(
          `${API_URL}/api/rank/status`,
          {
            method: "GET",
            headers,
          }
        ),

        fetch(
          `${API_URL}/api/rank/bonus-status`,
          {
            method: "GET",
            headers,
          }
        ),

        fetch(
          `${API_URL}/api/income-wallet`,
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
      ]);


      if (rankResponse.status === 401) {

        setError(
          "Session expired. Please login again."
        );

        return;
      }


      if (!rankResponse.ok) {

        throw new Error(
          "Failed to load rank status."
        );
      }


      const rankResult =
        await rankResponse.json();

      setRankData(rankResult);


      if (bonusResponse.ok) {

        const result =
          await bonusResponse.json();

        setBonusData(result);
      }


      if (walletResponse.ok) {

        const result =
          await walletResponse.json();

        setWalletData(result);
      }


      if (circleResponse.ok) {

        const result =
          await circleResponse.json();

        setCircleData(result);
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
      }

    } catch (err) {

      console.error(
<<<<<<< HEAD

        "Rank API Error:",

        err

      );



      setError(

        err instanceof Error

          ? err.message

          : "Unable to load rank details."

=======
        "Rank API Error:",
        err
      );

      setError(
        err instanceof Error ? err.message : "Unable to load rank details."
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
      );

    } finally {

      rankRequestInFlight.current = false;
<<<<<<< HEAD

      setLoading(false);

      setRefreshing(false);

    }

  };



=======
      setLoading(false);
      setRefreshing(false);
    }
  };


>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
  useEffect(() => {

    fetchRank();

  }, []);


<<<<<<< HEAD

=======
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
  const handleRefresh = async () => {

    setRefreshing(true);

    await fetchRank();
<<<<<<< HEAD

  };



  // ==========================================================

  // CURRENT RANK

  // ==========================================================



  const currentRank =

    normalizeRank(

      rankData.current_rank_display ||

        rankData.current_rank

    );



  const currentRankHistory =

    useMemo(() => {

      if (!currentRank) {

        return undefined;

      }



      return (

        rankData.rank_history || []

      ).find(

        (item) =>

          normalizeRank(

            item.display_name ||

              item.rank_name

          ) === currentRank

      );

    }, [

      currentRank,

      rankData.rank_history,

    ]);



  const currentConfig =

    currentRank

      ? RANK_CONFIG[currentRank]

      : null;



  const currentBonusStatus =

    useMemo(() => {

      if (!currentRank) {

        return undefined;

      }



      return (

        bonusData.ranks || []

      ).find(

        (item) =>

          normalizeRank(

            item.display_name ||

              item.rank_name

          ) === currentRank

      );

    }, [

      currentRank,

      bonusData.ranks,

    ]);



  const walletBalance =

    Number(

      walletData.balance ??

        currentBonusStatus?.status

          ?.current_wallet_balance ??

        0

    );



  const totalDirects =

    Number(

      circleData.direct_members || 0

    );



  // ==========================================================

  // CURRENT BONUS

  // ==========================================================



  const instantBonusReceived =

    Boolean(

      currentRankHistory

        ?.instant_bonus_credited ||

        currentBonusStatus

          ?.status

          ?.already_claimed

    );



  const instantBonusReceivedAmount =

    Number(

      currentRankHistory

        ?.instant_bonus_received ||

        (instantBonusReceived

          ? currentConfig?.instantBonus

          : 0) ||

        0

    );



  const currentWalletRequired =

    Number(

      currentRankHistory

        ?.wallet_maintain ||

        currentConfig?.wallet ||

        0

    );



  const currentHierarchyCap =

    Number(

      currentRankHistory

        ?.hierarchy_cap ||

        currentConfig?.hierarchyCap ||

        0

    );



  const walletMaintained =

    currentRank

      ? walletBalance >=

        currentWalletRequired

      : false;



  // ==========================================================

  // NEXT RANK

  // ==========================================================



  const nextRank =

    normalizeRank(

      rankData.next_rank

        ?.display_name ||

        rankData.next_rank

          ?.rank_name

    );



  const nextRankConfig =

    nextRank

      ? RANK_CONFIG[nextRank]

      : null;



  const nextQualification =

    rankData.next_rank

      ?.qualification;



  // ==========================================================

  // RANK PROGRESS

  // ==========================================================



  const progress =

=======
  };


  // ==========================================================
  // CURRENT RANK
  // ==========================================================

  const currentRank =
    normalizeRank(
      rankData.current_rank_display ||
      rankData.current_rank
    );


  const currentRankHistory =
    useMemo(() => {

      if (!currentRank) {
        return undefined;
      }

      return (
        rankData.rank_history || []
      ).find(
        (item) =>
          normalizeRank(
            item.display_name ||
            item.rank_name
          ) === currentRank
      );

    }, [
      currentRank,
      rankData.rank_history,
    ]);


  const currentConfig =
    currentRank
      ? RANK_CONFIG[currentRank]
      : null;


  const currentBonusStatus =
    useMemo(() => {

      if (!currentRank) {
        return undefined;
      }

      return (
        bonusData.ranks || []
      ).find(
        (item) =>
          normalizeRank(
            item.display_name ||
            item.rank_name
          ) === currentRank
      );

    }, [
      currentRank,
      bonusData.ranks,
    ]);


  const walletBalance =
    Number(
      walletData.balance ??
      currentBonusStatus?.status
        ?.current_wallet_balance ??
      0
    );


  const totalDirects =
    Number(
      circleData.direct_members || 0
    );


  // ==========================================================
  // CURRENT BONUS
  // ==========================================================

  const instantBonusReceived =
    Boolean(
      currentRankHistory
        ?.instant_bonus_credited ||
      currentBonusStatus
        ?.status
        ?.already_claimed
    );


  const instantBonusReceivedAmount =
    Number(
      currentRankHistory
        ?.instant_bonus_received ||
      (
        instantBonusReceived
          ? currentConfig?.instantBonus
          : 0
      ) ||
      0
    );


  const currentWalletRequired =
    Number(
      currentRankHistory
        ?.wallet_maintain ||
      currentConfig?.wallet ||
      0
    );


  const currentHierarchyCap =
    Number(
      currentRankHistory
        ?.hierarchy_cap ||
      currentConfig?.hierarchyCap ||
      0
    );


  const walletMaintained =
    currentRank
      ? walletBalance >= currentWalletRequired
      : false;


  // ==========================================================
  // NEXT RANK
  // ==========================================================

  const nextRank =
    normalizeRank(
      rankData.next_rank
        ?.display_name ||
      rankData.next_rank
        ?.rank_name
    );


  const nextRankConfig =
    nextRank
      ? RANK_CONFIG[nextRank]
      : null;


  const nextQualification =
    rankData.next_rank
      ?.qualification;


  // ==========================================================
  // RANK PROGRESS
  // ==========================================================

  const progress =
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
    useMemo(() => {

      if (!nextRank || !nextRankConfig) {

        return currentRank
<<<<<<< HEAD

          ? 100

          : 0;

      }



      if (nextRank === "Ruby") {

        const required =

          Number(

            nextQualification

              ?.required_directs ||

              nextRankConfig

                .directsRequired ||

              10

          );



        const available =

          Number(

            nextQualification

              ?.direct_count ||

              totalDirects

          );



        return Math.min(

          100,

          required > 0

            ? (available / required) *

              100

            : 0

        );

      }



      if (

        nextQualification

          ?.qualified

      ) {

        return 100;

      }



      const requiredLegs =

        Number(

          nextQualification

            ?.required_distinct_legs ||

            Object.values(

              nextRankConfig.requirements ||

                {}

            ).reduce(

              (total, value) =>

                total + Number(value),

              0

            )

        );



      const matchedLegs =

        Number(

          nextQualification

            ?.matched_legs

            ?.length || 0

        );



      if (

        requiredLegs > 0 &&

        matchedLegs > 0

      ) {

        return Math.min(

          100,

          (matchedLegs /

            requiredLegs) *

            100

        );

      }



      return 0;

    }, [

      nextRank,

      nextRankConfig,

      nextQualification,

      currentRank,

      totalDirects,

    ]);



  // ==========================================================

  // RANK HISTORY HELPERS

  // ==========================================================



  const getRankHistory =

    (rank: RankName) => {

      return (

        rankData.rank_history || []

      ).find(

        (item) =>

          normalizeRank(

            item.display_name ||

              item.rank_name

          ) === rank

      );

    };



  const getRankBonusStatus =

    (rank: RankName) => {

      return (

        bonusData.ranks || []

      ).find(

        (item) =>

          normalizeRank(

            item.display_name ||

              item.rank_name

          ) === rank

      );

    };



  const currentRankIndex =

    currentRank

      ? RANK_ORDER.indexOf(currentRank)

      : -1;



  // ==========================================================

  // UI

  // ==========================================================



  return (

    <>

      <UserNavbar />



      <div className="flex min-h-screen w-full bg-[#FFF9FA] text-gray-900">

        <div className="flex min-w-0 flex-1 flex-col">

          <main className="flex-1 bg-gradient-to-br from-[#FFF9FA] via-[#FDF3F5] to-white p-4 sm:p-6 lg:p-8">
=======
          ? 100
          : 0;
      }


      if (nextRank === "Ruby") {

        const required =
          Number(
            nextQualification
              ?.required_directs ||
            nextRankConfig
              .directsRequired ||
            10
          );

        const available =
          Number(
            nextQualification
              ?.direct_count ||
            totalDirects
          );

        return Math.min(
          100,
          required > 0
            ? (
              available /
              required
            ) * 100
            : 0
        );
      }


      if (
        nextQualification
          ?.qualified
      ) {
        return 100;
      }


      const requiredLegs =
        Number(
          nextQualification
            ?.required_distinct_legs ||
          Object.values(
            nextRankConfig.requirements || {}
          ).reduce(
            (total, value) =>
              total + Number(value),
            0
          )
        );


      const matchedLegs =
        Number(
          nextQualification
            ?.matched_legs
            ?.length ||
          0
        );


      if (
        requiredLegs > 0 &&
        matchedLegs > 0
      ) {

        return Math.min(
          100,
          (
            matchedLegs /
            requiredLegs
          ) * 100
        );
      }


      return 0;

    }, [
      nextRank,
      nextRankConfig,
      nextQualification,
      currentRank,
      totalDirects,
    ]);


  // ==========================================================
  // RANK HISTORY HELPERS
  // ==========================================================

  const getRankHistory =
    (rank: RankName) => {

      return (
        rankData.rank_history || []
      ).find(
        (item) =>
          normalizeRank(
            item.display_name ||
            item.rank_name
          ) === rank
      );
    };


  const getRankBonusStatus =
    (rank: RankName) => {

      return (
        bonusData.ranks || []
      ).find(
        (item) =>
          normalizeRank(
            item.display_name ||
            item.rank_name
          ) === rank
      );
    };


  const currentRankIndex =
    currentRank
      ? RANK_ORDER.indexOf(currentRank)
      : -1;


  // ==========================================================
  // UI
  // ==========================================================

  return (
    <>
      <UserNavbar />

      <div className="flex min-h-screen w-full bg-gray-50 text-gray-900">

        <div className="flex min-w-0 flex-1 flex-col">

          <main className="flex-1 bg-gray-50 p-4 sm:p-6 lg:p-8">
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

            {loading ? (

              <div className="flex min-h-[60vh] items-center justify-center">

                <div className="text-center">

<<<<<<< HEAD
                  <RefreshCw className="mx-auto mb-4 h-8 w-8 animate-spin text-[#B76E79]" />



                  <p className="text-gray-500">

                    Loading rank details...

=======
                  <RefreshCw className="mx-auto mb-4 h-8 w-8 animate-spin text-purple-600" />

                  <p className="text-gray-500">
                    Loading rank details...
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                  </p>

                </div>

              </div>

            ) : (

              <div className="mx-auto max-w-7xl">

                {/* ==================================================
<<<<<<< HEAD

                    HEADER

                ================================================== */}



=======
                    HEADER
                ================================================== */}

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                  <div className="flex items-center gap-3">

<<<<<<< HEAD
                    <div className="rounded-2xl border border-[#D99AA3]/40 bg-[#FFE5E8] p-3">

                      {getRankIcon(

                        currentRank

=======
                    <div className="rounded-2xl border border-purple-200 bg-purple-100 p-3">

                      {getRankIcon(
                        currentRank
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                      )}

                    </div>

<<<<<<< HEAD


                    <div>

                      <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">

                        My Rank

                      </h1>



                      <p className="mt-1 text-gray-500">

                        Track your rank, team growth and rewards

=======
                    <div>

                      <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
                        My Rank
                      </h1>

                      <p className="mt-1 text-gray-500">
                        Track your rank, team growth and rewards
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                      </p>

                    </div>

                  </div>


<<<<<<< HEAD

                  <button

                    onClick={handleRefresh}

                    disabled={refreshing}

                    className="flex items-center justify-center gap-2 rounded-xl border border-[#E3AAB2]/40 bg-white px-4 py-2 transition hover:border-[#D99AA3]/60 hover:bg-[#FFF0F2] disabled:opacity-50"

                  >

                    <RefreshCw

                      className={`h-4 w-4 ${

                        refreshing

                          ? "animate-spin"

                          : ""

                      }`}

                    />



=======
                  <button
                    onClick={handleRefresh}
                    disabled={refreshing}
                    className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 transition hover:bg-gray-50 disabled:opacity-50"
                  >

                    <RefreshCw
                      className={`h-4 w-4 ${
                        refreshing
                          ? "animate-spin"
                          : ""
                      }`}
                    />

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                    Refresh

                  </button>

                </div>


<<<<<<< HEAD

                {/* ==================================================

                    ERROR

                ================================================== */}



                {error && (

                  <div className="mb-6 rounded-2xl border border-[#D99AA3]/50 bg-[#FFE5E8]/70 px-5 py-4 text-[#8F4F5A]">

                    {error}

=======
                {/* ==================================================
                    ERROR
                ================================================== */}

                {error && (

                  <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-red-700">
                    {error}
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                  </div>

                )}


<<<<<<< HEAD

                {/* ==================================================

                    CURRENT RANK CARD

                ================================================== */}



                <div className="relative mb-6 overflow-hidden rounded-3xl border border-[#D99AA3]/40 bg-gradient-to-br from-[#FFF0F2] via-white to-[#FFF9FA] p-6 md:p-8">

                  <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#D99AA3]/20 blur-3xl" />

=======
                {/* ==================================================
                    CURRENT RANK CARD
                ================================================== */}

                <div className="relative mb-6 overflow-hidden rounded-3xl border border-purple-200 bg-gradient-to-br from-purple-50 via-white to-white p-6 md:p-8">

                  <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-purple-200/40 blur-3xl" />
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d


                  <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

                    <div className="flex items-center gap-5">

<<<<<<< HEAD
                      <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-[#D99AA3]/40 bg-[#FFE5E8] text-[#B76E79]">

                        {getRankIcon(

                          currentRank

=======
                      <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-purple-200 bg-purple-100 text-purple-600">

                        {getRankIcon(
                          currentRank
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                        )}

                      </div>


<<<<<<< HEAD

                      <div>

                        <p className="text-sm text-gray-500">

                          Current Rank

                        </p>



                        <h2 className="mt-1 text-3xl font-bold text-gray-900 md:text-4xl">

                          {currentRank ||

=======
                      <div>

                        <p className="text-sm text-gray-500">
                          Current Rank
                        </p>

                        <h2 className="mt-1 text-3xl font-bold text-gray-900 md:text-4xl">

                          {currentRank ||
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                            "No Rank"}

                        </h2>


<<<<<<< HEAD

                        <div className="mt-2 flex items-center gap-2">

                          <span

                            className={`h-2 w-2 rounded-full ${

                              currentRank

                                ? "bg-[#B76E79]"

                                : "bg-gray-400"

                            }`}

                          />



                          <span

                            className={`text-sm ${

                              currentRank

                                ? "text-[#8F4F5A]"

                                : "text-gray-500"

                            }`}

                          >

                            {currentRank

                              ? "Rank Achieved"

=======
                        <div className="mt-2 flex items-center gap-2">

                          <span
                            className={`h-2 w-2 rounded-full ${
                              currentRank
                                ? "bg-green-500"
                                : "bg-gray-400"
                            }`}
                          />

                          <span
                            className={`text-sm ${
                              currentRank
                                ? "text-green-600"
                                : "text-gray-500"
                            }`}
                          >

                            {currentRank
                              ? "Rank Achieved"
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                              : "Rank Not Achieved"}

                          </span>

                        </div>

                      </div>

                    </div>


<<<<<<< HEAD

                    {/* Instant Bonus */}



                    <div className="min-w-[250px] rounded-2xl border border-[#E3AAB2]/35 bg-white px-6 py-5">

                      <p className="text-sm text-gray-500">

                        Instant Rank Bonus

                      </p>



                      <div className="mt-1 flex items-center gap-2">

                        <p className="text-3xl font-bold text-[#B76E79]">

                          {formatMoney(

                            currentConfig

                              ?.instantBonus ||

                              0

=======
                    {/* Instant Bonus */}

                    <div className="min-w-[250px] rounded-2xl border border-gray-200 bg-white px-6 py-5">

                      <p className="text-sm text-gray-500">
                        Instant Rank Bonus
                      </p>


                      <div className="mt-1 flex items-center gap-2">

                        <p className="text-3xl font-bold text-purple-600">

                          {formatMoney(
                            currentConfig
                              ?.instantBonus ||
                            0
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                          )}

                        </p>


<<<<<<< HEAD

                        {instantBonusReceived && (

                          <CheckCircle2 className="h-6 w-6 text-[#B76E79]" />
=======
                        {instantBonusReceived && (

                          <CheckCircle2 className="h-6 w-6 text-green-500" />
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

                        )}

                      </div>


<<<<<<< HEAD

=======
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                      {currentRank ? (

                        instantBonusReceived ? (

<<<<<<< HEAD
                          <p className="mt-2 text-xs font-semibold text-[#8F4F5A]">

                            RECEIVED •{" "}

                            {formatMoney(

                              instantBonusReceivedAmount

=======
                          <p className="mt-2 text-xs font-semibold text-green-600">

                            RECEIVED •{" "}
                            {formatMoney(
                              instantBonusReceivedAmount
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                            )}

                          </p>

                        ) : walletMaintained ? (

<<<<<<< HEAD
                          <p className="mt-2 text-xs font-semibold text-[#B76E79]">
=======
                          <p className="mt-2 text-xs font-semibold text-yellow-600">
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

                            Eligible for one-time reward

                          </p>

                        ) : (

                          <p className="mt-2 text-xs text-gray-400">

                            Maintain{" "}
<<<<<<< HEAD

                            {formatMoney(

                              currentWalletRequired

                            )}{" "}

=======
                            {formatMoney(
                              currentWalletRequired
                            )}{" "}
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                            Income Wallet

                          </p>

                        )

                      ) : (

                        <p className="mt-2 text-xs text-gray-400">
<<<<<<< HEAD

                          Achieve Ruby to unlock

=======
                          Achieve Ruby to unlock
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                        </p>

                      )}

                    </div>

                  </div>

                </div>


<<<<<<< HEAD

                {/* ==================================================

                    STATS

                ================================================== */}



                <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

                  {/* Directs */}



                  <div className="rounded-2xl border border-[#E3AAB2]/30 bg-white p-5 shadow-sm">
=======
                {/* ==================================================
                    STATS
                ================================================== */}

                <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">


                  {/* Directs */}

                  <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

                    <div className="flex items-center justify-between">

                      <div>

                        <p className="text-sm text-gray-500">
<<<<<<< HEAD

                          Total Directs

                        </p>



                        <p className="mt-1 text-3xl font-bold text-gray-900">

                          {totalDirects}

                        </p>



                        {currentRank ===

                          "Ruby" && (

                          <p className="mt-2 text-xs text-[#8F4F5A]">
=======
                          Total Directs
                        </p>

                        <p className="mt-1 text-3xl font-bold text-gray-900">
                          {totalDirects}
                        </p>

                        {currentRank === "Ruby" && (

                          <p className="mt-2 text-xs text-green-600">
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

                            Ruby requirement: 10

                          </p>

                        )}

                      </div>


<<<<<<< HEAD

                      <div className="rounded-xl bg-[#FFE5E8] p-3 text-[#8F4F5A]">
=======
                      <div className="rounded-xl bg-blue-100 p-3 text-blue-600">
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

                        <Users className="h-6 w-6" />

                      </div>

                    </div>

                  </div>


<<<<<<< HEAD

                  {/* Wallet */}



                  <div className="rounded-2xl border border-[#E3AAB2]/30 bg-white p-5 shadow-sm">
=======
                  {/* Wallet */}

                  <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

                    <div className="flex items-center justify-between">

                      <div>

                        <p className="text-sm text-gray-500">
<<<<<<< HEAD

                          Income Wallet

                        </p>



                        <p className="mt-1 text-3xl font-bold text-gray-900">

                          {formatMoney(

                            walletBalance

=======
                          Income Wallet
                        </p>

                        <p className="mt-1 text-3xl font-bold text-gray-900">

                          {formatMoney(
                            walletBalance
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                          )}

                        </p>


<<<<<<< HEAD

                        {currentRank && (

                          <p

                            className={`mt-2 text-xs ${

                              walletMaintained

                                ? "text-[#8F4F5A]"

                                : "text-[#B76E79]"

                            }`}

                          >

                            Required:{" "}

                            {formatMoney(

                              currentWalletRequired

                            )}



                            {walletMaintained

                              ? " ✓"

=======
                        {currentRank && (

                          <p
                            className={`mt-2 text-xs ${
                              walletMaintained
                                ? "text-green-600"
                                : "text-red-500"
                            }`}
                          >

                            Required:{" "}
                            {formatMoney(
                              currentWalletRequired
                            )}

                            {walletMaintained
                              ? " ✓"
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                              : ""}

                          </p>

                        )}

                      </div>


<<<<<<< HEAD

                      <div className="rounded-xl bg-[#FFE5E8] p-3 text-[#8F4F5A]">
=======
                      <div className="rounded-xl bg-green-100 p-3 text-green-600">
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

                        <Wallet className="h-6 w-6" />

                      </div>

                    </div>

                  </div>


<<<<<<< HEAD

                  {/* Instant Bonus */}



                  <div className="rounded-2xl border border-[#E3AAB2]/30 bg-white p-5 shadow-sm">
=======
                  {/* Instant Bonus */}

                  <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

                    <div className="flex items-center justify-between">

                      <div>

                        <p className="text-sm text-gray-500">
<<<<<<< HEAD

                          Instant Rank Bonus

                        </p>



                        <p className="mt-1 text-3xl font-bold text-gray-900">

                          {formatMoney(

                            instantBonusReceivedAmount

=======
                          Instant Rank Bonus
                        </p>

                        <p className="mt-1 text-3xl font-bold text-gray-900">

                          {formatMoney(
                            instantBonusReceivedAmount
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                          )}

                        </p>


<<<<<<< HEAD

                        <p

                          className={`mt-2 text-xs ${

                            instantBonusReceived

                              ? "text-[#8F4F5A]"

                              : "text-gray-400"

                          }`}

                        >

                          {instantBonusReceived

                            ? "One-time reward received ✓"

=======
                        <p
                          className={`mt-2 text-xs ${
                            instantBonusReceived
                              ? "text-green-600"
                              : "text-gray-400"
                          }`}
                        >

                          {instantBonusReceived
                            ? "One-time reward received ✓"
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                            : "No reward received yet"}

                        </p>

                      </div>


<<<<<<< HEAD

                      <div className="rounded-xl bg-[#FFE5E8] p-3 text-[#8F4F5A]">
=======
                      <div className="rounded-xl bg-yellow-100 p-3 text-yellow-600">
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

                        <Trophy className="h-6 w-6" />

                      </div>

                    </div>

                  </div>


<<<<<<< HEAD

                  {/* Hierarchy Cap */}



                  <div className="rounded-2xl border border-[#D99AA3]/40 bg-[#FFF0F2] p-5 shadow-sm">
=======
                  {/* Hierarchy Cap */}

                  <div className="rounded-2xl border border-purple-200 bg-purple-50 p-5 shadow-sm">
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

                    <div className="flex items-center justify-between">

                      <div>

                        <p className="text-sm text-gray-500">
<<<<<<< HEAD

                          Rank Hierarchy Cap

                        </p>



                        <p className="mt-1 text-3xl font-bold text-[#8F4F5A]">

                          {formatMoney(

                            currentHierarchyCap

=======
                          Rank Hierarchy Cap
                        </p>

                        <p className="mt-1 text-3xl font-bold text-purple-600">

                          {formatMoney(
                            currentHierarchyCap
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                          )}

                        </p>


<<<<<<< HEAD

                        <p className="mt-2 text-xs text-gray-500">

                          {currentRank

                            ? `${formatMoney(

                                currentWalletRequired

                              )} maintain × 2`

=======
                        <p className="mt-2 text-xs text-gray-500">

                          {currentRank
                            ? `${formatMoney(
                                currentWalletRequired
                              )} maintain × 2`
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                            : "Unlock with rank"}

                        </p>

                      </div>


<<<<<<< HEAD

                      <div className="rounded-xl bg-[#FFE5E8] p-3 text-[#8F4F5A]">
=======
                      <div className="rounded-xl bg-purple-100 p-3 text-purple-600">
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

                        <Zap className="h-6 w-6" />

                      </div>

                    </div>

                  </div>

                </div>


<<<<<<< HEAD

                {/* ==================================================

                    NEXT RANK

                ================================================== */}



                {nextRank &&

                  nextRankConfig && (

                    <div className="mb-6 rounded-3xl border border-[#E3AAB2]/30 bg-white p-6 shadow-sm md:p-8">

                      <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">

                        <div>

                          <p className="text-sm text-gray-500">

                            Next Rank

                          </p>



                          <div className="mt-2 flex items-center gap-3">

                            <div className="rounded-xl bg-[#FFE5E8] p-3 text-[#B76E79]">

                              {getRankIcon(

                                nextRank

                              )}

                            </div>



                            <div>

                              <h3 className="text-2xl font-bold text-gray-900">

                                {nextRank}

                              </h3>



                              <p className="mt-1 text-sm text-gray-500">

                                {getRequirementText(

                                  nextRank

                                )}

                              </p>

                            </div>

                          </div>

                        </div>



                        <div className="text-left md:text-right">

                          <p className="text-sm text-gray-500">

                            Instant Bonus

                          </p>



                          <p className="mt-1 text-2xl font-bold text-[#B76E79]">

                            {formatMoney(

                              nextRankConfig.instantBonus

                            )}

                          </p>



                          <p className="mt-1 text-xs text-gray-400">

                            Hierarchy cap:{" "}

                            {formatMoney(

                              nextRankConfig.hierarchyCap

                            )}

                          </p>

                        </div>

                      </div>



                      {/* Progress */}



                      <div className="mt-7">

                        <div className="mb-2 flex items-center justify-between">

                          <span className="text-sm text-gray-500">

                            Rank Progress

                          </span>



                          <span className="text-sm font-semibold text-gray-900">

                            {progress.toFixed(0)}%

                          </span>

                        </div>



                        <div className="h-2 overflow-hidden rounded-full bg-[#FFE5E8]">

                          <div

                            className="h-full rounded-full bg-gradient-to-r from-[#8F4F5A] via-[#B76E79] to-[#D99AA3] transition-all duration-500"

                            style={{

                              width: `${progress}%`,

                            }}

                          />

                        </div>

                      </div>



                      {/* Next Rank Details */}



                      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">

                        <div className="rounded-2xl border border-[#E3AAB2]/30 bg-[#FFF9FA] p-4">

                          <p className="text-xs text-gray-400">

                            Wallet Maintenance

                          </p>



                          <p className="mt-1 text-xl font-bold text-gray-900">

                            {formatMoney(

                              nextRankConfig.wallet

                            )}

                          </p>

                        </div>



                        <div className="rounded-2xl border border-[#E3AAB2]/30 bg-[#FFF9FA] p-4">

                          <p className="text-xs text-gray-400">

                            One-Time Instant Reward

                          </p>



                          <p className="mt-1 text-xl font-bold text-gray-900">

                            {formatMoney(

                              nextRankConfig.instantBonus

                            )}

                          </p>

                        </div>



                        <div className="rounded-2xl border border-[#D99AA3]/40 bg-[#FFF0F2] p-4">

                          <p className="text-xs text-gray-400">

                            Rank Hierarchy Cap

                          </p>



                          <p className="mt-1 text-xl font-bold text-[#8F4F5A]">

                            {formatMoney(

                              nextRankConfig.hierarchyCap

                            )}

                          </p>

                        </div>

                      </div>



                      {nextQualification &&

                        nextRank !== "Ruby" && (

                          <div className="mt-5 rounded-2xl border border-[#D99AA3]/40 bg-[#FFF0F2] p-4">

                            <p className="text-sm font-semibold text-[#8F4F5A]">

                              Different-Leg Requirement

                            </p>



                            <p className="mt-1 text-sm text-gray-600">

                              Required distinct legs:{" "}

                              <strong>

                                {nextQualification

                                  .required_distinct_legs ||

                                  0}

                              </strong>



                              {" • "}



                              Your root legs:{" "}

                              <strong>

                                {nextQualification

                                  .available_root_legs ||

                                  circleData.total_legs ||

                                  0}

                              </strong>

=======
                {/* ==================================================
                    NEXT RANK
                ================================================== */}

                {nextRank &&
                  nextRankConfig && (

                  <div className="mb-6 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">

                    <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">


                      <div>

                        <p className="text-sm text-gray-500">
                          Next Rank
                        </p>


                        <div className="mt-2 flex items-center gap-3">

                          <div className="rounded-xl bg-purple-100 p-3 text-purple-600">

                            {getRankIcon(
                              nextRank
                            )}

                          </div>


                          <div>

                            <h3 className="text-2xl font-bold text-gray-900">
                              {nextRank}
                            </h3>

                            <p className="mt-1 text-sm text-gray-500">

                              {getRequirementText(
                                nextRank
                              )}

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                            </p>

                          </div>

<<<<<<< HEAD
                        )}

                    </div>

                  )}



                {/* ==================================================

                    RANK JOURNEY

                ================================================== */}



                <div className="mb-6 rounded-3xl border border-[#E3AAB2]/30 bg-white p-6 shadow-sm md:p-8">
=======
                        </div>

                      </div>


                      <div className="text-left md:text-right">

                        <p className="text-sm text-gray-500">
                          Instant Bonus
                        </p>

                        <p className="mt-1 text-2xl font-bold text-purple-600">

                          {formatMoney(
                            nextRankConfig
                              .instantBonus
                          )}

                        </p>


                        <p className="mt-1 text-xs text-gray-400">

                          Hierarchy cap:{" "}

                          {formatMoney(
                            nextRankConfig
                              .hierarchyCap
                          )}

                        </p>

                      </div>

                    </div>


                    {/* Progress */}

                    <div className="mt-7">

                      <div className="mb-2 flex items-center justify-between">

                        <span className="text-sm text-gray-500">
                          Rank Progress
                        </span>

                        <span className="text-sm font-semibold text-gray-900">

                          {progress.toFixed(0)}%

                        </span>

                      </div>


                      <div className="h-2 overflow-hidden rounded-full bg-gray-200">

                        <div
                          className="h-full rounded-full bg-purple-500 transition-all duration-500"
                          style={{
                            width: `${progress}%`,
                          }}
                        />

                      </div>

                    </div>


                    {/* Next Rank Details */}

                    <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">


                      <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">

                        <p className="text-xs text-gray-400">
                          Wallet Maintenance
                        </p>

                        <p className="mt-1 text-xl font-bold text-gray-900">

                          {formatMoney(
                            nextRankConfig.wallet
                          )}

                        </p>

                      </div>


                      <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">

                        <p className="text-xs text-gray-400">
                          One-Time Instant Reward
                        </p>

                        <p className="mt-1 text-xl font-bold text-gray-900">

                          {formatMoney(
                            nextRankConfig
                              .instantBonus
                          )}

                        </p>

                      </div>


                      <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">

                        <p className="text-xs text-gray-400">
                          Rank Hierarchy Cap
                        </p>

                        <p className="mt-1 text-xl font-bold text-purple-600">

                          {formatMoney(
                            nextRankConfig
                              .hierarchyCap
                          )}

                        </p>

                      </div>

                    </div>


                    {nextQualification &&
                      nextRank !== "Ruby" && (

                      <div className="mt-5 rounded-2xl border border-purple-100 bg-purple-50 p-4">

                        <p className="text-sm font-semibold text-purple-700">

                          Different-Leg Requirement

                        </p>

                        <p className="mt-1 text-sm text-gray-600">

                          Required distinct legs:{" "}

                          <strong>
                            {nextQualification
                              .required_distinct_legs ||
                              0}
                          </strong>

                          {" • "}

                          Your root legs:{" "}

                          <strong>
                            {nextQualification
                              .available_root_legs ||
                              circleData.total_legs ||
                              0}
                          </strong>

                        </p>

                      </div>

                    )}

                  </div>

                )}


                {/* ==================================================
                    RANK JOURNEY
                ================================================== */}

                <div className="mb-6 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

                  <div className="mb-6 flex items-center justify-between">

                    <div>

                      <h3 className="text-xl font-bold text-gray-900">
<<<<<<< HEAD

                        Rank Journey

                      </h3>



=======
                        Rank Journey
                      </h3>

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                      <p className="mt-1 text-sm text-gray-500">

                        Instant rewards and hierarchy limits

                      </p>

                    </div>


<<<<<<< HEAD

                    <ShieldCheck className="h-6 w-6 text-[#B76E79]" />
=======
                    <ShieldCheck className="h-6 w-6 text-purple-600" />
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

                  </div>


<<<<<<< HEAD

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

                    {RANK_ORDER.map(

                      (rank) => {

                        const config =

                          RANK_CONFIG[rank];



                        const history =

                          getRankHistory(rank);



                        const bonusStatus =

                          getRankBonusStatus(rank);



                        const rankIndex =

                          RANK_ORDER.indexOf(

                            rank

                          );



                        const achieved =

                          Boolean(history);



                        const isCurrent =

                          currentRank === rank;



                        const superseded =

                          history?.status ===

                          "superseded";



                        const bonusReceived =

                          Boolean(

                            history

                              ?.instant_bonus_credited ||

                              bonusStatus

                                ?.status

                                ?.already_claimed

                          );



                        const rankWalletMaintained =

                          walletBalance >=

                          config.wallet;



                        return (

                          <div

                            key={rank}

                            className={`rounded-2xl border p-5 transition ${

                              isCurrent

                                ? "border-[#D99AA3]/60 bg-[#FFF0F2]"

                                : achieved

                                  ? "border-[#E3AAB2]/40 bg-[#FFF9FA]"

                                  : "border-gray-200 bg-gray-50"

                            }`}

=======
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

                    {RANK_ORDER.map(
                      (rank) => {

                        const config =
                          RANK_CONFIG[rank];

                        const history =
                          getRankHistory(rank);

                        const bonusStatus =
                          getRankBonusStatus(rank);

                        const rankIndex =
                          RANK_ORDER.indexOf(
                            rank
                          );

                        const achieved =
                          Boolean(history);

                        const isCurrent =
                          currentRank === rank;

                        const superseded =
                          history?.status ===
                          "superseded";

                        const bonusReceived =
                          Boolean(
                            history
                              ?.instant_bonus_credited ||
                            bonusStatus
                              ?.status
                              ?.already_claimed
                          );

                        const rankWalletMaintained =
                          walletBalance >=
                          config.wallet;


                        return (

                          <div
                            key={rank}
                            className={`rounded-2xl border p-5 transition ${
                              isCurrent
                                ? "border-purple-300 bg-purple-50"
                                : achieved
                                  ? "border-green-200 bg-green-50"
                                  : "border-gray-200 bg-gray-50"
                            }`}
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                          >

                            <div className="flex items-center justify-between">

                              <div
<<<<<<< HEAD

                                className={`rounded-xl p-3 ${

                                  isCurrent

                                    ? "bg-[#FFE5E8] text-[#B76E79]"

                                    : achieved

                                      ? "bg-[#FFE5E8] text-[#8F4F5A]"

                                      : "bg-gray-100 text-gray-400"

                                }`}

                              >

                                {getRankIcon(

                                  rank

=======
                                className={`rounded-xl p-3 ${
                                  isCurrent
                                    ? "bg-purple-100 text-purple-600"
                                    : achieved
                                      ? "bg-green-100 text-green-600"
                                      : "bg-gray-100 text-gray-400"
                                }`}
                              >

                                {getRankIcon(
                                  rank
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                                )}

                              </div>


<<<<<<< HEAD

                              {isCurrent && (

                                <span className="rounded-full bg-[#FFE5E8] px-2 py-1 text-xs font-semibold text-[#8F4F5A]">
=======
                              {isCurrent && (

                                <span className="rounded-full bg-purple-100 px-2 py-1 text-xs text-purple-700">
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

                                  CURRENT

                                </span>

                              )}


<<<<<<< HEAD

                              {!isCurrent &&

                                achieved && (

                                  <span className="rounded-full bg-[#FFF0F2] px-2 py-1 text-xs font-semibold text-[#8F4F5A]">

                                    {superseded

                                      ? "ACHIEVED"

                                      : "ACHIEVED"}

                                  </span>

                                )}



                              {!achieved &&

                                rankIndex >

                                  currentRankIndex && (

                                  <Lock className="h-4 w-4 text-gray-400" />

                                )}
=======
                              {!isCurrent &&
                                achieved && (

                                <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-700">

                                  {superseded
                                    ? "ACHIEVED"
                                    : "ACHIEVED"}

                                </span>

                              )}


                              {!achieved &&
                                rankIndex >
                                  currentRankIndex && (

                                <Lock className="h-4 w-4 text-gray-400" />

                              )}
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

                            </div>


<<<<<<< HEAD

                            <h4 className="mt-4 text-lg font-bold text-gray-900">

                              {rank}

                            </h4>



                            <p className="mt-1 min-h-[40px] text-sm text-gray-500">

                              {getRequirementText(

                                rank

=======
                            <h4 className="mt-4 text-lg font-bold text-gray-900">
                              {rank}
                            </h4>


                            <p className="mt-1 min-h-[40px] text-sm text-gray-500">

                              {getRequirementText(
                                rank
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                              )}

                            </p>


<<<<<<< HEAD

                            <div className="mt-4 space-y-3">

                              {/* Instant Bonus */}



                              <div className="flex items-center justify-between gap-2 text-sm">

                                <span className="text-gray-400">

                                  Instant Bonus

                                </span>



=======
                            <div className="mt-4 space-y-3">


                              {/* Instant Bonus */}

                              <div className="flex items-center justify-between gap-2 text-sm">

                                <span className="text-gray-400">
                                  Instant Bonus
                                </span>


>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                                <div className="text-right">

                                  <span className="font-semibold text-gray-900">

                                    {formatMoney(
<<<<<<< HEAD

                                      config.instantBonus

=======
                                      config.instantBonus
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                                    )}

                                  </span>


<<<<<<< HEAD

                                  {bonusReceived && (

                                    <div className="mt-0.5 flex items-center justify-end gap-1 text-[10px] font-semibold text-[#8F4F5A]">
=======
                                  {bonusReceived && (

                                    <div className="mt-0.5 flex items-center justify-end gap-1 text-[10px] font-semibold text-green-600">
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

                                      <CheckCircle2 className="h-3 w-3" />

                                      RECEIVED

                                    </div>

                                  )}

                                </div>

                              </div>


<<<<<<< HEAD

                              {/* Wallet */}



                              <div className="flex items-center justify-between text-sm">

                                <span className="text-gray-400">

                                  Maintain Wallet

                                </span>



                                <span

                                  className={`font-semibold ${

                                    achieved &&

                                    rankWalletMaintained

                                      ? "text-[#8F4F5A]"

                                      : "text-gray-900"

                                  }`}

                                >

                                  {formatMoney(

                                    config.wallet

=======
                              {/* Wallet */}

                              <div className="flex items-center justify-between text-sm">

                                <span className="text-gray-400">
                                  Maintain Wallet
                                </span>

                                <span
                                  className={`font-semibold ${
                                    achieved &&
                                    rankWalletMaintained
                                      ? "text-green-600"
                                      : "text-gray-900"
                                  }`}
                                >

                                  {formatMoney(
                                    config.wallet
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                                  )}

                                </span>

                              </div>


<<<<<<< HEAD

                              {/* Hierarchy Cap */}



                              <div className="flex items-center justify-between text-sm">

                                <span className="text-gray-400">

                                  Hierarchy Cap

                                </span>



                                <span className="font-semibold text-[#8F4F5A]">

                                  {formatMoney(

                                    config.hierarchyCap

=======
                              {/* Hierarchy Cap */}

                              <div className="flex items-center justify-between text-sm">

                                <span className="text-gray-400">
                                  Hierarchy Cap
                                </span>

                                <span className="font-semibold text-purple-600">

                                  {formatMoney(
                                    config.hierarchyCap
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                                  )}

                                </span>

                              </div>


<<<<<<< HEAD

                              {/* Status */}



                              <div className="border-t border-[#E3AAB2]/25 pt-3">

                                {isCurrent ? (

                                  <div className="flex items-center gap-1.5 text-xs font-semibold text-[#8F4F5A]">
=======
                              {/* Status */}

                              <div className="border-t border-gray-200 pt-3">

                                {isCurrent ? (

                                  <div className="flex items-center gap-1.5 text-xs font-semibold text-green-600">
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

                                    <CheckCircle2 className="h-4 w-4" />

                                    Rank Achieved

                                  </div>

                                ) : achieved ? (

<<<<<<< HEAD
                                  <div className="flex items-center gap-1.5 text-xs font-semibold text-[#8F4F5A]">
=======
                                  <div className="flex items-center gap-1.5 text-xs font-semibold text-green-600">
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

                                    <CheckCircle2 className="h-4 w-4" />

                                    Previously Achieved

                                  </div>

                                ) : (

                                  <div className="flex items-center gap-1.5 text-xs text-gray-400">

                                    <Clock3 className="h-4 w-4" />

                                    Not Achieved

                                  </div>

                                )}

                              </div>

                            </div>

                          </div>

                        );
<<<<<<< HEAD

                      }

=======
                      }
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                    )}

                  </div>

                </div>


<<<<<<< HEAD

                {/* ==================================================

                    NETWORK SUMMARY

                ================================================== */}



                <div className="rounded-3xl border border-[#E3AAB2]/30 bg-white p-6 shadow-sm md:p-8">
=======
                {/* ==================================================
                    NETWORK SUMMARY
                ================================================== */}

                <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

                  <div className="mb-6 flex items-center justify-between">

                    <div>

                      <h3 className="text-xl font-bold text-gray-900">
<<<<<<< HEAD

                        Rank Network

                      </h3>



=======
                        Rank Network
                      </h3>

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                      <p className="mt-1 text-sm text-gray-500">

                        Rank requirements are calculated across separate direct root legs

                      </p>

                    </div>


<<<<<<< HEAD

                    <Users className="h-6 w-6 text-[#B76E79]" />
=======
                    <Users className="h-6 w-6 text-purple-600" />
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

                  </div>


<<<<<<< HEAD

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

                    <div className="rounded-2xl border border-[#E3AAB2]/30 bg-[#FFF9FA] p-5">

                      <p className="text-sm text-gray-500">

                        Direct Members

                      </p>



                      <p className="mt-1 text-3xl font-bold text-gray-900">

                        {circleData.direct_members ||

=======
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">


                    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">

                      <p className="text-sm text-gray-500">
                        Direct Members
                      </p>

                      <p className="mt-1 text-3xl font-bold text-gray-900">

                        {circleData.direct_members ||
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                          0}

                      </p>

                    </div>


<<<<<<< HEAD

                    <div className="rounded-2xl border border-[#E3AAB2]/30 bg-[#FFF9FA] p-5">

                      <p className="text-sm text-gray-500">

                        Total Root Legs

                      </p>



                      <p className="mt-1 text-3xl font-bold text-gray-900">

                        {circleData.total_legs ||

                          circleData.direct_members ||

=======
                    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">

                      <p className="text-sm text-gray-500">
                        Total Root Legs
                      </p>

                      <p className="mt-1 text-3xl font-bold text-gray-900">

                        {circleData.total_legs ||
                          circleData.direct_members ||
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                          0}

                      </p>

                    </div>


<<<<<<< HEAD

                    <div className="rounded-2xl border border-[#E3AAB2]/30 bg-[#FFF9FA] p-5">

                      <p className="text-sm text-gray-500">

                        All Circle Members

                      </p>



                      <p className="mt-1 text-3xl font-bold text-gray-900">

                        {circleData.all_circle_members ||

=======
                    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">

                      <p className="text-sm text-gray-500">
                        All Circle Members
                      </p>

                      <p className="mt-1 text-3xl font-bold text-gray-900">

                        {circleData.all_circle_members ||
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                          0}

                      </p>

                    </div>

                  </div>


<<<<<<< HEAD

                  {nextRank && (

                    <div className="mt-5 flex items-center justify-between rounded-2xl border border-[#D99AA3]/40 bg-[#FFF0F2] px-5 py-4">

                      <div>

                        <p className="text-sm font-semibold text-[#8F4F5A]">
=======
                  {nextRank && (

                    <div className="mt-5 flex items-center justify-between rounded-2xl border border-purple-100 bg-purple-50 px-5 py-4">

                      <div>

                        <p className="text-sm font-semibold text-purple-700">
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

                          Working toward {nextRank}

                        </p>

<<<<<<< HEAD


                        <p className="mt-1 text-xs text-gray-500">

                          {getRequirementText(

                            nextRank

=======
                        <p className="mt-1 text-xs text-gray-500">

                          {getRequirementText(
                            nextRank
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                          )}

                        </p>

                      </div>


<<<<<<< HEAD

                      <ChevronRight className="h-5 w-5 text-[#B76E79]" />
=======
                      <ChevronRight className="h-5 w-5 text-purple-500" />
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

                    </div>

                  )}

                </div>

              </div>

            )}

          </main>

        </div>

      </div>
<<<<<<< HEAD

    </>

  );

};



=======
    </>
  );
};

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
export default RankHierarchy;