import styled from '@emotion/styled';

export const CreditCardsContainer = styled.div`
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(2, 1fr);
  padding: 1.5rem 0;
  gap: 4rem;
  @media (max-width: 768px) {
    grid-template-columns: repeat(1, 1fr);
  }
`;
