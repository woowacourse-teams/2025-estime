import Flex from '@/shared/layout/Flex';
import * as S from './Tooltip.styled';
import Text from '@/shared/components/Text';
import IPerson from '@/assets/icons/IPerson';
import { createPortal } from 'react-dom';
import { RefObject, memo } from 'react';
import getCellInfo from '../../utils/getCellInfo';
import { useRoomStatistics } from '../../stores/roomStatisticsStore';

interface TooltipProps {
  currentCellId: string;
  tooltipRef: RefObject<HTMLDivElement | null>;
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

const Tooltip = ({ currentCellId, tooltipRef }: TooltipProps) => {
  const roomStatistics = useRoomStatistics();
  const { currentTime, nextTime, participantList } = getCellInfo(currentCellId, roomStatistics);

  if (!participantList || participantList.length === 0) {
    return null;
  }

  const cellInfo = roomStatistics.get(currentCellId);
  const visible = cellInfo ? true : false;
  const weight = cellInfo?.weight ?? 0;

  return createPortal(
    <S.Tooltip ref={tooltipRef} visible={visible}>
      <Flex direction="column" gap="var(--gap-6)" align="center" justify="center">
        <Flex direction="column" gap="var(--gap-2)" align="center" justify="center">
          <S.Wrapper weight={weight}>
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
