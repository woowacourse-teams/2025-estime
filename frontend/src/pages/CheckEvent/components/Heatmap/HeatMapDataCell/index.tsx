import { getHeatMapCellBackgroundColor } from '@/pages/CheckEvent/utils/getCellColor';
import { useTheme } from '@emotion/react';
import * as S from './HeatMapDataCell.styled';
import { memo } from 'react';
import { useRoomStatisticsContext } from '@/pages/CheckEvent/provider/RoomStatisticsProvider';

interface HeatMapDataCellProps {
  date: string;
  timeText: string;
}

const HeatMapDataCell = ({ date, timeText }: HeatMapDataCellProps) => {
  const theme = useTheme();

  const { roomStatistics } = useRoomStatisticsContext();

  const cellInfo = roomStatistics.get(`${date}T${timeText}`);

  const weight = cellInfo?.weight ?? 0;

  const backgroundColor = getHeatMapCellBackgroundColor({
    theme,
    weight,
  });
  return <S.Container data-cell-id={`${date}T${timeText}`} backgroundColor={backgroundColor} />;
};

export default memo(HeatMapDataCell);
