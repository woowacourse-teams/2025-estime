import { useRef, useCallback, useEffect, useMemo } from 'react';
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

  const updateCellClasses = (isInitializing = false) => {
    if (renderAnimationFrameId.current != null) return;
    renderAnimationFrameId.current = requestAnimationFrame(() => {
      renderAnimationFrameId.current = null;

      const container = containerRef.current;
      if (!container) return;

      // 모든 heat-map-cell 요소의 클래스를 업데이트
      container.querySelectorAll<HTMLElement>('.heat-map-cell').forEach((cell) => {
        const dateTime = cell.getAttribute('data-time');
        if (!dateTime) return;

        const isSelected = currentWorkingSetRef.current.has(dateTime);

        // fetch 후 초기화가 필요한 경우 (서버 데이터로 초기값 설정 시)
        if (isInitializing) {
          // 기존 selected 클래스를 완전히 제거하고 새로운 상태로 초기화
          cell.classList.remove('selected');
          if (isSelected) {
            cell.classList.add('selected');
          }
        } else {
          // isSelected가 true면 → 'selected' 클래스 추가
          // isSelected가 false면 → 'selected' 클래스 제거

          cell.classList.toggle('selected', isSelected);
        }
      });
    });
  };

  useLockBodyScroll(isTouch.current);

  useEffect(() => {
    const nextSelectedTimes = new Set(initialSelectedTimes);
    currentWorkingSetRef.current = new Set(nextSelectedTimes);
    // 필요... 한가? 없어도 되는데 버그 방지.
    updateCurrentSelectedTimes(nextSelectedTimes);
    updateCellClasses(true);
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

    updateCellClasses();
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

    if (didChange) updateCellClasses();
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

    updateCellClasses();
    updateCurrentSelectedTimes(finalSelectedTimes);
  }, [updateCurrentSelectedTimes, resetDragState]);

  const handleDragLeave = useCallback(() => {
    isDraggingRef.current = false;
    const finalSelectedTimes = new Set(currentWorkingSetRef.current);
    updateCurrentSelectedTimes(finalSelectedTimes);
    resetDragState();
  }, [resetDragState, updateCurrentSelectedTimes]);

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
    pointerHandlers,
  };
};

export default useLocalTimeSelection;
