import * as S from './HeatMapPreviewDataCell.styled';
import { memo } from 'react';
import { useRoomStatistics } from '@/pages/CheckEvent/stores/roomStatisticsStore';
import { FormatManager } from '@/shared/utils/common/FormatManager';

interface HeatMapDataCellProps {
  date: string;
  timeText: string;
}

const HeatmapPreviewDataCell = ({ date, timeText }: HeatMapDataCellProps) => {
  const roomStatistics = useRoomStatistics();
  const slotCode = FormatManager.encodeSlotCode(`${date}T${timeText}`);
  const cellInfo = roomStatistics.statistics.get(slotCode);

  const weight = cellInfo?.weight ?? 0;
  return <S.Container weight={weight} />;
};

export default memo(HeatmapPreviewDataCell);
