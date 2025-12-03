import styled from '@emotion/styled';

interface BulletsProps {
  count: number;
  activeIndex: number;
  onSelect: (index: number) => void;
  easingFn: string;
  durationMs: number;
}

const BulletsContainer = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: center;
  width: 100%;
  pointer-events: auto;
`;

const Bullet = styled.button<{ $active: boolean; $easing: string; $duration: number }>`
  height: 10px;
  border-radius: 999px;
  background: rgba(255,255,255,0.8);
  border: none;
  cursor: pointer;
  padding: 0;
  outline: none;
  width: ${p => (p.$active ? '40px' : '10px')};
  transition: width ${p => p.$duration}ms ${p => p.$easing},
              background ${p => p.$duration * 0.6}ms ${p => p.$easing},
              transform ${p => p.$duration}ms ${p => p.$easing};
  will-change: width, transform;
  &:hover {
    transform: scale(1.06);
    background: rgba(255,255,255,0.9);
  }
`;

export function CarouselBullets({ count, activeIndex, onSelect, easingFn, durationMs }: BulletsProps) {
  return (
    <BulletsContainer>
      {Array.from({ length: count }).map((_, i) => (
        <Bullet
          key={i}
          $active={i === activeIndex}
          $easing={easingFn}
          $duration={durationMs}
          aria-label={`Go to slide ${i + 1}`}
          onClick={() => onSelect(i)}
        />
      ))}
    </BulletsContainer>
  );
}


