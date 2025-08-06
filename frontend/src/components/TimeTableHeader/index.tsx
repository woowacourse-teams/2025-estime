import * as S from './TimeTableHeader.styled';

import Text from '@/components/Text';
import Button from '@/components/Button';
import Flex from '@/components/Layout/Flex';
import { ComponentProps } from 'react';

//로딩 구현시 saving을 쓰면 됨.
type HeaderMode = 'view' | 'edit';

interface Presets {
  title: (name: string) => string;
  description: string;
  //call-to-action
  cta: string;
  disabled?: boolean;
}
const HeaderPresets: Record<HeaderMode, Presets> = {
  view: {
    title: (name: string) => `${name}방의 시간 집계에요!`,
    description: '현재 시간표를 확인해보세요!',
    cta: '편집하기',
  },
  edit: {
    title: (name: string) => `${name}의 시간 등록하기`,
    description: '가능한 시간을 아래 시간표에서 드래그 해주세요 !',
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

  return (
    <S.Container {...props}>
      <Flex direction="column" gap="var(--gap-4)">
        <Text variant="h2" color="text">
          {presets.title(name)}
        </Text>
        <Text variant="body" color="text">
          {presets.description}
        </Text>
      </Flex>

      <Button color="primary" onClick={onToggleEditMode} disabled={isLoading} size="small">
        <Text variant="button" color="text">
          {presets.cta}
        </Text>
      </Button>
    </S.Container>
  );
};

export default TimeTableHeader;
