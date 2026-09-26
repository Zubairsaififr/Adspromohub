<<<<<<< HEAD
// 'use client';

// import React, { useEffect, useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import axios from 'axios';

// import {
//   motion,
//   AnimatePresence,
//   useMotionValue,
//   useTransform,
// } from 'framer-motion';

// import {
//   Mail,
//   Lock,
//   Eye,
//   EyeClosed,
//   ArrowRight,
//   UserRound,
//   Wallet,
//   CheckCircle2,
//   AlertCircle,
//   X,
// } from 'lucide-react';

// import { cn } from '../../lib/utils';


// // =====================================================
// // API URL
// // =====================================================

// const API_URL =
//   import.meta.env.VITE_API_URL ||
//   'http://127.0.0.1:8000';


// // =====================================================
// // INPUT COMPONENT
// // =====================================================

// function Input({
//   className,
//   type,
//   ...props
// }: React.ComponentProps<'input'>) {
//   return (
//     <input
//       type={type}
//       data-slot="input"
//       className={cn(
//         'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
//         'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
//         'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 dark:aria-invalid:border-destructive',
//         className
//       )}
//       {...props}
//     />
//   );
// }


// // =====================================================
// // ACCOUNT SETUP TYPES
// // =====================================================

// type AccountSetupStatus = {
//   profileComplete: boolean;
//   bep20Complete: boolean;
// };


// // =====================================================
// // SIGN IN
// // =====================================================

// export function SignIn() {
//   const navigate = useNavigate();


//   // ===================================================
//   // STATES
//   // ===================================================

//   const [showPassword, setShowPassword] =
//     useState(false);

//   const [email, setEmail] =
//     useState('');

//   const [password, setPassword] =
//     useState('');

//   const [isLoading, setIsLoading] =
//     useState(false);

//   const [error, setError] =
//     useState('');

//   const [success, setSuccess] =
//     useState('');

//   const [focusedInput, setFocusedInput] =
//     useState<
//       'email' | 'password' | null
//     >(null);

//   const [rememberMe, setRememberMe] =
//     useState(false);

//   const [showSetupPopup, setShowSetupPopup] =
//     useState(false);

//   const [setupStatus, setSetupStatus] =
//     useState<AccountSetupStatus>({
//       profileComplete: false,
//       bep20Complete: false,
//     });


//   // ===================================================
//   // CHECK ALREADY LOGGED IN
//   // ===================================================

//   useEffect(() => {
//     const token =
//       localStorage.getItem(
//         'access_token'
//       );

//     const savedUser =
//       localStorage.getItem(
//         'user'
//       );


//     if (
//       !token ||
//       !savedUser
//     ) {
//       return;
//     }


//     try {
//       const user =
//         JSON.parse(
//           savedUser
//         );


//       // ADMIN

//       if (
//         user.is_admin === true
//       ) {
//         navigate(
//           '/admin',
//           {
//             replace: true,
//           }
//         );

//         return;
//       }


//       // NORMAL USER

//       navigate(
//         '/newdashboard',
//         {
//           replace: true,
//         }
//       );

//     } catch (err) {

//       console.error(
//         'Failed to read saved user:',
//         err
//       );


//       // INVALID SAVED DATA

//       localStorage.removeItem(
//         'access_token'
//       );

//       localStorage.removeItem(
//         'refresh_token'
//       );

//       localStorage.removeItem(
//         'user'
//       );
//     }

//   }, [navigate]);


//   // ===================================================
//   // LOAD REMEMBER ME
//   // ===================================================

//   useEffect(() => {
//     const savedRememberMe =
//       localStorage.getItem(
//         'rememberMe'
//       );

//     if (
//       savedRememberMe === 'true'
//     ) {
//       setRememberMe(true);
//     }
//   }, []);


//   // ===================================================
//   // 3D CARD EFFECT
//   // ===================================================

//   const mouseX =
//     useMotionValue(0);

//   const mouseY =
//     useMotionValue(0);

//   const rotateX =
//     useTransform(
//       mouseY,
//       [-300, 300],
//       [10, -10]
//     );

//   const rotateY =
//     useTransform(
//       mouseX,
//       [-300, 300],
//       [-10, 10]
//     );


//   // ===================================================
//   // MOUSE MOVE
//   // ===================================================

//   const handleMouseMove = (
//     e: React.MouseEvent<HTMLDivElement>
//   ) => {
//     const rect =
//       e.currentTarget
//         .getBoundingClientRect();

//     mouseX.set(
//       e.clientX -
//         rect.left -
//         rect.width / 2
//     );

//     mouseY.set(
//       e.clientY -
//         rect.top -
//         rect.height / 2
//     );
//   };


//   // ===================================================
//   // MOUSE LEAVE
//   // ===================================================

//   const handleMouseLeave = () => {
//     mouseX.set(0);
//     mouseY.set(0);
//   };


//   // ===================================================
//   // CHECK ACCOUNT SETUP
//   // ===================================================

//   const checkAccountSetup = async (
//     accessToken: string
//   ): Promise<AccountSetupStatus | null> => {
//     try {
//       const profileResponse =
//         await axios.get(
//           `${API_URL}/api/profile`,
//           {
//             headers: {
//               Authorization:
//                 `Bearer ${accessToken}`,
//             },
//           }
//         );

//       const profile =
//         profileResponse.data?.user;

//       if (!profile) {
//         return null;
//       }

//       const profileComplete =
//         Boolean(
//           profile.first_name?.trim()
//         ) &&
//         Boolean(
//           profile.last_name?.trim()
//         ) &&
//         Boolean(
//           profile.gender?.trim()
//         ) &&
//         Boolean(
//           profile.address?.trim()
//         );

//       const bep20Complete =
//         profile.bep20_is_set === true ||
//         Boolean(
//           profile.bep20_address?.trim()
//         );

//       return {
//         profileComplete,
//         bep20Complete,
//       };

//     } catch (profileError) {
//       console.error(
//         'Unable to check profile completion:',
//         profileError
//       );

//       return null;
//     }
//   };


//   // ===================================================
//   // SIGN IN SUBMIT
//   // ===================================================

//   const handleSubmit = async (
//     event:
//       React.FormEvent<HTMLFormElement>
//   ) => {
//     event.preventDefault();


//     // RESET MESSAGES

//     setError('');
//     setSuccess('');


//     // =================================================
//     // CLEAN LOGIN
//     // =================================================

//     const cleanLogin =
//       email.trim();


//     // =================================================
//     // VALIDATION
//     // =================================================

//     if (!cleanLogin) {
//       setError(
//         'Please enter your email or Customer ID.'
//       );

//       return;
//     }


//     if (!password) {
//       setError(
//         'Please enter your password.'
//       );

//       return;
//     }


//     try {

//       setIsLoading(true);


//       // =================================================
//       // AXIOS LOGIN REQUEST
//       // =================================================

//       const response =
//         await axios.post(
//           `${API_URL}/api/auth/signin`,

//           {
//             login:
//               cleanLogin,

//             password:
//               password,

//             remember_me:
//               rememberMe,
//           },

//           {
//             headers: {
//               'Content-Type':
//                 'application/json',
//             },
//           }
//         );


//       // =================================================
//       // RESPONSE
//       // =================================================

//       const data =
//         response.data;


//       console.log(
//         'Signin API Response:',
//         data
//       );


//       // =================================================
//       // VERIFY RESPONSE
//       // =================================================

//       if (
//         !data?.access_token
//       ) {
//         throw new Error(
//           'Login successful but access token is missing.'
//         );
//       }


//       if (
//         !data?.refresh_token
//       ) {
//         throw new Error(
//           'Login successful but refresh token is missing.'
//         );
//       }


//       if (
//         !data?.user_id
//       ) {
//         throw new Error(
//           'Login successful but user information is missing.'
//         );
//       }


//       if (
//         !data?.customer_id
//       ) {
//         throw new Error(
//           'Login successful but Customer ID is missing.'
//         );
//       }


//       if (
//         !data?.referral_code
//       ) {
//         throw new Error(
//           'Login successful but referral code is missing.'
//         );
//       }


//       // =================================================
//       // CREATE USER DATA
//       // =================================================

