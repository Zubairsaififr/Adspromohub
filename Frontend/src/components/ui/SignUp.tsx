<<<<<<< HEAD
// import React, { useMemo, useState } from 'react';

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
//   User,
//   Phone,
//   Globe,
//   Gift,
//   Check,
// } from 'lucide-react';

// import {
//   getCountryCallingCode,
//   parsePhoneNumberFromString,
//   type CountryCode,
// } from 'libphonenumber-js';

// import { cn } from '../../lib/utils';
// import { Link, useNavigate } from 'react-router-dom';


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
//         'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed md:text-sm',
//         'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
//         className
//       )}
//       {...props}
//     />
//   );
// }


// // =====================================================
// // COUNTRIES
// // =====================================================

// const countries = [
//   'Afghanistan',
//   'Albania',
//   'Algeria',
//   'Andorra',
//   'Angola',
//   'Antigua and Barbuda',
//   'Argentina',
//   'Armenia',
//   'Australia',
//   'Austria',
//   'Azerbaijan',
//   'Bahamas',
//   'Bahrain',
//   'Bangladesh',
//   'Barbados',
//   'Belarus',
//   'Belgium',
//   'Belize',
//   'Benin',
//   'Bhutan',
//   'Bolivia',
//   'Bosnia and Herzegovina',
//   'Botswana',
//   'Brazil',
//   'Brunei',
//   'Bulgaria',
//   'Burkina Faso',
//   'Burundi',
//   'Cabo Verde',
//   'Cambodia',
//   'Cameroon',
//   'Canada',
//   'Central African Republic',
//   'Chad',
//   'Chile',
//   'China',
//   'Colombia',
//   'Comoros',
//   'Congo',
//   'Costa Rica',
//   'Croatia',
//   'Cuba',
//   'Cyprus',
//   'Czech Republic',
//   'Denmark',
//   'Djibouti',
//   'Dominica',
//   'Dominican Republic',
//   'Ecuador',
//   'Egypt',
//   'El Salvador',
//   'Equatorial Guinea',
//   'Eritrea',
//   'Estonia',
//   'Eswatini',
//   'Ethiopia',
//   'Fiji',
//   'Finland',
//   'France',
//   'Gabon',
//   'Gambia',
//   'Georgia',
//   'Germany',
//   'Ghana',
//   'Greece',
//   'Grenada',
//   'Guatemala',
//   'Guinea',
//   'Guinea-Bissau',
//   'Guyana',
//   'Haiti',
//   'Honduras',
//   'Hungary',
//   'Iceland',
//   'India',
//   'Indonesia',
//   'Iran',
//   'Iraq',
//   'Ireland',
//   'Israel',
//   'Italy',
//   'Jamaica',
//   'Japan',
//   'Jordan',
//   'Kazakhstan',
//   'Kenya',
//   'Kiribati',
//   'Kuwait',
//   'Laos',
//   'Latvia',
//   'Lebanon',
//   'Lesotho',
//   'Liberia',
//   'Libya',
//   'Liechtenstein',
//   'Lithuania',
//   'Luxembourg',
//   'Madagascar',
//   'Malawi',
//   'Malaysia',
//   'Maldives',
//   'Mali',
//   'Malta',
//   'Marshall Islands',
//   'Mauritania',
//   'Mauritius',
//   'Mexico',
//   'Micronesia',
//   'Moldova',
//   'Monaco',
//   'Mongolia',
//   'Montenegro',
//   'Morocco',
//   'Mozambique',
//   'Myanmar',
//   'Namibia',
//   'Nauru',
//   'Nepal',
//   'Netherlands',
//   'New Zealand',
//   'Nicaragua',
//   'Niger',
//   'Nigeria',
//   'North Korea',
//   'North Macedonia',
//   'Norway',
//   'Oman',
//   'Pakistan',
//   'Palau',
//   'Palestine',
//   'Panama',
//   'Papua New Guinea',
//   'Paraguay',
//   'Peru',
//   'Philippines',
//   'Poland',
//   'Portugal',
//   'Qatar',
//   'Romania',
//   'Russia',
//   'Rwanda',
//   'Saint Kitts and Nevis',
//   'Saint Lucia',
//   'Saint Vincent and the Grenadines',
//   'Samoa',
//   'San Marino',
//   'Sao Tome and Principe',
//   'Saudi Arabia',
//   'Senegal',
//   'Serbia',
//   'Seychelles',
//   'Sierra Leone',
//   'Singapore',
//   'Slovakia',
//   'Slovenia',
//   'Somalia',
//   'South Africa',
//   'South Korea',
//   'South Sudan',
//   'Spain',
//   'Sri Lanka',
//   'Sudan',
//   'Suriname',
//   'Sweden',
//   'Switzerland',
//   'Syria',
//   'Taiwan',
//   'Tajikistan',
//   'Tanzania',
//   'Thailand',
//   'Timor-Leste',
//   'Togo',
//   'Tonga',
//   'Trinidad and Tobago',
//   'Tunisia',
//   'Turkey',
//   'Turkmenistan',
//   'Tuvalu',
//   'Uganda',
//   'Ukraine',
//   'United Arab Emirates',
//   'United Kingdom',
//   'United States',
//   'Uruguay',
//   'Uzbekistan',
//   'Vanuatu',
//   'Vatican City',
//   'Venezuela',
//   'Vietnam',
//   'Yemen',
//   'Zambia',
//   'Zimbabwe',
// ];


// // =====================================================
// // COUNTRY -> ISO CODE
// // =====================================================

// const countryIsoMap: Record<string, CountryCode> = {
//   Afghanistan: 'AF',
//   Albania: 'AL',
//   Algeria: 'DZ',
//   Andorra: 'AD',
//   Angola: 'AO',
//   'Antigua and Barbuda': 'AG',
//   Argentina: 'AR',
//   Armenia: 'AM',
//   Australia: 'AU',
//   Austria: 'AT',
//   Azerbaijan: 'AZ',
//   Bahamas: 'BS',
//   Bahrain: 'BH',
//   Bangladesh: 'BD',
//   Barbados: 'BB',
//   Belarus: 'BY',
//   Belgium: 'BE',
//   Belize: 'BZ',
//   Benin: 'BJ',
//   Bhutan: 'BT',
//   Bolivia: 'BO',
//   'Bosnia and Herzegovina': 'BA',
//   Botswana: 'BW',
//   Brazil: 'BR',
//   Brunei: 'BN',
//   Bulgaria: 'BG',
//   'Burkina Faso': 'BF',
//   Burundi: 'BI',
//   'Cabo Verde': 'CV',
//   Cambodia: 'KH',
//   Cameroon: 'CM',
//   Canada: 'CA',
//   'Central African Republic': 'CF',
//   Chad: 'TD',
//   Chile: 'CL',
//   China: 'CN',
//   Colombia: 'CO',
//   Comoros: 'KM',
//   Congo: 'CG',
//   'Costa Rica': 'CR',
//   Croatia: 'HR',
//   Cuba: 'CU',
//   Cyprus: 'CY',
//   'Czech Republic': 'CZ',
//   Denmark: 'DK',
//   Djibouti: 'DJ',
//   Dominica: 'DM',
//   'Dominican Republic': 'DO',
//   Ecuador: 'EC',
//   Egypt: 'EG',
//   'El Salvador': 'SV',
//   'Equatorial Guinea': 'GQ',
//   Eritrea: 'ER',
//   Estonia: 'EE',
//   Eswatini: 'SZ',
//   Ethiopia: 'ET',
//   Fiji: 'FJ',
//   Finland: 'FI',
//   France: 'FR',
//   Gabon: 'GA',
//   Gambia: 'GM',
//   Georgia: 'GE',
//   Germany: 'DE',
//   Ghana: 'GH',
//   Greece: 'GR',
//   Grenada: 'GD',
//   Guatemala: 'GT',
//   Guinea: 'GN',
//   'Guinea-Bissau': 'GW',
//   Guyana: 'GY',
//   Haiti: 'HT',
//   Honduras: 'HN',
//   Hungary: 'HU',
//   Iceland: 'IS',
//   India: 'IN',
//   Indonesia: 'ID',
//   Iran: 'IR',
//   Iraq: 'IQ',
//   Ireland: 'IE',
//   Israel: 'IL',
//   Italy: 'IT',
//   Jamaica: 'JM',
//   Japan: 'JP',
//   Jordan: 'JO',
//   Kazakhstan: 'KZ',
//   Kenya: 'KE',
//   Kiribati: 'KI',
//   Kuwait: 'KW',
//   Laos: 'LA',
//   Latvia: 'LV',
//   Lebanon: 'LB',
//   Lesotho: 'LS',
//   Liberia: 'LR',
//   Libya: 'LY',
//   Liechtenstein: 'LI',
//   Lithuania: 'LT',
//   Luxembourg: 'LU',
//   Madagascar: 'MG',
//   Malawi: 'MW',
//   Malaysia: 'MY',
//   Maldives: 'MV',
//   Mali: 'ML',
//   Malta: 'MT',
//   'Marshall Islands': 'MH',
//   Mauritania: 'MR',
//   Mauritius: 'MU',
//   Mexico: 'MX',
//   Micronesia: 'FM',
//   Moldova: 'MD',
//   Monaco: 'MC',
//   Mongolia: 'MN',
//   Montenegro: 'ME',
//   Morocco: 'MA',
//   Mozambique: 'MZ',
//   Myanmar: 'MM',
//   Namibia: 'NA',
//   Nauru: 'NR',
//   Nepal: 'NP',
//   Netherlands: 'NL',
//   'New Zealand': 'NZ',
//   Nicaragua: 'NI',
//   Niger: 'NE',
//   Nigeria: 'NG',
//   'North Korea': 'KP',
//   'North Macedonia': 'MK',
//   Norway: 'NO',
//   Oman: 'OM',
//   Pakistan: 'PK',
//   Palau: 'PW',
//   Palestine: 'PS',
//   Panama: 'PA',
//   'Papua New Guinea': 'PG',
//   Paraguay: 'PY',
//   Peru: 'PE',
//   Philippines: 'PH',
//   Poland: 'PL',
//   Portugal: 'PT',
//   Qatar: 'QA',
//   Romania: 'RO',
//   Russia: 'RU',
//   Rwanda: 'RW',
//   'Saint Kitts and Nevis': 'KN',
//   'Saint Lucia': 'LC',
//   'Saint Vincent and the Grenadines': 'VC',
//   Samoa: 'WS',
//   'San Marino': 'SM',
//   'Sao Tome and Principe': 'ST',
//   'Saudi Arabia': 'SA',
//   Senegal: 'SN',
//   Serbia: 'RS',
//   Seychelles: 'SC',
//   'Sierra Leone': 'SL',
//   Singapore: 'SG',
//   Slovakia: 'SK',
//   Slovenia: 'SI',
//   Somalia: 'SO',
//   'South Africa': 'ZA',
//   'South Korea': 'KR',
//   'South Sudan': 'SS',
//   Spain: 'ES',
//   'Sri Lanka': 'LK',
//   Sudan: 'SD',
//   Suriname: 'SR',
//   Sweden: 'SE',
//   Switzerland: 'CH',
//   Syria: 'SY',
//   Taiwan: 'TW',
//   Tajikistan: 'TJ',
//   Tanzania: 'TZ',
//   Thailand: 'TH',
//   'Timor-Leste': 'TL',
//   Togo: 'TG',
//   Tonga: 'TO',
//   'Trinidad and Tobago': 'TT',
//   Tunisia: 'TN',
//   Turkey: 'TR',
//   Turkmenistan: 'TM',
//   Tuvalu: 'TV',
//   Uganda: 'UG',
//   Ukraine: 'UA',
//   'United Arab Emirates': 'AE',
//   'United Kingdom': 'GB',
//   'United States': 'US',
//   Uruguay: 'UY',
//   Uzbekistan: 'UZ',
//   Vanuatu: 'VU',
//   'Vatican City': 'VA',
//   Venezuela: 'VE',
//   Vietnam: 'VN',
//   Yemen: 'YE',
//   Zambia: 'ZM',
//   Zimbabwe: 'ZW',
// };


