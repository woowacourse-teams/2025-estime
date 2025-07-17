import React, { useState, useCallback, useRef, useEffect } from 'react';
import { isItPast, isValidDate } from '@/utils/Calendar/dateUtils';
import { formatDateToString } from '@/utils/Calendar/format';

interface SimpleDragSelectionOptions {
  selectedDates: Set<string>;
  setSelectedDates: (dates: Set<string>) => void;
  today: Date;
}
type DragState = 'add' | 'remove';

export const useDragSelection = ({
  selectedDates,
  setSelectedDates,
  today,
}: SimpleDragSelectionOptions) => {
  const [dragState, setDragState] = useState<DragState>('add');
  const draggingRef = useRef(false);

  const determineDragState = useCallback(
    (date: Date): DragState => {
      const dateString = formatDateToString(date);
      return !selectedDates.has(dateString) ? 'add' : 'remove';
    },
    [selectedDates]
  );

  const addRemoveDate = useCallback(
    (date: Date, state: DragState) => {
      const dateString = formatDateToString(date);
      const newSelectedDates = new Set(selectedDates);

      if (state === 'add') {
        newSelectedDates.add(dateString);
      } else {
        newSelectedDates.delete(dateString);
      }

      setSelectedDates(newSelectedDates);
    },
    [selectedDates, setSelectedDates]
  );

  const handleMouseDown = useCallback(
    (date: Date | null) => {
      if (!date || !isValidDate(date) || isItPast(date, today)) return;

      const state = determineDragState(date);

      setDragState(state);
      draggingRef.current = true;

      addRemoveDate(date, state);
    },
    [today, determineDragState, addRemoveDate]
  );

  const handleMouseEnter = useCallback(
    (date: Date | null) => {
      if (!draggingRef.current || !date || !isValidDate(date) || isItPast(date, today)) return;

      addRemoveDate(date, dragState);
    },
    [today, dragState, addRemoveDate]
  );

  const handleMouseUp = useCallback((e?: React.MouseEvent) => {
    if (!draggingRef.current) return;

    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    draggingRef.current = false;
  }, []);

  // 캘린더 영역에서 마우스가 벗어날 때
  const handleMouseLeave = useCallback(() => {
    if (draggingRef.current) {
      handleMouseUp();
    }
  }, [handleMouseUp]);

  // 혹시 event leaking 방지를 위해 넣어 둡니다.
  // 현재는 없이도 정상 동작합니다.
  // 모바일 환경에서는 필요 할수 있습니다.
  // useEffect(() => {
  //   const handleGlobalMouseUp = () => {
  //     if (draggingRef.current) {
  //       draggingRef.current = false;
  //     }
  //   };

  //   if (draggingRef.current) {
  //     document.addEventListener('mouseup', handleGlobalMouseUp);

  //     return () => {
  //       document.removeEventListener('mouseup', handleGlobalMouseUp);
  //     };
  //   }
  // }, [draggingRef]);

  // 터치 이벤트 지원
  const handleTouchStart = useCallback(
    (date: Date | null) => {
      handleMouseDown(date);
    },
    [handleMouseDown]
  );

  const handleTouchMove = useCallback(
    (
      e: React.TouchEvent,
      containerRef: React.RefObject<{ contains: (element: unknown) => boolean }>
    ) => {
      if (!draggingRef.current || !containerRef.current) return;

      e.preventDefault();

      const touch = e.changedTouches[0];
      const target = document.elementFromPoint(touch.clientX, touch.clientY);

      if (target && containerRef.current.contains(target)) {
        const dateStr = target?.getAttribute('data-date');
        if (dateStr) {
          const date = new Date(dateStr);
          if (isValidDate(date)) {
            addRemoveDate(date, dragState);
          }
        }
      }
    },
    [dragState, addRemoveDate]
  );

  const handleTouchEnd = useCallback(() => {
    handleMouseUp();
  }, [handleMouseUp]);

  return {
    handleMouseDown,
    handleMouseEnter,
    handleMouseUp,
    handleMouseLeave,

    // handleTouchStart,
    // handleTouchMove,
    // handleTouchEnd,

    reset: () => {
      draggingRef.current = false;
    },
  };
};
