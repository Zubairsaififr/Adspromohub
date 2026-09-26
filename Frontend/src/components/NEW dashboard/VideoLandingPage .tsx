import React, {
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";

import {
    ChevronDown,
    Volume2,
    VolumeX,
    Menu,
    X,
    LogOut,
    User,
    Copy,
    Check,
} from "lucide-react";

import {
    useNavigate,
} from "react-router-dom";

import video1 from "../../assets/Videos/vide0-1.mp4";
import video2 from "../../assets/Videos/video-2.mp4";
import video3 from "../../assets/Videos/video-3.mp4";
import video4 from "../../assets/Videos/video-4.mp4";
import video5 from "../../assets/Videos/video-5.mp4";
import video6 from "../../assets/Videos/video-6.mp4";
import video7 from "../../assets/Videos/video-7.mp4";
import video8 from "../../assets/Videos/video-8.mp4";
import video9 from "../../assets/Videos/video-9.mp4";
import video10 from "../../assets/Videos/video-10.mp4";
import video11 from "../../assets/Videos/video-11.mp4";
import video12 from "../../assets/Videos/video-12.mp4";
import logo from "../../assets/Logo.png";

// =====================================================
// API
// =====================================================

const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://127.0.0.1:8000";

// =====================================================
// VIDEOS
// =====================================================

const videoSources = [
    video1,
    video2,
    video3,
    video4,
    video5,
    video6,
    video7,
    video8,
    video9,
    video10,
    video11,
    video12,
];

// =====================================================
// RANDOM VIDEO
// =====================================================

const getRandomVideoIndex = (
    currentIndex: number
): number => {
    const availableIndexes =
        videoSources
            .map(
                (_, index) => index
            )
            .filter(
                (index) =>
                    index !== currentIndex
            );

    return availableIndexes[
        Math.floor(
            Math.random() *
            availableIndexes.length
        )
    ];
};

// =====================================================
// USER TYPE
// =====================================================

interface LoggedInUser {
    user_id?: number;
    customer_id?: string;
    referral_code?: string;
    full_name?: string;
    email?: string;
    role?: string;
    is_admin?: boolean;
    is_active?: boolean;
}

// =====================================================
// SUBSCRIPTION TYPE
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
// COMPOUNDING TYPES
// =====================================================

interface CompoundingSession {
    id: number;

    status:
        | "started"
        | "completed"
        | "credited"
        | "rejected";

    ad_started_at?: string | null;

    ad_completed_at?: string | null;

    watch_complete_at?: string | null;

    eligible_at?: string | null;

    watch_remaining_seconds?: number;

    credit_remaining_seconds?: number;
}

interface CompoundingStatus {
    success: boolean;

    subscription_active: boolean;

    can_watch_ad: boolean;

    reason: string;

    message: string;

    active_session: boolean;

    inside_ad_window: boolean;

    direct_referral_count: number;

    growth_percentage: number;

    earning_category: string;

    earning_multiplier: number;

    ad_watch_seconds: number;

    credit_delay_minutes: number;

    session:
        CompoundingSession | null;
}

// =====================================================
// API ERROR
// =====================================================

const getApiErrorMessage =
    async (
        response: Response
    ): Promise<string> => {
        try {
            const data =
                await response.json();

            if (
                typeof data?.detail ===
                "string"
            ) {
                return data.detail;
            }

            if (
                typeof data?.detail?.message ===
                "string"
            ) {
                return data.detail.message;
            }

            if (
                typeof data?.message ===
                "string"
            ) {
                return data.message;
            }
        } catch {
            // Ignore invalid JSON
        }

        return "Something went wrong.";
    };

// =====================================================
// BACKEND DATETIME -> UTC
// =====================================================

const parseBackendDate =
    (
        value?: string | null
    ): number => {
        if (!value) {
            return 0;
        }

        /*
         * Backend currently stores UTC datetime
         * without timezone information.
         *
         * Adding Z makes the browser interpret
         * it as UTC instead of local time.
         */

        const normalized =
            value.endsWith("Z") ||
                value.includes("+")
                ? value
                : `${value}Z`;

        const timestamp =
            new Date(
                normalized
            ).getTime();

        if (
            Number.isNaN(
                timestamp
            )
        ) {
            return 0;
        }

        return timestamp;
    };

// =====================================================
// SECONDS UNTIL
// =====================================================

const getSecondsUntil =
    (
        value?: string | null
    ): number => {
        const target =
            parseBackendDate(
                value
            );

        if (!target) {
            return 0;
        }

        return Math.max(
            Math.ceil(
                (
                    target -
                    Date.now()
                ) /
                1000
            ),
            0
        );
    };

// =====================================================
// COUNTDOWN FORMAT
// =====================================================

const formatCountdown =
    (
        totalSeconds: number
    ): string => {
        const safe =
            Math.max(
                Math.floor(
                    totalSeconds
                ),
                0
            );

        const hours =
            Math.floor(
                safe /
                3600
            );

        const minutes =
            Math.floor(
                (
                    safe %
                    3600
                ) /
                60
            );

        const seconds =
            safe %
            60;

        if (hours > 0) {
            return (
                `${String(hours).padStart(
                    2,
                    "0"
                )}:` +
                `${String(minutes).padStart(
                    2,
                    "0"
                )}:` +
                `${String(seconds).padStart(
                    2,
                    "0"
                )}`
            );
        }

        return (
            `${String(minutes).padStart(
                2,
                "0"
            )}:` +
            `${String(seconds).padStart(
                2,
                "0"
            )}`
        );
    };

// =====================================================
// VIDEO LANDING PAGE
// =====================================================

const VideoLandingPage:
    React.FC = () => {

        const navigate =
            useNavigate();

        const videoRef =
            useRef<HTMLVideoElement | null>(
                null
            );

        // =================================================
        // REQUEST GUARDS
        // =================================================

        const finishingWatchRef =
            useRef(false);

        const claimingIncomeRef =
            useRef(false);

        // =================================================
        // USER STATE
        // =================================================

        const [
            loggedInUser,
            setLoggedInUser,
        ] = useState<LoggedInUser | null>(
            null
        );

        // =================================================
        // SUBSCRIPTION STATE
        // =================================================

        const [
            subscription,
            setSubscription,
        ] = useState<SubscriptionData | null>(
            null
        );

        // =================================================
        // CUSTOMER ID COPY STATE
        // =================================================

        const [
            customerIdCopied,
            setCustomerIdCopied,
        ] = useState(false);

        // =================================================
        // VIDEO STATES
        // =================================================

        const [
            currentVideo,
            setCurrentVideo,
        ] = useState(
            () =>
                Math.floor(
                    Math.random() *
                    videoSources.length
                )
        );

        const [
            isMuted,
            setIsMuted,
        ] = useState(true);

        const [
            isScrolled,
            setIsScrolled,
        ] = useState(false);

        const [
            menuOpen,
            setMenuOpen,
        ] = useState(false);

        const [
            videoScale,
            setVideoScale,
        ] = useState(1);

        // =================================================
        // COMPOUNDING STATE
        // =================================================

        const [
            compoundingStatus,
            setCompoundingStatus,
        ] =
            useState<CompoundingStatus | null>(
                null
            );

        const [
            compoundingLoading,
            setCompoundingLoading,
        ] = useState(true);

        const [
            startingAd,
            setStartingAd,
        ] = useState(false);

        const [
            adLocked,
            setAdLocked,
        ] = useState(false);

        const [
            adSessionId,
            setAdSessionId,
        ] =
            useState<number | null>(
                null
            );

        const [
            adRemainingSeconds,
            setAdRemainingSeconds,
        ] = useState(0);

        const [
            creditRemainingSeconds,
            setCreditRemainingSeconds,
        ] = useState(0);

        const [
            compoundingMessage,
            setCompoundingMessage,
        ] = useState("");

        const [
            successMessage,
            setSuccessMessage,
        ] = useState("");

        const [
            errorMessage,
            setErrorMessage,
        ] = useState("");

        // =================================================
        // LOGOUT / INVALID AUTH
        // =================================================

        const clearAuthentication =
            useCallback(
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

                    localStorage.removeItem(
                        "rememberMe"
                    );

                    setLoggedInUser(
                        null
                    );

                    setSubscription(
                        null
                    );

                    setMenuOpen(
                        false
                    );

                    navigate(
                        "/signin",
                        {
                            replace: true,
                        }
                    );
                },
                [navigate]
            );

        // =================================================
        // LOAD LOGGED-IN USER
        // =================================================

        useEffect(() => {

            const accessToken =
                localStorage.getItem(
                    "access_token"
                );

            const savedUser =
                localStorage.getItem(
                    "user"
                );

            if (
                !accessToken ||
                !savedUser
            ) {

                clearAuthentication();

                return;
            }

            try {

                const parsedUser:
                    LoggedInUser =
                    JSON.parse(
                        savedUser
                    );

                if (
                    !parsedUser.customer_id
                ) {
                    throw new Error(
                        "Customer ID missing."
                    );
                }

                if (
                    parsedUser.is_admin ===
                    true ||
                    parsedUser.role ===
                    "admin"
                ) {

                    navigate(
                        "/admin",
                        {
                            replace: true,
                        }
                    );

                    return;
                }

                setLoggedInUser(
                    parsedUser
                );

            } catch (error) {

                console.error(
                    "Failed to read logged-in user:",
                    error
                );

                clearAuthentication();
            }

        }, [
            clearAuthentication,
            navigate,
        ]);

        // =================================================
        // LOAD CURRENT SUBSCRIPTION
        // =================================================

        const loadSubscription =
            useCallback(
                async () => {

                    const token =
                        localStorage.getItem(
                            "access_token"
                        );

                    if (!token) {
                        return;
                    }

                    try {

                        const response =
                            await fetch(
                                `${API_URL}/api/subscription/current`,
                                {
                                    method:
                                        "GET",

                                    headers: {
                                        Authorization:
                                            `Bearer ${token}`,
                                    },
                                }
                            );

                        if (
                            response.status ===
                            401
                        ) {
                            clearAuthentication();
                            return;
                        }

                        if (!response.ok) {

                            console.error(
                                "Unable to load subscription."
                            );

                            return;
                        }

                        const data:
                            SubscriptionData =
                            await response.json();

                        setSubscription(
                            data
                        );

                    } catch (error) {

                        console.error(
                            "Subscription load error:",
                            error
                        );
                    }
                },
                [clearAuthentication]
            );

        useEffect(() => {

            loadSubscription();

        }, [loadSubscription]);

        // =================================================
        // LOAD COMPOUNDING STATUS
        // =================================================

        const loadCompoundingStatus =
            useCallback(
                async () => {

                    const token =
                        localStorage.getItem(
                            "access_token"
                        );

                    if (!token) {
                        return;
                    }

                    try {

                        const response =
                            await fetch(
                                `${API_URL}/api/daily-compounding/status`,
                                {
                                    method:
                                        "GET",

                                    headers: {
                                        Authorization:
                                            `Bearer ${token}`,
                                    },
                                }
                            );

                        if (
                            response.status ===
                            401
                        ) {

                            clearAuthentication();

                            return;
                        }

                        if (!response.ok) {

                            const message =
                                await getApiErrorMessage(
                                    response
                                );

                            setErrorMessage(
                                message
                            );

                            return;
                        }

                        const data:
                            CompoundingStatus =
                            await response.json();

                        setCompoundingStatus(
                            data
                        );

                        setCompoundingMessage(
                            data.message || ""
                        );

                        // ================================
                        // RESTORE RUNNING AD
                        // ================================

                        if (
                            data.active_session &&
                            data.session?.status ===
                            "started"
                        ) {

                            setAdSessionId(
                                data.session.id
                            );

                            setAdLocked(
                                true
                            );

                            setSuccessMessage(
                                ""
                            );

                            setErrorMessage(
                                ""
                            );

                            let remaining =
                                data.session
                                    .watch_remaining_seconds ||
                                0;

                            if (
                                data.session
                                    .watch_complete_at
                            ) {

                                remaining =
                                    getSecondsUntil(
                                        data.session
                                            .watch_complete_at
                                    );
                            }

                            setAdRemainingSeconds(
                                Math.max(
                                    remaining,
                                    0
                                )
                            );

                            setCreditRemainingSeconds(
                                0
                            );

                            return;
                        }

                        // ================================
                        // WAITING FOR CREDIT
                        // ================================

                        if (
                            data.active_session &&
                            data.session?.status ===
                            "completed"
                        ) {

                            setAdLocked(
                                false
                            );

                            setAdSessionId(
                                data.session.id
                            );

                            let remaining =
                                data.session
                                    .credit_remaining_seconds ||
                                0;

                            if (
                                data.session
                                    .eligible_at
                            ) {

                                remaining =
                                    getSecondsUntil(
                                        data.session
                                            .eligible_at
                                    );
                            }

                            setCreditRemainingSeconds(
                                Math.max(
                                    remaining,
                                    0
                                )
                            );

                            setAdRemainingSeconds(
                                0
                            );

                            return;
                        }

                        // ================================
                        // NO OPEN SESSION
                        // ================================

                        setAdLocked(
                            false
                        );

                        setAdSessionId(
                            null
                        );

                        setAdRemainingSeconds(
                            0
                        );

                        setCreditRemainingSeconds(
                            0
                        );

                    } catch (error) {

                        console.error(
                            "Compounding status error:",
                            error
                        );

                        setErrorMessage(
                            "Unable to connect to compounding service."
                        );

                    } finally {

                        setCompoundingLoading(
                            false
                        );
                    }
                },
                [clearAuthentication]
            );

        useEffect(() => {

            loadCompoundingStatus();

        }, [loadCompoundingStatus]);

        // =================================================
        // SCROLL EFFECT
        // =================================================

        useEffect(() => {

            const handleScroll =
                () => {

                    const scrollTop =
                        window.scrollY;

                    const heroHeight =
                        window.innerHeight;

                    const progress =
                        Math.min(
                            scrollTop /
                            heroHeight,
                            1
                        );

                    setIsScrolled(
                        scrollTop > 70
                    );

                    setVideoScale(
                        1 +
                        progress *
                        0.22
                    );
                };

            window.addEventListener(
                "scroll",
                handleScroll,
                {
                    passive: true,
                }
            );

            handleScroll();

            return () => {

                window.removeEventListener(
                    "scroll",
                    handleScroll
                );
            };

        }, []);

        // =================================================
        // VIDEO PLAY
        // =================================================

        useEffect(() => {

            const video =
                videoRef.current;

            if (!video) {
                return;
            }

            video.load();

            const playVideo =
                async () => {

                    try {

                        await video.play();

                    } catch (error) {

                        console.log(
                            "Autoplay blocked:",
                            error
                        );
                    }
                };

            playVideo();

        }, [currentVideo]);

        // =================================================
        // LOCK PAGE DURING AD
        // =================================================

        useEffect(() => {

            if (!adLocked) {

                document.body.style.overflow =
                    "";

                return;
            }

            const previousOverflow =
                document.body.style.overflow;

            document.body.style.overflow =
                "hidden";

            return () => {

                document.body.style.overflow =
                    previousOverflow;
            };

        }, [adLocked]);

        // =================================================
        // WARN ON REFRESH / CLOSE DURING AD
        // =================================================

        useEffect(() => {

            if (!adLocked) {
                return;
            }

            const handleBeforeUnload =
                (
                    event:
                        BeforeUnloadEvent
                ) => {

                    event.preventDefault();

                    event.returnValue =
                        true;
                };

            window.addEventListener(
                "beforeunload",
                handleBeforeUnload
            );

            return () => {

                window.removeEventListener(
                    "beforeunload",
                    handleBeforeUnload
                );
            };

        }, [adLocked]);

        // =================================================
        // FINISH 30-SECOND WATCH
        // =================================================

        const finishAdWatch =
            useCallback(
                async (
                    sessionId: number
                ) => {

                    if (
                        finishingWatchRef.current
                    ) {
                        return;
                    }

                    finishingWatchRef.current =
                        true;

                    const token =
                        localStorage.getItem(
                            "access_token"
                        );

                    if (!token) {

                        finishingWatchRef.current =
                            false;

                        clearAuthentication();

                        return;
                    }

                    try {

                        const response =
                            await fetch(
                                `${API_URL}/api/daily-compounding/finish-watch/${sessionId}`,
                                {
                                    method:
                                        "POST",

                                    headers: {
                                        Authorization:
                                            `Bearer ${token}`,

                                        "Content-Type":
                                            "application/json",
                                    },
                                }
                            );

                        if (
                            response.status ===
                            401
                        ) {

                            clearAuthentication();

                            return;
                        }

                        if (!response.ok) {

                            const message =
                                await getApiErrorMessage(
                                    response
                                );

                            setErrorMessage(
                                message
                            );

                            await loadCompoundingStatus();

                            return;
                        }

                        const data =
                            await response.json();

                        setAdLocked(
                            false
                        );

                        setAdRemainingSeconds(
                            0
                        );

                        setCompoundingMessage(
                            data.message ||
                            "Advertisement completed."
                        );

                        setSuccessMessage(
                            "Ad completed successfully. Your compounding income is now pending."
                        );

                        setErrorMessage(
                            ""
                        );

                        await loadCompoundingStatus();

                    } catch (error) {

                        console.error(
                            "Finish ad error:",
                            error
                        );

                        setErrorMessage(
                            "Unable to complete the advertisement. Please try again."
                        );

                        await loadCompoundingStatus();

                    } finally {

                        finishingWatchRef.current =
                            false;
                    }
                },
                [
                    clearAuthentication,
                    loadCompoundingStatus,
                ]
            );

        // =================================================
        // AD TIMER
        // =================================================

        useEffect(() => {

            if (
                !adLocked ||
                !adSessionId
            ) {
                return;
            }

            if (
                adRemainingSeconds <=
                0
            ) {

                const finishTimer =
                    window.setTimeout(
                        () => {

                            finishAdWatch(
                                adSessionId
                            );

                        },
                        1000
                    );

                return () => {

                    window.clearTimeout(
                        finishTimer
                    );
                };
            }

            const timer =
                window.setTimeout(
                    () => {

                        setAdRemainingSeconds(
                            (
                                previous
                            ) =>
                                Math.max(
                                    previous -
                                    1,
                                    0
                                )
                        );

                    },
                    1000
                );

            return () => {

                window.clearTimeout(
                    timer
                );
            };

        }, [
            adLocked,
            adSessionId,
            adRemainingSeconds,
            finishAdWatch,
        ]);

        // =================================================
        // CLAIM COMPOUNDING
        // =================================================

        const claimCompoundingIncome =
            useCallback(
                async (
                    sessionId: number
                ) => {

                    if (
                        claimingIncomeRef.current
                    ) {
                        return;
                    }

                    claimingIncomeRef.current =
                        true;

                    const token =
                        localStorage.getItem(
                            "access_token"
                        );

                    if (!token) {

                        claimingIncomeRef.current =
                            false;

                        clearAuthentication();

                        return;
                    }

                    try {

                        const response =
                            await fetch(
                                `${API_URL}/api/daily-compounding/complete/${sessionId}`,
                                {
                                    method:
                                        "POST",

                                    headers: {
                                        Authorization:
                                            `Bearer ${token}`,

                                        "Content-Type":
                                            "application/json",
                                    },
                                }
                            );

                        if (
                            response.status ===
                            401
                        ) {

                            clearAuthentication();

                            return;
                        }

                        if (!response.ok) {

                            const message =
                                await getApiErrorMessage(
                                    response
                                );

                            setErrorMessage(
                                message
                            );

                            await loadCompoundingStatus();

                            return;
                        }

                        const data =
                            await response.json();

                        const growthAmount =
                            Number(
                                data?.growth
                                    ?.growth_amount ||
                                0
                            );

                        const walletBalance =
                            Number(
                                data?.wallet
                                    ?.balance ||
                                0
                            );

                        setSuccessMessage(
                            growthAmount > 0
                                ? `Daily compounding $${growthAmount.toFixed(
                                    2
                                )} credited successfully. Income Wallet balance: $${walletBalance.toFixed(
                                    2
                                )}.`
                                : "Daily compounding income credited successfully."
                        );

                        setErrorMessage(
                            ""
                        );

                        setCompoundingMessage(
                            "Daily compounding growth credited successfully."
                        );

                        setCreditRemainingSeconds(
                            0
                        );

                        setAdSessionId(
                            null
                        );

                        await Promise.all([
                            loadCompoundingStatus(),
                            loadSubscription(),
                        ]);

                    } catch (error) {

                        console.error(
                            "Compounding claim error:",
                            error
                        );

                        setErrorMessage(
                            "Unable to credit compounding income."
                        );

                    } finally {

                        claimingIncomeRef.current =
                            false;
                    }
                },
                [
                    clearAuthentication,
                    loadCompoundingStatus,
                    loadSubscription,
                ]
            );

        // =================================================
        // CREDIT COUNTDOWN
        // =================================================

        useEffect(() => {

            if (
                adLocked ||
                !adSessionId ||
                compoundingStatus
                    ?.session
                    ?.status !==
                "completed"
            ) {
                return;
            }

            if (
                creditRemainingSeconds <=
                0
            ) {

                claimCompoundingIncome(
                    adSessionId
                );

                return;
            }

            const timer =
                window.setTimeout(
                    () => {

                        setCreditRemainingSeconds(
                            (
                                previous
                            ) =>
                                Math.max(
                                    previous -
                                    1,
                                    0
                                )
                        );

                    },
                    1000
                );

            return () => {

                window.clearTimeout(
                    timer
                );
            };

        }, [
            adLocked,
            adSessionId,
            creditRemainingSeconds,
            compoundingStatus,
            claimCompoundingIncome,
        ]);

        // =================================================
        // START AD
        // =================================================

        const handleWatchAdsAndEarn =
            async () => {

                if (
                    startingAd ||
                    adLocked
                ) {
                    return;
                }

                setSuccessMessage(
                    ""
                );

                setErrorMessage(
                    ""
                );

                const token =
                    localStorage.getItem(
                        "access_token"
                    );

                if (!token) {

                    clearAuthentication();

                    return;
                }

                if (
                    compoundingStatus &&
                    !compoundingStatus
                        .subscription_active
                ) {

                    setErrorMessage(
                        "An active subscription is required to watch ads and earn."
                    );

                    return;
                }

                if (
                    compoundingStatus
                        ?.active_session &&
                    compoundingStatus
                        ?.session
                        ?.status ===
                    "completed"
                ) {

                    setErrorMessage(
                        "Your previous compounding income is still pending."
                    );

                    return;
                }

                if (
                    compoundingStatus &&
                    !compoundingStatus
                        .can_watch_ad &&
                    !compoundingStatus
                        .active_session
                ) {

                    setErrorMessage(
                        compoundingStatus
                            .message ||
                        "Watch Ads & Earn is not available right now."
                    );

                    return;
                }

                setStartingAd(
                    true
                );

                try {

                    const response =
                        await fetch(
                            `${API_URL}/api/daily-compounding/start`,
                            {
                                method:
                                    "POST",

                                headers: {
                                    Authorization:
                                        `Bearer ${token}`,

                                    "Content-Type":
                                        "application/json",
                                },
                            }
                        );

                    if (
                        response.status ===
                        401
                    ) {

                        clearAuthentication();

                        return;
                    }

                    if (!response.ok) {

                        const message =
                            await getApiErrorMessage(
                                response
                            );

                        setErrorMessage(
                            message
                        );

                        await loadCompoundingStatus();

                        return;
                    }

                    const data =
                        await response.json();

                    const sessionId =
                        Number(
                            data?.session
                                ?.id
                        );

                    if (
                        !sessionId ||
                        Number.isNaN(
                            sessionId
                        )
                    ) {

                        throw new Error(
                            "Invalid ad session ID."
                        );
                    }

                    const watchSeconds =
                        Number(
                            data?.session
                                ?.ad_watch_seconds ||
                            compoundingStatus
                                ?.ad_watch_seconds ||
                            30
                        );

                    setAdSessionId(
                        sessionId
                    );

                    setAdRemainingSeconds(
                        Math.max(
                            watchSeconds,
                            0
                        )
                    );

                    setCreditRemainingSeconds(
                        0
                    );

                    setCompoundingMessage(
                        "Advertisement is running. Please watch the complete ad."
                    );

                    setMenuOpen(
                        false
                    );

                    setAdLocked(
                        true
                    );

                    await loadCompoundingStatus();

                } catch (error) {

                    console.error(
                        "Start ad error:",
                        error
                    );

                    setErrorMessage(
                        "Unable to start advertisement. Please try again."
                    );

                } finally {

                    setStartingAd(
                        false
                    );
                }
            };

        // =================================================
        // CHANGE RANDOM VIDEO
        // =================================================

        const changeToRandomVideo =
            () => {

                if (adLocked) {
                    return;
                }

                setCurrentVideo(
                    (
                        previousIndex
                    ) =>
                        getRandomVideoIndex(
                            previousIndex
                        )
                );
            };

        // =================================================
        // VIDEO ENDED
        // =================================================

        const handleVideoEnded =
            () => {

                if (adLocked) {

                    const video =
                        videoRef.current;

                    if (video) {

                        video.currentTime =
                            0;

                        video.play().catch(
                            () => {
                                // Ignore autoplay issue
                            }
                        );
                    }

                    return;
                }

                changeToRandomVideo();
            };

        // =================================================
        // MUTE
        // =================================================

        const toggleMute =
            () => {

                if (adLocked) {
                    return;
                }

                setIsMuted(
                    (
                        previousState
                    ) =>
                        !previousState
                );
            };

        // =================================================
        // SCROLL TO CONTENT
        // =================================================

        const scrollToContent =
            () => {

                if (adLocked) {
                    return;
                }

                window.scrollTo({
                    top:
                        window.innerHeight,

                    behavior:
                        "smooth",
                });
            };

        // =================================================
        // DASHBOARD
        // =================================================

        const goToDashboard =
            () => {

                if (adLocked) {
                    return;
                }

                setMenuOpen(
                    false
                );

                navigate(
                    "/newdashboard"
                );
            };

        // =================================================
        // LOGOUT
        // =================================================

        const handleLogout =
            () => {

                if (adLocked) {
                    return;
                }

                clearAuthentication();
            };

        // =================================================
        // USER DISPLAY VALUES
        // =================================================

        const userName =
            loggedInUser
                ?.full_name
                ?.trim() ||
            "User";

        const customerId =
            loggedInUser
                ?.customer_id
                ?.trim() ||
            "";

        // =================================================
        // SUBSCRIPTION DISPLAY VALUES
        // =================================================

        const subscriptionAmount =
            Number(
                subscription
                    ?.current_amount ||
                0
            );

        const subscriptionActive =
            Boolean(
                subscription
                    ?.subscription_active
            ) &&
            subscriptionAmount >
            0;

        const subscriptionStatus =
            subscriptionActive
                ? "ACTIVE"
                : "INACTIVE";

        // =================================================
        // COPY CUSTOMER ID
        // =================================================

        const handleCopyCustomerId =
            async (
                event:
                    React.MouseEvent
            ) => {

                event.stopPropagation();

                if (
                    adLocked ||
                    !customerId
                ) {
                    return;
                }

                try {

                    await navigator
                        .clipboard
                        .writeText(
                            customerId
                        );

                    setCustomerIdCopied(
                        true
                    );

                    window.setTimeout(
                        () => {

                            setCustomerIdCopied(
                                false
                            );

                        },
                        2000
                    );

                } catch (error) {

                    console.error(
                        "Customer ID copy failed:",
                        error
                    );
                }
            };

        // =================================================
        // WATCH BUTTON STATE
        // =================================================

        const watchButtonDisabled =
            compoundingLoading ||
            startingAd ||
            adLocked ||
            (
                compoundingStatus
                    ?.active_session ===
                true &&
                compoundingStatus
                    ?.session
                    ?.status ===
                "completed"
            ) ||
            (
                compoundingStatus !==
                null &&
                !compoundingStatus
                    .can_watch_ad
            );

        let watchButtonText =
            "Watch Ads & Earn";

        if (compoundingLoading) {

            watchButtonText =
                "Checking Availability...";

        } else if (startingAd) {

            watchButtonText =
                "Starting Ad...";

        } else if (adLocked) {

            watchButtonText =
                `Watching Ad ${formatCountdown(
                    adRemainingSeconds
                )}`;

        } else if (
            compoundingStatus
                ?.active_session &&
            compoundingStatus
                ?.session
                ?.status ===
            "completed"
        ) {

            if (
                creditRemainingSeconds >
                0
            ) {

                watchButtonText =
                    `Reward Pending ${formatCountdown(
                        creditRemainingSeconds
                    )}`;

            } else {

                watchButtonText =
                    "Crediting Reward...";
            }
        }

        // =================================================
        // UI
        // =================================================

        return (
            <main className="min-h-screen bg-[#120B0D] text-white">

                {/* =========================================
                    STICKY HEADER
                ========================================== */}

                <header
                    className={`fixed left-0 right-0 top-0 z-50 transition-all duration-500 ${
                        isScrolled
                            ? "bg-[#120B0D]/90 shadow-lg shadow-[#8F4F5A]/10 backdrop-blur-xl"
                            : "bg-transparent"
                    }`}
                >

                    <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-12">

                        {/* LOGO */}

                        <div className="mb-4 flex items-center gap-2.5">

                            <div
                                className="
                                    flex
                                    h-8
                                    w-8
                                    items-center
                                    justify-center
                                    rounded-lg
                                    text-xs
                                    font-black
                                    shadow-lg
                                    shadow-[#B76E79]/20
                                "
                            >
                                <img
                                    src={logo}
                                    alt=""
                                />
                            </div>

                            <span
                                className="
                                    text-xl
                                    font-black
                                    tracking-tight
                                    bg-gradient-to-r
                                    from-[#8F4F5A]
                                    via-[#B76E79]
                                    to-[#E3AAB2]
                                    bg-clip-text
                                    text-transparent
                                "
                            >
                                ADSPROMOHUB
                            </span>

                        </div>

                        {/* DESKTOP NAVIGATION */}

                        <nav className="hidden items-center gap-4 md:flex">

                            <button
                                type="button"
                                onClick={() => {
                                    if (!adLocked) {
                                        navigate(
                                            "/dashboard"
                                        );
                                    }
                                }}
                                className="cursor-pointer text-sm font-medium text-white/80 transition hover:text-[#D99AA3]"
                            >
                                Dashboard
                            </button>

                            {/* USER DETAILS */}

                            <button
                                type="button"
                                onClick={
                                    goToDashboard
                                }
                                className="flex cursor-pointer items-center gap-3 rounded-full border border-[#D99AA3]/20 bg-[#B76E79]/10 px-4 py-2 transition hover:border-[#D99AA3]/40 hover:bg-[#B76E79]/20"
                            >

                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#8F4F5A] to-[#B76E79]">
                                    <User
                                        size={
                                            16
                                        }
                                    />
                                </div>

                                <div className="text-left">

                                    <p className="max-w-[150px] truncate text-sm font-semibold text-white">
                                        {
                                            userName
                                        }
                                    </p>

                                    {customerId && (
                                        <div
                                            role="button"
                                            tabIndex={0}
                                            onClick={
                                                handleCopyCustomerId
                                            }
                                            onKeyDown={async (
                                                event
                                            ) => {

                                                if (
                                                    adLocked
                                                ) {
                                                    return;
                                                }

                                                if (
                                                    event.key ===
                                                    "Enter" ||
                                                    event.key ===
                                                    " "
                                                ) {

                                                    event.preventDefault();
                                                    event.stopPropagation();

                                                    try {

                                                        await navigator
                                                            .clipboard
                                                            .writeText(
                                                                customerId
                                                            );

                                                        setCustomerIdCopied(
                                                            true
                                                        );

                                                        window.setTimeout(
                                                            () => {

                                                                setCustomerIdCopied(
                                                                    false
                                                                );

                                                            },
                                                            2000
                                                        );

                                                    } catch (
                                                        error
                                                    ) {

                                                        console.error(
                                                            "Customer ID copy failed:",
                                                            error
                                                        );
                                                    }
                                                }
                                            }}
                                            title="Click to copy Customer ID"
                                            className="mt-0.5 flex w-fit cursor-copy items-center gap-1 text-[10px] font-medium tracking-wide text-[#D99AA3]/70 transition hover:text-[#E3AAB2]"
                                        >

                                            <span>
                                                {
                                                    customerId
                                                }
                                            </span>

                                            {customerIdCopied ? (
                                                <Check
                                                    size={
                                                        10
                                                    }
                                                    className="text-[#E3AAB2]"
                                                />
                                            ) : (
                                                <Copy
                                                    size={
                                                        10
                                                    }
                                                />
                                            )}

                                        </div>
                                    )}

                                </div>

                            </button>

                            {/* SUBSCRIPTION */}

                            <button
                                type="button"
                                onClick={
                                    goToDashboard
                                }
                                className="cursor-pointer rounded-full bg-gradient-to-r from-[#8F4F5A] via-[#B76E79] to-[#D99AA3] px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-[#B76E79]/15 transition hover:scale-[1.02]"
                            >

                                <span>
                                    ${subscriptionAmount.toFixed(
                                        2
                                    )}
                                </span>

                                <span
                                    className={`ml-2 text-[10px] font-bold ${
                                        subscriptionActive
                                            ? "text-[#FFE5E8]"
                                            : "text-[#D99AA3]"
                                    }`}
                                >
                                    {
                                        subscriptionStatus
                                    }
                                </span>

                            </button>

                            {/* LOGOUT */}

                            <button
                                type="button"
                                onClick={
                                    handleLogout
                                }
                                className="flex cursor-pointer items-center gap-2 rounded-full border border-[#D99AA3]/30 bg-[#8F4F5A]/15 px-4 py-2 text-sm font-semibold text-[#E3AAB2] transition hover:border-[#D99AA3]/50 hover:bg-[#B76E79]/20 hover:text-white"
                            >

                                <LogOut
                                    size={
                                        16
                                    }
                                />

                                Logout

                            </button>

                        </nav>

                        {/* MOBILE MENU */}

                        <button
                            type="button"
                            onClick={() => {

                                if (adLocked) {
                                    return;
                                }

                                setMenuOpen(
                                    (
                                        previousState
                                    ) =>
                                        !previousState
                                );
                            }}
                            className="rounded-full border border-[#D99AA3]/40 p-2 text-white transition hover:border-[#E3AAB2]/70 hover:bg-[#B76E79]/10 md:hidden"
                            aria-label="Toggle menu"
                        >

                            {menuOpen ? (
                                <X
                                    size={
                                        22
                                    }
                                />
                            ) : (
                                <Menu
                                    size={
                                        22
                                    }
                                />
                            )}

                        </button>

                    </div>

                    {/* MOBILE NAVIGATION */}

                    {menuOpen && (
                        <div className="border-t border-[#D99AA3]/15 bg-[#120B0D]/95 px-5 py-5 backdrop-blur-xl md:hidden">

                            <nav className="flex flex-col gap-4">

                                <div className="flex items-center gap-3 rounded-xl border border-[#D99AA3]/20 bg-[#B76E79]/10 p-4">

                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#8F4F5A] to-[#B76E79]">

                                        <User
                                            size={
                                                20
                                            }
                                        />

                                    </div>

                                    <div className="min-w-0">

                                        <p className="truncate text-sm font-semibold text-white">
                                            {
                                                userName
                                            }
                                        </p>

                                        {customerId && (
                                            <button
                                                type="button"
                                                onClick={
                                                    handleCopyCustomerId
                                                }
                                                title="Tap to copy Customer ID"
                                                className="mt-0.5 flex cursor-copy items-center gap-1 text-xs font-medium tracking-wide text-[#D99AA3] transition hover:text-[#E3AAB2]"
                                            >

                                                <span>
                                                    Customer ID:{" "}
                                                    {
                                                        customerId
                                                    }
                                                </span>

                                                {customerIdCopied ? (
                                                    <Check
                                                        size={
                                                            12
                                                        }
                                                        className="text-[#E3AAB2]"
                                                    />
                                                ) : (
                                                    <Copy
                                                        size={
                                                            12
                                                        }
                                                    />
                                                )}

                                            </button>
                                        )}

                                    </div>

                                </div>

                                <button
                                    type="button"
                                    onClick={() => {

                                        if (!adLocked) {
                                            navigate(
                                                "/dashboard"
                                            );
                                        }

                                    }}
                                    className="cursor-pointer rounded-xl bg-white/5 px-5 py-3 text-left font-medium text-white/80 transition hover:bg-[#B76E79]/10 hover:text-[#D99AA3]"
                                >
                                    Dashboard
                                </button>

                                <button
                                    type="button"
                                    onClick={
                                        goToDashboard
                                    }
                                    className="cursor-pointer rounded-xl bg-gradient-to-r from-[#8F4F5A] via-[#B76E79] to-[#D99AA3] px-5 py-3 text-center font-semibold text-white transition hover:scale-[1.01]"
                                >

                                    <span>
                                        Subscription:{" "}
                                        ${subscriptionAmount.toFixed(
                                            2
                                        )}
                                    </span>

                                    <span
                                        className={`ml-2 text-xs font-bold ${
                                            subscriptionActive
                                                ? "text-[#FFE5E8]"
                                                : "text-[#D99AA3]"
                                        }`}
                                    >
                                        {
                                            subscriptionStatus
                                        }
                                    </span>

                                </button>

                                <button
                                    type="button"
                                    onClick={
                                        handleLogout
                                    }
                                    className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#D99AA3]/30 bg-[#8F4F5A]/15 px-5 py-3 font-semibold text-[#E3AAB2] transition hover:bg-[#B76E79]/20 hover:text-white"
                                >

                                    <LogOut
                                        size={
                                            18
                                        }
                                    />

                                    Logout

                                </button>

                            </nav>

                        </div>
                    )}

                </header>

                {/* =========================================
                    HERO SECTION
                ========================================== */}

                <section
                    id="home"
                    className="relative h-screen min-h-[620px] w-full overflow-hidden"
                >

                    {/* VIDEO */}

                    <div
                        className="absolute inset-0 transition-transform duration-300 ease-out"
                        style={{
                            transform:
                                `scale(${videoScale})`,
                        }}
                    >

                        <video
                            ref={
                                videoRef
                            }
                            key={
                                videoSources[
                                currentVideo
                                ]
                            }
                            src={
                                videoSources[
                                currentVideo
                                ]
                            }
                            autoPlay
                            muted={
                                isMuted
                            }
                            playsInline
                            onEnded={
                                handleVideoEnded
                            }
                            className="h-full w-full object-cover"
                        />

                    </div>

                    {/* DARK OVERLAY */}

                    <div className="absolute inset-0 bg-black/45" />

                    {/* ROSE GOLD GRADIENT OVERLAY */}

                    <div className="absolute inset-0 bg-gradient-to-b from-[#120B0D]/80 via-[#120B0D]/20 to-[#120B0D]" />

                    {/* SUBTLE ROSE GLOW */}

                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(183,110,121,0.16),transparent_42%)]" />

                    {/* HERO CONTENT */}

                    <div className="relative z-10 flex h-full items-center justify-center px-5 pt-20 text-center">

                        <div className="max-w-5xl">

                            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.35em] text-[#D99AA3] sm:text-sm">
                                Watch. Earn. Enjoy.
                            </p>

                            <h1 className="text-4xl font-black leading-[1.08] sm:text-6xl lg:text-8xl">

                                Your Screen Time

                                <span className="block bg-gradient-to-r from-[#B76E79] via-[#D99AA3] to-[#E3AAB2] bg-clip-text text-transparent">
                                    Can Earn More
                                </span>

                            </h1>

                            <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-gray-200 sm:text-lg">

                                Watch advertisements,
                                earn points, grow your
                                network, and unlock
                                exciting digital
                                opportunities with
                                ADSPROMOHUB.

                            </p>

                            <div className="mt-8 flex flex-col items-center justify-center gap-4">

                                {/* =========================
                                    WATCH ADS BUTTON
                                ========================== */}

                                <button
                                    type="button"
                                    onClick={
                                        handleWatchAdsAndEarn
                                    }
                                    disabled={
                                        watchButtonDisabled
                                    }
                                    className={`rounded-full px-8 py-4 font-bold text-white shadow-lg shadow-[#B76E79]/20 transition ${
                                        watchButtonDisabled
                                            ? "cursor-not-allowed bg-[#8F4F5A]/60 opacity-80"
                                            : "cursor-pointer bg-gradient-to-r from-[#8F4F5A] via-[#B76E79] to-[#D99AA3] hover:scale-105"
                                    }`}
                                >
                                    {
                                        watchButtonText
                                    }
                                </button>

                                {/* =========================
                                    STATUS MESSAGE
                                ========================== */}

                                {!adLocked && (
                                    <div className="max-w-xl">

                                        {successMessage && (
                                            <p className="rounded-full border border-[#D99AA3]/30 bg-[#B76E79]/10 px-5 py-2 text-xs font-medium text-[#FFE5E8] sm:text-sm">
                                                {
                                                    successMessage
                                                }
                                            </p>
                                        )}

                                        {errorMessage && (
                                            <p className="rounded-full border border-[#D99AA3]/30 bg-[#8F4F5A]/15 px-5 py-2 text-xs font-medium text-[#E3AAB2] sm:text-sm">
                                                {
                                                    errorMessage
                                                }
                                            </p>
                                        )}

                                        {!successMessage &&
                                            !errorMessage &&
                                            compoundingMessage && (
                                                <p className="text-xs font-medium text-white/70 sm:text-sm">
                                                    {
                                                        compoundingMessage
                                                    }
                                                </p>
                                            )}

                                        {compoundingStatus &&
                                            !compoundingStatus.inside_ad_window &&
                                            !compoundingStatus.active_session && (
                                                <p className="mt-2 text-xs font-semibold text-[#D99AA3]">
                                                    Ads are available from 9:00 AM to 9:00 PM.
                                                </p>
                                            )}

                                        {compoundingStatus
                                            ?.active_session &&
                                            compoundingStatus
                                                ?.session
                                                ?.status ===
                                            "completed" &&
                                            creditRemainingSeconds >
                                            0 && (
                                                <p className="mt-2 text-xs font-semibold text-[#D99AA3] sm:text-sm">
                                                    Compounding reward will be credited in{" "}
                                                    {
                                                        formatCountdown(
                                                            creditRemainingSeconds
                                                        )
                                                    }
                                                </p>
                                            )}

                                    </div>
                                )}

                            </div>

                        </div>

                    </div>

                    {/* SOUND BUTTON */}

                    <button
                        type="button"
                        onClick={
                            toggleMute
                        }
                        className="absolute bottom-24 right-5 z-20 flex h-12 w-12 items-center justify-center rounded-full border border-[#D99AA3]/40 bg-black/30 text-white backdrop-blur-md transition hover:border-[#E3AAB2]/70 hover:bg-[#B76E79] sm:right-10"
                        aria-label={
                            isMuted
                                ? "Unmute video"
                                : "Mute video"
                        }
                    >

                        {isMuted ? (
                            <VolumeX
                                size={
                                    20
                                }
                            />
                        ) : (
                            <Volume2
                                size={
                                    20
                                }
                            />
                        )}

                    </button>

                    {/* VIDEO INDICATORS */}

                    <div className="absolute bottom-28 left-1/2 z-20 flex -translate-x-1/2 gap-2">

                        {videoSources.map(
                            (
                                _,
                                index
                            ) => (

                                <button
                                    type="button"
                                    key={
                                        index
                                    }
                                    onClick={() => {

                                        if (!adLocked) {
                                            setCurrentVideo(
                                                index
                                            );
                                        }

                                    }}
                                    aria-label={
                                        `Play video ${index +
                                        1
                                        }`
                                    }
                                    className={`h-1.5 rounded-full transition-all duration-300 ${
                                        currentVideo ===
                                        index
                                            ? "w-10 bg-[#D99AA3]"
                                            : "w-5 bg-white/40"
                                    }`}
                                />

                            )
                        )}

                    </div>

                    {/* SCROLL */}

                    <button
                        type="button"
                        onClick={
                            scrollToContent
                        }
                        className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center text-white"
                        aria-label="Scroll to next section"
                    >

                        <span className="mb-2 text-[10px] uppercase tracking-[0.3em] sm:text-xs">
                            Scroll to explore
                        </span>

                        <ChevronDown
                            className="animate-bounce text-[#D99AA3]"
                            size={
                                25
                            }
                        />

                    </button>

                </section>

                {/* =========================================
                    ABOUT SECTION
                ========================================== */}

                <section className="relative overflow-hidden bg-[#120B0D] px-5 py-20 text-center text-white sm:px-8 lg:px-12">

                    <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-[#B76E79]/10 blur-3xl" />

                    <button
                        type="button"
                        onClick={() => {

                            if (!adLocked) {
                                navigate(
                                    "/dashboard"
                                );
                            }

                        }}
                        className="relative cursor-pointer rounded-full bg-gradient-to-r from-[#8F4F5A] via-[#B76E79] to-[#D99AA3] px-8 py-4 font-bold text-white shadow-lg shadow-[#B76E79]/20 transition hover:scale-105"
                    >
                        Dashboard
                    </button>

                </section>

                {/* =========================================
                    FULL SCREEN AD LOCK
                ========================================== */}

                {adLocked && (

                    <div
                        className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#120B0D]/55 px-5 backdrop-blur-[1px]"
                        onClick={(
                            event
                        ) => {

                            /*
                             * Swallow all clicks while
                             * advertisement is active.
                             */

                            event.preventDefault();
                            event.stopPropagation();
                        }}
                        onContextMenu={(
                            event
                        ) => {

                            event.preventDefault();
                        }}
                    >

                        {/* =================================
                            TIMER CARD
                        ================================== */}

                        <div className="pointer-events-none w-full max-w-sm rounded-3xl border border-[#D99AA3]/25 bg-[#120B0D]/95 p-7 text-center shadow-2xl shadow-[#B76E79]/20 backdrop-blur-xl">

                            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#D99AA3]">
                                Advertisement Running
                            </p>

                            <div className="my-6">

                                <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full border-4 border-[#B76E79] bg-[#B76E79]/10 shadow-lg shadow-[#B76E79]/20">

                                    <span className="text-4xl font-black text-white">
                                        {
                                            adRemainingSeconds
                                        }
                                    </span>

                                </div>

                            </div>

                            <h2 className="text-xl font-black text-white">
                                Keep Watching
                            </h2>

                            <p className="mt-3 text-sm leading-6 text-white/70">
                                Please watch the complete advertisement.
                                Navigation and page interactions are locked until the timer finishes.
                            </p>

                            <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">

                                <div
                                    className="h-full rounded-full bg-gradient-to-r from-[#8F4F5A] via-[#B76E79] to-[#D99AA3] transition-all duration-1000"
                                    style={{
                                        width:
                                            `${compoundingStatus
                                                ?.ad_watch_seconds
                                                ? Math.min(
                                                    100,
                                                    Math.max(
                                                        0,
                                                        (
                                                            (
                                                                compoundingStatus
                                                                    .ad_watch_seconds -
                                                                adRemainingSeconds
                                                            ) /
                                                            compoundingStatus
                                                                .ad_watch_seconds
                                                        ) *
                                                        100
                                                    )
                                                )
                                                : 0
                                            }%`,
                                    }}
                                />

                            </div>

                            <p className="mt-4 text-xs font-semibold text-[#D99AA3]">
                                Do not close or refresh this page.
                            </p>

                        </div>

                    </div>
                )}

            </main>
        );
    };

export default VideoLandingPage;