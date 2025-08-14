import { useCallback, useState } from 'react';
import { useHoverTooltip } from './useHoverTooltip';
import { useTheme } from '@emotion/react';

export interface TooltipInfo {
  date: string;
  timeText: string;
  participantList: string[];
}

export default function useTooltipBehavior() {
  const [tooltipInfo, setTooltipInfo] = useState<TooltipInfo | null>(null);
  const { position, onEnter, onMobileTap, onLeave } = useHoverTooltip();
  const theme = useTheme();

  const handlePointerEnter = useCallback((tooltipInfo: TooltipInfo, event: React.PointerEvent) => {
    setTooltipInfo(tooltipInfo);
    onEnter(event);
  }, []);

  const handlePointerLeave = useCallback(() => {
    if (theme.isMobile) return;
    onLeave();
    setTooltipInfo(null);
  }, [theme.isMobile]);

  const handleMobileTap = useCallback(
    (element: HTMLDivElement) => {
      if (!theme.isMobile) return;
      onMobileTap(element);
    },
    [theme.isMobile]
  );

  const isTooltipVisible: boolean = !!tooltipInfo?.participantList.length;

  return {
    tooltipInfo,
    position,
    handlePointerEnter,
    handlePointerLeave,
    handleMobileTap,
    isTooltipVisible,
  };
}
