import { useEffect, useState, useRef } from "react";
import styled from "@emotion/styled";
import { CarouselSlide } from "./CarouselSlide";
import { IconButton } from "@hakit/addon/components";
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from "lucide-react";
import { CarouselBullets } from "./CarouselBullets";
import { SerializedStyles } from "@emotion/react";
import { css } from "@emotion/react";
import { SlotComponent, UnitFieldValue } from "@hakit/addon";
import { useHakit } from "@hakit/addon/utils";
import { registerOverlayPortal } from "@measured/puck";

// Define the slide effect types
export interface SlideEffects {
  scale?: number;
  translate?: number;
  opacity?: number;
  blur?: number;
}
interface CarouselContainerProps {
  height?: UnitFieldValue | string;
}
const CarouselContainer = styled.div<CarouselContainerProps>`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: ${(props) => props.height};
  user-select: none;
  touch-action: pan-y;
  position: relative;
  overflow: hidden;
`;
interface CarouselTrackProps {
  slideGap: UnitFieldValue | string;
  easingFn: string;
  durationMs: number;
  bulletsOffset: number;
  enableTransition: boolean;
}
const CarouselTrack = styled.div<CarouselTrackProps>`
  display: flex;
  height: calc(100% - ${props => props.bulletsOffset}px);
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  gap: ${props => props.slideGap};
  position: relative;
  z-index: 10; /* Ensure carousel is below navigation buttons */
  transition: ${props => props.enableTransition ? `transform ${props.durationMs}ms ${props.easingFn}` : 'none'};
  will-change: transform;
  backface-visibility: hidden;
`;
interface Slide {
  items: Array<{
    width: number;
    height: number;
    content: SlotComponent
  }>;
  slideWidth?: UnitFieldValue | string;
}

interface CarouselProps extends React.ComponentPropsWithRef<'div'> {
  slides: Slide[];
  defaultSlide?: number;
  maintainSlidePosition?: boolean;
  height?: UnitFieldValue | string;
  slideGap?: UnitFieldValue | string;
  easing?: EasingName;
  durationMs?: number;
  // Visual effects for inactive slides using object structure
  inactiveLeft?: SlideEffects;
  inactiveRight?: SlideEffects;
  // Whether to render built-in navigation buttons
  showNavigation?: boolean;
  // Whether to render bullets and their timing
  showBullets?: boolean;

  cssStyles?: SerializedStyles;
}

// Module-level storage for persisting slide position across remounts (but not page refresh)
// This allows position to persist when props change without using localStorage
// Using a single key since there's typically one carousel per page in the editor
let cachedSlideIndex: number | null = null;
// Common easing names mapped to CSS timing functions
type EasingName =
  | "linear"
  | "ease"
  | "ease-in"
  | "ease-out"
  | "ease-in-out"
  | "easeInSine"
  | "easeOutSine"
  | "easeInOutSine"
  | "easeInQuad"
  | "easeOutQuad"
  | "easeInOutQuad"
  | "easeInCubic"
  | "easeOutCubic"
  | "easeInOutCubic"
  | "easeInQuart"
  | "easeOutQuart"
  | "easeInOutQuart"
  | "easeInQuint"
  | "easeOutQuint"
  | "easeInOutQuint"
  | "easeInExpo"
  | "easeOutExpo"
  | "easeInOutExpo"
  | "easeInCirc"
  | "easeOutCirc"
  | "easeInOutCirc"
  | "elastic"
  | "bounce";

