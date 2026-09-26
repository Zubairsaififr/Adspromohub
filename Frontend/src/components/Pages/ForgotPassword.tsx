import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import {
    ArrowLeft,
    CheckCircle2,
    Eye,
    EyeOff,
    KeyRound,
    Loader2,
    LockKeyhole,
    Mail,
    ShieldCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://127.0.0.1:8000";

type Step = 1 | 2 | 3 | 4;

const ForgotPassword: React.FC = () => {
    const navigate = useNavigate();

    // =====================================================
    // STATES
    // =====================================================

    const [step, setStep] = useState<Step>(1);

    const [login, setLogin] = useState("");

    const [otp, setOtp] = useState<string[]>([
        "",
        "",
        "",
        "",
        "",
        "",
    ]);

    const [newPassword, setNewPassword] =
        useState("");

    const [
        confirmPassword,
        setConfirmPassword,
    ] = useState("");

    const [
        showNewPassword,
        setShowNewPassword,
    ] = useState(false);

    const [
        showConfirmPassword,
        setShowConfirmPassword,
    ] = useState(false);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");

    const [
        resendSeconds,
        setResendSeconds,
    ] = useState(0);

    const otpRefs =
        useRef<Array<HTMLInputElement | null>>(
            []
        );

    // =====================================================
    // RESEND TIMER
    // =====================================================

    useEffect(() => {
        if (resendSeconds <= 0) {
            return;
        }

        const timer = window.setInterval(() => {
            setResendSeconds((previous) => {
                if (previous <= 1) {
                    window.clearInterval(timer);
                    return 0;
                }

                return previous - 1;
            });
        }, 1000);

        return () => {
            window.clearInterval(timer);
        };
    }, [resendSeconds]);

    // =====================================================
    // ERROR HANDLER
    // =====================================================

    const getErrorMessage = (
        err: unknown
    ): string => {
        if (axios.isAxiosError(err)) {
            const detail =
                err.response?.data?.detail;

            if (typeof detail === "string") {
                return detail;
            }

            if (Array.isArray(detail)) {
                return detail
                    .map(
                        (item) =>
                            item?.msg ||
                            "Validation error"
                    )
                    .join(", ");
            }

            if (!err.response) {
                return (
                    "Unable to connect to server. " +
                    "Please try again."
                );
            }
        }

        return (
            "Something went wrong. " +
            "Please try again."
        );
    };

    // =====================================================
    // CLEAR MESSAGES
    // =====================================================

    const clearMessages = () => {
        setError("");
        setSuccess("");
    };

    // =====================================================
    // STEP 1 - SEND OTP
    // =====================================================

    const handleSendOtp = async (
        event?: React.FormEvent
    ) => {
        event?.preventDefault();

        clearMessages();

        const cleanLogin = login.trim();

        if (!cleanLogin) {
            setError(
                "Please enter your Email or Customer ID."
            );
            return;
        }

        try {
            setLoading(true);

            const response = await axios.post(
                `${API_URL}/api/auth/forgot-password`,
                {
                    login: cleanLogin,
                }
            );

            if (
                response.data?.success !== true
            ) {
                throw new Error(
                    "Unable to generate OTP."
                );
            }

            setOtp([
                "",
                "",
                "",
                "",
                "",
                "",
            ]);

            setSuccess(
                "OTP generated successfully."
            );

            setStep(2);

            setResendSeconds(30);

            window.setTimeout(() => {
                otpRefs.current[0]?.focus();
            }, 100);
        } catch (err) {
            setError(
                getErrorMessage(err)
            );
        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // OTP INPUT CHANGE
    // =====================================================

    const handleOtpChange = (
        index: number,
        value: string
    ) => {
        const digit =
            value.replace(/\D/g, "").slice(-1);

        const updatedOtp = [...otp];

        updatedOtp[index] = digit;

        setOtp(updatedOtp);

        setError("");

        if (
            digit &&
            index < 5
        ) {
            otpRefs.current[
                index + 1
            ]?.focus();
        }
    };

    // =====================================================
    // OTP KEYBOARD HANDLING
    // =====================================================

    const handleOtpKeyDown = (
        index: number,
        event:
            React.KeyboardEvent<HTMLInputElement>
    ) => {
        if (
            event.key === "Backspace" &&
            !otp[index] &&
            index > 0
        ) {
            otpRefs.current[
                index - 1
            ]?.focus();
        }

        if (
            event.key === "ArrowLeft" &&
            index > 0
        ) {
            otpRefs.current[
                index - 1
            ]?.focus();
        }

        if (
            event.key === "ArrowRight" &&
            index < 5
        ) {
            otpRefs.current[
                index + 1
            ]?.focus();
        }
    };

    // =====================================================
    // OTP PASTE
    // =====================================================

    const handleOtpPaste = (
        event:
            React.ClipboardEvent<HTMLInputElement>
    ) => {
        event.preventDefault();

        const pastedValue =
            event.clipboardData
                .getData("text")
                .replace(/\D/g, "")
                .slice(0, 6);

        if (!pastedValue) {
            return;
        }

        const updatedOtp = [
            "",
            "",
            "",
            "",
            "",
            "",
        ];

        pastedValue
            .split("")
            .forEach((digit, index) => {
                updatedOtp[index] =
                    digit;
            });

        setOtp(updatedOtp);

        const nextIndex =
            Math.min(
                pastedValue.length,
                6
            ) - 1;

        otpRefs.current[
            nextIndex
        ]?.focus();
    };

    // =====================================================
    // STEP 2 - VERIFY OTP
    // =====================================================

    const handleVerifyOtp = async (
        event: React.FormEvent
    ) => {
        event.preventDefault();

        clearMessages();

        const otpCode =
            otp.join("");

        if (
            otpCode.length !== 6
        ) {
            setError(
                "Please enter the complete 6-digit OTP."
            );
            return;
        }

        try {
            setLoading(true);

            const response =
                await axios.post(
                    `${API_URL}/api/auth/verify-otp`,
                    {
                        login:
                            login.trim(),

                        otp:
                            otpCode,
                    }
                );

            if (
                response.data?.success !==
                true
            ) {
                throw new Error(
                    "OTP verification failed."
                );
            }

            setSuccess(
                "OTP verified successfully."
            );

            setStep(3);
        } catch (err) {
            setError(
                getErrorMessage(err)
            );
        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // RESEND OTP
    // =====================================================

    const handleResendOtp =
        async () => {
            if (
                resendSeconds > 0 ||
                loading
            ) {
                return;
            }

            clearMessages();

            try {
                setLoading(true);

                const response =
                    await axios.post(
                        `${API_URL}/api/auth/forgot-password`,
                        {
                            login:
                                login.trim(),
                        }
                    );

                if (
                    response.data?.success !==
                    true
                ) {
                    throw new Error(
                        "Unable to resend OTP."
                    );
                }

                setOtp([
                    "",
                    "",
                    "",
                    "",
                    "",
                    "",
                ]);

                setSuccess(
                    "A new OTP has been generated."
                );

                setResendSeconds(30);

                window.setTimeout(() => {
                    otpRefs.current[
                        0
                    ]?.focus();
                }, 100);
            } catch (err) {
                setError(
                    getErrorMessage(err)
                );
            } finally {
                setLoading(false);
            }
        };

    // =====================================================
    // STEP 3 - RESET PASSWORD
    // =====================================================

    const handleResetPassword =
        async (
            event: React.FormEvent
        ) => {
            event.preventDefault();

            clearMessages();

            if (
                newPassword.length < 8
            ) {
                setError(
                    "Password must be at least 8 characters long."
                );
                return;
            }

            if (
                newPassword !==
                confirmPassword
            ) {
                setError(
                    "Passwords do not match."
                );
                return;
            }

            const otpCode =
                otp.join("");

            try {
                setLoading(true);

                const response =
                    await axios.post(
                        `${API_URL}/api/auth/reset-password`,
                        {
                            login:
                                login.trim(),

                            otp:
                                otpCode,

                            new_password:
                                newPassword,

                            confirm_password:
                                confirmPassword,
                        }
                    );

                if (
                    response.data?.success !==
                    true
                ) {
                    throw new Error(
                        "Password reset failed."
                    );
                }

                // Remove any old login session
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

                setStep(4);

                setSuccess(
                    "Password reset successfully."
                );

                window.setTimeout(() => {
                    navigate(
                        "/signin",
                        {
                            replace: true,
                        }
                    );
                }, 2500);
            } catch (err) {
                setError(
                    getErrorMessage(err)
                );
            } finally {
                setLoading(false);
            }
        };

    // =====================================================
    // CHANGE LOGIN
    // =====================================================

    const handleChangeLogin =
        () => {
            clearMessages();

            setOtp([
                "",
                "",
                "",
                "",
                "",
                "",
            ]);

            setStep(1);
        };

    // =====================================================
    // UI
    // =====================================================

    return (
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#080511] px-4 py-10 text-white">

            {/* BACKGROUND */}

            <div className="absolute inset-0 overflow-hidden">

                <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[#B76E79]/20 blur-[120px]" />

                <div className="absolute -bottom-40 -right-32 h-[450px] w-[450px] rounded-full bg-[#8F4F5A]/20 blur-[140px]" />

                <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#D99AA3]/10 blur-[120px]" />

            </div>

            {/* CARD */}

            <div className="relative z-10 w-full max-w-md rounded-[28px] border border-white/10 bg-white/[0.06] p-6 shadow-2xl backdrop-blur-2xl sm:p-8">

                {/* BACK */}

                {step !== 4 && (
                    <button
                        type="button"
                        onClick={() => {
                            if (
                                step === 1
                            ) {
                                navigate(
                                    "/signin"
                                );
                            } else if (
                                step === 2
                            ) {
                                handleChangeLogin();
                            } else {
                                setStep(2);
                                clearMessages();
                            }
                        }}
                        className="mb-6 flex items-center gap-2 text-sm text-white/60 transition hover:text-[#E3AAB2]"
                    >
                        <ArrowLeft
                            size={17}
                        />

                        Back
                    </button>
                )}

                {/* LOGO */}

                <div className="mb-7 text-center">

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/")
                        }
                        className="text-xl font-black tracking-wide sm:text-2xl"
                    >
                        ADS
                        <span className="text-[#D99AA3]">
                            PROMOHUB
                        </span>
                    </button>

                </div>

                {/* =================================================
                    STEP 1
                ================================================== */}

                {step === 1 && (
                    <form
                        onSubmit={
                            handleSendOtp
                        }
                    >

                        <div className="mb-7 text-center">

                            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#D99AA3]/25 bg-[#B76E79]/10">

                                <KeyRound
                                    className="text-[#E3AAB2]"
                                    size={30}
                                />

                            </div>

                            <h1 className="text-2xl font-bold sm:text-3xl">
                                Forgot Password?
                            </h1>

                            <p className="mt-3 text-sm leading-6 text-white/55">
                                Enter your registered email
                                address or Customer ID to
                                generate your password reset
                                OTP.
                            </p>

                        </div>

                        {/* LOGIN */}

                        <label className="mb-2 block text-sm font-medium text-white/80">
                            Email or Customer ID
                        </label>

                        <div className="relative">

                            <Mail
                                size={18}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/35"
                            />

                            <input
                                type="text"
                                value={login}
                                onChange={(
                                    event
                                ) => {
                                    setLogin(
                                        event
                                            .target
                                            .value
                                    );

                                    setError("");
                                }}
                                placeholder="Email or APH Customer ID"
                                autoComplete="username"
                                className="w-full rounded-xl border border-white/10 bg-white/[0.06] py-3.5 pl-12 pr-4 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-[#D99AA3]/60 focus:bg-white/[0.08]"
                            />

                        </div>

                        {/* ERROR */}

                        {error && (
                            <div className="mt-4 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                                {error}
                            </div>
                        )}

                        {/* BUTTON */}

                        <button
                            type="submit"
                            disabled={
                                loading
                            }
                            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#B76E79] px-5 py-3.5 font-semibold text-white transition hover:bg-[#8F4F5A] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? (
                                <>
                                    <Loader2
                                        size={
                                            18
                                        }
                                        className="animate-spin"
                                    />

                                    Generating OTP...
                                </>
                            ) : (
                                <>
                                    Send OTP

                                    <KeyRound
                                        size={
                                            18
                                        }
                                    />
                                </>
                            )}
                        </button>

                    </form>
                )}

                {/* =================================================
                    STEP 2
                ================================================== */}

                {step === 2 && (
                    <form
                        onSubmit={
                            handleVerifyOtp
                        }
                    >

                        <div className="mb-7 text-center">

                            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#D99AA3]/25 bg-[#B76E79]/10">

                                <ShieldCheck
                                    className="text-[#E3AAB2]"
                                    size={31}
                                />

                            </div>

                            <h1 className="text-2xl font-bold sm:text-3xl">
                                Verify OTP
                            </h1>

                            <p className="mt-3 text-sm leading-6 text-white/55">
                                Enter the 6-digit OTP
                                generated for
                            </p>

                            <p className="mt-1 break-all text-sm font-semibold text-[#E3AAB2]">
                                {login}
                            </p>

                        </div>

                        {/* OTP BOXES */}

                        <div className="flex justify-center gap-2 sm:gap-3">

                            {otp.map(
                                (
                                    digit,
                                    index
                                ) => (
                                    <input
                                        key={
                                            index
                                        }
                                        ref={(
                                            element
                                        ) => {
                                            otpRefs.current[
                                                index
                                            ] =
                                                element;
                                        }}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={
                                            1
                                        }
                                        value={
                                            digit
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            handleOtpChange(
                                                index,
                                                event
                                                    .target
                                                    .value
                                            )
                                        }
                                        onKeyDown={(
                                            event
                                        ) =>
                                            handleOtpKeyDown(
                                                index,
                                                event
                                            )
                                        }
                                        onPaste={
                                            handleOtpPaste
                                        }
                                        className="h-12 w-11 rounded-xl border border-white/10 bg-white/[0.06] text-center text-lg font-bold text-white outline-none transition focus:border-[#D99AA3] focus:bg-[#B76E79]/10 sm:h-14 sm:w-12"
                                    />
                                )
                            )}

                        </div>

                        {/* SUCCESS */}

                        {success && (
                            <div className="mt-5 rounded-xl border border-green-400/20 bg-green-500/10 px-4 py-3 text-center text-sm text-green-200">
                                {success}
                            </div>
                        )}

                        {/* ERROR */}

                        {error && (
                            <div className="mt-5 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-center text-sm text-red-200">
                                {error}
                            </div>
                        )}

                        {/* VERIFY */}

                        <button
                            type="submit"
                            disabled={
                                loading
                            }
                            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#B76E79] px-5 py-3.5 font-semibold text-white transition hover:bg-[#8F4F5A] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? (
                                <>
                                    <Loader2
                                        size={
                                            18
                                        }
                                        className="animate-spin"
                                    />

                                    Verifying...
                                </>
                            ) : (
                                <>
                                    Verify OTP

                                    <ShieldCheck
                                        size={
                                            18
                                        }
                                    />
                                </>
                            )}
                        </button>

                        {/* RESEND */}

                        <div className="mt-5 text-center text-sm text-white/50">

                            Didn't get OTP?{" "}

                            <button
                                type="button"
                                disabled={
                                    resendSeconds >
                                        0 ||
                                    loading
                                }
                                onClick={
                                    handleResendOtp
                                }
                                className="font-semibold text-[#E3AAB2] transition hover:text-[#FFE5E8] disabled:cursor-not-allowed disabled:text-white/30"
                            >
                                {resendSeconds >
                                0
                                    ? `Resend in ${resendSeconds}s`
                                    : "Resend OTP"}
                            </button>

                        </div>

                    </form>
                )}

                {/* =================================================
                    STEP 3
                ================================================== */}

                {step === 3 && (
                    <form
                        onSubmit={
                            handleResetPassword
                        }
                    >

                        <div className="mb-7 text-center">

                            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#D99AA3]/25 bg-[#B76E79]/10">

                                <LockKeyhole
                                    className="text-[#E3AAB2]"
                                    size={30}
                                />

                            </div>

                            <h1 className="text-2xl font-bold sm:text-3xl">
                                Create New Password
                            </h1>

                            <p className="mt-3 text-sm leading-6 text-white/55">
                                Your OTP has been verified.
                                Create a new password for your
                                account.
                            </p>

                        </div>

                        {/* NEW PASSWORD */}

                        <label className="mb-2 block text-sm font-medium text-white/80">
                            New Password
                        </label>

                        <div className="relative">

                            <LockKeyhole
                                size={18}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/35"
                            />

                            <input
                                type={
                                    showNewPassword
                                        ? "text"
                                        : "password"
                                }
                                value={
                                    newPassword
                                }
                                onChange={(
                                    event
                                ) => {
                                    setNewPassword(
                                        event
                                            .target
                                            .value
                                    );

                                    setError("");
                                }}
                                placeholder="Minimum 8 characters"
                                autoComplete="new-password"
                                className="w-full rounded-xl border border-white/10 bg-white/[0.06] py-3.5 pl-12 pr-12 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-[#D99AA3]/60"
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowNewPassword(
                                        (
                                            previous
                                        ) =>
                                            !previous
                                    )
                                }
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 transition hover:text-white"
                            >
                                {showNewPassword ? (
                                    <EyeOff
                                        size={
                                            18
                                        }
                                    />
                                ) : (
                                    <Eye
                                        size={
                                            18
                                        }
                                    />
                                )}
                            </button>

                        </div>

                        {/* CONFIRM */}

                        <label className="mb-2 mt-5 block text-sm font-medium text-white/80">
                            Confirm Password
                        </label>

                        <div className="relative">

                            <LockKeyhole
                                size={18}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/35"
                            />

                            <input
                                type={
                                    showConfirmPassword
                                        ? "text"
                                        : "password"
                                }
                                value={
                                    confirmPassword
                                }
                                onChange={(
                                    event
                                ) => {
                                    setConfirmPassword(
                                        event
                                            .target
                                            .value
                                    );

                                    setError("");
                                }}
                                placeholder="Re-enter new password"
                                autoComplete="new-password"
                                className="w-full rounded-xl border border-white/10 bg-white/[0.06] py-3.5 pl-12 pr-12 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-[#D99AA3]/60"
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowConfirmPassword(
                                        (
                                            previous
                                        ) =>
                                            !previous
                                    )
                                }
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 transition hover:text-white"
                            >
                                {showConfirmPassword ? (
                                    <EyeOff
                                        size={
                                            18
                                        }
                                    />
                                ) : (
                                    <Eye
                                        size={
                                            18
                                        }
                                    />
                                )}
                            </button>

                        </div>

                        {/* PASSWORD MATCH */}

                        {confirmPassword &&
                            newPassword ===
                                confirmPassword && (
                                <p className="mt-3 flex items-center gap-2 text-xs text-green-300">
                                    <CheckCircle2
                                        size={
                                            14
                                        }
                                    />

                                    Passwords match
                                </p>
                            )}

                        {/* ERROR */}

                        {error && (
                            <div className="mt-5 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                                {error}
                            </div>
                        )}

                        {/* RESET */}

                        <button
                            type="submit"
                            disabled={
                                loading
                            }
                            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#B76E79] px-5 py-3.5 font-semibold text-white transition hover:bg-[#8F4F5A] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? (
                                <>
                                    <Loader2
                                        size={
                                            18
                                        }
                                        className="animate-spin"
                                    />

                                    Resetting Password...
                                </>
                            ) : (
                                <>
                                    Reset Password

                                    <LockKeyhole
                                        size={
                                            18
                                        }
                                    />
                                </>
                            )}
                        </button>

                    </form>
                )}

                {/* =================================================
                    STEP 4 - SUCCESS
                ================================================== */}

                {step === 4 && (
                    <div className="py-6 text-center">

                        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-green-400/30 bg-green-500/10">

                            <CheckCircle2
                                size={42}
                                className="text-green-300"
                            />

                        </div>

                        <h1 className="mt-6 text-2xl font-bold sm:text-3xl">
                            Password Reset!
                        </h1>

                        <p className="mt-3 text-sm leading-6 text-white/55">
                            Your password has been changed
                            successfully.
                        </p>

                        <div className="mt-5 rounded-xl border border-green-400/20 bg-green-500/10 px-4 py-3 text-sm text-green-200">
                            You can now sign in using your new
                            password.
                        </div>

                        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-white/45">

                            <Loader2
                                size={15}
                                className="animate-spin"
                            />

                            Redirecting to Sign In...

                        </div>

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/signin",
                                    {
                                        replace:
                                            true,
                                    }
                                )
                            }
                            className="mt-6 w-full rounded-xl bg-[#B76E79] px-5 py-3.5 font-semibold text-white transition hover:bg-[#8F4F5A]"
                        >
                            Sign In Now
                        </button>

                    </div>
                )}

                {/* SIGN IN LINK */}

                {step === 1 && (
                    <p className="mt-6 text-center text-sm text-white/50">

                        Remember your password?{" "}

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/signin"
                                )
                            }
                            className="font-semibold text-[#E3AAB2] transition hover:text-[#FFE5E8]"
                        >
                            Sign In
                        </button>

                    </p>
                )}

            </div>

        </main>
    );
};

export default ForgotPassword;