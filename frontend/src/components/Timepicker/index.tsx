import React, { ComponentProps, useState } from 'react';
import * as S from './Timepicker.styled';
import { ColorsKey } from '@/styles/theme';
import Text from '../Text';

interface TimePickerProps extends ComponentProps<'input'> {
  color: ColorsKey;
}

const hourOptions = Array.from({ length: 24 }, (_, i) => {
  const hour = String(i).padStart(2, '0');
  return hour;
});

const minuteOptions = ['00', '30'];

const TimePicker = ({ color = 'gray10', ...props }: TimePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedHour, setSelectedHour] = useState<string | null>(null);
  const [selectedMinute, setSelectedMinute] = useState<string | null>(null);
  const toggleOpen = () => {
    setIsOpen((prev) => !prev);
  };

  const selectHour = (hour: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedHour(hour);
    setIsOpen(false);
  };

  const selectMinute = (minute: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedMinute(minute);
    setIsOpen(false);
  };

  return (
    <S.Container role="combobox" color={color} onClick={toggleOpen} {...props}>
      <S.Wrapper>
        <S.TimeWrapper>
          <Text variant="body">{selectedHour || '00'}</Text>
          <Text variant="body">:</Text>
          <Text variant="body">{selectedMinute || '00'}</Text>
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
          <S.ListItemWrapper>
            {minuteOptions.map((time) => (
              <S.ListItem key={time} role="option" onClick={(e) => selectMinute(time, e)}>
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
