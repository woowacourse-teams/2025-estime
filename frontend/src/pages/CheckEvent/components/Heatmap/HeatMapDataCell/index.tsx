import * as S from './HeatMapDataCell.styled';
import { memo } from 'react';
import { useRoomStatistics } from '@/pages/CheckEvent/stores/roomStatisticsStore';
import { cellDataStore } from '@/pages/CheckEvent/stores/CellDataStore';
import { TimeManager } from '@/shared/utils/common/TimeManager';
import { FormatManager } from '@/shared/utils/common/FormatManager';

interface HeatMapDataCellProps {
  date: string;
  timeText: string;
}

const HeatMapDataCell = ({ date, timeText }: HeatMapDataCellProps) => {
  const roomStatistics = useRoomStatistics();
  const cellInfo = roomStatistics.statistics.get(`${date}T${timeText}`);
  const isRecommended = cellInfo?.voteCount === roomStatistics.maxVoteCount;
  const weight = cellInfo?.weight ?? 0;
  return (
    <S.Container
      data-cell-id={`${date}T${timeText}`}
      weight={weight}
      isRecommended={isRecommended}
      onMouseOver={() => {
        if (!cellInfo) {
          cellDataStore.initialStore();
        } else {
          cellDataStore.setState({
            ...cellInfo,
            isRecommended,
            date: FormatManager.formatKoreanDate(date),
            startTime: timeText,
            endTime: TimeManager.addMinutes(timeText, 30),
          });
        }
      }}
      onMouseLeave={() => cellDataStore.initialStore()}
    />
  );
};

export default memo(HeatMapDataCell);
