import throttle from 'lodash.throttle';
import { clamp, range } from 'ramda';
import React, {
  MouseEvent as ReactMouseEvent,
  TouchEvent as ReactTouchEvent,
  useCallback,
  useEffect,
  useState,
} from 'react';

import Triangle from './Triangle';

type Props = {
  value: number;
  onChange: (value: number) => void;
};

const SPACING = 3;
const DRAG_INCREMENT = 15;
const THROTTLE_TIMING = 5;

const GRAY = 'rgba(160, 160, 160, 0.4)';
const PINK = '#F424CF';
const PURPLE = '#7524F4';

const getLegalValue = clamp(-6, 6);

const TriangleSlider = ({ value, onChange }: Props) => {
  const [y0, setY0] = useState<number | undefined>(undefined);
  const [value0, setValue0] = useState(value);

  const clampedValue = getLegalValue(value);

  // Drag handlers
  const handleDragStart = (y0: number) => {
    setValue0(value);
    setY0(y0);
  };
  const handleDragMove = useCallback(
    throttle(
      (y: number) => {
        if (y0 == null) {
          return;
        }

        const dy = y - y0;
        const newValue = getLegalValue(value0 - Math.round(dy / DRAG_INCREMENT));
        onChange(newValue);
      },
      THROTTLE_TIMING,
      { leading: true },
    ),
    [clampedValue, onChange, y0],
  );
  const handleDragEnd = useCallback(() => {
    setY0(undefined);
  }, [setY0]);

  // Manage window event listeners
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      handleDragMove(event.clientY);
    };
    const handleTouchMove = (event: TouchEvent) => {
      handleDragMove(event.touches[0].clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleDragEnd);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleDragEnd);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleDragEnd);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleDragEnd);
    };
  }, [handleDragMove, handleDragEnd]);

  // wrap drag handlers with browser event managment
  const handleMouseDown = (event: ReactMouseEvent) => {
    event.preventDefault();
    handleDragStart(event.clientY);
  };
  const handleTouchStart = (event: ReactTouchEvent) => {
    event.preventDefault();
    handleDragStart(event.touches[0].clientY);
  };

  return (
    <div
      style={{
        cursor: 'ns-resize',
        display: 'grid',
        gridGap: SPACING,
        touchAction: 'none',
        padding: 10,
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      {clampedValue > 0 ? (
        // up triangles
        range(0, clampedValue).map(n => <Triangle key={n} color={PINK} />)
      ) : clampedValue < 0 ? (
        // down triangles
        range(clampedValue, 0).map(n => <Triangle key={n} color={PURPLE} flip />)
      ) : (
        <>
          <Triangle color={GRAY} />
          <Triangle color={GRAY} flip />
        </>
      )}
    </div>
  );
};

export default TriangleSlider;
