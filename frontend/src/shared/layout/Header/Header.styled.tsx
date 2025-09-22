import styled from '@emotion/styled';

export const Container = styled.div`
  width: 100%;
  height: 5rem;
  background-color: ${({ theme }) => theme.colors.background};
  padding: 0 var(--padding-7);
`;

export const Content = styled.div`
  max-width: 1280px;
  height: inherit;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: var(--gap-4);
`;

export const LogoWrapper = styled.div`
  position: relative;
  width: 6.25rem;
  height: 2rem;
  transition: all 0.3s ease;

  &::before {
    content: '방 만들기 페이지 이동';
    position: absolute;
    top: 50%;
    left: calc(100% + 10px); /* 본문과 로고 사이 간격 */
    transform: translateY(-50%) scale(0.98);
    opacity: 0;
    padding: var(--padding-4);
    background-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.background};
    border-radius: var(--radius-4);
    white-space: nowrap;
    width: max-content;
    pointer-events: none;
    transition:
      opacity 0.2s ease,
      transform 0.2s ease;

    box-shadow: 0 0 0 1px ${({ theme }) => theme.colors.gray30};
  }

  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 100%;
    transform: translate(2px, -50%) scale(0.98); /* 2px만큼 띄워 박스와 자연스럽게 연결 */
    width: 0;
    height: 0;
    border-top: 6px solid transparent;
    border-bottom: 6px solid transparent;
    border-right: 8px solid ${({ theme }) => theme.colors.primary};
    opacity: 0;

    filter: drop-shadow(0 0 0 ${({ theme }) => theme.colors.gray30});
  }

  &:hover::before {
    opacity: 1;
    transform: translateY(-50%) translateX(0) scale(1);
  }
  &:hover::after {
    opacity: 1;
    transform: translate(2px, -50%) scale(1);
  }
`;
