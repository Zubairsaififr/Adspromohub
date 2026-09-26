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
import UserDetailsCard from "./UserDetailsCard";

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
      "The Business Development Fund is designed to support your business growth and expansion.",
    image: "/BDD.png",
    icon: <BriefcaseBusiness size={22} />,
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
      "The Travel Fund helps you turn your travel dreams into memorable experiences.",
    image: "/Travel.png",
    icon: <Plane size={22} />,
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
    ],
  },
  {
    id: 4,
    title: "Home Fund",
    subtitle: "Build Your Dream Home",
    description:
      "The Home Fund helps you move closer to your dream home, whether you want to purchase, build or upgrade.",
    image: "/Home.png",
    icon: <Home size={22} />,
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
              Funds & Benefits
            </span>
          </h2>

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
            );
          })}
        </div>

        <div className="mt-7 text-center text-xs font-medium text-[#8F4F5A]/60">
          ↓ &nbsp; Scroll to explore more &nbsp; ↓
        </div>
      </div>
    </section>
  );
};

export default FundsSection;