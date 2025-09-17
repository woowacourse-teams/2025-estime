import { useRef, useCallback, useState, useEffect } from 'react';
import { useLockBodyScroll } from '../../../shared/hooks/common/useLockBodyScroll';
import { useTimeSelectionContext } from '../contexts/TimeSelectionContext';

interface UseLocalTimeSelectionOptions {
  initialSelectedTimes: Set<string>;
}

type TimeSnapPoint = {
  time: string; // data-time

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
  const isDraggingRef = useRef(false);
  const [isTouch, setIsTouch] = useState(false);

  const dragStartX = useRef(0);
  const dragStartY = useRef(0);
  const selectionModeRef = useRef<'add' | 'remove'>('add');

  // 스냅샷
  const containerBoundingRectRef = useRef<DOMRectReadOnly | null>(null);
  const timeSnapPointsRef = useRef<TimeSnapPoint[]>([]);

  // 배치(rAF)
  const renderAnimationFrameId = useRef<number | null>(null);

  const triggerRenderUpdate = () => {
    if (renderAnimationFrameId.current != null) return;
    renderAnimationFrameId.current = requestAnimationFrame(() => {
      renderAnimationFrameId.current = null;
      setLocalSelectedTimes(new Set(currentWorkingSetRef.current));
    });
  };

  useLockBodyScroll(isTouch);

  useEffect(() => {
    if (isDraggingRef.current) return;
    const nextSelectedTimes = new Set(initialSelectedTimes);
    currentWorkingSetRef.current = new Set(nextSelectedTimes);
    setLocalSelectedTimes(nextSelectedTimes);
  }, [initialSelectedTimes]);

  const measureTimeTableContainer = () => {
    const container = containerRef.current;
    if (!container) return;
    const containerRect = container.getBoundingClientRect();
    containerBoundingRectRef.current = containerRect;

    const snapPoints: TimeSnapPoint[] = [];
    container.querySelectorAll<HTMLElement>('.selectable').forEach((selectableElement) => {
      const timeValue = selectableElement.getAttribute('data-time');
      if (!timeValue) return;
      const elementRect = selectableElement.getBoundingClientRect();
      snapPoints.push({
        time: timeValue,
        left: elementRect.left - containerRect.left,
        right: elementRect.right - containerRect.left,
        top: elementRect.top - containerRect.top,
        bottom: elementRect.bottom - containerRect.top,
      });
    });
    timeSnapPointsRef.current = snapPoints;
  };

  const handleDragStart = useCallback((event: React.PointerEvent) => {
    isDraggingRef.current = true;
    setIsTouch(event.pointerType === 'touch');
    measureTimeTableContainer();

    const containerRect = containerBoundingRectRef.current;
    if (!containerRect) return;
    // 컨네이터가 없으면 동작하지 않습니다.

    // 이 부분에서 컨테이너 만큼 x,y 좌표를 보정합니다.
    dragStartX.current = event.clientX - containerRect.left;
    dragStartY.current = event.clientY - containerRect.top;

    // 1.요소 조회
    const targetElement = (event.target as HTMLElement).closest(
      '.selectable'
    ) as HTMLElement | null;
    const targetTimeValue = targetElement?.getAttribute('data-time');
    if (!targetTimeValue) return;

    // 2.드래그 모드 변경
    selectionModeRef.current = currentWorkingSetRef.current.has(targetTimeValue) ? 'remove' : 'add';

    // 3.현재 요소 토글
    if (selectionModeRef.current === 'add') currentWorkingSetRef.current.add(targetTimeValue);
    else currentWorkingSetRef.current.delete(targetTimeValue);

    triggerRenderUpdate();
  }, []);

  const handleDragMove = useCallback((event: React.PointerEvent) => {
    if (!isDraggingRef.current) return;

    const containerRect = containerBoundingRectRef.current;
    if (!containerRect) return;

    const currentX = event.clientX - containerRect.left;
    const currentY = event.clientY - containerRect.top;

    const selectionAreaMinX = Math.min(dragStartX.current, currentX);
    const selectionAreaMinY = Math.min(dragStartY.current, currentY);
    const selectionAreaMaxX = Math.max(dragStartX.current, currentX);
    const selectionAreaMaxY = Math.max(dragStartY.current, currentY);

    let hasChanges = false;

    for (const snapPoint of timeSnapPointsRef.current) {
      const isInSelectionArea =
        snapPoint.left < selectionAreaMaxX &&
        snapPoint.right > selectionAreaMinX &&
        snapPoint.top < selectionAreaMaxY &&
        snapPoint.bottom > selectionAreaMinY;
      if (!isInSelectionArea) continue;

      if (selectionModeRef.current === 'add') {
        if (!currentWorkingSetRef.current.has(snapPoint.time)) {
          hasChanges = true;
          currentWorkingSetRef.current.add(snapPoint.time);
        }
      } else {
        if (currentWorkingSetRef.current.has(snapPoint.time)) {
          hasChanges = true;
          currentWorkingSetRef.current.delete(snapPoint.time);
        }
      }
    }
    if (hasChanges) triggerRenderUpdate();
  }, []);

  const resetDragState = useCallback(() => {
    isDraggingRef.current = false;
    timeSnapPointsRef.current = [];
    containerBoundingRectRef.current = null;
    setIsTouch(false);
  }, []);

  const handleDragEnd = useCallback(() => {
    if (!isDraggingRef.current) return;

    resetDragState();

    const finalSelectedTimes = new Set(currentWorkingSetRef.current);

    setLocalSelectedTimes(finalSelectedTimes);
    updateCurrentSelectedTimes(finalSelectedTimes);
  }, [updateCurrentSelectedTimes, resetDragState]);

  return {
    containerRef,
    localSelectedTimes,
    pointerHandlers: {
      onPointerDown: handleDragStart,
      onPointerMove: handleDragMove,
      onPointerUp: handleDragEnd,
      onPointerLeave: handleDragEnd,
    },
  };
};

export default useLocalTimeSelection;
