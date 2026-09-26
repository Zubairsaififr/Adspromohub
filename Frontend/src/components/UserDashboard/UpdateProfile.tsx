import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Users,
  Wallet,
  Lock,
  Eye,
  EyeOff,
  Save,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  KeyRound,
  CalendarDays,
  BadgeCheck,
  Copy,
  Check,
  Ticket,
  X,
  XCircle,
} from "lucide-react";
import UserNavbar from "./UserNavbar";

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
// =========================================================
// API
// =========================================================

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:8000";

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
// =========================================================
// TYPES
// =========================================================

interface ProfileUser {
  id: number;

  customer_id: string;
  referral_code: string;
  sponsor_id: string | null;

  full_name: string;
  first_name: string | null;
  last_name: string | null;

  email: string;
  phone_number: string;
  country: string;

  gender: string | null;
  address: string | null;

  bep20_address: string | null;
  bep20_is_set: boolean;
  bep20_change_count: number;
  bep20_can_change: boolean;
  bep20_updated_at: string | null;

  is_active: boolean;
  joining_date: string;
}

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
interface ProfileResponse {
  success: boolean;
  message?: string;
  user: ProfileUser;
}

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
interface SuccessPopupState {
  show: boolean;
  title: string;
  message: string;
}

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
// =========================================================
// COMPONENT
// =========================================================

