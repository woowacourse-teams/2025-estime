import { getHeatMapCellBackgroundColor } from '@/utils/getBackgroundColor';
import { DateManager } from '@/utils/common/DateManager';
import { useTheme } from '@emotion/react';
import Flex from '@/components/Layout/Flex';
import Text from '@/components/Text';
import * as S from './HeatMapCell.styled';
import type { DateCellInfo } from '@/hooks/useRoomStatistics';
import TableTooltip from '@/components/TableTooltip';
import { useHoverTooltip } from '@/hooks/useHoverTooltip';
import IPerson from '@/icons/IPerson';

interface HeatMapCellProps {
  date: string;
  timeText: string;
  roomStatistics: Map<string, DateCellInfo>;
}

const HeatMapCell = ({ date, timeText, roomStatistics }: HeatMapCellProps) => {
  const theme = useTheme();
  const { open, position, onEnter, onLeave } = useHoverTooltip();
  const isHeader = timeText === 'Dates';
  const cellInfo = roomStatistics.get(`${date}T${timeText}`);

  const weight = isHeader ? 0 : (cellInfo?.weight ?? 0);
  const participantList = cellInfo?.participantNames;
  // TODO: 추후 추가
  // const allAvailable
  const backgroundColor = getHeatMapCellBackgroundColor({
    theme,
    isHeader,
    weight,
  });

  return (
    <S.Container
      isHeader={isHeader}
      backgroundColor={backgroundColor}
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
    >
      {isHeader && (
        <>
          <Text variant="body" color="text">
            <Flex direction="column" justify="center" align="center">
              <Text>{date.split('-').slice(1).join('.')}</Text>
              <Text>({DateManager.getDayOfWeek(date)})</Text>
            </Flex>
          </Text>
        </>
      )}
      {!isHeader && open && participantList && participantList.length > 0 && (
        <TableTooltip position={position}>
          <Flex direction="row" gap="var(--gap-4)" align="center">
            <IPerson />
            <Text variant="body" color="text">
              {participantList.join(', ')} 참여 가능!
            </Text>
          </Flex>
        </TableTooltip>
      )}
    </S.Container>
  );
};

export default HeatMapCell;
