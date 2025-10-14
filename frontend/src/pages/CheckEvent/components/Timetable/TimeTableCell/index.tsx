import { cellDataStore } from '@/pages/CheckEvent/stores/CellDataStore';
import { useRoomStatistics } from '@/pages/CheckEvent/stores/roomStatisticsStore';
import { FormatManager } from '@/shared/utils/common/FormatManager';
import { TimeManager } from '@/shared/utils/common/TimeManager';

interface TimeTableCellProps {
  date: string;
  timeText: string;
}

const TimeTableCell = ({ date, timeText }: TimeTableCellProps) => {
  const dateTimeKey = `${date}T${timeText}`;

  const roomStatistics = useRoomStatistics();
  const cellInfo = roomStatistics.statistics.get(dateTimeKey);
  const isRecommended = cellInfo?.voteCount === roomStatistics.maxVoteCount;

  return (
    <div
      className="heat-map-cell"
      data-time={dateTimeKey}
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

export default TimeTableCell;
