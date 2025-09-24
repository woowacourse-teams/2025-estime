import { useRef, useCallback, useState, useEffect, useMemo } from 'react';
import { useLockBodyScroll } from '../../../shared/hooks/common/useLockBodyScroll';
import { useTimeSelectionContext } from '../contexts/TimeSelectionContext';

interface UseLocalTimeSelectionOptions {
  initialSelectedTimes: Set<string>;
}

type TimeCellHitbox = {
  key: string; // data-time

  left: number;
  right: number;
  top: number;
  bottom: number;
};

const useLocalTimeSelection = ({ initialSelectedTimes }: UseLocalTimeSelectionOptions) => {
  const { updateCurrentSelectedTimes } = useTimeSelectionContext();

  // 렌더 트리거용(부모·자식 렌더는 이 값으로만 결정)
  const [localSelectedTimes, setLocalSelectedTimes] = useState<Set<string>>(
    () => new Set(initialSelectedTimes)
  );

  // 임계영역에 접근하기 위한 ref
  const currentWorkingSetRef = useRef<Set<string>>(new Set(initialSelectedTimes));

  const containerRef = useRef<HTMLDivElement | null>(null);
  const isTouch = useRef(false);

  const dragStartX = useRef(0);
  const dragStartY = useRef(0);
  const selectionModeRef = useRef<'add' | 'remove'>('add');
  const isDraggingRef = useRef(false);
  // 스냅샷
  const containerBoundingRectRef = useRef<DOMRectReadOnly | null>(null);
  const dragHitboxesRef = useRef<TimeCellHitbox[]>([]);

  // 배치(rAF)
  const renderAnimationFrameId = useRef<number | null>(null);

  const triggerRenderUpdate = () => {
    if (renderAnimationFrameId.current != null) return;
    renderAnimationFrameId.current = requestAnimationFrame(() => {
      renderAnimationFrameId.current = null;
      setLocalSelectedTimes(new Set(currentWorkingSetRef.current));
    });
  };

  useLockBodyScroll(isTouch.current);

  useEffect(() => {
    const nextSelectedTimes = new Set(initialSelectedTimes);
    currentWorkingSetRef.current = new Set(nextSelectedTimes);
    setLocalSelectedTimes(nextSelectedTimes);
    updateCurrentSelectedTimes(nextSelectedTimes);
  }, [initialSelectedTimes, updateCurrentSelectedTimes]);

  const cacheDragHitboxes = () => {
    const container = containerRef.current;
    if (!container) return;
    const containerRect = container.getBoundingClientRect();
    containerBoundingRectRef.current = containerRect;

    const hitboxes: TimeCellHitbox[] = [];
    // 모든 heat-map-cell 요소를 순회하며
    container.querySelectorAll<HTMLElement>('.heat-map-cell').forEach((selectableElement) => {
      const dateTime = selectableElement.getAttribute('data-time');
      if (!dateTime) return;
      const elementRect = selectableElement.getBoundingClientRect();
      hitboxes.push({
        key: dateTime,
        left: elementRect.left - containerRect.left,
        right: elementRect.right - containerRect.left,
        top: elementRect.top - containerRect.top,
        bottom: elementRect.bottom - containerRect.top,
      });
    });
    dragHitboxesRef.current = hitboxes;
  };

  const handleDragStart = useCallback((event: React.PointerEvent) => {
    if (event.pointerType === 'touch') isTouch.current = true;

    cacheDragHitboxes();

    const bounds = containerBoundingRectRef.current;
    if (!bounds) return;

    // 클릭한 요소에서 가장 가까운 셀 찾기
    const targetCell = (event.target as HTMLElement).closest(
      '.heat-map-cell'
    ) as HTMLElement | null;
    const cellKey = targetCell?.dataset.time;
    if (!cellKey) return;
    isDraggingRef.current = true;
    // 컨테이너 기준 시작 좌표 보정
    const startX = event.clientX - bounds.left;
    const startY = event.clientY - bounds.top;
    dragStartX.current = startX;
    dragStartY.current = startY;

    // 드래그 의도(add/remove) 결정
    selectionModeRef.current = currentWorkingSetRef.current.has(cellKey) ? 'remove' : 'add';

    // 첫 셀 즉시 반영
    if (selectionModeRef.current === 'add') {
      currentWorkingSetRef.current.add(cellKey);
    } else {
      currentWorkingSetRef.current.delete(cellKey);
    }

    triggerRenderUpdate();
  }, []);

  const handleDragMove = useCallback((event: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const bounds = containerBoundingRectRef.current;
    if (!bounds) return;

    // 포인터의 컨테이너 기준 좌표
    const pointerX = event.clientX - bounds.left;
    const pointerY = event.clientY - bounds.top;

    // 현재 드래그 선택 사각형
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

    if (didChange) triggerRenderUpdate();
  }, []);

  const resetDragState = useCallback(() => {
    dragHitboxesRef.current = [];
    containerBoundingRectRef.current = null;
    isTouch.current = false;
  }, []);

  const handleDragEnd = useCallback(() => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    resetDragState();
    const finalSelectedTimes = new Set(currentWorkingSetRef.current);

    triggerRenderUpdate();
    updateCurrentSelectedTimes(finalSelectedTimes);
  }, [updateCurrentSelectedTimes, resetDragState]);

  const handleDragLeave = useCallback(() => {
    isDraggingRef.current = false;
    resetDragState();
  }, [resetDragState]);

  const pointerHandlers = useMemo(
    () => ({
      onPointerDown: handleDragStart,
      onPointerMove: handleDragMove,
      onPointerUp: handleDragEnd,
      onPointerLeave: handleDragLeave,
    }),
    [handleDragEnd, handleDragLeave, handleDragMove, handleDragStart]
  );

  return {
    containerRef,
    localSelectedTimes,
    pointerHandlers,
  };
};

export default useLocalTimeSelection;
