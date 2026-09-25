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
import UserDetailsCard  from './UserDetailsCard'

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
      "The Business Development Fund is designed to support your business growth and expansion. Get the financial support you need to explore new opportunities, strengthen your business and achieve bigger goals.",
    image: "/BD.jpeg",
    icon: <BriefcaseBusiness size={28} />,
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
      "The Travel Fund helps you turn your travel dreams into memorable experiences. Explore new destinations, experience different cultures and enjoy exciting adventures with greater financial freedom.",
    image: "/TF.png",
    icon: <Plane size={28} />,
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
    ],
  },
  {
    id: 4,
    title: "Home Fund",
    subtitle: "Build Your Dream Home",
    description:
      "The Home Fund helps you move closer to your dream home. Whether you are planning to purchase, build or upgrade your home, this fund supports your long-term lifestyle goals.",
    image: "/HF.png",
    icon: <Home size={28} />,
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
      "The Core Fund is focused on long-term financial growth and continuous benefits. Build a stronger financial foundation and create opportunities that can support your long-term goals.",
    image: "/CRF.jpeg",
    icon: <Crown size={28} />,
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
              Funds & Benefits
            </span>
          </h2>

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
            );
          })}
        </div>

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

      </div>
    </section>
  );
};

export default FundsSection;