//       const userData = {

//         user_id:
//           data.user_id,

//         customer_id:
//           data.customer_id,

//         referral_code:
//           String(
//             data.referral_code
//           ).trim(),

//         full_name:
//           data.full_name,

//         email:
//           data.email,

//         role:
//           data.role,

//         is_admin:
//           data.is_admin === true,

//         is_active:
//           true,
//       };


//       // =================================================
//       // SAVE ACCESS TOKEN
//       // =================================================

//       localStorage.setItem(
//         'access_token',
//         data.access_token
//       );


//       // =================================================
//       // SAVE REFRESH TOKEN
//       // =================================================

//       localStorage.setItem(
//         'refresh_token',
//         data.refresh_token
//       );


//       // =================================================
//       // SAVE USER
//       // =================================================

//       localStorage.setItem(
//         'user',
//         JSON.stringify(
//           userData
//         )
//       );


//       // =================================================
//       // REMEMBER ME
//       // =================================================

//       if (rememberMe) {

//         localStorage.setItem(
//           'rememberMe',
//           'true'
//         );

//       } else {

//         localStorage.removeItem(
//           'rememberMe'
//         );
//       }


//       // =================================================
//       // DEBUG
//       // =================================================

//       console.log(
//         'Logged In User:',
//         userData
//       );

//       console.log(
//         'Customer ID:',
//         data.customer_id
//       );

//       console.log(
//         'Role:',
//         data.role
//       );

//       console.log(
//         'Is Admin:',
//         data.is_admin
//       );


//       // =================================================
//       // SUCCESS / ACCOUNT SETUP CHECK
//       // =================================================

//       setError('');


//       // ADMIN DOES NOT NEED USER SETUP POPUP

//       if (
//         data.is_admin === true
//       ) {
//         setSuccess(
//           'Admin login successful! Redirecting to Admin Dashboard...'
//         );

//         window.setTimeout(
//           () => {
//             navigate(
//               '/admin',
//               {
//                 replace: true,
//               }
//             );
//           },
//           900
//         );

//         return;
//       }


//       // NORMAL USER - CHECK ACTUAL PROFILE FROM BACKEND

//       setSuccess(
//         'Login successful! Checking your account setup...'
//       );

//       const currentSetupStatus =
//         await checkAccountSetup(
//           data.access_token
//         );


//       // If profile status could not be loaded,
//       // do not block login.

//       if (!currentSetupStatus) {
//         setSuccess(
//           'Login successful! Redirecting to your dashboard...'
//         );

//         window.setTimeout(
//           () => {
//             navigate(
//               '/newdashboard',
//               {
//                 replace: true,
//               }
//             );
//           },
//           900
//         );

//         return;
//       }


//       setSetupStatus(
//         currentSetupStatus
//       );


//       const accountSetupComplete =
//         currentSetupStatus.profileComplete &&
//         currentSetupStatus.bep20Complete;


//       if (accountSetupComplete) {
//         setSuccess(
//           'Login successful! Redirecting to your dashboard...'
//         );

//         window.setTimeout(
//           () => {
//             navigate(
//               '/newdashboard',
//               {
//                 replace: true,
//               }
//             );
//           },
//           900
//         );

//         return;
//       }


//       // SOMETHING IS PENDING - SHOW POPUP

//       setSuccess('');
//       setShowSetupPopup(true);

//     } catch (
//       err: unknown
//     ) {

//       console.error(
//         'Signin Error:',
//         err
//       );


//       // =================================================
//       // AXIOS ERRORS
//       // =================================================

//       if (
//         axios.isAxiosError(err)
//       ) {

//         const detail =
//           err.response
//             ?.data
//             ?.detail;


//         // BACKEND NORMAL ERROR

//         if (
//           typeof detail ===
//           'string'
//         ) {

//           setError(
//             detail
//           );

//           return;
//         }


//         // FASTAPI VALIDATION ERROR

//         if (
//           Array.isArray(
//             detail
//           )
//         ) {

//           const validationMessage =
//             detail
//               .map(
//                 (
//                   item: any
//                 ) =>
//                   item?.msg
//               )
//               .filter(
//                 Boolean
//               )
//               .join(
//                 ', '
//               );


//           setError(
//             validationMessage ||
//               'Unable to sign in.'
//           );

//           return;
//         }


//         // BACKEND NOT AVAILABLE

//         if (
//           !err.response
//         ) {

//           setError(
//             'Unable to connect to server. Please try again.'
//           );

//           return;
//         }


//         setError(
//           'Unable to sign in. Please try again.'
//         );

//         return;
//       }


//       // =================================================
//       // NORMAL JS ERROR
//       // =================================================

//       if (
//         err instanceof Error
//       ) {

//         setError(
//           err.message
//         );

//         return;
//       }


//       setError(
//         'Something went wrong. Please try again.'
//       );

//     } finally {

//       setIsLoading(false);
//     }
//   };


//   // ===================================================
//   // UI
//   // ===================================================

//   return (
//     <div className="relative flex min-h-screen w-screen items-center justify-center overflow-hidden bg-black">

//       {/* =================================================
//           BACKGROUND
//       ================================================== */}

//       <div className="absolute inset-0 bg-gradient-to-b from-purple-500/40 via-purple-700/50 to-black" />


//       {/* =================================================
//           NOISE
//       ================================================== */}

//       <div
//         className="absolute inset-0 opacity-[0.03] mix-blend-soft-light"
//         style={{
//           backgroundImage:
//             `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
//           backgroundSize:
//             '200px 200px',
//         }}
//       />


//       {/* =================================================
//           TOP GLOW
//       ================================================== */}

//       <div className="absolute top-0 left-1/2 h-[60vh] w-[120vh] -translate-x-1/2 rounded-b-[50%] bg-purple-400/20 blur-[80px]" />


//       <motion.div
//         className="absolute top-0 left-1/2 h-[60vh] w-[100vh] -translate-x-1/2 rounded-b-full bg-purple-300/20 blur-[60px]"
//         animate={{
//           opacity: [
//             0.15,
//             0.3,
//             0.15,
//           ],
//           scale: [
//             0.98,
//             1.02,
//             0.98,
//           ],
//         }}
//         transition={{
//           duration: 8,
//           repeat: Infinity,
//           repeatType:
//             'mirror',
//         }}
//       />


//       <motion.div
//         className="absolute bottom-0 left-1/2 h-[90vh] w-[90vh] -translate-x-1/2 rounded-t-full bg-purple-400/20 blur-[60px]"
//         animate={{
//           opacity: [
//             0.3,
//             0.5,
//             0.3,
//           ],
//           scale: [
//             1,
//             1.1,
//             1,
//           ],
//         }}
//         transition={{
//           duration: 6,
//           repeat: Infinity,
//           repeatType:
//             'mirror',
//           delay: 1,
//         }}
//       />


//       {/* =================================================
//           GLOW SPOTS
//       ================================================== */}

//       <div className="absolute top-1/4 left-1/4 h-96 w-96 animate-pulse rounded-full bg-white/5 opacity-40 blur-[100px]" />

//       <div className="absolute right-1/4 bottom-1/4 h-96 w-96 animate-pulse rounded-full bg-white/5 opacity-40 blur-[100px] delay-1000" />


//       {/* =================================================
//           MAIN CARD
//       ================================================== */}

//       <motion.div
//         initial={{
//           opacity: 0,
//           y: 20,
//         }}
//         animate={{
//           opacity: 1,
//           y: 0,
//         }}
//         transition={{
//           duration: 0.6,
//         }}
//         style={{
//           rotateX,
//           rotateY,
//           transformPerspective:
//             1000,
//         }}
//         onMouseMove={
//           handleMouseMove
//         }
//         onMouseLeave={
//           handleMouseLeave
//         }
//         className="relative w-full max-w-md px-4"
//       >

//         {/* CARD GLOW */}

//         <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-purple-500/30 via-white/10 to-purple-500/30 opacity-60 blur-xl" />


//         {/* CARD */}

//         <motion.div
//           className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/40 shadow-2xl backdrop-blur-xl"
//           initial={{
//             scale: 0.95,
//           }}
//           animate={{
//             scale: 1,
//           }}
//           transition={{
//             duration: 0.5,
//           }}
//         >

