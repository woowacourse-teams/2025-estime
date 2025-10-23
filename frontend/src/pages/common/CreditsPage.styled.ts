import styled from '@emotion/styled';

export const Container = styled.div`
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

export const Person = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--gap-6);
  padding: 1rem;
  border-radius: 16px;
  background: ${({ theme }) =>
    `linear-gradient(180deg,
      color-mix(in srgb, ${theme.colors.plum50} 12%, transparent),
      color-mix(in srgb, ${theme.colors.plum50} 4%, transparent)
    )`};
  border: ${({ theme }) =>
    `1px solid color-mix(in srgb, ${theme.colors.primary} 15%, transparent)`};
  transition:
    transform 160ms ease,
    box-shadow 160ms ease,
    border-color 160ms ease;
  box-shadow: 0 0 0 rgba(0, 0, 0, 0);

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
    border-color: ${({ theme }) => `color-mix(in srgb, ${theme.colors.primary} 30%, transparent)`};
  }
`;
export const Avatar = styled.div`
  width: 180px;
  height: 180px;
  border-radius: 50%;
  padding: 3px;
  background: ${({ theme }) =>
    `linear-gradient(135deg, ${theme.colors.plum50} 0%, ${theme.colors.orange30} 100%)`};
  display: inline-flex;
`;

export const Image = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
`;

export const Link = styled.a`
  text-decoration: none;
  color: inherit;
`;
export const Icon = styled.div`
  width: 1.5rem;
  height: 1.5rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 0;
  overflow: hidden;
  flex: 0 0 auto;
`;
