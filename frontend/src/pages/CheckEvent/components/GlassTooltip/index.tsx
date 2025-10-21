import * as S from './GlassTooltip.styled';
import { useCellData } from '../../stores/CellDataStore';
import Wrapper from '@/shared/layout/Wrapper';
import { createPortal } from 'react-dom';
import Flex from '@/shared/layout/Flex';
import Text from '@/shared/components/Text';
import { useTheme } from '@emotion/react';
import { useRoomStatistics } from '../../stores/roomStatisticsStore';

const GlassTooltip = () => {
  const { isMobile } = useTheme();

  const data = useCellData();
  const roomStatistics = useRoomStatistics();
  const participantSet = new Set(data?.participantNames ?? []);
  const sortedPeople = roomStatistics.participants
    .map((name) => ({
      name,
      active: participantSet.has(name),
    }))
    .sort((a, b) => (a.active === b.active ? 0 : a.active ? -1 : 1));

  return createPortal(
    <Wrapper
      maxWidth={1280}
      position="fixed"
      style={{
        left: '50%',
        bottom: isMobile ? '20px' : '100px',
        transform: 'translateX(-50%)',
        pointerEvents: 'none',
      }}
      paddingLeft="var(--padding-11)"
      paddingRight="var(--padding-11)"
      aria-hidden="true"
    >
      <S.Container opacity={data?.participantNames.length !== 0 ? 1 : 0}>
        <Flex justify="space-between" wrap="wrap" gap="var(--gap-4)">
          <Flex direction={isMobile ? 'column' : 'row'} align="center" gap="var(--gap-4)">
            <Text variant={isMobile ? 'h4' : 'h2'} color="gray70">
              {data?.date}
            </Text>
            <Text variant={isMobile ? 'caption' : 'h3'}>
              {data?.startTime} ~ {data?.endTime}
            </Text>
          </Flex>

          <S.Highlight opacity={data?.isRecommended ? 1 : 0}>
            <Text variant="button" color="gray10">
              ⭐️ 추천 시간
            </Text>
          </S.Highlight>
        </Flex>

        <S.ParticipantList>
          {sortedPeople.map(({ name, active }) => (
            <S.Participant key={name} active={active}>
              <Text variant={isMobile ? 'body' : 'h4'}>{name}</Text>
            </S.Participant>
          ))}
        </S.ParticipantList>
      </S.Container>
    </Wrapper>,
    document.body
  );
};

export default GlassTooltip;
