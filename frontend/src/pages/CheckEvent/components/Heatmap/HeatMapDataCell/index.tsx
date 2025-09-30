import * as S from './HeatMapDataCell.styled';
import { memo } from 'react';
import { useRoomStatisticsContext } from '@/pages/CheckEvent/provider/RoomStatisticsProvider';

interface HeatMapDataCellProps {
  date: string;
  timeText: string;
}

const HeatMapDataCell = ({ date, timeText }: HeatMapDataCellProps) => {
  const { roomStatistics } = useRoomStatisticsContext();

  const cellInfo = roomStatistics.get(`${date}T${timeText}`);
  const isRecommended = cellInfo?.isRecommended;

  const weight = cellInfo?.weight ?? 0;
  return (
    <S.Container
      data-cell-id={`${date}T${timeText}`}
      weight={weight}
      isRecommended={isRecommended}
    />
  );
};

export default memo(HeatMapDataCell);
