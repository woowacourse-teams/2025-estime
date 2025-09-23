import { TimeManager } from '@/shared/utils/common/TimeManager';
import type { DateCellInfo } from '../hooks/useHeatmapStatistics';

const getCellInfo = (currentCellId: string | null, roomStatistics: Map<string, DateCellInfo>) => {
  if (!currentCellId) return { participantList: [], currentTime: '', nextTime: '' };

  const cellInfo = roomStatistics.get(currentCellId);
  if (!cellInfo || cellInfo.participantNames.length === 0) {
    return { participantList: [], currentTime: '', nextTime: '' };
  }

  const timeText = currentCellId.split('T')[1];
  const currentTime = timeText;
  const nextTime = TimeManager.addMinutes(timeText, 30);

  return {
    participantList: cellInfo.participantNames,
    currentTime,
    nextTime,
  };
};

export default getCellInfo;
