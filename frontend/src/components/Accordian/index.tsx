import React from 'react';
import * as S from './Accordian.styled';
import Text from '../Text';

interface AccordionProps {
  children: React.ReactNode;
  title: string;
  isOpen: boolean;
  onToggle: () => void;
}

const Accordion = ({ title, children, isOpen, onToggle }: AccordionProps) => {
  return (
    <S.Container>
      <S.Header onClick={onToggle}>
        <Text variant={'h3'}>{title}</Text>
        <S.Icon src="down-arrow.svg" alt="down-arrow-icon" isOpen={isOpen} />
      </S.Header>
      <S.Content isOpen={isOpen}>{children}</S.Content>
    </S.Container>
  );
};

export default Accordion;