// // =====================================================
// // SUCCESS DATA TYPE
// // =====================================================

// interface SignupSuccessData {
//   customerId: string;
//   referralId: string;
//   message: string;
// }


// // =====================================================
// // SIGN UP
// // =====================================================

// export function SignUp() {
//   const navigate = useNavigate();

//   // ===================================================
//   // FORM STATES
//   // ===================================================

//   const [referralCode, setReferralCode] = useState('');
//   const [fullName, setFullName] = useState('');
//   const [email, setEmail] = useState('');
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [country, setCountry] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] =
//     useState('');

//   // ===================================================
//   // UI STATES
//   // ===================================================

//   const [showPassword, setShowPassword] =
//     useState(false);

//   const [
//     showConfirmPassword,
//     setShowConfirmPassword,
//   ] = useState(false);

//   const [isLoading, setIsLoading] =
//     useState(false);

//   const [error, setError] = useState('');

//   const [successData, setSuccessData] =
//     useState<SignupSuccessData | null>(null);

//   // ===================================================
//   // COUNTRY / CALLING CODE
//   // ===================================================

//   const selectedCountryIso: CountryCode | undefined =
//     country
//       ? countryIsoMap[country]
//       : undefined;

//   const callingCode = useMemo(() => {
//     if (!selectedCountryIso) {
//       return '';
//     }

//     try {
//       return `+${getCountryCallingCode(
//         selectedCountryIso
//       )}`;
//     } catch {
//       return '';
//     }
//   }, [selectedCountryIso]);

//   // ===================================================
//   // STRONG PASSWORD VALIDATION
//   // ===================================================

//   const passwordRules = useMemo(() => {
//     return {
//       minLength: password.length >= 8,
//       uppercase: /[A-Z]/.test(password),
//       lowercase: /[a-z]/.test(password),
//       number: /[0-9]/.test(password),
//       specialCharacter: /[^A-Za-z0-9]/.test(password),
//     };
//   }, [password]);

//   const isStrongPassword =
//     passwordRules.minLength &&
//     passwordRules.uppercase &&
//     passwordRules.lowercase &&
//     passwordRules.number &&
//     passwordRules.specialCharacter;

//   const passwordStrengthCount = Object.values(
//     passwordRules
//   ).filter(Boolean).length;

//   // ===================================================
//   // MOUSE ANIMATION
//   // ===================================================

//   const mouseX = useMotionValue(0);
//   const mouseY = useMotionValue(0);

//   const rotateX = useTransform(
//     mouseY,
//     [-300, 300],
//     [8, -8]
//   );

//   const rotateY = useTransform(
//     mouseX,
//     [-300, 300],
//     [-8, 8]
//   );

//   const handleMouseMove = (
//     e: React.MouseEvent<HTMLDivElement>
//   ) => {
//     const rect =
//       e.currentTarget.getBoundingClientRect();

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

//   const handleMouseLeave = () => {
//     mouseX.set(0);
//     mouseY.set(0);
//   };


//   // ===================================================
//   // SIGNUP API
//   // ===================================================

//   const handleSubmit = async (
//     event: React.FormEvent<HTMLFormElement>
//   ) => {
//     event.preventDefault();

//     if (isLoading || successData) {
//       return;
//     }

//     setError('');

//     // =================================================
//     // FULL NAME
//     // =================================================

//     if (fullName.trim().length < 2) {
//       setError(
//         'Please enter your full name.'
//       );
//       return;
//     }

//     // =================================================
//     // EMAIL
//     // =================================================

//     if (!email.trim()) {
//       setError(
//         'Please enter your email address.'
//       );
//       return;
//     }

//     // =================================================
//     // COUNTRY
//     // =================================================

//     if (!country || !selectedCountryIso) {
//       setError(
//         'Please select your country.'
//       );
//       return;
//     }

//     // =================================================
//     // PHONE
//     // =================================================

//     if (!phoneNumber) {
//       setError(
//         'Please enter your phone number.'
//       );
//       return;
//     }

//     if (!/^\d+$/.test(phoneNumber)) {
//       setError(
//         'Phone number must contain numbers only.'
//       );
//       return;
//     }

//     const parsedPhone =
//       parsePhoneNumberFromString(
//         phoneNumber,
//         selectedCountryIso
//       );

//     if (
//       !parsedPhone ||
//       !parsedPhone.isValid()
//     ) {
//       setError(
//         `Please enter a valid phone number for ${country}.`
//       );
//       return;
//     }

//     // =================================================
//     // PASSWORD
//     // =================================================

//     if (!isStrongPassword) {
//       setError(
//         'Password must contain at least 8 characters, including uppercase, lowercase, number and special character.'
//       );
//       return;
//     }

//     if (password !== confirmPassword) {
//       setError(
//         'Passwords do not match.'
//       );
//       return;
//     }

//     // bcrypt maximum = 72 UTF-8 bytes
//     if (
//       new TextEncoder().encode(password)
//         .length > 72
//     ) {
//       setError(
//         'Password is too long. Please use a shorter password.'
//       );
//       return;
//     }

//     // =================================================
//     // REQUEST
//     // =================================================

//     setIsLoading(true);

//     try {
//       const payload = {
//         referralCode:
//           referralCode.trim()
//             ? referralCode
//                 .trim()
//                 .toUpperCase()
//             : null,

//         fullName: fullName.trim(),

//         email: email
//           .trim()
//           .toLowerCase(),

//         // Send national digits only.
//         // Backend adds country code.
//         phoneNumber:
//           phoneNumber.trim(),

//         country: country.trim(),

//         password,

//         confirmPassword,
//       };

//       const API_URL =
//         import.meta.env.VITE_API_URL ||
//         'http://127.0.0.1:8000';

//       const response = await fetch(
//         `${API_URL}/api/auth/signup`,
//         {
//           method: 'POST',

//           headers: {
//             'Content-Type':
//               'application/json',
//             Accept: 'application/json',
//           },

//           body: JSON.stringify(payload),
//         }
//       );

//       let data: any = null;

//       try {
//         data = await response.json();
//       } catch {
//         data = null;
//       }

//       // =================================================
//       // BACKEND ERROR
//       // =================================================

//       if (!response.ok) {
//         let errorMessage =
//           'Something went wrong. Please try again.';

//         if (
//           data &&
//           typeof data.detail === 'string'
//         ) {
//           errorMessage = data.detail;
//         } else if (
//           data &&
//           Array.isArray(data.detail)
//         ) {
//           errorMessage = data.detail
//             .map((item: any) => {
//               const location =
//                 Array.isArray(item.loc)
//                   ? item.loc[
//                       item.loc.length - 1
//                     ]
//                   : 'field';

//               return `${location}: ${item.msg}`;
//             })
//             .join(' | ');
//         } else if (
//           response.status === 409
//         ) {
//           errorMessage =
//             'This email address or phone number is already registered.';
//         } else if (
//           response.status >= 500
//         ) {
//           errorMessage =
//             'Server error. Please try again.';
//         }

