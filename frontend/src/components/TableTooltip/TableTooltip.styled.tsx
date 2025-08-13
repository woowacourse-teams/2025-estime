import styled from '@emotion/styled';
import { zIndex } from '@/constants/styles';

function getGridTemplateColumns(participants: number) {
  if (participants <= 4) return 'minmax(0, 1fr)';
  if (participants <= 12) return 'repeat(2, minmax(0, 1fr))';
  return 'repeat(3, minmax(0, 1fr))';
}

export const Container = styled.div<{
  x: number;
  y: number;
}>`
  position: fixed;
  transform: translate(-50%, -120%);
  top: ${({ y }) => y}px;
  left: ${({ x }) => x}px;
  padding: var(--padding-6) var(--padding-8);
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.gray20};
  background-color: ${({ theme }) => theme.colors.gray10};
  z-index: ${zIndex.tooltip};
  pointer-events: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  max-width: 300px;
  width: max-content;

  ::before {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 9px solid transparent;
    border-right: 9px solid transparent;
    border-top: 9px solid ${({ theme }) => theme.colors.gray20};
    z-index: 1;
  }

  ::after {
    content: '';
    position: absolute;
    top: 99%;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-top: 10px solid ${({ theme }) => theme.colors.gray10};
    z-index: 2;
  }
`;
export const ParticipantGrid = styled.div<{ participants: number }>`
  display: grid;
  grid-template-columns: ${({ participants }) => getGridTemplateColumns(participants)};
  grid-template-rows: auto;
  gap: var(--gap-5);
  width: 100%;
  justify-items: center;
  justify-content: center;
`;

export const Person = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 6px;
  width: 100%;
  min-width: 60px;
  max-width: 80px;

  & > svg {
    width: 16px;
    height: 16px;
    flex: 0 0 auto;
  }

  & > span {
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex: 1;
    min-width: 0;
  }
`;
