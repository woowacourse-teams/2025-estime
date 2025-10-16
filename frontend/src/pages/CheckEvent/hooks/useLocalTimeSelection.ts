import { useRef, useCallback, useMemo, useEffect } from 'react';
import { useUserAvailability, userAvailabilityStore } from '../stores/userAvailabilityStore';
import usePreventScroll from './usePreventScroll';
import { useTimetableHoverContext } from '../providers/TimetableProvider';

type TimeCellHitbox = {
  key: string;
  left: number;
  right: number;
  top: number;
  bottom: number;
};

const useLocalTimeSelection = () => {
  const selectedTimes = useUserAvailability().selectedTimes;

  const { timeTableCellHover } = useTimetableHoverContext();

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

  const flushCellClasses = useCallback(() => {
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
  }, []);

  const updateCellClasses = useCallback(() => {
    if (renderAnimationFrameId.current != null) return;
    renderAnimationFrameId.current = requestAnimationFrame(flushCellClasses);
  }, [flushCellClasses]);

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

  const updateHoverLabel = useCallback(
    (cellKey: string | null) => {
      if (!cellKey) {
        timeTableCellHover(null);
        return;
      }
      const timeText = cellKey.split('T')[1];
      timeTableCellHover(timeText);
    },
    [timeTableCellHover]
  );

  const onDragStart = useCallback(
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

      updateHoverLabel(cellKey);
      updateCellClasses();
    },
    [updateCellClasses, addDraggingClass, updateHoverLabel]
  );

  const onDragMove = useCallback(
    (event: React.PointerEvent) => {
      const bounds = containerBoundingRectRef.current;
      if (!bounds) return;

      const pointerX = event.clientX - bounds.left;
      const pointerY = event.clientY - bounds.top;

      const hoveredCell = dragHitboxesRef.current.find(
        (cell) =>
          pointerX >= cell.left &&
          pointerX <= cell.right &&
          pointerY >= cell.top &&
          pointerY <= cell.bottom
      );

      updateHoverLabel(hoveredCell?.key ?? null);

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

      return didChange;
    },
    [updateHoverLabel]
  );

  const cleanUp = useCallback(() => {
    removeDraggingClass();
    dragHitboxesRef.current = [];
    containerBoundingRectRef.current = null;
  }, [removeDraggingClass]);

  const cancelrAF = useCallback(() => {
    if (renderAnimationFrameId.current != null) {
      cancelAnimationFrame(renderAnimationFrameId.current);
      renderAnimationFrameId.current = null;
    }
  }, []);

  const onDragEnd = useCallback(() => {
    try {
      cancelrAF();
      flushCellClasses();
      commitSelection();
      updateHoverLabel(null);
    } finally {
      cleanUp();
    }
  }, [cancelrAF, flushCellClasses, cleanUp, updateHoverLabel]);

  const handleDragStart = useCallback(
    (e: React.PointerEvent) => {
      e.currentTarget.setPointerCapture(e.pointerId);
      onDragStart(e);
    },
    [onDragStart]
  );

  const handleDragMove = useCallback(
    (event: React.PointerEvent) => {
      const didChange = onDragMove(event);
      if (didChange) updateCellClasses();
    },
    [onDragMove, updateCellClasses]
  );

  const handleDragEnd = useCallback(
    (e: React.PointerEvent) => {
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } finally {
        onDragEnd();
      }
    },
    [onDragEnd]
  );

  useEffect(() => {
    currentWorkingSetRef.current = new Set(selectedTimes);
    updateCellClasses();
  }, [selectedTimes, updateCellClasses]);

  /** 최종 반영 */
  const commitSelection = () => {
    userAvailabilityStore.setState((prev) => ({
      ...prev,
      selectedTimes: new Set(currentWorkingSetRef.current),
    }));
  };

  const pointerHandlers = useMemo(
    () => ({
      onPointerDown: handleDragStart,
      onPointerMove: handleDragMove,
      onPointerUp: handleDragEnd,
      onPointerCancel: handleDragEnd,
      onLostPointerCapture: handleDragEnd,
    }),
    [handleDragStart, handleDragMove, handleDragEnd]
  );

  return { containerRef, pointerHandlers };
};

export default useLocalTimeSelection;
