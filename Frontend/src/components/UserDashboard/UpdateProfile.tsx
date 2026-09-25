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


// =========================================================
// API
// =========================================================

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:8000";


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


interface ProfileResponse {
  success: boolean;
  message?: string;
  user: ProfileUser;
}


interface SuccessPopupState {
  show: boolean;
  title: string;
  message: string;
}


// =========================================================
// COMPONENT
// =========================================================

const UpdateProfile: React.FC = () => {

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


  // =======================================================
  // BEP20
  // =======================================================

  const [bep20Address, setBep20Address] =
    useState("");

  const [copiedWallet, setCopiedWallet] =
    useState(false);


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


  // =======================================================
  // ERROR
  // =======================================================

  const [error, setError] =
    useState("");


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


  // =======================================================
  // HELPERS
  // =======================================================

  const getToken = () =>
    localStorage.getItem(
      "access_token"
    );


  const clearMessages = () => {
    setError("");
  };


  const showSuccessPopup = (
    title: string,
    message: string
  ) => {

    setSuccessPopup({
      show: true,
      title,
      message,
    });


    window.setTimeout(() => {

      setSuccessPopup({
        show: false,
        title: "",
        message: "",
      });

    }, 3000);
  };


  const closeSuccessPopup = () => {

    setSuccessPopup({
      show: false,
      title: "",
      message: "",
    });
  };


  const getErrorMessage = (
    err: unknown,
    fallback: string
  ) => {

    if (axios.isAxiosError(err)) {

      const detail =
        err.response?.data?.detail;


      if (typeof detail === "string") {
        return detail;
      }


      if (Array.isArray(detail)) {

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


  const formatDate = (
    date?: string | null
  ) => {

    if (!date) return "--";


    const parsed =
      new Date(date);


    if (
      Number.isNaN(
        parsed.getTime()
      )
    ) {
      return "--";
    }


    return new Intl.DateTimeFormat(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    ).format(parsed);
  };


  // =======================================================
  // SET PROFILE INTO FORM
  // =======================================================

  const applyProfile = (
    user: ProfileUser
  ) => {

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


  // =======================================================
  // LOAD PROFILE
  // =======================================================

  useEffect(() => {

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


          applyProfile(
            response.data.user
          );

        } catch (err) {

          console.error(
            "Load profile error:",
            err
          );


          setError(
            getErrorMessage(
              err,
              "Unable to load your profile."
            )
          );

        } finally {

          setPageLoading(false);
        }
      };


    loadProfile();

  }, []);


  // =======================================================
  // UPDATE PERSONAL PROFILE
  // =======================================================

  const handleProfileUpdate =
    async (
      e: React.FormEvent
    ) => {

      e.preventDefault();

      clearMessages();


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


        applyProfile(
          response.data.user
        );


        // -----------------------------------------------
        // UPDATE LOCAL STORAGE USER NAME
        // -----------------------------------------------

        try {

          const savedUser =
            localStorage.getItem(
              "user"
            );


          if (savedUser) {

            const parsedUser =
              JSON.parse(
                savedUser
              );


            parsedUser.full_name =
              response.data.user.full_name;


            localStorage.setItem(
              "user",
              JSON.stringify(
                parsedUser
              )
            );
          }

        } catch (storageError) {

          console.error(
            "Local user update error:",
            storageError
          );
        }


        // -----------------------------------------------
        // SUCCESS POPUP
        // -----------------------------------------------

        showSuccessPopup(
          "Profile Updated Successfully",
          "Your personal information has been updated successfully."
        );

      } catch (err) {

        console.error(
          "Update profile error:",
          err
        );


        setError(
          getErrorMessage(
            err,
            "Unable to update profile."
          )
        );

      } finally {

        setProfileUpdating(false);
      }
    };


  // =======================================================
  // UPDATE BEP20
  // =======================================================

  const handleWalletUpdate =
    async (
      e: React.FormEvent
    ) => {

      e.preventDefault();

      clearMessages();


      if (!profile) {
        return;
      }


      if (
        profile.bep20_is_set &&
        !profile.bep20_can_change
      ) {

        setError(
          "Your BEP20 wallet address is locked. Please raise a support ticket for another change."
        );

        return;
      }


      const cleanWallet =
        bep20Address.trim();


      const bep20Regex =
        /^0x[a-fA-F0-9]{40}$/;


      if (
        !bep20Regex.test(
          cleanWallet
        )
      ) {

        setError(
          "Please enter a valid BEP20 wallet address."
        );

        return;
      }


      // -----------------------------------------------
      // CONFIRM BEFORE USING ONE-TIME CHANGE
      // -----------------------------------------------

      if (profile.bep20_is_set) {

        const confirmed =
          window.confirm(
            "Important: You can change your BEP20 wallet address only once yourself. After this change, the wallet will be locked and any future change will require a support ticket.\n\nDo you want to continue?"
          );


        if (!confirmed) {
          return;
        }
      }


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


        applyProfile(
          response.data.user
        );


        // -----------------------------------------------
        // SUCCESS POPUP
        // -----------------------------------------------

        if (wasWalletAlreadySet) {

          showSuccessPopup(
            "BEP20 Address Updated",
            "Your BEP20 wallet address has been changed successfully. Your self-service wallet change has now been used and the wallet is locked."
          );

        } else {

          showSuccessPopup(
            "BEP20 Address Saved",
            "Your BEP20 wallet address has been saved successfully. You still have one self-service wallet change available."
          );
        }

      } catch (err) {

        console.error(
          "Wallet update error:",
          err
        );


        setError(
          getErrorMessage(
            err,
            "Unable to update BEP20 wallet."
          )
        );

      } finally {

        setWalletUpdating(false);
      }
    };


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


  // =======================================================
  // CHANGE PASSWORD
  // =======================================================

  const handlePasswordUpdate =
    async (
      e: React.FormEvent
    ) => {

      e.preventDefault();

      clearMessages();


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


      if (
        newPassword !==
        confirmPassword
      ) {

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


        // -----------------------------------------------
        // CLEAR PASSWORD FIELDS
        // -----------------------------------------------

        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");


        setShowCurrentPassword(false);
        setShowNewPassword(false);
        setShowConfirmPassword(false);


        // -----------------------------------------------
        // SUCCESS POPUP
        // -----------------------------------------------

        showSuccessPopup(
          "Password Changed Successfully",
          "Your account password has been changed successfully."
        );

      } catch (err) {

        console.error(
          "Password update error:",
          err
        );


        setError(
          getErrorMessage(
            err,
            "Unable to change password."
          )
        );

      } finally {

        setPasswordUpdating(false);
      }
    };


  // =======================================================
  // COPY WALLET
  // =======================================================

  const handleCopyWallet =
    async () => {

      if (
        !profile?.bep20_address
      ) {
        return;
      }


      try {

        await navigator.clipboard.writeText(
          profile.bep20_address
        );


        setCopiedWallet(true);


        window.setTimeout(
          () => {
            setCopiedWallet(false);
          },
          2000
        );

      } catch (err) {

        console.error(
          "Copy wallet error:",
          err
        );
      }
    };


  // =======================================================
  // LOADING PAGE
  // =======================================================

  if (pageLoading) {

    return (
      <div
        className="
          flex min-h-[400px]
          items-center justify-center
          bg-slate-50
        "
      >

        <div
          className="
            flex flex-col
            items-center gap-3
          "
        >

          <Loader2
            className="
              h-8 w-8
              animate-spin
              text-indigo-600
            "
          />


          <p
            className="
              text-sm font-semibold
              text-slate-500
            "
          >
            Loading profile...
          </p>

        </div>

      </div>
    );
  }


  // =======================================================
  // PAGE
  // =======================================================

  return (
    <>
      <UserNavbar />
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

              <button
                type="button"
                onClick={
                  closeSuccessPopup
                }
                className="
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
              >
                <X size={18} />
              </button>


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
                  >
                    <Check
                      size={30}
                      strokeWidth={3}
                    />
                  </div>

                </div>


                <h3
                  className="
                  mt-5 text-xl
                  font-extrabold
                  tracking-tight
                  text-slate-900
                  sm:text-2xl
                "
                >
                  {successPopup.title}
                </h3>


                <p
                  className="
                  mx-auto mt-2
                  max-w-sm
                  text-sm
                  leading-6
                  text-slate-500
                "
                >
                  {successPopup.message}
                </p>


                <button
                  type="button"
                  onClick={
                    closeSuccessPopup
                  }
                  className="
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
                >
                  <CheckCircle2
                    size={17}
                  />

                  Done
                </button>

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
        />

        <div
          className="
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
            >
              <ShieldCheck size={15} />

              Account Settings
            </div>


            <h1
              className="
              text-3xl font-extrabold
              tracking-tight
              text-slate-900
              sm:text-4xl
            "
            >
              Update Profile
            </h1>


            <p
              className="
              mt-2 max-w-2xl
              text-sm leading-6
              text-slate-500
              sm:text-base
            "
            >
              Manage your personal information,
              wallet details and account security.
            </p>

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
                >
                  Attention
                </p>


                <p
                  className="
                  mt-0.5 text-sm
                  text-red-600
                "
                >
                  {error}
                </p>

              </div>


              <button
                type="button"
                onClick={() =>
                  setError("")
                }
                className="
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
                  >
                    <User size={27} />
                  </div>


                  <div className="min-w-0">

                    <p
                      className="
                      truncate
                      text-lg font-extrabold
                      text-slate-900
                    "
                    >
                      {profile.full_name}
                    </p>


                    <p
                      className="
                      mt-0.5 truncate
                      text-sm
                      text-slate-500
                    "
                    >
                      {profile.email}
                    </p>


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

                  <BadgeCheck size={16} />

                  {profile.is_active
                    ? "ACTIVE"
                    : "INACTIVE"}

                </div>

              </div>


              <div
                className="
                grid border-t
                border-slate-100
                sm:grid-cols-3
              "
              >

                <SummaryItem
                  label="Sponsor ID"
                  value={
                    profile.sponsor_id ||
                    "--"
                  }
                />


                <SummaryItem
                  label="Country"
                  value={
                    profile.country ||
                    "--"
                  }
                />


                <SummaryItem
                  label="Joining Date"
                  value={formatDate(
                    profile.joining_date
                  )}
                />

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

            <form
              onSubmit={
                handleProfileUpdate
              }
              className="
              rounded-3xl
              border border-slate-200/70
              bg-white p-5
              shadow-[0_12px_40px_rgba(15,23,42,0.06)]
              sm:p-6
            "
            >

              <SectionTitle
                icon={<User size={21} />}
                title="Personal Information"
                subtitle="Update your basic account information."
              />


              <div
                className="
                mt-6 grid gap-4
                sm:grid-cols-2
              "
              >

                <Field
                  label="First Name"
                  required
                >

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

                </Field>


                <Field
                  label="Last Name"
                  required
                >

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


                    <select
                      value={gender}
                      onChange={(e) =>
                        setGender(
                          e.target.value
                        )
                      }
                      className={`${inputClass} pl-10`}
                    >

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


                    <input
                      type="text"
                      value={
                        profile?.email || ""
                      }
                      readOnly
                      className={`${readOnlyClass} pl-10`}
                    />

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


                    <input
                      type="text"
                      value={
                        profile?.phone_number ||
                        ""
                      }
                      readOnly
                      className={`${readOnlyClass} pl-10`}
                    />

                  </div>

                </Field>


                <Field label="Customer ID">

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
                      ${inputClass}
                      resize-none
                      pl-10
                    `}
                    />

                  </div>

                </Field>

              </div>


              <button
                type="submit"
                disabled={
                  profileUpdating
                }
                className="
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

                {profileUpdating ? (
                  <Loader2
                    size={17}
                    className="animate-spin"
                  />
                ) : (
                  <Save size={17} />
                )}


                {profileUpdating
                  ? "Saving..."
                  : "Save Profile"}

              </button>

            </form>


            {/* =================================================
              BEP20 WALLET
          ================================================= */}

            <form
              onSubmit={
                handleWalletUpdate
              }
              className="
              rounded-3xl
              border border-slate-200/70
              bg-white p-5
              shadow-[0_12px_40px_rgba(15,23,42,0.06)]
              sm:p-6
            "
            >

              <SectionTitle
                icon={
                  <Wallet size={21} />
                }
                title="BEP20 Wallet"
                subtitle="Manage your withdrawal wallet address."
              />


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
                  >
                    Important Security Notice
                  </p>


                  <p
                    className="
                    mt-1 text-xs
                    leading-5
                    text-amber-700
                  "
                  >
                    Your initial BEP20 wallet setup
                    does not count as a change.
                    After setup, you can replace
                    your wallet address only one
                    time yourself. Any further
                    change requires approval
                    through a support ticket.
                  </p>

                </div>

              </div>


              {/* WALLET STATUS */}

              <div
                className="
                mt-5 flex flex-wrap
                items-center gap-2
              "
              >

                {!profile?.bep20_is_set ? (

                  <StatusBadge
                    type="warning"
                    text="Wallet Not Set"
                  />

                ) : profile.bep20_can_change ? (

                  <StatusBadge
                    type="success"
                    text="1 Change Available"
                  />

                ) : (

                  <StatusBadge
                    type="locked"
                    text="Wallet Locked"
                  />

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

                    <CalendarDays
                      size={13}
                    />

                    Updated{" "}
                    {formatDate(
                      profile.bep20_updated_at
                    )}

                  </span>

                )}

              </div>


              {/* WALLET INPUT */}

              <div className="mt-5">

                <Field
                  label="BEP20 Wallet Address"
                  required
                >

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


                    <input
                      type="text"
                      value={bep20Address}
                      onChange={(e) =>
                        setBep20Address(
                          e.target.value.trim()
                        )
                      }
                      readOnly={
                        Boolean(
                          profile?.bep20_is_set &&
                          !profile?.bep20_can_change
                        )
                      }
                      placeholder="0x..."
                      spellCheck={false}
                      autoComplete="off"
                      className={`
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

                      <button
                        type="button"
                        onClick={
                          handleCopyWallet
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


              {/* LOCKED */}

              {profile?.bep20_is_set &&
                !profile.bep20_can_change && (

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
                        >
                          Wallet address locked
                        </p>


                        <p
                          className="
                          mt-1 text-xs
                          leading-5
                          text-slate-500
                        "
                        >
                          Your self-service wallet
                          change has already been
                          used. To change this
                          address again, please
                          raise a support ticket.
                        </p>

                      </div>

                    </div>


                    <button
                      type="button"
                      disabled
                      title="Support ticket module will be connected next"
                      className="
                      mt-4 inline-flex
                      min-h-10 items-center
                      gap-2 rounded-xl
                      border border-slate-200
                      bg-white px-4
                      text-xs font-bold
                      text-slate-400
                      opacity-70
                    "
                    >
                      <Ticket size={15} />
                      Raise Support Ticket
                    </button>

                  </div>

                )}


              {/* SAVE WALLET */}

              {!(
                profile?.bep20_is_set &&
                !profile?.bep20_can_change
              ) && (

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

            <form
              onSubmit={
                handlePasswordUpdate
              }
              className="
              rounded-3xl
              border border-slate-200/70
              bg-white p-5
              shadow-[0_12px_40px_rgba(15,23,42,0.06)]
              sm:p-6 lg:col-span-2
            "
            >

              <SectionTitle
                icon={
                  <KeyRound size={21} />
                }
                title="Account Security"
                subtitle="Change your account password securely."
              />


              <div
                className="
                mt-6 grid gap-4
                md:grid-cols-3
              "
              >

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

              </div>


              <div className="mt-4">

                <div
                  className={`h-1.5 w-full rounded-full ${newPassword
                      ? isStrongPassword
                        ? "bg-emerald-500"
                        : "bg-red-500"
                      : "bg-slate-200"
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

              </div>

              <button
                type="submit"
                disabled={
                  passwordUpdating
                }
                className="
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

                  <Loader2
                    size={17}
                    className="animate-spin"
                  />

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

    </>
  );
};


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
  focus:border-indigo-400
  focus:ring-4
  focus:ring-indigo-100
`;


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


// =========================================================
// FIELD
// =========================================================

interface FieldProps {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}


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


// =========================================================
// SECTION TITLE
// =========================================================

interface SectionTitleProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}


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


// =========================================================
// SUMMARY ITEM
// =========================================================

interface SummaryItemProps {
  label: string;
  value: string;
}


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


// =========================================================
// STATUS BADGE
// =========================================================

interface StatusBadgeProps {
  type:
  | "success"
  | "warning"
  | "locked";

  text: string;
}


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


// =========================================================
// PASSWORD RULE
// =========================================================

interface PasswordRuleProps {
  valid: boolean;
  text: string;
}

const PasswordRule: React.FC<PasswordRuleProps> = ({
  valid,
  text,
}) => (
  <div
    className={`flex items-center gap-2 font-semibold ${valid ? "text-emerald-600" : "text-red-500"
      }`}
  >
    {valid ? (
      <CheckCircle2 size={14} />
    ) : (
      <XCircle size={14} />
    )}

    <span>{text}</span>
  </div>
);


// =========================================================
// PASSWORD FIELD
// =========================================================

interface PasswordFieldProps {
  label: string;

  value: string;

  onChange:
  (value: string) => void;

  show: boolean;

  setShow:
  React.Dispatch<
    React.SetStateAction<boolean>
  >;

  placeholder: string;

  autoComplete:
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


export default UpdateProfile;