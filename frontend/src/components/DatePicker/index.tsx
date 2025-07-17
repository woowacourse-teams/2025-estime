import { ComponentProps } from 'react';
import { Container } from './DatePicker.styled';

interface DatePickerProps extends Omit<ComponentProps<'input'>, 'type'> {
  isError?: boolean;
}

const DatePicker = ({ isError = false, ...props }: DatePickerProps) => {
  const date = props.value ?? new Date().toISOString().substring(0, 10);

  return <Container type="date" value={date} isError={isError} {...props} />;
};

export default DatePicker;
