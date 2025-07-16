import React, { ComponentProps } from 'react';
import * as S from './Radio.styled';

interface RadioProps extends ComponentProps<'input'> {
  children: React.ReactNode;
}

const Radio = ({ children, value, name, checked, onChange, ...props }: RadioProps) => {
  return (
    <S.Label>
      <S.Input
        type="radio"
        value={value}
        name={name}
        checked={checked}
        onChange={onChange}
        {...props}
      />
      <S.Content>{children}</S.Content>
    </S.Label>
  );
};

export default Radio;