//         setError(errorMessage);
//         return;
//       }

//       // =================================================
//       // SUCCESS
//       // =================================================

//       if (!data?.customer_id) {
//         setError(
//           'Registration completed, but Customer ID was not returned.'
//         );
//         return;
//       }

//       setSuccessData({
//         customerId:
//           data.customer_id,

//         referralId:
//           data.referral_id ||
//           data.customer_id,

//         message:
//           data.message ||
//           'Registration successful!',
//       });

//       // =================================================
//       // REDIRECT AFTER 4 SECONDS
//       // =================================================

//       window.setTimeout(() => {
//         navigate('/signin', {
//           replace: true,
//         });
//       }, 4000);

//     } catch (requestError) {
//       console.error(
//         'Signup error:',
//         requestError
//       );

//       setError(
//         'Unable to connect to server. Please make sure the backend is running.'
//       );

//     } finally {
//       setIsLoading(false);
//     }
//   };


//   // =====================================================
//   // INPUT CLASS
//   // =====================================================

//   const inputClass =
//     'w-full bg-white/5 border-transparent focus:border-white/20 text-white placeholder:text-white/30 h-11 transition-all duration-300 pl-10 pr-3 focus:bg-white/10';


//   // =====================================================
//   // UI
//   // =====================================================

//   return (
//     <div className="min-h-screen w-full bg-black relative overflow-y-auto flex items-center justify-center py-10 px-4">

//       {/* =================================================
//           BACKGROUND
//       ================================================= */}

//       <div className="absolute inset-0 bg-gradient-to-b from-purple-500/40 via-purple-700/50 to-black" />

//       {/* Noise */}

//       <div
//         className="absolute inset-0 opacity-[0.03] mix-blend-soft-light"
//         style={{
//           backgroundImage:
//             `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,

//           backgroundSize:
//             '200px 200px',
//         }}
//       />

//       {/* Glow */}

//       <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120vh] h-[60vh] rounded-b-[50%] bg-purple-400/20 blur-[80px]" />

//       <motion.div
//         className="absolute top-0 left-1/2 -translate-x-1/2 w-[100vh] h-[60vh] rounded-b-full bg-purple-300/20 blur-[60px]"
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
//           repeatType: 'mirror',
//         }}
//       />

//       <motion.div
//         className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[90vh] h-[90vh] rounded-t-full bg-purple-400/20 blur-[60px]"
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
//           repeatType: 'mirror',
//         }}
//       />


//       {/* =================================================
//           MAIN CARD
//       ================================================= */}

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
//           duration: 0.8,
//         }}
//         className="w-full max-w-md relative z-10"
//         style={{
//           perspective: 1500,
//         }}
//       >

//         <motion.div
//           className="relative"
//           style={{
//             rotateX,
//             rotateY,
//           }}
//           onMouseMove={
//             handleMouseMove
//           }
//           onMouseLeave={
//             handleMouseLeave
//           }
//         >

//           <div className="relative group">

//             {/* =================================================
//                 ANIMATED BORDER
//             ================================================= */}

//             <div className="absolute -inset-[1px] rounded-2xl overflow-hidden">

//               <motion.div
//                 className="absolute top-0 left-0 h-[2px] w-[50%] bg-gradient-to-r from-transparent via-white to-transparent opacity-70"
//                 animate={{
//                   left: [
//                     '-50%',
//                     '100%',
//                   ],
//                 }}
//                 transition={{
//                   duration: 2.5,
//                   repeat: Infinity,
//                   ease: 'easeInOut',
//                 }}
//               />

//               <motion.div
//                 className="absolute bottom-0 right-0 h-[2px] w-[50%] bg-gradient-to-r from-transparent via-white to-transparent opacity-70"
//                 animate={{
//                   right: [
//                     '-50%',
//                     '100%',
//                   ],
//                 }}
//                 transition={{
//                   duration: 2.5,
//                   repeat: Infinity,
//                   ease: 'easeInOut',
//                   delay: 1,
//                 }}
//               />

//             </div>


//             {/* =================================================
//                 CARD
//             ================================================= */}

//             <div className="relative bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/[0.08] shadow-2xl overflow-hidden">

//               {/* Pattern */}

//               <div
//                 className="absolute inset-0 opacity-[0.03]"
//                 style={{
//                   backgroundImage:
//                     'linear-gradient(135deg, white 0.5px, transparent 0.5px), linear-gradient(45deg, white 0.5px, transparent 0.5px)',

//                   backgroundSize:
//                     '30px 30px',
//                 }}
//               />


//               {/* =================================================
//                   HEADER
//               ================================================= */}

//               <div className="relative text-center space-y-2 mb-6">

//                 <motion.div
//                   initial={{
//                     scale: 0.5,
//                     opacity: 0,
//                   }}
//                   animate={{
//                     scale: 1,
//                     opacity: 1,
//                   }}
//                   transition={{
//                     type: 'spring',
//                     duration: 0.8,
//                   }}
//                   className="mx-auto w-20 h-20 rounded-full border border-white/10 flex items-center justify-center relative overflow-hidden"
//                 >

//                   <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70">
//                     APH
//                   </span>

//                   <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50" />

//                 </motion.div>


//                 <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/80">
//                   Create Account
//                 </h1>

//                 <p className="text-white/60 text-xs">
//                   Join now and start earning money
//                 </p>

//               </div>


//               {/* =================================================
//                   FORM
//               ================================================= */}

//               <form
//                 onSubmit={handleSubmit}
//                 className="relative space-y-3"
//               >

//                 {/* =================================================
//                     REFERRAL
//                 ================================================= */}

//                 <div className="relative">

//                   <Gift className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 z-10" />

//                   <Input
//                     type="text"
//                     placeholder="Referral Code"
//                     value={referralCode}
//                     maxLength={20}
//                     autoComplete="off"
//                     onChange={(e) => {
//                       const value =
//                         e.target.value
//                           .toUpperCase()
//                           .replace(
//                             /[^A-Z0-9]/g,
//                             ''
//                           );

//                       setReferralCode(
//                         value
//                       );

//                       setError('');
//                     }}
//                     className={
//                       inputClass
//                     }
//                   />

//                 </div>


//                 {/* =================================================
//                     FULL NAME
//                 ================================================= */}

//                 <div className="relative">

//                   <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 z-10" />

//                   <Input
//                     type="text"
//                     placeholder="Full Name"
//                     value={fullName}
//                     autoComplete="name"
//                     onChange={(e) => {
//                       setFullName(
//                         e.target.value
//                       );

//                       setError('');
//                     }}
//                     required
//                     className={
//                       inputClass
//                     }
//                   />

//                 </div>


//                 {/* =================================================
//                     EMAIL
//                 ================================================= */}

//                 <div className="relative">

//                   <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 z-10" />

//                   <Input
//                     type="email"
//                     placeholder="Email Address"
//                     value={email}
//                     autoComplete="email"
//                     onChange={(e) => {
//                       setEmail(
//                         e.target.value
//                       );

//                       setError('');
//                     }}
//                     required
//                     className={
//                       inputClass
//                     }
//                   />

//                 </div>


//                 {/* =================================================
//                     COUNTRY
//                 ================================================= */}

//                 <div className="relative">

//                   <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 z-10 pointer-events-none" />

//                   <select
//                     value={country}
//                     onChange={(e) => {
//                       setCountry(
//                         e.target.value
//                       );

//                       // Reset number because
//                       // country validation changed
//                       setPhoneNumber('');

//                       setError('');
//                     }}
//                     required
//                     className="w-full appearance-none bg-white/5 border border-transparent focus:border-white/20 text-white h-11 rounded-md pl-10 pr-3 text-sm outline-none transition-all duration-300 focus:bg-white/10"
//                   >

//                     <option
//                       value=""
//                       className="bg-black text-white"
//                     >
//                       Select Country
//                     </option>

//                     {countries.map(
//                       (countryName) => (
//                         <option
//                           key={
//                             countryName
//                           }
//                           value={
//                             countryName
//                           }
//                           className="bg-black text-white"
//                         >
//                           {countryName}
//                         </option>
//                       )
//                     )}

//                   </select>

//                 </div>


//                 {/* =================================================
//                     PHONE
//                 ================================================= */}

//                 <div className="flex gap-2">

//                   {/* COUNTRY CODE */}

//                   <div className="h-11 min-w-[76px] px-3 rounded-md bg-white/5 border border-transparent flex items-center justify-center text-white/70 text-sm select-none">
//                     {callingCode ||
//                       '+--'}
//                   </div>


//                   {/* NUMBER */}

//                   <div className="relative flex-1">

//                     <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 z-10" />

//                     <Input
//                       type="tel"
//                       inputMode="numeric"
//                       autoComplete="tel-national"
//                       placeholder={
//                         country
//                           ? 'Phone Number'
//                           : 'Select country first'
//                       }
//                       value={
//                         phoneNumber
//                       }
//                       disabled={
//                         !country
//                       }
//                       maxLength={15}
//                       onChange={(e) => {
//                         const digitsOnly =
//                           e.target.value.replace(
//                             /\D/g,
//                             ''
//                           );

//                         setPhoneNumber(
//                           digitsOnly
//                         );

//                         setError('');
//                       }}
//                       onPaste={(e) => {
//                         const pasted =
//                           e.clipboardData.getData(
//                             'text'
//                           );

