import { createPortal } from 'react-dom';
import * as S from './GlassTooltip.styled';
import { useCellData } from '../../stores/CellDataStore';
import { useRoomStatistics } from '../../stores/roomStatisticsStore';
import Wrapper from '@/shared/layout/Wrapper';
import Flex from '@/shared/layout/Flex';
import Text from '@/shared/components/Text';
import { useEffect, useRef } from 'react';

const useTooltipData = () => {
  const data = useCellData();
  const roomStatistics = useRoomStatistics();

  const participantSet = new Set(data?.participantNames ?? []);
  const sortedPeople = roomStatistics.participants
    .map((name) => ({
      name,
      active: participantSet.has(name),
    }))
    .sort((a, b) => (a.active === b.active ? 0 : a.active ? -1 : 1));

  return { data, sortedPeople };
};
const TooltipWrapper = ({ children, bottom }: { children: React.ReactNode; bottom: string }) => {
  return createPortal(
    <Wrapper
      maxWidth={1280}
      position="fixed"
      style={{
        left: '50%',
        bottom,
        transform: 'translateX(-50%)',
        pointerEvents: 'none',
      }}
      paddingLeft="var(--padding-11)"
      paddingRight="var(--padding-11)"
      aria-hidden="true"
    >
      {children}
    </Wrapper>,
    document.body
  );
};

const Mobile = () => {
  const { data, sortedPeople } = useTooltipData();
  const listRef = useRef<HTMLDivElement>(null);

  // data가 바뀔 때마다 scrollTop 초기화
  useEffect(() => {
    if (data?.participantNames?.length && listRef.current) {
      listRef.current.scrollTop = 0;
    }
  }, [data?.participantNames]);

  return (
    <TooltipWrapper bottom="20px">
      <S.Container opacity={data?.participantNames.length !== 0 ? 1 : 0}>
        <Flex justify="space-between" wrap="wrap" gap="var(--gap-4)" align="center">
          <Flex direction="column" align="flex-start" gap="var(--gap-3)" justify="flex-start">
            <Text variant="mobileCaption" color="gray60">
              {data?.date}
            </Text>
            <Text variant="mobileCaption">
              {data?.startTime} ~ {data?.endTime}
            </Text>
          </Flex>
          <S.Highlight opacity={data?.isRecommended ? 1 : 0}>
            <Text variant="button" color="gray10">
              ⭐️ 추천 시간
            </Text>
          </S.Highlight>
        </Flex>

        <S.ParticipantList ref={listRef} data-tooltip-participant>
          {sortedPeople.map(({ name, active }) => (
            <S.Participant key={name} active={active}>
              <Text variant="body">{name}</Text>
            </S.Participant>
          ))}
        </S.ParticipantList>
      </S.Container>
    </TooltipWrapper>
  );
};

const Desktop = () => {
  const { data, sortedPeople } = useTooltipData();

  return (
    <TooltipWrapper bottom="100px">
      <S.Container opacity={data?.participantNames.length !== 0 ? 1 : 0}>
        <Flex justify="space-between" wrap="wrap" gap="var(--gap-4)">
          <Flex direction="row" align="center" gap="var(--gap-4)">
            <Text variant="h2" color="gray70">
              {data?.date}
            </Text>
            <Text variant="h3">
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
              <Text variant="h4">{name}</Text>
            </S.Participant>
          ))}
        </S.ParticipantList>
      </S.Container>
    </TooltipWrapper>
  );
};

const GlassTooltip = {
  Mobile,
  Desktop,
};

export default GlassTooltip;
