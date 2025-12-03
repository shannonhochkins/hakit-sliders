import React, { forwardRef, useMemo } from 'react';
import styled from '@emotion/styled';
import { SlideEffects } from './Carousel';
import { UnitFieldValue } from '@hakit/addon';
interface SlideProps {
  slideWidth?: UnitFieldValue | string;
  isActive?: boolean;
  distanceFromActive?: number;
  inactiveEffects?: {
    scale?: number;
    translate?: number;
    opacity?: number;
    blur?: number;
  };
  zIndex?: number;
  isLeftSide?: boolean;
  easingFn?: string;
  isTransitioning?: boolean;
  transitionDirection?: 'next' | 'prev' | null;
  transitionFrom?: number | null;
  transitionTo?: number | null;
}
const Slide = styled.div<SlideProps>`
  height: 100%;
  min-width: ${props => props.slideWidth};
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  z-index: ${props => props.zIndex || 0};
  will-change: transform, opacity, filter;
  /* Apply visual effects for inactive slides */
  ${props => {
  if (props.isActive) return 'transform: scale(1) translateX(0) translateZ(0);';
  const effects = props.inactiveEffects || {};
  // Calculate the effect intensity based on distance from active slide
  const distance = Math.abs(props.distanceFromActive || 0);
  // Base translate configured per side. Percent values are relative to the slide's own width.
  const translateBase = effects.translate !== undefined ? effects.translate : 0;
  const isNearest = distance === 1;
  // Apply the configured translate exactly (no damping/scaling) to the nearest neighbor only
  let translateValue = isNearest ? translateBase : 0;
  return `
      transform: scale(${effects.scale !== undefined ? Math.pow(effects.scale, distance) : 1}) translateX(${translateValue}%) translateZ(0);
      opacity: ${effects.opacity !== undefined ? Math.pow(effects.opacity, distance) : 1};
      filter: blur(${effects.blur !== undefined ? effects.blur * distance : 0}px);
    `;
}}
  /* Apply smoother transition with a slight delay for transform */
  transition: opacity 0.45s ${props => props.easingFn || 'ease'}, 
              filter 0.45s ${props => props.easingFn || 'ease'},
              transform 0.6s ${props => props.easingFn || 'ease'};
  backface-visibility: hidden;
  transform-origin: center center;
  .grid-layout {
    display: grid;
    gap: 1rem;
    width: 100%;
    min-width: ${props => props.slideWidth};
    height: 100%;
    max-height: 100%;
  }
  /* All grid layouts now use the same 8x8 grid structure */
  .grid-8x8 {
    grid-template-columns: repeat(8, 1fr);
    grid-template-rows: repeat(8, 1fr);
    grid-auto-flow: dense;
  }
  /* For full-width layouts */
  .full-width {
    width: 100%;
    min-width: 100%;
  }
`;
interface CarouselSlideProps {
  children: React.ReactNode;
  slideWidth?: UnitFieldValue | string;
  index: number;
  activeIndex: number;
  inactiveLeft?: SlideEffects;
  inactiveRight?: SlideEffects;
  easingFn?: string;
  isTransitioning?: boolean;
  transitionDirection?: 'next' | 'prev' | null;
  transitionFrom?: number | null;
  transitionTo?: number | null;
}
export const CarouselSlide = forwardRef<HTMLDivElement, CarouselSlideProps>(function CarouselSlide({
  children,
  slideWidth = '80%',
  index,
  activeIndex,
  inactiveLeft = {
    scale: 0.9,
    translate: -25,
    opacity: 0.9,
    blur: 2
  },
  inactiveRight = {
    scale: 1,
    translate: 0,
    opacity: 1,
    blur: 0
  },
  easingFn,
  isTransitioning,
  transitionDirection,
  transitionFrom,
  transitionTo
}, ref) {
  const isActive = index === activeIndex;
  const distanceFromActive = index - activeIndex;
  const isLeftSide = distanceFromActive < 0;
  // Calculate z-index based on distance from active slide
  const MAX_Z_INDEX = 10;
  // Dynamic z-index handling during transitions to prevent overlap/jitter
  const zIndex = useMemo(() => {
    // For baseline ordering, during a PREV transition we keep the previous active slide
    // visually on top until the transition finishes.
    const visualActiveIndex = (isTransitioning && transitionDirection === 'prev' && transitionFrom != null)
      ? transitionFrom
      : activeIndex;
    const baselineDistance = index - visualActiveIndex;
    const baselineIsActive = index === visualActiveIndex;
    let baseline = baselineIsActive ? MAX_Z_INDEX : MAX_Z_INDEX - Math.abs(baselineDistance);
    if (isTransitioning && transitionFrom != null && transitionTo != null && transitionDirection) {
      // NEXT: elevate the incoming slide immediately to avoid overlap
      if (transitionDirection === 'next') {
        if (index === transitionTo) return MAX_Z_INDEX;
        if (index === transitionFrom) return Math.max(MAX_Z_INDEX - 1, baseline);
      }
      // PREV: do NOT change z-index mid-transition; baseline already uses previous active
    }
    return baseline;
  }, [isTransitioning, transitionFrom, transitionTo, transitionDirection, index, activeIndex]);
  // Select the appropriate effects based on which side of the active slide this is
  const inactiveEffects = isLeftSide ? inactiveLeft : inactiveRight;
  return <Slide ref={ref} slideWidth={slideWidth} isActive={isActive} distanceFromActive={distanceFromActive} inactiveEffects={inactiveEffects} isLeftSide={isLeftSide} zIndex={zIndex} easingFn={easingFn} isTransitioning={isTransitioning} transitionDirection={transitionDirection} transitionFrom={transitionFrom} transitionTo={transitionTo}>
        {children}
      </Slide>;
});