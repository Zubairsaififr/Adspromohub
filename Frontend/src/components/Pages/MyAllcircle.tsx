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

  is_power_leg: boolean;

  created_at: string | null;
}


interface MyAllCircleResponse {
  success: boolean;

  total: number;

  members: CircleMember[];
}


interface PowerLeg {
  user_id: number;

  customer_id: string | null;

  referral_id: string | null;

  full_name: string;

  branch_member_count: number;
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

  power_legs?: PowerLeg[];
}


interface TreeNode extends CircleMember {
  children: TreeNode[];
}


interface LegData {
  legNumber: number;

  root: TreeNode;

  totalMembers: number;

  membersBelow: number;

  isPowerLeg: boolean;
}


// =========================================================
// HELPERS
// =========================================================

const formatNumber = (
  value: number | undefined | null
) => {

  return Number(
    value || 0
  ).toLocaleString();
};


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


  return parsedDate.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",

      month: "short",

      year: "numeric",
    }
  );
};


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

  const [
    expanded,
    setExpanded,
  ] = useState(
    treeLevel < 1
  );


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

        style={{
          marginLeft:
            `${Math.min(
              treeLevel,
              8
            ) * 22}px`,
        }}
      >


        {/* EXPAND */}

        {hasChildren ? (

          <button
            type="button"

            onClick={() =>
              setExpanded(
                !expanded
              )
            }

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


              <span>
                •
              </span>


              <span>

                Level {node.level}

              </span>

            </div>

          </div>


          {/* ROOT LEG */}

          <div className="hidden shrink-0 md:block">

            <span className="rounded-full bg-purple-50 px-2.5 py-1 text-[10px] font-semibold text-purple-700">

              {node.root_leg_name || "-"}

            </span>

          </div>


          {/* TEAM */}

          <div className="hidden shrink-0 text-right sm:block">

            <div className="text-xs font-bold text-gray-700">

              {formatNumber(
                node.total_team_count
              )}

            </div>


            <div className="text-[10px] text-gray-400">

              team below

            </div>

          </div>

        </div>

      </div>


      {/* CHILDREN */}

      {expanded &&
        hasChildren && (

          <div className="mt-1.5 space-y-1.5">

            {node.children.map(
              (child) => (

                <TreeMember
                  key={
                    child.user_id
                  }

                  node={child}

                  treeLevel={
                    treeLevel + 1
                  }
                />

              )
            )}

          </div>

        )}

    </div>

  );
};


// =========================================================
// MAIN COMPONENT
// =========================================================

