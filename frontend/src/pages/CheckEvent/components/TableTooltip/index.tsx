import { createPortal } from 'react-dom';
import * as S from './TableTooltip.styled';
import Text from '@/shared/components/Text';
import Flex from '../../../../shared/layout/Flex';
import IPerson from '@/assets/icons/IPerson';
import { FormatManager } from '@/shared/utils/common/FormatManager';

interface TableTooltipProps {
  position: { x: number; y: number };
  positioning?: 'mouse-follow' | 'relative-to-element';
  participantList: string[];
  date: string;
  timeText: string;
}

function TableTooltip({ position, participantList, date, timeText }: TableTooltipProps) {
  const { currentTime, nextTime } = FormatManager.formatAvailableTimeRange(date, timeText);

  const tooltipContent = (
    <S.Container x={position.x} y={position.y}>
      <Flex direction="column" gap="var(--gap-6)" align="center" justify="center">
        <Flex direction="column" gap="var(--gap-2)" align="center" justify="center">
          <Text variant="caption" color="text">
            {currentTime}
          </Text>
          <Text variant="caption" color="text">
            ~
          </Text>
          <Text variant="caption" color="text">
            {nextTime}
          </Text>
        </Flex>
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
      </Flex>
    </S.Container>
  );

  return createPortal(tooltipContent, document.body);
}

export default TableTooltip;
