import Flex from '../../../../shared/layout/Flex';
import Text from '@/shared/components/Text';
import IClock from '@/assets/icons/IClock';
import ShareButton from '../../../../shared/components/Button/ShareButton';
import Notice from '@/shared/components/Notice';
import Participants from '../Participants/Participants';
import { useTheme } from '@emotion/react';
import type { RoomInfo } from '@/pages/CreateEvent/types/roomInfo';
import { DateManager } from '@/shared/utils/common/DateManager';
import * as S from './CheckEventPageHeader.styled';

type CheckEventPageHeaderProps = Pick<RoomInfo, 'deadline' | 'title'> & {
  roomSession: string;
  handleCopyLinkButtonClick: () => void;
};

const CheckEventPageHeader = ({
  deadline,
  title,
  handleCopyLinkButtonClick,
}: CheckEventPageHeaderProps) => {
  const theme = useTheme();
  const isExpired = DateManager.IsPastDeadline(deadline);

  return (
    <Flex gap="var(--gap-5)" justify="space-between" direction="column">
      <Flex gap={theme.isMobile ? 'var(--gap-6)' : 'var(--gap-4)'} align="center">
        <S.TitleContainer>
          <Text
            variant={theme.isMobile ? 'h2' : 'h1'}
            color="primary"
            tabIndex={0}
            aria-label={`방 제목 ${title}`}
          >
            {title}
          </Text>
        </S.TitleContainer>
        <ShareButton onClick={handleCopyLinkButtonClick} />
      </Flex>
      <Flex gap="var(--gap-6)" justify="space-between" align="center">
        <Flex justify="space-between" align="center" gap="var(--gap-3)">
          <IClock color={theme.colors.text} aria-hidden="true" />
          <Text variant="h4" color="text" tabIndex={0}>
            마감일 : {deadline ? `${deadline.date} ${deadline.time}` : '설정되지 않음'}
          </Text>
        </Flex>
        <Participants />
      </Flex>
      <Notice show={isExpired} type={'warning'} maxWidth={theme.isMobile ? '100%' : '16rem'}>
        <Text color="warningText">⚠️ 마감일이 지났어요. 결과를 확인해주세요!</Text>
      </Notice>
    </Flex>
  );
};

export default CheckEventPageHeader;
