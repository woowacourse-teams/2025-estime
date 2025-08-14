import { useCallback, useState } from 'react';
import { useHoverTooltip } from './useHoverTooltip';

export interface TooltipInfo {
  date: string;
  timeText: string;
  participantList: string[];
}

export default function useTooltipBehavior() {
  const [tooltipInfo, setTooltipInfo] = useState<TooltipInfo | null>(null);
  const { position, onEnter, onMobileClick, onLeave } = useHoverTooltip();

  const handlePointerEnter = useCallback(
    (tooltipInfo: TooltipInfo, event: React.PointerEvent) => {
      setTooltipInfo(tooltipInfo);
      onEnter(event);
    },
    [tooltipInfo]
  );

  const handlePointerLeave = useCallback(() => {
    onLeave();
    setTooltipInfo(null);
  }, []);

  const isTooltipVisible: boolean = !!tooltipInfo?.participantList.length;

  return {
    tooltipInfo,
    position,
    handlePointerEnter,
    handlePointerLeave,
    handleMobileClick: onMobileClick,
    handleLeave: onLeave,
    isTooltipVisible,
  };
}
