import { createPortal } from 'react-dom';
import * as S from './TableTooltip.styled';
import Text from '@/components/Text';
import Flex from '../Layout/Flex';
import IPerson from '@/icons/IPerson';

interface TableTooltipProps {
  position: { x: number; y: number };
  positioning?: 'mouse-follow' | 'relative-to-element';
  participantList: string[];
  date: string;
  timeText: string;
}

function TableTooltip({
  position,
  positioning = 'mouse-follow',
  participantList,
  date,
  timeText,
}: TableTooltipProps) {
  const currentTime = new Date(`${date}T${timeText}`);
  const nextTime = new Date(`${date}T${timeText}`);
  nextTime.setMinutes(nextTime.getMinutes() + 30);

  const timeFormat = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  } as const;
  const currentTimeString = currentTime.toLocaleString('ko-KR', timeFormat);
  const nextTimeString = nextTime.toLocaleString('ko-KR', timeFormat);

  const tooltipContent = (
    <S.Container x={position.x} y={position.y} positioning={positioning}>
      <Flex direction="column" gap="var(--gap-6)" align="center" justify="center">
        <Flex direction="column" gap="var(--gap-2)" align="center" justify="center">
          <Text variant="caption" color="text">
            {currentTimeString}
          </Text>
          <Text variant="caption" color="text">
            ~
          </Text>
          <Text variant="caption" color="text">
            {nextTimeString}
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

  if (positioning === 'relative-to-element') {
    return tooltipContent;
  }

  return createPortal(tooltipContent, document.body);
}

export default TableTooltip;