const EASING_MAP: Record<EasingName, string> = {
  linear: "linear",
  ease: "ease",
  "ease-in": "ease-in",
  "ease-out": "ease-out",
  "ease-in-out": "ease-in-out",
  easeInSine: "cubic-bezier(0.47, 0, 0.745, 0.715)",
  easeOutSine: "cubic-bezier(0.39, 0.575, 0.565, 1)",
  easeInOutSine: "cubic-bezier(0.445, 0.05, 0.55, 0.95)",
  easeInQuad: "cubic-bezier(0.55, 0.085, 0.68, 0.53)",
  easeOutQuad: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
  easeInOutQuad: "cubic-bezier(0.455, 0.03, 0.515, 0.955)",
  easeInCubic: "cubic-bezier(0.55, 0.055, 0.675, 0.19)",
  easeOutCubic: "cubic-bezier(0.215, 0.61, 0.355, 1)",
  easeInOutCubic: "cubic-bezier(0.645, 0.045, 0.355, 1)",
  easeInQuart: "cubic-bezier(0.895, 0.03, 0.685, 0.22)",
  easeOutQuart: "cubic-bezier(0.165, 0.84, 0.44, 1)",
  easeInOutQuart: "cubic-bezier(0.77, 0, 0.175, 1)",
  easeInQuint: "cubic-bezier(0.755, 0.05, 0.855, 0.06)",
  easeOutQuint: "cubic-bezier(0.23, 1, 0.32, 1)",
  easeInOutQuint: "cubic-bezier(0.86, 0, 0.07, 1)",
  easeInExpo: "cubic-bezier(0.95, 0.05, 0.795, 0.035)",
  easeOutExpo: "cubic-bezier(0.19, 1, 0.22, 1)",
  easeInOutExpo: "cubic-bezier(1, 0, 0, 1)",
  easeInCirc: "cubic-bezier(0.6, 0.04, 0.98, 0.335)",
  easeOutCirc: "cubic-bezier(0.075, 0.82, 0.165, 1)",
  easeInOutCirc: "cubic-bezier(0.785, 0.135, 0.15, 0.86)",
  elastic: "cubic-bezier(.37,-0.01,0,1.5)",
  bounce: "cubic-bezier(0.34, 1.56, 0.64, 1)",
};

const NavigationButtons = styled.div`
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  transform: translateY(-50%);
  pointer-events: none;
  z-index: 100;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const NavButton = styled(IconButton)<{ side: "left" | "right" }>`
  max-width: auto !important;
`;

export type GridWidth = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export type GridHeight = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
interface TileProps {
  width: GridWidth;
  height: GridHeight;
}
const Tile = styled.div<TileProps>`
  grid-column: span ${({ width }) => width};
  grid-row: span ${({ height }) => height};
  > .slide-content, > .slide-content > [data-puck-component]:not([aria-grabbed="true"]) {
    height: 100% !important;
    width: 100% !important;
    max-width: 100% !important;
    max-height: 100% !important;
  }
