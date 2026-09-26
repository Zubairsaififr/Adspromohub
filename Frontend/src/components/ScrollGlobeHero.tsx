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

    const docHeight =
      document.documentElement.scrollHeight - window.innerHeight;

    const progress =
      docHeight > 0
        ? Math.min(Math.max(scrollTop / docHeight, 0), 1)
        : 0;

    setScrollProgress(progress);

    const viewportCenter = window.innerHeight / 2;

    let newActiveSection = 0;
    let minDistance = Infinity;

    sectionRefs.current.forEach((ref, index) => {
      if (!ref) return;

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
        Math.min(
          newActiveSection,
          calculatedPositions.length - 1
        )
      ];

    if (currentPosition) {
      const isMobile = window.innerWidth < 768;

      const xPos = isMobile
        ? 50
        : currentPosition.left;

      const yPos = isMobile
        ? newActiveSection === 0
          ? 70
          : 35
        : currentPosition.top;

      const scale = isMobile
        ? currentPosition.scale * 0.72
        : currentPosition.scale;

      const transform = `
        translate3d(${xPos}vw, ${yPos}vh, 0)
        translate3d(-50%, -50%, 0)
        scale3d(${scale}, ${scale}, 1)
      `;

      setGlobeTransform(transform);
    }

    setActiveSection(newActiveSection);
  }, [calculatedPositions]);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;

      animationFrameId.current = requestAnimationFrame(() => {
        updateScrollPosition();
        ticking = false;
      });

      ticking = true;
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    window.addEventListener("resize", updateScrollPosition);

    updateScrollPosition();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateScrollPosition);

      if (animationFrameId.current !== null) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [updateScrollPosition]);

  useEffect(() => {
    const initialPosition = calculatedPositions[0];

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

    const initialTransform = `
      translate3d(${xPos}vw, ${yPos}vh, 0)
      translate3d(-50%, -50%, 0)
      scale3d(${scale}, ${scale}, 1)
    `;

    setGlobeTransform(initialTransform);
  }, [calculatedPositions]);

  const handleActionClick = (actionType?: string) => {
    switch (actionType) {
      case "watchAd":
        onOpenAdSimulator();
        break;

      case "calculator":
        onOpenCalculator();
        break;

      case "plans":
        onOpenPlans();
        break;

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
      {/* =====================================================
          TOP SCROLL PROGRESS BAR
      ====================================================== */}
      <div className="fixed left-0 top-0 z-50 h-1 w-full bg-black/20 backdrop-blur-sm">
        <div
          className="h-full origin-left shadow-sm"
          style={{
            transform: `scaleX(${scrollProgress})`,
            transition: "transform 0.15s ease-out",
            backgroundImage:
              "linear-gradient(90deg, #8F4F5A, #B76E79, #D99AA3, #B76E79, #8F4F5A)",
          }}
        />
      </div>

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
              {/* Tooltip Label */}
              <div
                className={cn(
                  "absolute right-6 top-1/2 z-50 -translate-y-1/2",
                  "rounded-lg border border-[#B76E79]/30 bg-slate-900/90 px-3 py-1.5",
                  "text-xs font-semibold whitespace-nowrap shadow-xl",
                  "backdrop-blur-md transition-all duration-300",
                  activeSection === index
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 translate-x-2 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0"
                )}
              >
                <div className="flex items-center gap-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-[#B76E79] animate-pulse" />

                  <span className="text-gray-200">
                    {section.badge ||
                      `Section ${index + 1}`}
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
                    ? "border-[#B76E79] bg-[#B76E79] shadow-lg shadow-[#B76E79]/50 scale-125"
                    : "border-gray-500/50 bg-transparent hover:border-[#B76E79] hover:bg-[#B76E79]/20"
                )}
                aria-label={`Go to ${
                  section.badge ||
                  `section ${index + 1}`
                }`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* =====================================================
          FIXED 3D BRAND GLOBE CONTAINER
      ====================================================== */}
      <div
        className="fixed z-10 pointer-events-none will-change-transform transition-all duration-[1400ms] ease-[cubic-bezier(0.23,1,0.32,1)]"
        style={{
          transform: globeTransform,
          filter: `opacity(${
            activeSection === 3 ? 0.35 : 0.92
          })`,
        }}
      >
        <div className="scale-75 sm:scale-90 lg:scale-100 transition-transform">
          <BrandGlobe size={300} />
        </div>
      </div>

      {/* =====================================================
          DYNAMIC JOURNEY WAYPOINT SECTIONS
      ====================================================== */}
      {sections.map((section, index) => (
        <section
          key={section.id}
          ref={(element) => {
            sectionRefs.current[index] = element;
          }}
          className={cn(
            "relative z-20 flex min-h-screen w-full max-w-full flex-col justify-center overflow-hidden",
            "px-4 py-20 sm:px-8 sm:py-24 md:px-12 lg:px-16",

            section.align === "center" &&
              "items-center text-center",

            section.align === "right" &&
              "items-end text-right",

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
            {/* =================================================
                BADGE PILL
            ================================================== */}
            {section.badge && (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B76E79]/10 border border-[#B76E79]/30 text-[#D99AA3] text-xs font-semibold mb-4">
                <Sparkles className="w-3.5 h-3.5 animate-pulse" />

                <span>{section.badge}</span>
              </div>
            )}

            {/* =================================================
                TITLE & SUBTITLE
            ================================================== */}
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

                  <div className="text-[0.65em] font-extrabold tracking-tight text-[#D99AA3]">
                    {section.subtitle}
                  </div>
                </div>
              ) : (
                <div className="text-brand-gradient">
                  {section.title}
                </div>
              )}
            </h1>

            {/* =================================================
                DESCRIPTION
            ================================================== */}
            <p
              className={cn(
                "mb-8 text-sm sm:text-base md:text-lg leading-relaxed text-gray-300 dark:text-gray-300 light:text-slate-700 font-normal",

                section.align === "center"
                  ? "mx-auto max-w-2xl text-center"
                  : "max-w-2xl"
              )}
            >
              {section.description}
            </p>

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
            {section.actions && (
              <div
                className={cn(
                  "flex flex-col sm:flex-row gap-3.5",

                  section.align === "center" &&
                    "justify-center",

                  section.align === "right" &&
                    "justify-end",

                  (!section.align ||
                    section.align === "left") &&
                    "justify-start"
                )}
              >
                {section.actions.map((action) => (
                  <button
                    key={action.label}
                    type="button"
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

export default ScrollGlobeHero;