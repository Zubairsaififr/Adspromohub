<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
import React, { useRef } from "react";
import {
  ChevronRight,
  ChevronLeft,
  Globe2,
  Play,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

/* =========================================================
   BACKGROUND POSTERS
========================================================= */

const posters = [
  "/net.png",
  "/net.png",
  "/net.png",
  "/net.png",
  "/net.png",
  "/net.png",
  "/net.png",
  "/net.png",
  "/net.png",
];

/* =========================================================
   TRENDING ADS
========================================================= */

const trending = [
  {
    id: 1,
    title: "AIIMS",
    image: "/Images/1.jpg",
  },
  {
    id: 2,
    title: "Burger",
    image: "/Images/2.webp",
  },
  {
    id: 3,
    title: "Ice cone",
    image: "/Images/e.jpg",
  },
  {
    id: 4,
    title: "Forties",
    image: "/Images/f.jpg",
  },
  {
    id: 5,
    title: "Burger King",
    image: "/Images/b.webp",
  },
  {
    id: 6,
    title: "Car showrom",
    image: "/Images/c.png",
  },
  {
    id: 7,
    title: "New Stories",
    image: "/Images/d.webp",
  },
  {
    id: 8,
    title: "Vivo",
    image: "/Images/g.png",
  },
  {
    id: 9,
    title: "Fashion",
    image: "/Images/h.png",
  },
  {
    id: 10,
    title: "Sale",
    image: "/Images/j.png",
  },
  {
    id: 11,
    title: "Real State",
    image: "/Images/i.png",
  },
  {
    id: 12,
    title: "Tranding wears",
    image: "/Images/k.png",
  },
  {
    id: 13,
    title: "Restaurants",
    image: "/Images/l.png",
  },
  {
    id: 14,
    title: "Tour and Travels",
    image: "/Images/m.png",
  },
];

/* =========================================================
   HERO COMPONENT
========================================================= */

const Hero: React.FC = () => {
<<<<<<< HEAD
=======
  /*
   * IMPORTANT:
   * useNavigate MUST be inside the component.
   */
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
  const navigate = useNavigate();

  const sliderRef = useRef<HTMLDivElement>(null);

  /* =======================================================
     SLIDER
  ======================================================= */

  const scrollSlider = (direction: "left" | "right") => {
    if (!sliderRef.current) return;

    const amount = direction === "left" ? -500 : 500;

    sliderRef.current.scrollBy({
      left: amount,
      behavior: "smooth",
    });
  };

  /* =======================================================
     BRAND PROMO NAVIGATION
  ======================================================= */

  const handleBrandPromo = () => {
    navigate("/brandpromo");
  };

  /* =======================================================
     EXPLORE TRENDING
  ======================================================= */

  const handleExploreTrending = () => {
    const section = document.getElementById("trending");

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <section
      id="services"
<<<<<<< HEAD
      className="
        relative
        min-h-screen
        overflow-hidden
        bg-[#120B0D]
        text-white
      "
=======
      className="relative min-h-screen overflow-hidden bg-[#05020d] text-white"
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
    >
      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div className="absolute inset-0 overflow-hidden">
<<<<<<< HEAD

        {/* Poster Collage */}
        <div
          className="
            absolute
            inset-0
            grid
            grid-cols-3
            gap-2
            scale-110
            rotate-[-5deg]
            opacity-35
=======
        {/* Poster Collage */}

        <div
          className="
            absolute inset-0
            grid grid-cols-3
            gap-2
            scale-110
            rotate-[-5deg]
            opacity-40
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
            sm:grid-cols-4
            lg:grid-cols-5
          "
        >
          {[...posters, ...posters, ...posters].map(
            (poster, index) => (
              <div
                key={index}
                className="
                  h-44
                  overflow-hidden
                  rounded-xl
                  sm:h-52
                  lg:h-64
                "
              >
                <img
                  src={poster}
                  alt=""
<<<<<<< HEAD
                  className="
                    h-full
                    w-full
                    object-cover
                  "
=======
                  className="h-full w-full object-cover"
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                />
              </div>
            )
          )}
        </div>

<<<<<<< HEAD
        {/* Dark Rose Overlay */}
        <div
          className="
            absolute
            inset-0
            bg-[#120B0D]/70
          "
        />

        {/* Rose Gold Radial Gradient */}
        <div
          className="
            absolute
            inset-0
            bg-[radial-gradient(circle_at_50%_40%,rgba(183,110,121,0.30),transparent_45%)]
          "
        />

        {/* Light Rose Gradient */}
        <div
          className="
            absolute
            inset-0
            bg-[radial-gradient(circle_at_15%_70%,rgba(217,154,163,0.14),transparent_35%)]
=======
        {/* Dark Overlay */}

        <div className="absolute inset-0 bg-black/75" />

        {/* Purple Gradient */}

        <div
          className="
            absolute inset-0
            bg-[radial-gradient(circle_at_50%_40%,rgba(139,92,246,0.35),transparent_45%)]
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
          "
        />

        {/* Bottom Gradient */}
<<<<<<< HEAD
        <div
          className="
            absolute
            inset-0
            bg-gradient-to-b
            from-[#120B0D]/90
            via-[#120B0D]/45
            to-[#120B0D]
          "
        />

        {/* Rose Gold Glow */}
=======

        <div
          className="
            absolute inset-0
            bg-gradient-to-b
            from-black/80
            via-black/40
            to-[#05020d]
          "
        />

        {/* Glow */}

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
        <div
          className="
            absolute
            left-1/2
            top-1/3
            h-[400px]
            w-[400px]
            -translate-x-1/2
            rounded-full
<<<<<<< HEAD
            bg-[#B76E79]/20
=======
            bg-purple-600/20
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
            blur-[140px]
          "
        />
      </div>

      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <header
        className="
          relative
          z-20
          flex
          items-center
          justify-between
          px-5
          py-5
          sm:px-8
          lg:px-12
        "
      >
        {/* Left side */}
<<<<<<< HEAD
        <div />

        {/* Right Navbar */}
        <div className="flex items-center gap-2 sm:gap-4">

          {/* Mobile Language */}
=======

        <div />

        {/* Right Navbar */}

        <div className="flex items-center gap-2 sm:gap-4">
          {/* Mobile Language */}

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
          <button
            type="button"
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-lg
              border
<<<<<<< HEAD
              border-[#D99AA3]/25
              bg-[#B76E79]/10
              text-[#F1C7CD]
              backdrop-blur-md
              transition
              hover:border-[#D99AA3]/50
              hover:bg-[#B76E79]/20
=======
              border-white/20
              bg-black/30
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
              sm:hidden
            "
          >
            <Globe2 size={17} />
          </button>
        </div>
      </header>

      {/* =====================================================
          HERO CONTENT
      ===================================================== */}

      <div
        className="
          relative
          z-10
          flex
          min-h-[620px]
          items-center
          justify-center
          px-5
          pb-20
          pt-10
          sm:min-h-[680px]
          lg:min-h-[700px]
        "
      >
        <div className="mx-auto w-full max-w-4xl text-center">
<<<<<<< HEAD

          {/* Badge */}
=======
          {/* Badge */}

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
          <div
            className="
              mb-6
              inline-flex
              items-center
              gap-2
              rounded-full
              border
<<<<<<< HEAD
              border-[#D99AA3]/30
              bg-[#B76E79]/10
=======
              border-purple-400/30
              bg-purple-500/10
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
              px-4
              py-2
              text-xs
              font-semibold
<<<<<<< HEAD
              text-[#F1C7CD]
=======
              text-purple-200
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
              backdrop-blur-md
              sm:text-sm
            "
          >
            <span
              className="
                h-2
                w-2
                animate-pulse
                rounded-full
<<<<<<< HEAD
                bg-[#D99AA3]
=======
                bg-purple-400
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
              "
            />

            Promote • Watch • Earn
          </div>

          {/* Heading */}
<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
          <h1
            className="
              text-4xl
              font-black
              leading-[1.05]
              tracking-tight
              sm:text-5xl
              lg:text-5xl
            "
          >
            Turn Your Ads Into Real Growth.

            <br />

            <span
              className="
                bg-gradient-to-r
<<<<<<< HEAD
                from-[#8F4F5A]
                via-[#D99AA3]
                to-[#FFE5E8]
=======
                from-purple-300
                via-fuchsia-400
                to-white
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                bg-clip-text
                text-transparent
              "
            >
              Promote Smarter. Reach Wider. Grow Faster.
            </span>
          </h1>

          {/* Description */}
<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
          <p
            className="
              mx-auto
              mt-7
              max-w-2xl
              text-base
              leading-7
              text-white/75
              sm:text-lg
              sm:leading-8
            "
          >
            Want to promote your ads? Choose a subscription plan
            and reach a wider audience with AdsPromoHub.

            <br className="hidden sm:block" />

            Start growing your reach and earning opportunities
            today.

            <br className="hidden sm:block" />

            Start Now Your Free Trial
          </p>

          {/* =================================================
              BRAND PROMO CTA
          ================================================= */}

          <div
            className="
              mx-auto
              mt-8
              flex
              max-w-2xl
              flex-col
              gap-3
              sm:flex-row
              sm:justify-center
            "
          >
            <button
              type="button"
              onClick={handleBrandPromo}
              className="
                group
                flex
                h-14
                w-full
                items-center
                justify-center
                gap-3
                rounded-xl
<<<<<<< HEAD

                bg-gradient-to-r
                from-[#8F4F5A]
                via-[#B76E79]
                to-[#C9828C]

                px-7
                font-bold

                shadow-xl
                shadow-[#8F4F5A]/40

                transition
                duration-300

                hover:-translate-y-1
                hover:shadow-[#B76E79]/40

=======
                bg-gradient-to-r
                from-purple-600
                to-fuchsia-600
                px-7
                font-bold
                shadow-xl
                shadow-purple-900/40
                transition
                duration-300
                hover:-translate-y-1
                hover:shadow-purple-500/30
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                sm:w-auto
              "
            >
              Start Your Free Trial

              <ChevronRight
                size={22}
                className="
                  transition-transform
                  duration-300
                  group-hover:translate-x-1
                "
              />
            </button>
          </div>

          {/* =================================================
              EXPLORE TRENDING
          ================================================= */}

          <button
            type="button"
            onClick={handleExploreTrending}
            className="
              mx-auto
              mt-5
              flex
              items-center
              gap-2
              text-sm
              font-medium
              text-white/70
              transition
<<<<<<< HEAD
              hover:text-[#D99AA3]
=======
              hover:text-purple-300
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
            "
          >
            <span
              className="
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-full
                border
<<<<<<< HEAD
                border-[#B76E79]/50
                bg-[#B76E79]/10
=======
                border-purple-400/50
                bg-purple-500/10
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
              "
            >
              <Play
                size={13}
                fill="currentColor"
              />
            </span>

            Explore what's trending
          </button>
        </div>
      </div>

      {/* =====================================================
          TRENDING
      ===================================================== */}

      <div
        id="trending"
        className="
          relative
          z-20
          -mt-8
          scroll-mt-10
          pb-10
        "
      >
<<<<<<< HEAD
        {/* Rose Gold curved line */}
=======
        {/* Purple curved line */}

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
        <div
          className="
            absolute
            left-0
            right-0
            top-0
            h-16
            overflow-hidden
          "
        >
          <div
            className="
              absolute
              left-[-5%]
              top-4
              h-16
              w-[110%]
              rounded-[50%]
              border-t-4
<<<<<<< HEAD
              border-[#B76E79]
              shadow-[0_-5px_30px_rgba(183,110,121,0.35)]
=======
              border-purple-500
              shadow-[0_-5px_30px_rgba(168,85,247,0.35)]
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
            "
          />
        </div>

        <div
          className="
            relative
            mx-auto
            max-w-[1500px]
            px-5
            pt-16
            sm:px-8
            lg:px-12
          "
        >
          {/* Section Header */}
<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p
                className="
                  mb-1
                  text-xs
                  font-semibold
                  uppercase
                  tracking-[3px]
<<<<<<< HEAD
                  text-[#D99AA3]
=======
                  text-purple-400
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                "
              >
                Discover
              </p>

              <h2
                className="
                  text-2xl
                  font-bold
                  sm:text-3xl
                "
              >
                Our Trending Advertisements
              </h2>
            </div>

            {/* Arrows */}
<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
            <div className="hidden gap-2 sm:flex">
              <button
                type="button"
                onClick={() => scrollSlider("left")}
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-full
                  border
<<<<<<< HEAD
                  border-[#D99AA3]/20
                  bg-[#B76E79]/5
                  transition

                  hover:border-[#B76E79]
                  hover:bg-[#B76E79]/20
=======
                  border-white/20
                  bg-white/5
                  transition
                  hover:border-purple-400
                  hover:bg-purple-500/20
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                "
              >
                <ChevronLeft size={20} />
              </button>

              <button
                type="button"
                onClick={() => scrollSlider("right")}
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-full
                  border
<<<<<<< HEAD
                  border-[#D99AA3]/20
                  bg-[#B76E79]/5
                  transition

                  hover:border-[#B76E79]
                  hover:bg-[#B76E79]/20
=======
                  border-white/20
                  bg-white/5
                  transition
                  hover:border-purple-400
                  hover:bg-purple-500/20
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                "
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          {/* =================================================
              SLIDER
          ================================================= */}

          <div
            ref={sliderRef}
            className="
              flex
              gap-5
              overflow-x-auto
              pb-5
              scrollbar-hide
            "
          >
            {trending.map((item) => (
              <div
                key={item.id}
                className="
                  group
                  relative
                  min-w-[150px]
                  sm:min-w-[190px]
                  lg:min-w-[220px]
                "
              >
                {/* Poster */}
<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                <div
                  className="
                    relative
                    h-[220px]
                    overflow-hidden
                    rounded-xl
                    border
                    border-white/10
<<<<<<< HEAD
                    bg-[#8F4F5A]/20
                    shadow-2xl
                    transition
                    duration-500

                    group-hover:-translate-y-2
                    group-hover:border-[#D99AA3]/50
                    group-hover:shadow-[#8F4F5A]/40

=======
                    bg-purple-950/30
                    shadow-2xl
                    transition
                    duration-500
                    group-hover:-translate-y-2
                    group-hover:border-purple-400/50
                    group-hover:shadow-purple-900/40
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                    sm:h-[270px]
                    lg:h-[310px]
                  "
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="
                      h-full
                      w-full
                      object-cover
                      transition
                      duration-700
                      group-hover:scale-110
                    "
                  />

                  {/* Image Overlay */}
<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                  <div
                    className="
                      absolute
                      inset-0
                      bg-gradient-to-t
                      from-black
                      via-transparent
                      to-transparent
                      opacity-80
                    "
                  />

<<<<<<< HEAD
                  {/* Rose Gold Image Glow */}
                  <div
                    className="
                      absolute
                      inset-0
                      bg-gradient-to-t
                      from-[#8F4F5A]/20
                      via-transparent
                      to-transparent
                      opacity-0
                      transition
                      duration-500
                      group-hover:opacity-100
                    "
                  />

                  {/* Rank */}
=======
                  {/* Rank */}

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                  <div
                    className="
                      absolute
                      bottom-[-8px]
                      left-[-8px]
                      text-[90px]
                      font-black
                      leading-none
                      text-transparent
<<<<<<< HEAD
                      [-webkit-text-stroke:2px_#D99AA3]
=======
                      [-webkit-text-stroke:2px_white]
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                      drop-shadow-xl
                      sm:text-[110px]
                    "
                  >
                    {item.id}
                  </div>

                  {/* Play */}
<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                  <div
                    className="
                      absolute
                      right-3
                      top-3
                      flex
                      h-9
                      w-9
                      scale-0
                      items-center
                      justify-center
                      rounded-full
<<<<<<< HEAD
                      bg-[#B76E79]
                      text-white
                      opacity-0
                      shadow-lg
                      shadow-[#8F4F5A]/40
                      transition
                      duration-300

=======
                      bg-purple-600
                      text-white
                      opacity-0
                      shadow-lg
                      transition
                      duration-300
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                      group-hover:scale-100
                      group-hover:opacity-100
                    "
                  >
                    <Play
                      size={15}
                      fill="currentColor"
                    />
                  </div>
                </div>

                {/* Title */}
<<<<<<< HEAD
=======

>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                <h3
                  className="
                    mt-3
                    truncate
                    text-sm
                    font-semibold
                    text-white/90
                    sm:text-base
                  "
                >
                  {item.title}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* =====================================================
<<<<<<< HEAD
          BOTTOM ROSE GOLD GLOW
=======
          BOTTOM PURPLE GLOW
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
      ===================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          bottom-0
          left-1/2
          h-32
          w-[70%]
          -translate-x-1/2
          rounded-full
<<<<<<< HEAD
          bg-[#B76E79]/20
=======
          bg-purple-700/20
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
          blur-[100px]
        "
      />
    </section>
  );
};

<<<<<<< HEAD
export default Hero;
=======
export default Hero;
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
