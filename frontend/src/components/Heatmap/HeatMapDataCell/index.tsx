import { getHeatMapCellBackgroundColor } from '@/utils/getBackgroundColor';
import { useTheme } from '@emotion/react';
import * as S from './HeatMapDataCell.styled';
import type { DateCellInfo } from '@/hooks/useRoomStatistics';
import type { TooltipInfo } from '@/hooks/useHeatMapInteraction';

interface HeatMapDataCellProps {
  date: string;
  timeText: string;
  roomStatistics: Map<string, DateCellInfo>;
  onEnter: (tooltipInfo: TooltipInfo, event: React.PointerEvent) => void;
  onMobileClick: (element: HTMLElement) => void;
}

const HeatMapDataCell = ({
  date,
  timeText,
  roomStatistics,
  onEnter,
  onMobileClick,
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
      data-time-text={`${date}T${timeText}`}
      onPointerEnter={(e: React.PointerEvent<Element>) => onEnter(tooltipInfo, e)}
      onPointerDown={(e: React.PointerEvent<Element>) =>
        onMobileClick(e.target as unknown as HTMLElement)
      }
    ></S.Container>
  );
};

export default HeatMapDataCell;
