import { useRef, useCallback, useState } from 'react';
import { useLockBodyScroll } from '../useLockBodyScroll';

interface DragSelectOptions {
  selectedTimes: Set<string>;
  setSelectedTimes: (times: Set<string>) => void;
}

const useTimeSelection = ({ selectedTimes, setSelectedTimes }: DragSelectOptions) => {
  const draggingRef = useRef(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const [isTouch, setIsTouch] = useState(false);

  useLockBodyScroll(isTouch);

  // 좌표 추출 공통 함수
  const getEventCoords = (event: React.MouseEvent | React.TouchEvent) => {
    if ('touches' in event) {
      const touch = event.touches[0];
      return { x: touch.clientX, y: touch.clientY };
    } else {
      return { x: event.clientX, y: event.clientY };
    }
  };

  const hoveredRef = useRef<Set<string>>(new Set());

  const toggleItem = (item: string, set: Set<string>) => {
    if (set.has(item)) set.delete(item);
    else set.add(item);
  };

  const onStart = useCallback(
    (event: React.MouseEvent | React.TouchEvent) => {
      event.preventDefault();
      draggingRef.current = true;
      hoveredRef.current.clear();

      const { x, y } = getEventCoords(event);
      startX.current = x;
      startY.current = y;

      setIsTouch('touches' in event);

      const target = (event.target as HTMLElement).closest('.selectable') as HTMLElement | null;
      if (!target) return;
      const time = target.getAttribute('data-time');
      if (!time) return;

      const updated = new Set(selectedTimes);
      toggleItem(time, updated);
      hoveredRef.current.add(time);
      setSelectedTimes(updated);
    },
    [selectedTimes, setSelectedTimes]
  );

  const onMove = useCallback(
    (event: React.MouseEvent | React.TouchEvent) => {
      if (!draggingRef.current) return;

      const { x: endX, y: endY } = getEventCoords(event);
      const minX = Math.min(startX.current, endX);
      const minY = Math.min(startY.current, endY);
      const maxX = Math.max(startX.current, endX);
      const maxY = Math.max(startY.current, endY);

      const updatedSet = new Set(selectedTimes);

      Array.from(document.querySelectorAll('.selectable')).forEach((el) => {
        const time = el.getAttribute('data-time');
        if (!time) return;

        const rect = el.getBoundingClientRect();
        const inArea =
          rect.left < maxX && rect.right > minX && rect.top < maxY && rect.bottom > minY;

        if (inArea && !hoveredRef.current.has(time)) {
          toggleItem(time, updatedSet);
          hoveredRef.current.add(time);
        } else if (!inArea && hoveredRef.current.has(time)) {
          hoveredRef.current.delete(time); // 영역 벗어나면 다시 진입 가능
        }
      });

      setSelectedTimes(updatedSet);
    },
    [selectedTimes, setSelectedTimes]
  );

  // 이전
  // const onMove = useCallback(
  //   (event: React.MouseEvent | React.TouchEvent) => {
  //     if (!draggingRef.current) return;

  //     const { x: endX, y: endY } = getEventCoords(event);
  //     const minX = Math.min(startX.current, endX);
  //     const minY = Math.min(startY.current, endY);
  //     const maxX = Math.max(startX.current, endX);
  //     const maxY = Math.max(startY.current, endY);

  //     const newSelectedSet = new Set<string>();

  //     Array.from(document.querySelectorAll('.selectable')).forEach((el) => {
  //       const time = el.getAttribute('data-time');
  //       if (!time) return;

  //       const rect = el.getBoundingClientRect();
  //       const inArea = rect.left < maxX && rect.right > minX && rect.top < maxY && rect.bottom > minY;

  //       if (inArea) {
  //         newSelectedSet.add(time); // 영역 안에 있으면 선택
  //         hoveredRef.current.add(time); // 진입 기록
  //       } else {
  //         hoveredRef.current.delete(time); // 영역 밖이면 다시 진입 가능
  //       }
  //     });

  //     setSelectedTimes(newSelectedSet); // 영역 안 셀만 선택 상태로
  //   },
  //   [setSelectedTimes]
  // );
  const onEnd = useCallback(() => {
    draggingRef.current = false;
    setIsTouch(false);
  }, []);

  return {
    onMouseDown: onStart,
    onMouseMove: onMove,
    onMouseUp: onEnd,
    onMouseLeave: onEnd,
    onTouchStart: onStart,
    onTouchMove: onMove,
    onTouchEnd: onEnd,
    reset: () => {
      draggingRef.current = false;
    },
  };
};

export default useTimeSelection;
