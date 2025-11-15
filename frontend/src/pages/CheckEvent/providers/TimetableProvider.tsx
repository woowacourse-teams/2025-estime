import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  RefObject,
} from 'react';

export interface TimetableHoverContextType {
  labelRefs: RefObject<Record<string, HTMLDivElement | null>>;
  hoverLabelRef: RefObject<HTMLDivElement | null>;
  timeTableCellHover: (hoveredTime: string | null) => void;
}

export const TimetableHoverContext = createContext<TimetableHoverContextType | null>(null);

const TimetableHoverProvider = ({
  dateTimeSlots,
  children,
}: {
  dateTimeSlots: string[];
  children: React.ReactNode;
}) => {
  const labelRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const hoverLabelRef = useRef<HTMLDivElement | null>(null);
  const dateTimeSlotsRef = useRef(dateTimeSlots);

  const timeTableCellHover = useCallback((hoveredTime: string | null) => {
    // 모든 라벨 비활성화
    Object.values(labelRefs.current || {}).forEach((el) => el?.classList.remove('active'));

    const hoverLabel = hoverLabelRef.current;
    if (!hoverLabel) return;

    // hover 해제 시
    if (!hoveredTime) {
      hoverLabel.classList.remove('visible');
      return;
    }

    const index = dateTimeSlotsRef.current.indexOf(hoveredTime);
    if (index === -1) return;

    const isHalf = index % 2 !== 0;
    const nextLabelTime = dateTimeSlotsRef.current[!isHalf ? index + 1 : index];
    const endTime = dateTimeSlotsRef.current[index + 1];
    const top = `calc(24px + ${(dateTimeSlotsRef.current.indexOf(nextLabelTime) / 2) * 3}rem)`;

    hoverLabel.textContent = nextLabelTime;
    hoverLabel.style.transform = `translateY(${top})`;
    hoverLabel.classList.add('visible');

    const startLabel = labelRefs.current?.[hoveredTime];
    const endLabel = labelRefs.current?.[endTime];
    startLabel?.classList.add('active');
    endLabel?.classList.add('active');
    hoverLabel.classList.add('active');
  }, []);

  useEffect(() => {
    dateTimeSlotsRef.current = dateTimeSlots;
  }, [dateTimeSlots]);

  const memoValue: TimetableHoverContextType = useMemo(
    () => ({ labelRefs, hoverLabelRef, timeTableCellHover }),
    [timeTableCellHover]
  );

  return (
    <TimetableHoverContext.Provider value={memoValue}>{children}</TimetableHoverContext.Provider>
  );
};

export default TimetableHoverProvider;

export const useTimetableHoverContext = () => {
  const context = useContext(TimetableHoverContext);
  if (!context) {
    throw new Error('useTimetableHoverContext must be used within a TimetableHoverProvider');
  }
  return context;
};
