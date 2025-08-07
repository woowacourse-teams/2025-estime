import { getHeatMapCellBackgroundColor } from '@/utils/getBackgroundColor';
import { useTheme } from '@emotion/react';
import * as S from './HeatMapDataCell.styled';
import type { DateCellInfo } from '@/hooks/useRoomStatistics';
import type { TooltipInfo } from '..';

interface HeatMapDataCellProps {
  date: string;
  timeText: string;
  roomStatistics: Map<string, DateCellInfo>;
  onEnter: (tooltipInfo: TooltipInfo, event: React.PointerEvent) => void;
  onLeave: () => void;
}

const HeatMapDataCell = ({
  date,
  timeText,
  roomStatistics,
  onEnter,
  onLeave,
}: HeatMapDataCellProps) => {
  const theme = useTheme();
  const cellInfo = roomStatistics.get(`${date}T${timeText}`);

  const weight = cellInfo?.weight ?? 0;
  const participantList = cellInfo?.participantNames;

  const backgroundColor = getHeatMapCellBackgroundColor({
    theme,
    weight,
  });

  return (
    <S.Container
      backgroundColor={backgroundColor}
      onPointerEnter={(e: React.PointerEvent<Element>) =>
        onEnter({ date, timeText, participantList: participantList ?? [] }, e)
      }
      onPointerLeave={onLeave}
    ></S.Container>
  );
};

export default HeatMapDataCell;