//                         if (
//                           /\D/.test(
//                             pasted
//                           )
//                         ) {
//                           e.preventDefault();

//                           const digits =
//                             pasted.replace(
//                               /\D/g,
//                               ''
//                             );

//                           setPhoneNumber(
//                             digits.slice(
//                               0,
//                               15
//                             )
//                           );
//                         }
//                       }}
//                       required
//                       className={`${inputClass} disabled:opacity-50`}
//                     />

//                   </div>

//                 </div>


//                 {/* =================================================
//                     PASSWORD
//                 ================================================= */}

//                 <div className="relative">

//                   <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 z-10" />

//                   <Input
//                     type={
//                       showPassword
//                         ? 'text'
//                         : 'password'
//                     }
//                     placeholder="Password"
//                     value={password}
//                     autoComplete="new-password"
//                     onChange={(e) => {
//                       setPassword(
//                         e.target.value
//                       );

//                       setError('');
//                     }}
//                     required
//                     className={`${inputClass} pr-10`}
//                   />

//                   <button
//                     type="button"
//                     aria-label={
//                       showPassword
//                         ? 'Hide password'
//                         : 'Show password'
//                     }
//                     onClick={() =>
//                       setShowPassword(
//                         (current) =>
//                           !current
//                       )
//                     }
//                     className="absolute right-3 top-1/2 -translate-y-1/2"
//                   >

//                     {showPassword ? (
//                       <Eye className="w-4 h-4 text-white/40 hover:text-white" />
//                     ) : (
//                       <EyeClosed className="w-4 h-4 text-white/40 hover:text-white" />
//                     )}

//                   </button>

//                 </div>


//                 {/* =================================================
//                     PASSWORD STRENGTH
//                 ================================================= */}

//                 {password.length > 0 && (
//                   <div className="space-y-2 px-0.5">
//                     <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
//                       <motion.div
//                         initial={false}
//                         animate={{
//                           width: `${Math.max(
//                             20,
//                             passwordStrengthCount * 20
//                           )}%`,
//                         }}
//                         transition={{
//                           duration: 0.25,
//                         }}
//                         className={`h-full rounded-full transition-colors duration-300 ${
//                           isStrongPassword
//                             ? 'bg-green-500'
//                             : 'bg-red-500'
//                         }`}
//                       />
//                     </div>

//                     <div className="flex items-center justify-between gap-3">
//                       <p
//                         className={`text-[11px] font-medium ${
//                           isStrongPassword
//                             ? 'text-green-400'
//                             : 'text-red-400'
//                         }`}
//                       >
//                         {isStrongPassword
//                           ? 'Strong Password'
//                           : 'Weak Password'}
//                       </p>

//                       <p className="text-[10px] text-white/35">
//                         8+ chars • A-Z • a-z • 0-9 • special
//                       </p>
//                     </div>
//                   </div>
//                 )}


//                 {/* =================================================
//                     CONFIRM PASSWORD
//                 ================================================= */}

//                 <div className="relative">

//                   <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 z-10" />

//                   <Input
//                     type={
//                       showConfirmPassword
//                         ? 'text'
//                         : 'password'
//                     }
//                     placeholder="Confirm Password"
//                     value={
//                       confirmPassword
//                     }
//                     autoComplete="new-password"
//                     onChange={(e) => {
//                       setConfirmPassword(
//                         e.target.value
//                       );

//                       setError('');
//                     }}
//                     required
//                     className={`${inputClass} pr-10`}
//                   />

//                   <button
//                     type="button"
//                     aria-label={
//                       showConfirmPassword
//                         ? 'Hide confirm password'
//                         : 'Show confirm password'
//                     }
//                     onClick={() =>
//                       setShowConfirmPassword(
//                         (current) =>
//                           !current
//                       )
//                     }
//                     className="absolute right-3 top-1/2 -translate-y-1/2"
//                   >

//                     {showConfirmPassword ? (
//                       <Eye className="w-4 h-4 text-white/40 hover:text-white" />
//                     ) : (
//                       <EyeClosed className="w-4 h-4 text-white/40 hover:text-white" />
//                     )}

//                   </button>

//                 </div>


//                 {/* =================================================
//                     ERROR MESSAGE
//                 ================================================= */}

//                 <AnimatePresence>
//                   {error && (
//                     <motion.div
//                       initial={{
//                         opacity: 0,
//                         y: -5,
//                       }}
//                       animate={{
//                         opacity: 1,
//                         y: 0,
//                       }}
//                       exit={{
//                         opacity: 0,
//                         y: -5,
//                       }}
//                       className="rounded-md border border-red-500/20 bg-red-500/10 px-3 py-2"
//                     >
//                       <p className="text-red-400 text-xs text-center break-words">
//                         {error}
//                       </p>
//                     </motion.div>
//                   )}
//                 </AnimatePresence>


//                 {/* =================================================
//                     SIGN UP BUTTON
//                 ================================================= */}

//                 <motion.button
//                   whileHover={
//                     !isLoading
//                       ? {
//                           scale: 1.02,
//                         }
//                       : {}
//                   }
//                   whileTap={
//                     !isLoading
//                       ? {
//                           scale: 0.98,
//                         }
//                       : {}
//                   }
//                   type="submit"
//                   disabled={
//                     isLoading ||
//                     !!successData
//                   }
//                   className="w-full relative group/button mt-5 disabled:opacity-70 disabled:cursor-not-allowed"
//                 >

//                   <div className="absolute inset-0 bg-white/10 rounded-lg blur-lg opacity-0 group-hover/button:opacity-70 transition-opacity duration-300" />

//                   <div className="relative overflow-hidden bg-white text-black font-medium h-11 rounded-lg flex items-center justify-center">

//                     <AnimatePresence
//                       mode="wait"
//                     >

//                       {isLoading ? (

//                         <motion.div
//                           key="loading"
//                           initial={{
//                             opacity: 0,
//                           }}
//                           animate={{
//                             opacity: 1,
//                           }}
//                           exit={{
//                             opacity: 0,
//                           }}
//                           className="flex items-center gap-2"
//                         >

//                           <div className="w-4 h-4 border-2 border-black/70 border-t-transparent rounded-full animate-spin" />

//                           <span className="text-sm">
//                             Creating Account...
//                           </span>

//                         </motion.div>

//                       ) : (

//                         <motion.span
//                           key="signup"
//                           className="flex items-center justify-center gap-2 text-sm font-medium"
//                         >

//                           Create Account

//                           <ArrowRight className="w-4 h-4 group-hover/button:translate-x-1 transition-transform duration-300" />

//                         </motion.span>

//                       )}

//                     </AnimatePresence>

//                   </div>

//                 </motion.button>


//                 {/* =================================================
//                     SIGN IN LINK
//                 ================================================= */}

//                 <motion.p
//                   className="text-center text-xs text-white/60 mt-5"
//                   initial={{
//                     opacity: 0,
//                   }}
//                   animate={{
//                     opacity: 1,
//                   }}
//                   transition={{
//                     delay: 0.5,
//                   }}
//                 >

//                   Already have an account?{' '}

//                   <Link
//                     to="/signin"
//                     className="relative inline-block group/signin"
//                   >

//                     <span className="relative z-10 text-white group-hover/signin:text-white/70 transition-colors duration-300 font-medium">
//                       Sign In
//                     </span>

//                     <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-white group-hover/signin:w-full transition-all duration-300" />

//                   </Link>

//                 </motion.p>

//               </form>


//               {/* =================================================
//                   SUCCESS OVERLAY
//               ================================================= */}

//               <AnimatePresence>
//                 {successData && (

//                   <motion.div
//                     initial={{
//                       opacity: 0,
//                     }}
//                     animate={{
//                       opacity: 1,
//                     }}
//                     exit={{
//                       opacity: 0,
//                     }}
//                     className="absolute inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-6"
//                   >

//                     <motion.div
//                       initial={{
//                         opacity: 0,
//                         scale: 0.85,
//                         y: 20,
//                       }}
//                       animate={{
//                         opacity: 1,
//                         scale: 1,
//                         y: 0,
//                       }}
//                       transition={{
//                         type: 'spring',
//                         duration: 0.6,
//                       }}
//                       className="w-full text-center space-y-5"
//                     >

//                       {/* CHECK */}

//                       <motion.div
//                         initial={{
//                           scale: 0,
//                           rotate: -30,
//                         }}
//                         animate={{
//                           scale: 1,
//                           rotate: 0,
//                         }}
//                         transition={{
//                           type: 'spring',
//                           delay: 0.15,
//                         }}
//                         className="mx-auto w-16 h-16 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center"
//                       >

//                         <Check className="w-8 h-8 text-green-400" />

//                       </motion.div>


//                       {/* TITLE */}

//                       <div>

//                         <h2 className="text-white text-xl font-bold">
//                           Registration Successful
//                         </h2>

//                         <p className="text-white/60 text-xs mt-2">
//                           Your AdsPromoHub account has been created successfully.
//                         </p>

//                       </div>


//                       {/* CUSTOMER ID */}

//                       <div className="rounded-xl border border-purple-400/20 bg-purple-500/10 p-4">

//                         <p className="text-white/50 text-xs">
//                           Your Customer ID
//                         </p>

//                         <p className="text-white text-2xl font-bold tracking-wider mt-2 break-all">
//                           {successData.customerId}
//                         </p>

//                       </div>


//                       {/* SAVE MESSAGE */}

//                       <div className="rounded-lg border border-white/10 bg-white/5 px-4 py-3">

