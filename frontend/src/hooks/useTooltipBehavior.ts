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

  const handleDesktopHover = useCallback(
    (tooltipInfo: TooltipInfo, event: React.PointerEvent) => {
      if (theme.isMobile) return;
      setTooltipInfo(tooltipInfo);
      onEnter(event);
    },
    [onEnter]
  );

  const handlePointerLeave = useCallback(() => {
    if (theme.isMobile) return;
    onLeave();
    setTooltipInfo(null);
  }, [theme.isMobile, onLeave]);

  const handleMobileTap = useCallback(
    (tooltipInfo: TooltipInfo, element: HTMLDivElement) => {
      if (!theme.isMobile) return;
      setTooltipInfo(tooltipInfo);
      onMobileTap(element);
    },
    [theme.isMobile, onMobileTap]
  );

  const isTooltipVisible: boolean = !!tooltipInfo?.participantList.length;

  return {
    tooltipInfo,
    position,
    handleDesktopHover,
    handlePointerLeave,
    handleMobileTap,
    isTooltipVisible,
  };
}
