import { useCallback, useState } from 'react';
import useTooltipPosition from '../../../shared/hooks/Tooltip/useTooltipPosition';
import { useTheme } from '@emotion/react';

export interface TooltipInfo {
  date: string;
  timeText: string;
  participantList: string[];
}

const useTooltipBehavior = () => {
  const [tooltipInfo, setTooltipInfo] = useState<TooltipInfo | null>(null);
  const { position, onEnter, onMobileTap, stopTracking } = useTooltipPosition();
  const theme = useTheme();

  const closeTooltip = useCallback(() => {
    setTooltipInfo(null);
    stopTracking();
  }, [stopTracking]);

  const handleDesktopHover = useCallback(
    (tooltipInfo: TooltipInfo, event: React.PointerEvent) => {
      if (theme.isMobile) return;
      setTooltipInfo(tooltipInfo);
      onEnter(event);
    },
    [theme.isMobile, onEnter]
  );

  const handleMobileTap = useCallback(
    (tooltipInfo: TooltipInfo, element: HTMLDivElement) => {
      if (!theme.isMobile) return;
      setTooltipInfo(tooltipInfo);
      onMobileTap(element);
    },
    [theme.isMobile, onMobileTap]
  );

  const handleContainerPointerLeave: React.PointerEventHandler = useCallback(() => {
    if (theme.isMobile) return;
    closeTooltip();
  }, [theme.isMobile, closeTooltip]);

  const isTooltipVisible: boolean = !!tooltipInfo?.participantList.length;

  return {
    tooltipInfo,
    position,
    handleDesktopHover,
    handleContainerPointerLeave: theme.isMobile ? undefined : handleContainerPointerLeave,
    handleMobileTap,
    closeTooltip,
    isTooltipVisible,
  };
};

export default useTooltipBehavior;
