import React from "react";
import {
  BriefcaseBusiness,
  Plane,
  Car,
  Home,
  Crown,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
<<<<<<< HEAD
import UserDetailsCard from "./UserDetailsCard";
=======
import UserDetailsCard  from './UserDetailsCard'
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

interface Fund {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  icon: React.ReactNode;
  benefits: string[];
}

const funds: Fund[] = [
  {
    id: 1,
    title: "Business Development Fund",
    subtitle: "Grow Your Business, Build Your Future",
    description:
<<<<<<< HEAD
      "The Business Development Fund is designed to support your business growth and expansion.",
    image: "/BDD.png",
    icon: <BriefcaseBusiness size={22} />,
=======
      "The Business Development Fund is designed to support your business growth and expansion. Get the financial support you need to explore new opportunities, strengthen your business and achieve bigger goals.",
    image: "/BD.jpeg",
    icon: <BriefcaseBusiness size={28} />,
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
    benefits: [
      "Business Expansion Support",
      "Marketing & Promotion",
      "New Opportunity Funding",
      "Long-Term Growth",
    ],
  },
  {
    id: 2,
    title: "Travel Fund",
    subtitle: "Explore The World, Create More Memories",
    description:
<<<<<<< HEAD
      "The Travel Fund helps you turn your travel dreams into memorable experiences.",
    image: "/Travel.png",
    icon: <Plane size={22} />,
=======
      "The Travel Fund helps you turn your travel dreams into memorable experiences. Explore new destinations, experience different cultures and enjoy exciting adventures with greater financial freedom.",
    image: "/TF.png",
    icon: <Plane size={28} />,
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
    benefits: [
      "International & Domestic Trips",
      "Hotel & Stay Support",
      "Adventure & Leisure",
      "Special Travel Packages",
    ],
  },
  {
    id: 3,
    title: "Car Fund",
<<<<<<< HEAD
    subtitle: "Drive Your Dreams, With Our Car Fund Support",
    description:
      "The Car Fund helps you own a car or upgrade your current vehicle with greater financial flexibility.",
    image: "/CAR.png",
    icon: <Car size={22} />,
    benefits: [
      "New Car Purchase",
      "Car Upgrade",
      "Better Lifestyle",
      "More Freedom",
=======
    subtitle: "Drive Your Dreams",
    description:
      "The Car Fund is designed to help you achieve your dream of owning a car or upgrading your current vehicle. Enjoy greater flexibility and move towards the lifestyle you desire.",
    image: "/CF.png",
    icon: <Car size={28} />,
    benefits: [
      "New Car Purchase",
      "Car Upgrade",
      "Flexible Support",
      "Drive Your Freedom",
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
    ],
  },
  {
    id: 4,
    title: "Home Fund",
    subtitle: "Build Your Dream Home",
    description:
<<<<<<< HEAD
      "The Home Fund helps you move closer to your dream home, whether you want to purchase, build or upgrade.",
    image: "/Home.png",
    icon: <Home size={22} />,
=======
      "The Home Fund helps you move closer to your dream home. Whether you are planning to purchase, build or upgrade your home, this fund supports your long-term lifestyle goals.",
    image: "/HF.png",
    icon: <Home size={28} />,
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
    benefits: [
      "Home Purchase Support",
      "Renovation & Upgrade",
      "Better Lifestyle",
      "Secure Future",
    ],
  },
  {
    id: 5,
    title: "Core Fund",
    subtitle: "Lifetime Royalty",
    description:
<<<<<<< HEAD
      "The Core Fund focuses on long-term financial growth and continuous benefits.",
    image: "/Core.png",
    icon: <Crown size={22} />,
    benefits: [
      "Lifetime Income",
      "Generational Wealth",
      "Financial Freedom",
      "Long-Term Security",
    ],
  },
  {
    id: 6,
    title: "Royality Fund",
    subtitle: "Lifetime Royalty",
    description:
      "The Core Fund focuses on long-term financial growth and continuous benefits.",
    image: "/Crown.png",
    icon: <Crown size={22} />,
=======
      "The Core Fund is focused on long-term financial growth and continuous benefits. Build a stronger financial foundation and create opportunities that can support your long-term goals.",
    image: "/CRF.jpeg",
    icon: <Crown size={28} />,
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
    benefits: [
      "Lifetime Income",
      "Generational Wealth",
      "Financial Freedom",
      "Long-Term Security",
    ],
  },
];

const FundsSection: React.FC = () => {
  return (
<<<<<<< HEAD
    <section className="relative overflow-hidden bg-gradient-to-br from-[#FFF9FA] via-[#FFF1F3] to-[#FCECEF] py-10 sm:py-14">
      <UserDetailsCard />

      {/* Soft Rose Gold Background Glow */}
      <div className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-[#D99AA3]/15 blur-3xl" />

      <div className="pointer-events-none absolute -right-24 top-1/3 h-80 w-80 rounded-full bg-[#E3AAB2]/15 blur-3xl" />

      <div className="pointer-events-none absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-[#B76E79]/10 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        {/* Heading */}
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#D99AA3]/40 bg-white/80 px-3 py-1.5 text-xs font-semibold text-[#8F4F5A] shadow-sm backdrop-blur-sm">
            <Crown size={14} />
            Your Growth, Our Priority
          </div>

          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
            Exclusive{" "}
            <span className="bg-gradient-to-r from-[#8F4F5A] via-[#B76E79] to-[#D99AA3] bg-clip-text text-transparent">
=======
    <section className="relative overflow-hidden bg-slate-50 py-20 sm:py-24">
      <UserDetailsCard />

      {/* Background Decorations */}
      <div className="pointer-events-none absolute left-0 top-20 h-72 w-72 rounded-full bg-purple-200/30 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-[40%] h-96 w-96 rounded-full bg-blue-200/30 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-[30%] h-80 w-80 rounded-full bg-pink-200/20 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="mx-auto mb-16 max-w-3xl text-center">

          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-purple-200 bg-white px-4 py-2 text-sm font-semibold text-purple-700 shadow-sm">
            <Crown size={16} />
            Your Growth, Our Priority
          </div>

          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Exclusive{" "}
            <span className="bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-500 bg-clip-text text-transparent">
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
              Funds & Benefits
            </span>
          </h2>

<<<<<<< HEAD
          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500">
            Explore our funds designed to support your ambitions, lifestyle and
            long-term goals.
          </p>
        </div>

        {/* Zig-Zag Cards */}
        <div className="space-y-5 sm:space-y-6">
          {funds.map((fund, index) => {
            const imageLeft = index % 2 !== 0;

            return (
              <article
                key={fund.id}
                className={`group relative overflow-hidden rounded-2xl border border-[#D99AA3]/25 bg-white/90 shadow-[0_8px_30px_rgba(143,79,90,0.08)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#B76E79]/35 hover:shadow-[0_20px_50px_rgba(183,110,121,0.16)] ${
                  imageLeft ? "md:mr-8 lg:mr-12" : "md:ml-8 lg:ml-12"
                }`}
              >
                <div
                  className={`grid min-h-[250px] md:grid-cols-2 ${
                    imageLeft ? "md:[&>*:first-child]:order-2" : ""
                  }`}
                >
                  {/* CONTENT */}
                  <div
                    className={`relative flex flex-col justify-center p-5 sm:p-7 lg:p-8 ${
                      imageLeft ? "md:order-2" : "md:order-1"
                    }`}
                  >
                    {/* Fund number */}
                    <div
                      className={`absolute top-5 flex h-7 min-w-7 items-center justify-center rounded-full border border-[#D99AA3]/25 bg-[#FFF1F3] px-2 text-[10px] font-extrabold text-[#8F4F5A] sm:top-6 ${
                        imageLeft ? "right-5" : "left-5"
                      }`}
                    >
                      {String(fund.id).padStart(2, "0")}
                    </div>

                    {/* Icon */}
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#8F4F5A] via-[#B76E79] to-[#D99AA3] text-white shadow-lg shadow-[#B76E79]/25 transition duration-300 group-hover:scale-110">
                      {fund.icon}
                    </div>

                    <h3 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
                      {fund.title}
                    </h3>

                    <p className="mt-1 text-xs font-bold text-[#8F4F5A] sm:text-sm">
                      {fund.subtitle}
                    </p>

                    <p className="mt-2 max-w-lg text-xs leading-5 text-slate-500 sm:text-sm sm:leading-6">
                      {fund.description}
                    </p>

                    {/* Benefits */}
                    <div className="mt-3 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                      {fund.benefits.map((benefit) => (
                        <div
                          key={benefit}
                          className="flex items-center gap-1.5 text-xs font-medium text-slate-700"
                        >
                          <CheckCircle2
                            size={14}
                            className="shrink-0 text-[#B76E79]"
                          />

                          <span>{benefit}</span>
                        </div>
                      ))}
                    </div>

                    {/* CTA */}
                    <button
                      type="button"
                      className="mt-4 inline-flex w-fit items-center gap-2 text-xs font-bold text-[#8F4F5A] transition-all hover:gap-3 hover:text-[#B76E79]"
                    >
                      View Details
                      <ArrowRight size={14} />
                    </button>
                  </div>

                  {/* IMAGE */}
                  <div
                    className={`relative min-h-[190px] overflow-hidden ${
                      imageLeft ? "md:order-1" : "md:order-2"
                    }`}
                  >
                    <img
                      src={fund.image}
                      alt={fund.title}
                      className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />

                    {/* Soft image overlay */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-r from-[#FFF9FA]/70 via-white/10 to-transparent ${
                        imageLeft ? "md:bg-gradient-to-l" : ""
                      }`}
                    />

                    {/* Rose Gold Image Tint */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#B76E79]/5 via-transparent to-[#D99AA3]/10 opacity-0 transition duration-500 group-hover:opacity-100" />

                    {/* Bottom image fade */}
                    <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#8F4F5A]/25 to-transparent" />

                    {/* Explore badge */}
                    <div className="absolute bottom-4 left-4 hidden items-center gap-1.5 rounded-full border border-[#D99AA3]/30 bg-white/90 px-3 py-1.5 text-[10px] font-bold text-[#8F4F5A] shadow-lg backdrop-blur-sm transition-all group-hover:border-[#B76E79]/40 group-hover:bg-[#FFF5F6] sm:flex">
                      Explore
                      <ArrowRight size={12} />
                    </div>
                  </div>
                </div>
              </article>
=======
          <p className="mt-5 text-base leading-7 text-slate-600 sm:text-lg">
            We believe in your dreams. Explore our exclusive funds designed to
            support your ambitions, lifestyle and long-term goals.
          </p>
        </div>

        {/* Funds */}
        <div className="space-y-8 lg:space-y-10">

          {funds.map((fund, index) => {
            const reverse = index % 2 !== 0;

            return (
              <div
                key={fund.id}
                className="group relative"
              >
                <div
                  className={`
                    relative overflow-hidden rounded-3xl border border-white
                    bg-white/90 p-4 shadow-[0_15px_50px_rgba(15,23,42,0.08)]
                    backdrop-blur-sm transition-all duration-500
                    hover:-translate-y-2 hover:shadow-[0_25px_70px_rgba(79,70,229,0.16)]
                    sm:p-6 lg:p-7
                  `}
                >

                  {/* Number */}
                  <div
                    className={`
                      absolute top-5 z-10 flex h-11 w-11 items-center
                      justify-center rounded-xl text-sm font-black text-white
                      shadow-lg sm:top-7
                      ${
                        reverse
                          ? "left-5 bg-gradient-to-br from-emerald-400 to-cyan-500 sm:left-7"
                          : "right-5 bg-gradient-to-br from-indigo-500 to-purple-600 sm:right-7"
                      }
                    `}
                  >
                    {String(fund.id).padStart(2, "0")}
                  </div>

                  <div
                    className={`
                      grid items-center gap-7 lg:grid-cols-2 lg:gap-12
                      ${reverse ? "lg:flex-row-reverse" : ""}
                    `}
                  >

                    {/* IMAGE */}
                    <div
                      className={`
                        relative overflow-hidden rounded-2xl
                        ${
                          reverse
                            ? "lg:order-1"
                            : "lg:order-2"
                        }
                      `}
                    >

                      {/* Glow */}
                      <div className="absolute -inset-3 rounded-3xl bg-gradient-to-r from-purple-400/20 via-blue-400/20 to-pink-400/20 opacity-0 blur-2xl transition duration-500 group-hover:opacity-100" />

                      <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-slate-100">

                        <img
                          src={fund.image}
                          alt={fund.title}
                          className="
                            h-full w-full object-cover
                            transition duration-700
                            group-hover:scale-105
                          "
                        />

                        {/* Image Overlay */}
                        <div className="
                          absolute inset-0
                          bg-gradient-to-t from-slate-950/30
                          via-transparent to-transparent
                          opacity-70
                        " />

                        {/* Floating Icon */}
                        <div className="
                          absolute bottom-4 left-4
                          flex h-12 w-12 items-center justify-center
                          rounded-xl bg-white/90 text-indigo-600
                          shadow-xl backdrop-blur-md
                          transition duration-500
                          group-hover:scale-110 group-hover:rotate-3
                        ">
                          {fund.icon}
                        </div>

                        {/* Explore Badge */}
                        <div className="
                          absolute right-4 bottom-4
                          hidden items-center gap-2 rounded-full
                          bg-white/90 px-4 py-2 text-xs font-bold
                          text-slate-800 shadow-lg backdrop-blur-md
                          sm:flex
                        ">
                          Explore
                          <ArrowRight size={14} />
                        </div>
                      </div>
                    </div>

                    {/* CONTENT */}
                    <div
                      className={`
                        px-2 pb-3 sm:px-3 lg:pb-0
                        ${
                          reverse
                            ? "lg:order-2"
                            : "lg:order-1"
                        }
                      `}
                    >

                      {/* Icon */}
                      <div className="
                        mb-5 inline-flex h-14 w-14 items-center
                        justify-center rounded-2xl
                        bg-gradient-to-br from-indigo-500 to-purple-600
                        text-white shadow-lg shadow-indigo-200
                        transition duration-500
                        group-hover:scale-110
                      ">
                        {fund.icon}
                      </div>

                      {/* Title */}
                      <h3 className="
                        text-2xl font-extrabold tracking-tight
                        text-slate-900 sm:text-3xl
                      ">
                        {fund.title}
                      </h3>

                      {/* Subtitle */}
                      <p className="
                        mt-2 text-sm font-bold
                        text-indigo-600 sm:text-base
                      ">
                        {fund.subtitle}
                      </p>

                      {/* Description */}
                      <p className="
                        mt-5 text-sm leading-7 text-slate-600
                        sm:text-base
                      ">
                        {fund.description}
                      </p>

                      {/* Benefits */}
                      <div className="
                        mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2
                      ">
                        {fund.benefits.map((benefit) => (
                          <div
                            key={benefit}
                            className="
                              flex items-center gap-2
                              text-sm font-medium text-slate-700
                            "
                          >
                            <CheckCircle2
                              size={18}
                              className="shrink-0 text-indigo-500"
                            />
                            <span>{benefit}</span>
                          </div>
                        ))}
                      </div>

                    </div>
                  </div>
                </div>
              </div>
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
            );
          })}
        </div>

<<<<<<< HEAD
        <div className="mt-7 text-center text-xs font-medium text-[#8F4F5A]/60">
          ↓ &nbsp; Scroll to explore more &nbsp; ↓
        </div>
=======
        {/* Bottom */}
        <div className="mt-14 flex justify-center">
          <div className="
            flex items-center gap-2 rounded-full
            border border-slate-200 bg-white px-5 py-3
            text-sm font-semibold text-slate-600
            shadow-sm
          ">
            <span className="animate-bounce">↓</span>
            Scroll to explore more
            <span className="animate-bounce">↓</span>
          </div>
        </div>

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
      </div>
    </section>
  );
};

export default FundsSection;