import { useRef, useCallback, useMemo, useEffect, useState } from 'react';
import { useLockBodyScroll } from '@/shared/hooks/common/useLockBodyScroll';
import { useUserAvailability, userAvailabilityStore } from '../stores/userAvailabilityStore';

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
  const [isTouch, setIsTouch] = useState(false);
  const dragStartX = useRef(0);
  const dragStartY = useRef(0);
  const selectionModeRef = useRef<'add' | 'remove'>('add');
  const isDraggingRef = useRef(false);

  const containerBoundingRectRef = useRef<DOMRectReadOnly | null>(null);
  const dragHitboxesRef = useRef<TimeCellHitbox[]>([]);
  const renderAnimationFrameId = useRef<number | null>(null);

  useLockBodyScroll(isTouch);

  /** 셀 UI 클래스 갱신 */
  const updateCellClasses = () => {
    if (renderAnimationFrameId.current != null) return;
    renderAnimationFrameId.current = requestAnimationFrame(() => {
      renderAnimationFrameId.current = null;
      const container = containerRef.current;
      if (!container) return;

      container.querySelectorAll<HTMLElement>('.heat-map-cell').forEach((cell) => {
        const dateTime = cell.dataset.time;
        if (!dateTime) return;
        cell.classList.toggle('selected', currentWorkingSetRef.current.has(dateTime));
      });
    });
  };

  /** 셀 hitbox 캐싱 */
  const cacheDragHitboxes = () => {
    const container = containerRef.current;
    if (!container) return;
    const containerRect = container.getBoundingClientRect();
    containerBoundingRectRef.current = containerRect;

    dragHitboxesRef.current = Array.from(
      container.querySelectorAll<HTMLElement>('.heat-map-cell')
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

  /** 드래그 시작 */
  const handleDragStart = useCallback((event: React.PointerEvent) => {
    if (event.pointerType === 'touch') setIsTouch(true);
    cacheDragHitboxes();

    const bounds = containerBoundingRectRef.current;
    if (!bounds) return;

    const targetCell = (event.target as HTMLElement).closest(
      '.heat-map-cell'
    ) as HTMLElement | null;
    const cellKey = targetCell?.dataset.time;
    if (!cellKey) return;

    isDraggingRef.current = true;
    dragStartX.current = event.clientX - bounds.left;
    dragStartY.current = event.clientY - bounds.top;

    selectionModeRef.current = currentWorkingSetRef.current.has(cellKey) ? 'remove' : 'add';

    if (selectionModeRef.current === 'add') {
      currentWorkingSetRef.current.add(cellKey);
    } else {
      currentWorkingSetRef.current.delete(cellKey);
    }

    updateCellClasses();
  }, []);

  /** 드래그 중 */
  const handleDragMove = useCallback((event: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
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
  }, []);

  useEffect(() => {
    currentWorkingSetRef.current = selectedTimes;
    updateCellClasses();
  }, [selectedTimes]);

  /** 최종 반영 */
  const commitSelection = () => {
    userAvailabilityStore.setState((prev) => ({
      ...prev,
      selectedTimes: new Set(currentWorkingSetRef.current),
    }));
  };

  const handleDragEnd = useCallback(() => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    commitSelection();
    updateCellClasses();
    dragHitboxesRef.current = [];
    containerBoundingRectRef.current = null;
    setIsTouch(false);
  }, []);

  const handleDragLeave = useCallback(() => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    commitSelection();
    dragHitboxesRef.current = [];
    containerBoundingRectRef.current = null;
    setIsTouch(false);
  }, []);

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
