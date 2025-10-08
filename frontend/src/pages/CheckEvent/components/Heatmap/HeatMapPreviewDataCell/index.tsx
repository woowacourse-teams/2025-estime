import * as S from './HeatMapPreviewDataCell.styled';
import { memo } from 'react';
import { useRoomStatistics } from '@/pages/CheckEvent/stores/roomStatisticsStore';

interface HeatMapDataCellProps {
  date: string;
  timeText: string;
}

const HeatmapPreviewDataCell = ({ date, timeText }: HeatMapDataCellProps) => {
  const roomStatistics = useRoomStatistics();
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

export default memo(HeatmapPreviewDataCell);
