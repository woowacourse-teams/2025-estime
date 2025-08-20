import type { Field } from '@/types/field';
import { useCallback, useRef, useState } from 'react';

interface DragRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

const useTimeSelection = (selectedTimes: Field<Set<string>>) => {
  const { value: selectedTimeSlots, set: setSelectedTimeSlots } = selectedTimes;
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [dragMode, setDragMode] = useState<'add' | 'remove'>('add');
  const isDragging = useRef(false);
  const activePointerId = useRef<number | null>(null);

  const isOverlapping = (a: DragRect, b: DragRect): boolean => {
    return !(
      a.x + a.width < b.x ||
      b.x + b.width < a.x ||
      a.y + a.height < b.y ||
      b.y + b.height < a.y
    );
  };

  const getItemKeyAt = useCallback((clientX: number, clientY: number): string | null => {
    const el = document.elementFromPoint(clientX, clientY);
    const hit = el?.closest('[data-item]') as HTMLElement | null;
    return hit?.dataset?.item || null;
  }, []);

  const toggleTimeSlot = useCallback(
    (key: string) => {
      const newSet = new Set(selectedTimeSlots);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      setSelectedTimeSlots(newSet);
    },
    [selectedTimeSlots, setSelectedTimeSlots]
  );

  const updateSelection = useCallback(
    (dragRect: DragRect) => {
      if (!containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const newSet = new Set(selectedTimeSlots);
      const items = containerRef.current.querySelectorAll('[data-item]');

      items.forEach((el) => {
        const element = el as HTMLElement;
        const key = element.dataset?.item;
        if (!key) return;

        const rect = element.getBoundingClientRect();
        const itemRect: DragRect = {
          x: rect.left - containerRect.left,
          y: rect.top - containerRect.top,
          width: rect.width,
          height: rect.height,
        };

        if (isOverlapping(dragRect, itemRect)) {
          if (dragMode === 'add') {
            newSet.add(key);
          } else {
            newSet.delete(key);
          }
        }
      });

      setSelectedTimeSlots(newSet);
    },
    [selectedTimeSlots, setSelectedTimeSlots, dragMode]
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      if (!containerRef.current) return;

      e.preventDefault();
      if (e.pointerType === 'touch') e.stopPropagation();

      containerRef.current.setPointerCapture(e.pointerId);
      activePointerId.current = e.pointerId;

      const key = getItemKeyAt(e.clientX, e.clientY);
      if (!key) return;

      setDragMode(selectedTimeSlots.has(key) ? 'remove' : 'add');

      const rect = containerRef.current.getBoundingClientRect();
      setDragStart({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    },
    [selectedTimeSlots, getItemKeyAt]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!dragStart || !containerRef.current) return;
      if (activePointerId.current !== null && e.pointerId !== activePointerId.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const curX = e.clientX - rect.left;
      const curY = e.clientY - rect.top;

      const moved = Math.abs(curX - dragStart.x) + Math.abs(curY - dragStart.y);

      if (moved >= 2) {
        isDragging.current = true;
      }

      if (isDragging.current) {
        if (e.pointerType === 'touch') e.preventDefault();

        const dragRect: DragRect = {
          x: Math.min(dragStart.x, curX),
          y: Math.min(dragStart.y, curY),
          width: Math.abs(curX - dragStart.x),
          height: Math.abs(curY - dragStart.y),
        };
        updateSelection(dragRect);
      }
    },
    [dragStart, updateSelection]
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!dragStart) return;

      if (containerRef.current && activePointerId.current !== null) {
        try {
          containerRef.current.releasePointerCapture(activePointerId.current);
        } catch {
          // 포인터 캡처 해제 실패 무시
        }
      }
      activePointerId.current = null;

      if (!isDragging.current) {
        const key = getItemKeyAt(e.clientX, e.clientY);
        if (key) toggleTimeSlot(key);
      }

      setDragStart(null);
      isDragging.current = false;
    },
    [dragStart, getItemKeyAt, toggleTimeSlot]
  );

  const reset = useCallback(() => {
    if (containerRef.current && activePointerId.current !== null) {
      try {
        containerRef.current.releasePointerCapture(activePointerId.current);
      } catch {
        // 포인터 캡처 해제 실패 무시
      }
    }
    activePointerId.current = null;
    setDragStart(null);
    isDragging.current = false;
  }, []);

  return {
    containerRef,
    onPointerDown: handlePointerDown,
    onPointerMove: handlePointerMove,
    onPointerUp: handlePointerUp,
    onPointerCancel: reset,
    reset,
  };
};

export default useTimeSelection;
