import { TimeManager } from '@/shared/utils/common/TimeManager';
import { useRoomStatistics } from '../stores/roomStatisticsStore';

const useCellInfo = (currentCellId: string | null) => {
  const { maxVoteCount, statistics } = useRoomStatistics();

  if (!currentCellId) return { participantList: [], currentTime: '', nextTime: '' };

  const cellInfo = statistics.get(currentCellId);

  if (!cellInfo || cellInfo.participantNames.length === 0) {
    return { participantList: [], currentTime: '', nextTime: '' };
  }

  const timeText = currentCellId.split('T')[1];

  const currentTime = timeText;
  const nextTime = TimeManager.addMinutes(timeText, 30);

  const isRecommended = maxVoteCount > 0 && cellInfo.participantNames.length === maxVoteCount;

  return {
    cellInfo,
    participantList: cellInfo.participantNames,
    isRecommended,
    times: {
      currentTime,
      nextTime,
    },
  };
};

export default useCellInfo;
