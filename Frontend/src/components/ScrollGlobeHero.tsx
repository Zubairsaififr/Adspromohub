import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import BrandGlobe from "./ui/BrandGlobe";
import { cn } from "../lib/utils";
import type { SectionData, GlobeConfig } from "../types";
import {
  Sparkles,
  ArrowRight,
<<<<<<< HEAD
=======
 
  
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
  Play,
} from "lucide-react";

interface ScrollGlobeHeroProps {
  sections: SectionData[];
  globeConfig?: GlobeConfig;
  className?: string;
  onOpenAdSimulator: () => void;
  onOpenCalculator: () => void;
  onOpenPlans: () => void;
}

const defaultGlobeConfig: GlobeConfig = {
  positions: [
    { top: "50%", left: "75%", scale: 1.25 },
    { top: "30%", left: "50%", scale: 0.95 },
    { top: "20%", left: "82%", scale: 1.6 },
    { top: "52%", left: "50%", scale: 1.5 },
  ],
};

const parsePercent = (value: string): number => {
  return parseFloat(value.replace("%", ""));
};

export const ScrollGlobeHero: React.FC<ScrollGlobeHeroProps> = ({
  sections,
  globeConfig = defaultGlobeConfig,
  className,
  onOpenAdSimulator,
  onOpenCalculator,
  onOpenPlans,
}) => {
  const [activeSection, setActiveSection] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [globeTransform, setGlobeTransform] = useState("");
<<<<<<< HEAD

=======
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const animationFrameId = useRef<number | null>(null);

  const calculatedPositions = useMemo(() => {
    return globeConfig.positions.map((position) => ({
      top: parsePercent(position.top),
      left: parsePercent(position.left),
      scale: position.scale,
    }));
  }, [globeConfig.positions]);

  const updateScrollPosition = useCallback(() => {
    const scrollTop = window.pageYOffset;
<<<<<<< HEAD

    const docHeight =
      document.documentElement.scrollHeight - window.innerHeight;

    const progress =
      docHeight > 0
        ? Math.min(Math.max(scrollTop / docHeight, 0), 1)
        : 0;

    setScrollProgress(progress);

    const viewportCenter = window.innerHeight / 2;

=======
    const docHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const progress =
      docHeight > 0 ? Math.min(Math.max(scrollTop / docHeight, 0), 1) : 0;
    setScrollProgress(progress);

    const viewportCenter = window.innerHeight / 2;
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
    let newActiveSection = 0;
    let minDistance = Infinity;

    sectionRefs.current.forEach((ref, index) => {
      if (!ref) return;
<<<<<<< HEAD

=======
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
      const rect = ref.getBoundingClientRect();
      const sectionCenter = rect.top + rect.height / 2;
      const distance = Math.abs(sectionCenter - viewportCenter);

      if (distance < minDistance) {
        minDistance = distance;
        newActiveSection = index;
      }
    });

    const currentPosition =
      calculatedPositions[
<<<<<<< HEAD
        Math.min(
          newActiveSection,
          calculatedPositions.length - 1
        )
=======
        Math.min(newActiveSection, calculatedPositions.length - 1)
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
      ];

    if (currentPosition) {
      const isMobile = window.innerWidth < 768;
<<<<<<< HEAD

      const xPos = isMobile
        ? 50
        : currentPosition.left;

      const yPos = isMobile
        ? newActiveSection === 0
          ? 70
          : 35
        : currentPosition.top;

=======
      const xPos = isMobile ? 50 : currentPosition.left;
      const yPos = isMobile
        ? (newActiveSection === 0 ? 70 : 35)
        : currentPosition.top;
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
      const scale = isMobile
        ? currentPosition.scale * 0.72
        : currentPosition.scale;

      const transform = `
        translate3d(${xPos}vw, ${yPos}vh, 0)
        translate3d(-50%, -50%, 0)
        scale3d(${scale}, ${scale}, 1)
      `;
<<<<<<< HEAD

=======
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
      setGlobeTransform(transform);
    }

    setActiveSection(newActiveSection);
  }, [calculatedPositions]);

  useEffect(() => {
    let ticking = false;
<<<<<<< HEAD

    const handleScroll = () => {
      if (ticking) return;

=======
    const handleScroll = () => {
      if (ticking) return;
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
      animationFrameId.current = requestAnimationFrame(() => {
        updateScrollPosition();
        ticking = false;
      });
<<<<<<< HEAD

      ticking = true;
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    window.addEventListener("resize", updateScrollPosition);

=======
      ticking = true;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", updateScrollPosition);
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
    updateScrollPosition();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateScrollPosition);
<<<<<<< HEAD

=======
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
      if (animationFrameId.current !== null) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [updateScrollPosition]);

  useEffect(() => {
    const initialPosition = calculatedPositions[0];
<<<<<<< HEAD

    if (!initialPosition) return;

    const isMobile = window.innerWidth < 768;

    const xPos = isMobile
      ? 50
      : initialPosition.left;

    const yPos = isMobile
      ? 70
      : initialPosition.top;

    const scale = isMobile
      ? initialPosition.scale * 0.72
      : initialPosition.scale;
=======
    if (!initialPosition) return;
    const isMobile = window.innerWidth < 768;
    const xPos = isMobile ? 50 : initialPosition.left;
    const yPos = isMobile ? 70 : initialPosition.top;
    const scale = isMobile ? initialPosition.scale * 0.72 : initialPosition.scale;
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d

    const initialTransform = `
      translate3d(${xPos}vw, ${yPos}vh, 0)
      translate3d(-50%, -50%, 0)
      scale3d(${scale}, ${scale}, 1)
    `;
<<<<<<< HEAD

=======
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
    setGlobeTransform(initialTransform);
  }, [calculatedPositions]);

  const handleActionClick = (actionType?: string) => {
    switch (actionType) {
      case "watchAd":
        onOpenAdSimulator();
        break;
<<<<<<< HEAD

      case "calculator":
        onOpenCalculator();
        break;

      case "plans":
        onOpenPlans();
        break;

=======
      case "calculator":
        onOpenCalculator();
        break;
      case "plans":
        onOpenPlans();
        break;
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
      case "auth":
      default:
        onOpenPlans();
        break;
    }
  };

  return (
    <div
      id="hero"
      className={cn(
        "relative min-h-screen w-full max-w-screen overflow-x-hidden transition-colors",
        className
      )}
    >
<<<<<<< HEAD
      {/* =====================================================
          TOP SCROLL PROGRESS BAR
      ====================================================== */}
=======
      {/* Top Scroll Progress Bar */}
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
      <div className="fixed left-0 top-0 z-50 h-1 w-full bg-black/20 backdrop-blur-sm">
        <div
          className="h-full origin-left shadow-sm"
          style={{
            transform: `scaleX(${scrollProgress})`,
            transition: "transform 0.15s ease-out",
            backgroundImage:
<<<<<<< HEAD
              "linear-gradient(90deg, #8F4F5A, #B76E79, #D99AA3, #B76E79, #8F4F5A)",
=======
              "linear-gradient(90deg, #60a5fa, #a78bfa, #f472b6, #60a5fa)",
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
          }}
        />
      </div>

<<<<<<< HEAD
      {/* =====================================================
          RIGHT VERTICAL NAVIGATION DOTS
      ====================================================== */}
      <div className="fixed right-3 sm:right-6 lg:right-8 top-1/2 z-30 hidden sm:flex -translate-y-1/2">
        <div className="space-y-4 lg:space-y-6">
          {sections.map((section, index) => (
            <div
              key={section.id}
              className="group relative"
            >
=======
      {/* Right Vertical Navigation Dots */}
      <div className="fixed right-3 sm:right-6 lg:right-8 top-1/2 z-30 hidden sm:flex -translate-y-1/2">
        <div className="space-y-4 lg:space-y-6">
          {sections.map((section, index) => (
            <div key={section.id} className="group relative">
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
              {/* Tooltip Label */}
              <div
                className={cn(
                  "absolute right-6 top-1/2 z-50 -translate-y-1/2",
<<<<<<< HEAD
                  "rounded-lg border border-[#B76E79]/30 bg-slate-900/90 px-3 py-1.5",
=======
                  "rounded-lg border border-purple-500/30 bg-slate-900/90 px-3 py-1.5",
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                  "text-xs font-semibold whitespace-nowrap shadow-xl",
                  "backdrop-blur-md transition-all duration-300",
                  activeSection === index
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 translate-x-2 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0"
                )}
              >
                <div className="flex items-center gap-1.5">
<<<<<<< HEAD
                  <div className="h-1.5 w-1.5 rounded-full bg-[#B76E79] animate-pulse" />

                  <span className="text-gray-200">
                    {section.badge ||
                      `Section ${index + 1}`}
=======
                  <div className="h-1.5 w-1.5 rounded-full bg-[#735FD4] animate-pulse" />
                  <span className="text-gray-200">
                    {section.badge || `Section ${index + 1}`}
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                  </span>
                </div>
              </div>

              {/* Navigation Dot Button */}
              <button
                type="button"
                onClick={() => {
                  sectionRefs.current[index]?.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                  });
                }}
                className={cn(
                  "relative h-3 w-3 rounded-full border-2 transition-all duration-300",
                  "hover:scale-125",
                  activeSection === index
<<<<<<< HEAD
                    ? "border-[#B76E79] bg-[#B76E79] shadow-lg shadow-[#B76E79]/50 scale-125"
                    : "border-gray-500/50 bg-transparent hover:border-[#B76E79] hover:bg-[#B76E79]/20"
                )}
                aria-label={`Go to ${
                  section.badge ||
                  `section ${index + 1}`
                }`}
=======
                    ? "border-[#735FD4] bg-[#735FD4] shadow-lg shadow-purple-500/50 scale-125"
                    : "border-gray-500/50 bg-transparent hover:border-[#735FD4] hover:bg-[#735FD4]/20"
                )}
                aria-label={`Go to ${section.badge || `section ${index + 1}`}`}
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
              />
            </div>
          ))}
        </div>
      </div>

<<<<<<< HEAD
      {/* =====================================================
          FIXED 3D BRAND GLOBE CONTAINER
      ====================================================== */}
=======
      {/* FIXED 3D BRAND GLOBE CONTAINER */}
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
      <div
        className="fixed z-10 pointer-events-none will-change-transform transition-all duration-[1400ms] ease-[cubic-bezier(0.23,1,0.32,1)]"
        style={{
          transform: globeTransform,
<<<<<<< HEAD
          filter: `opacity(${
            activeSection === 3 ? 0.35 : 0.92
          })`,
=======
          filter: `opacity(${activeSection === 3 ? 0.35 : 0.92})`,
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
        }}
      >
        <div className="scale-75 sm:scale-90 lg:scale-100 transition-transform">
          <BrandGlobe size={300} />
        </div>
      </div>

<<<<<<< HEAD
      {/* =====================================================
          DYNAMIC JOURNEY WAYPOINT SECTIONS
      ====================================================== */}
=======
      {/* Dynamic Journey Waypoint Sections */}
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
      {sections.map((section, index) => (
        <section
          key={section.id}
          ref={(element) => {
            sectionRefs.current[index] = element;
          }}
          className={cn(
            "relative z-20 flex min-h-screen w-full max-w-full flex-col justify-center overflow-hidden",
            "px-4 py-20 sm:px-8 sm:py-24 md:px-12 lg:px-16",
<<<<<<< HEAD

            section.align === "center" &&
              "items-center text-center",

            section.align === "right" &&
              "items-end text-right",

=======
            section.align === "center" && "items-center text-center",
            section.align === "right" && "items-end text-right",
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
            section.align !== "center" &&
              section.align !== "right" &&
              "items-start text-left"
          )}
        >
          <div
            className={cn(
              "w-full max-w-sm sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl",
              "transition-all duration-700",
              "p-6 sm:p-8 rounded-3xl backdrop-blur-sm sm:backdrop-blur-none bg-black/20 sm:bg-transparent border border-white/5 sm:border-transparent"
            )}
          >
<<<<<<< HEAD
            {/* =================================================
                BADGE PILL
            ================================================== */}
            {section.badge && (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B76E79]/10 border border-[#B76E79]/30 text-[#D99AA3] text-xs font-semibold mb-4">
                <Sparkles className="w-3.5 h-3.5 animate-pulse" />

=======
            {/* Badge Pill */}
            {section.badge && (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-semibold mb-4">
                <Sparkles className="w-3.5 h-3.5 animate-pulse" />
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                <span>{section.badge}</span>
              </div>
            )}

<<<<<<< HEAD
            {/* =================================================
                TITLE & SUBTITLE
            ================================================== */}
=======
            {/* Title & Subtitle */}
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
            <h1
              className={cn(
                "mb-4 font-black leading-[1.08] tracking-tight",
                index === 0
                  ? "text-3xl sm:text-5xl md:text-6xl lg:text-7xl"
                  : "text-2xl sm:text-4xl md:text-5xl lg:text-6xl"
              )}
            >
              {section.subtitle ? (
                <div className="space-y-1 sm:space-y-2">
                  <div className="text-brand-gradient">
                    {section.title}
                  </div>
<<<<<<< HEAD

                  <div className="text-[0.65em] font-extrabold tracking-tight text-[#D99AA3]">
=======
                  <div className="text-[0.65em] font-extrabold tracking-tight text-purple-300">
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                    {section.subtitle}
                  </div>
                </div>
              ) : (
                <div className="text-brand-gradient">
                  {section.title}
                </div>
              )}
            </h1>

<<<<<<< HEAD
            {/* =================================================
                DESCRIPTION
            ================================================== */}
            <p
              className={cn(
                "mb-8 text-sm sm:text-base md:text-lg leading-relaxed text-gray-300 dark:text-gray-300 light:text-slate-700 font-normal",

=======
            {/* Description Paragraph */}
            <p
              className={cn(
                "mb-8 text-sm sm:text-base md:text-lg leading-relaxed text-gray-300 dark:text-gray-300 light:text-slate-700 font-normal",
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                section.align === "center"
                  ? "mx-auto max-w-2xl text-center"
                  : "max-w-2xl"
              )}
            >
              {section.description}
            </p>

<<<<<<< HEAD
            {/* =================================================
                HERO QUICK HIGHLIGHTS
            ================================================== */}
            {index === 0 && (
              <div className="mb-8 flex flex-wrap items-center gap-3 sm:gap-4 text-xs font-medium text-gray-300">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-[#B76E79]/20 shadow-sm">
                  <span className="h-2 w-2 rounded-full bg-[#B76E79] animate-ping" />

                  <span>
                    140+ Countries Covered
                  </span>
                </div>
              </div>
            )}

            {/* =================================================
                FEATURES GRID
            ================================================== */}
            {section.features && (
              <div className="mb-8 grid gap-3 sm:grid-cols-3">
                {section.features.map(
                  (feature, featureIndex) => (
                    <div
                      key={feature.title}
                      className="p-4 rounded-2xl bg-slate-900/70 border border-[#B76E79]/20 hover:border-[#B76E79]/50 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 shadow-lg shadow-[#B76E79]/10"
                    >
                      {/* Feature Number */}
                      <div className="w-8 h-8 rounded-lg bg-[#B76E79]/20 flex items-center justify-center text-[#D99AA3] font-bold text-xs mb-2">
                        0{featureIndex + 1}
                      </div>

                      {/* Feature Title */}
                      <h4 className="text-sm font-bold text-white mb-1">
                        {feature.title}
                      </h4>

                      {/* Feature Description */}
                      <p className="text-xs text-gray-400 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  )
                )}
              </div>
            )}

            {/* =================================================
                ACTION BUTTONS
            ================================================== */}
=======
            {/* Hero Quick Highlights on Section 0 */}
            {index === 0 && (
              <div className="mb-8 flex flex-wrap items-center gap-3 sm:gap-4 text-xs font-medium text-gray-300">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-white/10 shadow-sm">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>140+ Countries Covered</span>
                </div>
                
               
              </div>
            )}

            {/* Features Grid if present */}
            {section.features && (
              <div className="mb-8 grid gap-3 sm:grid-cols-3">
                {section.features.map((feature, featureIndex) => (
                  <div
                    key={feature.title}
                    className="p-4 rounded-2xl bg-slate-900/70 border border-purple-500/20 hover:border-purple-500/50 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 shadow-lg shadow-purple-950/20"
                  >
                    <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold text-xs mb-2">
                      0{featureIndex + 1}
                    </div>
                    <h4 className="text-sm font-bold text-white mb-1">
                      {feature.title}
                    </h4>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Actions Buttons */}
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
            {section.actions && (
              <div
                className={cn(
                  "flex flex-col sm:flex-row gap-3.5",
<<<<<<< HEAD

                  section.align === "center" &&
                    "justify-center",

                  section.align === "right" &&
                    "justify-end",

                  (!section.align ||
                    section.align === "left") &&
                    "justify-start"
=======
                  section.align === "center" && "justify-center",
                  section.align === "right" && "justify-end",
                  (!section.align || section.align === "left") && "justify-start"
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                )}
              >
                {section.actions.map((action) => (
                  <button
                    key={action.label}
                    type="button"
<<<<<<< HEAD
                    onClick={() =>
                      handleActionClick(
                        action.actionType
                      )
                    }
                    className={cn(
                      "group relative px-6 py-3.5 rounded-xl text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2",
                      "hover:scale-[1.03] active:scale-[0.98]",

                      action.variant === "primary"
                        ? "bg-[#B76E79] hover:bg-[#A85F6B] text-white shadow-xl shadow-[#B76E79]/30"
                        : "bg-slate-900/80 hover:bg-slate-800 text-gray-200 border border-[#B76E79]/30 backdrop-blur-md"
                    )}
                  >
                    {/* Watch Ad Icon */}
                    {action.actionType ===
                      "watchAd" && (
                      <Play className="w-4 h-4 text-[#D99AA3]" />
                    )}

                    <span>{action.label}</span>

=======
                    onClick={() => handleActionClick(action.actionType)}
                    className={cn(
                      "group relative px-6 py-3.5 rounded-xl text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2",
                      "hover:scale-[1.03] active:scale-[0.98]",
                      action.variant === "primary"
                        ? "bg-purple-600 hover:bg-purple-500 text-white shadow-xl shadow-purple-600/30"
                        : "bg-slate-900/80 hover:bg-slate-800 text-gray-200 border border-purple-500/30 backdrop-blur-md"
                    )}
                  >
                    {action.actionType === "watchAd" && <Play className="w-4 h-4 text-amber-400" />}
                    <span>{action.label}</span>
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>
      ))}
    </div>
  );
};

<<<<<<< HEAD
export default ScrollGlobeHero;
=======
export default ScrollGlobeHero;
>>>>>>> f254a205c48e5e0093046f1318dd6de6f18d577d
