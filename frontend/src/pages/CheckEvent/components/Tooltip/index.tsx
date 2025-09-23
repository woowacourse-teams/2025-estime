import Flex from '@/shared/layout/Flex';
import * as S from './Tooltip.styled';
import Text from '@/shared/components/Text';
import IPerson from '@/assets/icons/IPerson';
import { createPortal } from 'react-dom';
import { useRoomStatisticsContext } from '../../provider/RoomStatisticsProvider';
import { RefObject, memo } from 'react';
import { getHeatMapCellBackgroundColor } from '../../utils/getCellColor';
import { useTheme } from '@emotion/react';
import getCellInfo from '../../utils/getCellInfo';

interface TooltipProps {
  currentCellId: string;
  tooltipRef: RefObject<HTMLDivElement | null>;
  visible: boolean;
}

const ParticipantItem = memo(({ participantList }: { participantList: string[] }) => (
  <S.ParticipantGrid participants={participantList.length}>
    {participantList.map((participant) => (
      <S.Person key={participant}>
        <IPerson />
        <Text variant="caption" color="text">
          {participant}
        </Text>
      </S.Person>
    ))}
  </S.ParticipantGrid>
));

ParticipantItem.displayName = 'ParticipantItem';

const Tooltip = ({ currentCellId, tooltipRef, visible }: TooltipProps) => {
  const theme = useTheme();
  const { roomStatistics } = useRoomStatisticsContext();
  const { currentTime, nextTime, participantList } = getCellInfo(currentCellId, roomStatistics);

  if (!participantList || participantList.length === 0) {
    return null;
  }

  const cellInfo = roomStatistics.get(currentCellId);

  const weight = cellInfo?.weight ?? 0;

  const borderColor = getHeatMapCellBackgroundColor({
    theme,
    weight,
  });

  return createPortal(
    <S.Tooltip ref={tooltipRef} visible={visible}>
      <Flex direction="column" gap="var(--gap-6)" align="center" justify="center">
        <Flex direction="column" gap="var(--gap-2)" align="center" justify="center">
          <S.Wrapper borderColor={borderColor}>
            <Text variant="caption" color="text">
              {currentTime} ~ {nextTime}
            </Text>
          </S.Wrapper>
        </Flex>
        <ParticipantItem participantList={participantList} />
      </Flex>
    </S.Tooltip>,
    document.body
  );
};

export default Tooltip;
