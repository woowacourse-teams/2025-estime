import { useRef, useCallback, useMemo, useEffect } from 'react';
import { useUserAvailability, userAvailabilityStore } from '../stores/userAvailabilityStore';
import usePreventScroll from './usePreventScroll';
import { usePaginationStore } from '../stores/paginationStore';

type DragState = {
  isDragging: boolean;
  startDayIdx: number;
  startTimeIdx: number;
  mode: 'add' | 'remove';
  initialSet: Set<string>;
};

const useLocalTimeSelection = () => {
  const selectedTimes = useUserAvailability().selectedTimes;
  const page = usePaginationStore();

  const currentWorkingSetRef = useRef<Set<string>>(new Set(selectedTimes));
  const containerRef = useRef<HTMLDivElement | null>(null);

  const gridLookupRef = useRef<Map<string, string>>(new Map());

  const dragState = useRef<DragState>({
    isDragging: false,
    startDayIdx: -1,
    startTimeIdx: -1,
    mode: 'add',
    initialSet: new Set(),
  });

  const renderAnimationFrameId = useRef<number | null>(null);

  usePreventScroll(containerRef);

  const getCellInfo = useCallback((x: number, y: number) => {
    const el = document.elementFromPoint(x, y);
    const cell = el?.closest('.time-table-cell') as HTMLElement | null;

    if (!cell || !cell.dataset.time) return null;

    // DOM에 심어둔 인덱스를 읽음 (문자열 -> 숫자 변환)
    const dayIdx = parseInt(cell.dataset.dayIndex || '-1', 10);
    const timeIdx = parseInt(cell.dataset.timeIndex || '-1', 10);

    if (dayIdx === -1 || timeIdx === -1) return null;

    return {
      key: cell.dataset.time,
      dayIdx,
      timeIdx,
    };
  }, []);

  const cacheGridKeys = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const map = new Map<string, string>();
    container.querySelectorAll<HTMLElement>('.time-table-cell').forEach((el) => {
      const day = el.dataset.dayIndex;
      const time = el.dataset.timeIndex;
      const key = el.dataset.time;
      if (day && time && key) {
        map.set(`${day}|${time}`, key); // "0|1" -> "2024-01-01T09:30"
      }
    });
    gridLookupRef.current = map;
  }, []);

  const toggleSelectedCellClasses = useCallback(() => {
    try {
      const container = containerRef.current;
      if (!container) return;

      container.querySelectorAll<HTMLElement>('.time-table-cell').forEach((cell) => {
        const dateTime = cell.dataset.time;
        if (!dateTime) return;

        const shouldSelect = currentWorkingSetRef.current.has(dateTime);
        if (cell.classList.contains('selected') !== shouldSelect) {
          cell.classList.toggle('selected', shouldSelect);
        }
      });
    } finally {
      renderAnimationFrameId.current = null;
    }
  }, []);

  const updateCellClasses = useCallback(() => {
    if (renderAnimationFrameId.current != null) return;
    renderAnimationFrameId.current = requestAnimationFrame(toggleSelectedCellClasses);
  }, [toggleSelectedCellClasses]);

  const onDragStart = useCallback(
    (event: React.PointerEvent) => {
      const cellInfo = getCellInfo(event.clientX, event.clientY);
      if (!cellInfo) return;

      cacheGridKeys();

      containerRef.current?.classList.add('dragging');

      const isAlreadySelected = currentWorkingSetRef.current.has(cellInfo.key);

      dragState.current = {
        isDragging: true,
        startDayIdx: cellInfo.dayIdx,
        startTimeIdx: cellInfo.timeIdx,
        mode: isAlreadySelected ? 'remove' : 'add',
        initialSet: new Set(currentWorkingSetRef.current),
      };

      if (dragState.current.mode === 'add') {
        currentWorkingSetRef.current.add(cellInfo.key);
      } else {
        currentWorkingSetRef.current.delete(cellInfo.key);
      }

      updateCellClasses();
    },
    [getCellInfo, cacheGridKeys, updateCellClasses]
  );

  const onDragMove = useCallback(
    (event: React.PointerEvent) => {
      if (!dragState.current.isDragging) return;

      const cellInfo = getCellInfo(event.clientX, event.clientY);
      if (!cellInfo) return;

      const { startDayIdx, startTimeIdx, mode, initialSet } = dragState.current;
      const { dayIdx: currDayIdx, timeIdx: currTimeIdx } = cellInfo;

      const minDay = Math.min(startDayIdx, currDayIdx);
      const maxDay = Math.max(startDayIdx, currDayIdx);
      const minTime = Math.min(startTimeIdx, currTimeIdx);
      const maxTime = Math.max(startTimeIdx, currTimeIdx);

      const nextSet = new Set(initialSet);

      for (let day = minDay; day <= maxDay; day++) {
        for (let time = minTime; time <= maxTime; time++) {
          const key = gridLookupRef.current.get(`${day}|${time}`);
          if (key) {
            if (mode === 'add') nextSet.add(key);
            else nextSet.delete(key);
          }
        }
      }

      currentWorkingSetRef.current = nextSet;
      updateCellClasses();
    },
    [getCellInfo, updateCellClasses]
  );

  const onDragEnd = useCallback(() => {
    if (!dragState.current.isDragging) return;

    containerRef.current?.classList.remove('dragging');
    dragState.current.isDragging = false;
    gridLookupRef.current.clear();

    userAvailabilityStore.setState((prev) => ({
      ...prev,
      selectedTimes: new Set(currentWorkingSetRef.current),
    }));

    if (renderAnimationFrameId.current) {
      cancelAnimationFrame(renderAnimationFrameId.current);
      renderAnimationFrameId.current = null;
    }
  }, []);

  const handleDragStart = useCallback((e: React.PointerEvent) => onDragStart(e), [onDragStart]);
  const handleDragMove = useCallback(
    (e: React.PointerEvent) => {
      onDragMove(e);
    },
    [onDragMove]
  );
  const handleDragEnd = useCallback(() => onDragEnd(), [onDragEnd]);

  useEffect(() => {
    currentWorkingSetRef.current = new Set(selectedTimes);
    updateCellClasses();
  }, [selectedTimes, page, updateCellClasses]);

  useEffect(() => {
    return () => {
      if (renderAnimationFrameId.current) cancelAnimationFrame(renderAnimationFrameId.current);
    };
  }, []);

  const pointerHandlers = useMemo(
    () => ({
      onPointerDown: handleDragStart,
      onPointerMove: handleDragMove,
      onPointerUp: handleDragEnd,
      onPointerLeave: handleDragEnd,
      onPointerCancel: handleDragEnd,
    }),
    [handleDragStart, handleDragMove, handleDragEnd]
  );

  return { containerRef, pointerHandlers };
};

export default useLocalTimeSelection;
