import { useRef, useCallback, useState } from 'react';
import { useLockBodyScroll } from '../../../shared/hooks/common/useLockBodyScroll';

interface DragSelectOptions {
  selectedTimes: Set<string>;
  setSelectedTimes: (times: Set<string>) => void;
}

const getEventCoords = (event: React.MouseEvent | React.TouchEvent) => {
  if ('touches' in event) {
    const touch = event.touches[0];
    return { x: touch.clientX, y: touch.clientY };
  } else {
    return { x: event.clientX, y: event.clientY };
  }
};

const toggleItem = (item: string, set: Set<string>) => {
  if (set.has(item)) set.delete(item);
  else set.add(item);
};

const useTimeSelection = ({ selectedTimes, setSelectedTimes }: DragSelectOptions) => {
  const draggingRef = useRef(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const [isTouch, setIsTouch] = useState(false);

  useLockBodyScroll(isTouch);

  // 좌표 추출 공통 함수

  const hoveredRef = useRef<Set<string>>(new Set());
  const dragModeRef = useRef<'add' | 'remove'>('add');

  const onStart = useCallback(
    (event: React.MouseEvent | React.TouchEvent) => {
      draggingRef.current = true;
      hoveredRef.current.clear();

      const { x, y } = getEventCoords(event);
      startX.current = x;
      startY.current = y;

      const isTouchEvent = 'touches' in event;

      setIsTouch(isTouchEvent);

      const target = (event.target as HTMLElement).closest('.selectable') as HTMLElement | null;
      if (!target) return;
      const time = target.getAttribute('data-time');
      if (!time) return;

      // 드래그 모드 결정
      dragModeRef.current = selectedTimes.has(time) ? 'remove' : 'add';
      if (isTouchEvent) return;

      // 첫 셀 처리
      const updatedSet = new Set(selectedTimes);
      if (dragModeRef.current === 'add') updatedSet.add(time);
      else updatedSet.delete(time);

      hoveredRef.current.add(time);
      setSelectedTimes(updatedSet);
    },
    [selectedTimes, setSelectedTimes]
  );

  const onMove = useCallback(
    (event: React.MouseEvent | React.TouchEvent) => {
      if (!draggingRef.current) return;

      const { x: endX, y: endY } = getEventCoords(event);
      const minX = Math.min(startX.current, endX);
      const minY = Math.min(startY.current, endY);
      const maxX = Math.max(startX.current, endX);
      const maxY = Math.max(startY.current, endY);

      const updatedSet = new Set(selectedTimes);

      Array.from(document.querySelectorAll('.selectable')).forEach((el) => {
        const time = el.getAttribute('data-time');
        if (!time) return;

        const rect = el.getBoundingClientRect();
        const inArea =
          rect.left < maxX && rect.right > minX && rect.top < maxY && rect.bottom > minY;
        if (inArea && !hoveredRef.current.has(time)) {
          // dragMode에 따라 add 또는 remove
          if (dragModeRef.current === 'add') updatedSet.add(time);
          else updatedSet.delete(time);

          hoveredRef.current.add(time);
        }
      });

      setSelectedTimes(updatedSet);
    },
    [selectedTimes, setSelectedTimes]
  );

  const onEnd = useCallback(() => {
    if (!draggingRef.current) {
      const updatedSet = new Set(selectedTimes);
      hoveredRef.current.forEach((time) => toggleItem(time, updatedSet));
      setSelectedTimes(updatedSet);
    }

    hoveredRef.current.clear();
    draggingRef.current = false;
    setIsTouch(false);
  }, [selectedTimes, setSelectedTimes]);

  return {
    onMouseDown: onStart,
    onMouseMove: onMove,
    onMouseUp: onEnd,
    onMouseLeave: onEnd,
    onTouchStart: onStart,
    onTouchMove: onMove,
    onTouchEnd: onEnd,
    reset: () => {
      draggingRef.current = false;
    },
  };
};

export default useTimeSelection;
