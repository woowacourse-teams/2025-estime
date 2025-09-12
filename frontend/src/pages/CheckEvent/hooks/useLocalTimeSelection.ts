import { useRef, useCallback, useState } from 'react';
import { useLockBodyScroll } from '../../../shared/hooks/common/useLockBodyScroll';
import { useTimeSelectionContext } from '../contexts/TimeSelectionContext';
import { useStableSelectedTimes } from './useStableSelectedTimes';

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

interface UseLocalTimeSelectionOptions {
  initialSelectedTimes: Set<string>;
}

const useLocalTimeSelection = ({ initialSelectedTimes }: UseLocalTimeSelectionOptions) => {
  const { commitSelectedTimes } = useTimeSelectionContext();

  // 로컬 상태로 selectedTimes 관리
  const [localSelectedTimes, setLocalSelectedTimes] = useState<Set<string>>(
    () => new Set(initialSelectedTimes)
  );

  // Set 객체의 참조 안정성 확보
  const stableSelectedTimes = useStableSelectedTimes(localSelectedTimes);

  const draggingRef = useRef(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const [isTouch, setIsTouch] = useState(false);
  const hoveredRef = useRef<Set<string>>(new Set());
  const dragModeRef = useRef<'add' | 'remove'>('add');

  useLockBodyScroll(isTouch);

  // initialSelectedTimes가 변경되면 로컬 상태도 업데이트
  const updateLocalTimes = useCallback((newTimes: Set<string>) => {
    setLocalSelectedTimes(new Set(newTimes));
  }, []);

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
      dragModeRef.current = localSelectedTimes.has(time) ? 'remove' : 'add';
      if (isTouchEvent) return;

      // 첫 셀 처리
      const updatedSet = new Set(localSelectedTimes);
      if (dragModeRef.current === 'add') updatedSet.add(time);
      else updatedSet.delete(time);

      hoveredRef.current.add(time);
      setLocalSelectedTimes(updatedSet);
    },
    [localSelectedTimes]
  );

  const onMove = useCallback(
    (event: React.MouseEvent | React.TouchEvent) => {
      if (!draggingRef.current) return;

      const { x: endX, y: endY } = getEventCoords(event);
      const minX = Math.min(startX.current, endX);
      const minY = Math.min(startY.current, endY);
      const maxX = Math.max(startX.current, endX);
      const maxY = Math.max(startY.current, endY);

      const updatedSet = new Set(localSelectedTimes);

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

      setLocalSelectedTimes(updatedSet);
    },
    [localSelectedTimes]
  );

  const onEnd = useCallback(() => {
    if (!draggingRef.current) {
      const updatedSet = new Set(localSelectedTimes);
      hoveredRef.current.forEach((time) => toggleItem(time, updatedSet));
      setLocalSelectedTimes(updatedSet);
      // 드래그가 끝나면 상위로 commit
      commitSelectedTimes(updatedSet);
    } else {
      // 드래그가 끝나면 상위로 commit
      commitSelectedTimes(localSelectedTimes);
    }

    hoveredRef.current.clear();
    draggingRef.current = false;
    setIsTouch(false);
  }, [localSelectedTimes, commitSelectedTimes]);

  const reset = useCallback(() => {
    draggingRef.current = false;
  }, []);

  return {
    localSelectedTimes: stableSelectedTimes,
    updateLocalTimes,
    onMouseDown: onStart,
    onMouseMove: onMove,
    onMouseUp: onEnd,
    onMouseLeave: onEnd,
    onTouchStart: onStart,
    onTouchMove: onMove,
    onTouchEnd: onEnd,
    reset,
  };
};

export default useLocalTimeSelection;