//           {/* CARD CONTENT */}

//           <div className="p-7 sm:p-8">


//             {/* =================================================
//                 HEADER
//             ================================================== */}

//             <motion.div
//               className="mb-7 text-center"
//               initial={{
//                 opacity: 0,
//                 y: -10,
//               }}
//               animate={{
//                 opacity: 1,
//                 y: 0,
//               }}
//               transition={{
//                 delay: 0.15,
//               }}
//             >

//               <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
//                 Welcome Back
//               </h1>

//               <p className="mt-2 text-sm text-white/40">
//                 Sign in to your Ads Promo Hub account
//               </p>

//             </motion.div>


//             {/* =================================================
//                 ERROR
//             ================================================== */}

//             <AnimatePresence>

//               {error && (
//                 <motion.div
//                   initial={{
//                     opacity: 0,
//                     y: -10,
//                   }}
//                   animate={{
//                     opacity: 1,
//                     y: 0,
//                   }}
//                   exit={{
//                     opacity: 0,
//                     y: -10,
//                   }}
//                   className="mb-4 rounded-lg border border-red-400/20 bg-red-500/10 px-4 py-3 text-xs text-red-300"
//                 >
//                   {error}
//                 </motion.div>
//               )}

//             </AnimatePresence>


//             {/* =================================================
//                 SUCCESS
//             ================================================== */}

//             <AnimatePresence>

//               {success && (
//                 <motion.div
//                   initial={{
//                     opacity: 0,
//                     y: -10,
//                   }}
//                   animate={{
//                     opacity: 1,
//                     y: 0,
//                   }}
//                   exit={{
//                     opacity: 0,
//                     y: -10,
//                   }}
//                   className="mb-4 rounded-lg border border-green-400/20 bg-green-500/10 px-4 py-3 text-xs text-green-300"
//                 >
//                   {success}
//                 </motion.div>
//               )}

//             </AnimatePresence>


//             {/* =================================================
//                 FORM
//             ================================================== */}

//             <form
//               onSubmit={
//                 handleSubmit
//               }
//               className="space-y-4"
//             >


//               {/* =================================================
//                   EMAIL / CUSTOMER ID
//               ================================================== */}

//               <motion.div
//                 className={`relative ${
//                   focusedInput ===
//                   'email'
//                     ? 'z-10'
//                     : ''
//                 }`}
//                 whileHover={{
//                   scale: 1.01,
//                 }}
//                 transition={{
//                   type:
//                     'spring',
//                   stiffness: 400,
//                   damping: 25,
//                 }}
//               >

//                 <div className="absolute -inset-[0.5px] rounded-lg bg-gradient-to-r from-white/10 via-white/5 to-white/10 opacity-0 transition-all duration-300 group-hover:opacity-100" />


//                 <div className="relative flex items-center overflow-hidden rounded-lg">

//                   <Mail
//                     className={`absolute left-3 h-4 w-4 transition-all duration-300 ${
//                       focusedInput ===
//                       'email'
//                         ? 'text-white'
//                         : 'text-white/40'
//                     }`}
//                   />


//                   <Input
//                     type="text"
//                     placeholder="Email address or Customer ID"
//                     value={
//                       email
//                     }
//                     onChange={(
//                       e
//                     ) => {
//                       setEmail(
//                         e.target.value
//                       );

//                       setError('');
//                     }}
//                     onFocus={() =>
//                       setFocusedInput(
//                         'email'
//                       )
//                     }
//                     onBlur={() =>
//                       setFocusedInput(
//                         null
//                       )
//                     }
//                     autoComplete="username"
//                     disabled={
//                       isLoading
//                     }
//                     className="h-10 w-full border-transparent bg-white/5 pl-10 pr-3 text-white placeholder:text-white/30 transition-all duration-300 focus:border-white/20 focus:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
//                   />

//                 </div>

//               </motion.div>


//               {/* =================================================
//                   PASSWORD
//               ================================================== */}

//               <motion.div
//                 className={`relative ${
//                   focusedInput ===
//                   'password'
//                     ? 'z-10'
//                     : ''
//                 }`}
//                 whileHover={{
//                   scale: 1.01,
//                 }}
//                 transition={{
//                   type:
//                     'spring',
//                   stiffness: 400,
//                   damping: 25,
//                 }}
//               >

//                 <div className="absolute -inset-[0.5px] rounded-lg bg-gradient-to-r from-white/10 via-white/5 to-white/10 opacity-0 transition-all duration-300 group-hover:opacity-100" />


//                 <div className="relative flex items-center overflow-hidden rounded-lg">

//                   <Lock
//                     className={`absolute left-3 h-4 w-4 transition-all duration-300 ${
//                       focusedInput ===
//                       'password'
//                         ? 'text-white'
//                         : 'text-white/40'
//                     }`}
//                   />


//                   <Input
//                     type={
//                       showPassword
//                         ? 'text'
//                         : 'password'
//                     }
//                     placeholder="Password"
//                     value={
//                       password
//                     }
//                     onChange={(
//                       e
//                     ) => {
//                       setPassword(
//                         e.target.value
//                       );

//                       setError('');
//                     }}
//                     onFocus={() =>
//                       setFocusedInput(
//                         'password'
//                       )
//                     }
//                     onBlur={() =>
//                       setFocusedInput(
//                         null
//                       )
//                     }
//                     autoComplete="current-password"
//                     disabled={
//                       isLoading
//                     }
//                     className="h-10 w-full border-transparent bg-white/5 pl-10 pr-10 text-white placeholder:text-white/30 transition-all duration-300 focus:border-white/20 focus:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
//                   />


//                   {/* PASSWORD TOGGLE */}

//                   <button
//                     type="button"
//                     disabled={
//                       isLoading
//                     }
//                     onClick={() =>
//                       setShowPassword(
//                         !showPassword
//                       )
//                     }
//                     className="absolute right-3 cursor-pointer p-1 disabled:cursor-not-allowed disabled:opacity-50"
//                     aria-label={
//                       showPassword
//                         ? 'Hide password'
//                         : 'Show password'
//                     }
//                   >

//                     {showPassword ? (
//                       <Eye
//                         className="h-4 w-4 text-white/40 transition-colors duration-300 hover:text-white"
//                       />
//                     ) : (
//                       <EyeClosed
//                         className="h-4 w-4 text-white/40 transition-colors duration-300 hover:text-white"
//                       />
//                     )}

//                   </button>

//                 </div>

//               </motion.div>


//               {/* =================================================
//                   REMEMBER / FORGOT PASSWORD
//               ================================================== */}

//               <div className="flex items-center justify-between pt-1">


//                 {/* REMEMBER ME */}

//                 <button
//                   type="button"
//                   disabled={
//                     isLoading
//                   }
//                   onClick={() =>
//                     setRememberMe(
//                       !rememberMe
//                     )
//                   }
//                   className="flex items-center gap-2 text-xs text-white/60 transition-colors hover:text-white/80 disabled:cursor-not-allowed disabled:opacity-50"
//                 >

//                   <span
//                     className={`relative flex h-4 w-4 items-center justify-center rounded border transition-all ${
//                       rememberMe
//                         ? 'border-white bg-white'
//                         : 'border-white/20 bg-white/5'
//                     }`}
//                   >

//                     {rememberMe && (
//                       <motion.svg
//                         initial={{
//                           opacity: 0,
//                           scale: 0.5,
//                         }}
//                         animate={{
//                           opacity: 1,
//                           scale: 1,
//                         }}
//                         xmlns="http://www.w3.org/2000/svg"
//                         width="12"
//                         height="12"
//                         viewBox="0 0 24 24"
//                         fill="none"
//                         stroke="currentColor"
//                         strokeWidth="3"
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         className="text-black"
//                       >
//                         <polyline points="20 6 9 17 4 12" />
//                       </motion.svg>
//                     )}

//                   </span>

//                   Remember me

//                 </button>


//                 {/* =================================================
//                     FORGOT PASSWORD - FIXED
//                 ================================================== */}

