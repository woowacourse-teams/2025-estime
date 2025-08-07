import { getHeatMapCellBackgroundColor } from '@/utils/getBackgroundColor';
import { useTheme } from '@emotion/react';
import Flex from '@/components/Layout/Flex';
import Text from '@/components/Text';
import * as S from './HeatMapDataCell.styled';
import type { DateCellInfo } from '@/hooks/useRoomStatistics';
import TableTooltip from '@/components/TableTooltip';
import { useHoverTooltip } from '@/hooks/useHoverTooltip';
import IPerson from '@/icons/IPerson';

interface HeatMapDataCellProps {
  date: string;
  timeText: string;
  roomStatistics: Map<string, DateCellInfo>;
}

const HeatMapDataCell = ({ date, timeText, roomStatistics }: HeatMapDataCellProps) => {
  const theme = useTheme();
  const { open, position, onEnter, onLeave } = useHoverTooltip();
  const cellInfo = roomStatistics.get(`${date}T${timeText}`);

  const weight = cellInfo?.weight ?? 0;
  const participantList = cellInfo?.participantNames;

  const backgroundColor = getHeatMapCellBackgroundColor({
    theme,
    weight,
  });

  const showTooltip = open && !!participantList?.length;

  return (
    <S.Container
      backgroundColor={backgroundColor}
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
    >
      {showTooltip && (
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

export default HeatMapDataCell;
