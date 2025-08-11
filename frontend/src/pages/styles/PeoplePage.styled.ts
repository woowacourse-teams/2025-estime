import styled from '@emotion/styled';

export const Container = styled.div`
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gird-template-rows: repeat(2, 1fr);
  gap: 2.5rem;
  padding: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(1, 1fr);
    grid-template-rows: repeat(8, 1fr);
  }
`;

export const Person = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--gap-6);
`;
export const Image = styled.img`
  width: 250px;
  height: 250px;
  border-radius: 50%;
`;
export const Link = styled.a`
  display: flex;
  align-items: center;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;
