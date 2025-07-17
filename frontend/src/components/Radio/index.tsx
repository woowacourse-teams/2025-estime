import { ComponentProps, ReactNode, useId } from 'react';
import * as S from './Radio.styled';

interface RadioProps extends Omit<ComponentProps<'input'>, 'type'> {
  children: ReactNode;
}

const Radio = ({ children, ...props }: RadioProps) => {
  const autoId = useId();
  const inputId = props.id ?? autoId;

  return (
    <S.Container>
      <S.Input type="radio" id={inputId} {...props} />
      <S.Label htmlFor={inputId}>{children}</S.Label>
    </S.Container>
  );
};

export default Radio;
