import styled from '@emotion/styled';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
`;

const Weekday = styled.span`
  font-weight: 500; /* Tailwind font-medium */
`;

const DayCell = styled.div<{ dimmed: boolean }>`
  height: 2rem; /* Tailwind h-8   */
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ dimmed }) => (dimmed ? '#9ca3af' : 'inherit')}; /* Tailwind text-gray-400 */
`;

export { Grid, Weekday, DayCell };
