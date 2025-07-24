import React from 'react';
import * as S from './Tooltip.styled';
import Text from '@/components/Text';

export interface TooltipProps {
  children: React.ReactNode;
  content: string;
}

function Tooltip({ children, content }: TooltipProps) {
  return (
    <S.TooltipContainer>
      {children}
      <S.TooltipContent>
        <Text variant="caption" color="background">
          {content}
        </Text>
      </S.TooltipContent>
    </S.TooltipContainer>
  );
}

export default Tooltip;
