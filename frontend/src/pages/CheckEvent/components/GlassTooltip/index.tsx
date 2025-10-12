import React from 'react';
import * as S from './GlassTooltip.styled';
// import { createPortal } from 'react-dom';
import { useCellData } from '../../stores/CellDataStore';
import Wrapper from '@/shared/layout/Wrapper';
import { createPortal } from 'react-dom';
import Flex from '@/shared/layout/Flex';
import Text from '@/shared/components/Text';
import { useTheme } from '@emotion/react';

// ✅ 더미 데이터: 실제 useCellData() 대체
// const mockData = {
//   date: '2025년 10월 24일 (금)',
//   startTime: '09:00',
//   endTime: '09:30',
//   participantNames: ['호이초이', '제프리', '마빈'], // 현재 참여자
// };

// ✅ 전체 인원 (예시)
const allPeople = [
  '호이초이',
  '제프리',
  '마빈',
  '메이토',
  '리버',
  '플린트',
  '강산',
  '수이',
  '레온',
  '루나',
  '에이든',
  '벨라',
  '카밀라',
  '아이작',
  '제이드',
  '리안',
  '하루',
  '은호',
  '소율',
  '현우',
  '로아',
  '하린',
  '도윤',
  '채원',
  '시온',
  '주하',
  '민재',
  '루시',
  '하람',
  '라온',
];
const GlassTooltip = () => {
  const data = useCellData();

  // 여기서 전체 인원 보내주면 그거랑 가공해서 아래 삭선과 함께 보여준다.
  //   const data = mockData; // 임시 테스트용
  const { isMobile } = useTheme();

  const participantSet = new Set(data?.participantNames ?? []);
  const sortedPeople = allPeople
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
