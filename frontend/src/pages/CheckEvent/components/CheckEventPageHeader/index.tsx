import Flex from '../../../../shared/layout/Flex';
import Text from '@/shared/components/Text';
import IClock from '@/assets/icons/IClock';
import ShareButton from '../../../../shared/components/Button/ShareButton';
import { useTheme } from '@emotion/react';
import type { RoomInfo } from '@/pages/CreateEvent/types/roomInfo';
import Participants from '../Participants/Participants';

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

  return (
    <Flex gap="var(--gap-5)" justify="space-between" direction="column">
      <Flex gap="var(--gap-6)" align="center">
        <Text variant="h1" color="primary" tabIndex={0} aria-label={`방 제목 ${title}`}>
          {title}
        </Text>
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
    </Flex>
  );
};

export default CheckEventPageHeader;
