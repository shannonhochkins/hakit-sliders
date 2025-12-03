import { ComponentConfig, generateId, RenderProps, Slot, UnitFieldValue } from "@hakit/addon";
import { Carousel } from "./Carousel";
import { GridWidth, GridHeight } from "./GridTile";
import { SlideEffects } from "./Carousel";
import { PrimaryButton } from "@hakit/addon/components";
import { HeroSliderItemProps } from "../HeroSliderItem";

interface Item {
  width: GridWidth;
  height: GridHeight;
  content: Slot;
}

interface Slide {
  items: Item[];
  slideWidth?: UnitFieldValue;
}

interface HeroSliderProps {
  slides: Slide[];
  options: {
    defaultSlideIndex?: number;
    height?: UnitFieldValue;
    slideGap?: UnitFieldValue;
    easing?:
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
    durationMs?: number;
    inactiveLeft?: SlideEffects;
    inactiveRight?: SlideEffects;
    showNavigation?: boolean;
    showBullets?: boolean;
  };
}

export function Render(props: RenderProps<HeroSliderProps>) {
  return (
    <Carousel
      ref={props._dragRef}
      cssStyles={props.css}
      slides={props.slides}
      defaultSlideIndex={props.options.defaultSlideIndex}
      height={props.options.height}
      slideGap={props.options.slideGap}
      easing={props.options.easing}
      durationMs={props.options.durationMs}
      inactiveLeft={props.options.inactiveLeft}
      inactiveRight={props.options.inactiveRight}
      showNavigation={props.options.showNavigation}
      showBullets={props.options.showBullets}
    />
  );
}

// Example component configuration
export const config: ComponentConfig<HeroSliderProps> = {
  label: "HeroSlider",
  autoWrapComponent: false,
  fitToContent: false,
  fields: {
    slides: {
      type: "array",
      label: "Slides",
      description: "The slides to display in the slider",
      getItemSummary(item, index = 0) {
        return `Slide ${index + 1}`;
      },
      arrayFields: {
        slideWidth: {
          type: "unit",
          label: "Slide Width",
          description: 'Width of this slide (e.g., "80%", "100%", "30%")',
          default: "80%",
        },
        items: {
          type: "array",
          label: "Items",
          description: "Grid items within this slide",
          getItemSummary(item, index = 0) {
            return `Slide Item ${index + 1}`;
          },
          default: [
            {
              width: 4,
              height: 4,
              content: [],
            },
          ],
          defaultItemProps: {
            width: 4,
            height: 4,
          },
          arrayFields: {
            width: {
              type: "slider",
              label: "Width",
              description: "Grid width (1-8)",
              min: 1,
              max: 8,
              default: 4,
            },
            height: {
              type: "slider",
              label: "Height",
              description: "Grid height (1-8)",
              min: 1,
              max: 8,
              default: 4,
            },
            content: {
              type: "slot",
              label: "Content",
            },
          },
        },
      },
      default: [
        {
          slideWidth: "80%",
          items: [
            {
              width: 4,
              height: 4,
              content: [],
            },
          ],
        },
      ],
    },
    options: {
      type: "object",
      label: "Options",
      description: "Options for the slider",
      objectFields: {
        defaultSlideIndex: {
          type: "number",
          label: "Default Slide Index",
          description: "The index of the slide to show initially (0-based)",
          default: 0,
        },
        height: {
          type: "unit",
          label: "Height",
          description:
            'Height of the carousel container (e.g., "80vh", "500px")',
          default: "80vh",
        },
        slideGap: {
          type: "unit",
          label: "Slide Gap",
          description: 'Gap between slides (e.g., "1rem", "16px")',
          default: "1rem",
        },
        easing: {
          type: "select",
          label: "Easing Function",
          description: "CSS easing function for slide transitions",
          default: "easeInOutExpo",
          options: [
            { value: "linear", label: "Linear" },
            { value: "ease", label: "Ease" },
            { value: "ease-in", label: "Ease In" },
            { value: "ease-out", label: "Ease Out" },
            { value: "ease-in-out", label: "Ease In Out" },
            { value: "easeInSine", label: "Ease In Sine" },
            { value: "easeOutSine", label: "Ease Out Sine" },
            { value: "easeInOutSine", label: "Ease In Out Sine" },
            { value: "easeInQuad", label: "Ease In Quad" },
            { value: "easeOutQuad", label: "Ease Out Quad" },
            { value: "easeInOutQuad", label: "Ease In Out Quad" },
            { value: "easeInCubic", label: "Ease In Cubic" },
            { value: "easeOutCubic", label: "Ease Out Cubic" },
            { value: "easeInOutCubic", label: "Ease In Out Cubic" },
            { value: "easeInQuart", label: "Ease In Quart" },
            { value: "easeOutQuart", label: "Ease Out Quart" },
            { value: "easeInOutQuart", label: "Ease In Out Quart" },
            { value: "easeInQuint", label: "Ease In Quint" },
            { value: "easeOutQuint", label: "Ease Out Quint" },
            { value: "easeInOutQuint", label: "Ease In Out Quint" },
            { value: "easeInExpo", label: "Ease In Expo" },
            { value: "easeOutExpo", label: "Ease Out Expo" },
            { value: "easeInOutExpo", label: "Ease In Out Expo" },
            { value: "easeInCirc", label: "Ease In Circ" },
            { value: "easeOutCirc", label: "Ease Out Circ" },
            { value: "easeInOutCirc", label: "Ease In Out Circ" },
            { value: "elastic", label: "Elastic" },
            { value: "bounce", label: "Bounce" },
          ],
        },
        durationMs: {
          type: "number",
          label: "Transition Duration (ms)",
          description: "Duration of slide transitions in milliseconds",
          default: 600,
        },
        inactiveLeft: {
          type: "object",
          label: "Inactive Left Effects",
          description:
            "Visual effects applied to slides to the left of the active slide",
          objectFields: {
            scale: {
              type: "number",
              label: "Scale",
              description: "Scale factor for inactive left slides (0-1)",
              default: 0.9,
            },
            translate: {
              type: "number",
              label: "Translate (%)",
              description:
                "Horizontal translation percentage for inactive left slides",
              default: -25,
            },
            opacity: {
              type: "number",
              label: "Opacity",
              description: "Opacity for inactive left slides (0-1)",
              default: 0.9,
            },
            blur: {
              type: "number",
              label: "Blur (px)",
              description: "Blur amount in pixels for inactive left slides",
              default: 2,
            },
          },
        },
        inactiveRight: {
          type: "object",
          label: "Inactive Right Effects",
          description:
            "Visual effects applied to slides to the right of the active slide",
          objectFields: {
            scale: {
              type: "number",
              label: "Scale",
              description: "Scale factor for inactive right slides (0-1)",
              default: 1,
            },
            translate: {
              type: "number",
              label: "Translate (%)",
              description:
                "Horizontal translation percentage for inactive right slides",
              default: 0,
            },
            opacity: {
              type: "number",
              label: "Opacity",
              description: "Opacity for inactive right slides (0-1)",
              default: 1,
            },
            blur: {
              type: "number",
              label: "Blur (px)",
              description: "Blur amount in pixels for inactive right slides",
              default: 0,
            },
          },
        },
        showNavigation: {
          type: "switch",
          label: "Show Navigation",
          description: "Display previous/next navigation buttons",
          default: true,
        },
        showBullets: {
          type: "switch",
          label: "Show Bullets",
          description: "Display bullet indicators at the bottom",
          default: true,
        },
      },
    },
  },
  render: Render,
};
