import { getHeatMapCellBackgroundColor } from '@/pages/CheckEvent/utils/getCellColor';
import { useTheme } from '@emotion/react';
import { memo } from 'react';
import * as S from './HeatMapDataCell.styled';
import type { HeatmapDateCellInfo } from '@/pages/CheckEvent/hooks/useHeatmapStatistics';
import type { TooltipInfo } from '@/pages/CheckEvent/hooks/useTooltipBehavior';

interface HeatMapDataCellProps {
  date: string;
  timeText: string;
  roomStatistics: Map<string, HeatmapDateCellInfo>;
  onDesktopHover: (tooltipInfo: TooltipInfo, event: React.PointerEvent<HTMLDivElement>) => void;
  onMobileTap: (tooltipInfo: TooltipInfo, element: HTMLDivElement) => void;
}

const HeatMapDataCell = ({
  date,
  timeText,
  roomStatistics,
  onDesktopHover,
  onMobileTap,
}: HeatMapDataCellProps) => {
  const theme = useTheme();
  const cellInfo = roomStatistics.get(`${date}T${timeText}`);

  const weight = cellInfo?.weight ?? 0;
  const participantList = cellInfo?.participantNames ?? [];
  const isRecommended = cellInfo?.isRecommended ?? false;

  const backgroundColor = getHeatMapCellBackgroundColor({
    theme,
    weight,
    isRecommended,
  });

  const tooltipInfo = {
    date,
    timeText,
    participantList,
  };

  return (
    <S.Container
      data-heatmap-cell
      backgroundColor={backgroundColor}
      isRecommended={isRecommended}
      onMouseOver={(e: React.PointerEvent<HTMLDivElement>) => onDesktopHover(tooltipInfo, e)}
      onPointerDown={(e: React.PointerEvent<HTMLDivElement>) =>
        onMobileTap(tooltipInfo, e.target as HTMLDivElement)
      }
    ></S.Container>
  );
};

export default memo(HeatMapDataCell);