//                 <Link
//                   to="/forgotpassword"
//                   className="text-xs text-white/60 transition-colors duration-200 hover:text-white"
//                 >
//                   Forgot password?
//                 </Link>

//               </div>


//               {/* =================================================
//                   SIGN IN BUTTON
//               ================================================== */}

//               <motion.button
//                 whileHover={{
//                   scale:
//                     isLoading
//                       ? 1
//                       : 1.02,
//                 }}
//                 whileTap={{
//                   scale:
//                     isLoading
//                       ? 1
//                       : 0.98,
//                 }}
//                 type="submit"
//                 disabled={
//                   isLoading
//                 }
//                 className="group/button relative mt-5 w-full disabled:cursor-not-allowed"
//               >

//                 <div className="absolute inset-0 rounded-lg bg-white/10 opacity-0 blur-lg transition-opacity duration-300 group-hover/button:opacity-70" />


//                 <div className="relative flex h-10 items-center justify-center overflow-hidden rounded-lg bg-white font-medium text-black transition-all duration-300 disabled:opacity-60">


//                   {/* LOADING SHINE */}

//                   <motion.div
//                     className="absolute inset-0 bg-gradient-to-r from-white/0 via-black/10 to-white/0"
//                     animate={{
//                       x: [
//                         '-100%',
//                         '100%',
//                       ],
//                     }}
//                     transition={{
//                       duration: 1.5,
//                       ease:
//                         'easeInOut',
//                       repeat:
//                         Infinity,
//                       repeatDelay:
//                         1,
//                     }}
//                     style={{
//                       opacity:
//                         isLoading
//                           ? 1
//                           : 0,
//                       transition:
//                         'opacity 0.3s ease',
//                     }}
//                   />


//                   <AnimatePresence mode="wait">

//                     {isLoading ? (
//                       <motion.div
//                         key="loading"
//                         initial={{
//                           opacity: 0,
//                         }}
//                         animate={{
//                           opacity: 1,
//                         }}
//                         exit={{
//                           opacity: 0,
//                         }}
//                         className="flex items-center justify-center gap-2"
//                       >

//                         <div className="h-4 w-4 animate-spin rounded-full border-2 border-black/70 border-t-transparent" />

//                         <span className="text-sm">
//                           Signing In...
//                         </span>

//                       </motion.div>

//                     ) : (

//                       <motion.span
//                         key="button-text"
//                         initial={{
//                           opacity: 0,
//                         }}
//                         animate={{
//                           opacity: 1,
//                         }}
//                         exit={{
//                           opacity: 0,
//                         }}
//                         className="flex items-center justify-center gap-1 text-sm font-medium"
//                       >

//                         Sign In

//                         <ArrowRight
//                           className="h-3 w-3 transition-transform duration-300 group-hover/button:translate-x-1"
//                         />

//                       </motion.span>
//                     )}

//                   </AnimatePresence>

//                 </div>

//               </motion.button>


//               {/* =================================================
//                   SIGN UP
//               ================================================== */}

//               <motion.p
//                 className="mt-4 text-center text-xs text-white/60"
//                 initial={{
//                   opacity: 0,
//                 }}
//                 animate={{
//                   opacity: 1,
//                 }}
//                 transition={{
//                   delay: 0.5,
//                 }}
//               >

//                 Don't have an account?{' '}

//                 <Link
//                   to="/signup"
//                   className="group/signup relative inline-block"
//                 >

//                   <span className="relative z-10 font-medium text-white transition-colors duration-300 group-hover/signup:text-white/70">
//                     Sign up
//                   </span>

//                   <span className="absolute bottom-0 left-0 h-[1px] w-0 bg-white transition-all duration-300 group-hover/signup:w-full" />

//                 </Link>

//               </motion.p>

//             </form>

//           </div>

//         </motion.div>

//       </motion.div>


//       {/* =================================================
//           ACCOUNT SETUP POPUP
//       ================================================== */}

//       <AnimatePresence>
//         {showSetupPopup && (
//           <motion.div
//             className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 px-4 backdrop-blur-md"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//           >
//             <motion.div
//               initial={{
//                 opacity: 0,
//                 scale: 0.92,
//                 y: 24,
//               }}
//               animate={{
//                 opacity: 1,
//                 scale: 1,
//                 y: 0,
//               }}
//               exit={{
//                 opacity: 0,
//                 scale: 0.95,
//                 y: 12,
//               }}
//               transition={{
//                 type: 'spring',
//                 stiffness: 280,
//                 damping: 24,
//               }}
//               className="relative w-full max-w-md overflow-hidden rounded-2xl border border-purple-400/20 bg-[#0b0710] shadow-2xl"
//             >
//               <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-purple-500/20 to-transparent" />

//               <button
//                 type="button"
//                 onClick={() => {
//                   setShowSetupPopup(false);
//                   navigate(
//                     '/newdashboard',
//                     { replace: true }
//                   );
//                 }}
//                 className="absolute right-4 top-4 z-20 rounded-full border border-white/10 bg-white/5 p-2 text-white/50 transition hover:bg-white/10 hover:text-white"
//                 aria-label="Close"
//               >
//                 <X className="h-4 w-4" />
//               </button>

//               <div className="relative p-6 sm:p-7">
//                 <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-purple-400/20 bg-purple-500/10">
//                   <UserRound className="h-6 w-6 text-purple-300" />
//                 </div>

//                 <h2 className="text-xl font-semibold text-white sm:text-2xl">
//                   Complete Your Account Setup
//                 </h2>

//                 <p className="mt-2 text-sm leading-6 text-white/55">
//                   Welcome to AdsPromoHub. Please complete your account details
//                   to keep your profile ready for platform activities.
//                 </p>

//                 <div className="mt-6 space-y-3">
//                   <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] p-4">
//                     <div className="flex items-center gap-3">
//                       <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5">
//                         <UserRound className="h-4 w-4 text-white/70" />
//                       </div>

//                       <div>
//                         <p className="text-sm font-medium text-white">
//                           Personal Profile
//                         </p>
//                         <p className="mt-0.5 text-xs text-white/40">
//                           Name, gender and address
//                         </p>
//                       </div>
//                     </div>

//                     {setupStatus.profileComplete ? (
//                       <div className="flex items-center gap-1.5 text-xs font-medium text-green-400">
//                         <CheckCircle2 className="h-4 w-4" />
//                         Completed
//                       </div>
//                     ) : (
//                       <div className="flex items-center gap-1.5 text-xs font-medium text-amber-400">
//                         <AlertCircle className="h-4 w-4" />
//                         Pending
//                       </div>
//                     )}
//                   </div>

//                   <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] p-4">
//                     <div className="flex items-center gap-3">
//                       <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5">
//                         <Wallet className="h-4 w-4 text-white/70" />
//                       </div>

//                       <div>
//                         <p className="text-sm font-medium text-white">
//                           BEP20 Wallet Address
//                         </p>
//                         <p className="mt-0.5 text-xs text-white/40">
//                           Add your withdrawal wallet
//                         </p>
//                       </div>
//                     </div>

//                     {setupStatus.bep20Complete ? (
//                       <div className="flex items-center gap-1.5 text-xs font-medium text-green-400">
//                         <CheckCircle2 className="h-4 w-4" />
//                         Completed
//                       </div>
//                     ) : (
//                       <div className="flex items-center gap-1.5 text-xs font-medium text-amber-400">
//                         <AlertCircle className="h-4 w-4" />
//                         Pending
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
//                   <button
//                     type="button"
//                     onClick={() => {
//                       setShowSetupPopup(false);

//                       // Change this route only if your Profile page
//                       // uses a different route in App.tsx.
//                       navigate('/update-profile');
//                     }}
//                     className="flex h-11 items-center justify-center gap-2 rounded-xl bg-white px-4 text-sm font-semibold text-black transition hover:bg-white/90"
//                   >
//                     Complete Profile
//                     <ArrowRight className="h-4 w-4" />
//                   </button>

//                   <button
//                     type="button"
//                     onClick={() => {
//                       setShowSetupPopup(false);
//                       navigate(
//                         '/newdashboard',
//                         { replace: true }
//                       );
//                     }}
//                     className="h-11 rounded-xl border border-white/10 bg-white/5 px-4 text-sm font-medium text-white/70 transition hover:bg-white/10 hover:text-white"
//                   >
//                     Maybe Later
//                   </button>
//                 </div>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//     </div>
//   );
// }


