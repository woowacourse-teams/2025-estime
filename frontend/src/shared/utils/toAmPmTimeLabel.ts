export const toAmPmTimeLabel = (time: string | null) => {
  if (!time) return '영영시 영영분';

  const hourNum = Number(time.split(':')[0]);

  const amPm = hourNum < 12 ? '오전' : '오후';
  const hour12Format = hourNum % 12 === 0 ? 12 : hourNum % 12;

  const hourLabel: Record<number, string> = {
    1: '한',
    2: '두',
    3: '세',
    4: '네',
    5: '다섯',
    6: '여섯',
    7: '일곱',
    8: '여덟',
    9: '아홉',
    10: '열',
    11: '열한',
    12: '열두',
  };

  const hourWord = hourLabel[hour12Format];

  return `${amPm} ${hourWord}시`;
};
