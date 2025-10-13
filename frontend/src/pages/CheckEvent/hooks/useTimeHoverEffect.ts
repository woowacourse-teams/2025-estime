import { RefObject, useEffect } from 'react';
import { HoveredTimeRef } from '../types/hoveredTimeRef';

export const useTimeHoverEffect = (
  hoveredTimeRef: RefObject<HoveredTimeRef>,
  dateTimeSlots: string[],
  labelRefs: RefObject<Record<string, HTMLDivElement | null>>,
  hoverLabelRef: RefObject<HTMLDivElement | null>
) => {
  useEffect(() => {
    if (!hoveredTimeRef.current) return;

    hoveredTimeRef.current.update = (hoveredTime: string | null) => {
      // 모든 라벨 비활성화
      Object.values(labelRefs.current || {}).forEach((el) => el?.classList.remove('active'));

      const hoverLabel = hoverLabelRef.current;
      if (!hoverLabel) return;

      // hover 해제 시
      if (!hoveredTime) {
        hoverLabel.classList.remove('visible');
        return;
      }

      const index = dateTimeSlots.indexOf(hoveredTime);
      if (index === -1) return;

      const isHalf = index % 2 !== 0;
      const nextLabelTime = dateTimeSlots[!isHalf ? index + 1 : index];
      const endTime = dateTimeSlots[index + 1];
      const top = `calc(24px + ${(dateTimeSlots.indexOf(nextLabelTime) / 2) * 3}rem)`;

      hoverLabel.textContent = nextLabelTime;
      hoverLabel.style.top = top;
      hoverLabel.classList.add('visible');

      const startLabel = labelRefs.current?.[hoveredTime];
      const endLabel = labelRefs.current?.[endTime];
      startLabel?.classList.add('active');
      endLabel?.classList.add('active');
      hoverLabel.classList.add('active');
    };
  }, [hoveredTimeRef, dateTimeSlots, labelRefs, hoverLabelRef]);
};
