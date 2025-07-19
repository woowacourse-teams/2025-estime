import * as S from './OptionSettings.styled';
import Text from '@/components/Text';
import Toggle from '@/components/Toggle';
import DatePicker from '@/components/DatePicker';
import Radio from '@/components/Radio';
import Accordion from '@/components/Accordian';
import TimePicker from '@/components/Timepicker';
import { useTheme } from '@emotion/react';
import { ACCESS_OPTIONS } from '@/constants/optionsettings';

interface OptionSettingsProps {
  isOpenAccordion: boolean;
  onToggleAccordion: () => void;
  isOnDeadline: boolean;
  onToggleDeadline: () => void;
  date: string;
  onDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const OptionSettings = ({
  isOpenAccordion,
  onToggleAccordion,
  isOnDeadline,
  onToggleDeadline,
  date,
  onDateChange,
}: OptionSettingsProps) => {
  const theme = useTheme();

  return (
    <S.Container>
      <Accordion title="선택 설정" isOpen={isOpenAccordion} onToggle={onToggleAccordion}>
        <S.Wrapper flexDirection="column" gap="var(--gap-6)">
          <S.Wrapper justifyContent="space-between">
            <Text variant="h3">마감 기한</Text>
            <Toggle isOn={isOnDeadline} onToggle={onToggleDeadline} />
          </S.Wrapper>
          <S.Wrapper gap="var(--gap-2)">
            <DatePicker value={date} onChange={onDateChange} />
            <TimePicker />
          </S.Wrapper>
        </S.Wrapper>
        <S.Wrapper flexDirection="column" gap="var(--gap-6)">
          <Text variant="h3">공개 범위</Text>
          {ACCESS_OPTIONS.map(({ value, label, Icon, description }) => (
            <S.Wrapper
              key={value}
              border={`1px solid ${theme.colors.gray20}`}
              padding={'var(--padding-7) var(--padding-4)'}
              borderRadius={'var(--radius-4)'}
            >
              <Radio name="access" value={value}>
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
