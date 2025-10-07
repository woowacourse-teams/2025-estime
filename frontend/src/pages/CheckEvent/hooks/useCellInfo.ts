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
  const isRecommended = cellInfo.weight === maxVoteCount;
  return {
    participantList: cellInfo.participantNames,
    currentTime,
    nextTime,
    isRecommended,
  };
};

export default useCellInfo;
