import React, { useState, useCallback, useRef } from 'react';
import { FormatManager } from '@/utils/common/FormatManager';
import { DateManager } from '@/utils/common/DateManager';
import { useToastContext } from '@/contexts/ToastContext';

interface SimpleDragSelectionOptions {
  selectedDates: Set<string>;
  setSelectedDates: (dates: Set<string>) => void;
  today: Date;
}
type DragState = 'add' | 'remove';

export const useDateSelection = ({
  selectedDates,
  setSelectedDates,
  today,
}: SimpleDragSelectionOptions) => {
  const [dragState, setDragState] = useState<DragState>('add');
  const draggingRef = useRef(false);
  const { addToast } = useToastContext();

  const determineDragState = useCallback(
    (date: Date): DragState => {
      const dateString = FormatManager.formatDate(date);
      return !selectedDates.has(dateString) ? 'add' : 'remove';
    },
    [selectedDates]
  );

  const addRemoveDate = useCallback(
    (date: Date, state: DragState) => {
      const dateString = FormatManager.formatDate(date);
      const newSelectedDates = new Set(selectedDates);

      if (state === 'remove') {
        newSelectedDates.delete(dateString);
        setSelectedDates(newSelectedDates);
        return;
      }
      if (DateManager.isPast(date, today)) {
        addToast({
          type: 'error',
          message: '과거 날짜는 선택할 수 없습니다.',
        });
        return;
      }
      if (
        DateManager.hasReachedMaxSelection(newSelectedDates) &&
        !newSelectedDates.has(dateString)
      ) {
        addToast({
          type: 'error',
          message: '최대 7개의 날짜를 선택할 수 있습니다.',
        });
        return;
      }

      newSelectedDates.add(dateString);
      setSelectedDates(newSelectedDates);
    },
    [selectedDates, setSelectedDates, addToast, today]
  );

  const onMouseDown = useCallback(
    (date: Date | null) => {
      if (!date) return;
      const state = determineDragState(date);

      setDragState(state);
      draggingRef.current = true;

      addRemoveDate(date, state);
    },
    [determineDragState, addRemoveDate]
  );

  const onMouseEnter = useCallback(
    (date: Date | null) => {
      if (!draggingRef.current || !date || DateManager.isPast(date, today)) return;

      addRemoveDate(date, dragState);
    },
    [today, dragState, addRemoveDate]
  );

  const onMouseUp = useCallback((e?: React.MouseEvent) => {
    if (!draggingRef.current) return;

    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    draggingRef.current = false;
  }, []);

  // 캘린더 영역에서 마우스가 벗어날 때
  const onMouseLeave = useCallback(() => {
    if (draggingRef.current) {
      onMouseUp();
    }
  }, [onMouseUp]);

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
  // const handleTouchStart = useCallback(
  //   (date: Date | null) => {
  //     onMouseDown(date);
  //   },
  //   [onMouseDown]
  // );

  // const handleTouchMove = useCallback(
  //   (
  //     e: React.TouchEvent,
  //     containerRef: React.RefObject<{ contains: (element: unknown) => boolean }>
  //   ) => {
  //     if (!draggingRef.current || !containerRef.current) return;

  //     e.preventDefault();

  //     const touch = e.changedTouches[0];
  //     const target = document.elementFromPoint(touch.clientX, touch.clientY);

  //     if (target && containerRef.current.contains(target)) {
  //       const dateStr = target?.getAttribute('data-date');
  //       if (dateStr) {
  //         const date = new Date(dateStr);
  //         if (isValidDate(date) || !isItPast(date, today)) {
  //           addRemoveDate(date, dragState);
  //         }
  //       }
  //     }
  //   },
  //   [dragState, addRemoveDate]
  // );

  // const handleTouchEnd = useCallback(() => {
  //   onMouseUp();
  // }, [onMouseUp]);

  return {
    onMouseDown,
    onMouseEnter,
    onMouseUp,
    onMouseLeave,

    // handleTouchStart,
    // handleTouchMove,
    // handleTouchEnd,

    reset: () => {
      draggingRef.current = false;
    },
  };
};
