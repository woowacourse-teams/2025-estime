import styled from '@emotion/styled';

export const Container = styled.div<{ opacity: number }>`
  width: 60%;
  min-height: 150px;
  margin: 0 auto;
  padding: 20px 28px;

  display: flex;
  flex-direction: column;
  gap: 15px;

  opacity: ${({ opacity }) => opacity};
  visibility: ${({ opacity }) => (opacity ? 'visible' : 'hidden')};
  transition: opacity 0.2s ease;

  border-radius: 20px;
  border: 2px solid rgba(255, 255, 255, 0.7);
  background: linear-gradient(
    359deg,
    rgba(255, 255, 255, 0.33) 106.72%,
    rgba(255, 255, 255, 0.33) 106.73%
  );
  backdrop-filter: blur(20px);

  @media (max-width: 768px) {
    width: 90%;
    min-height: 90px;
    padding: 14px 16px;
    gap: 10px;
  }
`;

export const Highlight = styled.div<{ opacity: number }>`
  display: flex;
  align-items: center;
  border-radius: 10px;
  padding: 10px;
  background-color: ${({ theme }) => theme.colors.orange40};
  opacity: ${({ opacity }) => opacity};
`;

export const ParticipantList = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: ${({ theme }) => (theme.isMobile ? '6px' : '10px')};
  margin-top: 4px;
  overflow-y: auto;
  min-height: ${({ theme }) => (theme.isMobile ? '100px' : '120px')};
  max-height: ${({ theme }) => (theme.isMobile ? '120px' : 'auto')};
  padding-right: 6px;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
  touch-action: pan-y;
  pointer-events: ${({ theme }) => (theme.isMobile ? ' auto' : 'none')};

  &::-webkit-scrollbar {
    width: 5px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.15);
    border-radius: 4px;
  }
`;

export const Participant = styled.span<{ active: boolean }>`
  padding: ${({ theme }) => (theme.isMobile ? '3px 6px' : '8px 10px')};
  border-radius: 8px;
  display: flex;
  align-items: center;

  background: ${({ active }) => (active ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.15)')};
  color: ${({ active }) => (active ? 'rgba(0,0,0,0.95)' : 'rgba(0,0,0,0.4)')};
  text-decoration: ${({ active }) => (active ? 'none' : 'line-through')};
  border: 2px solid
    ${({ active, theme }) => (active ? theme.colors.orange30 : 'rgba(255,255,255,0.15)')};

  text-decoration-thickness: 2px;
  word-break: keep-all;
`;
