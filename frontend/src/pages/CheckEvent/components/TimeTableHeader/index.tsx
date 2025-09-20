import * as S from './TimeTableHeader.styled';

import Text from '@/shared/components/Text';
import Button from '@/shared/components/Button';
import Flex from '@/shared/layout/Flex';
import { ComponentProps } from 'react';
import { useTheme } from '@emotion/react';

//로딩 구현시 saving을 쓰면 됨.
type HeaderMode = 'view' | 'edit';

interface Presets {
  title: string;
  description: (name: string, isMobile?: boolean) => string;
  //call-to-action
  cta: string;
  disabled?: boolean;
}

const HeaderPresets: Record<HeaderMode, Presets> = {
  view: {
    title: `전체 시간표`,
    description: () => '현재 시간표를 확인해보세요!',
    cta: '편집하기',
  },
  edit: {
    title: `나의 시간표`,
    description: (name: string, isMobile?: boolean) =>
      isMobile
        ? `${name}님의 \n 가능한 시간을 드래그 해주세요!`
        : `${name}님의 가능한 시간을 드래그 해주세요!`,
    cta: '저장하기',
  },
};

interface TimeTableHeaderProps extends ComponentProps<'header'> {
  name: string;
  mode?: HeaderMode;
  onToggleEditMode: () => void;
  isLoading?: boolean;
}

const TimeTableHeader = ({
  name,
  mode = 'view',
  onToggleEditMode,
  isLoading,
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

      <Button color="primary" onClick={onToggleEditMode} disabled={isLoading} size="small">
        <Text variant="button" color="text">
          {isLoading ? '저장 중...' : presets.cta}
        </Text>
      </Button>
    </S.Container>
  );
};

export default TimeTableHeader;
