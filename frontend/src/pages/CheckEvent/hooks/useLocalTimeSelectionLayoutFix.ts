import { useRef, useCallback, useState, useEffect } from 'react';
import { useLockBodyScroll } from '../../../shared/hooks/common/useLockBodyScroll';
import { useTimeSelectionContext } from '../contexts/TimeSelectionContext';

interface UseLocalTimeSelectionOptions {
  initialSelectedTimes: Set<string>;
  // 선택적 최적화 옵션들
  enableVirtualScrolling?: boolean; // 가시 영역만 측정
  enablePreCaching?: boolean; // 사전 캐싱 활성화
  measurementStrategy?: 'full' | 'visible' | 'smart'; // 측정 전략
}

type TimeSnapPoint = {
  dateTime: string;
  left: number;
  right: number;
  top: number;
  bottom: number;
};

const useLocalTimeSelection = ({
  initialSelectedTimes,
  enableVirtualScrolling = false,
  enablePreCaching = false,
  measurementStrategy = 'full',
}: UseLocalTimeSelectionOptions) => {
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

    // 방법 1: IntersectionObserver를 사용한 방법 (가장 효율적)
    // 하지만 비동기 처리가 필요하므로 drag start 시점에 사용하기 어려움

    // 방법 2: 배치 읽기 최적화
    // 모든 요소를 먼저 수집한 다음, 한 번에 모든 측정을 수행
    const selectableElements = Array.from(container.querySelectorAll<HTMLElement>('.selectable'));

    // 데이터만 먼저 수집 (DOM 읽기 없음)
    const elementsWithData = selectableElements
      .map((el) => ({
        element: el,
        dateTime: el.getAttribute('data-time'),
      }))
      .filter((item) => item.dateTime !== null);

    // 한 번에 모든 레이아웃 정보 읽기 (레이아웃 계산 1회만 트리거)
    const containerRect = container.getBoundingClientRect();
    containerBoundingRectRef.current = containerRect;

    // 배치로 모든 요소의 위치 정보 읽기
    const snapPoints: TimeSnapPoint[] = elementsWithData.map(({ element, dateTime }) => {
      const rect = element.getBoundingClientRect();
      return {
        dateTime: dateTime!,
        left: rect.left - containerRect.left,
        right: rect.right - containerRect.left,
        top: rect.top - containerRect.top,
        bottom: rect.bottom - containerRect.top,
      };
    });

    timeSnapPointsRef.current = snapPoints;
  };

  // 방법 3: 사전 캐싱 전략 (선택적)
  // 드래그 시작 전에 미리 측정값을 캐시
  const preCacheTimeSnapPoints = useCallback(() => {
    // ResizeObserver나 MutationObserver를 사용하여
    // 레이아웃이 변경될 때만 다시 측정
    if (containerRef.current && timeSnapPointsRef.current.length === 0) {
      measureTimeTableContainer();
    }
  }, []);

  // 방법 4: Virtual Scrolling과 함께 사용 시
  // 보이는 영역의 요소만 측정
  const measureVisibleTimeTableElements = () => {
    const container = containerRef.current;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    containerBoundingRectRef.current = containerRect;

    // 뷰포트에 보이는 요소만 필터링
    const viewportHeight = window.innerHeight;

    const selectableElements = Array.from(container.querySelectorAll<HTMLElement>('.selectable'));

    // 보이는 요소만 측정
    const visibleElements = selectableElements.filter((el) => {
      const rect = el.getBoundingClientRect();
      return rect.bottom > 0 && rect.top < viewportHeight;
    });

    // 배치로 측정
    const snapPoints: TimeSnapPoint[] = visibleElements
      .map((element) => {
        const dateTime = element.getAttribute('data-time');
        if (!dateTime) return null;

        const rect = element.getBoundingClientRect();
        return {
          dateTime,
          left: rect.left - containerRect.left,
          right: rect.right - containerRect.left,
          top: rect.top - containerRect.top,
          bottom: rect.bottom - containerRect.top,
        };
      })
      .filter((point): point is TimeSnapPoint => point !== null);

    timeSnapPointsRef.current = snapPoints;
  };

  // 스마트 측정 전략 선택
  const chooseMeasurementStrategy = useCallback(() => {
    if (measurementStrategy === 'visible' || enableVirtualScrolling) {
      measureVisibleTimeTableElements();
    } else if (measurementStrategy === 'smart') {
      // 요소 개수에 따라 자동 선택
      const container = containerRef.current;
      const elementCount = container?.querySelectorAll('.selectable').length || 0;
      if (elementCount > 1000) {
        // 큰 시간표는 가시 영역만
        measureVisibleTimeTableElements();
      } else {
        measureTimeTableContainer();
      }
    } else {
      measureTimeTableContainer();
    }
  }, [measurementStrategy, enableVirtualScrolling]);

  const handleDragStart = useCallback(
    (event: React.PointerEvent) => {
      isDraggingRef.current = true;
      setIsTouch(event.pointerType === 'touch');

      // 선택된 전략에 따라 측정
      chooseMeasurementStrategy();

      const containerRect = containerBoundingRectRef.current;
      if (!containerRect) return;

      dragStartX.current = event.clientX - containerRect.left;
      dragStartY.current = event.clientY - containerRect.top;

      const targetElement = (event.target as HTMLElement).closest(
        '.selectable'
      ) as HTMLElement | null;
      const targetTimeValue = targetElement?.getAttribute('data-time');
      if (!targetTimeValue) return;

      selectionModeRef.current = currentWorkingSetRef.current.has(targetTimeValue)
        ? 'remove'
        : 'add';

      if (selectionModeRef.current === 'add') currentWorkingSetRef.current.add(targetTimeValue);
      else currentWorkingSetRef.current.delete(targetTimeValue);

      triggerRenderUpdate();
    },
    [chooseMeasurementStrategy]
  );

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
        if (!currentWorkingSetRef.current.has(snapPoint.dateTime)) {
          hasChanges = true;
          currentWorkingSetRef.current.add(snapPoint.dateTime);
        }
      } else {
        if (currentWorkingSetRef.current.has(snapPoint.dateTime)) {
          hasChanges = true;
          currentWorkingSetRef.current.delete(snapPoint.dateTime);
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

    triggerRenderUpdate();
    updateCurrentSelectedTimes(finalSelectedTimes);
  }, [updateCurrentSelectedTimes, resetDragState]);

  // 사전 캐싱이 활성화된 경우 컴포넌트 마운트 후 미리 측정
  useEffect(() => {
    if (enablePreCaching) {
      // 약간의 지연 후 실행 (DOM이 완전히 렌더링된 후)
      const timeoutId = setTimeout(() => {
        preCacheTimeSnapPoints();
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [enablePreCaching, preCacheTimeSnapPoints]);

  // ResizeObserver로 레이아웃 변경 감지
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver(() => {
      // 레이아웃이 변경되면 캐시 무효화
      timeSnapPointsRef.current = [];

      // 사전 캐싱이 활성화된 경우 다시 측정
      if (enablePreCaching) {
        setTimeout(() => preCacheTimeSnapPoints(), 50);
      }
    });

    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, [enablePreCaching, preCacheTimeSnapPoints]);

  return {
    containerRef,
    localSelectedTimes,
    pointerHandlers: {
      onPointerDown: handleDragStart,
      onPointerMove: handleDragMove,
      onPointerUp: handleDragEnd,
      onPointerLeave: handleDragEnd,
    },
    // 선택적 최적화 함수들
    preCacheTimeSnapPoints,
    measureVisibleTimeTableElements,
  };
};

export default useLocalTimeSelection;
