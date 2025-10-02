import * as S from './TimeTableHeader.styled';

import Text from '@/shared/components/Text';
import Flex from '@/shared/layout/Flex';
import { ComponentProps } from 'react';
import { useTheme } from '@emotion/react';
import Notice from '@/shared/components/Notice';

//로딩 구현시 saving을 쓰면 됨.
type HeaderMode = 'register' | 'edit' | 'save';

interface Presets {
  title: string;
  description: (name: string, isMobile?: boolean) => string;
  //call-to-action
  disabled?: boolean;
}

const HeaderPresets: Record<HeaderMode, Presets> = {
  register: {
    title: `전체 시간표`,
    description: () => '시간표를 등록해주세요!',
  },
  edit: {
    title: `전체 시간표`,
    description: () => '현재 시간표를 확인해보세요!',
  },
  save: {
    title: `나의 시간표`,
    description: (name: string, isMobile?: boolean) =>
      isMobile
        ? `${name}님의 \n 가능한 시간을 드래그 해주세요!`
        : `${name}님의 가능한 시간을 드래그 해주세요!`,
  },
};

interface TimeTableHeaderProps extends ComponentProps<'header'> {
  name: string;
  mode?: HeaderMode;
  isLoading?: boolean;
  isExpired: boolean;
}

const TimeTableHeader = ({
  name,
  mode = 'register',
  isExpired,
  ...props
}: TimeTableHeaderProps) => {
  const presets = HeaderPresets[mode];
  const theme = useTheme();

  return (
    <S.Container {...props}>
      <Flex direction="column" gap="var(--gap-4)">
        <Text variant="h2" color="text">
          {presets.title}
        </Text>
        <Text variant="body" color="text" style={{ whiteSpace: 'pre-wrap' }}>
          {presets.description(name, theme.isMobile)}
        </Text>
      </Flex>
      <Flex gap="var(--gap-8)">
        <Notice type="warning" show={isExpired}>
          <Text variant="body" color="warningText">
            ⚠️ 마감일이 지났어요. 결과를 확인해주세요!
          </Text>
        </Notice>
        {props.children}
      </Flex>
    </S.Container>
  );
};

export default TimeTableHeader;
