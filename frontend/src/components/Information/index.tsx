import { ColorsKey } from '@/styles/theme';
import { ComponentProps } from 'react';
import * as S from './Information.styled';

interface InfoProps extends ComponentProps<'div'> {
  size?: 'small' | 'medium' | 'large';
  backgroundColor?: string;
  color: ColorsKey;
  children: React.ReactNode;
}

const Information = ({ size, color, backgroundColor, children, ...props }: InfoProps) => {
  return (
    <S.Container size={size} color={color} backgroundColor={backgroundColor} {...props}>
      {children}
    </S.Container>
  );
};

export default Information;
