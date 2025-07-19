import styled from '@emotion/styled';
import { ColorsKey } from '@/styles/theme';

export const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--gap-6);
  border: 1px solid ${({ theme }) => theme.colors.gray20};
  padding: var(--padding-10);
  border-radius: var(--radius-6);
  max-width: 50rem;
  box-shadow: 0px 10px 30px rgba(33, 33, 33, 0.15);
  background-color: ${({ theme }) => theme.colors.background};
`;

export const TextWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--gap-4);
`;

export const InfoWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--gap-5);
`;

export const InputWrapper = styled.div`
  width: 100%;
`;

export const ButtonWrapper = styled.div`
  display: flex;
  gap: var(--gap-5);
  padding: var(--padding-1);
  width: 100%;
`;

export const ImageWrapper = styled.div<{ color: ColorsKey }>`
  width: 1.5rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
  }

  svg {
    color: ${({ theme, color }) => theme.colors[color]};
  }
`;

export const CustomTimeWrapper = styled.div<{ selected: ('day' | 'night' | 'custom')[] }>`
  display: flex;
  width: 100%;
  gap: var(--gap-5);
  label {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  visibility: ${({ selected }) => (selected ? 'visible' : 'hidden')};
  transition: all 0.3s ease;
`;

export const Label = styled.label`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-top: 0.125rem;
`;
