import React, { useEffect, useMemo, useState } from "react";

import {
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  Users,
  GitBranch,
  Crown,
  RefreshCw,
  User,
  Network,
  UserRound,
  Layers3,
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

  is_power_leg: boolean;

  created_at: string | null;
}

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
interface MyAllCircleResponse {
  success: boolean;

  total: number;

  members: CircleMember[];
}

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
interface PowerLeg {
  user_id: number;

  customer_id: string | null;

  referral_id: string | null;

  full_name: string;

  branch_member_count: number;
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

  power_legs?: PowerLeg[];
}

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
interface TreeNode extends CircleMember {
  children: TreeNode[];
}

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
interface LegData {
  legNumber: number;

  root: TreeNode;

  totalMembers: number;

  membersBelow: number;

  isPowerLeg: boolean;
}

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
// =========================================================
// HELPERS
// =========================================================

const formatNumber = (
  value: number | undefined | null
) => {
<<<<<<< HEAD
  return Number(value || 0).toLocaleString();
};

const formatDate = (
  date: string | null
) => {
=======

  return Number(
    value || 0
  ).toLocaleString();
};


const formatDate = (
  date: string | null
) => {

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
  if (!date) {
    return "-";
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
    return date;
  }

=======

    return date;
  }


>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
  return parsedDate.toLocaleDateString(
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
// =========================================================
// TREE MEMBER
// =========================================================

const TreeMember = ({
  node,
  treeLevel = 0,
}: {
  node: TreeNode;
  treeLevel?: number;
}) => {
<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
  const [
    expanded,
    setExpanded,
  ] = useState(
    treeLevel < 1
  );

<<<<<<< HEAD
  const hasChildren =
    Array.isArray(
      node.children
    ) &&
    node.children.length > 0;

  return (
    <div className="relative">

      <div
        className="flex items-center gap-2 sm:gap-3"
=======

  const hasChildren =
    Array.isArray(
      node.children
    )
    &&
    node.children.length > 0;


  return (

    <div className="relative">


      <div
        className="flex items-center gap-2 sm:gap-3"

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
        style={{
          marginLeft:
            `${Math.min(
              treeLevel,
              8
            ) * 22}px`,
        }}
      >

<<<<<<< HEAD
        {/* EXPAND */}

        {hasChildren ? (
          <button
            type="button"
=======

        {/* EXPAND */}

        {hasChildren ? (

          <button
            type="button"

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
            onClick={() =>
              setExpanded(
                !expanded
              )
            }
<<<<<<< HEAD
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#FFE5E8] text-[#8F4F5A] transition hover:bg-[#E3AAB2]/40 hover:text-[#6F3943]"
          >
            {expanded ? (
              <ChevronDown
                size={15}
              />
            ) : (
              <ChevronRight
                size={15}
              />
            )}
          </button>
        ) : (
          <div className="h-7 w-7 shrink-0" />
        )}

        {/* MEMBER */}

        <div className="flex min-w-0 flex-1 items-center gap-3 rounded-xl border border-[#D99AA3]/20 bg-white px-3 py-2.5 shadow-sm transition hover:border-[#D99AA3]/40 hover:shadow-[#B76E79]/10">

          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FFE5E8] text-[#8F4F5A]">
            <User
              size={15}
            />
          </div>

          <div className="min-w-0 flex-1">

            <div className="truncate text-sm font-semibold text-gray-900">
              {node.full_name}
            </div>

            <div className="mt-0.5 flex flex-wrap items-center gap-x-2 text-[11px] text-gray-500">

              <span>
                {node.customer_id || "-"}
              </span>

=======

            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-500 transition hover:bg-gray-200 hover:text-gray-800"
          >

            {expanded ? (

              <ChevronDown
                size={15}
              />

            ) : (

              <ChevronRight
                size={15}
              />

            )}

          </button>

        ) : (

          <div className="h-7 w-7 shrink-0" />

        )}


        {/* MEMBER */}

        <div className="flex min-w-0 flex-1 items-center gap-3 rounded-xl border border-gray-200 bg-white px-3 py-2.5 shadow-sm">


          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-100 text-purple-600">

            <User
              size={15}
            />

          </div>


          <div className="min-w-0 flex-1">

            <div className="truncate text-sm font-semibold text-gray-900">

              {node.full_name}

            </div>


            <div className="mt-0.5 flex flex-wrap items-center gap-x-2 text-[11px] text-gray-500">

              <span>

                {node.customer_id || "-"}

              </span>


>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
              <span>
                •
              </span>

<<<<<<< HEAD
              <span>
                Level {node.level}
=======

              <span>

                Level {node.level}

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
              </span>

            </div>

          </div>

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
          {/* ROOT LEG */}

          <div className="hidden shrink-0 md:block">

<<<<<<< HEAD
            <span className="rounded-full bg-[#FFE5E8] px-2.5 py-1 text-[10px] font-semibold text-[#8F4F5A]">
              {node.root_leg_name || "-"}
=======
            <span className="rounded-full bg-purple-50 px-2.5 py-1 text-[10px] font-semibold text-purple-700">

              {node.root_leg_name || "-"}

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
            </span>

          </div>

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
          {/* TEAM */}

          <div className="hidden shrink-0 text-right sm:block">

            <div className="text-xs font-bold text-gray-700">
<<<<<<< HEAD
              {formatNumber(
                node.total_team_count
              )}
            </div>

            <div className="text-[10px] text-gray-400">
              team below
=======

              {formatNumber(
                node.total_team_count
              )}

            </div>


            <div className="text-[10px] text-gray-400">

              team below

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
            </div>

          </div>

        </div>

      </div>

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
      {/* CHILDREN */}

      {expanded &&
        hasChildren && (
<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
          <div className="mt-1.5 space-y-1.5">

            {node.children.map(
              (child) => (
<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                <TreeMember
                  key={
                    child.user_id
                  }
<<<<<<< HEAD
                  node={child}
=======

                  node={child}

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                  treeLevel={
                    treeLevel + 1
                  }
                />
<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
              )
            )}

          </div>
<<<<<<< HEAD
        )}

    </div>
  );
};

=======

        )}

    </div>

  );
};


