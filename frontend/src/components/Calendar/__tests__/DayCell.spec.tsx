import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider } from '@emotion/react';
import DayCell from '../DayCell';
import { LIGHT_THEME } from '@/styles/theme';

describe('DayCell는', () => {
  const mockHandleMouseDown = jest.fn();
  const mockHandleMouseEnter = jest.fn();
  const mockHandleMouseUp = jest.fn();

  // 고정된 "오늘" 날짜 설정 (2024년 1월 20일 토요일)
  const fixedToday = new Date(2024, 0, 20);

  const defaultProps = {
    today: fixedToday,
    selectedDates: new Set<string>(),
    handleMouseDown: mockHandleMouseDown,
    handleMouseEnter: mockHandleMouseEnter,
    handleMouseUp: mockHandleMouseUp,
  };

  const renderDayCell = (props: any) => {
    return render(
      <ThemeProvider theme={LIGHT_THEME}>
        <DayCell {...defaultProps} {...props} />
      </ThemeProvider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('기본 렌더링 시', () => {
    it('일반적인 미래 날짜를 올바르게 렌더링한다', () => {
      const futureDay = new Date(2024, 0, 25);

      renderDayCell({ day: futureDay });

      expect(screen.getByText('25')).toBeInTheDocument();
    });

    it('빈 날짜(null)를 렌더링할 때 빈 문자열을 표시한다', () => {
      const { container } = renderDayCell({ day: null });

      const dayCell = container.firstChild as HTMLElement;
      expect(dayCell).toHaveTextContent('');
    });

    it('오늘 날짜에 border가 적용된다', () => {
      renderDayCell({ day: fixedToday }); // 2024-01-20 (오늘)

      const dayCell = screen.getByText('20');
      expect(dayCell).toHaveStyle(`border: 2px solid ${LIGHT_THEME.colors.primary}`);
    });

    it('선택된 날짜에 배경색과 변형이 적용된다', () => {
      const selectedDay = new Date(2024, 0, 25);
      const selectedDates = new Set(['2024-01-25']);

      renderDayCell({ day: selectedDay, selectedDates });

      const dayCell = screen.getByText('25');
      expect(dayCell).toHaveStyle(`background-color: ${LIGHT_THEME.colors.primary}`);
      expect(dayCell).toHaveStyle(`color: ${LIGHT_THEME.colors.background}`);
      expect(dayCell).toHaveStyle('transform: scale(1.05)');
    });
  });

  describe('요일별 스타일링 시', () => {
    it('일요일은 빨간색으로 표시된다', () => {
      const sunday = new Date(2024, 0, 21); // 2024년 1월 21일 (일요일, 미래)

      renderDayCell({ day: sunday });

      const dayCell = screen.getByText('21');
      expect(dayCell).toHaveStyle(`color: ${LIGHT_THEME.colors.red40}`);
      expect(dayCell).toHaveStyle('font-weight: 400');
    });

    it('토요일은 굵은 글씨로 표시된다', () => {
      const saturday = new Date(2024, 0, 27); // 2024년 1월 27일 (토요일, 미래)

      renderDayCell({ day: saturday });

      const dayCell = screen.getByText('27');
      expect(dayCell).toHaveStyle('font-weight: 600');
      expect(dayCell).toHaveStyle(`color: ${LIGHT_THEME.colors.text}`);
    });

    it('오늘이 토요일이면 굵은 글씨로 표시된다', () => {
      renderDayCell({ day: fixedToday }); // 2024-01-20 (토요일, 오늘)

      const dayCell = screen.getByText('20');
      expect(dayCell).toHaveStyle('font-weight: 600');
      expect(dayCell).toHaveStyle(`color: ${LIGHT_THEME.colors.text}`);
    });

    it('평일은 기본 스타일로 표시된다', () => {
      const monday = new Date(2024, 0, 22); // 2024년 1월 22일 (월요일, 미래)

      renderDayCell({ day: monday });

      const dayCell = screen.getByText('22');
      expect(dayCell).toHaveStyle(`color: ${LIGHT_THEME.colors.text}`);
      expect(dayCell).toHaveStyle('font-weight: 400');
    });
  });

  describe('과거 날짜 스타일링', () => {
    it('과거 날짜는 회색으로 표시된다', () => {
      const pastDay = new Date(2024, 0, 15); // 2024년 1월 15일 (월요일, 과거)

      renderDayCell({ day: pastDay });

      const dayCell = screen.getByText('15');
      expect(dayCell).toHaveStyle(`color: ${LIGHT_THEME.colors.gray20}`);
    });

    it('과거의 일요일은 회색으로 표시된다 (빨간색보다 과거 상태가 우선)', () => {
      const pastSunday = new Date(2024, 0, 14); // 2024년 1월 14일 (일요일, 과거)

      renderDayCell({ day: pastSunday });

      const dayCell = screen.getByText('14');
      expect(dayCell).toHaveStyle(`color: ${LIGHT_THEME.colors.gray20}`);
    });

    it('과거의 토요일은 회색으로 표시되고 굵은 글씨는 유지된다', () => {
      const pastSaturday = new Date(2024, 0, 13); // 2024년 1월 13일 (토요일, 과거)

      renderDayCell({ day: pastSaturday });

      const dayCell = screen.getByText('13');
      expect(dayCell).toHaveStyle(`color: ${LIGHT_THEME.colors.gray20}`);
      expect(dayCell).toHaveStyle('font-weight: 600');
    });
  });

  describe('선택된 날짜의 우선순위', () => {
    it('선택된 오늘 날짜는 선택 스타일이 최우선한다', () => {
      const selectedDates = new Set(['2024-01-20']);

      renderDayCell({ day: fixedToday, selectedDates }); // 오늘이면서 선택된 토요일

      const dayCell = screen.getByText('20');
      expect(dayCell).toHaveStyle(`color: ${LIGHT_THEME.colors.background}`);
      expect(dayCell).toHaveStyle(`background-color: ${LIGHT_THEME.colors.primary}`);
      expect(dayCell).toHaveStyle('border: none'); // 선택되면 border 없음
    });

    it('선택된 일요일은 선택 스타일이 빨간색보다 우선한다', () => {
      const sunday = new Date(2024, 0, 21); // 2024년 1월 21일 (일요일, 미래)
      const selectedDates = new Set(['2024-01-21']);

      renderDayCell({ day: sunday, selectedDates });

      const dayCell = screen.getByText('21');
      expect(dayCell).toHaveStyle(`color: ${LIGHT_THEME.colors.background}`);
      expect(dayCell).toHaveStyle(`background-color: ${LIGHT_THEME.colors.primary}`);
    });

    it('선택된 과거 날짜도 선택 스타일이 회색보다 우선한다', () => {
      const pastDay = new Date(2024, 0, 15); // 2024년 1월 15일 (과거)
      const selectedDates = new Set(['2024-01-15']);

      renderDayCell({ day: pastDay, selectedDates });

      const dayCell = screen.getByText('15');
      expect(dayCell).toHaveStyle(`color: ${LIGHT_THEME.colors.background}`);
      expect(dayCell).toHaveStyle(`background-color: ${LIGHT_THEME.colors.primary}`);
    });
  });

  describe('실제 날짜 계산 로직', () => {
    it('날짜가 실제로 과거인지 올바르게 판단한다', () => {
      const pastDay = new Date(2024, 0, 10); // 확실히 과거
      const futureDay = new Date(2024, 0, 30); // 확실히 미래

      renderDayCell({ day: pastDay });
      const pastDayCell = screen.getByText('10');
      expect(pastDayCell).toHaveStyle(`color: ${LIGHT_THEME.colors.gray20}`);

      renderDayCell({ day: futureDay });
      const futureDayCell = screen.getByText('30');
      expect(futureDayCell).toHaveStyle(`color: ${LIGHT_THEME.colors.text}`);
    });

    it('실제 요일을 올바르게 계산한다', () => {
      // 2024년 1월의 실제 요일들 확인
      const sunday = new Date(2024, 0, 7);
      const saturday = new Date(2024, 0, 6);
      const monday = new Date(2024, 0, 8);

      renderDayCell({ day: sunday });
      // 일요일은 토요일보다 과거이므로 회색으로 표시된다
      expect(screen.getByText('7')).toHaveStyle(`color: ${LIGHT_THEME.colors.gray20}`);

      renderDayCell({ day: saturday });
      expect(screen.getByText('6')).toHaveStyle('font-weight: 600');

      renderDayCell({ day: monday });
      expect(screen.getByText('8')).toHaveStyle('font-weight: 400');
    });

    it('선택된 날짜 형식을 올바르게 처리한다', () => {
      const testDay = new Date(2024, 0, 25);
      const selectedDates = new Set(['2024-01-25']); // YYYY-MM-DD 형식

      renderDayCell({ day: testDay, selectedDates });

      const dayCell = screen.getByText('25');
      expect(dayCell).toHaveStyle(`background-color: ${LIGHT_THEME.colors.primary}`);
    });
  });
});