//                         <p className="text-white/70 text-xs leading-5">
//                           Please save your Customer ID.
//                           You can sign in using your
//                           <span className="text-white font-medium">
//                             {' '}Email Address{' '}
//                           </span>
//                           or
//                           <span className="text-white font-medium">
//                             {' '}Customer ID
//                           </span>
//                           .
//                         </p>

//                       </div>


//                       {/* CONTINUE */}

//                       <motion.button
//                         whileHover={{
//                           scale: 1.02,
//                         }}
//                         whileTap={{
//                           scale: 0.98,
//                         }}
//                         type="button"
//                         onClick={() =>
//                           navigate(
//                             '/signin',
//                             {
//                               replace:
//                                 true,
//                             }
//                           )
//                         }
//                         className="w-full h-11 rounded-lg bg-white text-black text-sm font-medium flex items-center justify-center gap-2"
//                       >

//                         Continue to Sign In

//                         <ArrowRight className="w-4 h-4" />

//                       </motion.button>


//                       <p className="text-white/40 text-[11px]">
//                         Redirecting automatically to Sign In...
//                       </p>

//                     </motion.div>

//                   </motion.div>

//                 )}
//               </AnimatePresence>

//             </div>

//           </div>

//         </motion.div>

//       </motion.div>

//     </div>
//   );
// }




















=======
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
import React, { useMemo, useState } from 'react';

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
  User,
  Phone,
  Globe,
  Gift,
  Check,
} from 'lucide-react';

import {
  getCountryCallingCode,
  parsePhoneNumberFromString,
  type CountryCode,
} from 'libphonenumber-js';

import { cn } from '../../lib/utils';
import { Link, useNavigate } from 'react-router-dom';


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
        'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed md:text-sm',
        'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
        className
      )}
      {...props}
    />
  );
}


// =====================================================
// COUNTRIES
// =====================================================

const countries = [
  'Afghanistan',
  'Albania',
  'Algeria',
  'Andorra',
  'Angola',
  'Antigua and Barbuda',
  'Argentina',
  'Armenia',
  'Australia',
  'Austria',
  'Azerbaijan',
  'Bahamas',
  'Bahrain',
  'Bangladesh',
  'Barbados',
  'Belarus',
  'Belgium',
  'Belize',
  'Benin',
  'Bhutan',
  'Bolivia',
  'Bosnia and Herzegovina',
  'Botswana',
  'Brazil',
  'Brunei',
  'Bulgaria',
  'Burkina Faso',
  'Burundi',
  'Cabo Verde',
  'Cambodia',
  'Cameroon',
  'Canada',
  'Central African Republic',
  'Chad',
  'Chile',
  'China',
  'Colombia',
  'Comoros',
  'Congo',
  'Costa Rica',
  'Croatia',
  'Cuba',
  'Cyprus',
  'Czech Republic',
  'Denmark',
  'Djibouti',
  'Dominica',
  'Dominican Republic',
  'Ecuador',
  'Egypt',
  'El Salvador',
  'Equatorial Guinea',
  'Eritrea',
  'Estonia',
  'Eswatini',
  'Ethiopia',
  'Fiji',
  'Finland',
  'France',
  'Gabon',
  'Gambia',
  'Georgia',
  'Germany',
  'Ghana',
  'Greece',
  'Grenada',
  'Guatemala',
  'Guinea',
  'Guinea-Bissau',
  'Guyana',
  'Haiti',
  'Honduras',
  'Hungary',
  'Iceland',
  'India',
  'Indonesia',
  'Iran',
  'Iraq',
  'Ireland',
  'Israel',
  'Italy',
  'Jamaica',
  'Japan',
  'Jordan',
  'Kazakhstan',
  'Kenya',
  'Kiribati',
  'Kuwait',
  'Laos',
  'Latvia',
  'Lebanon',
  'Lesotho',
  'Liberia',
  'Libya',
  'Liechtenstein',
  'Lithuania',
  'Luxembourg',
  'Madagascar',
  'Malawi',
  'Malaysia',
  'Maldives',
  'Mali',
  'Malta',
  'Marshall Islands',
  'Mauritania',
  'Mauritius',
  'Mexico',
  'Micronesia',
  'Moldova',
  'Monaco',
  'Mongolia',
  'Montenegro',
  'Morocco',
  'Mozambique',
  'Myanmar',
  'Namibia',
  'Nauru',
  'Nepal',
  'Netherlands',
  'New Zealand',
  'Nicaragua',
  'Niger',
  'Nigeria',
  'North Korea',
  'North Macedonia',
  'Norway',
  'Oman',
  'Pakistan',
  'Palau',
  'Palestine',
  'Panama',
  'Papua New Guinea',
  'Paraguay',
  'Peru',
  'Philippines',
  'Poland',
  'Portugal',
  'Qatar',
  'Romania',
  'Russia',
  'Rwanda',
  'Saint Kitts and Nevis',
  'Saint Lucia',
  'Saint Vincent and the Grenadines',
  'Samoa',
  'San Marino',
  'Sao Tome and Principe',
  'Saudi Arabia',
  'Senegal',
  'Serbia',
  'Seychelles',
  'Sierra Leone',
  'Singapore',
  'Slovakia',
  'Slovenia',
  'Somalia',
  'South Africa',
  'South Korea',
  'South Sudan',
  'Spain',
  'Sri Lanka',
  'Sudan',
  'Suriname',
  'Sweden',
  'Switzerland',
  'Syria',
  'Taiwan',
  'Tajikistan',
  'Tanzania',
  'Thailand',
  'Timor-Leste',
  'Togo',
  'Tonga',
  'Trinidad and Tobago',
  'Tunisia',
  'Turkey',
  'Turkmenistan',
  'Tuvalu',
  'Uganda',
  'Ukraine',
  'United Arab Emirates',
  'United Kingdom',
  'United States',
  'Uruguay',
  'Uzbekistan',
  'Vanuatu',
  'Vatican City',
  'Venezuela',
  'Vietnam',
  'Yemen',
  'Zambia',
  'Zimbabwe',
];


// =====================================================
// COUNTRY -> ISO CODE
// =====================================================

const countryIsoMap: Record<string, CountryCode> = {
  Afghanistan: 'AF',
  Albania: 'AL',
  Algeria: 'DZ',
  Andorra: 'AD',
  Angola: 'AO',
  'Antigua and Barbuda': 'AG',
  Argentina: 'AR',
  Armenia: 'AM',
  Australia: 'AU',
  Austria: 'AT',
  Azerbaijan: 'AZ',
  Bahamas: 'BS',
  Bahrain: 'BH',
  Bangladesh: 'BD',
  Barbados: 'BB',
  Belarus: 'BY',
  Belgium: 'BE',
  Belize: 'BZ',
  Benin: 'BJ',
  Bhutan: 'BT',
  Bolivia: 'BO',
  'Bosnia and Herzegovina': 'BA',
  Botswana: 'BW',
  Brazil: 'BR',
  Brunei: 'BN',
  Bulgaria: 'BG',
  'Burkina Faso': 'BF',
  Burundi: 'BI',
  'Cabo Verde': 'CV',
  Cambodia: 'KH',
  Cameroon: 'CM',
  Canada: 'CA',
  'Central African Republic': 'CF',
  Chad: 'TD',
  Chile: 'CL',
  China: 'CN',
  Colombia: 'CO',
  Comoros: 'KM',
  Congo: 'CG',
  'Costa Rica': 'CR',
  Croatia: 'HR',
  Cuba: 'CU',
  Cyprus: 'CY',
  'Czech Republic': 'CZ',
  Denmark: 'DK',
  Djibouti: 'DJ',
  Dominica: 'DM',
  'Dominican Republic': 'DO',
  Ecuador: 'EC',
  Egypt: 'EG',
  'El Salvador': 'SV',
  'Equatorial Guinea': 'GQ',
  Eritrea: 'ER',
  Estonia: 'EE',
  Eswatini: 'SZ',
  Ethiopia: 'ET',
  Fiji: 'FJ',
  Finland: 'FI',
  France: 'FR',
  Gabon: 'GA',
  Gambia: 'GM',
  Georgia: 'GE',
  Germany: 'DE',
  Ghana: 'GH',
  Greece: 'GR',
  Grenada: 'GD',
  Guatemala: 'GT',
  Guinea: 'GN',
  'Guinea-Bissau': 'GW',
  Guyana: 'GY',
  Haiti: 'HT',
  Honduras: 'HN',
  Hungary: 'HU',
  Iceland: 'IS',
  India: 'IN',
  Indonesia: 'ID',
  Iran: 'IR',
  Iraq: 'IQ',
  Ireland: 'IE',
  Israel: 'IL',
  Italy: 'IT',
  Jamaica: 'JM',
  Japan: 'JP',
  Jordan: 'JO',
  Kazakhstan: 'KZ',
  Kenya: 'KE',
  Kiribati: 'KI',
  Kuwait: 'KW',
  Laos: 'LA',
  Latvia: 'LV',
  Lebanon: 'LB',
  Lesotho: 'LS',
  Liberia: 'LR',
  Libya: 'LY',
  Liechtenstein: 'LI',
  Lithuania: 'LT',
  Luxembourg: 'LU',
  Madagascar: 'MG',
  Malawi: 'MW',
  Malaysia: 'MY',
  Maldives: 'MV',
  Mali: 'ML',
  Malta: 'MT',
  'Marshall Islands': 'MH',
  Mauritania: 'MR',
  Mauritius: 'MU',
  Mexico: 'MX',
  Micronesia: 'FM',
  Moldova: 'MD',
  Monaco: 'MC',
  Mongolia: 'MN',
  Montenegro: 'ME',
  Morocco: 'MA',
  Mozambique: 'MZ',
  Myanmar: 'MM',
  Namibia: 'NA',
  Nauru: 'NR',
  Nepal: 'NP',
  Netherlands: 'NL',
  'New Zealand': 'NZ',
  Nicaragua: 'NI',
  Niger: 'NE',
  Nigeria: 'NG',
  'North Korea': 'KP',
  'North Macedonia': 'MK',
  Norway: 'NO',
  Oman: 'OM',
  Pakistan: 'PK',
  Palau: 'PW',
  Palestine: 'PS',
  Panama: 'PA',
  'Papua New Guinea': 'PG',
  Paraguay: 'PY',
  Peru: 'PE',
  Philippines: 'PH',
  Poland: 'PL',
  Portugal: 'PT',
  Qatar: 'QA',
  Romania: 'RO',
  Russia: 'RU',
  Rwanda: 'RW',
  'Saint Kitts and Nevis': 'KN',
  'Saint Lucia': 'LC',
  'Saint Vincent and the Grenadines': 'VC',
  Samoa: 'WS',
  'San Marino': 'SM',
  'Sao Tome and Principe': 'ST',
  'Saudi Arabia': 'SA',
  Senegal: 'SN',
  Serbia: 'RS',
  Seychelles: 'SC',
  'Sierra Leone': 'SL',
  Singapore: 'SG',
  Slovakia: 'SK',
  Slovenia: 'SI',
  Somalia: 'SO',
  'South Africa': 'ZA',
  'South Korea': 'KR',
  'South Sudan': 'SS',
  Spain: 'ES',
  'Sri Lanka': 'LK',
  Sudan: 'SD',
  Suriname: 'SR',
  Sweden: 'SE',
  Switzerland: 'CH',
  Syria: 'SY',
  Taiwan: 'TW',
  Tajikistan: 'TJ',
  Tanzania: 'TZ',
  Thailand: 'TH',
  'Timor-Leste': 'TL',
  Togo: 'TG',
  Tonga: 'TO',
  'Trinidad and Tobago': 'TT',
  Tunisia: 'TN',
  Turkey: 'TR',
  Turkmenistan: 'TM',
  Tuvalu: 'TV',
  Uganda: 'UG',
  Ukraine: 'UA',
  'United Arab Emirates': 'AE',
  'United Kingdom': 'GB',
  'United States': 'US',
  Uruguay: 'UY',
  Uzbekistan: 'UZ',
  Vanuatu: 'VU',
  'Vatican City': 'VA',
  Venezuela: 'VE',
  Vietnam: 'VN',
  Yemen: 'YE',
  Zambia: 'ZM',
  Zimbabwe: 'ZW',
};


