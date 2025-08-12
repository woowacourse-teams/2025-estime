import { useCallback, useState } from 'react';
import { useHoverTooltip } from './useHoverTooltip';

export type InteractionMode = 'desktop' | 'mobile';
export interface TooltipInfo {
  date: string;
  timeText: string;
  participantList: string[];
}
export default function useHeatMapInteraction(mode: InteractionMode) {
  const [tooltipInfo, setTooltipInfo] = useState<TooltipInfo | null>(null);
  const { position, onEnter, onLeave } = useHoverTooltip();

  const handleMouseEnter = useCallback(
    (tooltipInfo: TooltipInfo, event: React.PointerEvent) => {
      if (mode === 'mobile') return;
      setTooltipInfo(tooltipInfo);
      onEnter(event);
    },
    [mode]
  );

  const handleMouseLeave = useCallback(() => {
    if (mode === 'mobile') return;
    setTooltipInfo(null);
    onLeave();
  }, [mode]);
  // 모바일 클릭 핸들러
  const handleMobileClick = useCallback(
    (tooltipInfo: TooltipInfo) => {
      if (mode === 'desktop') return;
      setTooltipInfo(tooltipInfo);
    },
    [mode]
  );

  const isClicked = useCallback(
    (date: string, timeText: string) => {
      return (
        mode === 'mobile' &&
        tooltipInfo?.date === date &&
        tooltipInfo?.timeText === timeText &&
        !!tooltipInfo.participantList.length
      );
    },
    [mode, tooltipInfo]
  );

  return {
    tooltipInfo,
    position,
    handleMouseEnter,
    handleMouseLeave,
    handleMobileClick,
    isClicked,
  };
}
