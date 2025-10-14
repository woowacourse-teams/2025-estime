import { cellDataStore } from '@/pages/CheckEvent/stores/CellDataStore';
import { useGlassPreview } from '@/pages/CheckEvent/stores/glassPreviewStore';
import { useRoomStatistics } from '@/pages/CheckEvent/stores/roomStatisticsStore';
import { FormatManager } from '@/shared/utils/common/FormatManager';
import { TimeManager } from '@/shared/utils/common/TimeManager';
import { MouseEvent as ReactMouseEvent } from 'react';

interface TimeTableCellProps {
  date: string;
  timeText: string;
}

const TimeTableCell = ({ date, timeText }: TimeTableCellProps) => {
  const dateTimeKey = `${date}T${timeText}`;
  const roomStatistics = useRoomStatistics();
  const cellInfo = roomStatistics.statistics.get(dateTimeKey);
  const isRecommended = cellInfo?.voteCount === roomStatistics.maxVoteCount;

  const { isOn } = useGlassPreview();

  const handleLeave = () => {
    cellDataStore.initialStore();
  };

  const handleMouseOver = (e: ReactMouseEvent<HTMLDivElement>) => {
    const isDragging = e.currentTarget.closest('.dragging') !== null;

    if (isDragging) return;

    if (!isOn) return;

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
  };

  return (
    <div
      data-time={dateTimeKey}
      className="time-table-cell"
      onMouseOver={handleMouseOver}
      onMouseLeave={handleLeave}
    />
  );
};

export default TimeTableCell;