// =====================================================
// SUCCESS DATA TYPE
// =====================================================

interface SignupSuccessData {
  customerId: string;
  referralId: string;
  message: string;
}


// =====================================================
// SIGN UP
// =====================================================

export function SignUp() {
  const navigate = useNavigate();

  // ===================================================
  // FORM STATES
  // ===================================================

  const [referralCode, setReferralCode] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [country, setCountry] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] =
    useState('');

  // ===================================================
  // UI STATES
  // ===================================================

  const [showPassword, setShowPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [isLoading, setIsLoading] =
    useState(false);

  const [error, setError] = useState('');

  const [successData, setSuccessData] =
    useState<SignupSuccessData | null>(null);

  // ===================================================
  // COUNTRY / CALLING CODE
  // ===================================================

  const selectedCountryIso: CountryCode | undefined =
    country
      ? countryIsoMap[country]
      : undefined;

  const callingCode = useMemo(() => {
    if (!selectedCountryIso) {
      return '';
    }

    try {
      return `+${getCountryCallingCode(
        selectedCountryIso
      )}`;
    } catch {
      return '';
    }
  }, [selectedCountryIso]);

  // ===================================================
  // STRONG PASSWORD VALIDATION
  // ===================================================

  const passwordRules = useMemo(() => {
    return {
      minLength: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      specialCharacter: /[^A-Za-z0-9]/.test(password),
    };
  }, [password]);

  const isStrongPassword =
    passwordRules.minLength &&
    passwordRules.uppercase &&
    passwordRules.lowercase &&
    passwordRules.number &&
    passwordRules.specialCharacter;

  const passwordStrengthCount = Object.values(
    passwordRules
  ).filter(Boolean).length;

  // ===================================================
  // MOUSE ANIMATION
  // ===================================================

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useTransform(
    mouseY,
    [-300, 300],
    [8, -8]
  );

  const rotateY = useTransform(
    mouseX,
    [-300, 300],
    [-8, 8]
  );

  const handleMouseMove = (
    e: React.MouseEvent<HTMLDivElement>
  ) => {
    const rect =
      e.currentTarget.getBoundingClientRect();

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

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };


  // ===================================================
  // SIGNUP API
  // ===================================================

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (isLoading || successData) {
      return;
    }

    setError('');

    // =================================================
    // FULL NAME
    // =================================================

    if (fullName.trim().length < 2) {
      setError(
        'Please enter your full name.'
      );
      return;
    }

    // =================================================
    // EMAIL
    // =================================================

    if (!email.trim()) {
      setError(
        'Please enter your email address.'
      );
      return;
    }

    // =================================================
    // COUNTRY
    // =================================================

    if (!country || !selectedCountryIso) {
      setError(
        'Please select your country.'
      );
      return;
    }

    // =================================================
    // PHONE
    // =================================================

    if (!phoneNumber) {
      setError(
        'Please enter your phone number.'
      );
      return;
    }

    if (!/^\d+$/.test(phoneNumber)) {
      setError(
        'Phone number must contain numbers only.'
      );
      return;
    }

    const parsedPhone =
      parsePhoneNumberFromString(
        phoneNumber,
        selectedCountryIso
      );

    if (
      !parsedPhone ||
      !parsedPhone.isValid()
    ) {
      setError(
        `Please enter a valid phone number for ${country}.`
      );
      return;
    }

    // =================================================
    // PASSWORD
    // =================================================

    if (!isStrongPassword) {
      setError(
        'Password must contain at least 8 characters, including uppercase, lowercase, number and special character.'
      );
      return;
    }

    if (password !== confirmPassword) {
      setError(
        'Passwords do not match.'
      );
      return;
    }

    // bcrypt maximum = 72 UTF-8 bytes
    if (
      new TextEncoder().encode(password)
        .length > 72
    ) {
      setError(
        'Password is too long. Please use a shorter password.'
      );
      return;
    }

    // =================================================
    // REQUEST
    // =================================================

    setIsLoading(true);

    try {
      const payload = {
        referralCode:
          referralCode.trim()
            ? referralCode
                .trim()
                .toUpperCase()
            : null,

        fullName: fullName.trim(),

        email: email
          .trim()
          .toLowerCase(),

        // Send national digits only.
        // Backend adds country code.
        phoneNumber:
          phoneNumber.trim(),

        country: country.trim(),

        password,

        confirmPassword,
      };

      const API_URL =
        import.meta.env.VITE_API_URL ||
        'http://127.0.0.1:8000';

      const response = await fetch(
        `${API_URL}/api/auth/signup`,
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json',
            Accept: 'application/json',
          },

          body: JSON.stringify(payload),
        }
      );

      let data: any = null;

      try {
        data = await response.json();
      } catch {
        data = null;
      }

      // =================================================
      // BACKEND ERROR
      // =================================================

      if (!response.ok) {
        let errorMessage =
          'Something went wrong. Please try again.';

        if (
          data &&
          typeof data.detail === 'string'
        ) {
          errorMessage = data.detail;
        } else if (
          data &&
          Array.isArray(data.detail)
        ) {
          errorMessage = data.detail
            .map((item: any) => {
              const location =
                Array.isArray(item.loc)
                  ? item.loc[
                      item.loc.length - 1
                    ]
                  : 'field';

              return `${location}: ${item.msg}`;
            })
            .join(' | ');
        } else if (
          response.status === 409
        ) {
          errorMessage =
            'This email address or phone number is already registered.';
        } else if (
          response.status >= 500
        ) {
          errorMessage =
            'Server error. Please try again.';
        }

        setError(errorMessage);
        return;
      }

      // =================================================
      // SUCCESS
      // =================================================

      if (!data?.customer_id) {
        setError(
          'Registration completed, but Customer ID was not returned.'
        );
        return;
      }

      setSuccessData({
        customerId:
          data.customer_id,

        referralId:
          data.referral_id ||
          data.customer_id,

        message:
          data.message ||
          'Registration successful!',
      });

      // =================================================
      // REDIRECT AFTER 4 SECONDS
      // =================================================

      window.setTimeout(() => {
        navigate('/signin', {
          replace: true,
        });
      }, 4000);

    } catch (requestError) {
      console.error(
        'Signup error:',
        requestError
      );

      setError(
        'Unable to connect to server. Please make sure the backend is running.'
      );

    } finally {
      setIsLoading(false);
    }
  };


  // =====================================================
  // INPUT CLASS
  // =====================================================

  const inputClass =
<<<<<<< HEAD
    'w-full bg-white/5 border-transparent focus:border-[#B76E79]/70 text-white placeholder:text-white/30 h-11 transition-all duration-300 pl-10 pr-3 focus:bg-white/10';
