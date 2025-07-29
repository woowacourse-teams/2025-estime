import { useCallback, useRef, useState } from 'react';

type DragMode = 'add' | 'remove';

interface DragRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface UseTimeSelectionProps {
  value: Set<string>;
  set: (times: Set<string>) => void;
}
const DEFAULT_DRAG_THRESHOLD = 2; // 드래그 시작 기준 거리 (픽셀)

export default function useTimeSelection({ value, set }: UseTimeSelectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [dragMode, setDragMode] = useState<DragMode>('add');
  const isDragging = useRef(false);

  // 두 사각형이 겹치는지 확인
  function isOverlapping(rect1: DragRect, rect2: DragRect): boolean {
    return !(
      rect1.x + rect1.width < rect2.x ||
      rect2.x + rect2.width < rect1.x ||
      rect1.y + rect1.height < rect2.y ||
      rect2.y + rect2.height < rect1.y
    );
  }

  // 포인터 위치에서 아이템 키 찾기
  const getItemKeyAt = useCallback((clientX: number, clientY: number): string | null => {
    const element = document.elementFromPoint(clientX, clientY);
    if (element instanceof HTMLElement && element.dataset.item) {
      return element.dataset.item;
    }
    return null;
  }, []);

  // 드래그 영역과 겹치는 모든 아이템 업데이트
  const updateSelection = useCallback(
    (dragRect: DragRect) => {
      if (!containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const newSelection = new Set(value);

      // 모든 data-item 요소 찾기
      const items = containerRef.current.querySelectorAll('[data-item]');

      items.forEach((element) => {
        if (!(element instanceof HTMLElement) || !element.dataset.item) return;

        const itemKey = element.dataset.item;
        if (itemKey.includes('Dates')) return; // 날짜 요소 제외

        const itemRect = element.getBoundingClientRect();

        // 컨테이너 기준 상대 좌표로 변환
        const relativeItemRect = {
          x: itemRect.x - containerRect.x,
          y: itemRect.y - containerRect.y,
          width: itemRect.width,
          height: itemRect.height,
        };

        if (isOverlapping(dragRect, relativeItemRect)) {
          if (dragMode === 'add') {
            newSelection.add(itemKey);
          } else {
            newSelection.delete(itemKey);
          }
        }
      });

      set(newSelection);
    },
    [value, set, dragMode]
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (e.button !== 0) return; // 왼쪽 클릭만

      e.preventDefault();

      const itemKey = getItemKeyAt(e.clientX, e.clientY);
      if (!itemKey || itemKey.includes('Dates')) return;

      // 드래그 모드 결정 (클릭한 아이템이 선택되어 있으면 remove, 아니면 add)
      setDragMode(value.has(itemKey) ? 'remove' : 'add');

      const containerRect = e.currentTarget.getBoundingClientRect();
      setDragStart({
        x: e.clientX - containerRect.x,
        y: e.clientY - containerRect.y,
      });

      isDragging.current = false;
    },
    [value, getItemKeyAt]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!dragStart || !containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const currentX = e.clientX - containerRect.x;
      const currentY = e.clientY - containerRect.y;

      // 5픽셀 이상 움직였으면 드래그로 간주
      const distance = Math.abs(currentX - dragStart.x) + Math.abs(currentY - dragStart.y);
      if (distance > DEFAULT_DRAG_THRESHOLD) {
        isDragging.current = true;
      }

      if (isDragging.current) {
        // 드래그 사각형 계산
        const dragRect = {
          x: Math.min(dragStart.x, currentX),
          y: Math.min(dragStart.y, currentY),
          width: Math.abs(currentX - dragStart.x),
          height: Math.abs(currentY - dragStart.y),
        };

        updateSelection(dragRect);
      }
    },
    [dragStart, updateSelection]
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!dragStart) return;

      // 드래그가 아니었으면 클릭으로 처리
      if (!isDragging.current) {
        const itemKey = getItemKeyAt(e.clientX, e.clientY);
        if (itemKey && !itemKey.includes('Dates')) {
          const newSelection = new Set(value);
          if (value.has(itemKey)) {
            newSelection.delete(itemKey);
          } else {
            newSelection.add(itemKey);
          }
          set(newSelection);
        }
      }

      // 상태 초기화
      setDragStart(null);
      isDragging.current = false;
    },
    [dragStart, value, set, getItemKeyAt]
  );

  const handlePointerLeave = useCallback(() => {
    setDragStart(null);
    isDragging.current = false;
  }, []);

  return {
    containerRef,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handlePointerLeave,
  };
}
