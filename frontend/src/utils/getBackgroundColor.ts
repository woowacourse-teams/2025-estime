import { Theme } from '../styles/theme';

interface GetHeaderCellBackgroundColorParams {
  selectedTimes: Set<string>;
  date: string;
  timeText: string;
  theme: Theme;
}
interface GetHeatMapCellBackgroundColorParams {
  theme: Theme;
  isHeader: boolean;
  weight: number;
}

export const getHeaderCellBackgroundColor = ({
  selectedTimes,
  date,
  timeText,
  theme,
}: GetHeaderCellBackgroundColorParams) => {
  if (timeText === 'Dates') {
    return theme.colors.background;
  }

  if (selectedTimes.has(`${date}T${timeText}`)) {
    return theme.colors.primary;
  }

  return theme.colors.gray10;
};

export const getHeatMapCellBackgroundColor = ({
  theme,
  isHeader,
  weight,
}: GetHeatMapCellBackgroundColorParams) => {
  if (isHeader) return theme.colors.background;

  if (weight > 0) return hexToRgba(theme.colors.primary, weight);

  return theme.colors.gray10;
};

// parseInt는 두번째 인자로 진수(base)를 받습니다.
// 16진수 문자열을 정수로 변환할 때는 16을 사용합니다.
// hexToRgba 함수는 16진수 색상 문자열을 rgba 형식으로 변환합니다.
// https://stackoverflow.com/a/28056903
function hexToRgba(hex: string, alpha: number) {
  var r = parseInt(hex.slice(1, 3), 16),
    g = parseInt(hex.slice(3, 5), 16),
    b = parseInt(hex.slice(5, 7), 16);

  if (alpha) {
    return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')';
  } else {
    return 'rgb(' + r + ', ' + g + ', ' + b + ')';
  }
}