>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
// =========================================================
// MAIN COMPONENT
// =========================================================

const MyAllCircle: React.FC = () => {

  const navigate =
    useNavigate();

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
  // =====================================================
  // STATE
  // =====================================================

  const [
    members,
    setMembers,
  ] = useState<CircleMember[]>(
    []
  );

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
  const [
    summary,
    setSummary,
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
  const [
    expandedLegs,
    setExpandedLegs,
  ] = useState<
    Record<string, boolean>
  >({});
=======

  const [
    expandedLegs,
    setExpandedLegs,
  ] = useState<Record<string, boolean>>(
    {}
  );

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

  // =====================================================
  // GET TOKEN
  // =====================================================

  const getToken = (): string => {

    try {

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

    } catch (error) {

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

    localStorage.removeItem(
      "access_token"
    );

    localStorage.removeItem(
      "refresh_token"
    );

    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "user"
    );
  };

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
  // =====================================================
  // FETCH CIRCLE
  // =====================================================

  const fetchCircle =
    async (
      showRefresh = false
    ) => {

      const token =
        getToken();

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
      if (!token) {

        navigate(
          "/signin",
          {
            replace: true,
          }
        );

        return;
      }

<<<<<<< HEAD
      try {

        if (showRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setError("");

=======

      try {

        if (showRefresh) {

          setRefreshing(true);

        } else {

          setLoading(true);
        }


        setError("");


>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
        const headers = {

          Authorization:
            `Bearer ${token}`,

          "Content-Type":
            "application/json",
        };

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
        // ===============================================
        // ALL CIRCLE + SUMMARY
        // ===============================================

        const [
          allCircleResponse,
          summaryResponse,
        ] = await Promise.all([

          fetch(
            `${API_URL}/api/circle/my-all-circle`,
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

        ]);

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
        // ===============================================
        // SESSION EXPIRED
        // ===============================================

        if (
          allCircleResponse.status === 401 ||
          summaryResponse.status === 401
        ) {

          clearAuthentication();

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

        const allCircleResult:
          MyAllCircleResponse =
          await allCircleResponse.json();

        const summaryResult:
          CircleSummary =
          await summaryResponse.json();
=======

          return;
        }


        const allCircleResult:
          MyAllCircleResponse =
          await allCircleResponse
            .json();


        const summaryResult:
          CircleSummary =
          await summaryResponse
            .json();

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

        console.log(
          "My All Circle:",
          allCircleResult
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
        if (
          !allCircleResponse.ok
        ) {

          throw new Error(
            (allCircleResult as any)
              ?.detail ||
            (allCircleResult as any)
              ?.message ||
            "Unable to load your complete circle."
          );
        }

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
        if (
          !summaryResponse.ok
        ) {

          throw new Error(
            (summaryResult as any)
              ?.detail ||
            (summaryResult as any)
              ?.message ||
            "Unable to load circle summary."
          );
        }

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
        // ===============================================
        // SAVE MEMBERS
        // ===============================================

        const receivedMembers =
          Array.isArray(
<<<<<<< HEAD
            allCircleResult?.members
=======
            allCircleResult
              ?.members
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
          )
            ? allCircleResult.members
            : [];

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
        setMembers(
          receivedMembers
        );

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
        // ===============================================
        // SAVE SUMMARY
        // ===============================================

        setSummary({

          success:
            summaryResult
              ?.success ??
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
              summaryResult
                ?.power_legs
            )
              ? summaryResult
                  .power_legs
              : [],
        });

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
        // ===============================================
        // OPEN ALL LEGS INITIALLY
        // ===============================================

        const rootIds =
          Array.from(
            new Set(
              receivedMembers
                .filter(
                  (member) =>
                    member.level === 1
                )
                .map(
                  (member) =>
                    member.referral_id
                )
                .filter(
                  (
                    id
                  ): id is string =>
                    Boolean(id)
                )
            )
          );

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
        const initialExpanded:
          Record<string, boolean> =
          {};

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
        rootIds.forEach(
          (id) => {

            initialExpanded[id] =
              true;

          }
        );

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
        setExpandedLegs(
          initialExpanded
        );

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
      } catch (err) {

        console.error(
          "All Circle Error:",
          err
        );

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
        setError(

          err instanceof Error

            ? err.message

            : "Something went wrong while loading your circle."
        );

      } finally {

        setLoading(false);

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

    fetchCircle();

  }, []);

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
  // =====================================================
  // AUTO REFRESH EVERY 30 SECONDS
  // =====================================================

  useEffect(() => {

    const interval =
      setInterval(
        () => {

          fetchCircle(true);

        },
        30000
      );

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
    return () => {

      clearInterval(
        interval
      );
<<<<<<< HEAD

=======
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
    };

  }, []);

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
  // =====================================================
  // BUILD TREE FROM FLAT BACKEND DATA
  // =====================================================

  const legs =
    useMemo<LegData[]>(() => {

      if (
        members.length === 0
      ) {

        return [];
      }

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
      // -----------------------------------------------
      // CREATE NODE MAP
      // -----------------------------------------------

      const nodeMap =
        new Map<
          string,
          TreeNode
        >();

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
      members.forEach(
        (member) => {

          if (
            !member.referral_id
          ) {

            return;
          }

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
          nodeMap.set(
            member.referral_id,
            {
              ...member,
              children: [],
            }
          );

        }
      );

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
      // -----------------------------------------------
      // ATTACH CHILDREN
      // -----------------------------------------------

      members.forEach(
        (member) => {

          if (
            !member.referral_id
          ) {

            return;
          }

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
          const node =
            nodeMap.get(
              member.referral_id
            );

<<<<<<< HEAD
          if (!node) {
            return;
          }

=======

          if (!node) {

            return;
          }


>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
          if (
            member.level > 1 &&
            member.parent_referral_id
          ) {

            const parent =
              nodeMap.get(
<<<<<<< HEAD
                member.parent_referral_id
              );

=======
                member
                  .parent_referral_id
              );


>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
            if (parent) {

              parent.children.push(
                node
              );
<<<<<<< HEAD

=======
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
            }
          }

        }
      );

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
      // -----------------------------------------------
      // ROOT DIRECTS = LEGS
      // -----------------------------------------------

      const roots =
        members
          .filter(
            (member) =>
              member.level === 1
          )
          .sort(
            (
              a,
              b
            ) =>
              a.user_id -
              b.user_id
          );

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
      return roots.map(
        (
          rootMember,
          index
        ) => {

          const root =
            rootMember.referral_id

              ? nodeMap.get(
                  rootMember
                    .referral_id
                )

              : undefined;

<<<<<<< HEAD
          if (!root) {
            return null;
          }

=======

          if (!root) {

            return null;
          }


>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
          // total_team_count excludes root user himself.
          const membersBelow =
            Number(
              rootMember
                .total_team_count ||
              0
            );

<<<<<<< HEAD
          const totalMembers =
            membersBelow + 1;

=======

          const totalMembers =
            membersBelow + 1;


>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
          return {

            legNumber:
              index + 1,

            root,

            totalMembers,

            membersBelow,

            isPowerLeg:
              Boolean(
                rootMember
                  .is_power_leg
              ),
<<<<<<< HEAD

=======
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
          };

        }
      )
      .filter(
        (
          leg
        ): leg is LegData =>
          leg !== null
      );

    }, [members]);

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
  // =====================================================
  // TOGGLE LEG
  // =====================================================

  const toggleLeg = (
    referralId: string
  ) => {

    setExpandedLegs(
      (prev) => ({

        ...prev,

        [referralId]:
          !prev[
            referralId
          ],
<<<<<<< HEAD

=======
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
      })
    );
  };

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
  // =====================================================
  // EXPAND ALL
  // =====================================================

  const expandAll = () => {

    const state:
      Record<string, boolean> =
      {};

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
    legs.forEach(
      (leg) => {

        if (
          leg.root.referral_id
        ) {

          state[
            leg.root.referral_id
          ] = true;
<<<<<<< HEAD

        }

      }
    );

=======
        }
      }
    );


>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
    setExpandedLegs(
      state
    );
  };

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
  // =====================================================
  // COLLAPSE ALL
  // =====================================================

  const collapseAll = () => {

    const state:
      Record<string, boolean> =
      {};

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
    legs.forEach(
      (leg) => {

        if (
          leg.root.referral_id
        ) {

          state[
            leg.root.referral_id
          ] = false;
<<<<<<< HEAD

        }

      }
    );

=======
        }
      }
    );