// export default SignIn;















=======
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
'use client';

import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
} from 'framer-motion';

import {
  Mail,
  Lock,
  Eye,
  EyeClosed,
  ArrowRight,
  UserRound,
  Wallet,
  CheckCircle2,
  AlertCircle,
  X,
} from 'lucide-react';

import { cn } from '../../lib/utils';


// =====================================================
// API URL
// =====================================================

const API_URL =
  import.meta.env.VITE_API_URL ||
  'http://127.0.0.1:8000';


// =====================================================
// INPUT COMPONENT
// =====================================================

function Input({
  className,
  type,
  ...props
}: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
        'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 dark:aria-invalid:border-destructive',
        className
      )}
      {...props}
    />
  );
}


// =====================================================
// ACCOUNT SETUP TYPES
// =====================================================

type AccountSetupStatus = {
  profileComplete: boolean;
  bep20Complete: boolean;
};


// =====================================================
// SIGN IN
// =====================================================

export function SignIn() {
  const navigate = useNavigate();


  // ===================================================
  // STATES
  // ===================================================

  const [showPassword, setShowPassword] =
    useState(false);

  const [email, setEmail] =
    useState('');

  const [password, setPassword] =
    useState('');

  const [isLoading, setIsLoading] =
    useState(false);

  const [error, setError] =
    useState('');

  const [success, setSuccess] =
    useState('');

  const [focusedInput, setFocusedInput] =
    useState<
      'email' | 'password' | null
    >(null);

  const [rememberMe, setRememberMe] =
    useState(false);

  const [showSetupPopup, setShowSetupPopup] =
    useState(false);

  const [setupStatus, setSetupStatus] =
    useState<AccountSetupStatus>({
      profileComplete: false,
      bep20Complete: false,
    });


  // ===================================================
  // CHECK ALREADY LOGGED IN
  // ===================================================

  useEffect(() => {
    const token =
      localStorage.getItem(
        'access_token'
      );

    const savedUser =
      localStorage.getItem(
        'user'
      );


    if (
      !token ||
      !savedUser
    ) {
      return;
    }


    try {
      const user =
        JSON.parse(
          savedUser
        );


      // ADMIN

      if (
        user.is_admin === true
      ) {
        navigate(
          '/admin',
          {
            replace: true,
          }
        );

        return;
      }


      // NORMAL USER

      navigate(
        '/newdashboard',
        {
          replace: true,
        }
      );

    } catch (err) {

      console.error(
        'Failed to read saved user:',
        err
      );


      // INVALID SAVED DATA

      localStorage.removeItem(
        'access_token'
      );

      localStorage.removeItem(
        'refresh_token'
      );

      localStorage.removeItem(
        'user'
      );
    }

  }, [navigate]);


  // ===================================================
  // LOAD REMEMBER ME
  // ===================================================

  useEffect(() => {
    const savedRememberMe =
      localStorage.getItem(
        'rememberMe'
      );

    if (
      savedRememberMe === 'true'
    ) {
      setRememberMe(true);
    }
  }, []);


  // ===================================================
  // 3D CARD EFFECT
  // ===================================================

  const mouseX =
    useMotionValue(0);

  const mouseY =
    useMotionValue(0);

  const rotateX =
    useTransform(
      mouseY,
      [-300, 300],
      [10, -10]
    );

  const rotateY =
    useTransform(
      mouseX,
      [-300, 300],
      [-10, 10]
    );


  // ===================================================
  // MOUSE MOVE
  // ===================================================

  const handleMouseMove = (
    e: React.MouseEvent<HTMLDivElement>
  ) => {
    const rect =
      e.currentTarget
        .getBoundingClientRect();

    mouseX.set(
      e.clientX -
        rect.left -
        rect.width / 2
    );

    mouseY.set(
      e.clientY -
        rect.top -
        rect.height / 2
    );
  };


  // ===================================================
  // MOUSE LEAVE
  // ===================================================

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };


  // ===================================================
  // CHECK ACCOUNT SETUP
  // ===================================================

  const checkAccountSetup = async (
    accessToken: string
  ): Promise<AccountSetupStatus | null> => {
    try {
      const profileResponse =
        await axios.get(
          `${API_URL}/api/profile`,
          {
            headers: {
              Authorization:
                `Bearer ${accessToken}`,
            },
          }
        );

      const profile =
        profileResponse.data?.user;

      if (!profile) {
        return null;
      }

      const profileComplete =
        Boolean(
          profile.first_name?.trim()
        ) &&
        Boolean(
          profile.last_name?.trim()
        ) &&
        Boolean(
          profile.gender?.trim()
        ) &&
        Boolean(
          profile.address?.trim()
        );

      const bep20Complete =
        profile.bep20_is_set === true ||
        Boolean(
          profile.bep20_address?.trim()
        );

      return {
        profileComplete,
        bep20Complete,
      };

    } catch (profileError) {
      console.error(
        'Unable to check profile completion:',
        profileError
      );

      return null;
    }
  };


  // ===================================================
  // SIGN IN SUBMIT
  // ===================================================

  const handleSubmit = async (
    event:
      React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();


    // RESET MESSAGES

    setError('');
    setSuccess('');


    // =================================================
    // CLEAN LOGIN
    // =================================================

    const cleanLogin =
      email.trim();


    // =================================================
    // VALIDATION
    // =================================================

    if (!cleanLogin) {
      setError(
        'Please enter your email or Customer ID.'
      );

      return;
    }


    if (!password) {
      setError(
        'Please enter your password.'
      );

      return;
    }


    try {

      setIsLoading(true);


      // =================================================
      // AXIOS LOGIN REQUEST
      // =================================================

      const response =
        await axios.post(
          `${API_URL}/api/auth/signin`,

          {
            login:
              cleanLogin,

            password:
              password,

            remember_me:
              rememberMe,
          },

          {
            headers: {
              'Content-Type':
                'application/json',
            },
          }
        );


      // =================================================
      // RESPONSE
      // =================================================

      const data =
        response.data;


      console.log(
        'Signin API Response:',
        data
      );


      // =================================================
      // VERIFY RESPONSE
      // =================================================

      if (
        !data?.access_token
      ) {
        throw new Error(
          'Login successful but access token is missing.'
        );
      }


      if (
        !data?.refresh_token
      ) {
        throw new Error(
          'Login successful but refresh token is missing.'
        );
      }


      if (
        !data?.user_id
      ) {
        throw new Error(
          'Login successful but user information is missing.'
        );
      }


      if (
        !data?.customer_id
      ) {
        throw new Error(
          'Login successful but Customer ID is missing.'
        );
      }


      if (
        !data?.referral_code
      ) {
        throw new Error(
          'Login successful but referral code is missing.'
        );
      }


      // =================================================
      // CREATE USER DATA
      // =================================================

      const userData = {

        user_id:
          data.user_id,

        customer_id:
          data.customer_id,

        referral_code:
          String(
            data.referral_code
          ).trim(),

        full_name:
          data.full_name,

        email:
          data.email,

        role:
          data.role,

        is_admin:
          data.is_admin === true,

        is_active:
          true,
      };


      // =================================================
      // SAVE ACCESS TOKEN
      // =================================================

      localStorage.setItem(
        'access_token',
        data.access_token
      );


      // =================================================
      // SAVE REFRESH TOKEN
      // =================================================

      localStorage.setItem(
        'refresh_token',
        data.refresh_token
      );


      // =================================================
      // SAVE USER
      // =================================================

      localStorage.setItem(
        'user',
        JSON.stringify(
          userData
        )
      );


      // =================================================
      // REMEMBER ME
      // =================================================

      if (rememberMe) {

        localStorage.setItem(
          'rememberMe',
          'true'
        );

      } else {

        localStorage.removeItem(
          'rememberMe'
        );
      }


      // =================================================
      // DEBUG
      // =================================================

      console.log(
        'Logged In User:',
        userData
      );

      console.log(
        'Customer ID:',
        data.customer_id
      );

      console.log(
        'Role:',
        data.role
      );

      console.log(
        'Is Admin:',
        data.is_admin
      );


      // =================================================
      // SUCCESS / ACCOUNT SETUP CHECK
      // =================================================

      setError('');


      // ADMIN DOES NOT NEED USER SETUP POPUP

      if (
        data.is_admin === true
      ) {
        setSuccess(
          'Admin login successful! Redirecting to Admin Dashboard...'
        );

        window.setTimeout(
          () => {
            navigate(
              '/admin',
              {
                replace: true,
              }
            );
          },
          900
        );

        return;
      }


      // NORMAL USER - CHECK ACTUAL PROFILE FROM BACKEND

      setSuccess(
        'Login successful! Checking your account setup...'
      );

      const currentSetupStatus =
        await checkAccountSetup(
          data.access_token
        );


      // If profile status could not be loaded,
      // do not block login.

      if (!currentSetupStatus) {
        setSuccess(
          'Login successful! Redirecting to your dashboard...'
        );

        window.setTimeout(
          () => {
            navigate(
              '/newdashboard',
              {
                replace: true,
              }
            );
          },
          900
        );

        return;
      }


      setSetupStatus(
        currentSetupStatus
      );


      const accountSetupComplete =
        currentSetupStatus.profileComplete &&
        currentSetupStatus.bep20Complete;


      if (accountSetupComplete) {
        setSuccess(
          'Login successful! Redirecting to your dashboard...'
        );

        window.setTimeout(
          () => {
            navigate(
              '/newdashboard',
              {
                replace: true,
              }
            );
          },
          900
        );

        return;
      }


      // SOMETHING IS PENDING - SHOW POPUP

      setSuccess('');
      setShowSetupPopup(true);

    } catch (
      err: unknown
    ) {

      console.error(
        'Signin Error:',
        err
      );


      // =================================================
      // AXIOS ERRORS
      // =================================================

      if (
        axios.isAxiosError(err)
      ) {

        const detail =
          err.response
            ?.data
            ?.detail;


        // BACKEND NORMAL ERROR

        if (
          typeof detail ===
          'string'
        ) {

          setError(
            detail
          );

          return;
        }


        // FASTAPI VALIDATION ERROR

        if (
          Array.isArray(
            detail
          )
        ) {

          const validationMessage =
            detail
              .map(
                (
                  item: any
                ) =>
                  item?.msg
              )
              .filter(
                Boolean
              )
              .join(
                ', '
              );


          setError(
            validationMessage ||
              'Unable to sign in.'
          );

          return;
        }


        // BACKEND NOT AVAILABLE

        if (
          !err.response
        ) {

          setError(
            'Unable to connect to server. Please try again.'
          );

          return;
        }


        setError(
          'Unable to sign in. Please try again.'
        );

        return;
      }


      // =================================================
      // NORMAL JS ERROR
      // =================================================

      if (
        err instanceof Error
      ) {

        setError(
          err.message
        );

        return;
      }


      setError(
        'Something went wrong. Please try again.'
      );

    } finally {

      setIsLoading(false);
    }
  };


  // ===================================================
  // UI
  // ===================================================

  return (
    <div className="relative flex min-h-screen w-screen items-center justify-center overflow-hidden bg-black">

      {/* =================================================
          BACKGROUND
      ================================================== */}

<<<<<<< HEAD
      <div className="absolute inset-0 bg-gradient-to-b from-[#B76E79]/40 via-[#8F4F5A]/50 to-black" />
=======
      <div className="absolute inset-0 bg-gradient-to-b from-purple-500/40 via-purple-700/50 to-black" />
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d


      {/* =================================================
          NOISE
      ================================================== */}

      <div
        className="absolute inset-0 opacity-[0.03] mix-blend-soft-light"
        style={{
          backgroundImage:
            `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundSize:
            '200px 200px',
        }}
      />


      {/* =================================================
          TOP GLOW
      ================================================== */}

<<<<<<< HEAD
      <div className="absolute top-0 left-1/2 h-[60vh] w-[120vh] -translate-x-1/2 rounded-b-[50%] bg-[#B76E79]/20 blur-[80px]" />


      <motion.div
        className="absolute top-0 left-1/2 h-[60vh] w-[100vh] -translate-x-1/2 rounded-b-full bg-[#D99AA3]/20 blur-[60px]"
=======
      <div className="absolute top-0 left-1/2 h-[60vh] w-[120vh] -translate-x-1/2 rounded-b-[50%] bg-purple-400/20 blur-[80px]" />


      <motion.div
        className="absolute top-0 left-1/2 h-[60vh] w-[100vh] -translate-x-1/2 rounded-b-full bg-purple-300/20 blur-[60px]"
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
        animate={{
          opacity: [
            0.15,
            0.3,
            0.15,
          ],
          scale: [
            0.98,
            1.02,
            0.98,
          ],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType:
            'mirror',
        }}
      />


      <motion.div
<<<<<<< HEAD
        className="absolute bottom-0 left-1/2 h-[90vh] w-[90vh] -translate-x-1/2 rounded-t-full bg-[#B76E79]/20 blur-[60px]"
=======
        className="absolute bottom-0 left-1/2 h-[90vh] w-[90vh] -translate-x-1/2 rounded-t-full bg-purple-400/20 blur-[60px]"
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
        animate={{
          opacity: [
            0.3,
            0.5,
            0.3,
          ],
          scale: [
            1,
            1.1,
            1,
          ],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          repeatType:
            'mirror',
          delay: 1,
        }}
      />


      {/* =================================================
          GLOW SPOTS
      ================================================== */}

      <div className="absolute top-1/4 left-1/4 h-96 w-96 animate-pulse rounded-full bg-white/5 opacity-40 blur-[100px]" />

      <div className="absolute right-1/4 bottom-1/4 h-96 w-96 animate-pulse rounded-full bg-white/5 opacity-40 blur-[100px] delay-1000" />


      {/* =================================================
          MAIN CARD
      ================================================== */}

      <motion.div
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.6,
        }}
        style={{
          rotateX,
          rotateY,
          transformPerspective:
            1000,
        }}
        onMouseMove={
          handleMouseMove
        }
        onMouseLeave={
          handleMouseLeave
        }
        className="relative w-full max-w-md px-4"
      >

        {/* CARD GLOW */}

<<<<<<< HEAD
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#B76E79]/30 via-white/10 to-[#B76E79]/30 opacity-60 blur-xl" />
=======
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-purple-500/30 via-white/10 to-purple-500/30 opacity-60 blur-xl" />
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d


        {/* CARD */}

        <motion.div
          className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/40 shadow-2xl backdrop-blur-xl"
          initial={{
            scale: 0.95,
          }}
          animate={{
            scale: 1,
          }}
          transition={{
            duration: 0.5,
          }}
        >

          {/* CARD CONTENT */}

          <div className="p-7 sm:p-8">


            {/* =================================================
                HEADER
            ================================================== */}

            <motion.div
              className="mb-7 text-center"
              initial={{
                opacity: 0,
                y: -10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.15,
              }}
            >

              <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                Welcome Back
              </h1>

              <p className="mt-2 text-sm text-white/40">
                Sign in to your Ads Promo Hub account
              </p>

            </motion.div>


            {/* =================================================
                ERROR
            ================================================== */}

            <AnimatePresence>

              {error && (
                <motion.div
                  initial={{
                    opacity: 0,
                    y: -10,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    y: -10,
                  }}
                  className="mb-4 rounded-lg border border-red-400/20 bg-red-500/10 px-4 py-3 text-xs text-red-300"
                >
                  {error}
                </motion.div>
              )}

            </AnimatePresence>


            {/* =================================================
                SUCCESS
            ================================================== */}

            <AnimatePresence>

              {success && (
                <motion.div
                  initial={{
                    opacity: 0,
                    y: -10,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    y: -10,
                  }}
                  className="mb-4 rounded-lg border border-green-400/20 bg-green-500/10 px-4 py-3 text-xs text-green-300"
                >
                  {success}
                </motion.div>
              )}

            </AnimatePresence>


            {/* =================================================
                FORM
            ================================================== */}

            <form
              onSubmit={
                handleSubmit
              }
              className="space-y-4"
            >


              {/* =================================================
                  EMAIL / CUSTOMER ID
              ================================================== */}

              <motion.div
                className={`relative ${
                  focusedInput ===
                  'email'
                    ? 'z-10'
                    : ''
                }`}
                whileHover={{
                  scale: 1.01,
                }}
                transition={{
                  type:
                    'spring',
                  stiffness: 400,
                  damping: 25,
                }}
              >

                <div className="absolute -inset-[0.5px] rounded-lg bg-gradient-to-r from-white/10 via-white/5 to-white/10 opacity-0 transition-all duration-300 group-hover:opacity-100" />


                <div className="relative flex items-center overflow-hidden rounded-lg">

                  <Mail
                    className={`absolute left-3 h-4 w-4 transition-all duration-300 ${
                      focusedInput ===
                      'email'
<<<<<<< HEAD
                        ? 'text-[#D99AA3]'
=======
                        ? 'text-white'
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                        : 'text-white/40'
                    }`}
                  />


                  <Input
                    type="text"
                    placeholder="Email address or Customer ID"
                    value={
                      email
                    }
                    onChange={(
                      e
                    ) => {
                      setEmail(
                        e.target.value
                      );

                      setError('');
                    }}
                    onFocus={() =>
                      setFocusedInput(
                        'email'
                      )
                    }
                    onBlur={() =>
                      setFocusedInput(
                        null
                      )
                    }
                    autoComplete="username"
                    disabled={
                      isLoading
                    }
<<<<<<< HEAD
                    className="h-10 w-full border-transparent bg-white/5 pl-10 pr-3 text-white placeholder:text-white/30 transition-all duration-300 focus:border-[#B76E79]/60 focus:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
=======
                    className="h-10 w-full border-transparent bg-white/5 pl-10 pr-3 text-white placeholder:text-white/30 transition-all duration-300 focus:border-white/20 focus:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                  />

                </div>

              </motion.div>


              {/* =================================================
                  PASSWORD
              ================================================== */}

              <motion.div
                className={`relative ${
                  focusedInput ===
                  'password'
                    ? 'z-10'
                    : ''
                }`}
                whileHover={{
                  scale: 1.01,
                }}
                transition={{
                  type:
                    'spring',
                  stiffness: 400,
                  damping: 25,
                }}
              >

                <div className="absolute -inset-[0.5px] rounded-lg bg-gradient-to-r from-white/10 via-white/5 to-white/10 opacity-0 transition-all duration-300 group-hover:opacity-100" />


                <div className="relative flex items-center overflow-hidden rounded-lg">

                  <Lock
                    className={`absolute left-3 h-4 w-4 transition-all duration-300 ${
                      focusedInput ===
                      'password'
<<<<<<< HEAD
                        ? 'text-[#D99AA3]'
=======
                        ? 'text-white'
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                        : 'text-white/40'
                    }`}
                  />


                  <Input
                    type={
                      showPassword
                        ? 'text'
                        : 'password'
                    }
                    placeholder="Password"
                    value={
                      password
                    }
                    onChange={(
                      e
                    ) => {
                      setPassword(
                        e.target.value
                      );

                      setError('');
                    }}
                    onFocus={() =>
                      setFocusedInput(
                        'password'
                      )
                    }
                    onBlur={() =>
                      setFocusedInput(
                        null
                      )
                    }
                    autoComplete="current-password"
                    disabled={
                      isLoading
                    }
<<<<<<< HEAD
                    className="h-10 w-full border-transparent bg-white/5 pl-10 pr-10 text-white placeholder:text-white/30 transition-all duration-300 focus:border-[#B76E79]/60 focus:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
=======
                    className="h-10 w-full border-transparent bg-white/5 pl-10 pr-10 text-white placeholder:text-white/30 transition-all duration-300 focus:border-white/20 focus:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                  />


                  {/* PASSWORD TOGGLE */}

                  <button
                    type="button"
                    disabled={
                      isLoading
                    }
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                    className="absolute right-3 cursor-pointer p-1 disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label={
                      showPassword
                        ? 'Hide password'
                        : 'Show password'
                    }
                  >

                    {showPassword ? (
                      <Eye
<<<<<<< HEAD
                        className="h-4 w-4 text-white/40 transition-colors duration-300 hover:text-[#D99AA3]"
                      />
                    ) : (
                      <EyeClosed
                        className="h-4 w-4 text-white/40 transition-colors duration-300 hover:text-[#D99AA3]"
=======
                        className="h-4 w-4 text-white/40 transition-colors duration-300 hover:text-white"
                      />
                    ) : (
                      <EyeClosed
                        className="h-4 w-4 text-white/40 transition-colors duration-300 hover:text-white"
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                      />
                    )}

                  </button>

                </div>

              </motion.div>


              {/* =================================================
                  REMEMBER / FORGOT PASSWORD
              ================================================== */}

              <div className="flex items-center justify-between pt-1">


                {/* REMEMBER ME */}

                <button
                  type="button"
                  disabled={
                    isLoading
                  }
                  onClick={() =>
                    setRememberMe(
                      !rememberMe
                    )
                  }
                  className="flex items-center gap-2 text-xs text-white/60 transition-colors hover:text-white/80 disabled:cursor-not-allowed disabled:opacity-50"
                >

                  <span
                    className={`relative flex h-4 w-4 items-center justify-center rounded border transition-all ${
                      rememberMe
                        ? 'border-white bg-white'
                        : 'border-white/20 bg-white/5'
                    }`}
                  >

                    {rememberMe && (
                      <motion.svg
                        initial={{
                          opacity: 0,
                          scale: 0.5,
                        }}
                        animate={{
                          opacity: 1,
                          scale: 1,
                        }}
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-black"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </motion.svg>
                    )}

                  </span>

                  Remember me

                </button>


                {/* =================================================
                    FORGOT PASSWORD - FIXED
                ================================================== */}

                <Link
                  to="/forgotpassword"
<<<<<<< HEAD
                  className="text-xs text-white/60 transition-colors duration-200 hover:text-[#D99AA3]"
=======
                  className="text-xs text-white/60 transition-colors duration-200 hover:text-white"
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                >
                  Forgot password?
                </Link>

              </div>


              {/* =================================================
                  SIGN IN BUTTON
              ================================================== */}

              <motion.button
                whileHover={{
                  scale:
                    isLoading
                      ? 1
                      : 1.02,
                }}
                whileTap={{
                  scale:
                    isLoading
                      ? 1
                      : 0.98,
                }}
                type="submit"
                disabled={
                  isLoading
                }
                className="group/button relative mt-5 w-full disabled:cursor-not-allowed"
              >

<<<<<<< HEAD
                <div className="absolute inset-0 rounded-lg bg-[#B76E79]/30 opacity-0 blur-lg transition-opacity duration-300 group-hover/button:opacity-70" />


                <div className="relative flex h-10 items-center justify-center overflow-hidden rounded-lg bg-[#B76E79] font-medium text-white transition-all duration-300 disabled:opacity-60">
=======
                <div className="absolute inset-0 rounded-lg bg-white/10 opacity-0 blur-lg transition-opacity duration-300 group-hover/button:opacity-70" />


                <div className="relative flex h-10 items-center justify-center overflow-hidden rounded-lg bg-white font-medium text-black transition-all duration-300 disabled:opacity-60">
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d


                  {/* LOADING SHINE */}

                  <motion.div
<<<<<<< HEAD
                    className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
=======
                    className="absolute inset-0 bg-gradient-to-r from-white/0 via-black/10 to-white/0"
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                    animate={{
                      x: [
                        '-100%',
                        '100%',
                      ],
                    }}
                    transition={{
                      duration: 1.5,
                      ease:
                        'easeInOut',
                      repeat:
                        Infinity,
                      repeatDelay:
                        1,
                    }}
                    style={{
                      opacity:
                        isLoading
                          ? 1
                          : 0,
                      transition:
                        'opacity 0.3s ease',
                    }}
                  />


                  <AnimatePresence mode="wait">

                    {isLoading ? (
                      <motion.div
                        key="loading"
                        initial={{
                          opacity: 0,
                        }}
                        animate={{
                          opacity: 1,
                        }}
                        exit={{
                          opacity: 0,
                        }}
                        className="flex items-center justify-center gap-2"
                      >

<<<<<<< HEAD
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/80 border-t-transparent" />
=======
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-black/70 border-t-transparent" />
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

                        <span className="text-sm">
                          Signing In...
                        </span>

                      </motion.div>

                    ) : (

                      <motion.span
                        key="button-text"
                        initial={{
                          opacity: 0,
                        }}
                        animate={{
                          opacity: 1,
                        }}
                        exit={{
                          opacity: 0,
                        }}
                        className="flex items-center justify-center gap-1 text-sm font-medium"
                      >

                        Sign In

                        <ArrowRight
                          className="h-3 w-3 transition-transform duration-300 group-hover/button:translate-x-1"
                        />

                      </motion.span>
<<<<<<< HEAD

=======
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                    )}

                  </AnimatePresence>

                </div>

              </motion.button>


              {/* =================================================
                  SIGN UP
              ================================================== */}

              <motion.p
                className="mt-4 text-center text-xs text-white/60"
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
                transition={{
                  delay: 0.5,
                }}
              >

                Don't have an account?{' '}

                <Link
                  to="/signup"
                  className="group/signup relative inline-block"
                >

<<<<<<< HEAD
                  <span className="relative z-10 font-medium text-[#D99AA3] transition-colors duration-300 group-hover/signup:text-white">
                    Sign up
                  </span>

                  <span className="absolute bottom-0 left-0 h-[1px] w-0 bg-[#B76E79] transition-all duration-300 group-hover/signup:w-full" />
=======
                  <span className="relative z-10 font-medium text-white transition-colors duration-300 group-hover/signup:text-white/70">
                    Sign up
                  </span>

                  <span className="absolute bottom-0 left-0 h-[1px] w-0 bg-white transition-all duration-300 group-hover/signup:w-full" />
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

                </Link>

              </motion.p>

            </form>

          </div>

        </motion.div>

      </motion.div>


      {/* =================================================
          ACCOUNT SETUP POPUP
      ================================================== */}

      <AnimatePresence>
<<<<<<< HEAD

        {showSetupPopup && (

=======
        {showSetupPopup && (
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 px-4 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
<<<<<<< HEAD

=======
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.92,
                y: 24,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.95,
                y: 12,
              }}
              transition={{
                type: 'spring',
                stiffness: 280,
                damping: 24,
              }}
<<<<<<< HEAD
              className="relative w-full max-w-md overflow-hidden rounded-2xl border border-[#B76E79]/20 bg-[#0b0710] shadow-2xl"
            >

              <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#B76E79]/20 to-transparent" />

=======
              className="relative w-full max-w-md overflow-hidden rounded-2xl border border-purple-400/20 bg-[#0b0710] shadow-2xl"
            >
              <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-purple-500/20 to-transparent" />
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

              <button
                type="button"
                onClick={() => {
                  setShowSetupPopup(false);
                  navigate(
                    '/newdashboard',
                    { replace: true }
                  );
                }}
                className="absolute right-4 top-4 z-20 rounded-full border border-white/10 bg-white/5 p-2 text-white/50 transition hover:bg-white/10 hover:text-white"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>

<<<<<<< HEAD

              <div className="relative p-6 sm:p-7">

                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-[#B76E79]/20 bg-[#B76E79]/10">
                  <UserRound className="h-6 w-6 text-[#D99AA3]" />
                </div>


=======
              <div className="relative p-6 sm:p-7">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-purple-400/20 bg-purple-500/10">
                  <UserRound className="h-6 w-6 text-purple-300" />
                </div>

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                <h2 className="text-xl font-semibold text-white sm:text-2xl">
                  Complete Your Account Setup
                </h2>

<<<<<<< HEAD

=======
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                <p className="mt-2 text-sm leading-6 text-white/55">
                  Welcome to AdsPromoHub. Please complete your account details
                  to keep your profile ready for platform activities.
                </p>

<<<<<<< HEAD

                <div className="mt-6 space-y-3">

                  <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] p-4">

                    <div className="flex items-center gap-3">

=======
                <div className="mt-6 space-y-3">
                  <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] p-4">
                    <div className="flex items-center gap-3">
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5">
                        <UserRound className="h-4 w-4 text-white/70" />
                      </div>

                      <div>
<<<<<<< HEAD

                        <p className="text-sm font-medium text-white">
                          Personal Profile
                        </p>

                        <p className="mt-0.5 text-xs text-white/40">
                          Name, gender and address
                        </p>

                      </div>

                    </div>


                    {setupStatus.profileComplete ? (

=======
                        <p className="text-sm font-medium text-white">
                          Personal Profile
                        </p>
                        <p className="mt-0.5 text-xs text-white/40">
                          Name, gender and address
                        </p>
                      </div>
                    </div>

                    {setupStatus.profileComplete ? (
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                      <div className="flex items-center gap-1.5 text-xs font-medium text-green-400">
                        <CheckCircle2 className="h-4 w-4" />
                        Completed
                      </div>
<<<<<<< HEAD

                    ) : (

=======
                    ) : (
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                      <div className="flex items-center gap-1.5 text-xs font-medium text-amber-400">
                        <AlertCircle className="h-4 w-4" />
                        Pending
                      </div>
<<<<<<< HEAD

                    )}

                  </div>


                  <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] p-4">

                    <div className="flex items-center gap-3">

=======
                    )}
                  </div>

                  <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] p-4">
                    <div className="flex items-center gap-3">
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5">
                        <Wallet className="h-4 w-4 text-white/70" />
                      </div>

                      <div>
<<<<<<< HEAD

                        <p className="text-sm font-medium text-white">
                          BEP20 Wallet Address
                        </p>

                        <p className="mt-0.5 text-xs text-white/40">
                          Add your withdrawal wallet
                        </p>

                      </div>

                    </div>


                    {setupStatus.bep20Complete ? (

=======
                        <p className="text-sm font-medium text-white">
                          BEP20 Wallet Address
                        </p>
                        <p className="mt-0.5 text-xs text-white/40">
                          Add your withdrawal wallet
                        </p>
                      </div>
                    </div>

                    {setupStatus.bep20Complete ? (
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                      <div className="flex items-center gap-1.5 text-xs font-medium text-green-400">
                        <CheckCircle2 className="h-4 w-4" />
                        Completed
                      </div>
<<<<<<< HEAD

                    ) : (

=======
                    ) : (
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                      <div className="flex items-center gap-1.5 text-xs font-medium text-amber-400">
                        <AlertCircle className="h-4 w-4" />
                        Pending
                      </div>
<<<<<<< HEAD

                    )}

                  </div>

                </div>


                <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">

=======
                    )}
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                  <button
                    type="button"
                    onClick={() => {
                      setShowSetupPopup(false);

                      // Change this route only if your Profile page
                      // uses a different route in App.tsx.
<<<<<<< HEAD

                      navigate(
                        '/update-profile'
                      );
                    }}
                    className="flex h-11 items-center justify-center gap-2 rounded-xl bg-[#B76E79] px-4 text-sm font-semibold text-white transition hover:bg-[#8F4F5A]"
=======
                      navigate('/update-profile');
                    }}
                    className="flex h-11 items-center justify-center gap-2 rounded-xl bg-white px-4 text-sm font-semibold text-black transition hover:bg-white/90"
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                  >
                    Complete Profile
                    <ArrowRight className="h-4 w-4" />
                  </button>

<<<<<<< HEAD

=======
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                  <button
                    type="button"
                    onClick={() => {
                      setShowSetupPopup(false);
<<<<<<< HEAD

=======
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                      navigate(
                        '/newdashboard',
                        { replace: true }
                      );
                    }}
                    className="h-11 rounded-xl border border-white/10 bg-white/5 px-4 text-sm font-medium text-white/70 transition hover:bg-white/10 hover:text-white"
                  >
                    Maybe Later
                  </button>
<<<<<<< HEAD

                </div>

              </div>

            </motion.div>

          </motion.div>

        )}

=======
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
      </AnimatePresence>

    </div>
  );
}


export default SignIn;