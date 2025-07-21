import React from 'react';
import * as S from './Accordion.styled';
import Text from '../Text';
import ArrowButton from '../ArrowButton';

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
        <ArrowButton isOpen={isOpen} />
      </S.Header>
      <S.Content isOpen={isOpen}>{children}</S.Content>
    </S.Container>
  );
};

export default Accordion;
