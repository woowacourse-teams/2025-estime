import { useCallback, useRef, useState, useEffect } from 'react';

type DragMode = 'add' | 'remove';

class DOMVector {
  constructor(
    readonly x: number,
    readonly y: number,
    readonly magnitudeX: number,
    readonly magnitudeY: number
  ) {
    this.x = x;
    this.y = y;
    this.magnitudeX = magnitudeX;
    this.magnitudeY = magnitudeY;
  }

  toDOMRect(): DOMRect {
    return new DOMRect(
      Math.min(this.x, this.x + this.magnitudeX),
      Math.min(this.y, this.y + this.magnitudeY),
      Math.abs(this.magnitudeX),
      Math.abs(this.magnitudeY)
    );
  }
}
interface useTimeSelectionAdvancedProps {
  value: Set<string>;
  set: (times: Set<string>) => void;
}

const DRAG_THRESHOLD = 5; // 드래그 시작 임계값 (픽셀 단위)
const DRAG_THRESHOLD_SQUARED = DRAG_THRESHOLD * DRAG_THRESHOLD; // 제곱값으로 비교하여 Math.sqrt 최적화

export default function useTimeSelectionAdvanced(selectedTimes: useTimeSelectionAdvancedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragVector, setDragVector] = useState<DOMVector | null>(null);
  const [dragMode, setDragMode] = useState<DragMode>('add');
  const isDragging = useRef(false);

  // 컨테이너 rect 캐싱
  const containerRectRef = useRef<DOMRect | null>(null);
  // DOM 요소들 캐싱
  const itemElementsRef = useRef<{ element: HTMLElement; itemKey: string }[]>([]);

  function intersect(rect1: DOMRect, rect2: DOMRect) {
    if (rect1.right < rect2.left || rect2.right < rect1.left) return false;

    if (rect1.bottom < rect2.top || rect2.bottom < rect1.top) return false;

    return true;
  }

  // DOM 요소들을 캐시하는 함수
  const cacheItemElements = useCallback(() => {
    if (!containerRef.current) return;

    const elements = Array.from(containerRef.current.querySelectorAll('[data-item]'))
      .filter((el): el is HTMLElement => {
        return (
          el instanceof HTMLElement && el.dataset.item != null && !el.dataset.item.includes('Dates')
        );
      })
      .map((element) => ({
        element,
        itemKey: element.dataset.item!,
      }));

    itemElementsRef.current = elements;
  }, []);

  const determineDragMode = useCallback(
    (itemKey: string): DragMode => {
      return selectedTimes.value.has(itemKey) ? 'remove' : 'add';
    },
    [selectedTimes.value]
  );

  const getItemKeyFromElement = useCallback((element: Element): string | null => {
    if (!(element instanceof HTMLElement) || !element.dataset.item) {
      return null;
    }
    return element.dataset.item;
  }, []);

  const getItemKeyFromPointer = useCallback(
    (e: React.PointerEvent<HTMLDivElement>): string | null => {
      const element = document.elementFromPoint(e.clientX, e.clientY);
      return element ? getItemKeyFromElement(element) : null;
    },
    [getItemKeyFromElement]
  );

  const updateSelectedItems = useCallback(
    function updateSelectedItems(dragVector: DOMVector) {
      if (!containerRectRef.current) return;

      const newSelectedTimes = new Set(selectedTimes.value);
      const dragRect = dragVector.toDOMRect();

      // 캐시된 요소들 사용
      itemElementsRef.current.forEach(({ element, itemKey }) => {
        const itemRect = element.getBoundingClientRect();
        const x = itemRect.x - containerRectRef.current!.x;
        const y = itemRect.y - containerRectRef.current!.y;
        const translatedItemRect = new DOMRect(x, y, itemRect.width, itemRect.height);

        if (!intersect(dragRect, translatedItemRect)) return;

        if (dragMode === 'add') {
          newSelectedTimes.add(itemKey);
        } else {
          newSelectedTimes.delete(itemKey);
        }
      });

      selectedTimes.set(newSelectedTimes);
    },
    [selectedTimes, dragMode]
  );

  const handleOnPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    e.preventDefault();

    const itemKey = getItemKeyFromPointer(e);
    if (!itemKey || itemKey.includes('Dates')) return;

    const mode = determineDragMode(itemKey);
    setDragMode(mode);

    // 컨테이너 rect 캐싱
    containerRectRef.current = e.currentTarget.getBoundingClientRect();
    // DOM 요소들 캐싱
    cacheItemElements();

    setDragVector(
      new DOMVector(
        e.clientX - containerRectRef.current.x,
        e.clientY - containerRectRef.current.y,
        0,
        0
      )
    );
  };

  const rafId = useRef<number | null>(null);
  const latestPointerEventRef = useRef<React.PointerEvent<HTMLDivElement> | null>(null);

  const handleOnPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!dragVector || !containerRectRef.current) return;

      // 최신 이벤트 데이터만 캐싱
      latestPointerEventRef.current = e;

      // RAF가 이미 스케줄되어 있으면 새로운 스케줄링 하지 않음
      if (rafId.current !== null) return;

      rafId.current = requestAnimationFrame(() => {
        rafId.current = null;

        const latestEvent = latestPointerEventRef.current;
        if (!latestEvent || !containerRectRef.current || !dragVector) return;

        const nextDragVector = new DOMVector(
          dragVector.x,
          dragVector.y,
          latestEvent.clientX - containerRectRef.current.x - dragVector.x,
          latestEvent.clientY - containerRectRef.current.y - dragVector.y
        );
        setDragVector(nextDragVector);

        // Math.sqrt 대신 제곱값으로 비교하여 성능 최적화
        const dragDistanceSquared = nextDragVector.magnitudeX ** 2 + nextDragVector.magnitudeY ** 2;
        if (dragDistanceSquared > DRAG_THRESHOLD_SQUARED && !isDragging.current) {
          isDragging.current = true;
        }

        if (isDragging.current) {
          updateSelectedItems(nextDragVector);
        }
      });
    },
    [dragVector, updateSelectedItems]
  );

  const handleOnPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (dragVector && !isDragging.current) {
      // 드래그가 시작되지 않았으면 클릭으로 처리
      const itemKey = getItemKeyFromPointer(e);
      if (itemKey && !itemKey.includes('Dates')) {
        const newSelectedTimes = new Set(selectedTimes.value);
        if (selectedTimes.value.has(itemKey)) {
          newSelectedTimes.delete(itemKey);
        } else {
          newSelectedTimes.add(itemKey);
        }
        selectedTimes.set(newSelectedTimes);
      }
    }

    // RAF 정리
    if (rafId.current !== null) {
      cancelAnimationFrame(rafId.current);
      rafId.current = null;
    }

    // 캐시 정리
    setDragVector(null);
    isDragging.current = false;
    containerRectRef.current = null;
    itemElementsRef.current = [];
    latestPointerEventRef.current = null;
  };

  const handleOnPointerLeave = () => {
    // RAF 정리
    if (rafId.current !== null) {
      cancelAnimationFrame(rafId.current);
      rafId.current = null;
    }

    // 캐시 정리
    setDragVector(null);
    isDragging.current = false;
    containerRectRef.current = null;
    itemElementsRef.current = [];
    latestPointerEventRef.current = null;
  };

  // 컴포넌트 언마운트 시 RAF 정리
  useEffect(() => {
    return () => {
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
        rafId.current = null;
      }
    };
  }, []);

  return {
    containerRef,
    handleOnPointerDown,
    handleOnPointerMove,
    handleOnPointerUp,
    handleOnPointerLeave,
  };
}
