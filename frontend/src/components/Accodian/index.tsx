import React from 'react';
import * as S from './Accodion.styled';
import Text from '../Text';

interface AccodianProps {
  children: React.ReactNode;
  title: string;
  isOpen: boolean;
  onToggle: () => void;
}

const Accodion = ({ title, children, isOpen, onToggle }: AccodianProps) => {
  return (
    <S.Container>
      <S.Header>
        <Text variant={'h3'}>{title}</Text>
        <S.Icon src="down-arrow.svg" alt="down-arrow-icon" isOpen={isOpen} onClick={onToggle} />
      </S.Header>
      <S.Content isOpen={isOpen}>{children}</S.Content>
    </S.Container>
  );
};

export default Accodion;
