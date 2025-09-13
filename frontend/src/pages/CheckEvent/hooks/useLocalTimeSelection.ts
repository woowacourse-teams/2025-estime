import { useRef, useCallback, useState, useEffect } from 'react';
import { useLockBodyScroll } from '../../../shared/hooks/common/useLockBodyScroll';
import { useTimeSelectionContext } from '../contexts/TimeSelectionContext';

interface UseLocalTimeSelectionOptions {
  initialSelectedTimes: Set<string>;
}

const useLocalTimeSelection = ({ initialSelectedTimes }: UseLocalTimeSelectionOptions) => {
  const { updateCurrentSelectedTimes } = useTimeSelectionContext();

  // 로컬 상태로 selectedTimes 관리
  const [localSelectedTimes, setLocalSelectedTimes] = useState<Set<string>>(
    () => new Set(initialSelectedTimes)
  );

  const draggingRef = useRef(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const [isTouch, setIsTouch] = useState(false);
  const hoveredRef = useRef<Set<string>>(new Set());
  const dragModeRef = useRef<'add' | 'remove'>('add');

  useLockBodyScroll(isTouch);

  // initialSelectedTimes가 변경되면 로컬 상태와 컨텍스트 동기화
  useEffect(() => {
    const updatedSet = new Set(initialSelectedTimes);
    setLocalSelectedTimes(updatedSet);
    updateCurrentSelectedTimes(updatedSet);
  }, [initialSelectedTimes, updateCurrentSelectedTimes]);

  const onStart = useCallback(
    (event: React.PointerEvent) => {
      draggingRef.current = true;
      hoveredRef.current.clear();

      startX.current = event.clientX;
      startY.current = event.clientY;

      setIsTouch(event.pointerType === 'touch');

      const target = (event.target as HTMLElement).closest('.selectable') as HTMLElement | null;
      if (!target) return;
      const time = target.getAttribute('data-time');
      if (!time) return;

      dragModeRef.current = localSelectedTimes.has(time) ? 'remove' : 'add';

      const updatedSet = new Set(localSelectedTimes);
      if (dragModeRef.current === 'add') updatedSet.add(time);
      else updatedSet.delete(time);

      hoveredRef.current.add(time);
      setLocalSelectedTimes(updatedSet);
      updateCurrentSelectedTimes(updatedSet);
    },
    [localSelectedTimes, updateCurrentSelectedTimes]
  );

  const onMove = useCallback(
    (event: React.PointerEvent) => {
      if (!draggingRef.current) return;

      const minX = Math.min(startX.current, event.clientX);
      const minY = Math.min(startY.current, event.clientY);
      const maxX = Math.max(startX.current, event.clientX);
      const maxY = Math.max(startY.current, event.clientY);

      const updatedSet = new Set(localSelectedTimes);

      Array.from(document.querySelectorAll('.selectable')).forEach((el) => {
        const time = el.getAttribute('data-time');
        if (!time) return;

        const rect = el.getBoundingClientRect();
        const inArea =
          rect.left < maxX && rect.right > minX && rect.top < maxY && rect.bottom > minY;
        if (inArea && !hoveredRef.current.has(time)) {
          if (dragModeRef.current === 'add') updatedSet.add(time);
          else updatedSet.delete(time);
          hoveredRef.current.add(time);
        }
      });

      setLocalSelectedTimes(updatedSet);
      updateCurrentSelectedTimes(updatedSet);
    },
    [localSelectedTimes, updateCurrentSelectedTimes]
  );

  const onEnd = useCallback(() => {
    updateCurrentSelectedTimes(localSelectedTimes);
    hoveredRef.current.clear();
    draggingRef.current = false;
    setIsTouch(false);
  }, [localSelectedTimes, updateCurrentSelectedTimes]);

  const reset = useCallback(() => {
    draggingRef.current = false;
  }, []);

  return {
    localSelectedTimes,
    onPointerDown: onStart,
    onPointerMove: onMove,
    onPointerUp: onEnd,
    onPointerLeave: onEnd,
    reset,
  };
};

export default useLocalTimeSelection;