=======
    'w-full bg-white/5 border-transparent focus:border-white/20 text-white placeholder:text-white/30 h-11 transition-all duration-300 pl-10 pr-3 focus:bg-white/10';
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d


  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="min-h-screen w-full bg-black relative overflow-y-auto flex items-center justify-center py-10 px-4">

      {/* =================================================
          BACKGROUND
      ================================================= */}

<<<<<<< HEAD
      <div className="absolute inset-0 bg-gradient-to-b from-[#B76E79]/40 via-[#8F4F5A]/50 to-black" />
=======
      <div className="absolute inset-0 bg-gradient-to-b from-purple-500/40 via-purple-700/50 to-black" />
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

      {/* Noise */}

      <div
        className="absolute inset-0 opacity-[0.03] mix-blend-soft-light"
        style={{
          backgroundImage:
            `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,

          backgroundSize:
            '200px 200px',
        }}
      />

      {/* Glow */}

<<<<<<< HEAD
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120vh] h-[60vh] rounded-b-[50%] bg-[#D99AA3]/20 blur-[80px]" />

      <motion.div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[100vh] h-[60vh] rounded-b-full bg-[#FFE5E8]/20 blur-[60px]"
=======
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120vh] h-[60vh] rounded-b-[50%] bg-purple-400/20 blur-[80px]" />

      <motion.div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[100vh] h-[60vh] rounded-b-full bg-purple-300/20 blur-[60px]"
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
          repeatType: 'mirror',
        }}
      />

      <motion.div
<<<<<<< HEAD
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[90vh] h-[90vh] rounded-t-full bg-[#B76E79]/20 blur-[60px]"
=======
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[90vh] h-[90vh] rounded-t-full bg-purple-400/20 blur-[60px]"
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
          repeatType: 'mirror',
        }}
      />


      {/* =================================================
          MAIN CARD
      ================================================= */}

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
          duration: 0.8,
        }}
        className="w-full max-w-md relative z-10"
        style={{
          perspective: 1500,
        }}
      >

        <motion.div
          className="relative"
          style={{
            rotateX,
            rotateY,
          }}
          onMouseMove={
            handleMouseMove
          }
          onMouseLeave={
            handleMouseLeave
          }
        >

          <div className="relative group">

            {/* =================================================
                ANIMATED BORDER
            ================================================= */}

            <div className="absolute -inset-[1px] rounded-2xl overflow-hidden">

              <motion.div
<<<<<<< HEAD
                className="absolute top-0 left-0 h-[2px] w-[50%] bg-gradient-to-r from-transparent via-[#D99AA3] to-transparent opacity-70"
=======
                className="absolute top-0 left-0 h-[2px] w-[50%] bg-gradient-to-r from-transparent via-white to-transparent opacity-70"
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                animate={{
                  left: [
                    '-50%',
                    '100%',
                  ],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />

              <motion.div
<<<<<<< HEAD
                className="absolute bottom-0 right-0 h-[2px] w-[50%] bg-gradient-to-r from-transparent via-[#D99AA3] to-transparent opacity-70"
=======
                className="absolute bottom-0 right-0 h-[2px] w-[50%] bg-gradient-to-r from-transparent via-white to-transparent opacity-70"
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                animate={{
                  right: [
                    '-50%',
                    '100%',
                  ],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: 1,
                }}
              />

            </div>


            {/* =================================================
                CARD
            ================================================= */}

            <div className="relative bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/[0.08] shadow-2xl overflow-hidden">

              {/* Pattern */}

              <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                  backgroundImage:
                    'linear-gradient(135deg, white 0.5px, transparent 0.5px), linear-gradient(45deg, white 0.5px, transparent 0.5px)',

                  backgroundSize:
                    '30px 30px',
                }}
              />


              {/* =================================================
                  HEADER
              ================================================= */}

              <div className="relative text-center space-y-2 mb-6">

                <motion.div
                  initial={{
                    scale: 0.5,
                    opacity: 0,
                  }}
                  animate={{
                    scale: 1,
                    opacity: 1,
                  }}
                  transition={{
                    type: 'spring',
                    duration: 0.8,
                  }}
<<<<<<< HEAD
                  className="mx-auto w-20 h-20 rounded-full border border-[#D99AA3]/30 flex items-center justify-center relative overflow-hidden"
                >

                  <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-b from-[#FFE5E8] to-[#D99AA3]">
                    APH
                  </span>

                  <div className="absolute inset-0 bg-gradient-to-br from-[#D99AA3]/15 to-transparent opacity-50" />
=======
                  className="mx-auto w-20 h-20 rounded-full border border-white/10 flex items-center justify-center relative overflow-hidden"
                >

                  <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70">
                    APH
                  </span>

                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50" />
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

                </motion.div>


                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/80">
                  Create Account
                </h1>

                <p className="text-white/60 text-xs">
                  Join now and start earning money
                </p>

              </div>


              {/* =================================================
                  FORM
              ================================================= */}

              <form
                onSubmit={handleSubmit}
                className="relative space-y-3"
              >

                {/* =================================================
                    REFERRAL
                ================================================= */}

                <div className="relative">

<<<<<<< HEAD
                  <Gift className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D99AA3]/70 z-10" />
=======
                  <Gift className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 z-10" />
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

                  <Input
                    type="text"
                    placeholder="Referral Code"
                    value={referralCode}
                    maxLength={20}
                    autoComplete="off"
                    onChange={(e) => {
                      const value =
                        e.target.value
                          .toUpperCase()
                          .replace(
                            /[^A-Z0-9]/g,
                            ''
                          );

                      setReferralCode(
                        value
                      );

                      setError('');
                    }}
                    className={
                      inputClass
                    }
                  />

                </div>


                {/* =================================================
                    FULL NAME
                ================================================= */}

                <div className="relative">

                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 z-10" />

                  <Input
                    type="text"
                    placeholder="Full Name"
                    value={fullName}
                    autoComplete="name"
                    onChange={(e) => {
                      setFullName(
                        e.target.value
                      );

                      setError('');
                    }}
                    required
                    className={
                      inputClass
                    }
                  />

                </div>


                {/* =================================================
                    EMAIL
                ================================================= */}

                <div className="relative">

                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 z-10" />

                  <Input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    autoComplete="email"
                    onChange={(e) => {
                      setEmail(
                        e.target.value
                      );

                      setError('');
                    }}
                    required
                    className={
                      inputClass
                    }
                  />

                </div>


                {/* =================================================
                    COUNTRY
                ================================================= */}

                <div className="relative">

                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 z-10 pointer-events-none" />

                  <select
                    value={country}
                    onChange={(e) => {
                      setCountry(
                        e.target.value
                      );

                      // Reset number because
                      // country validation changed
                      setPhoneNumber('');

                      setError('');
                    }}
                    required
<<<<<<< HEAD
                    className="w-full appearance-none bg-white/5 border border-transparent focus:border-[#B76E79]/70 text-white h-11 rounded-md pl-10 pr-3 text-sm outline-none transition-all duration-300 focus:bg-white/10"
=======
                    className="w-full appearance-none bg-white/5 border border-transparent focus:border-white/20 text-white h-11 rounded-md pl-10 pr-3 text-sm outline-none transition-all duration-300 focus:bg-white/10"
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                  >

                    <option
                      value=""
                      className="bg-black text-white"
                    >
                      Select Country
                    </option>

                    {countries.map(
                      (countryName) => (
                        <option
                          key={
                            countryName
                          }
                          value={
                            countryName
                          }
                          className="bg-black text-white"
                        >
                          {countryName}
                        </option>
                      )
                    )}

                  </select>

                </div>


                {/* =================================================
                    PHONE
                ================================================= */}

                <div className="flex gap-2">

                  {/* COUNTRY CODE */}

                  <div className="h-11 min-w-[76px] px-3 rounded-md bg-white/5 border border-transparent flex items-center justify-center text-white/70 text-sm select-none">
                    {callingCode ||
                      '+--'}
                  </div>


                  {/* NUMBER */}

                  <div className="relative flex-1">

                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 z-10" />

                    <Input
                      type="tel"
                      inputMode="numeric"
                      autoComplete="tel-national"
                      placeholder={
                        country
                          ? 'Phone Number'
                          : 'Select country first'
                      }
                      value={
                        phoneNumber
                      }
                      disabled={
                        !country
                      }
                      maxLength={15}
                      onChange={(e) => {
                        const digitsOnly =
                          e.target.value.replace(
                            /\D/g,
                            ''
                          );

                        setPhoneNumber(
                          digitsOnly
                        );

                        setError('');
                      }}
                      onPaste={(e) => {
                        const pasted =
                          e.clipboardData.getData(
                            'text'
                          );

                        if (
                          /\D/.test(
                            pasted
                          )
                        ) {
                          e.preventDefault();

                          const digits =
                            pasted.replace(
                              /\D/g,
                              ''
                            );

                          setPhoneNumber(
                            digits.slice(
                              0,
                              15
                            )
                          );
                        }
                      }}
                      required
                      className={`${inputClass} disabled:opacity-50`}
                    />

                  </div>

                </div>


                {/* =================================================
                    PASSWORD
                ================================================= */}

                <div className="relative">

                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 z-10" />

                  <Input
                    type={
                      showPassword
                        ? 'text'
                        : 'password'
                    }
                    placeholder="Password"
                    value={password}
                    autoComplete="new-password"
                    onChange={(e) => {
                      setPassword(
                        e.target.value
                      );

                      setError('');
                    }}
                    required
                    className={`${inputClass} pr-10`}
                  />

                  <button
                    type="button"
                    aria-label={
                      showPassword
                        ? 'Hide password'
                        : 'Show password'
                    }
                    onClick={() =>
                      setShowPassword(
                        (current) =>
                          !current
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >

                    {showPassword ? (
                      <Eye className="w-4 h-4 text-white/40 hover:text-white" />
                    ) : (
                      <EyeClosed className="w-4 h-4 text-white/40 hover:text-white" />
                    )}

                  </button>

                </div>


                {/* =================================================
                    PASSWORD STRENGTH
                ================================================= */}

                {password.length > 0 && (
                  <div className="space-y-2 px-0.5">
<<<<<<< HEAD

                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">

=======
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                      <motion.div
                        initial={false}
                        animate={{
                          width: `${Math.max(
                            20,
                            passwordStrengthCount * 20
                          )}%`,
                        }}
                        transition={{
                          duration: 0.25,
                        }}
                        className={`h-full rounded-full transition-colors duration-300 ${
                          isStrongPassword
                            ? 'bg-green-500'
                            : 'bg-red-500'
                        }`}
                      />
<<<<<<< HEAD

                    </div>

                    <div className="flex items-center justify-between gap-3">

=======
                    </div>

                    <div className="flex items-center justify-between gap-3">
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                      <p
                        className={`text-[11px] font-medium ${
                          isStrongPassword
                            ? 'text-green-400'
                            : 'text-red-400'
                        }`}
                      >
                        {isStrongPassword
                          ? 'Strong Password'
                          : 'Weak Password'}
                      </p>

                      <p className="text-[10px] text-white/35">
                        8+ chars • A-Z • a-z • 0-9 • special
                      </p>
<<<<<<< HEAD

                    </div>

=======
                    </div>
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                  </div>
                )}


                {/* =================================================
                    CONFIRM PASSWORD
                ================================================= */}

                <div className="relative">

                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 z-10" />

                  <Input
                    type={
                      showConfirmPassword
                        ? 'text'
                        : 'password'
                    }
                    placeholder="Confirm Password"
                    value={
                      confirmPassword
                    }
                    autoComplete="new-password"
                    onChange={(e) => {
                      setConfirmPassword(
                        e.target.value
                      );

                      setError('');
                    }}
                    required
                    className={`${inputClass} pr-10`}
                  />

                  <button
                    type="button"
                    aria-label={
                      showConfirmPassword
                        ? 'Hide confirm password'
                        : 'Show confirm password'
                    }
                    onClick={() =>
                      setShowConfirmPassword(
                        (current) =>
                          !current
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >

                    {showConfirmPassword ? (
                      <Eye className="w-4 h-4 text-white/40 hover:text-white" />
                    ) : (
                      <EyeClosed className="w-4 h-4 text-white/40 hover:text-white" />
                    )}

                  </button>

                </div>


                {/* =================================================
                    ERROR MESSAGE
                ================================================= */}

                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{
                        opacity: 0,
                        y: -5,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      exit={{
                        opacity: 0,
                        y: -5,
                      }}
                      className="rounded-md border border-red-500/20 bg-red-500/10 px-3 py-2"
                    >
                      <p className="text-red-400 text-xs text-center break-words">
                        {error}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>


                {/* =================================================
                    SIGN UP BUTTON
                ================================================= */}

                <motion.button
                  whileHover={
                    !isLoading
                      ? {
                          scale: 1.02,
                        }
                      : {}
                  }
                  whileTap={
                    !isLoading
                      ? {
                          scale: 0.98,
                        }
                      : {}
                  }
                  type="submit"
                  disabled={
                    isLoading ||
                    !!successData
                  }
                  className="w-full relative group/button mt-5 disabled:opacity-70 disabled:cursor-not-allowed"
                >

<<<<<<< HEAD
                  <div className="absolute inset-0 bg-[#B76E79]/30 rounded-lg blur-lg opacity-0 group-hover/button:opacity-70 transition-opacity duration-300" />

                  <div className="relative overflow-hidden bg-[#B76E79] hover:bg-[#8F4F5A] text-white font-medium h-11 rounded-lg flex items-center justify-center transition-colors duration-300">
=======
                  <div className="absolute inset-0 bg-white/10 rounded-lg blur-lg opacity-0 group-hover/button:opacity-70 transition-opacity duration-300" />

                  <div className="relative overflow-hidden bg-white text-black font-medium h-11 rounded-lg flex items-center justify-center">
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

                    <AnimatePresence
                      mode="wait"
                    >

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
                          className="flex items-center gap-2"
                        >

<<<<<<< HEAD
                          <div className="w-4 h-4 border-2 border-white/70 border-t-transparent rounded-full animate-spin" />
=======
                          <div className="w-4 h-4 border-2 border-black/70 border-t-transparent rounded-full animate-spin" />
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

                          <span className="text-sm">
                            Creating Account...
                          </span>

                        </motion.div>

                      ) : (

                        <motion.span
                          key="signup"
                          className="flex items-center justify-center gap-2 text-sm font-medium"
                        >

                          Create Account

                          <ArrowRight className="w-4 h-4 group-hover/button:translate-x-1 transition-transform duration-300" />

                        </motion.span>

                      )}

                    </AnimatePresence>

                  </div>

                </motion.button>


                {/* =================================================
                    SIGN IN LINK
                ================================================= */}

                <motion.p
                  className="text-center text-xs text-white/60 mt-5"
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

                  Already have an account?{' '}

                  <Link
                    to="/signin"
                    className="relative inline-block group/signin"
                  >

<<<<<<< HEAD
                    <span className="relative z-10 text-[#D99AA3] group-hover/signin:text-[#FFE5E8] transition-colors duration-300 font-medium">
                      Sign In
                    </span>

                    <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#D99AA3] group-hover/signin:w-full transition-all duration-300" />
=======
                    <span className="relative z-10 text-white group-hover/signin:text-white/70 transition-colors duration-300 font-medium">
                      Sign In
                    </span>

                    <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-white group-hover/signin:w-full transition-all duration-300" />
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

                  </Link>

                </motion.p>

              </form>


              {/* =================================================
                  SUCCESS OVERLAY
              ================================================= */}

              <AnimatePresence>
                {successData && (

                  <motion.div
                    initial={{
                      opacity: 0,
                    }}
                    animate={{
                      opacity: 1,
                    }}
                    exit={{
                      opacity: 0,
                    }}
                    className="absolute inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-6"
                  >

                    <motion.div
                      initial={{
                        opacity: 0,
                        scale: 0.85,
                        y: 20,
                      }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                        y: 0,
                      }}
                      transition={{
                        type: 'spring',
                        duration: 0.6,
                      }}
                      className="w-full text-center space-y-5"
                    >

                      {/* CHECK */}

                      <motion.div
                        initial={{
                          scale: 0,
                          rotate: -30,
                        }}
                        animate={{
                          scale: 1,
                          rotate: 0,
                        }}
                        transition={{
                          type: 'spring',
                          delay: 0.15,
                        }}
                        className="mx-auto w-16 h-16 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center"
                      >

                        <Check className="w-8 h-8 text-green-400" />

                      </motion.div>


                      {/* TITLE */}

                      <div>

                        <h2 className="text-white text-xl font-bold">
                          Registration Successful
                        </h2>

                        <p className="text-white/60 text-xs mt-2">
                          Your AdsPromoHub account has been created successfully.
                        </p>

                      </div>


                      {/* CUSTOMER ID */}

<<<<<<< HEAD
                      <div className="rounded-xl border border-[#D99AA3]/30 bg-[#B76E79]/10 p-4">
=======
                      <div className="rounded-xl border border-purple-400/20 bg-purple-500/10 p-4">
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

                        <p className="text-white/50 text-xs">
                          Your Customer ID
                        </p>

<<<<<<< HEAD
                        <p className="text-[#FFE5E8] text-2xl font-bold tracking-wider mt-2 break-all">
=======
                        <p className="text-white text-2xl font-bold tracking-wider mt-2 break-all">
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                          {successData.customerId}
                        </p>

                      </div>


                      {/* SAVE MESSAGE */}

                      <div className="rounded-lg border border-white/10 bg-white/5 px-4 py-3">

                        <p className="text-white/70 text-xs leading-5">
                          Please save your Customer ID.
                          You can sign in using your
                          <span className="text-white font-medium">
                            {' '}Email Address{' '}
                          </span>
                          or
                          <span className="text-white font-medium">
                            {' '}Customer ID
                          </span>
                          .
                        </p>

                      </div>


                      {/* CONTINUE */}

                      <motion.button
                        whileHover={{
                          scale: 1.02,
                        }}
                        whileTap={{
                          scale: 0.98,
                        }}
                        type="button"
                        onClick={() =>
                          navigate(
                            '/signin',
                            {
                              replace:
                                true,
                            }
                          )
                        }
<<<<<<< HEAD
                        className="w-full h-11 rounded-lg bg-[#B76E79] hover:bg-[#8F4F5A] text-white text-sm font-medium flex items-center justify-center gap-2 transition-colors duration-300"
=======
                        className="w-full h-11 rounded-lg bg-white text-black text-sm font-medium flex items-center justify-center gap-2"
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                      >

                        Continue to Sign In

                        <ArrowRight className="w-4 h-4" />

                      </motion.button>


                      <p className="text-white/40 text-[11px]">
                        Redirecting automatically to Sign In...
                      </p>

                    </motion.div>

                  </motion.div>

                )}
              </AnimatePresence>

            </div>

          </div>

        </motion.div>

      </motion.div>

    </div>
  );
}