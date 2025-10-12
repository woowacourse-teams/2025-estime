import styled from '@emotion/styled';

export const Container = styled.div<{ opacity: number }>`
  width: ${({ theme }) => (theme.isMobile ? '90%' : '60%')};
  min-height: ${({ theme }) => (theme.isMobile ? '90px' : '150px')};
  margin: 0 auto;
  padding: ${({ theme }) => (theme.isMobile ? '14px 16px' : '20px 28px')};

  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => (theme.isMobile ? '10px' : '15px')};

  opacity: ${({ opacity }) => opacity};
  transition: opacity 0.2s ease;

  border-radius: 20px;
  border: 2px solid rgba(255, 255, 255, 0.7);
  background: linear-gradient(
    359deg,
    rgba(168, 126, 255, 0.17) 106.72%,
    rgba(255, 255, 255, 0.33) 106.73%
  );
  backdrop-filter: blur(10px);
`;

export const Highlight = styled.div<{ opacity: number }>`
  display: ${({ theme }) => (theme.isMobile ? 'none' : 'flex')};
  align-items: center;
  border-radius: 10px;
  padding: 10px;
  background-color: ${({ theme }) => theme.colors.orange40};
  opacity: ${({ opacity }) => opacity};
`;

export const ParticipantList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => (theme.isMobile ? '6px' : '10px')};
  margin-top: 4px;
  overflow-y: auto;
  min-height: ${({ theme }) => (theme.isMobile ? '100px' : '120px')};
  max-height: ${({ theme }) => (theme.isMobile ? '120px' : 'auto')};
  padding-right: 6px;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
  touch-action: pan-y;
  pointer-events: auto; /* 내부 스크롤 가능 */

  &::-webkit-scrollbar {
    width: 5px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.15);
    border-radius: 4px;
  }
`;

export const Participant = styled.span<{ active: boolean }>`
  padding: ${({ theme }) => (theme.isMobile ? '3px 6px' : '4px 8px')};
  border-radius: 8px;
  display: flex;
  align-items: center;

  background: ${({ active }) => (active ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.15)')};
  color: ${({ active }) => (active ? 'rgba(0,0,0,0.95)' : 'rgba(0,0,0,0.4)')};
  text-decoration: ${({ active }) => (active ? 'none' : 'line-through')};
  text-decoration-thickness: 2px;
  word-break: keep-all;

  font-size: ${({ theme }) => (theme.isMobile ? '12px' : '14px')};
`;
