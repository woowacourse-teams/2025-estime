import * as S from './Participants.styled';
import { useTheme } from '@emotion/react';
import Text from '@/shared/components/Text';
import { useState } from 'react';
import Flex from '@/shared/layout/Flex';
import IClose from '@/assets/icons/IClose';
import IPersonList from '@/assets/icons/IPersonList';
import Wrapper from '@/shared/layout/Wrapper';
import { useRoomStatistics } from '../../stores/roomStatisticsStore';

const Participants = () => {
  const theme = useTheme();
  const [show, setShow] = useState(true);

  const roomStatistics = useRoomStatistics();
  const hasParticipants = roomStatistics.participantCount > 0;

  const handleToggleParticipants = () => {
    if (!hasParticipants) return;
    setShow(true);
  };

  return (
    <Wrapper center={false}>
      <S.Button onClick={handleToggleParticipants}>
        <Flex justify={'flex-end'} align="center" gap="var(--gap-2)">
          <IPersonList color={theme.colors.primary} />
          <Text style={{ fontSize: '1.25rem' }} color="primary">
            {roomStatistics.participantCount}
          </Text>
        </Flex>
      </S.Button>
      {hasParticipants && (
        <S.Container show={show}>
          <S.Header>
            <Flex align="center" gap="var(--gap-2)">
              <Text color="primary" variant="button">
                투표 참여자
              </Text>
            </Flex>
            <S.Button onClick={() => setShow(false)}>
              <IClose color={theme.colors.primary} width={'24'} height={'24'} />
            </S.Button>
          </S.Header>
          <S.Body>
            <S.NameList>
              <Text color="primary" variant="button">
                {roomStatistics.participants.join(', ')}
              </Text>
            </S.NameList>
          </S.Body>
        </S.Container>
      )}
    </Wrapper>
  );
};

export default Participants;
