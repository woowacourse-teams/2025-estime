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

  const syncSelectedTimes = useCallback(
    (newSelectedTimes: Set<string>) => {
      setLocalSelectedTimes(new Set(newSelectedTimes));
      updateCurrentSelectedTimes(new Set(newSelectedTimes));
    },
    [updateCurrentSelectedTimes]
  );

  const draggingRef = useRef(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const [isTouch, setIsTouch] = useState(false);
  const hoveredRef = useRef<Set<string>>(new Set());
  const dragModeRef = useRef<'add' | 'remove'>('add');

  const rafRef = useRef<number | null>(null);
  const pendingEventRef = useRef<React.PointerEvent | null>(null);

  useLockBodyScroll(isTouch);

  // initialSelectedTimes가 변경되면 로컬 상태와 컨텍스트 동기화
  useEffect(() => {
    const updatedSet = new Set(initialSelectedTimes);
    syncSelectedTimes(updatedSet);
  }, [initialSelectedTimes, syncSelectedTimes]);

  // RAF 처리 함수
  const processPointerMove = useCallback(() => {
    const event = pendingEventRef.current;
    if (!event || !draggingRef.current) {
      rafRef.current = null;
      return;
    }

    const minX = Math.min(startX.current, event.clientX);
    const minY = Math.min(startY.current, event.clientY);
    const maxX = Math.max(startX.current, event.clientX);
    const maxY = Math.max(startY.current, event.clientY);

    // 함수형 업데이트로 최신 상태 보장
    setLocalSelectedTimes((prevTimes) => {
      const updatedSet = new Set(prevTimes);

      Array.from(document.querySelectorAll('.selectable')).forEach((el) => {
        const time = el.getAttribute('data-time');
        if (!time) return;

        const rect = el.getBoundingClientRect();
        const inArea =
          rect.left < maxX && rect.right > minX && rect.top < maxY && rect.bottom > minY;

        if (inArea && !hoveredRef.current.has(time)) {
          if (dragModeRef.current === 'add') {
            updatedSet.add(time);
          } else {
            updatedSet.delete(time);
          }
          hoveredRef.current.add(time);
        }
      });

      return updatedSet;
    });

    pendingEventRef.current = null;
    rafRef.current = null;
  }, []);

  const onPointerDown = useCallback(
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
      if (dragModeRef.current === 'add') {
        updatedSet.add(time);
      } else {
        updatedSet.delete(time);
      }

      hoveredRef.current.add(time);
      setLocalSelectedTimes(updatedSet);
    },
    [localSelectedTimes]
  );

  const onPointerMove = useCallback(
    (event: React.PointerEvent) => {
      if (!draggingRef.current) return;

      // 최신 이벤트를 저장 (이전 이벤트를 덮어씀)
      pendingEventRef.current = event;

      // RAF가 이미 예약되어 있지 않으면 예약
      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(processPointerMove);
      }
    },
    [processPointerMove]
  );

  const onPointerUp = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    updateCurrentSelectedTimes(localSelectedTimes);

    hoveredRef.current.clear();
    draggingRef.current = false;
    setIsTouch(false);
    pendingEventRef.current = null;
  }, [updateCurrentSelectedTimes, localSelectedTimes]);

  const reset = useCallback(() => {
    draggingRef.current = false;
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    pendingEventRef.current = null;
  }, []);

  // 컴포넌트 언마운트 시 RAF 정리
  useEffect(() => {
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return {
    localSelectedTimes,
    pointerHandlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
    },
    reset,
  };
};

export default useLocalTimeSelection;
