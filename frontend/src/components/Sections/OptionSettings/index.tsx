import * as S from './OptionSettings.styled';
import Text from '@/components/Text';
import DatePicker from '@/components/DatePicker';
import Radio from '@/components/Radio';
import Accordion from '@/components/Accordion';
import TimePicker from '@/components/Timepicker';
import { useTheme } from '@emotion/react';
import { ACCESS_OPTIONS } from '@/constants/optionsettings';
import useTimePicker from '@/hooks/useTimePicker';
import { useMemo, useState } from 'react';
import { Field } from '@/types/field';
import { TimeManager } from '@/utils/common/TimeManager';

interface OptionSettingsProps {
  deadline: Field<{ date: string; time: string }>;
  isPublic: Field<'public' | 'private'>;
}

export interface StyleProps {
  flexDirection?: string;
  justifyContent?: string;
  backgroundColor?: string;
  alignItems?: string;
  gap?: string;
  border?: string;
  padding?: string;
  borderRadius?: string;
}

const OptionSettings = ({ deadline, isPublic }: OptionSettingsProps) => {
  const theme = useTheme();
  const { toggleOpen, isOpen } = useTimePicker();
  const [isOpenAccordion, setIsOpenAccordion] = useState(false);

  const deadlineHourOptions = useMemo(() => {
    return TimeManager.filterHourOptions(deadline.value);
  }, [deadline.value.date, deadline.value.time]);

  return (
    <S.Container>
      <Accordion
        title="선택 설정"
        isOpen={isOpenAccordion}
        onToggle={() => setIsOpenAccordion((prev) => !prev)}
      >
        <S.Wrapper flexDirection="column" gap="var(--gap-6)">
          <S.Wrapper justifyContent="space-between">
            <Text variant="h3">마감 기한</Text>
          </S.Wrapper>
          <S.Wrapper gap="var(--gap-2)">
            <DatePicker
              value={deadline.value.date}
              onChange={(e) => deadline.set({ date: e.target.value, time: deadline.value.time })}
            />
            <TimePicker
              selectedHour={deadline.value.time}
              selectHour={(hour: string) => deadline.set({ date: deadline.value.date, time: hour })}
              toggleOpen={toggleOpen}
              isOpen={isOpen}
              hourOptions={deadlineHourOptions}
            />
          </S.Wrapper>
        </S.Wrapper>
        <S.Wrapper flexDirection="column" gap="var(--gap-6)">
          <Text variant="h3">공개 범위</Text>
          {ACCESS_OPTIONS.map(({ value, label, Icon, description }) => (
            <S.Wrapper
              key={value}
              onClick={() => isPublic.set(value)}
              border={`1px solid ${theme.colors.gray20}`}
              backgroundColor={theme.colors.gray10}
              padding={'var(--padding-7) var(--padding-4)'}
              borderRadius={'var(--radius-4)'}
            >
              <Radio name="access" value={value} checked={isPublic.value === value} readOnly>
                <S.Wrapper gap="var(--gap-3)" alignItems="center">
                  <Icon color={theme.colors.text} />
                  <Text variant="h4">{label}</Text>
                </S.Wrapper>
                <Text variant="caption" color="gray50">
                  {description}
                </Text>
              </Radio>
            </S.Wrapper>
          ))}
        </S.Wrapper>
      </Accordion>
    </S.Container>
  );
};

export default OptionSettings;
