
import { cellDataStore } from '@/pages/CheckEvent/stores/CellDataStore';
import { useGlassPreview } from '@/pages/CheckEvent/stores/glassPreviewStore';
import { useRoomStatistics } from '@/pages/CheckEvent/stores/roomStatisticsStore';
import { FormatManager } from '@/shared/utils/common/FormatManager';
import { TimeManager } from '@/shared/utils/common/TimeManager';
import { useTheme } from '@emotion/react';
import { useTimetableHoverContext } from '@/pages/CheckEvent/providers/TimetableProvider';


interface TimeTableCellProps {
  date: string;
  timeText: string;
}

const TimeTableCell = ({ date, timeText }: TimeTableCellProps) => {
  const { timeTableCellHover } = useTimetableHoverContext();

  const dateTimeKey = `${date}T${timeText}`;
  const roomStatistics = useRoomStatistics();
  const cellInfo = roomStatistics.statistics.get(dateTimeKey);
  const isRecommended = cellInfo?.voteCount === roomStatistics.maxVoteCount;
  const theme = useTheme();
  const { isOn } = useGlassPreview();

  const handleLeave = () => {
    cellDataStore.initialStore();
  };

  const handleMouseOver = (e: React.MouseEvent<HTMLDivElement>) => {
    const isDragging = e.currentTarget.closest('.dragging') !== null;

    if (isDragging) return;
    if (theme.isMobile) return;
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
  const handleEnter = () => timeTableCellHover(timeText);
  const handleLeave = () => timeTableCellHover(null);



  return (
    <div
      data-time={dateTimeKey}
      className="time-table-cell"
      onMouseOver={handleMouseOver}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    />
  );
};

export default TimeTableCell;
