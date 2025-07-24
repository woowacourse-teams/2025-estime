import Flex from '../Layout/Flex';
import ILock from '@/icons/ILock';
import IClock from '@/icons/IClock';
import IGlobe from '@/icons/IGlobe';
import Text from '@/components/Text';
import { useTheme } from '@emotion/react';
import type { RoomInfo } from '@/types/roomInfo';

type CheckEventPageHeaderProps = Pick<RoomInfo, 'deadLine' | 'isPublic' | 'title'>;

const CheckEventPageHeader = ({ deadLine, isPublic, title }: CheckEventPageHeaderProps) => {
  const theme = useTheme();
  return (
    <Flex gap="var(--gap-5)" justify="space-between" direction="column">
      <Text variant="h1" color="primary">
        {title}
      </Text>
      <Flex gap="var(--gap-6)" justify="flex-start" align="center">
        <Flex justify="space-between" align="center" gap="var(--gap-4)">
          <Flex.Item>
            {isPublic ? <IGlobe color={theme.colors.text} /> : <ILock color={theme.colors.red40} />}
          </Flex.Item>
          <Flex.Item>
            <p>공개 여부 : {isPublic ? '공개' : '비공개'}</p>
          </Flex.Item>
        </Flex>
        <Flex justify="space-between" align="center" gap="var(--gap-4)">
          <Flex.Item>
            <IClock color={theme.colors.text} />
          </Flex.Item>
          <Flex.Item>
            <p>마감일 : {deadLine ? deadLine.date : '설정되지 않음'}</p>
          </Flex.Item>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default CheckEventPageHeader;