>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
    setExpandedLegs(
      state
    );
  };

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
  // =====================================================
  // UI
  // =====================================================

  return (

    <>

      <UserNavbar />

<<<<<<< HEAD
      <div className="flex min-h-screen w-full bg-[#FFF9FA] text-gray-900 p-10">

        <div className="flex min-w-0 flex-1 flex-col">

          <main className="flex-1 bg-[#FFF9FA] p-4 sm:p-6 lg:p-8">
=======

      <div className="flex min-h-screen w-full bg-gray-50 text-gray-900 p-10">


        <div className="flex min-w-0 flex-1 flex-col">


          <main className="flex-1 bg-gray-50 p-4 sm:p-6 lg:p-8">

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

            {/* ========================================= */}
            {/* HEADER */}
            {/* ========================================= */}

            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

<<<<<<< HEAD
              <div>

=======

              <div>


>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                {/* BACK */}

                <button
                  type="button"
<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                  onClick={() =>
                    navigate(
                      "/mycircle"
                    )
                  }
<<<<<<< HEAD
                  className="mb-3 inline-flex items-center gap-2 rounded-xl border border-[#D99AA3]/20 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-[#D99AA3]/40 hover:bg-[#FFF0F2] hover:text-[#8F4F5A]"
=======

                  className="mb-3 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-100"
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                >

                  <ArrowLeft
                    size={16}
                  />

                  Back to My Circle

                </button>

<<<<<<< HEAD
                <div className="flex items-center gap-3">

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFE5E8] text-[#8F4F5A]">
=======

                <div className="flex items-center gap-3">


                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 text-purple-600">
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

                    <Network
                      size={23}
                    />

                  </div>

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                  <div>

                    <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">

                      My All Circle

                    </h1>

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                    <p className="mt-1 text-sm text-gray-500">

                      Complete team tree and leg tracking

                    </p>

                  </div>

                </div>

              </div>

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
              {/* REFRESH */}

              <button
                type="button"
<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                onClick={() =>
                  fetchCircle(
                    true
                  )
                }
<<<<<<< HEAD
                disabled={
                  refreshing
                }
                className={`inline-flex items-center justify-center gap-2 rounded-xl border border-[#D99AA3]/20 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-[#D99AA3]/40 hover:bg-[#FFF0F2] hover:text-[#8F4F5A] ${
=======

                disabled={
                  refreshing
                }

                className={`inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-100 ${
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                  refreshing
                    ? "cursor-not-allowed opacity-60"
                    : ""
                }`}
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

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
            {/* ========================================= */}
            {/* LOADING */}
            {/* ========================================= */}

            {loading && (

              <div className="flex min-h-[400px] items-center justify-center">

                <div className="text-center">

                  <RefreshCw
                    size={30}
<<<<<<< HEAD
                    className="mx-auto animate-spin text-[#B76E79]"
                  />

=======
                    className="mx-auto animate-spin text-purple-600"
                  />


>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                  <p className="mt-4 text-sm text-gray-500">

                    Loading your complete circle...

                  </p>

                </div>

              </div>

            )}

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
            {/* ========================================= */}
            {/* ERROR */}
            {/* ========================================= */}

            {!loading &&
              error && (

<<<<<<< HEAD
                <div className="rounded-2xl border border-[#D99AA3]/40 bg-[#FFE5E8]/60 p-6 text-center">

                  <p className="text-sm text-[#8F4F5A]">
=======
                <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">

                  <p className="text-sm text-red-600">
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

                    {error}

                  </p>

<<<<<<< HEAD
                  <button
                    type="button"
                    onClick={() =>
                      fetchCircle()
                    }
                    className="mt-4 rounded-xl bg-[#B76E79]/15 px-4 py-2 text-sm font-semibold text-[#8F4F5A] transition hover:bg-[#B76E79]/25"
=======

                  <button
                    type="button"

                    onClick={() =>
                      fetchCircle()
                    }

                    className="mt-4 rounded-xl bg-red-100 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-200"
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                  >

                    Try Again

                  </button>

                </div>

              )}

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
            {/* ========================================= */}
            {/* CONTENT */}
            {/* ========================================= */}

            {!loading &&
              !error && (

                <>

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                  {/* =================================== */}
                  {/* SUMMARY CARDS */}
                  {/* =================================== */}

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">

<<<<<<< HEAD
                    {/* ALL MEMBERS */}

                    <div className="rounded-2xl border border-[#D99AA3]/20 bg-white p-5 shadow-sm transition hover:border-[#D99AA3]/40 hover:shadow-[#B76E79]/10">

                      <div className="mb-4 flex items-center justify-between">

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFE5E8] text-[#8F4F5A]">
=======

                    {/* ALL MEMBERS */}

                    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

                      <div className="mb-4 flex items-center justify-between">

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

                          <Users
                            size={21}
                          />

                        </div>

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                        <span className="text-xs font-semibold text-gray-400">

                          ALL MEMBERS

                        </span>

                      </div>

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                      <div className="text-2xl font-bold text-gray-900">

                        {formatNumber(
                          summary
                            .all_circle_members
                        )}

                      </div>

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                      <div className="mt-1 text-xs text-gray-500">

                        Complete circle

                      </div>

                    </div>

<<<<<<< HEAD
                    {/* DOWNLINE */}

                    <div className="rounded-2xl border border-[#D99AA3]/20 bg-white p-5 shadow-sm transition hover:border-[#D99AA3]/40 hover:shadow-[#B76E79]/10">

                      <div className="mb-4 flex items-center justify-between">

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFE5E8] text-[#8F4F5A]">
=======

                    {/* DOWNLINE */}

                    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

                      <div className="mb-4 flex items-center justify-between">

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

                          <GitBranch
                            size={21}
                          />

                        </div>

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                        <span className="text-xs font-semibold text-gray-400">

                          DOWNLINE

                        </span>

                      </div>

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                      <div className="text-2xl font-bold text-gray-900">

                        {formatNumber(
                          Math.max(
                            summary
                              .all_circle_members -
                            summary
                              .direct_members,
                            0
                          )
                        )}

                      </div>

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                      <div className="mt-1 text-xs text-gray-500">

                        Below direct referrals

                      </div>

                    </div>

<<<<<<< HEAD
                    {/* LEGS */}

                    <div className="rounded-2xl border border-[#D99AA3]/20 bg-white p-5 shadow-sm transition hover:border-[#D99AA3]/40 hover:shadow-[#B76E79]/10">

                      <div className="mb-4 flex items-center justify-between">

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFE5E8] text-[#8F4F5A]">
=======

                    {/* LEGS */}

                    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

                      <div className="mb-4 flex items-center justify-between">

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

                          <Layers3
                            size={21}
                          />

                        </div>

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                        <span className="text-xs font-semibold text-gray-400">

                          LEGS

                        </span>

                      </div>

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                      <div className="text-2xl font-bold text-gray-900">

                        {formatNumber(
                          summary
                            .total_legs
                        )}

                      </div>

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                      <div className="mt-1 text-xs text-gray-500">

                        Direct referral branches

                      </div>

                    </div>

<<<<<<< HEAD
                    {/* POWER LEG */}

                    <div className="rounded-2xl border border-[#D99AA3]/35 bg-white p-5 shadow-sm transition hover:border-[#B76E79]/50 hover:shadow-[#B76E79]/10">

                      <div className="mb-4 flex items-center justify-between">

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFE5E8] text-[#8F4F5A]">
=======

                    {/* POWER LEG */}

                    <div className="rounded-2xl border border-yellow-200 bg-white p-5 shadow-sm">

                      <div className="mb-4 flex items-center justify-between">

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-100 text-yellow-600">
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

                          <Crown
                            size={21}
                          />

                        </div>

<<<<<<< HEAD
                        <span className="text-xs font-bold text-[#8F4F5A]">
=======

                        <span className="text-xs font-bold text-yellow-600">
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

                          POWER LEG

                        </span>

                      </div>

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                      <div className="truncate text-xl font-bold text-gray-900">

                        {
                          summary
                            .power_leg_name ||
                          "-"
                        }

                      </div>

<<<<<<< HEAD
                      <div className="mt-1 text-xs font-semibold text-[#B76E79]">
=======

                      <div className="mt-1 text-xs font-semibold text-yellow-600">
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

                        {summary
                          .power_leg_name

                          ? `${formatNumber(
                              summary
                                .power_leg_members
                            )} members`

                          : "No power leg yet"
                        }

                      </div>

                    </div>

                  </div>

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                  {/* =================================== */}
                  {/* TREE CONTROLS */}
                  {/* =================================== */}

<<<<<<< HEAD
                  <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#D99AA3]/20 bg-white p-4 shadow-sm">
=======
                  <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

                    <div>

                      <h2 className="font-bold text-gray-900">

                        Complete Team Tree

                      </h2>

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                      <p className="mt-1 text-xs text-gray-500">

                        Every direct referral is tracked as a separate team leg.

                      </p>

                    </div>

<<<<<<< HEAD
                    <div className="flex gap-2">

                      <button
                        type="button"
                        onClick={
                          expandAll
                        }
                        className="rounded-lg border border-[#D99AA3]/25 bg-white px-3 py-2 text-xs font-semibold text-gray-700 transition hover:border-[#D99AA3]/40 hover:bg-[#FFF0F2] hover:text-[#8F4F5A]"
=======

                    <div className="flex gap-2">


                      <button
                        type="button"

                        onClick={
                          expandAll
                        }

                        className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-50"
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                      >

                        Expand All

                      </button>

<<<<<<< HEAD
                      <button
                        type="button"
                        onClick={
                          collapseAll
                        }
                        className="rounded-lg border border-[#D99AA3]/25 bg-white px-3 py-2 text-xs font-semibold text-gray-700 transition hover:border-[#D99AA3]/40 hover:bg-[#FFF0F2] hover:text-[#8F4F5A]"
=======

                      <button
                        type="button"

                        onClick={
                          collapseAll
                        }

                        className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-50"
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                      >

                        Collapse All

                      </button>

                    </div>

                  </div>

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                  {/* =================================== */}
                  {/* NO MEMBERS */}
                  {/* =================================== */}

                  {legs.length === 0 && (

<<<<<<< HEAD
                    <div className="mt-6 rounded-2xl border border-[#D99AA3]/20 bg-white p-10 text-center shadow-sm">

                      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FFE5E8] text-[#8F4F5A]">
=======
                    <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">


                      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-100 text-purple-600">
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

                        <Users
                          size={25}
                        />

                      </div>

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                      <h3 className="font-semibold text-gray-900">

                        No direct referrals yet

                      </h3>

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                      <p className="mt-2 text-sm text-gray-500">

                        Your complete circle will appear here once you refer members.

                      </p>

                    </div>

                  )}

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                  {/* =================================== */}
                  {/* LEGS */}
                  {/* =================================== */}

                  <div className="mt-6 space-y-4">

                    {legs.map(
                      (leg) => {

                        const referralId =
                          leg.root
                            .referral_id ||
                          String(
                            leg.root
                              .user_id
                          );

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                        const isExpanded =
                          Boolean(
                            expandedLegs[
                              referralId
                            ]
                          );

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                        return (

                          <div
                            key={
                              leg.root
                                .user_id
                            }
<<<<<<< HEAD
                            className={`overflow-hidden rounded-2xl border bg-white shadow-sm ${
                              leg.isPowerLeg
                                ? "border-[#D99AA3]/60"
                                : "border-[#D99AA3]/20"
                            }`}
                          >

=======

                            className={`overflow-hidden rounded-2xl border bg-white shadow-sm ${
                              leg
                                .isPowerLeg

                                ? "border-yellow-300"

                                : "border-gray-200"
                            }`}
                          >


>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                            {/* ========================= */}
                            {/* LEG HEADER */}
                            {/* ========================= */}

                            <button
                              type="button"
<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                              onClick={() =>
                                toggleLeg(
                                  referralId
                                )
                              }
<<<<<<< HEAD
                              className={`flex w-full items-center gap-3 p-4 text-left transition ${
                                leg.isPowerLeg
                                  ? "bg-[#FFF0F2] hover:bg-[#FFE5E8]"
                                  : "hover:bg-[#FFF9FA]"
                              }`}
                            >

                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFE5E8] text-[#8F4F5A]">
=======

                              className={`flex w-full items-center gap-3 p-4 text-left transition ${
                                leg
                                  .isPowerLeg

                                  ? "bg-yellow-50/50 hover:bg-yellow-50"

                                  : "hover:bg-gray-50"
                              }`}
                            >


                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

                                {isExpanded ? (

                                  <ChevronDown
                                    size={19}
                                  />

                                ) : (

                                  <ChevronRight
                                    size={19}
                                  />

                                )}

                              </div>

<<<<<<< HEAD
                              <div className="min-w-0 flex-1">

                                <div className="flex flex-wrap items-center gap-2">

                                  <span className="text-xs font-bold uppercase tracking-wider text-[#B76E79]">
=======

                              <div className="min-w-0 flex-1">


                                <div className="flex flex-wrap items-center gap-2">


                                  <span className="text-xs font-bold uppercase tracking-wider text-purple-600">
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

                                    Leg {
                                      leg
                                        .legNumber
                                    }

                                  </span>

<<<<<<< HEAD
                                  {leg
                                    .isPowerLeg && (

                                    <span className="inline-flex items-center gap-1 rounded-full bg-[#FFE5E8] px-2.5 py-1 text-[10px] font-bold text-[#8F4F5A]">
=======

                                  {leg
                                    .isPowerLeg && (

                                    <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2.5 py-1 text-[10px] font-bold text-yellow-700">
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

                                      <Crown
                                        size={11}
                                      />

                                      POWER LEG

                                    </span>

                                  )}

                                </div>

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                                <div className="mt-1 truncate font-bold text-gray-900">

                                  {
                                    leg.root
                                      .full_name
                                  }

                                </div>

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                                <div className="mt-0.5 truncate text-xs text-gray-500">

                                  {
                                    leg.root
                                      .customer_id ||
                                    leg.root
                                      .referral_id ||
                                    "-"
                                  }

                                </div>

                              </div>

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                              {/* MEMBERS BELOW */}

                              <div className="hidden text-right sm:block">

                                <div className="text-lg font-bold text-gray-900">

                                  {formatNumber(
                                    leg
                                      .membersBelow
                                  )}

                                </div>

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                                <div className="text-[10px] text-gray-500">

                                  members below

                                </div>

                              </div>

<<<<<<< HEAD
                              {/* TOTAL LEG */}

                              <div
                                className={`flex h-11 min-w-[76px] flex-col items-center justify-center rounded-xl px-3 ${
                                  leg.isPowerLeg
                                    ? "bg-[#FFE5E8]"
                                    : "bg-[#F8EEF0]"
                                }`}
                              >

                                <span
                                  className={`text-sm font-bold ${
                                    leg.isPowerLeg
                                      ? "text-[#8F4F5A]"
                                      : "text-[#6F3943]"
                                  }`}
=======

                              {/* TOTAL LEG */}

                              <div className={`flex h-11 min-w-[76px] flex-col items-center justify-center rounded-xl px-3 ${
                                leg
                                  .isPowerLeg

                                  ? "bg-yellow-100"

                                  : "bg-gray-100"
                              }`}
                              >

                                <span className={`text-sm font-bold ${
                                  leg
                                    .isPowerLeg

                                    ? "text-yellow-700"

                                    : "text-gray-800"
                                }`}
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                                >

                                  {formatNumber(
                                    leg
                                      .totalMembers
                                  )}

                                </span>

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                                <span className="text-[9px] text-gray-500">

                                  total leg

                                </span>

                              </div>

                            </button>

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                            {/* MOBILE COUNT */}

                            <div className="px-4 pb-3 sm:hidden">

                              <div className="flex items-center gap-2 text-xs text-gray-500">

                                <Users
                                  size={13}
                                />

                                <span>

                                  {formatNumber(
                                    leg
                                      .membersBelow
                                  )}{" "}
                                  members below this direct

                                </span>

                              </div>

                            </div>

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                            {/* ========================= */}
                            {/* LEG CONTENT */}
                            {/* ========================= */}

                            {isExpanded && (

<<<<<<< HEAD
                              <div className="border-t border-[#D99AA3]/15 p-4">

                                {/* ROOT DIRECT */}

                                <div
                                  className={`mb-4 rounded-2xl border p-4 ${
                                    leg.isPowerLeg
                                      ? "border-[#D99AA3]/40 bg-[#FFF0F2]"
                                      : "border-[#D99AA3]/25 bg-[#FFF9FA]"
                                  }`}
=======
                              <div className="border-t border-gray-100 p-4">


                                {/* ROOT DIRECT */}

                                <div className={`mb-4 rounded-2xl border p-4 ${
                                  leg
                                    .isPowerLeg

                                    ? "border-yellow-200 bg-yellow-50/50"

                                    : "border-purple-100 bg-purple-50"
                                }`}
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                                >

                                  <div className="flex items-center gap-3">

<<<<<<< HEAD
                                    <div
                                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
                                        leg.isPowerLeg
                                          ? "bg-[#FFE5E8] text-[#8F4F5A]"
                                          : "bg-[#FFE5E8] text-[#B76E79]"
                                      }`}
=======

                                    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
                                      leg
                                        .isPowerLeg

                                        ? "bg-yellow-100 text-yellow-600"

                                        : "bg-purple-100 text-purple-600"
                                    }`}
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                                    >

                                      {leg
                                        .isPowerLeg ? (

                                        <Crown
                                          size={18}
                                        />

                                      ) : (

                                        <UserRound
                                          size={18}
                                        />

                                      )}

                                    </div>

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                                    <div className="min-w-0 flex-1">

                                      <div className="flex flex-wrap items-center gap-2">

                                        <div className="font-bold text-gray-900">

                                          {
                                            leg.root
                                              .full_name
                                          }

                                        </div>

<<<<<<< HEAD
                                        {leg
                                          .isPowerLeg && (

                                          <span className="rounded-full bg-[#FFE5E8] px-2 py-0.5 text-[10px] font-bold text-[#8F4F5A]">
=======

                                        {leg
                                          .isPowerLeg && (

                                          <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-[10px] font-bold text-yellow-700">
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

                                            POWER LEG

                                          </span>

                                        )}

                                      </div>

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                                      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">

                                        <span>

                                          Customer ID:{" "}

                                          {
                                            leg.root
                                              .customer_id ||
                                            "-"
                                          }

                                        </span>

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                                        <span>

                                          Referral ID:{" "}

                                          {
                                            leg.root
                                              .referral_id ||
                                            "-"
                                          }

                                        </span>

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                                        <span>

                                          Joined:{" "}

                                          {formatDate(
                                            leg.root
                                              .created_at
                                          )}

                                        </span>

                                      </div>

                                    </div>

<<<<<<< HEAD
                                    <div className="hidden text-right sm:block">

                                      <div className="text-sm font-bold text-[#B76E79]">
=======

                                    <div className="hidden text-right sm:block">

                                      <div className="text-sm font-bold text-purple-700">
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

                                        {formatNumber(
                                          leg.root
                                            .direct_team_count
                                        )}

                                      </div>

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                                      <div className="text-[10px] text-gray-500">

                                        directs

                                      </div>

                                    </div>

                                  </div>

                                </div>

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                                {/* TREE */}

                                {leg.root
                                  .children
                                  ?.length > 0 ? (

                                  <div className="space-y-1.5">

                                    {leg.root
                                      .children
                                      .map(
                                        (
                                          child
                                        ) => (

                                          <TreeMember
                                            key={
                                              child
                                                .user_id
                                            }
<<<<<<< HEAD
                                            node={
                                              child
                                            }
=======

                                            node={
                                              child
                                            }

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                                            treeLevel={
                                              0
                                            }
                                          />

                                        )
                                      )}

                                  </div>

                                ) : (

<<<<<<< HEAD
                                  <div className="rounded-xl border border-dashed border-[#D99AA3]/30 bg-[#FFF9FA] px-4 py-6 text-center">
=======
                                  <div className="rounded-xl border border-dashed border-gray-200 px-4 py-6 text-center">
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

                                    <p className="text-sm text-gray-500">

                                      No members under this direct yet.

                                    </p>

                                  </div>

                                )}

                              </div>

                            )}

                          </div>

                        );
                      }
                    )}

                  </div>

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                  {/* =================================== */}
                  {/* POWER LEG INFORMATION */}
                  {/* =================================== */}

                  {legs.length > 0 && (

<<<<<<< HEAD
                    <div className="mt-6 rounded-2xl border border-[#D99AA3]/35 bg-[#FFF0F2] p-5">

                      <div className="flex gap-3">

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFE5E8] text-[#8F4F5A]">
=======
                    <div className="mt-6 rounded-2xl border border-yellow-200 bg-yellow-50 p-5">


                      <div className="flex gap-3">


                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-yellow-100 text-yellow-600">
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

                          <Crown
                            size={18}
                          />

                        </div>

<<<<<<< HEAD
                        <div>

                          <h3 className="font-bold text-[#8F4F5A]">
=======

                        <div>

                          <h3 className="font-bold text-yellow-800">
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

                            Power Leg Tracking

                          </h3>

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                          <p className="mt-1 text-xs leading-5 text-gray-600">

                            Each direct referral creates a separate team leg.
                            The branch with the highest total number of members
                            is identified as the Power Leg. Every member below
                            that direct remains connected to the same root leg,
                            making large team structures easier to track.

                          </p>

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                          {summary
                            .power_legs &&
                            summary
                              .power_legs
                              .length > 1 && (

<<<<<<< HEAD
                              <p className="mt-2 text-xs font-semibold text-[#B76E79]">
=======
                              <p className="mt-2 text-xs font-semibold text-yellow-700">
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

                                {
                                  summary
                                    .power_legs
                                    .length
                                }{" "}
                                legs are currently tied for the largest team.

                              </p>

                            )}

                        </div>

                      </div>

                    </div>

                  )}

                </>

              )}

          </main>

        </div>

      </div>

    </>
<<<<<<< HEAD
  );
};

=======

  );
};


>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
export default MyAllCircle;