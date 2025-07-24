import styled from '@emotion/styled';

export const Container = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--gap-9);
  border: 1px solid ${({ theme }) => theme.colors.gray20};
  padding: var(--padding-10);
  border-radius: var(--radius-6);
  box-shadow: var(--shadow-card);
  background-color: ${({ theme }) => theme.colors.background};
  // 레이아웃이 채워지면 지울 예정
  height: 600px;
`;
