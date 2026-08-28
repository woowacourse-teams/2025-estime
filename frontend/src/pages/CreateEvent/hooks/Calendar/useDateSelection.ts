import React, { useState, useCallback, useRef, useEffect } from 'react';
import { FormatManager } from '@/shared/utils/common/FormatManager';
import { DateManager } from '@/shared/utils/common/DateManager';
import { showToast } from '@/shared/store/toastStore';

interface SimpleDragSelectionOptions {
  selectedDates: Set<string>;
  setSelectedDates: (dates: Set<string>) => void;
  today: Date;
}
type DragState = 'add' | 'remove';

// 서버(Room.MAX_AVAILABLE_DATE_COUNT)와 같은 값. 한쪽만 바꾸면 서버 400 이 사용자에게 그대로 나간다.
const MAX_AVAILABLE_DATE_COUNT = 90;

export const useDateSelection = ({
  selectedDates,
  setSelectedDates,
  today,
}: SimpleDragSelectionOptions) => {
  const [dragState, setDragState] = useState<DragState>('add');
  const draggingRef = useRef(false);

  const containerRef = useRef<HTMLDivElement>(null);

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
        showToast({
          type: 'warning',
          message: '과거 날짜는 선택할 수 없습니다.',
        });
        return;
      }
      if (!newSelectedDates.has(dateString) && newSelectedDates.size >= MAX_AVAILABLE_DATE_COUNT) {
        showToast({
          type: 'warning',
          message: `날짜는 최대 ${MAX_AVAILABLE_DATE_COUNT}개까지 선택할 수 있습니다.`,
        });
        return;
      }

      newSelectedDates.add(dateString);
      setSelectedDates(newSelectedDates);
    },
    [selectedDates, setSelectedDates, today]
  );

  const handlePointerDown = useCallback(
    (date: Date | null) => {
      if (!date) return;

      const state = determineDragState(date);

      setDragState(state);
      draggingRef.current = true;

      addRemoveDate(date, state);
    },
    [determineDragState, addRemoveDate]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>, date: Date | null) => {
      if (!draggingRef.current || !date || DateManager.isPast(date, today) || !containerRef.current)
        return;

      const target = document.elementFromPoint(e.clientX, e.clientY);

      if (target && containerRef.current.contains(target)) {
        const dateStr = target?.getAttribute('data-date');
        if (dateStr) {
          const date = new Date(dateStr);
          if (!DateManager.isPast(date, today)) {
            addRemoveDate(date, dragState);
          }
        }
      }
    },
    [today, dragState, addRemoveDate]
  );

  const handlePointerUp = useCallback((e?: React.MouseEvent) => {
    if (!draggingRef.current) return;

    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    draggingRef.current = false;
  }, []);

  const handlePointerLeave = useCallback(() => {
    if (draggingRef.current) {
      handlePointerUp();
    }
  }, [handlePointerUp]);

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (draggingRef.current) {
        draggingRef.current = false;
      }
    };

    if (draggingRef.current) {
      document.addEventListener('mouseup', handleGlobalMouseUp);

      return () => {
        document.removeEventListener('mouseup', handleGlobalMouseUp);
      };
    }
  }, [draggingRef]);

  return {
    containerRef,

    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handlePointerLeave,

    reset: () => {
      draggingRef.current = false;
    },
  };
};
