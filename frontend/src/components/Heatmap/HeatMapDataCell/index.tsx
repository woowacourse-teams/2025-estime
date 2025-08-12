import { getHeatMapCellBackgroundColor } from '@/utils/getBackgroundColor';
import { useTheme } from '@emotion/react';
import * as S from './HeatMapDataCell.styled';
import type { DateCellInfo } from '@/hooks/useRoomStatistics';
import type { TooltipInfo } from '..';
import TableTooltip from '@/components/TableTooltip';

interface HeatMapDataCellProps {
  date: string;
  timeText: string;
  roomStatistics: Map<string, DateCellInfo>;
  onEnter: (tooltipInfo: TooltipInfo, event: React.PointerEvent) => void;
  onLeave: () => void;
  onMobileClick: (tooltipInfo: TooltipInfo, event: React.PointerEvent) => void;
  isClicked: boolean;
}

const HeatMapDataCell = ({
  date,
  timeText,
  roomStatistics,
  onEnter,
  onLeave,
  onMobileClick,
  isClicked,
}: HeatMapDataCellProps) => {
  const theme = useTheme();
  const cellInfo = roomStatistics.get(`${date}T${timeText}`);

  const weight = cellInfo?.weight ?? 0;
  const participantList = cellInfo?.participantNames ?? [];

  const backgroundColor = getHeatMapCellBackgroundColor({
    theme,
    weight,
  });

  const tooltipInfo = { date, timeText, participantList: participantList ?? [] };

  return (
    <S.Container
      backgroundColor={backgroundColor}
      onPointerEnter={(e: React.PointerEvent<Element>) => onEnter(tooltipInfo, e)}
      onPointerLeave={onLeave}
      onPointerDown={(e: React.PointerEvent) => onMobileClick(tooltipInfo, e)}
    >
      {isClicked && (
        <TableTooltip
          position={{ x: 0, y: 0 }}
          positioning="relative-to-element"
          participantList={participantList}
          date={date}
          timeText={timeText}
        />
      )}
    </S.Container>
  );
};

export default HeatMapDataCell;
