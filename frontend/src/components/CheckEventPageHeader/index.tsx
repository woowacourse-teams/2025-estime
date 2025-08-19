import Flex from '../Layout/Flex';
import IClock from '@/icons/IClock';
import Text from '@/components/Text';
import { useTheme } from '@emotion/react';
import type { RoomInfo } from '@/types/roomInfo';
import CopyLinkButton from '../CopyLinkButton';

type CheckEventPageHeaderProps = Pick<RoomInfo, 'deadline' | 'title'> & {
  roomSession: string;
};

const CheckEventPageHeader = ({ deadline, title, roomSession }: CheckEventPageHeaderProps) => {
  const theme = useTheme();

  return (
    <Flex gap="var(--gap-5)" justify="space-between" direction="column">
      <Flex gap="var(--gap-6)" align="center">
        <Text variant="h1" color="primary">
          {title}
        </Text>
        <CopyLinkButton sessionId={roomSession} />
      </Flex>
      <Flex gap="var(--gap-6)" justify="flex-start" align="center">
        <Flex justify="space-between" align="center" gap="var(--gap-3)">
          <IClock color={theme.colors.text} />

          <Text variant="h4" color="text">
            마감일 : {deadline ? `${deadline.date} ${deadline.time}` : '설정되지 않음'}
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default CheckEventPageHeader;
