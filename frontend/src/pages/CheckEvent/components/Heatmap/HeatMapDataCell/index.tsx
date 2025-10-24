import * as S from './HeatMapDataCell.styled';
import { memo } from 'react';
import { useRoomStatistics } from '@/pages/CheckEvent/stores/roomStatisticsStore';
import { cellDataStore } from '@/pages/CheckEvent/stores/CellDataStore';
import { TimeManager } from '@/shared/utils/common/TimeManager';
import { FormatManager } from '@/shared/utils/common/FormatManager';
import { useTheme } from '@emotion/react';
import { cellHoverStore } from '@/pages/CheckEvent/stores/CellHoverStore';

interface HeatMapDataCellProps {
  date: string;
  timeText: string;
  isLocked?: boolean;
}

const HeatMapDataCell = ({ date, timeText, isLocked }: HeatMapDataCellProps) => {
  const { isMobile } = useTheme();

  const roomStatistics = useRoomStatistics();
  const cellInfo = roomStatistics.statistics.get(`${date}T${timeText}`);
  const isRecommended = cellInfo?.voteCount === roomStatistics.maxVoteCount;
  const weight = cellInfo?.weight ?? 0;
  const participantNames = cellInfo?.participantNames.join(', ');
  const isParticipantExists = participantNames && participantNames.length > 0;
  let ariaLabel = '';
  if (isParticipantExists) {
    ariaLabel = `${FormatManager.formatKoreanDate(date)} ${timeText} ${participantNames} 참여가능`;
  }

  const publishCellInfo = () => {
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

  const handleClick = () => {
    if (isMobile) {
      publishCellInfo();
    } else {
      cellHoverStore.handleCellHoverLock();
    }
  };
  return (
    <S.Container
      data-cell
      data-cell-id={`${date}T${timeText}`}
      weight={weight}
      isRecommended={isRecommended}
      onMouseOver={() => {
        if (isMobile || isLocked) return;
        publishCellInfo();
      }}
      onMouseLeave={(e) => {
        if (
          isMobile &&
          (e.relatedTarget as HTMLElement | null)?.closest('[data-tooltip-participant]')
        )
          return;

        if (isLocked) return;
        cellDataStore.initialStore();
      }}
      onClick={handleClick}
      tabIndex={isParticipantExists ? 0 : -1}
      aria-label={ariaLabel}
    />
  );
};

export default memo(HeatMapDataCell);
