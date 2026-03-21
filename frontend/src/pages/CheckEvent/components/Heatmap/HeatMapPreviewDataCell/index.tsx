import * as S from './HeatMapPreviewDataCell.styled';
import { memo } from 'react';
import { useRoomStatistics } from '@/pages/CheckEvent/stores/roomStatisticsStore';
import { FormatManager } from '@/shared/utils/common/FormatManager';
import { useRoomInfo } from '@/pages/CheckEvent/stores/roomInfoStore';

interface HeatMapDataCellProps {
  date: string;
  timeText: string;
}

const HeatmapPreviewDataCell = ({ date, timeText }: HeatMapDataCellProps) => {
  const { minSlotCode } = useRoomInfo();
  const roomStatistics = useRoomStatistics();
  const cellInfo = roomStatistics.statistics.get(`${date}T${timeText}`);
  const isPast = FormatManager.encodeSlotCode(`${date}T${timeText}`) < minSlotCode;

  const weight = cellInfo?.weight ?? 0;
  return <S.Container weight={weight} isPast={isPast} />;
};

export default memo(HeatmapPreviewDataCell);
