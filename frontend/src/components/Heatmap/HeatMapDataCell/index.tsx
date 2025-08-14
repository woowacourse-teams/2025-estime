import { getHeatMapCellBackgroundColor } from '@/utils/getBackgroundColor';
import { useTheme } from '@emotion/react';
import * as S from './HeatMapDataCell.styled';
import type { DateCellInfo } from '@/hooks/useRoomStatistics';
import type { TooltipInfo } from '@/hooks/useTooltipBehavior';

interface HeatMapDataCellProps {
  date: string;
  timeText: string;
  roomStatistics: Map<string, DateCellInfo>;
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

  const backgroundColor = getHeatMapCellBackgroundColor({
    theme,
    weight,
  });

  const tooltipInfo = { date, timeText, participantList: participantList };

  return (
    <S.Container
      backgroundColor={backgroundColor}
      onMouseOver={(e: React.PointerEvent<HTMLDivElement>) => onDesktopHover(tooltipInfo, e)}
      onPointerDown={(e: React.PointerEvent<HTMLDivElement>) =>
        onMobileTap(tooltipInfo, e.target as HTMLDivElement)
      }
    ></S.Container>
  );
};

export default HeatMapDataCell;
