import * as S from './HeatMapDataCell.styled';
import { memo } from 'react';
import useCellInfo from '@/pages/CheckEvent/hooks/useCellInfo';

interface HeatMapDataCellProps {
  date: string;
  timeText: string;
}

const HeatMapDataCell = ({ date, timeText }: HeatMapDataCellProps) => {
  const { cellInfo, isRecommended } = useCellInfo(`${date}T${timeText}`);

  const weight = cellInfo?.weight ?? 0;

  return (
    <S.Container
      data-cell-id={`${date}T${timeText}`}
      weight={weight}
      isRecommended={isRecommended}
    />
  );
};

export default memo(HeatMapDataCell);
