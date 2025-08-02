import { useState, useCallback, useRef } from 'react';

interface SimpleDragSelectionOptions {
  selectedTimes: Set<string>;
  setSelectedTimes: (times: Set<string>) => void;
  time: string;
}
type DragState = 'add' | 'remove';

const useTimeSelection = ({
  selectedTimes,
  setSelectedTimes,
  time,
}: SimpleDragSelectionOptions) => {
  const [dragState, setDragState] = useState<DragState>('add');
  const draggingRef = useRef(false);

  const isHeaderTime = (time: string) => {
    const [, timeText] = time.split('T');
    return timeText === 'Dates';
  };
  const determineDragState = useCallback(
    (time: string): DragState => {
      return !selectedTimes.has(time) ? 'add' : 'remove';
    },
    [selectedTimes]
  );

  const addRemoveTime = useCallback(
    (time: string, state: DragState) => {
      const newSelectedTimes = new Set(selectedTimes);

      if (state === 'add') {
        newSelectedTimes.add(time);
      } else {
        newSelectedTimes.delete(time);
      }

      setSelectedTimes(newSelectedTimes);
    },
    [selectedTimes, setSelectedTimes]
  );

  const onMouseDown = useCallback(
    (time: string) => {
      if (isHeaderTime(time)) return;

      const state = determineDragState(time);

      setDragState(state);
      draggingRef.current = true;

      addRemoveTime(time, state);
    },
    [time, determineDragState, addRemoveTime]
  );

  const onMouseEnter = useCallback(
    (time: string) => {
      if (isHeaderTime(time) || !draggingRef.current) return;

      addRemoveTime(time, dragState);
    },
    [time, dragState, addRemoveTime]
  );

  const onMouseUp = useCallback((e?: React.MouseEvent) => {
    if (!draggingRef.current) return;

    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    draggingRef.current = false;
  }, []);

  const onMouseLeave = useCallback(() => {
    if (draggingRef.current) {
      onMouseUp();
    }
  }, [onMouseUp]);

  return {
    onMouseDown,
    onMouseEnter,
    onMouseUp,
    onMouseLeave,

    reset: () => {
      draggingRef.current = false;
    },
  };
};

export default useTimeSelection;
