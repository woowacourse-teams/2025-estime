import { useTimetableHoverContext } from '@/pages/Vote/providers/TimetableProvider';
import { cellDataStore } from '@/pages/Vote/stores/CellDataStore';
import { useGlassPreview } from '@/pages/Vote/stores/glassPreviewStore';
import { useRoomStatistics } from '@/pages/Vote/stores/roomStatisticsStore';
import { FormatManager } from '@/shared/utils/common/FormatManager';
import { TimeManager } from '@/shared/utils/common/TimeManager';
import { useTheme } from '@emotion/react';

interface TimeTableCellProps {
  date: string;
  timeText: string;
}

const TimeTableCell = ({ date, timeText }: TimeTableCellProps) => {
  const dateTimeKey = `${date}T${timeText}`;
  const roomStatistics = useRoomStatistics();
  const cellInfo = roomStatistics.statistics.get(dateTimeKey);
  const isRecommended = cellInfo?.voteCount === roomStatistics.maxVoteCount;
  const theme = useTheme();
  const { isOn } = useGlassPreview();
  const { timeTableCellHover } = useTimetableHoverContext();

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const isDragging = e.currentTarget.closest('.dragging') !== null;

    if (!isDragging && !theme.isMobile && isOn) {
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
    }
  };
  const handleEnter = () => {
    if (theme.isMobile) return;
    timeTableCellHover(timeText);
  };

  const handlePointerLeave = () => {
    cellDataStore.initialStore();
    timeTableCellHover(null);
  };

  return (
    <div
      className="time-table-cell"
      aria-label={`${FormatManager.formatKoreanDate(date)} ${timeText} 선택`}
      data-time={dateTimeKey}
      onMouseEnter={handleEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      tabIndex={0}
    />
  );
};

export default TimeTableCell;