const MyAllCircle: React.FC = () => {

  const navigate =
    useNavigate();


  // =====================================================
  // STATE
  // =====================================================

  const [
    members,
    setMembers,
  ] = useState<CircleMember[]>(
    []
  );


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


  const [
    expandedLegs,
    setExpandedLegs,
  ] = useState<Record<string, boolean>>(
    {}
  );


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
      "token"
    );

    localStorage.removeItem(
      "user"
    );
  };


  // =====================================================
  // FETCH CIRCLE
  // =====================================================

  const fetchCircle =
    async (
      showRefresh = false
    ) => {

      const token =
        getToken();


      if (!token) {

        navigate(
          "/signin",
          {
            replace: true,
          }
        );

        return;
      }


      try {

        if (showRefresh) {

          setRefreshing(true);

        } else {

          setLoading(true);
        }


        setError("");


        const headers = {

          Authorization:
            `Bearer ${token}`,

          "Content-Type":
            "application/json",
        };


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


          fetch(
            `${API_URL}/api/circle/summary`,
            {
              method: "GET",
              headers,
            }
          ),

        ]);


        // ===============================================
        // SESSION EXPIRED
        // ===============================================

        if (
          allCircleResponse.status === 401 ||
          summaryResponse.status === 401
        ) {

          clearAuthentication();


          navigate(
            "/signin",
            {
              replace: true,
            }
          );


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


        console.log(
          "My All Circle:",
          allCircleResult
        );


        console.log(
          "Circle Summary:",
          summaryResult
        );


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


        // ===============================================
        // SAVE MEMBERS
        // ===============================================

        const receivedMembers =
          Array.isArray(
            allCircleResult
              ?.members
          )
            ? allCircleResult.members
            : [];


        setMembers(
          receivedMembers
        );


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


        const initialExpanded:
          Record<string, boolean> =
          {};


        rootIds.forEach(
          (id) => {

            initialExpanded[id] =
              true;

          }
        );


        setExpandedLegs(
          initialExpanded
        );


      } catch (err) {

        console.error(
          "All Circle Error:",
          err
        );


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


  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {

    fetchCircle();

  }, []);


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


    return () => {

      clearInterval(
        interval
      );
    };

  }, []);


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


      // -----------------------------------------------
      // CREATE NODE MAP
      // -----------------------------------------------

      const nodeMap =
        new Map<
          string,
          TreeNode
        >();


      members.forEach(
        (member) => {

          if (
            !member.referral_id
          ) {

            return;
          }


          nodeMap.set(
            member.referral_id,
            {
              ...member,
              children: [],
            }
          );

        }
      );


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


          const node =
            nodeMap.get(
              member.referral_id
            );


          if (!node) {

            return;
          }


          if (
            member.level > 1 &&
            member.parent_referral_id
          ) {

            const parent =
              nodeMap.get(
                member
                  .parent_referral_id
              );


            if (parent) {

              parent.children.push(
                node
              );
            }
          }

        }
      );


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


          if (!root) {

            return null;
          }


          // total_team_count excludes root user himself.
          const membersBelow =
            Number(
              rootMember
                .total_team_count ||
              0
            );


          const totalMembers =
            membersBelow + 1;


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
      })
    );
  };


  // =====================================================
  // EXPAND ALL
  // =====================================================

  const expandAll = () => {

    const state:
      Record<string, boolean> =
      {};


    legs.forEach(
      (leg) => {

        if (
          leg.root.referral_id
        ) {

          state[
            leg.root.referral_id
          ] = true;
        }
      }
    );


    setExpandedLegs(
      state
    );
  };


  // =====================================================
  // COLLAPSE ALL
  // =====================================================

  const collapseAll = () => {

    const state:
      Record<string, boolean> =
      {};


    legs.forEach(
      (leg) => {

        if (
          leg.root.referral_id
        ) {

          state[
            leg.root.referral_id
          ] = false;
        }
      }
    );


    setExpandedLegs(
      state
    );
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


            {/* ========================================= */}
            {/* HEADER */}
            {/* ========================================= */}

            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">


              <div>


                {/* BACK */}

                <button
                  type="button"

                  onClick={() =>
                    navigate(
                      "/mycircle"
                    )
                  }

                  className="mb-3 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-100"
                >

                  <ArrowLeft
                    size={16}
                  />

                  Back to My Circle

                </button>


                <div className="flex items-center gap-3">


                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 text-purple-600">

                    <Network
                      size={23}
                    />

                  </div>


                  <div>

                    <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">

                      My All Circle

                    </h1>


                    <p className="mt-1 text-sm text-gray-500">

                      Complete team tree and leg tracking

                    </p>

                  </div>

                </div>

              </div>


              {/* REFRESH */}

              <button
                type="button"

                onClick={() =>
                  fetchCircle(
                    true
                  )
                }

                disabled={
                  refreshing
                }

                className={`inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-100 ${
                  refreshing
                    ? "cursor-not-allowed opacity-60"
                    : ""
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


            {/* ========================================= */}
            {/* LOADING */}
            {/* ========================================= */}

            {loading && (

              <div className="flex min-h-[400px] items-center justify-center">

                <div className="text-center">

                  <RefreshCw
                    size={30}
                    className="mx-auto animate-spin text-purple-600"
                  />


                  <p className="mt-4 text-sm text-gray-500">

                    Loading your complete circle...

                  </p>

                </div>

              </div>

            )}


            {/* ========================================= */}
            {/* ERROR */}
            {/* ========================================= */}

            {!loading &&
              error && (

                <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">

                  <p className="text-sm text-red-600">

                    {error}

                  </p>


                  <button
                    type="button"

                    onClick={() =>
                      fetchCircle()
                    }

                    className="mt-4 rounded-xl bg-red-100 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-200"
                  >

                    Try Again

                  </button>

                </div>

              )}


            {/* ========================================= */}
            {/* CONTENT */}
            {/* ========================================= */}

            {!loading &&
              !error && (

                <>


                  {/* =================================== */}
                  {/* SUMMARY CARDS */}
                  {/* =================================== */}

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">


                    {/* ALL MEMBERS */}

                    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

                      <div className="mb-4 flex items-center justify-between">

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100 text-purple-600">

                          <Users
                            size={21}
                          />

                        </div>


                        <span className="text-xs font-semibold text-gray-400">

                          ALL MEMBERS

                        </span>

                      </div>


                      <div className="text-2xl font-bold text-gray-900">

                        {formatNumber(
                          summary
                            .all_circle_members
                        )}

                      </div>


                      <div className="mt-1 text-xs text-gray-500">

                        Complete circle

                      </div>

                    </div>


                    {/* DOWNLINE */}

                    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

                      <div className="mb-4 flex items-center justify-between">

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600">

                          <GitBranch
                            size={21}
                          />

                        </div>


                        <span className="text-xs font-semibold text-gray-400">

                          DOWNLINE

                        </span>

                      </div>


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


                      <div className="mt-1 text-xs text-gray-500">

                        Below direct referrals

                      </div>

                    </div>


                    {/* LEGS */}

                    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

                      <div className="mb-4 flex items-center justify-between">

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">

                          <Layers3
                            size={21}
                          />

                        </div>


                        <span className="text-xs font-semibold text-gray-400">

                          LEGS

                        </span>

                      </div>


                      <div className="text-2xl font-bold text-gray-900">

                        {formatNumber(
                          summary
                            .total_legs
                        )}

                      </div>


                      <div className="mt-1 text-xs text-gray-500">

                        Direct referral branches

                      </div>

                    </div>


                    {/* POWER LEG */}

                    <div className="rounded-2xl border border-yellow-200 bg-white p-5 shadow-sm">

                      <div className="mb-4 flex items-center justify-between">

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-100 text-yellow-600">

                          <Crown
                            size={21}
                          />

                        </div>


                        <span className="text-xs font-bold text-yellow-600">

                          POWER LEG

                        </span>

                      </div>


                      <div className="truncate text-xl font-bold text-gray-900">

                        {
                          summary
                            .power_leg_name ||
                          "-"
                        }

                      </div>


                      <div className="mt-1 text-xs font-semibold text-yellow-600">

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


                  {/* =================================== */}
                  {/* TREE CONTROLS */}
                  {/* =================================== */}

                  <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">


                    <div>

                      <h2 className="font-bold text-gray-900">

                        Complete Team Tree

                      </h2>


                      <p className="mt-1 text-xs text-gray-500">

                        Every direct referral is tracked as a separate team leg.

                      </p>

                    </div>


                    <div className="flex gap-2">


                      <button
                        type="button"

                        onClick={
                          expandAll
                        }

                        className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-50"
                      >

                        Expand All

                      </button>


                      <button
                        type="button"

                        onClick={
                          collapseAll
                        }

                        className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-50"
                      >

                        Collapse All

                      </button>

                    </div>

                  </div>


                  {/* =================================== */}
                  {/* NO MEMBERS */}
                  {/* =================================== */}

                  {legs.length === 0 && (

                    <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">


                      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-100 text-purple-600">

                        <Users
                          size={25}
                        />

                      </div>


                      <h3 className="font-semibold text-gray-900">

                        No direct referrals yet

                      </h3>


                      <p className="mt-2 text-sm text-gray-500">

                        Your complete circle will appear here once you refer members.

                      </p>

                    </div>

                  )}


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


                        const isExpanded =
                          Boolean(
                            expandedLegs[
                              referralId
                            ]
                          );


                        return (

                          <div
                            key={
                              leg.root
                                .user_id
                            }

                            className={`overflow-hidden rounded-2xl border bg-white shadow-sm ${
                              leg
                                .isPowerLeg

                                ? "border-yellow-300"

                                : "border-gray-200"
                            }`}
                          >


                            {/* ========================= */}
                            {/* LEG HEADER */}
                            {/* ========================= */}

                            <button
                              type="button"

                              onClick={() =>
                                toggleLeg(
                                  referralId
                                )
                              }

                              className={`flex w-full items-center gap-3 p-4 text-left transition ${
                                leg
                                  .isPowerLeg

                                  ? "bg-yellow-50/50 hover:bg-yellow-50"

                                  : "hover:bg-gray-50"
                              }`}
                            >


                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-purple-600">

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


                              <div className="min-w-0 flex-1">


                                <div className="flex flex-wrap items-center gap-2">


                                  <span className="text-xs font-bold uppercase tracking-wider text-purple-600">

                                    Leg {
                                      leg
                                        .legNumber
                                    }

                                  </span>


                                  {leg
                                    .isPowerLeg && (

                                    <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2.5 py-1 text-[10px] font-bold text-yellow-700">

                                      <Crown
                                        size={11}
                                      />

                                      POWER LEG

                                    </span>

                                  )}

                                </div>


                                <div className="mt-1 truncate font-bold text-gray-900">

                                  {
                                    leg.root
                                      .full_name
                                  }

                                </div>


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


                              {/* MEMBERS BELOW */}

                              <div className="hidden text-right sm:block">

                                <div className="text-lg font-bold text-gray-900">

                                  {formatNumber(
                                    leg
                                      .membersBelow
                                  )}

                                </div>


                                <div className="text-[10px] text-gray-500">

                                  members below

                                </div>

                              </div>


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
                                >

                                  {formatNumber(
                                    leg
                                      .totalMembers
                                  )}

                                </span>


                                <span className="text-[9px] text-gray-500">

                                  total leg

                                </span>

                              </div>

                            </button>


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


                            {/* ========================= */}
                            {/* LEG CONTENT */}
                            {/* ========================= */}

                            {isExpanded && (

                              <div className="border-t border-gray-100 p-4">


                                {/* ROOT DIRECT */}

                                <div className={`mb-4 rounded-2xl border p-4 ${
                                  leg
                                    .isPowerLeg

                                    ? "border-yellow-200 bg-yellow-50/50"

                                    : "border-purple-100 bg-purple-50"
                                }`}
                                >

                                  <div className="flex items-center gap-3">


                                    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
                                      leg
                                        .isPowerLeg

                                        ? "bg-yellow-100 text-yellow-600"

                                        : "bg-purple-100 text-purple-600"
                                    }`}
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


                                    <div className="min-w-0 flex-1">

                                      <div className="flex flex-wrap items-center gap-2">

                                        <div className="font-bold text-gray-900">

                                          {
                                            leg.root
                                              .full_name
                                          }

                                        </div>


                                        {leg
                                          .isPowerLeg && (

                                          <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-[10px] font-bold text-yellow-700">

                                            POWER LEG

                                          </span>

                                        )}

                                      </div>


                                      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">

                                        <span>

                                          Customer ID:{" "}

                                          {
                                            leg.root
                                              .customer_id ||
                                            "-"
                                          }

                                        </span>


                                        <span>

                                          Referral ID:{" "}

                                          {
                                            leg.root
                                              .referral_id ||
                                            "-"
                                          }

                                        </span>


                                        <span>

                                          Joined:{" "}

                                          {formatDate(
                                            leg.root
                                              .created_at
                                          )}

                                        </span>

                                      </div>

                                    </div>


                                    <div className="hidden text-right sm:block">

                                      <div className="text-sm font-bold text-purple-700">

                                        {formatNumber(
                                          leg.root
                                            .direct_team_count
                                        )}

                                      </div>


                                      <div className="text-[10px] text-gray-500">

                                        directs

                                      </div>

                                    </div>

                                  </div>

                                </div>


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

                                            node={
                                              child
                                            }

                                            treeLevel={
                                              0
                                            }
                                          />

                                        )
                                      )}

                                  </div>

                                ) : (

                                  <div className="rounded-xl border border-dashed border-gray-200 px-4 py-6 text-center">

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


                  {/* =================================== */}
                  {/* POWER LEG INFORMATION */}
                  {/* =================================== */}

                  {legs.length > 0 && (

                    <div className="mt-6 rounded-2xl border border-yellow-200 bg-yellow-50 p-5">


                      <div className="flex gap-3">


                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-yellow-100 text-yellow-600">

                          <Crown
                            size={18}
                          />

                        </div>


                        <div>

                          <h3 className="font-bold text-yellow-800">

                            Power Leg Tracking

                          </h3>


                          <p className="mt-1 text-xs leading-5 text-gray-600">

                            Each direct referral creates a separate team leg.
                            The branch with the highest total number of members
                            is identified as the Power Leg. Every member below
                            that direct remains connected to the same root leg,
                            making large team structures easier to track.

                          </p>


                          {summary
                            .power_legs &&
                            summary
                              .power_legs
                              .length > 1 && (

                              <p className="mt-2 text-xs font-semibold text-yellow-700">

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

  );
};


export default MyAllCircle;