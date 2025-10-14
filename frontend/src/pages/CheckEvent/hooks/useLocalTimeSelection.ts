import { useRef, useCallback, useMemo, useEffect } from 'react';
import { useUserAvailability, userAvailabilityStore } from '../stores/userAvailabilityStore';
import usePreventScroll from './usePreventScroll';

type TimeCellHitbox = {
  key: string;
  left: number;
  right: number;
  top: number;
  bottom: number;
};

const useLocalTimeSelection = () => {
  const selectedTimes = useUserAvailability().selectedTimes;

  // 전역 값 복제 → 드래그 중 임시 보관
  const currentWorkingSetRef = useRef<Set<string>>(new Set(selectedTimes));

  const containerRef = useRef<HTMLDivElement | null>(null);
  const dragStartX = useRef(0);
  const dragStartY = useRef(0);
  const selectionModeRef = useRef<'add' | 'remove'>('add');

  const containerBoundingRectRef = useRef<DOMRectReadOnly | null>(null);
  const dragHitboxesRef = useRef<TimeCellHitbox[]>([]);
  const renderAnimationFrameId = useRef<number | null>(null);

  usePreventScroll(containerRef);

  const addDraggingClass = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    container.classList.add('dragging');
  }, []);

  const removeDraggingClass = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    container.classList.remove('dragging');
  }, []);

  const updateCellClasses = useCallback(() => {
    if (renderAnimationFrameId.current != null) return;

    renderAnimationFrameId.current = requestAnimationFrame(() => {
      try {
        const container = containerRef.current;
        if (!container) return;

        container.querySelectorAll<HTMLElement>('.time-table-cell').forEach((cell) => {
          const dateTime = cell.dataset.time;
          if (!dateTime) return;
          cell.classList.toggle('selected', currentWorkingSetRef.current.has(dateTime));
        });
      } finally {
        renderAnimationFrameId.current = null;
      }
    });
  }, []);

  const cacheDragHitboxes = () => {
    const container = containerRef.current;
    if (!container) return;
    const containerRect = container.getBoundingClientRect();
    containerBoundingRectRef.current = containerRect;

    dragHitboxesRef.current = Array.from(
      container.querySelectorAll<HTMLElement>('.time-table-cell')
    ).map((el) => {
      const rect = el.getBoundingClientRect();
      return {
        key: el.dataset.time!,
        left: rect.left - containerRect.left,
        right: rect.right - containerRect.left,
        top: rect.top - containerRect.top,
        bottom: rect.bottom - containerRect.top,
      };
    });
  };

  const handleDragStart = useCallback(
    (event: React.PointerEvent) => {
      cacheDragHitboxes();

      const bounds = containerBoundingRectRef.current;
      if (!bounds) return;

      const targetCell = (event.target as HTMLElement).closest(
        '.time-table-cell'
      ) as HTMLElement | null;
      const cellKey = targetCell?.dataset.time;
      if (!cellKey) return;

      addDraggingClass();

      dragStartX.current = event.clientX - bounds.left;
      dragStartY.current = event.clientY - bounds.top;

      selectionModeRef.current = currentWorkingSetRef.current.has(cellKey) ? 'remove' : 'add';

      if (selectionModeRef.current === 'add') {
        currentWorkingSetRef.current.add(cellKey);
      } else {
        currentWorkingSetRef.current.delete(cellKey);
      }

      updateCellClasses();
    },
    [updateCellClasses, addDraggingClass]
  );

  const handleDragMove = useCallback(
    (event: React.PointerEvent) => {
      const bounds = containerBoundingRectRef.current;
      if (!bounds) return;

      const pointerX = event.clientX - bounds.left;
      const pointerY = event.clientY - bounds.top;

      const selectionRect = {
        left: Math.min(dragStartX.current, pointerX),
        top: Math.min(dragStartY.current, pointerY),
        right: Math.max(dragStartX.current, pointerX),
        bottom: Math.max(dragStartY.current, pointerY),
      };

      let didChange = false;
      for (const cell of dragHitboxesRef.current) {
        const overlaps =
          cell.left < selectionRect.right &&
          cell.right > selectionRect.left &&
          cell.top < selectionRect.bottom &&
          cell.bottom > selectionRect.top;

        if (!overlaps) continue;

        if (selectionModeRef.current === 'add') {
          if (!currentWorkingSetRef.current.has(cell.key)) {
            currentWorkingSetRef.current.add(cell.key);
            didChange = true;
          }
        } else {
          if (currentWorkingSetRef.current.has(cell.key)) {
            currentWorkingSetRef.current.delete(cell.key);
            didChange = true;
          }
        }
      }

      if (didChange) updateCellClasses();
    },
    [updateCellClasses]
  );

  useEffect(() => {
    currentWorkingSetRef.current = selectedTimes;
    updateCellClasses();
  }, [selectedTimes, updateCellClasses]);

  /** 최종 반영 */
  const commitSelection = () => {
    userAvailabilityStore.setState((prev) => ({
      ...prev,
      selectedTimes: new Set(currentWorkingSetRef.current),
    }));
  };

  const cleanUp = useCallback(() => {
    updateCellClasses();
    removeDraggingClass();
    dragHitboxesRef.current = [];
    containerBoundingRectRef.current = null;
  }, [updateCellClasses, removeDraggingClass]);

  const handleDragEnd = useCallback(() => {
    commitSelection();
    cleanUp();
  }, [cleanUp]);

  const handleDragLeave = useCallback(() => {
    commitSelection();
    cleanUp();
  }, [cleanUp]);

  const pointerHandlers = useMemo(
    () => ({
      onPointerDown: handleDragStart,
      onPointerMove: handleDragMove,
      onPointerUp: handleDragEnd,
      onPointerLeave: handleDragLeave,
    }),
    [handleDragStart, handleDragMove, handleDragEnd, handleDragLeave]
  );

  return { containerRef, pointerHandlers };
};

export default useLocalTimeSelection;
