import { ComponentProps } from 'react';
import * as S from './Timepicker.styled';
import Text from '../Text';
import useTimePicker from '../../hooks/useTimePicker';

const hourOptions = Array.from({ length: 24 }, (_, i) => {
  const hour = `${String(i).padStart(2, '0')} : 00`;
  return hour;
});

interface TimePickerProps extends ComponentProps<'input'> {
  selectedHour: string;
  selectHour: (hour: string, e: React.MouseEvent<HTMLLIElement>) => void;
  toggleOpen: () => void;
  isOpen: boolean;
}

const TimePicker = ({ selectedHour, selectHour, toggleOpen, isOpen }: TimePickerProps) => {
  return (
    <S.Container role="combobox" onClick={toggleOpen}>
      <S.Wrapper>
        <S.TimeWrapper>
          <Text variant="body">{selectedHour || '00 : 00'}</Text>
        </S.TimeWrapper>
        <img src="clock.svg" alt="clock icon" />
      </S.Wrapper>
      {isOpen && (
        <S.List role="listbox" isOpen={isOpen}>
          <S.ListItemWrapper>
            {hourOptions.map((time) => (
              <S.ListItem key={time} role="option" onClick={(e) => selectHour(time, e)}>
                <Text variant="body"> {time}</Text>
              </S.ListItem>
            ))}
          </S.ListItemWrapper>
        </S.List>
      )}
    </S.Container>
  );
};

export default TimePicker;
