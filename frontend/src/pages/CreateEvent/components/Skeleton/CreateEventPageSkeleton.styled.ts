import { shimmerStyle } from '@/shared/components/Skeleton/Shimmer.styled';
import styled from '@emotion/styled';

export const CalendarContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--gap-9);
  padding: ${({ theme }) => (theme.isMobile ? 'var(--padding-8)' : 'var(--padding-10)')};
  border-radius: var(--radius-6);
  box-shadow: var(--shadow-card);
  background-color: ${({ theme }) => theme.colors.background};
`;

export const TextWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--gap-4);
`;

export const CalendarWrapper = styled.div`
  max-width: 100%;
  max-height: 670px;
`;

export const CalendarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

export const Calendar = styled.div`
  height: 28rem;
  max-height: 670px;
  border-radius: var(--radius-4);
  ${shimmerStyle};
`;

export const BasicSettingsContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => (theme.isMobile ? 'var(--gap-10)' : 'var(--gap-8)')};
  padding: ${({ theme }) => (theme.isMobile ? 'var(--padding-8)' : 'var(--padding-10)')};
  border-radius: var(--radius-6);
  max-width: 50rem;
  box-shadow: var(--shadow-card);
  background-color: ${({ theme }) => theme.colors.background};
`;

export const InfoWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => (theme.isMobile ? 'var(--gap-7)' : 'var(--gap-5)')};
`;

export const Label = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-top: 0.125rem;
  gap: var(--gap-3);
`;