const UpdateProfile: React.FC = () => {
<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
  // =======================================================
  // PROFILE
  // =======================================================

  const [profile, setProfile] =
    useState<ProfileUser | null>(null);

  const [firstName, setFirstName] =
    useState("");

  const [lastName, setLastName] =
    useState("");

  const [gender, setGender] =
    useState("");

  const [address, setAddress] =
    useState("");

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
  // =======================================================
  // BEP20
  // =======================================================

  const [bep20Address, setBep20Address] =
    useState("");

  const [copiedWallet, setCopiedWallet] =
    useState(false);

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
  // =======================================================
  // PASSWORD
  // =======================================================

  const [
    currentPassword,
    setCurrentPassword,
  ] = useState("");

  const [
    newPassword,
    setNewPassword,
  ] = useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [
    showCurrentPassword,
    setShowCurrentPassword,
  ] = useState(false);

  const [
    showNewPassword,
    setShowNewPassword,
  ] = useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
  // =======================================================
  // LOADING
  // =======================================================

  const [pageLoading, setPageLoading] =
    useState(true);

  const [
    profileUpdating,
    setProfileUpdating,
  ] = useState(false);

  const [
    walletUpdating,
    setWalletUpdating,
  ] = useState(false);

  const [
    passwordUpdating,
    setPasswordUpdating,
  ] = useState(false);

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
  // =======================================================
  // ERROR
  // =======================================================

  const [error, setError] =
    useState("");

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
  // =======================================================
  // SUCCESS POPUP
  // =======================================================

  const [
    successPopup,
    setSuccessPopup,
  ] = useState<SuccessPopupState>({
    show: false,
    title: "",
    message: "",
  });

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
  // =======================================================
  // HELPERS
  // =======================================================

  const getToken = () =>
    localStorage.getItem(
      "access_token"
    );

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
  const clearMessages = () => {
    setError("");
  };

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
  const showSuccessPopup = (
    title: string,
    message: string
  ) => {
<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
    setSuccessPopup({
      show: true,
      title,
      message,
    });

<<<<<<< HEAD
    window.setTimeout(() => {
=======

    window.setTimeout(() => {

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
      setSuccessPopup({
        show: false,
        title: "",
        message: "",
      });
<<<<<<< HEAD
    }, 3000);
  };

  const closeSuccessPopup = () => {
=======

    }, 3000);
  };


  const closeSuccessPopup = () => {

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
    setSuccessPopup({
      show: false,
      title: "",
      message: "",
    });
  };

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
  const getErrorMessage = (
    err: unknown,
    fallback: string
  ) => {
<<<<<<< HEAD
    if (axios.isAxiosError(err)) {
      const detail =
        err.response?.data?.detail;

=======

    if (axios.isAxiosError(err)) {

      const detail =
        err.response?.data?.detail;


>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
      if (typeof detail === "string") {
        return detail;
      }

<<<<<<< HEAD
      if (Array.isArray(detail)) {
=======

      if (Array.isArray(detail)) {

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
        const firstError =
          detail[0];

        if (
          firstError &&
          typeof firstError.msg === "string"
        ) {
          return firstError.msg;
        }
      }
    }

    return fallback;
  };

<<<<<<< HEAD
  const formatDate = (
    date?: string | null
  ) => {
    if (!date) return "--";

    const parsed =
      new Date(date);

=======

  const formatDate = (
    date?: string | null
  ) => {

    if (!date) return "--";


    const parsed =
      new Date(date);


>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
    if (
      Number.isNaN(
        parsed.getTime()
      )
    ) {
      return "--";
    }

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
    return new Intl.DateTimeFormat(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    ).format(parsed);
  };

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
  // =======================================================
  // SET PROFILE INTO FORM
  // =======================================================

  const applyProfile = (
    user: ProfileUser
  ) => {
<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
    setProfile(user);

    setFirstName(
      user.first_name || ""
    );

    setLastName(
      user.last_name || ""
    );

    setGender(
      user.gender || ""
    );

    setAddress(
      user.address || ""
    );

    setBep20Address(
      user.bep20_address || ""
    );
  };

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
  // =======================================================
  // LOAD PROFILE
  // =======================================================

  useEffect(() => {
<<<<<<< HEAD
    const loadProfile =
      async () => {
        try {
          setPageLoading(true);
          clearMessages();

          const token =
            getToken();

          if (!token) {
            setError(
              "Login session not found. Please sign in again."
            );
            return;
          }

=======

    const loadProfile =
      async () => {

        try {

          setPageLoading(true);
          clearMessages();


          const token =
            getToken();


          if (!token) {

            setError(
              "Login session not found. Please sign in again."
            );

            return;
          }


>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
          const response =
            await axios.get<ProfileResponse>(
              `${API_URL}/api/profile`,
              {
                headers: {
                  Authorization:
                    `Bearer ${token}`,
                },
              }
            );

<<<<<<< HEAD
          applyProfile(
            response.data.user
          );
        } catch (err) {
=======

          applyProfile(
            response.data.user
          );

        } catch (err) {

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
          console.error(
            "Load profile error:",
            err
          );

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
          setError(
            getErrorMessage(
              err,
              "Unable to load your profile."
            )
          );
<<<<<<< HEAD
        } finally {
=======

        } finally {

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
          setPageLoading(false);
        }
      };

<<<<<<< HEAD
    loadProfile();
  }, []);

=======

    loadProfile();

  }, []);


>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
  // =======================================================
  // UPDATE PERSONAL PROFILE
  // =======================================================

  const handleProfileUpdate =
    async (
      e: React.FormEvent
    ) => {
<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
      e.preventDefault();

      clearMessages();

<<<<<<< HEAD
      if (
        firstName.trim().length < 2
      ) {
        setError(
          "Please enter a valid first name."
        );
        return;
      }

      if (!lastName.trim()) {
        setError(
          "Please enter your last name."
        );
        return;
      }

      try {
        setProfileUpdating(true);

        const token =
          getToken();

        if (!token) {
          setError(
            "Login session not found."
          );
          return;
        }

=======

      if (
        firstName.trim().length < 2
      ) {

        setError(
          "Please enter a valid first name."
        );

        return;
      }


      if (!lastName.trim()) {

        setError(
          "Please enter your last name."
        );

        return;
      }


      try {

        setProfileUpdating(true);


        const token =
          getToken();


        if (!token) {

          setError(
            "Login session not found."
          );

          return;
        }


>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
        const response =
          await axios.put<ProfileResponse>(
            `${API_URL}/api/profile`,
            {
              first_name:
                firstName.trim(),

              last_name:
                lastName.trim(),

              gender:
                gender || null,

              address:
                address.trim() || null,
            },
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
        applyProfile(
          response.data.user
        );

<<<<<<< HEAD
        // UPDATE LOCAL STORAGE USER NAME

        try {
=======

        // -----------------------------------------------
        // UPDATE LOCAL STORAGE USER NAME
        // -----------------------------------------------

        try {

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
          const savedUser =
            localStorage.getItem(
              "user"
            );

<<<<<<< HEAD
          if (savedUser) {
=======

          if (savedUser) {

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
            const parsedUser =
              JSON.parse(
                savedUser
              );

<<<<<<< HEAD
            parsedUser.full_name =
              response.data.user.full_name;

=======

            parsedUser.full_name =
              response.data.user.full_name;


>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
            localStorage.setItem(
              "user",
              JSON.stringify(
                parsedUser
              )
            );
          }
<<<<<<< HEAD
        } catch (storageError) {
=======

        } catch (storageError) {

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
          console.error(
            "Local user update error:",
            storageError
          );
        }

<<<<<<< HEAD
=======

        // -----------------------------------------------
        // SUCCESS POPUP
        // -----------------------------------------------

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
        showSuccessPopup(
          "Profile Updated Successfully",
          "Your personal information has been updated successfully."
        );
<<<<<<< HEAD
      } catch (err) {
=======

      } catch (err) {

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
        console.error(
          "Update profile error:",
          err
        );

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
        setError(
          getErrorMessage(
            err,
            "Unable to update profile."
          )
        );
<<<<<<< HEAD
      } finally {
=======

      } finally {

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
        setProfileUpdating(false);
      }
    };

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
  // =======================================================
  // UPDATE BEP20
  // =======================================================

  const handleWalletUpdate =
    async (
      e: React.FormEvent
    ) => {
<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
      e.preventDefault();

      clearMessages();

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
      if (!profile) {
        return;
      }

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
      if (
        profile.bep20_is_set &&
        !profile.bep20_can_change
      ) {
<<<<<<< HEAD
        setError(
          "Your BEP20 wallet address is locked. Please raise a support ticket for another change."
        );
        return;
      }

      const cleanWallet =
        bep20Address.trim();

      const bep20Regex =
        /^0x[a-fA-F0-9]{40}$/;

=======

        setError(
          "Your BEP20 wallet address is locked. Please raise a support ticket for another change."
        );

        return;
      }


      const cleanWallet =
        bep20Address.trim();


      const bep20Regex =
        /^0x[a-fA-F0-9]{40}$/;


>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
      if (
        !bep20Regex.test(
          cleanWallet
        )
      ) {
<<<<<<< HEAD
        setError(
          "Please enter a valid BEP20 wallet address."
        );
        return;
      }

      if (profile.bep20_is_set) {
=======

        setError(
          "Please enter a valid BEP20 wallet address."
        );

        return;
      }


      // -----------------------------------------------
      // CONFIRM BEFORE USING ONE-TIME CHANGE
      // -----------------------------------------------

      if (profile.bep20_is_set) {

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
        const confirmed =
          window.confirm(
            "Important: You can change your BEP20 wallet address only once yourself. After this change, the wallet will be locked and any future change will require a support ticket.\n\nDo you want to continue?"
          );

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
        if (!confirmed) {
          return;
        }
      }

<<<<<<< HEAD
      try {
        setWalletUpdating(true);

        const token =
          getToken();

        if (!token) {
          setError(
            "Login session not found."
          );
          return;
        }

        const wasWalletAlreadySet =
          profile.bep20_is_set;

=======

      try {

        setWalletUpdating(true);


        const token =
          getToken();


        if (!token) {

          setError(
            "Login session not found."
          );

          return;
        }


        // Remember whether this is first setup
        // or the one allowed replacement.

        const wasWalletAlreadySet =
          profile.bep20_is_set;


>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
        const response =
          await axios.put<ProfileResponse>(
            `${API_URL}/api/profile/bep20-address`,
            {
              bep20_address:
                cleanWallet,
            },
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
        applyProfile(
          response.data.user
        );

<<<<<<< HEAD
        if (wasWalletAlreadySet) {
=======

        // -----------------------------------------------
        // SUCCESS POPUP
        // -----------------------------------------------

        if (wasWalletAlreadySet) {

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
          showSuccessPopup(
            "BEP20 Address Updated",
            "Your BEP20 wallet address has been changed successfully. Your self-service wallet change has now been used and the wallet is locked."
          );
<<<<<<< HEAD
        } else {
=======

        } else {

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
          showSuccessPopup(
            "BEP20 Address Saved",
            "Your BEP20 wallet address has been saved successfully. You still have one self-service wallet change available."
          );
        }
<<<<<<< HEAD
      } catch (err) {
=======

      } catch (err) {

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
        console.error(
          "Wallet update error:",
          err
        );

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
        setError(
          getErrorMessage(
            err,
            "Unable to update BEP20 wallet."
          )
        );
<<<<<<< HEAD
      } finally {
=======

      } finally {

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
        setWalletUpdating(false);
      }
    };

<<<<<<< HEAD
  // =======================================================
  // STRONG PASSWORD
  // =======================================================

  const passwordRules = {
    minLength:
      newPassword.length >= 8,

    uppercase:
      /[A-Z]/.test(newPassword),

    lowercase:
      /[a-z]/.test(newPassword),

    number:
      /[0-9]/.test(newPassword),

    special:
      /[^A-Za-z0-9]/.test(newPassword),

    maxBytes:
      new TextEncoder().encode(
        newPassword
      ).length <= 72,
=======

  // =======================================================
  // STRONG PASSWORD - SAME RULES AS SIGNUP
  // =======================================================

  const passwordRules = {
    minLength: newPassword.length >= 8,
    uppercase: /[A-Z]/.test(newPassword),
    lowercase: /[a-z]/.test(newPassword),
    number: /[0-9]/.test(newPassword),
    special: /[^A-Za-z0-9]/.test(newPassword),
    maxBytes: new TextEncoder().encode(newPassword).length <= 72,
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
  };

  const isStrongPassword =
    passwordRules.minLength &&
    passwordRules.uppercase &&
    passwordRules.lowercase &&
    passwordRules.number &&
    passwordRules.special &&
    passwordRules.maxBytes;

  const passwordsMatch =
    confirmPassword.length > 0 &&
    newPassword === confirmPassword;

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
  // =======================================================
  // CHANGE PASSWORD
  // =======================================================

  const handlePasswordUpdate =
    async (
      e: React.FormEvent
    ) => {
<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
      e.preventDefault();

      clearMessages();

<<<<<<< HEAD
      if (!currentPassword) {
        setError(
          "Please enter your current password."
        );
        return;
      }

      if (!isStrongPassword) {
        setError(
          "New password must be at least 8 characters and include uppercase, lowercase, number and special character."
        );
        return;
      }

=======

      if (!currentPassword) {

        setError(
          "Please enter your current password."
        );

        return;
      }


      if (!isStrongPassword) {

        setError(
          "New password must be at least 8 characters and include uppercase, lowercase, number and special character."
        );

        return;
      }


>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
      if (
        newPassword !==
        confirmPassword
      ) {
<<<<<<< HEAD
        setError(
          "New password and confirm password do not match."
        );
        return;
      }

      try {
        setPasswordUpdating(true);

        const token =
          getToken();

        if (!token) {
          setError(
            "Login session not found."
          );
          return;
        }

=======

        setError(
          "New password and confirm password do not match."
        );

        return;
      }


      try {

        setPasswordUpdating(true);


        const token =
          getToken();


        if (!token) {

          setError(
            "Login session not found."
          );

          return;
        }


>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
        await axios.put(
          `${API_URL}/api/profile/change-password`,
          {
            current_password:
              currentPassword,

            new_password:
              newPassword,

            confirm_password:
              confirmPassword,
          },
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

<<<<<<< HEAD
=======

        // -----------------------------------------------
        // CLEAR PASSWORD FIELDS
        // -----------------------------------------------

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
        setShowCurrentPassword(false);
        setShowNewPassword(false);
        setShowConfirmPassword(false);

<<<<<<< HEAD
=======

        // -----------------------------------------------
        // SUCCESS POPUP
        // -----------------------------------------------

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
        showSuccessPopup(
          "Password Changed Successfully",
          "Your account password has been changed successfully."
        );
<<<<<<< HEAD
      } catch (err) {
=======

      } catch (err) {

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
        console.error(
          "Password update error:",
          err
        );

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
        setError(
          getErrorMessage(
            err,
            "Unable to change password."
          )
        );
<<<<<<< HEAD
      } finally {
=======

      } finally {

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
        setPasswordUpdating(false);
      }
    };

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
  // =======================================================
  // COPY WALLET
  // =======================================================

  const handleCopyWallet =
    async () => {
<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
      if (
        !profile?.bep20_address
      ) {
        return;
      }

<<<<<<< HEAD
      try {
=======

      try {

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
        await navigator.clipboard.writeText(
          profile.bep20_address
        );

<<<<<<< HEAD
        setCopiedWallet(true);

=======

        setCopiedWallet(true);


>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
        window.setTimeout(
          () => {
            setCopiedWallet(false);
          },
          2000
        );
<<<<<<< HEAD
      } catch (err) {
=======

      } catch (err) {

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
        console.error(
          "Copy wallet error:",
          err
        );
      }
    };

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
  // =======================================================
  // LOADING PAGE
  // =======================================================

  if (pageLoading) {
<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
    return (
      <div
        className="
          flex min-h-[400px]
          items-center justify-center
          bg-slate-50
        "
      >
<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
        <div
          className="
            flex flex-col
            items-center gap-3
          "
        >
<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
          <Loader2
            className="
              h-8 w-8
              animate-spin
<<<<<<< HEAD
              text-[#B76E79]
            "
          />

=======
              text-indigo-600
            "
          />


>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
          <p
            className="
              text-sm font-semibold
              text-slate-500
            "
          >
            Loading profile...
          </p>
<<<<<<< HEAD
        </div>
=======

        </div>

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
      </div>
    );
  }

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
  // =======================================================
  // PAGE
  // =======================================================

  return (
    <>
      <UserNavbar />
<<<<<<< HEAD

      <section
        className="
          relative min-h-screen
          overflow-hidden
          bg-slate-50
          py-8 sm:py-12
        "
      >
        {/* SUCCESS POPUP */}

        {successPopup.show && (
          <div
            className="
              fixed inset-0 z-[9999]
              flex items-center
              justify-center
              bg-slate-950/40
              px-4
              backdrop-blur-[3px]
            "
          >
            <div
              className="
                relative w-full
                max-w-md
                overflow-hidden
                rounded-3xl
                border border-white/70
                bg-white
                shadow-[0_30px_100px_rgba(15,23,42,0.30)]
              "
            >
              <div
                className="
                  h-1.5
                  bg-gradient-to-r
                  from-emerald-400
                  via-green-500
                  to-teal-500
                "
              />

=======
      <section
        className="
        relative min-h-screen
        overflow-hidden
        bg-slate-50
        py-8 sm:py-12
      "
      >

        {/* =================================================
          SUCCESS POPUP
      ================================================= */}

        {successPopup.show && (

          <div
            className="
            fixed inset-0 z-[9999]
            flex items-center
            justify-center
            bg-slate-950/40
            px-4
            backdrop-blur-[3px]
          "
          >

            <div
              className="
              relative w-full
              max-w-md
              overflow-hidden
              rounded-3xl
              border border-white/70
              bg-white
              shadow-[0_30px_100px_rgba(15,23,42,0.30)]
            "
            >

              {/* TOP BAR */}

              <div
                className="
                h-1.5
                bg-gradient-to-r
                from-emerald-400
                via-green-500
                to-teal-500
              "
              />


              {/* CLOSE */}

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
              <button
                type="button"
                onClick={
                  closeSuccessPopup
                }
                className="
<<<<<<< HEAD
                  absolute right-4
                  top-5
                  flex h-9 w-9
                  items-center
                  justify-center
                  rounded-full
                  bg-slate-100
                  text-slate-400
                  transition
                  hover:bg-slate-200
                  hover:text-slate-700
                "
=======
                absolute right-4
                top-5
                flex h-9 w-9
                items-center
                justify-center
                rounded-full
                bg-slate-100
                text-slate-400
                transition
                hover:bg-slate-200
                hover:text-slate-700
              "
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
              >
                <X size={18} />
              </button>

<<<<<<< HEAD
              <div
                className="
                  px-6 pb-7
                  pt-8
                  text-center
                  sm:px-8
                "
              >
                <div
                  className="
                    mx-auto flex
                    h-20 w-20
                    items-center
                    justify-center
                    rounded-full
                    bg-emerald-50
                  "
                >
                  <div
                    className="
                      flex h-14 w-14
                      items-center
                      justify-center
                      rounded-full
                      bg-emerald-500
                      text-white
                      shadow-lg
                      shadow-emerald-200
                    "
=======

              <div
                className="
                px-6 pb-7
                pt-8
                text-center
                sm:px-8
              "
              >

                {/* SUCCESS ICON */}

                <div
                  className="
                  mx-auto flex
                  h-20 w-20
                  items-center
                  justify-center
                  rounded-full
                  bg-emerald-50
                "
                >

                  <div
                    className="
                    flex h-14 w-14
                    items-center
                    justify-center
                    rounded-full
                    bg-emerald-500
                    text-white
                    shadow-lg
                    shadow-emerald-200
                  "
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                  >
                    <Check
                      size={30}
                      strokeWidth={3}
                    />
                  </div>
<<<<<<< HEAD
                </div>

                <h3
                  className="
                    mt-5 text-xl
                    font-extrabold
                    tracking-tight
                    text-slate-900
                    sm:text-2xl
                  "
=======

                </div>


                <h3
                  className="
                  mt-5 text-xl
                  font-extrabold
                  tracking-tight
                  text-slate-900
                  sm:text-2xl
                "
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                >
                  {successPopup.title}
                </h3>

<<<<<<< HEAD
                <p
                  className="
                    mx-auto mt-2
                    max-w-sm
                    text-sm
                    leading-6
                    text-slate-500
                  "
=======

                <p
                  className="
                  mx-auto mt-2
                  max-w-sm
                  text-sm
                  leading-6
                  text-slate-500
                "
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                >
                  {successPopup.message}
                </p>

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                <button
                  type="button"
                  onClick={
                    closeSuccessPopup
                  }
                  className="
<<<<<<< HEAD
                    mt-6 inline-flex
                    min-h-11 w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-gradient-to-r
                    from-emerald-500
                    to-teal-500
                    px-5
                    text-sm font-bold
                    text-white
                    shadow-lg
                    shadow-emerald-100
                    transition
                    hover:-translate-y-0.5
                    hover:shadow-xl
                  "
=======
                  mt-6 inline-flex
                  min-h-11 w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-gradient-to-r
                  from-emerald-500
                  to-teal-500
                  px-5
                  text-sm font-bold
                  text-white
                  shadow-lg
                  shadow-emerald-100
                  transition
                  hover:-translate-y-0.5
                  hover:shadow-xl
                "
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                >
                  <CheckCircle2
                    size={17}
                  />

                  Done
                </button>
<<<<<<< HEAD
              </div>
            </div>
          </div>
        )}

        {/* BACKGROUND */}

        <div
          className="
            pointer-events-none
            absolute -left-24 top-10
            h-72 w-72
            rounded-full
            bg-[#D99AA3]/30
            blur-3xl
          "
=======

              </div>

            </div>

          </div>
        )}


        {/* =================================================
          BACKGROUND
      ================================================= */}

        <div
          className="
          pointer-events-none
          absolute -left-24 top-10
          h-72 w-72
          rounded-full
          bg-purple-200/30
          blur-3xl
        "
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
        />

        <div
          className="
<<<<<<< HEAD
            pointer-events-none
            absolute -right-24 top-72
            h-80 w-80
            rounded-full
            bg-blue-200/30
            blur-3xl
          "
        />

        <div
          className="
            relative mx-auto
            max-w-7xl
            px-4 sm:px-6 lg:px-8
          "
        >
          {/* PAGE HEADER */}

          <div className="mb-8">
            <div
              className="
                mb-3 inline-flex
                items-center gap-2
                rounded-full
                border border-[#D99AA3]/50
                bg-white
                px-4 py-2
                text-xs font-bold
                text-[#B76E79]
                shadow-sm
              "
=======
          pointer-events-none
          absolute -right-24 top-72
          h-80 w-80
          rounded-full
          bg-blue-200/30
          blur-3xl
        "
        />


        <div
          className="
          relative mx-auto
          max-w-7xl
          px-4 sm:px-6 lg:px-8
        "
        >

          {/* =================================================
            PAGE HEADER
        ================================================= */}

          <div className="mb-8">

            <div
              className="
              mb-3 inline-flex
              items-center gap-2
              rounded-full
              border border-indigo-200
              bg-white
              px-4 py-2
              text-xs font-bold
              text-indigo-600
              shadow-sm
            "
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
            >
              <ShieldCheck size={15} />

              Account Settings
            </div>

<<<<<<< HEAD
            <h1
              className="
                text-3xl font-extrabold
                tracking-tight
                text-slate-900
                sm:text-4xl
              "
=======

            <h1
              className="
              text-3xl font-extrabold
              tracking-tight
              text-slate-900
              sm:text-4xl
            "
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
            >
              Update Profile
            </h1>

<<<<<<< HEAD
            <p
              className="
                mt-2 max-w-2xl
                text-sm leading-6
                text-slate-500
                sm:text-base
              "
=======

            <p
              className="
              mt-2 max-w-2xl
              text-sm leading-6
              text-slate-500
              sm:text-base
            "
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
            >
              Manage your personal information,
              wallet details and account security.
            </p>
<<<<<<< HEAD
          </div>

          {/* ERROR MESSAGE */}

          {error && (
            <div
              className="
                mb-6 flex items-start
                gap-3 rounded-2xl
                border border-red-200
                bg-red-50
                p-4
              "
            >
              <AlertTriangle
                className="
                  mt-0.5 shrink-0
                  text-red-500
                "
                size={20}
              />

              <div className="flex-1">
                <p
                  className="
                    text-sm font-bold
                    text-red-700
                  "
=======

          </div>


          {/* =================================================
            ERROR MESSAGE
        ================================================= */}

          {error && (

            <div
              className="
              mb-6 flex items-start
              gap-3 rounded-2xl
              border border-red-200
              bg-red-50
              p-4
            "
            >

              <AlertTriangle
                className="
                mt-0.5 shrink-0
                text-red-500
              "
                size={20}
              />


              <div className="flex-1">

                <p
                  className="
                  text-sm font-bold
                  text-red-700
                "
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                >
                  Attention
                </p>

<<<<<<< HEAD
                <p
                  className="
                    mt-0.5 text-sm
                    text-red-600
                  "
                >
                  {error}
                </p>
              </div>

=======

                <p
                  className="
                  mt-0.5 text-sm
                  text-red-600
                "
                >
                  {error}
                </p>

              </div>


>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
              <button
                type="button"
                onClick={() =>
                  setError("")
                }
                className="
<<<<<<< HEAD
                  text-red-400
                  transition
                  hover:text-red-700
                "
              >
                <X size={18} />
              </button>
            </div>
          )}

          {/* ACCOUNT SUMMARY */}

          {profile && (
            <div
              className="
                mb-6 overflow-hidden
                rounded-3xl
                border border-white
                bg-white
                shadow-[0_12px_40px_rgba(15,23,42,0.07)]
              "
            >
              <div
                className="
                  h-1
                  bg-gradient-to-r
                  from-[#B76E79]
                  via-[#D99AA3]
                  to-pink-500
                "
              />

              <div
                className="
                  flex flex-col gap-5
                  p-5
                  sm:flex-row
                  sm:items-center
                  sm:justify-between
                  sm:p-6
                "
              >
                <div
                  className="
                    flex min-w-0
                    items-center gap-4
                  "
                >
                  <div
                    className="
                      flex h-14 w-14
                      shrink-0 items-center
                      justify-center
                      rounded-2xl
                      bg-gradient-to-br
                      from-[#B76E79]
                      to-[#8F4F5A]
                      text-white
                      shadow-lg
                    "
=======
                text-red-400
                transition
                hover:text-red-700
              "
              >
                <X size={18} />
              </button>

            </div>
          )}


          {/* =================================================
            ACCOUNT SUMMARY
        ================================================= */}

          {profile && (

            <div
              className="
              mb-6 overflow-hidden
              rounded-3xl
              border border-white
              bg-white
              shadow-[0_12px_40px_rgba(15,23,42,0.07)]
            "
            >

              <div
                className="
                h-1
                bg-gradient-to-r
                from-indigo-500
                via-purple-500
                to-pink-500
              "
              />


              <div
                className="
                flex flex-col gap-5
                p-5
                sm:flex-row
                sm:items-center
                sm:justify-between
                sm:p-6
              "
              >

                <div
                  className="
                  flex min-w-0
                  items-center gap-4
                "
                >

                  <div
                    className="
                    flex h-14 w-14
                    shrink-0 items-center
                    justify-center
                    rounded-2xl
                    bg-gradient-to-br
                    from-indigo-500
                    to-purple-600
                    text-white
                    shadow-lg
                  "
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                  >
                    <User size={27} />
                  </div>

<<<<<<< HEAD
                  <div className="min-w-0">
                    <p
                      className="
                        truncate
                        text-lg font-extrabold
                        text-slate-900
                      "
=======

                  <div className="min-w-0">

                    <p
                      className="
                      truncate
                      text-lg font-extrabold
                      text-slate-900
                    "
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                    >
                      {profile.full_name}
                    </p>

<<<<<<< HEAD
                    <p
                      className="
                        mt-0.5 truncate
                        text-sm
                        text-slate-500
                      "
=======

                    <p
                      className="
                      mt-0.5 truncate
                      text-sm
                      text-slate-500
                    "
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                    >
                      {profile.email}
                    </p>

<<<<<<< HEAD
                    <p
                      className="
                        mt-1 text-xs
                        font-bold
                        text-[#B76E79]
                      "
                    >
                      {profile.customer_id}
                    </p>
                  </div>
                </div>

                <div
                  className={`
                    inline-flex w-fit
                    items-center gap-2
                    rounded-full
                    border px-4 py-2
                    text-xs font-extrabold
                    ${
                      profile.is_active
                        ? "border-emerald-200 bg-emerald-50 text-emerald-600"
                        : "border-red-200 bg-red-50 text-red-600"
                    }
                  `}
                >
=======

                    <p
                      className="
                      mt-1 text-xs
                      font-bold
                      text-indigo-600
                    "
                    >
                      {profile.customer_id}
                    </p>

                  </div>

                </div>


                <div
                  className={`
                  inline-flex w-fit
                  items-center gap-2
                  rounded-full
                  border px-4 py-2
                  text-xs font-extrabold
                  ${profile.is_active
                      ? "border-emerald-200 bg-emerald-50 text-emerald-600"
                      : "border-red-200 bg-red-50 text-red-600"
                    }
                `}
                >

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                  <BadgeCheck size={16} />

                  {profile.is_active
                    ? "ACTIVE"
                    : "INACTIVE"}
<<<<<<< HEAD
                </div>
              </div>

              <div
                className="
                  grid border-t
                  border-slate-100
                  sm:grid-cols-3
                "
              >
=======

                </div>

              </div>


              <div
                className="
                grid border-t
                border-slate-100
                sm:grid-cols-3
              "
              >

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                <SummaryItem
                  label="Sponsor ID"
                  value={
                    profile.sponsor_id ||
                    "--"
                  }
                />

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                <SummaryItem
                  label="Country"
                  value={
                    profile.country ||
                    "--"
                  }
                />

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                <SummaryItem
                  label="Joining Date"
                  value={formatDate(
                    profile.joining_date
                  )}
                />
<<<<<<< HEAD
              </div>
            </div>
          )}

          {/* CONTENT GRID */}

          <div
            className="
              grid gap-6
              lg:grid-cols-2
            "
          >
            {/* PERSONAL INFORMATION */}
=======

              </div>

            </div>
          )}


          {/* =================================================
            CONTENT GRID
        ================================================= */}

          <div
            className="
            grid gap-6
            lg:grid-cols-2
          "
          >

            {/* =================================================
              PERSONAL INFORMATION
          ================================================= */}
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

            <form
              onSubmit={
                handleProfileUpdate
              }
              className="
<<<<<<< HEAD
                rounded-3xl
                border border-slate-200/70
                bg-white p-5
                shadow-[0_12px_40px_rgba(15,23,42,0.06)]
                sm:p-6
              "
            >
=======
              rounded-3xl
              border border-slate-200/70
              bg-white p-5
              shadow-[0_12px_40px_rgba(15,23,42,0.06)]
              sm:p-6
            "
            >

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
              <SectionTitle
                icon={<User size={21} />}
                title="Personal Information"
                subtitle="Update your basic account information."
              />

<<<<<<< HEAD
              <div
                className="
                  mt-6 grid gap-4
                  sm:grid-cols-2
                "
              >
=======

              <div
                className="
                mt-6 grid gap-4
                sm:grid-cols-2
              "
              >

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                <Field
                  label="First Name"
                  required
                >
<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) =>
                      setFirstName(
                        e.target.value
                      )
                    }
                    placeholder="First name"
                    className={inputClass}
                  />
<<<<<<< HEAD
                </Field>

=======

                </Field>


>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                <Field
                  label="Last Name"
                  required
                >
<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) =>
                      setLastName(
                        e.target.value
                      )
                    }
                    placeholder="Last name"
                    className={inputClass}
                  />
<<<<<<< HEAD
                </Field>

                <Field label="Gender">
                  <div className="relative">
                    <Users
                      size={17}
                      className="
                        pointer-events-none
                        absolute left-3
                        top-1/2
                        -translate-y-1/2
                        text-slate-400
                      "
                    />

=======

                </Field>


                <Field label="Gender">

                  <div className="relative">

                    <Users
                      size={17}
                      className="
                      pointer-events-none
                      absolute left-3
                      top-1/2
                      -translate-y-1/2
                      text-slate-400
                    "
                    />


>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                    <select
                      value={gender}
                      onChange={(e) =>
                        setGender(
                          e.target.value
                        )
                      }
                      className={`${inputClass} pl-10`}
                    >
<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                      <option value="">
                        Select gender
                      </option>

                      <option value="male">
                        Male
                      </option>

                      <option value="female">
                        Female
                      </option>

                      <option value="other">
                        Other
                      </option>

<<<<<<< HEAD
                      <option value="prefer_not_to_say">
                        Prefer not to say
                      </option>
                    </select>
                  </div>
                </Field>

                <Field label="Email">
                  <div className="relative">
                    <Mail
                      size={17}
                      className="
                        absolute left-3
                        top-1/2
                        -translate-y-1/2
                        text-slate-400
                      "
                    />

=======
                      <option
                        value="prefer_not_to_say"
                      >
                        Prefer not to say
                      </option>

                    </select>

                  </div>

                </Field>


                <Field label="Email">

                  <div className="relative">

                    <Mail
                      size={17}
                      className="
                      absolute left-3
                      top-1/2
                      -translate-y-1/2
                      text-slate-400
                    "
                    />


>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                    <input
                      type="text"
                      value={
                        profile?.email || ""
                      }
                      readOnly
                      className={`${readOnlyClass} pl-10`}
                    />
<<<<<<< HEAD
                  </div>
                </Field>

                <Field label="Phone Number">
                  <div className="relative">
                    <Phone
                      size={17}
                      className="
                        absolute left-3
                        top-1/2
                        -translate-y-1/2
                        text-slate-400
                      "
                    />

=======

                  </div>

                </Field>


                <Field label="Phone Number">

                  <div className="relative">

                    <Phone
                      size={17}
                      className="
                      absolute left-3
                      top-1/2
                      -translate-y-1/2
                      text-slate-400
                    "
                    />


>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                    <input
                      type="text"
                      value={
                        profile?.phone_number ||
                        ""
                      }
                      readOnly
                      className={`${readOnlyClass} pl-10`}
                    />
<<<<<<< HEAD
                  </div>
                </Field>

                <Field label="Customer ID">
=======

                  </div>

                </Field>


                <Field label="Customer ID">

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                  <input
                    type="text"
                    value={
                      profile?.customer_id ||
                      ""
                    }
                    readOnly
                    className={
                      readOnlyClass
                    }
                  />
<<<<<<< HEAD
                </Field>
              </div>

              <div className="mt-4">
                <Field label="Address">
                  <div className="relative">
                    <MapPin
                      size={18}
                      className="
                        absolute left-3
                        top-3.5
                        text-slate-400
                      "
                    />

=======

                </Field>

              </div>


              <div className="mt-4">

                <Field label="Address">

                  <div className="relative">

                    <MapPin
                      size={18}
                      className="
                      absolute left-3
                      top-3.5
                      text-slate-400
                    "
                    />


>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                    <textarea
                      value={address}
                      onChange={(e) =>
                        setAddress(
                          e.target.value
                        )
                      }
                      rows={4}
                      placeholder="Enter your complete address"
                      className={`
<<<<<<< HEAD
                        ${inputClass}
                        resize-none
                        pl-10
                      `}
                    />
                  </div>
                </Field>
              </div>

=======
                      ${inputClass}
                      resize-none
                      pl-10
                    `}
                    />

                  </div>

                </Field>

              </div>


>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
              <button
                type="submit"
                disabled={
                  profileUpdating
                }
                className="
<<<<<<< HEAD
                  mt-6 inline-flex
                  min-h-11 w-full
                  items-center
                  justify-center gap-2
                  rounded-xl
                  bg-gradient-to-r
                  from-[#B76E79]
                  to-[#8F4F5A]
                  px-5 py-3
                  text-sm font-bold
                  text-white
                  shadow-lg
                  shadow-[#D99AA3]/30
                  transition
                  hover:-translate-y-0.5
                  hover:shadow-xl
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                  sm:w-auto
                "
              >
=======
                mt-6 inline-flex
                min-h-11 w-full
                items-center
                justify-center gap-2
                rounded-xl
                bg-gradient-to-r
                from-indigo-600
                to-purple-600
                px-5 py-3
                text-sm font-bold
                text-white
                shadow-lg
                shadow-indigo-200
                transition
                hover:-translate-y-0.5
                hover:shadow-xl
                disabled:cursor-not-allowed
                disabled:opacity-60
                sm:w-auto
              "
              >

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                {profileUpdating ? (
                  <Loader2
                    size={17}
                    className="animate-spin"
                  />
                ) : (
                  <Save size={17} />
                )}

<<<<<<< HEAD
                {profileUpdating
                  ? "Saving..."
                  : "Save Profile"}
              </button>
            </form>

            {/* BEP20 WALLET */}
=======

                {profileUpdating
                  ? "Saving..."
                  : "Save Profile"}

              </button>

            </form>


            {/* =================================================
              BEP20 WALLET
          ================================================= */}
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

            <form
              onSubmit={
                handleWalletUpdate
              }
              className="
<<<<<<< HEAD
                rounded-3xl
                border border-slate-200/70
                bg-white p-5
                shadow-[0_12px_40px_rgba(15,23,42,0.06)]
                sm:p-6
              "
            >
=======
              rounded-3xl
              border border-slate-200/70
              bg-white p-5
              shadow-[0_12px_40px_rgba(15,23,42,0.06)]
              sm:p-6
            "
            >

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
              <SectionTitle
                icon={
                  <Wallet size={21} />
                }
                title="BEP20 Wallet"
                subtitle="Manage your withdrawal wallet address."
              />

<<<<<<< HEAD
              <div
                className="
                  mt-6 flex items-start
                  gap-3 rounded-2xl
                  border border-amber-200
                  bg-amber-50
                  p-4
                "
              >
                <AlertTriangle
                  size={19}
                  className="
                    mt-0.5 shrink-0
                    text-amber-600
                  "
                />

                <div>
                  <p
                    className="
                      text-sm font-bold
                      text-amber-800
                    "
=======

              <div
                className="
                mt-6 flex items-start
                gap-3 rounded-2xl
                border border-amber-200
                bg-amber-50
                p-4
              "
              >

                <AlertTriangle
                  size={19}
                  className="
                  mt-0.5 shrink-0
                  text-amber-600
                "
                />


                <div>

                  <p
                    className="
                    text-sm font-bold
                    text-amber-800
                  "
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                  >
                    Important Security Notice
                  </p>

<<<<<<< HEAD
                  <p
                    className="
                      mt-1 text-xs
                      leading-5
                      text-amber-700
                    "
=======

                  <p
                    className="
                    mt-1 text-xs
                    leading-5
                    text-amber-700
                  "
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                  >
                    Your initial BEP20 wallet setup
                    does not count as a change.
                    After setup, you can replace
                    your wallet address only one
                    time yourself. Any further
                    change requires approval
                    through a support ticket.
                  </p>
<<<<<<< HEAD
                </div>
              </div>

=======

                </div>

              </div>


>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
              {/* WALLET STATUS */}

              <div
                className="
<<<<<<< HEAD
                  mt-5 flex flex-wrap
                  items-center gap-2
                "
              >
                {!profile?.bep20_is_set ? (
=======
                mt-5 flex flex-wrap
                items-center gap-2
              "
              >

                {!profile?.bep20_is_set ? (

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                  <StatusBadge
                    type="warning"
                    text="Wallet Not Set"
                  />
<<<<<<< HEAD
                ) : profile.bep20_can_change ? (
=======

                ) : profile.bep20_can_change ? (

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                  <StatusBadge
                    type="success"
                    text="1 Change Available"
                  />
<<<<<<< HEAD
                ) : (
=======

                ) : (

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                  <StatusBadge
                    type="locked"
                    text="Wallet Locked"
                  />
<<<<<<< HEAD
                )}

                {profile?.bep20_updated_at && (
                  <span
                    className="
                      inline-flex
                      items-center gap-1.5
                      text-xs
                      text-slate-400
                    "
                  >
=======

                )}


                {profile?.bep20_updated_at && (

                  <span
                    className="
                    inline-flex
                    items-center gap-1.5
                    text-xs
                    text-slate-400
                  "
                  >

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                    <CalendarDays
                      size={13}
                    />

                    Updated{" "}
                    {formatDate(
                      profile.bep20_updated_at
                    )}
<<<<<<< HEAD
                  </span>
                )}
              </div>

              {/* WALLET INPUT */}

              <div className="mt-5">
=======

                  </span>

                )}

              </div>


              {/* WALLET INPUT */}

              <div className="mt-5">

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                <Field
                  label="BEP20 Wallet Address"
                  required
                >
<<<<<<< HEAD
                  <div className="relative">
                    <Wallet
                      size={17}
                      className="
                        absolute left-3
                        top-1/2
                        -translate-y-1/2
                        text-slate-400
                      "
                    />

=======

                  <div className="relative">

                    <Wallet
                      size={17}
                      className="
                      absolute left-3
                      top-1/2
                      -translate-y-1/2
                      text-slate-400
                    "
                    />


>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                    <input
                      type="text"
                      value={bep20Address}
                      onChange={(e) =>
                        setBep20Address(
                          e.target.value.trim()
                        )
                      }
<<<<<<< HEAD
                      readOnly={Boolean(
                        profile?.bep20_is_set &&
                        !profile?.bep20_can_change
                      )}
=======
                      readOnly={
                        Boolean(
                          profile?.bep20_is_set &&
                          !profile?.bep20_can_change
                        )
                      }
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                      placeholder="0x..."
                      spellCheck={false}
                      autoComplete="off"
                      className={`
<<<<<<< HEAD
                        ${
                          profile?.bep20_is_set &&
                          !profile?.bep20_can_change
                            ? readOnlyClass
                            : inputClass
                        }
                        pl-10 pr-12
                        font-mono
                        text-xs
                      `}
                    />

                    {profile?.bep20_address && (
=======
                      ${profile?.bep20_is_set &&
                          !profile?.bep20_can_change
                          ? readOnlyClass
                          : inputClass
                        }
                      pl-10 pr-12
                      font-mono
                      text-xs
                    `}
                    />


                    {profile?.bep20_address && (

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                      <button
                        type="button"
                        onClick={
                          handleCopyWallet
                        }
                        className="
<<<<<<< HEAD
                          absolute right-2
                          top-1/2
                          flex h-8 w-8
                          -translate-y-1/2
                          items-center
                          justify-center
                          rounded-lg
                          text-slate-400
                          transition
                          hover:bg-slate-100
                          hover:text-[#B76E79]
                        "
                        title="Copy wallet"
                      >
                        {copiedWallet ? (
                          <Check
                            size={16}
                            className="
                              text-emerald-500
                            "
                          />
                        ) : (
                          <Copy size={16} />
                        )}
                      </button>
                    )}
                  </div>
                </Field>
              </div>

=======
                        absolute right-2
                        top-1/2
                        flex h-8 w-8
                        -translate-y-1/2
                        items-center
                        justify-center
                        rounded-lg
                        text-slate-400
                        transition
                        hover:bg-slate-100
                        hover:text-indigo-600
                      "
                        title="Copy wallet"
                      >

                        {copiedWallet ? (

                          <Check
                            size={16}
                            className="
                            text-emerald-500
                          "
                          />

                        ) : (

                          <Copy size={16} />

                        )}

                      </button>

                    )}

                  </div>

                </Field>

              </div>


>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
              {/* LOCKED */}

              {profile?.bep20_is_set &&
                !profile.bep20_can_change && (
<<<<<<< HEAD
                  <div
                    className="
                      mt-4 rounded-2xl
                      border border-slate-200
                      bg-slate-50 p-4
                    "
                  >
                    <div
                      className="
                        flex items-start gap-3
                      "
                    >
                      <Lock
                        size={19}
                        className="
                          mt-0.5 shrink-0
                          text-slate-500
                        "
                      />

                      <div>
                        <p
                          className="
                            text-sm font-bold
                            text-slate-700
                          "
=======

                  <div
                    className="
                    mt-4 rounded-2xl
                    border border-slate-200
                    bg-slate-50 p-4
                  "
                  >

                    <div
                      className="
                      flex items-start gap-3
                    "
                    >

                      <Lock
                        size={19}
                        className="
                        mt-0.5 shrink-0
                        text-slate-500
                      "
                      />


                      <div>

                        <p
                          className="
                          text-sm font-bold
                          text-slate-700
                        "
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                        >
                          Wallet address locked
                        </p>

<<<<<<< HEAD
                        <p
                          className="
                            mt-1 text-xs
                            leading-5
                            text-slate-500
                          "
=======

                        <p
                          className="
                          mt-1 text-xs
                          leading-5
                          text-slate-500
                        "
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                        >
                          Your self-service wallet
                          change has already been
                          used. To change this
                          address again, please
                          raise a support ticket.
                        </p>
<<<<<<< HEAD
                      </div>
                    </div>

=======

                      </div>

                    </div>


>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                    <button
                      type="button"
                      disabled
                      title="Support ticket module will be connected next"
                      className="
<<<<<<< HEAD
                        mt-4 inline-flex
                        min-h-10 items-center
                        gap-2 rounded-xl
                        border border-slate-200
                        bg-white px-4
                        text-xs font-bold
                        text-slate-400
                        opacity-70
                      "
=======
                      mt-4 inline-flex
                      min-h-10 items-center
                      gap-2 rounded-xl
                      border border-slate-200
                      bg-white px-4
                      text-xs font-bold
                      text-slate-400
                      opacity-70
                    "
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                    >
                      <Ticket size={15} />
                      Raise Support Ticket
                    </button>
<<<<<<< HEAD
                  </div>
                )}

=======

                  </div>

                )}


>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
              {/* SAVE WALLET */}

              {!(
                profile?.bep20_is_set &&
                !profile?.bep20_can_change
              ) && (
<<<<<<< HEAD
                <button
                  type="submit"
                  disabled={
                    walletUpdating
                  }
                  className="
                    mt-6 inline-flex
                    min-h-11 w-full
                    items-center
                    justify-center gap-2
                    rounded-xl
                    bg-slate-900
                    px-5 py-3
                    text-sm font-bold
                    text-white
                    transition
                    hover:-translate-y-0.5
                    hover:bg-[#B76E79]
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                    sm:w-auto
                  "
                >
                  {walletUpdating ? (
                    <Loader2
                      size={17}
                      className="animate-spin"
                    />
                  ) : (
                    <Wallet size={17} />
                  )}

                  {walletUpdating
                    ? "Saving..."
                    : !profile?.bep20_is_set
                      ? "Save Wallet"
                      : "Change Wallet"}
                </button>
              )}
            </form>

            {/* PASSWORD */}
=======

                  <button
                    type="submit"
                    disabled={
                      walletUpdating
                    }
                    className="
                  mt-6 inline-flex
                  min-h-11 w-full
                  items-center
                  justify-center gap-2
                  rounded-xl
                  bg-slate-900
                  px-5 py-3
                  text-sm font-bold
                  text-white
                  transition
                  hover:-translate-y-0.5
                  hover:bg-indigo-600
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                  sm:w-auto
                "
                  >

                    {walletUpdating ? (

                      <Loader2
                        size={17}
                        className="animate-spin"
                      />

                    ) : (

                      <Wallet size={17} />

                    )}


                    {walletUpdating
                      ? "Saving..."
                      : !profile?.bep20_is_set
                        ? "Save Wallet"
                        : "Change Wallet"}

                  </button>

                )}

            </form>


            {/* =================================================
              PASSWORD
          ================================================= */}
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

            <form
              onSubmit={
                handlePasswordUpdate
              }
              className="
<<<<<<< HEAD
                rounded-3xl
                border border-slate-200/70
                bg-white p-5
                shadow-[0_12px_40px_rgba(15,23,42,0.06)]
                sm:p-6 lg:col-span-2
              "
            >
=======
              rounded-3xl
              border border-slate-200/70
              bg-white p-5
              shadow-[0_12px_40px_rgba(15,23,42,0.06)]
              sm:p-6 lg:col-span-2
            "
            >

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
              <SectionTitle
                icon={
                  <KeyRound size={21} />
                }
                title="Account Security"
                subtitle="Change your account password securely."
              />

<<<<<<< HEAD
              <div
                className="
                  mt-6 grid gap-4
                  md:grid-cols-3
                "
              >
=======

              <div
                className="
                mt-6 grid gap-4
                md:grid-cols-3
              "
              >

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                <PasswordField
                  label="Current Password"
                  value={currentPassword}
                  onChange={
                    setCurrentPassword
                  }
                  show={
                    showCurrentPassword
                  }
                  setShow={
                    setShowCurrentPassword
                  }
                  placeholder="Current password"
                  autoComplete="current-password"
                />

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                <PasswordField
                  label="New Password"
                  value={newPassword}
                  onChange={
                    setNewPassword
                  }
                  show={
                    showNewPassword
                  }
                  setShow={
                    setShowNewPassword
                  }
                  placeholder="New password"
                  autoComplete="new-password"
                />

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                <PasswordField
                  label="Confirm Password"
                  value={confirmPassword}
                  onChange={
                    setConfirmPassword
                  }
                  show={
                    showConfirmPassword
                  }
                  setShow={
                    setShowConfirmPassword
                  }
                  placeholder="Confirm password"
                  autoComplete="new-password"
                />
<<<<<<< HEAD
              </div>

              <div className="mt-4">
                <div
                  className={`h-1.5 w-full rounded-full ${
                    newPassword
=======

              </div>


              <div className="mt-4">

                <div
                  className={`h-1.5 w-full rounded-full ${newPassword
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                      ? isStrongPassword
                        ? "bg-emerald-500"
                        : "bg-red-500"
                      : "bg-slate-200"
<<<<<<< HEAD
                  }`}
                />

                <div
                  className="
                    mt-3 grid gap-2
                    text-xs
                    sm:grid-cols-2
                    lg:grid-cols-3
                  "
                >
                  <PasswordRule
                    valid={
                      passwordRules.minLength
                    }
                    text="At least 8 characters"
                  />

                  <PasswordRule
                    valid={
                      passwordRules.uppercase
                    }
                    text="One uppercase letter (A-Z)"
                  />

                  <PasswordRule
                    valid={
                      passwordRules.lowercase
                    }
                    text="One lowercase letter (a-z)"
                  />

                  <PasswordRule
                    valid={
                      passwordRules.number
                    }
                    text="One number (0-9)"
                  />

                  <PasswordRule
                    valid={
                      passwordRules.special
                    }
                    text="One special character"
                  />

                  <PasswordRule
                    valid={
                      passwordRules.maxBytes
                    }
                    text="Maximum 72 bytes"
                  />

                  {confirmPassword && (
                    <PasswordRule
                      valid={
                        passwordsMatch
                      }
                      text={
                        passwordsMatch
                          ? "Passwords match"
                          : "Passwords do not match"
                      }
                    />
                  )}
                </div>
=======
                    }`}
                />

                <div className="mt-3 grid gap-2 text-xs sm:grid-cols-2 lg:grid-cols-3">

                  <PasswordRule valid={passwordRules.minLength} text="At least 8 characters" />
                  <PasswordRule valid={passwordRules.uppercase} text="One uppercase letter (A-Z)" />
                  <PasswordRule valid={passwordRules.lowercase} text="One lowercase letter (a-z)" />
                  <PasswordRule valid={passwordRules.number} text="One number (0-9)" />
                  <PasswordRule valid={passwordRules.special} text="One special character" />
                  <PasswordRule valid={passwordRules.maxBytes} text="Maximum 72 bytes" />

                  {confirmPassword && (
                    <PasswordRule
                      valid={passwordsMatch}
                      text={passwordsMatch ? "Passwords match" : "Passwords do not match"}
                    />
                  )}

                </div>

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
              </div>

              <button
                type="submit"
                disabled={
                  passwordUpdating
                }
                className="
<<<<<<< HEAD
                  mt-6 inline-flex
                  min-h-11 w-full
                  items-center
                  justify-center gap-2
                  rounded-xl
                  bg-gradient-to-r
                  from-[#B76E79]
                  to-[#8F4F5A]
                  px-5 py-3
                  text-sm font-bold
                  text-white
                  shadow-lg
                  shadow-[#D99AA3]/30
                  transition
                  hover:-translate-y-0.5
                  hover:shadow-xl
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                  sm:w-auto
                "
              >
                {passwordUpdating ? (
=======
                mt-6 inline-flex
                min-h-11 w-full
                items-center
                justify-center gap-2
                rounded-xl
                bg-gradient-to-r
                from-indigo-600
                to-purple-600
                px-5 py-3
                text-sm font-bold
                text-white
                shadow-lg
                shadow-indigo-200
                transition
                hover:-translate-y-0.5
                disabled:cursor-not-allowed
                disabled:opacity-60
                sm:w-auto
              "
              >

                {passwordUpdating ? (

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                  <Loader2
                    size={17}
                    className="animate-spin"
                  />
<<<<<<< HEAD
                ) : (
                  <Lock size={17} />
                )}

                {passwordUpdating
                  ? "Changing..."
                  : "Change Password"}
              </button>
            </form>
          </div>
        </div>
      </section>
=======

                ) : (

                  <Lock size={17} />

                )}


                {passwordUpdating
                  ? "Changing..."
                  : "Change Password"}

              </button>

            </form>

          </div>

        </div>

      </section>

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
    </>
  );
};

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
// =========================================================
// SHARED CLASSES
// =========================================================

const inputClass = `
  min-h-11 w-full
  rounded-xl
  border border-slate-200
  bg-white
  px-3 py-2.5
  text-sm
  text-slate-800
  outline-none
  transition
  placeholder:text-slate-400
<<<<<<< HEAD
  focus:border-[#B76E79]
  focus:ring-4
  focus:ring-[#D99AA3]/30
`;

=======
  focus:border-indigo-400
  focus:ring-4
  focus:ring-indigo-100
`;


>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
const readOnlyClass = `
  min-h-11 w-full
  cursor-not-allowed
  rounded-xl
  border border-slate-200
  bg-slate-100
  px-3 py-2.5
  text-sm
  text-slate-500
  outline-none
`;

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
// =========================================================
// FIELD
// =========================================================

interface FieldProps {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}

<<<<<<< HEAD
const Field: React.FC<FieldProps> = ({
  label,
  required = false,
  children,
}) => (
  <label className="block">
    <span
      className="
        mb-2 block
        text-xs font-bold
        text-slate-600
      "
    >
      {label}

      {required && (
        <span
          className="
            ml-1 text-red-500
          "
        >
          *
        </span>
      )}
    </span>

    {children}
  </label>
);
=======

const Field:
  React.FC<FieldProps> = ({
    label,
    required = false,
    children,
  }) => (

    <label className="block">

      <span
        className="
          mb-2 block
          text-xs font-bold
          text-slate-600
        "
      >

        {label}

        {required && (

          <span
            className="
              ml-1 text-red-500
            "
          >
            *
          </span>

        )}

      </span>

      {children}

    </label>
  );

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

// =========================================================
// SECTION TITLE
// =========================================================

interface SectionTitleProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}

<<<<<<< HEAD
const SectionTitle: React.FC<
  SectionTitleProps
> = ({
  icon,
  title,
  subtitle,
}) => (
  <div
    className="
      flex items-start
      gap-3
    "
  >
    <div
      className="
        flex h-10 w-10
        shrink-0 items-center
        justify-center
        rounded-xl
        bg-[#FFE5E8]
        text-[#B76E79]
      "
    >
      {icon}
    </div>

    <div>
      <h2
        className="
          text-lg font-extrabold
          text-slate-900
        "
      >
        {title}
      </h2>

      <p
        className="
          mt-0.5 text-xs
          leading-5
          text-slate-500
        "
      >
        {subtitle}
      </p>
    </div>
  </div>
);
=======

const SectionTitle:
  React.FC<SectionTitleProps> = ({
    icon,
    title,
    subtitle,
  }) => (

    <div
      className="
        flex items-start
        gap-3
      "
    >

      <div
        className="
          flex h-10 w-10
          shrink-0 items-center
          justify-center
          rounded-xl
          bg-indigo-50
          text-indigo-600
        "
      >
        {icon}
      </div>


      <div>

        <h2
          className="
            text-lg font-extrabold
            text-slate-900
          "
        >
          {title}
        </h2>


        <p
          className="
            mt-0.5 text-xs
            leading-5
            text-slate-500
          "
        >
          {subtitle}
        </p>

      </div>

    </div>
  );

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

// =========================================================
// SUMMARY ITEM
// =========================================================

interface SummaryItemProps {
  label: string;
  value: string;
}

<<<<<<< HEAD
const SummaryItem: React.FC<
  SummaryItemProps
> = ({
  label,
  value,
}) => (
  <div
    className="
      border-b border-slate-100
      px-5 py-4
      last:border-b-0
      sm:border-b-0
      sm:border-r
      sm:last:border-r-0
    "
  >
    <p
      className="
        text-[10px]
        font-extrabold
        uppercase
        tracking-wider
        text-slate-400
      "
    >
      {label}
    </p>

    <p
      className="
        mt-1 break-words
        text-sm font-bold
        text-slate-700
      "
    >
      {value}
    </p>
  </div>
);
=======

const SummaryItem:
  React.FC<SummaryItemProps> = ({
    label,
    value,
  }) => (

    <div
      className="
        border-b border-slate-100
        px-5 py-4
        last:border-b-0
        sm:border-b-0
        sm:border-r
        sm:last:border-r-0
      "
    >

      <p
        className="
          text-[10px]
          font-extrabold
          uppercase
          tracking-wider
          text-slate-400
        "
      >
        {label}
      </p>


      <p
        className="
          mt-1 break-words
          text-sm font-bold
          text-slate-700
        "
      >
        {value}
      </p>

    </div>
  );

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

// =========================================================
// STATUS BADGE
// =========================================================

interface StatusBadgeProps {
  type:
<<<<<<< HEAD
    | "success"
    | "warning"
    | "locked";
=======
  | "success"
  | "warning"
  | "locked";
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

  text: string;
}

<<<<<<< HEAD
const StatusBadge: React.FC<
  StatusBadgeProps
> = ({
  type,
  text,
}) => {
  const styles = {
    success:
      "border-emerald-200 bg-emerald-50 text-emerald-600",

    warning:
      "border-amber-200 bg-amber-50 text-amber-600",

    locked:
      "border-slate-200 bg-slate-100 text-slate-600",
  };

  return (
    <span
      className={`
        inline-flex items-center
        gap-1.5 rounded-full
        border px-3 py-1.5
        text-[11px]
        font-extrabold
        ${styles[type]}
      `}
    >
      {type === "locked" ? (
        <Lock size={13} />
      ) : (
        <CheckCircle2
          size={13}
        />
      )}

      {text}
    </span>
  );
};
=======

const StatusBadge:
  React.FC<StatusBadgeProps> = ({
    type,
    text,
  }) => {

    const styles = {

      success:
        "border-emerald-200 bg-emerald-50 text-emerald-600",

      warning:
        "border-amber-200 bg-amber-50 text-amber-600",

      locked:
        "border-slate-200 bg-slate-100 text-slate-600",

    };


    return (

      <span
        className={`
          inline-flex items-center
          gap-1.5 rounded-full
          border px-3 py-1.5
          text-[11px]
          font-extrabold
          ${styles[type]}
        `}
      >

        {type === "locked" ? (

          <Lock size={13} />

        ) : (

          <CheckCircle2
            size={13}
          />

        )}


        {text}

      </span>
    );
  };

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

// =========================================================
// PASSWORD RULE
// =========================================================

interface PasswordRuleProps {
  valid: boolean;
  text: string;
}

<<<<<<< HEAD
const PasswordRule: React.FC<
  PasswordRuleProps
> = ({
=======
const PasswordRule: React.FC<PasswordRuleProps> = ({
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
  valid,
  text,
}) => (
  <div
<<<<<<< HEAD
    className={`flex items-center gap-2 font-semibold ${
      valid
        ? "text-emerald-600"
        : "text-red-500"
    }`}
=======
    className={`flex items-center gap-2 font-semibold ${valid ? "text-emerald-600" : "text-red-500"
      }`}
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
  >
    {valid ? (
      <CheckCircle2 size={14} />
    ) : (
      <XCircle size={14} />
    )}

    <span>{text}</span>
  </div>
);

<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
// =========================================================
// PASSWORD FIELD
// =========================================================

interface PasswordFieldProps {
  label: string;

  value: string;

  onChange:
<<<<<<< HEAD
    (value: string) => void;
=======
  (value: string) => void;
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

  show: boolean;

  setShow:
<<<<<<< HEAD
    React.Dispatch<
      React.SetStateAction<boolean>
    >;
=======
  React.Dispatch<
    React.SetStateAction<boolean>
  >;
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

  placeholder: string;

  autoComplete:
<<<<<<< HEAD
    | "current-password"
    | "new-password";
}

const PasswordField: React.FC<
  PasswordFieldProps
> = ({
  label,
  value,
  onChange,
  show,
  setShow,
  placeholder,
  autoComplete,
}) => (
  <Field
    label={label}
    required
  >
    <div className="relative">
      <Lock
        size={17}
        className="
          absolute left-3
          top-1/2
          -translate-y-1/2
          text-slate-400
        "
      />

      <input
        type={
          show
            ? "text"
            : "password"
        }
        value={value}
        onChange={(e) =>
          onChange(
            e.target.value
          )
        }
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={`
          ${inputClass}
          pl-10 pr-11
        `}
      />

      <button
        type="button"
        onClick={() =>
          setShow(
            (current) =>
              !current
          )
        }
        className="
          absolute right-2
          top-1/2
          flex h-8 w-8
          -translate-y-1/2
          items-center
          justify-center
          rounded-lg
          text-slate-400
          transition
          hover:bg-slate-100
          hover:text-[#B76E79]
        "
      >
        {show ? (
          <EyeOff size={17} />
        ) : (
          <Eye size={17} />
        )}
      </button>
    </div>
  </Field>
);
=======
  "current-password" |
  "new-password";
}


const PasswordField:
  React.FC<PasswordFieldProps> = ({
    label,
    value,
    onChange,
    show,
    setShow,
    placeholder,
    autoComplete,
  }) => (

    <Field
      label={label}
      required
    >

      <div className="relative">

        <Lock
          size={17}
          className="
            absolute left-3
            top-1/2
            -translate-y-1/2
            text-slate-400
          "
        />


        <input
          type={
            show
              ? "text"
              : "password"
          }
          value={value}
          onChange={(e) =>
            onChange(
              e.target.value
            )
          }
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={`
            ${inputClass}
            pl-10 pr-11
          `}
        />


        <button
          type="button"
          onClick={() =>
            setShow(
              (current) =>
                !current
            )
          }
          className="
            absolute right-2
            top-1/2
            flex h-8 w-8
            -translate-y-1/2
            items-center
            justify-center
            rounded-lg
            text-slate-400
            transition
            hover:bg-slate-100
            hover:text-indigo-600
          "
        >

          {show ? (

            <EyeOff size={17} />

          ) : (

            <Eye size={17} />

          )}

        </button>

      </div>

    </Field>
  );

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

export default UpdateProfile;