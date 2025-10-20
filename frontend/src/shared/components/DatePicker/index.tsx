import { ComponentProps } from 'react';
import * as S from './DatePicker.styled';

interface DatePickerProps extends Omit<ComponentProps<'input'>, 'type'> {
  isError?: boolean;
}

const DatePicker = ({ isError = false, ...props }: DatePickerProps) => {
  const date = props.value ?? new Date().toISOString().substring(0, 10);

  return (
    <>
      <S.Container
        type="date"
        value={date}
        onClick={(e) => e.currentTarget.showPicker()}
        min={new Date().toISOString().split('T')[0]}
        isError={isError}
        aria-describedby="dateHint"
        {...props}
      />
      <S.HintA11y id="dateHint">
        방향키 위아래로 연, 월, 일을 변경할 수 있습니다. 또는 스페이스바를 눌러 달력을 띄울 수
        있습니다.
      </S.HintA11y>
    </>
  );
};

export default DatePicker;
