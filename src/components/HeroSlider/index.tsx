import { ComponentConfig, RenderProps, Slot, UnitFieldValue } from "@hakit/addon";
import { Carousel, GridWidth, GridHeight } from "./Carousel";
import { SlideEffects } from "./Carousel";

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
    defaultSlide?: number;
    maintainSlidePosition?: boolean;
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
      defaultSlide={props.options.defaultSlide}
      maintainSlidePosition={props.options.maintainSlidePosition}
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
      label: "Slides & Items",
      description: "The slides to display in the slider and the items within each slide",
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
            return `Slide Item ${item.width}x${item.height}`;
          },
          default: [
            {
              width: 4,
              height: 4,
              content: [],
            },
          ],
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
        defaultSlide: {
          type: "select",
          label: "Default Slide Index",
          description: "The slide to show initially",
          default: 0,
          options: []
        },
        maintainSlidePosition: {
          type: "switch",
          label: "Maintain Slide Position",
          description: "Remember the last viewed slide position across page refreshes",
          default: false,
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
          min: 0,
          max: 10000,
          step: 50,
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
              default: 1,
              min: 0,
              max: 1,
              step: 0.01,
            },
            translate: {
              type: "number",
              label: "Translate (%)",
              description:
                "Horizontal translation percentage for inactive left slides",
              default: 0,
              min: -100,
              max: 100,
              step: 1,
            },
            opacity: {
              type: "number",
              label: "Opacity",
              description: "Opacity for inactive left slides (0-1)",
              default: 1,
              min: 0,
              max: 1,
              step: 0.01,
            },
            blur: {
              type: "number",
              label: "Blur (px)",
              description: "Blur amount in pixels for inactive left slides",
              default: 0,
              min: 0,
              max: 10,
              step: 1,
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
              min: 0,
              max: 1,
              step: 0.01,
            },
            translate: {
              type: "number",
              label: "Translate (%)",
              description:
                "Horizontal translation percentage for inactive right slides",
              default: 0,
              min: -100,
              max: 100,
              step: 1,
            },
            opacity: {
              type: "number",
              label: "Opacity",
              description: "Opacity for inactive right slides (0-1)",
              default: 1,
              min: 0,
              max: 1,
              step: 0.01,
            },
            blur: {
              type: "number",
              label: "Blur (px)",
              description: "Blur amount in pixels for inactive right slides",
              default: 0,
              min: 0,
              max: 10,
              step: 1,
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
  resolveFields(data, { fields }) {
    const slides = data.props.slides;
    const slideOptions = slides.map((slide, index) => ({
      value: index,
      label: `Slide ${index + 1}`,
    }));
    if (fields.options.type === 'object' && fields.options.objectFields.defaultSlide?.type === 'select') {
      if (slideOptions.length > 0) {
        fields.options.objectFields.defaultSlide.options = slideOptions;
        fields.options.objectFields.defaultSlide.readOnly = false;
        fields.options.objectFields.defaultSlide.description = "The slide to show initially";
        fields.options.objectFields.defaultSlide.renderValue = undefined;
      } else {
        fields.options.objectFields.defaultSlide.description = "Add slides to the slider to select a default slide";
        fields.options.objectFields.defaultSlide.readOnly = true;
        fields.options.objectFields.defaultSlide.renderValue = () => <>No slides found</>;
      }
    }
    return fields;
  },
  render: Render,
};
