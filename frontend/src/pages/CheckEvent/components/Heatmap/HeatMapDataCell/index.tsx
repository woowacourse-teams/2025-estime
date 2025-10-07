import * as S from './HeatMapDataCell.styled';
import { memo } from 'react';
import { useRoomStatistics } from '@/pages/CheckEvent/stores/roomStatisticsStore';

interface HeatMapDataCellProps {
  date: string;
  timeText: string;
}

const HeatMapDataCell = ({ date, timeText }: HeatMapDataCellProps) => {
  const roomStatistics = useRoomStatistics();
  const cellInfo = roomStatistics.statistics.get(`${date}T${timeText}`);
  const isRecommended = cellInfo?.participantNames.length === roomStatistics.maxVoteCount;

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
