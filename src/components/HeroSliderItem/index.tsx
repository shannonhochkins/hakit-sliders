import { ComponentConfig, RenderProps, Slot } from '@hakit/addon';
import styled from '@emotion/styled';

export type GridWidth = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export type GridHeight = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
interface TileProps {
  width: GridWidth;
  height: GridHeight;
}
const Tile = styled.div<TileProps>`
  grid-column: span ${({ width }) => width};
  grid-row: span ${({ height }) => height};
`;

export interface HeroSliderItemProps {
  // Add your props here
  width: GridWidth;
  height: GridWidth;
  content: Slot;
}

export function Render(props: RenderProps<HeroSliderItemProps>) {
  const { content: Content } = props;
  return <Tile width={props.width} height={props.height}><Content />{props.id}</Tile>;
}

// Example component configuration
export const config: ComponentConfig<HeroSliderItemProps> = {
  label: 'HeroSliderItem',
  fields: {
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
  render: Render,
};