`;

export function Carousel({
  slides = [],
  defaultSlide = 0,
  maintainSlidePosition = false,
  height = "80vh",
  slideGap = "1rem",
  easing = "easeInOutExpo",
  durationMs = 600,
  // Default values for visual effects using object structure
  inactiveLeft = {
    scale: 0.9,
    translate: 0,
    opacity: 0.9,
    blur: 2,
  },
  inactiveRight = {
    scale: 1,
    translate: 0,
    opacity: 1,
    blur: 0,
  },
  showNavigation = true,
  showBullets = true,
  cssStyles,
  ref,
}: CarouselProps) {
  const componentNames = useHakit(s => s.componentNames);
  const easingFn = EASING_MAP[easing] || "ease";
  const slideCount = slides.length;
  const maxSlideIndex = Math.max(0, slideCount - 1);
  // Calculate the position for the carousel track
  // We need to center the active slide
  const trackRef = useRef<HTMLDivElement>(null);
  const [trackTransform, setTrackTransform] = useState("translateX(0px)");
  
  const STORAGE_KEY = 'hero-slider-active-index';
  const selectedComponent = useHakit(state => state.selectedComponent);

  useEffect(() => {
    if (selectedComponent?.itemSelector?.zone?.startsWith('HeroSlider__')) {
      const zoneName = selectedComponent?.itemSelector?.zone;
      // example zone name
      // HeroSlider__@@__@hakit/dev-remote-proxy-40b559e1-d…4824-8909-4a5ceec04288:slides[0].items[2].content
      // now, try to determine the slide index based on the currently selected component
      const slideIndex = zoneName.match(/slides\[(\d+)\]/)?.[1];
      if (slideIndex) {
        setActiveSlide(parseInt(slideIndex, 10));
      }
    }
  }, [selectedComponent])

  
  // Initialize activeSlide based on maintainSlidePosition setting
  const getInitialSlide = (): number => {
    if (maintainSlidePosition) {
      // Use sessionStorage for cross-page-refresh persistence
      try {
        const stored = sessionStorage.getItem(STORAGE_KEY);
        if (stored !== null) {
          const parsed = parseInt(stored, 10);
          if (!isNaN(parsed) && parsed >= 0 && parsed <= maxSlideIndex) {
            return parsed;
          }
        }
      } catch (e) {
        // sessionStorage might not be available (SSR, private browsing, etc.)
      }
    } else {
      // Use module-level cache for remount persistence (but not page refresh)
      if (cachedSlideIndex !== null && cachedSlideIndex >= 0 && cachedSlideIndex <= maxSlideIndex) {
        return cachedSlideIndex;
      }
    }
    // Fallback to defaultSlide
    return Math.max(0, Math.min(defaultSlide, maxSlideIndex));
  };
  
  const [activeSlide, setActiveSlide] = useState<number>(getInitialSlide);
  const prevIndexRef = useRef<number>(activeSlide);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionFrom, setTransitionFrom] = useState<number | null>(null);
  const [transitionTo, setTransitionTo] = useState<number | null>(null);
  const [direction, setDirection] = useState<"next" | "prev" | null>(null);
  const isUserNavigationRef = useRef(false);
  const slidesLengthRef = useRef(slides.length);
  
  // Persist activeSlide based on maintainSlidePosition setting
  useEffect(() => {
    if (maintainSlidePosition) {
      // Persist to sessionStorage for cross-page-refresh persistence
      try {
        sessionStorage.setItem(STORAGE_KEY, activeSlide.toString());
      } catch (e) {
        // sessionStorage might not be available
      }
    } else {
      // Persist to module-level cache for remount persistence only
      cachedSlideIndex = activeSlide;
    }
  }, [activeSlide, maintainSlidePosition, STORAGE_KEY]);
  
  // Clamp activeSlide to valid range when slides change, but don't reset it
  useEffect(() => {
    if (activeSlide > maxSlideIndex) {
      setActiveSlide(maxSlideIndex);
    }
  }, [maxSlideIndex, activeSlide]);

  const showNavigationButtons = showNavigation === true && slides.length > 1;

  // Separate effect to handle user navigation vs layout changes
  useEffect(() => {
    const prev = prevIndexRef.current;
    const slidesChanged = slidesLengthRef.current !== slides.length;
    slidesLengthRef.current = slides.length;

    // If slides changed, this is a layout change, not user navigation
    if (slidesChanged) {
      prevIndexRef.current = activeSlide;
      isUserNavigationRef.current = false;
      setIsTransitioning(false);
      return;
    }

    // If activeSlide changed and it's user navigation, enable transition
    if (prev !== activeSlide && isUserNavigationRef.current) {
      setIsTransitioning(true);
      setTransitionFrom(prev);
      setTransitionTo(activeSlide);
      setDirection(activeSlide > prev ? "next" : "prev");
      prevIndexRef.current = activeSlide;
      // Listen for track transform transition end
      const track = trackRef.current;
      const onEnd = (e: TransitionEvent) => {
        if (e.propertyName !== "transform") return;
        setIsTransitioning(false);
        setDirection(null);
        setTransitionFrom(null);
        setTransitionTo(null);
        isUserNavigationRef.current = false;
      };
      if (track) track.addEventListener("transitionend", onEnd, { once: true });
    } else if (prev !== activeSlide) {
      // Slide changed but not from user navigation (e.g., initial render or bounds adjustment)
      prevIndexRef.current = activeSlide;
      setIsTransitioning(false);
    }
  }, [activeSlide, slides.length]);

  useEffect(() => {
    const recalc = () => {
      // Ensure we don't go beyond valid slide range
      const validActiveSlide = Math.max(
        0,
        Math.min(activeSlide, maxSlideIndex)
      );
      if (!trackRef.current) return;
      const trackEl = trackRef.current;
      const containerWidth = trackEl.parentElement?.clientWidth || 0;
      const slideElement = trackEl.children[validActiveSlide] as
        | HTMLElement
        | undefined;
      if (!slideElement) return;
      const slideWidthPx = slideElement.offsetWidth;
      const offsetPx = (containerWidth - slideWidthPx) / 2;
      // Resolve the horizontal gap in pixels from computed styles (supports rem/px and shorthand values)
      const gapValue = getComputedStyle(trackEl).gap || "0px";
      const horizontalGapPx = (() => {
        const parts = gapValue.trim().split(" ");
        // gap shorthand: "row-gap column-gap". In a horizontal flex row, column-gap is horizontal.
        const columnPart = parts[1] ?? parts[0] ?? "0px";
        const parsed = parseFloat(columnPart);
        return Number.isFinite(parsed) ? parsed : 0;
      })();
      // Sum widths of all slides before the active one
      let positionPx = 0;
      for (let i = 0; i < validActiveSlide; i++) {
        const prevSlide = trackEl.children[i] as HTMLElement | undefined;
        if (prevSlide) positionPx += prevSlide.offsetWidth;
      }
      // Add the correct number of gaps before the active slide
      positionPx += horizontalGapPx * validActiveSlide;
      // Center the active slide
      setTrackTransform(`translateX(calc(-${positionPx}px + ${offsetPx}px))`);
    };
    // Recalc now (next frame helps ensure layout is settled)
    const raf = requestAnimationFrame(recalc);
    // Recalc on resize
    window.addEventListener("resize", recalc);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", recalc);
    };
  }, [activeSlide, slideGap, maxSlideIndex, slides.length]);
  // Swipe handling using pointer events (mouse/touch unified)
  const startXRef = useRef<number | null>(null);
  const lastXRef = useRef<number | null>(null);
  const hasPointerDownRef = useRef(false);
  const hasMovedRef = useRef(false);
  // Drag state is not needed for UI; we use thresholds only.
  const DRAG_THRESHOLD_PX = 60; // distance to trigger slide change
  const MOVE_THRESHOLD_PX = 5; // minimum movement to consider it a drag (not a click)
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    // Check if the target is likely a nested interactive component (Puck selection, buttons, etc.)
    const isInteractiveElement = (target: EventTarget | null): boolean => {
      if (!target || !(target instanceof Element)) return false;
      // Check for Puck selection attributes or interactive elements
      const element = target as HTMLElement;
      // Check if it's a nested component (has a slot component structure)
      if (element.closest("[data-puck-component]")) {
        return false;
      }
      return false;
    };

    const onPointerDown = (e: PointerEvent) => {
      hasPointerDownRef.current = true;
      hasMovedRef.current = false;
      startXRef.current = e.clientX;
      lastXRef.current = e.clientX;
      // Don't capture immediately - wait to see if it's a drag
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!hasPointerDownRef.current) return;
      lastXRef.current = e.clientX;
      const startX = startXRef.current;
      if (startX !== null) {
        const delta = Math.abs(e.clientX - startX);
        // Only capture pointer if we've moved enough to indicate a drag
        if (delta > MOVE_THRESHOLD_PX && !hasMovedRef.current) {
          hasMovedRef.current = true;
          el.setPointerCapture(e.pointerId);
        }
      }
    };
    const onPointerUp = (e: PointerEvent) => {
      if (!hasPointerDownRef.current) return;
      hasPointerDownRef.current = false;
      if (hasMovedRef.current) {
        el.releasePointerCapture(e.pointerId);
      }
      hasMovedRef.current = false;
      const startX = startXRef.current;
      const endX = lastXRef.current;
      startXRef.current = null;
      lastXRef.current = null;
      if (startX == null || endX == null) return;
      const delta = endX - startX;
      if (Math.abs(delta) < DRAG_THRESHOLD_PX) return;
      if (delta < 0) {
        // swipe left -> next
        isUserNavigationRef.current = true;
        setActiveSlide((prev) => Math.min(maxSlideIndex, prev + 1));
      } else {
        // swipe right -> prev
        isUserNavigationRef.current = true;
        setActiveSlide((prev) => Math.max(0, prev - 1));
      }
    };
    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerup", onPointerUp);
    el.addEventListener("pointercancel", onPointerUp);
    return () => {
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerup", onPointerUp);
      el.removeEventListener("pointercancel", onPointerUp);
    };
  }, [maxSlideIndex]);

  // Internal navigation
  const handlePrev = () => {
    isUserNavigationRef.current = true;
    setActiveSlide((prev) => Math.max(0, prev - 1));
  };
  const handleNext = () => {
    isUserNavigationRef.current = true;
    setActiveSlide((prev) => Math.min(maxSlideIndex, prev + 1));
  };
  const canGoPrev = activeSlide > 0;
  const canGoNext = activeSlide < maxSlideIndex;

  const prevRef = useRef<HTMLDivElement>(null);
  const nextRef = useRef<HTMLDivElement>(null);

  useEffect(
    () => registerOverlayPortal(prevRef.current),
    [prevRef.current, showNavigationButtons]
  );
  useEffect(
    () => registerOverlayPortal(nextRef.current),
    [nextRef.current, showNavigationButtons]
  );

  return (
    <CarouselContainer
      height={height}
      ref={ref}
      css={css`
        ${cssStyles}
      `}
    >
      <CarouselTrack
        ref={trackRef}
        slideGap={slideGap}
        easingFn={easingFn}
        durationMs={durationMs}
        bulletsOffset={showBullets ? 56 : 0}
        enableTransition={isTransitioning}
        style={{
          transform: trackTransform,
        }}
      >
        {slides.map((slide, slideIndex) => {
          const slideWidthValue = slide.slideWidth;
          const items = slide.items || [];
          return (
            <CarouselSlide
              key={slideIndex}
              slideWidth={slideWidthValue}
              index={slideIndex}
              activeIndex={activeSlide}
              inactiveLeft={inactiveLeft}
              inactiveRight={inactiveRight}
              easingFn={easingFn}
              isTransitioning={isTransitioning}
              transitionDirection={direction}
              transitionFrom={transitionFrom}
              transitionTo={transitionTo}
            >
              <div
                className={`grid-layout grid-8x8 ${slideWidthValue === "100%" ? "full-width" : ""}`}
              >
                {items.map((item, itemIndex) => (
                  <Tile
                    key={itemIndex}
                    width={item.width as GridWidth}
                    height={item.height as GridHeight}
                  >
                    <item.content className="slide-content" disallow={[componentNames.find(name => name?.includes("HeroSlider")) ?? ""]} />
                  </Tile>
                ))}
              </div>
            </CarouselSlide>
          );
        })}
      </CarouselTrack>
      {showNavigationButtons && (
        <NavigationButtons>
          <NavButton
            ref={prevRef}
            icon={<ChevronLeftIcon size={28} color="#D4DDEF" />}
            side="left"
            active={false}
            disabled={!canGoPrev}
            onClick={canGoPrev ? handlePrev : undefined}
            aria-label="Previous slide"
          />
          <NavButton
            ref={nextRef}
            icon={<ChevronRightIcon size={28} color="#D4DDEF" />}
            side="right"
            active={false}
            disabled={!canGoNext}
            onClick={canGoNext ? handleNext : undefined}
            aria-label="Next slide"
          />
        </NavigationButtons>
      )}
      {showBullets && (
        <div style={{ width: "100%", marginTop: "16px" }}>
          <CarouselBullets
            count={slideCount}
            activeIndex={activeSlide}
            onSelect={(index) => {
              isUserNavigationRef.current = true;
              setActiveSlide(index);
            }}
            easingFn={easingFn}
            durationMs={durationMs}
          />
        </div>
      )}
    </CarouselContainer>
  );
}
