import { ComponentProps } from 'react';
import * as S from './DatePicker.styled';

interface DatePickerProps extends Omit<ComponentProps<'input'>, 'type'> {
  isError?: boolean;
}

const DatePicker = ({ isError = false, ...props }: DatePickerProps) => {
  const date = props.value ?? new Date().toISOString().substring(0, 10);

  return (
    <S.Container
      type="date"
      value={date}
      onClick={(e) => e.currentTarget.showPicker()}
      isError={isError}
      {...props}
    />
  );
};

export default DatePicker;
