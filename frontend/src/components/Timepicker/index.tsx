import { ComponentProps } from 'react';
import * as S from './Timepicker.styled';
import Text from '../Text';
import IClock from '@/icons/IClock';
import { useTheme } from '@emotion/react';

interface TimePickerProps extends ComponentProps<'input'> {
  selectedHour: string | null;
  selectHour: (hour: string, e: React.MouseEvent<HTMLLIElement>) => void;
  toggleOpen: () => void;
  isOpen: boolean;
  hourOptions: string[];
}

const TimePicker = ({
  selectedHour,
  selectHour,
  toggleOpen,
  isOpen,
  hourOptions,
}: TimePickerProps) => {
  const { colors } = useTheme();

  return (
    <S.Container role="combobox" onClick={toggleOpen}>
      <S.Wrapper>
        <S.TimeWrapper>
          <Text variant="h4" color="gray50">
            {selectedHour || '00 : 00'}
          </Text>
        </S.TimeWrapper>
        <IClock color={colors.text} />
      </S.Wrapper>
      {isOpen && (
        <S.List role="listbox" isOpen={isOpen}>
          <S.ListItemWrapper>
            {hourOptions.map((time) => (
              <S.ListItem
                key={time}
                role="option"
                onClick={(e) => selectHour(time.replace(/\s/g, ''), e)}
              >
                <Text variant="h4"> {time}</Text>
              </S.ListItem>
            ))}
          </S.ListItemWrapper>
        </S.List>
      )}
    </S.Container>
  );
};

export default TimePicker;
